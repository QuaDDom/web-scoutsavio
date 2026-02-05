-- ============================================
-- Schema para Foro y Notificaciones
-- Grupo Scout 331 Savio
-- ============================================

-- ============================================
-- TABLAS DEL FORO
-- ============================================

-- Tabla de temas del foro
CREATE TABLE IF NOT EXISTS forum_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name VARCHAR(255),
    author_avatar TEXT,
    replies_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de respuestas del foro
CREATE TABLE IF NOT EXISTS forum_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name VARCHAR(255),
    author_avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de likes del foro
CREATE TABLE IF NOT EXISTS forum_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(topic_id, user_id)
);

-- ============================================
-- TABLA DE NOTIFICACIONES
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL = para todos
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general', -- general, payment, document, permission, urgent, activity
    attachments JSONB DEFAULT '[]'::jsonb, -- Array de {name, url, type, size}
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_forum_topics_author ON forum_topics(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_category ON forum_topics(category);
CREATE INDEX IF NOT EXISTS idx_forum_topics_created ON forum_topics(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_forum_replies_topic ON forum_replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_author ON forum_replies(author_id);

CREATE INDEX IF NOT EXISTS idx_forum_likes_topic ON forum_likes(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_likes_user ON forum_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read_at);

-- ============================================
-- FUNCIONES RPC PARA CONTADORES
-- ============================================

-- Incrementar contador de respuestas
CREATE OR REPLACE FUNCTION increment_replies_count(topic_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE forum_topics
    SET replies_count = replies_count + 1,
        updated_at = NOW()
    WHERE id = topic_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrementar contador de respuestas
CREATE OR REPLACE FUNCTION decrement_replies_count(topic_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE forum_topics
    SET replies_count = GREATEST(replies_count - 1, 0),
        updated_at = NOW()
    WHERE id = topic_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Incrementar contador de likes
CREATE OR REPLACE FUNCTION increment_likes_count(topic_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE forum_topics
    SET likes_count = likes_count + 1
    WHERE id = topic_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrementar contador de likes
CREATE OR REPLACE FUNCTION decrement_likes_count(topic_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE forum_topics
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = topic_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Incrementar contador de vistas
CREATE OR REPLACE FUNCTION increment_views_count(topic_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE forum_topics
    SET views_count = views_count + 1
    WHERE id = topic_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para forum_topics
CREATE POLICY "Los usuarios autenticados pueden ver temas"
    ON forum_topics FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Los usuarios autenticados pueden crear temas"
    ON forum_topics FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios temas"
    ON forum_topics FOR DELETE
    TO authenticated
    USING (auth.uid() = author_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios temas"
    ON forum_topics FOR UPDATE
    TO authenticated
    USING (auth.uid() = author_id);

-- Políticas para forum_replies
CREATE POLICY "Los usuarios autenticados pueden ver respuestas"
    ON forum_replies FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Los usuarios autenticados pueden crear respuestas"
    ON forum_replies FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias respuestas"
    ON forum_replies FOR DELETE
    TO authenticated
    USING (auth.uid() = author_id);

-- Políticas para forum_likes
CREATE POLICY "Los usuarios autenticados pueden ver likes"
    ON forum_likes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Los usuarios autenticados pueden dar likes"
    ON forum_likes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden quitar sus propios likes"
    ON forum_likes FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Políticas para notifications
CREATE POLICY "Los usuarios pueden ver sus notificaciones"
    ON notifications FOR SELECT
    TO authenticated
    USING (
        recipient_id = auth.uid() 
        OR recipient_id IS NULL
    );

CREATE POLICY "Los usuarios pueden actualizar sus notificaciones (marcar leído)"
    ON notifications FOR UPDATE
    TO authenticated
    USING (
        recipient_id = auth.uid() 
        OR recipient_id IS NULL
    );

-- Solo admins pueden crear notificaciones (verificar en la API)
CREATE POLICY "Insertar notificaciones"
    ON notifications FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Solo admins pueden eliminar notificaciones (verificar en la API)
CREATE POLICY "Eliminar notificaciones"
    ON notifications FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- TRIGGER PARA ACTUALIZAR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_forum_topics_updated_at
    BEFORE UPDATE ON forum_topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PERMISOS PARA FUNCIONES RPC
-- ============================================

GRANT EXECUTE ON FUNCTION increment_replies_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_replies_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_likes_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_likes_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_views_count(UUID) TO authenticated;
