import { supabaseAdmin } from '../../lib/supabase.js';
import { verifyAdmin, corsHeaders } from '../../lib/auth.js';
import { notifyUserRejected } from '../../lib/email.js';

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
    const { photoId, reason } = body;

    if (!photoId) {
      return new Response(JSON.stringify({ error: 'Photo ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Obtener info de la foto antes de rechazar
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
      return new Response(JSON.stringify({ error: 'Error rejecting photo' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Eliminar archivo del storage
    const oldPath = photo.image_url.split('/gallery/')[1];
    if (oldPath) {
      await supabaseAdmin.storage.from('gallery').remove([oldPath]);
    }

    // Notificar al usuario
    await notifyUserRejected(
      photo.uploader_email,
      photo.uploader_name,
      reason || 'No se especificó un motivo'
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Photo rejected successfully',
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
