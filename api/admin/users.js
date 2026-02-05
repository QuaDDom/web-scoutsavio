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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = await verifyAdmin(token);
  if (!user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { search = '' } = req.query;

    let query = supabase
      .from('users')
      .select('*, user_progressions(*), user_specialties(*)')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query.limit(50);
    if (error) throw error;

    return res.status(200).json({ users: data });
  } catch (error) {
    return res.status(500).json({ users: [], error: error.message });
  }
}
