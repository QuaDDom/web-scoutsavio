import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, upcoming, featured, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Build query
    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .range(offset, offset + limitNum - 1);

    // Filter by event type
    if (type && type !== 'all') {
      query = query.eq('event_type', type);
    }

    // Filter upcoming/past events
    const now = new Date().toISOString();
    if (upcoming === 'true') {
      query = query.gte('event_date', now).order('event_date', { ascending: true });
    } else if (upcoming === 'false') {
      query = query.lt('event_date', now).order('event_date', { ascending: false });
    } else {
      query = query.order('event_date', { ascending: false });
    }

    // Filter featured events
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Error fetching events' });
    }

    return res.status(200).json({
      events: data || [],
      total: count || 0,
      page: pageNum,
      total_pages: Math.ceil((count || 0) / limitNum)
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
