import { supabaseAdmin } from '../lib/supabase.js';
import { verifyAdmin, setCorsHeaders } from '../lib/auth.js';
import { notifyUserApproved } from '../lib/email.js';

export default async function handler(req, res) {
  // Handle CORS
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verificar autenticación
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return res.status(401).json({ error: 'Unauthorized', details: auth.error });
  }

  try {
    const { photoId } = req.body;

    if (!photoId) {
      return res.status(400).json({ error: 'Photo ID is required' });
    }

    // Obtener info de la foto antes de aprobar
    const { data: photo, error: fetchError } = await supabaseAdmin
      .from('photos')
      .select('*')
      .eq('id', photoId)
      .single();

    if (fetchError || !photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Aprobar la foto
    const { data, error } = await supabaseAdmin
      .from('photos')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: auth.user.email
      })
      .eq('id', photoId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Error approving photo' });
    }

    // Mover archivo de pending a approved en storage
    const oldPath = photo.image_url.split('/gallery-photos/')[1];
    if (oldPath && oldPath.startsWith('pending/')) {
      const newPath = oldPath.replace('pending/', 'approved/');
      await supabaseAdmin.storage.from('gallery-photos').move(oldPath, newPath);

      // Actualizar URL
      const { data: urlData } = supabaseAdmin.storage.from('gallery-photos').getPublicUrl(newPath);
      await supabaseAdmin
        .from('photos')
        .update({ image_url: urlData.publicUrl, thumbnail_url: urlData.publicUrl })
        .eq('id', photoId);
    }

    // Notificar al usuario (no bloquear si falla)
    try {
      await notifyUserApproved(photo.uploader_email, photo.uploader_name, 1);
    } catch (e) {
      console.error('Email notification failed:', e);
    }

    return res.status(200).json({
      success: true,
      message: 'Photo approved successfully',
      photo: data
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
