import { createClient } from '@supabase/supabase-js';

// Cliente público (para operaciones públicas)
export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Cliente con permisos de servicio (para operaciones admin)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Verificar si un email es admin
export async function isAdmin(email) {
  const { data, error } = await supabaseAdmin
    .from('admins')
    .select('id, role')
    .eq('email', email)
    .single();

  if (error || !data) return false;
  return data;
}

// Lista de emails de administradores autorizados
export const ADMIN_EMAILS = ['scoutsavio331@gmail.com', 'matquadev@gmail.com'];
