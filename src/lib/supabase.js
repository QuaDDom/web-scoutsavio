import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Singleton pattern para evitar múltiples instancias de GoTrueClient
// Esto es necesario porque Vite HMR recarga el módulo y crea nuevas instancias
const SUPABASE_KEY = '__supabase_client__';
const SUPABASE_INIT_KEY = '__supabase_initialized__';

function getSupabaseClient() {
  // En desarrollo, reutilizar la instancia global para evitar múltiples clientes
  if (typeof window !== 'undefined') {
    if (!window[SUPABASE_KEY]) {
      window[SUPABASE_KEY] = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'implicit',
          // Evitar problemas de clock skew
          storageKey: 'supabase-auth-token'
        }
      });

      // Limpiar hash de la URL después de procesar el token (solo una vez)
      if (!window[SUPABASE_INIT_KEY] && window.location.hash.includes('access_token')) {
        window[SUPABASE_INIT_KEY] = true;
        // Dar tiempo a que Supabase procese el token antes de limpiar
        setTimeout(() => {
          const url = new URL(window.location.href);
          url.hash = '';
          window.history.replaceState({}, document.title, url.pathname + url.search);
        }, 100);
      }
    }
    return window[SUPABASE_KEY];
  }

  // SSR o entorno sin window
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit'
    }
  });
}

export const supabase = getSupabaseClient();

// Detectar si estamos en producción (Vercel) o desarrollo local
const isProduction = import.meta.env.PROD;

