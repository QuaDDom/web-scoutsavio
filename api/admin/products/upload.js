import { supabaseAdmin } from '../../lib/supabase.js';
import { verifyAdmin, setCorsHeaders } from '../../lib/auth.js';
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
      maxFileSize: 5 * 1024 * 1024, // 5MB per image
      keepExtensions: true
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin auth
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return res.status(401).json({ error: 'Unauthorized', details: auth.error });
  }

  try {
    const { fields, files } = await parseForm(req);

    // Get product ID if updating existing product
    const productId = Array.isArray(fields.product_id) ? fields.product_id[0] : fields.product_id;

    // Get files array
    let fileList = files.images || files.file;
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

    if (fileList.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 images per product' });
    }

    const uploadedUrls = [];
    const uploadFolder = productId || `temp_${Date.now()}`;

    for (const file of fileList) {
      // Validate file type
      if (!file.mimetype || !file.mimetype.startsWith('image/')) {
        continue;
      }

      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        continue;
      }

      // Read file
      const fileBuffer = fs.readFileSync(file.filepath);

      // Generate unique name
      const fileExt = file.originalFilename?.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `products/${uploadFolder}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('product-images')
        .upload(filePath, fileBuffer, {
          contentType: file.mimetype,
          cacheControl: '31536000', // 1 year cache
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage.from('product-images').getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        uploadedUrls.push(urlData.publicUrl);
      }

      // Clean up temp file
      try {
        fs.unlinkSync(file.filepath);
      } catch (e) {
        // Ignore cleanup error
      }
    }

    if (uploadedUrls.length === 0) {
      return res.status(400).json({ error: 'No files could be uploaded' });
    }

    return res.status(200).json({
      success: true,
      urls: uploadedUrls,
      message: `${uploadedUrls.length} image(s) uploaded successfully`
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
