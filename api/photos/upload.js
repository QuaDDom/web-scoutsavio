import { supabaseAdmin } from '../lib/supabase.js';
import { notifyAdminsNewUpload } from '../lib/email.js';
import { corsHeaders } from '../lib/auth.js';

export default async function handler(req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const formData = await req.formData();

    const uploaderName = formData.get('uploader_name');
    const uploaderEmail = formData.get('uploader_email');
    const category = formData.get('category');
    const description = formData.get('description') || '';
    const files = formData.getAll('files');

    // Validaciones
    if (!uploaderName || !uploaderEmail || !category) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (files.length > 10) {
      return new Response(JSON.stringify({ error: 'Maximum 10 files allowed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const uploadedPhotos = [];
    const uploadBatchId = `batch_${Date.now()}`;

    for (const file of files) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        continue;
      }

      // Validar tamaño (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        continue;
      }

      // Generar nombre único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `pending/${uploadBatchId}/${fileName}`;

      // Subir a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('gallery-photos')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      // Obtener URL pública
      const { data: urlData } = supabaseAdmin.storage.from('gallery-photos').getPublicUrl(filePath);

      // Crear registro en la base de datos
      const { data: photoData, error: dbError } = await supabaseAdmin
        .from('photos')
        .insert({
          image_url: urlData.publicUrl,
          thumbnail_url: urlData.publicUrl, // Por ahora usamos la misma URL
          title: file.name.replace(/\.[^/.]+$/, ''), // Nombre sin extensión
          description,
          category,
          uploader_name: uploaderName,
          uploader_email: uploaderEmail,
          status: 'pending',
          upload_batch_id: uploadBatchId
        })
        .select()
        .single();

      if (!dbError && photoData) {
        uploadedPhotos.push(photoData);
      }
    }

    if (uploadedPhotos.length === 0) {
      return new Response(JSON.stringify({ error: 'No files could be uploaded' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Notificar a admins
    await notifyAdminsNewUpload(uploaderName, uploadedPhotos.length, category);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Fotos enviadas correctamente',
        upload_id: uploadBatchId,
        photos_count: uploadedPhotos.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