// =============================================
// Servicio de autenticación de usuarios
// =============================================
export const authService = {
  // Obtener sesión actual con timeout
  async getSession() {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Session timeout')), 5000)
      );

      const sessionPromise = supabase.auth.getSession();

      const {
        data: { session },
        error
      } = await Promise.race([sessionPromise, timeoutPromise]);

      if (error) {
        console.error('Error getting session:', error);
        return null;
      }
      return session;
    } catch (err) {
      if (err.message === 'Session timeout') {
        console.warn('Session check timed out');
        localStorage.removeItem('supabase-auth-token');
      }
      return null;
    }
  },

  // Obtener usuario actual con timeout para evitar cuelgues
  async getCurrentUser() {
    try {
      // Timeout de 5 segundos para evitar cuelgues infinitos
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Auth timeout')), 5000)
      );

      const sessionPromise = supabase.auth.getSession();

      const {
        data: { session },
        error
      } = await Promise.race([sessionPromise, timeoutPromise]);

      if (error) {
        console.error('Error getting session:', error);
        // Si hay error de sesión, limpiar el storage corrupto
        if (error.message?.includes('invalid') || error.message?.includes('expired')) {
          localStorage.removeItem('supabase-auth-token');
        }
        return null;
      }

      return session?.user || null;
    } catch (err) {
      if (err.message === 'Auth timeout') {
        console.warn('Auth check timed out, clearing potentially corrupted session');
        // Limpiar sesión potencialmente corrupta
        localStorage.removeItem('supabase-auth-token');
      } else if (err.name !== 'AbortError') {
        console.error('Unexpected error getting user:', err);
      }
      return null;
    }
  },

  // Iniciar sesión con Google
  async signInWithGoogle(redirectPath = '/galeria') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${redirectPath}`
      }
    });
    if (error) throw error;
    return data;
  },

  // Cerrar sesión
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Escuchar cambios de auth
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// =============================================
// Servicio de usuarios (perfiles)
// =============================================
export const userService = {
  // Obtener o crear perfil de usuario
  async getOrCreateProfile(authUser) {
    if (!authUser) return null;

    // Buscar perfil existente
    let { data: profile, error } = await supabase
      .from('users')
      .select('*, user_progressions(*), user_specialties(*)')
      .eq('auth_id', authUser.id)
      .single();

    // Si no existe, crearlo
    if (error && error.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert({
          auth_id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          avatar_url: authUser.user_metadata?.avatar_url || null
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return null;
      }

      profile = newProfile;
    } else if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return profile;
  },

  // Obtener perfil por ID
  async getProfileById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*, user_progressions(*), user_specialties(*)')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  },

  // Actualizar perfil
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true, profile: data };
  },

  // Obtener fotos subidas por un usuario
  async getUserPhotos(userId) {
    try {
      // Buscar por email del usuario en lugar de ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.email) return [];

      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('uploader_email', userData.user.email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user photos:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in getUserPhotos:', err);
      return [];
    }
  }
};

// Funciones helper para la galería
export const galleryService = {
  // Obtener fotos aprobadas
  async getApprovedPhotos(category = null, page = 1, limit = 20) {
    try {
      // En producción usamos la API, en desarrollo usamos Supabase directamente
      if (isProduction) {
        const response = await fetch(
          `/api/photos?${new URLSearchParams({
            ...(category && category !== 'Todos' ? { category } : {}),
            page: page.toString(),
            limit: limit.toString()
          })}`
        );

        if (!response.ok) {
          throw new Error('Error fetching photos');
        }

        return await response.json();
      }

      // Desarrollo: usar Supabase directamente
      let query = supabase
        .from('photos')
        .select('*', { count: 'exact' })
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (category && category !== 'Todos') {
        query = query.eq('category', category);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        photos: data || [],
        total: count || 0,
        page,
        total_pages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Error:', error);
      return { photos: [], total: 0, page: 1, total_pages: 0 };
    }
  },

  // Subir fotos
  async uploadPhotos(files, metadata) {
    try {
      // En producción usamos la API
      if (isProduction) {
        const formData = new FormData();
        formData.append('uploader_name', metadata.name);
        formData.append('uploader_email', metadata.email);
        formData.append('category', metadata.category);
        formData.append('description', metadata.description || '');

        files.forEach((fileObj) => {
          formData.append('files', fileObj.file);
        });

        const response = await fetch('/api/photos/upload', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error uploading photos');
        }

        return { success: true, ...data };
      }

      // Desarrollo: usar Supabase directamente
      const uploadBatchId = crypto.randomUUID();
      const uploadedPhotos = [];

      for (const fileObj of files) {
        const file = fileObj.file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `pending/${fileName}`;

        // Subir archivo a Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gallery-photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Storage error:', uploadError);
          throw new Error(`Error subiendo ${file.name}: ${uploadError.message}`);
        }

        // Obtener URL pública
        const { data: urlData } = supabase.storage.from('gallery-photos').getPublicUrl(filePath);

        // Crear registro en la base de datos
        const { data: photoData, error: dbError } = await supabase
          .from('photos')
          .insert({
            image_url: urlData.publicUrl,
            title: file.name.replace(/\.[^/.]+$/, ''),
            description: metadata.description || '',
            category: metadata.category,
            uploader_name: metadata.name,
            uploader_email: metadata.email,
            status: 'pending',
            upload_batch_id: uploadBatchId
          })
          .select()
          .single();

        if (dbError) {
          console.error('Database error:', dbError);
          throw new Error(`Error guardando ${file.name}: ${dbError.message}`);
        }

        uploadedPhotos.push(photoData);
      }

      return {
        success: true,
        message: 'Fotos subidas correctamente. Serán revisadas antes de publicarse.',
        photos_count: uploadedPhotos.length,
        upload_id: uploadBatchId
      };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Funciones admin
export const adminService = {
  // Obtener fotos pendientes
  async getPendingPhotos(token, page = 1, limit = 20) {
    try {
      // En producción usamos la API
      if (isProduction) {
        const response = await fetch(`/api/admin/pending?page=${page}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error fetching pending photos');
        }

        return await response.json();
      }

      // Desarrollo: usar Supabase directamente
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('photos')
        .select('*', { count: 'exact' })
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        photos: data || [],
        total: count || 0,
        page,
        total_pages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Error:', error);
      return { photos: [], total: 0, page: 1, total_pages: 0 };
    }
  },

  // Aprobar foto
  async approvePhoto(token, photoId) {
    try {
      // En producción usamos la API
      if (isProduction) {
        const response = await fetch('/api/admin/approve', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ photoId })
        });

        const data = await response.json();
        return { success: response.ok, ...data };
      }

      // Desarrollo: usar Supabase directamente
      // Obtener la foto
      const { data: photo, error: fetchError } = await supabase
        .from('photos')
        .select('*')
        .eq('id', photoId)
        .single();

      if (fetchError) throw fetchError;

      // Mover archivo de pending a approved
      const oldPath = photo.image_url.split('/gallery-photos/')[1];
      const newPath = oldPath.replace('pending/', 'approved/');

      const { error: moveError } = await supabase.storage
        .from('gallery-photos')
        .move(oldPath, newPath);

      if (moveError) {
        console.warn('Error moving file:', moveError);
      }

      // Obtener nueva URL
      const { data: urlData } = supabase.storage.from('gallery-photos').getPublicUrl(newPath);

      // Actualizar registro
      const { data, error } = await supabase
        .from('photos')
        .update({
          status: 'approved',
          image_url: urlData.publicUrl,
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'dev-admin'
        })
        .eq('id', photoId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, photo: data };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, error: error.message };
    }
  },

  // Rechazar foto
  async rejectPhoto(token, photoId, reason) {
    try {
      // En producción usamos la API
      if (isProduction) {
        const response = await fetch('/api/admin/reject', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ photoId, reason })
        });

        const data = await response.json();
        return { success: response.ok, ...data };
      }

      // Desarrollo: usar Supabase directamente
      // Obtener la foto
      const { data: photo, error: fetchError } = await supabase
        .from('photos')
        .select('*')
        .eq('id', photoId)
        .single();

      if (fetchError) throw fetchError;

      // Eliminar archivo del storage
      const filePath = photo.image_url.split('/gallery-photos/')[1];
      await supabase.storage.from('gallery-photos').remove([filePath]);

      // Actualizar registro
      const { data, error } = await supabase
        .from('photos')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'dev-admin'
        })
        .eq('id', photoId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, photo: data };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener todas las fotos (con filtro de estado)
  async getAllPhotos(token, status = 'all', page = 1, limit = 20) {
    try {
      if (isProduction) {
        const params = new URLSearchParams({
          status,
          page: page.toString(),
          limit: limit.toString()
        });
        const response = await fetch(`/api/admin/photos?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
      }

      // Desarrollo
      let query = supabase
        .from('photos')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return { photos: data, total: count, total_pages: Math.ceil(count / limit) };
    } catch (error) {
      console.error('Error:', error);
      return { photos: [], total: 0, total_pages: 0 };
    }
  },

  // Eliminar foto permanentemente
  async deletePhoto(token, photoId) {
    try {
      if (isProduction) {
        const response = await fetch('/api/admin/photos/delete', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ photoId })
        });
        return await response.json();
      }

      const { data: photo } = await supabase
        .from('photos')
        .select('image_url')
        .eq('id', photoId)
        .single();
      if (photo?.image_url) {
        const filePath = photo.image_url.split('/gallery-photos/')[1];
        if (filePath) await supabase.storage.from('gallery-photos').remove([filePath]);
      }

      const { error } = await supabase.from('photos').delete().eq('id', photoId);
      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, error: error.message };
    }
  },

  // Restaurar foto rechazada a pendiente
  async restorePhoto(token, photoId) {
    try {
      if (isProduction) {
        const response = await fetch('/api/admin/photos/restore', {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ photoId })
        });
        return await response.json();
      }

      const { error } = await supabase
        .from('photos')
        .update({ status: 'pending', rejection_reason: null, reviewed_at: null, reviewed_by: null })
        .eq('id', photoId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener todos los usuarios
  async getAllUsers(token, search = '') {
    try {
      if (isProduction) {
        const params = new URLSearchParams({ search });
        const response = await fetch(`/api/admin/users?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
      }

      let query = supabase
        .from('users')
        .select('*, user_progressions(*), user_specialties(*)')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;

      return { users: data };
    } catch (error) {
      console.error('Error:', error);
      return { users: [] };
    }
  },

  // Actualizar perfil de usuario
  async updateUserProfile(token, userId, updates) {
    try {
      if (isProduction) {
        const response = await fetch('/api/admin/users/update', {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, updates })
        });
        return await response.json();
      }

      const { error } = await supabase
        .from('users')
        .update({
          branch: updates.branch || null,
          is_promised: updates.is_promised || false,
          promise_date: updates.promise_date || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, error: error.message };
    }
  },

  // Agregar progresión a usuario
  async addProgression(token, userId, progression) {
    try {
      if (isProduction) {
        const response = await fetch('/api/admin/users/progression', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, progression })
        });
        return await response.json();
      }

      const { error } = await supabase.from('user_progressions').insert({
        user_id: userId,
        progression_id: progression.progression_id,
        progression_name: progression.progression_name,
        achieved_at: new Date().toISOString()
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, error: error.message };
    }
  },

  // Agregar especialidad a usuario
  async addSpecialty(token, userId, specialty) {
    try {
      if (isProduction) {
        const response = await fetch('/api/admin/users/specialty', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, specialty })
        });
        return await response.json();
      }

      const { error } = await supabase.from('user_specialties').insert({
        user_id: userId,
        specialty_id: specialty.specialty_id,
        specialty_name: specialty.specialty_name,
        level: specialty.level || 'basic',
        achieved_at: new Date().toISOString()
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, error: error.message };
    }
  },

  // Eliminar insignia (progresión o especialidad)
  async removeBadge(token, badgeId, type) {
    try {
      if (isProduction) {
        const response = await fetch('/api/admin/users/badge', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ badgeId, type })
        });
        return await response.json();
      }

      const table = type === 'progression' ? 'user_progressions' : 'user_specialties';
      const { error } = await supabase.from(table).delete().eq('id', badgeId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, error: error.message };
    }
  }
};

