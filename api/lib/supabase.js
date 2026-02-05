import { createClient } from '@supabase/supabase-js';

// Validar variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_KEY environment variable');
}

// Cliente público (para operaciones públicas)
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Cliente con permisos de servicio (para operaciones admin)
export const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || '');

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
export const ADMIN_EMAILS = [
  'scoutsavio331@gmail.com',
  'matquadev@gmail.com',
  'burgosagostina60@gmail.com',
  'vickyrivero.scout@gmail.com',
  'monjesana@gmail.com',
  'psicocecirodriguez@gmail.com',
  'leitogottero@gmail.com'
];
