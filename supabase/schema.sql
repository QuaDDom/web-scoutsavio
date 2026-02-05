-- =============================================
-- SQL para configurar la base de datos en Supabase
-- Ejecutar en: https://supabase.com/dashboard/project/_/sql/new
-- =============================================

-- =============================================
-- Tabla de usuarios (scouts)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id UUID UNIQUE, -- ID de Supabase Auth
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  branch TEXT CHECK (branch IN ('manada', 'unidad', 'caminantes', 'rover', null)),
  is_promised BOOLEAN DEFAULT false,
  promise_date DATE,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de progresiones de usuario
CREATE TABLE IF NOT EXISTS user_progressions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  progression_id TEXT NOT NULL, -- ID de la progresión (ej: 'pata-tierna', 'rumbo', etc.)
  progression_name TEXT NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  awarded_by UUID REFERENCES admins(id),
  UNIQUE(user_id, progression_id)
);

-- Tabla de especialidades de usuario
CREATE TABLE IF NOT EXISTS user_specialties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  specialty_id TEXT NOT NULL, -- ID de la especialidad
  specialty_name TEXT NOT NULL,
  level TEXT DEFAULT 'basic' CHECK (level IN ('basic', 'advanced', 'master')),
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  awarded_by UUID REFERENCES admins(id),
  UNIQUE(user_id, specialty_id)
);

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_branch ON users(branch);
CREATE INDEX IF NOT EXISTS idx_user_progressions_user ON user_progressions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_specialties_user ON user_specialties(user_id);

-- Tabla de fotos (actualizada con referencia a usuarios)
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  uploader_id UUID REFERENCES users(id),
  uploader_name TEXT NOT NULL,
  uploader_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  upload_batch_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT
);

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_photos_status ON photos(status);
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- =============================================
-- Políticas de seguridad (RLS)
-- =============================================

-- Habilitar RLS en la tabla photos
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede ver fotos aprobadas
CREATE POLICY "Public can view approved photos"
  ON photos FOR SELECT
  USING (status = 'approved');

-- Política: Cualquiera puede subir fotos
CREATE POLICY "Anyone can upload photos"
  ON photos FOR INSERT
  WITH CHECK (true);

-- Política: Service role puede hacer todo (para las API routes)
CREATE POLICY "Service role has full access"
  ON photos
  USING (auth.role() = 'service_role');

-- Habilitar RLS en la tabla admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Solo service role puede acceder a admins
CREATE POLICY "Service role can access admins"
  ON admins
  USING (auth.role() = 'service_role');

-- =============================================
-- Políticas para usuarios
-- =============================================

-- Habilitar RLS en users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Cualquiera autenticado puede ver perfiles públicos
CREATE POLICY "Anyone can view user profiles"
  ON users FOR SELECT
  USING (true);

-- Usuarios pueden editar su propio perfil
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = auth_id);

-- Insertar usuario cuando se registra
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = auth_id);

-- Habilitar RLS en progressions y specialties
ALTER TABLE user_progressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_specialties ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver progresiones/especialidades
CREATE POLICY "Anyone can view progressions"
  ON user_progressions FOR SELECT USING (true);

CREATE POLICY "Anyone can view specialties"
  ON user_specialties FOR SELECT USING (true);

-- Solo admins pueden insertar/modificar (via service role)
CREATE POLICY "Service can manage progressions"
  ON user_progressions USING (auth.role() = 'service_role');

CREATE POLICY "Service can manage specialties"
  ON user_specialties USING (auth.role() = 'service_role');

-- =============================================
-- Insertar admins iniciales
-- =============================================
INSERT INTO admins (email, name, role) 
VALUES ('scoutsavio331@gmail.com', 'Admin Principal', 'super_admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO admins (email, name, role) 
VALUES ('matquadev@gmail.com', 'Mateo', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- Configurar Storage
-- =============================================
-- Ejecutar desde el SQL Editor de Supabase

-- Crear el bucket (si no existe)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-photos', 'gallery-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Política para que cualquiera pueda subir archivos
CREATE POLICY "Anyone can upload to gallery-photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery-photos');

-- Política para que cualquiera pueda ver archivos
CREATE POLICY "Public can view gallery-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery-photos');

-- Política para que service role pueda eliminar
CREATE POLICY "Service role can delete from gallery-photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery-photos');

-- Política para que service role pueda actualizar/mover
CREATE POLICY "Service role can update gallery-photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery-photos');