// =============================================
// Servicio de Foro
// =============================================
export const forumService = {
  // Obtener todos los temas
  async getTopics(category = null) {
    try {
      let query = supabase
        .from('forum_topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching topics:', error);
      return [];
    }
  },

  // Crear tema
  async createTopic(topic) {
    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .insert({
          title: topic.title,
          content: topic.content,
          category: topic.category,
          author_id: topic.author_id,
          author_name: topic.author_name,
          author_avatar: topic.author_avatar
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, topic: data };
    } catch (error) {
      console.error('Error creating topic:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener respuestas de un tema
  async getReplies(topicId) {
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching replies:', error);
      return [];
    }
  },

  // Crear respuesta
  async createReply(reply) {
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .insert({
          topic_id: reply.topic_id,
          content: reply.content,
          author_id: reply.author_id,
          author_name: reply.author_name,
          author_avatar: reply.author_avatar
        })
        .select()
        .single();

      if (error) throw error;

      // Actualizar contador de respuestas
      await supabase.rpc('increment_replies_count', { topic_uuid: reply.topic_id });

      return { success: true, reply: data };
    } catch (error) {
      console.error('Error creating reply:', error);
      return { success: false, error: error.message };
    }
  },

  // Incrementar vistas
  async incrementViews(topicId) {
    try {
      await supabase.rpc('increment_views_count', { topic_uuid: topicId });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  },

  // Eliminar tema
  async deleteTopic(topicId) {
    try {
      // Eliminar respuestas primero
      await supabase.from('forum_replies').delete().eq('topic_id', topicId);
      // Eliminar tema
      const { error } = await supabase.from('forum_topics').delete().eq('id', topicId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting topic:', error);
      return { success: false, error: error.message };
    }
  },

  // Eliminar respuesta
  async deleteReply(replyId) {
    try {
      const { data: reply } = await supabase
        .from('forum_replies')
        .select('topic_id')
        .eq('id', replyId)
        .single();
      const { error } = await supabase.from('forum_replies').delete().eq('id', replyId);
      if (error) throw error;
      // Decrementar contador
      if (reply) {
        await supabase.rpc('decrement_replies_count', { topic_id: reply.topic_id });
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting reply:', error);
      return { success: false, error: error.message };
    }
  },

  // Toggle like
  async toggleLike(topicId, userId) {
    try {
      // Verificar si ya le dio like
      const { data: existing } = await supabase
        .from('forum_likes')
        .select('id')
        .eq('topic_id', topicId)
        .eq('user_id', userId)
        .single();

      if (existing) {
        // Quitar like
        await supabase.from('forum_likes').delete().eq('id', existing.id);
        await supabase.rpc('decrement_likes_count', { topic_id: topicId });
      } else {
        // Agregar like
        await supabase.from('forum_likes').insert({ topic_id: topicId, user_id: userId });
        await supabase.rpc('increment_likes_count', { topic_id: topicId });
      }
      return { success: true };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { success: false };
    }
  },

  // Obtener likes del usuario
  async getUserLikes(userId) {
    try {
      const { data, error } = await supabase
        .from('forum_likes')
        .select('topic_id')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user likes:', error);
      return [];
    }
  }
};

// =============================================
// Servicio de Notificaciones
// =============================================
export const notificationService = {
  // Obtener notificaciones del usuario
  async getUserNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`recipient_id.eq.${userId},recipient_id.is.null`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // Marcar como leída
  async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error marking as read:', error);
      return { success: false };
    }
  },

  // Marcar todas como leídas
  async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .or(`recipient_id.eq.${userId},recipient_id.is.null`)
        .is('read_at', null);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error marking all as read:', error);
      return { success: false };
    }
  },

  // Eliminar notificación
  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase.from('notifications').delete().eq('id', notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false };
    }
  },

  // Obtener conteo de no leídas
  async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .or(`recipient_id.eq.${userId},recipient_id.is.null`)
        .is('read_at', null);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  // Crear notificación (solo admin)
  async createNotification({ title, message, type, recipientIds, attachments, createdBy }) {
    try {
      // Si recipientIds está vacío o es null, es para todos los usuarios
      if (!recipientIds || recipientIds.length === 0) {
        // Notificación para todos
        const { data, error } = await supabase
          .from('notifications')
          .insert({
            title,
            message,
            type: type || 'general',
            recipient_id: null,
            attachments: attachments || [],
            created_by: createdBy
          })
          .select()
          .single();

        if (error) throw error;
        return { success: true, data };
      } else {
        // Notificaciones individuales para usuarios seleccionados
        const notifications = recipientIds.map((recipientId) => ({
          title,
          message,
          type: type || 'general',
          recipient_id: recipientId,
          attachments: attachments || [],
          created_by: createdBy
        }));

        const { data, error } = await supabase.from('notifications').insert(notifications).select();

        if (error) throw error;
        return { success: true, data };
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      return { success: false, error: error.message };
    }
  },

  // Subir archivo adjunto
  async uploadAttachment(file) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `notification-attachments/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);

      return {
        success: true,
        attachment: {
          name: file.name,
          url: data.publicUrl,
          type: file.type,
          size: file.size
        }
      };
    } catch (error) {
      console.error('Error uploading attachment:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener todas las notificaciones (para admin)
  async getAllNotifications() {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(
          `
          *,
          profiles:recipient_id(name, email)
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      return [];
    }
  }
};
