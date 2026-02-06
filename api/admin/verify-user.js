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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  const adminUser = await verifyAdmin(token);
  if (!adminUser) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { userId, verified } = req.body;

    if (!userId || typeof verified !== 'boolean') {
      return res.status(400).json({ error: 'Parámetros inválidos' });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ is_verified: verified })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ success: true, user: data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
