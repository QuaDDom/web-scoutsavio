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
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = await verifyAdmin(token);
  if (!user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  if (req.method === 'GET') {
    try {
      const { status = 'all', page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;

      let query = supabase
        .from('photos')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return res.status(200).json({
        photos: data,
        total: count,
        total_pages: Math.ceil(count / limitNum)
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
