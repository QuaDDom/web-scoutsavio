import { supabaseAdmin, ADMIN_EMAILS } from './supabase.js';

// Middleware para verificar autenticación admin
export async function verifyAdmin(req) {
  // Soportar tanto formato Edge (req.headers.get) como Express (req.headers.authorization)
  const authHeader =
    typeof req.headers.get === 'function'
      ? req.headers.get('authorization')
      : req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, error: 'No authorization header' };
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Verificar el token con Supabase
    const {
      data: { user },
      error
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return { authorized: false, error: 'Invalid token' };
    }

    // Verificar si el email está en la lista de admins
    if (!ADMIN_EMAILS.includes(user.email)) {
      return { authorized: false, error: 'Not an admin' };
    }

    return { authorized: true, user };
  } catch (error) {
    return { authorized: false, error: error.message };
  }
}

// Helper para configurar CORS en responses
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Headers CORS (legacy para compatibilidad)
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
