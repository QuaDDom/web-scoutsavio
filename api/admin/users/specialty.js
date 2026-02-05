import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ADMIN_EMAILS = ['scoutsavio331@gmail.com', 'matquadev@gmail.com'];

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = await verifyAdmin(token);
  if (!user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { userId, specialty } = req.body;

    const { error } = await supabase.from('user_specialties').insert({
      user_id: userId,
      specialty_id: specialty.specialty_id,
      specialty_name: specialty.specialty_name,
      level: specialty.level || 'basic',
      achieved_at: new Date().toISOString()
    });

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
