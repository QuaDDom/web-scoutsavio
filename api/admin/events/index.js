import { supabaseAdmin } from '../../lib/supabase.js';
import { verifyAdmin, setCorsHeaders } from '../../lib/auth.js';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify admin auth
  const auth = await verifyAdmin(req);
  if (!auth.authorized) {
    return res.status(401).json({ error: 'Unauthorized', details: auth.error });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res, auth);
    case 'PUT':
      return handlePut(req, res, auth);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// GET all events (including unpublished)
async function handleGet(req, res) {
  try {
    const { page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const { data, error, count } = await supabaseAdmin
      .from('events')
      .select('*', { count: 'exact' })
      .order('event_date', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) throw error;

    return res.status(200).json({
      events: data || [],
      total: count || 0,
      page: pageNum,
      total_pages: Math.ceil((count || 0) / limitNum)
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Error fetching events' });
  }
}

// POST create new event
async function handlePost(req, res, auth) {
  try {
    const {
      title,
      subtitle,
      content,
      cover_image,
      images,
      event_date,
      event_type,
      location,
      is_featured,
      is_published
    } = req.body;

    if (!title || !event_date || !event_type) {
      return res.status(400).json({ error: 'Title, event_date and event_type are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .insert({
        title,
        subtitle: subtitle || '',
        content: content || '',
        cover_image: cover_image || null,
        images: images || [],
        event_date,
        event_type,
        location: location || null,
        is_featured: is_featured === true,
        is_published: is_published !== false,
        created_by: auth.user.email
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ event: data, message: 'Event created successfully' });
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ error: 'Error creating event' });
  }
}

// PUT update event
async function handlePut(req, res, auth) {
  try {
    const { id, ...updates } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // Sanitize updates
    const allowedFields = [
      'title',
      'subtitle',
      'content',
      'cover_image',
      'images',
      'event_date',
      'event_type',
      'location',
      'is_featured',
      'is_published'
    ];
    const sanitizedUpdates = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitizedUpdates[field] = updates[field];
      }
    }

    sanitizedUpdates.updated_at = new Date().toISOString();
    sanitizedUpdates.updated_by = auth.user.email;

    const { data, error } = await supabaseAdmin
      .from('events')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ event: data, message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({ error: 'Error updating event' });
  }
}

// DELETE event
async function handleDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    const { error } = await supabaseAdmin.from('events').delete().eq('id', id);

    if (error) throw error;

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ error: 'Error deleting event' });
  }
}
