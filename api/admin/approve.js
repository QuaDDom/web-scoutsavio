import { supabaseAdmin } from '../../lib/supabase.js';
import { verifyAdmin, corsHeaders } from '../../lib/auth.js';
import { notifyUserApproved } from '../../lib/email.js';

export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'PUT') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Verificar autenticación
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return new Response(JSON.stringify({ error: 'Unauthorized', details: auth.error }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { photoId } = body;

    if (!photoId) {
      return new Response(JSON.stringify({ error: 'Photo ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Obtener info de la foto antes de aprobar
    const { data: photo, error: fetchError } = await supabaseAdmin
      .from('photos')
      .select('*')
      .eq('id', photoId)
      .single();

    if (fetchError || !photo) {
      return new Response(JSON.stringify({ error: 'Photo not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
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
      return new Response(JSON.stringify({ error: 'Error approving photo' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Mover archivo de pending a approved en storage
    const oldPath = photo.image_url.split('/gallery/')[1];
    if (oldPath && oldPath.startsWith('pending/')) {
      const newPath = oldPath.replace('pending/', 'approved/');
      await supabaseAdmin.storage.from('gallery').move(oldPath, newPath);

      // Actualizar URL
      const { data: urlData } = supabaseAdmin.storage.from('gallery').getPublicUrl(newPath);
      await supabaseAdmin
        .from('photos')
        .update({ image_url: urlData.publicUrl, thumbnail_url: urlData.publicUrl })
        .eq('id', photoId);
    }

    // Notificar al usuario
    await notifyUserApproved(photo.uploader_email, photo.uploader_name, 1);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Photo approved successfully',
        photo: data
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
