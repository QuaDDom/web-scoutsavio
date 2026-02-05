import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const ADMIN_EMAILS = [
  'scoutsavio331@gmail.com',
  'matquadev@gmail.com',
  'burgosagostina60@gmail.com',
  'vickyrivero.scout@gmail.com',
  'monjesana@gmail.com',
  'psicocecirodriguez@gmail.com',
  'leitogottero@gmail.com'
];

async function verifyAdmin(token) {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  if (!ADMIN_EMAILS.includes(user.email)) return null;
  return user;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = await verifyAdmin(token);
  if (!user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { photoId } = req.body;

    // Obtener la foto para eliminar archivo del storage
    const { data: photo } = await supabase
      .from('photos')
      .select('image_url')
      .eq('id', photoId)
      .single();

    if (photo?.image_url) {
      const filePath = photo.image_url.split('/gallery-photos/')[1];
      if (filePath) {
        await supabase.storage.from('gallery-photos').remove([filePath]);
      }
    }

    // Eliminar registro de la base de datos
    const { error } = await supabase.from('photos').delete().eq('id', photoId);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
