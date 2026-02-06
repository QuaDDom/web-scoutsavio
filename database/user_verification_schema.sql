-- ============================================
-- Schema para Verificación de Usuarios
-- Grupo Scout 331 Savio
-- ============================================

-- Agregar campo is_verified a la tabla users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Índice para búsquedas rápidas de usuarios no verificados
CREATE INDEX IF NOT EXISTS idx_users_verified ON users(is_verified);

-- Auto-verificar administradores existentes
UPDATE users 
SET is_verified = TRUE 
WHERE email IN (
    'scoutsavio331@gmail.com',
    'matquadev@gmail.com',
    'burgosagostina60@gmail.com',
    'vickyrivero.scout@gmail.com',
    'monjesana@gmail.com',
    'psicocecirodriguez@gmail.com',
    'leitogottero@gmail.com'
);

-- ============================================
-- CAMPOS ADICIONALES PARA BADGES EN FORO
-- ============================================

-- Agregar email del autor a los temas del foro (para mostrar badges)
ALTER TABLE forum_topics ADD COLUMN IF NOT EXISTS author_email VARCHAR(255);

-- Agregar email del autor a las respuestas del foro
ALTER TABLE forum_replies ADD COLUMN IF NOT EXISTS author_email VARCHAR(255);

-- ============================================
-- MODIFICACIONES PARA RESPUESTAS ANIDADAS
-- ============================================

-- Agregar campo parent_reply_id para respuestas anidadas
ALTER TABLE forum_replies ADD COLUMN IF NOT EXISTS parent_reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE;

-- Agregar campo depth para controlar niveles de anidación
ALTER TABLE forum_replies ADD COLUMN IF NOT EXISTS depth INTEGER DEFAULT 0;

-- Agregar campo likes_count a las respuestas
ALTER TABLE forum_replies ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Índice para respuestas anidadas
CREATE INDEX IF NOT EXISTS idx_forum_replies_parent ON forum_replies(parent_reply_id);

-- Tabla de likes para respuestas
CREATE TABLE IF NOT EXISTS forum_reply_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reply_id UUID NOT NULL REFERENCES forum_replies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(reply_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reply_likes_reply ON forum_reply_likes(reply_id);
CREATE INDEX IF NOT EXISTS idx_reply_likes_user ON forum_reply_likes(user_id);

-- Función para incrementar likes de respuesta
CREATE OR REPLACE FUNCTION increment_reply_likes_count(reply_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE forum_replies
    SET likes_count = likes_count + 1
    WHERE id = reply_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para decrementar likes de respuesta
CREATE OR REPLACE FUNCTION decrement_reply_likes_count(reply_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE forum_replies
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = reply_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
