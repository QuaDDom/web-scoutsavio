import { supabaseAdmin } from '../lib/supabase.js';
import { notifyAdminsNewUpload } from '../lib/email.js';
import { IncomingForm } from 'formidable';
import fs from 'fs';

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false
  }
};

// Helper to parse form data
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      multiples: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);

    const uploaderName = Array.isArray(fields.uploader_name)
      ? fields.uploader_name[0]
      : fields.uploader_name;
    const uploaderEmail = Array.isArray(fields.uploader_email)
      ? fields.uploader_email[0]
      : fields.uploader_email;
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description || '';

    // Extraer títulos personalizados del form (titles[0], titles[1], etc.)
    const titles = [];
    Object.keys(fields).forEach((key) => {
      const match = key.match(/^titles\[(\d+)\]$/);
      if (match) {
        const index = parseInt(match[1], 10);
        titles[index] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
      }
    });

    // Validaciones
    if (!uploaderName || !uploaderEmail || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get files array
    let fileList = files.files;
    if (!fileList) {
      return res.status(400).json({ error: 'No files provided' });
    }

    // Ensure it's an array
    if (!Array.isArray(fileList)) {
      fileList = [fileList];
    }

    if (fileList.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    if (fileList.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 files allowed' });
    }

    const uploadedPhotos = [];
    const uploadBatchId = `batch_${Date.now()}`;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // Validar tipo de archivo
      if (!file.mimetype || !file.mimetype.startsWith('image/')) {
        continue;
      }

      // Validar tamaño (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        continue;
      }

      // Leer el archivo
      const fileBuffer = fs.readFileSync(file.filepath);

      // Generar nombre único
      const fileExt = file.originalFilename?.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `pending/${uploadBatchId}/${fileName}`;

      // Subir a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('gallery-photos')
        .upload(filePath, fileBuffer, {
          contentType: file.mimetype,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      // Obtener URL pública
      const { data: urlData } = supabaseAdmin.storage.from('gallery-photos').getPublicUrl(filePath);

      // Usar título personalizado o nombre del archivo
      const photoTitle = titles[i] || file.originalFilename?.replace(/\.[^/.]+$/, '') || 'Photo';

      // Crear registro en la base de datos
      const { data: photoData, error: dbError } = await supabaseAdmin
        .from('photos')
        .insert({
          image_url: urlData.publicUrl,
          thumbnail_url: urlData.publicUrl,
          title: photoTitle,
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

      // Limpiar archivo temporal
      try {
        fs.unlinkSync(file.filepath);
      } catch (e) {
        // Ignorar error de limpieza
      }
    }

    if (uploadedPhotos.length === 0) {
      return res.status(400).json({ error: 'No files could be uploaded' });
    }

    // Notificar a admins (no bloquear si falla)
    try {
      await notifyAdminsNewUpload(uploaderName, uploadedPhotos.length, category);
    } catch (e) {
      console.error('Email notification failed:', e);
    }

    return res.status(200).json({
      success: true,
      message: 'Fotos enviadas correctamente',
      upload_id: uploadBatchId,
      photos_count: uploadedPhotos.length
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
