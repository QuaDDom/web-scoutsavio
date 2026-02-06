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

// GET all products (including inactive)
async function handleGet(req, res) {
  try {
    const { page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const { data, error, count } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) throw error;

    return res.status(200).json({
      products: data || [],
      total: count || 0,
      page: pageNum,
      total_pages: Math.ceil((count || 0) / limitNum)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Error fetching products' });
  }
}

// POST create new product
async function handlePost(req, res, auth) {
  try {
    const {
      name,
      description,
      price,
      discount_percent,
      category,
      sizes,
      stock,
      images,
      is_active
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price and category are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        description: description || '',
        price: parseFloat(price),
        discount_percent: discount_percent ? parseInt(discount_percent) : 0,
        category,
        sizes: sizes || [],
        stock: stock ? parseInt(stock) : 0,
        images: images || [],
        is_active: is_active !== false,
        created_by: auth.user.email
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ product: data, message: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'Error creating product' });
  }
}

// PUT update product
async function handlePut(req, res, auth) {
  try {
    const { id, ...updates } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Sanitize updates
    const allowedFields = [
      'name',
      'description',
      'price',
      'discount_percent',
      'category',
      'sizes',
      'stock',
      'images',
      'is_active'
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
      .from('products')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ product: data, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'Error updating product' });
  }
}

// DELETE product
async function handleDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

    if (error) throw error;

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'Error deleting product' });
  }
}
