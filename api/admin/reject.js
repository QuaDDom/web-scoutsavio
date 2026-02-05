import { supabaseAdmin } from '../lib/supabase.js';
import { verifyAdmin, setCorsHeaders } from '../lib/auth.js';
import { notifyUserRejected } from '../lib/email.js';

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
    const { photoId, reason } = req.body;

    if (!photoId) {
      return res.status(400).json({ error: 'Photo ID is required' });
    }

    // Obtener info de la foto antes de rechazar
    const { data: photo, error: fetchError } = await supabaseAdmin
      .from('photos')
      .select('*')
      .eq('id', photoId)
      .single();

    if (fetchError || !photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Rechazar la foto
    const { data, error } = await supabaseAdmin
      .from('photos')
      .update({
        status: 'rejected',
        rejection_reason: reason || 'No se especificó un motivo',
        reviewed_at: new Date().toISOString(),
        reviewed_by: auth.user.email
      })
      .eq('id', photoId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Error rejecting photo' });
    }

    // Eliminar archivo del storage
    const oldPath = photo.image_url.split('/gallery-photos/')[1];
    if (oldPath) {
      await supabaseAdmin.storage.from('gallery-photos').remove([oldPath]);
    }

    // Notificar al usuario (no bloquear si falla)
    try {
      await notifyUserRejected(
        photo.uploader_email,
        photo.uploader_name,
        reason || 'No se especificó un motivo'
      );
    } catch (e) {
      console.error('Email notification failed:', e);
    }

    return res.status(200).json({
      success: true,
      message: 'Photo rejected successfully',
      photo: data
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
