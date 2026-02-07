<p align="center">
  <img src="src/assets/logo/logo.png" alt="Grupo Scout 331 Savio" width="150" />
</p>

<h1 align="center">🏕️ Grupo Scout 331 Gral. Manuel Nicolás Savio</h1>

<p align="center">
  <strong>Formando líderes del mañana desde 1982</strong>
</p>

<p align="center">
  <a href="https://scoutsavio.org">
    <img src="https://img.shields.io/badge/🌐_Ver_Sitio-Live-success?style=for-the-badge" alt="Live Site" />
  </a>
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000?style=for-the-badge&logo=vercel" alt="Vercel" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Río_Tercero-Córdoba,_Argentina-blue?style=flat-square" alt="Location" />
  <img src="https://img.shields.io/badge/License-Private-red?style=flat-square" alt="License" />
</p>

---

## 📋 Tabla de Contenidos

- [✨ Características](#-características)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🚀 Instalación](#-instalación)
- [📱 Páginas](#-páginas)
- [🔐 Panel de Administración](#-panel-de-administración)
- [🗄️ Base de Datos](#️-base-de-datos)
- [📧 Sistema de Emails](#-sistema-de-emails)
- [🤝 Contribuir](#-contribuir)

---

## ✨ Características

### 🏠 Sitio Público

- **Página de Inicio** con countdown para el próximo campamento
- **Galería de Fotos** con sistema de subida y moderación
- **Guía Scout** completa con ramas, progresiones y especialidades
- **Foro Comunitario** estilo Reddit para la comunidad scout
- **Sistema de Notificaciones** para comunicados importantes
- **Información de Contacto** y ubicación del grupo

### 👤 Sistema de Usuarios

- **Autenticación con Google** vía Supabase Auth
- **Perfiles de Usuario** personalizables
- **Seguimiento de Progresiones** (Pata Tierna, Saltador, Rastreador, Cazador, etc.)
- **Registro de Especialidades** obtenidas
- **Historial de Fotos** subidas

### 🖼️ Galería Inteligente

- **Subida de múltiples fotos** (hasta 10 por lote)
- **Categorización automática** (Campamentos, Actividades, Excursiones, Eventos)
- **Sistema de moderación** antes de publicar
- **Almacenamiento en Supabase Storage**
- **Fallback a imágenes locales** si no hay conexión

### 💬 Foro Comunitario

- **Diseño estilo Reddit** con votos y categorías
- **Categorías con emojis**: 💬 General, 🏕️ Actividades, ⛺ Campamentos, 💡 Ideas, 🙋 Ayuda
- **Sistema de respuestas** con identificación de autor original
- **Likes y comentarios** en tiempo real

### 🔔 Sistema de Notificaciones

- **Tipos de notificaciones**: General, Pago, Documento, Permiso, Urgente, Actividad
- **Adjuntos en notificaciones** (PDFs, imágenes, links)
- **Marcado como leído/no leído**
- **Diseño moderno** con iconos y colores por tipo

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnología           | Uso                       |
| -------------------- | ------------------------- |
| ⚛️ **React 18**      | Framework de UI           |
| ⚡ **Vite 5**        | Build tool y dev server   |
| 🎨 **SCSS**          | Estilos con preprocesador |
| 💨 **Tailwind CSS**  | Utilidades CSS            |
| 🎭 **NextUI**        | Componentes UI            |
| 🎬 **Framer Motion** | Animaciones               |
| 🔀 **React Router**  | Navegación SPA            |
| 🎯 **React Icons**   | Iconografía               |

### Backend

| Tecnología              | Uso                                       |
| ----------------------- | ----------------------------------------- |
| 🗄️ **Supabase**         | Base de datos PostgreSQL + Auth + Storage |
| ▲ **Vercel Serverless** | API Functions                             |
| 📧 **Resend**           | Envío de emails transaccionales           |

### DevOps

| Tecnología              | Uso                  |
| ----------------------- | -------------------- |
| 📊 **Vercel Analytics** | Métricas de uso      |
| 🔄 **GitHub Actions**   | CI/CD automático     |
| 🌐 **Vercel**           | Hosting y deployment |

---

## 📁 Estructura del Proyecto

```
web-scoutsavio/
├── 📁 api/                    # Vercel Serverless Functions
│   ├── 📁 admin/              # Endpoints de administración
│   │   ├── approve.js         # Aprobar fotos
│   │   ├── reject.js          # Rechazar fotos
│   │   ├── pending.js         # Listar pendientes
│   │   ├── photos.js          # CRUD de fotos
│   │   ├── users.js           # Gestión de usuarios
│   │   └── 📁 photos/         # Operaciones de fotos
│   │   └── 📁 users/          # Operaciones de usuarios
│   ├── 📁 photos/             # Endpoints públicos de fotos
│   │   ├── index.js           # Listar fotos aprobadas
│   │   └── upload.js          # Subir fotos
│   └── 📁 lib/                # Utilidades compartidas
│       ├── auth.js            # Verificación de admin
│       ├── email.js           # Servicio de emails
│       └── supabase.js        # Cliente de Supabase
│
├── 📁 public/                 # Assets estáticos
│   ├── favicon.ico
│   ├── site.webmanifest
│   └── robots.txt
│
├── 📁 src/
│   ├── 📁 assets/             # Imágenes y recursos
│   │   ├── 📁 progressions/   # Imágenes de progresiones
│   │   ├── 📁 specialties/    # Imágenes de especialidades
│   │   ├── 📁 ramas/          # Imágenes de ramas
│   │   └── 📁 logo/           # Logos del grupo
│   │
│   ├── 📁 components/         # Componentes reutilizables
│   │   ├── Nav.jsx            # Barra de navegación
│   │   ├── Footer.jsx         # Pie de página
│   │   ├── Loader.jsx         # Indicador de carga
│   │   ├── CampCountdown.jsx  # Countdown campamento
│   │   ├── Location.jsx       # Mapa de ubicación
│   │   ├── 📁 Guide/          # Componentes de la guía
│   │   └── 📁 Errors/         # Páginas de error
│   │
│   ├── 📁 pages/              # Páginas de la aplicación
│   │   ├── home.jsx           # Página principal
│   │   ├── gallery.jsx        # Galería de fotos
│   │   ├── guide.jsx          # Guía scout
│   │   ├── forum.jsx          # Foro comunitario
│   │   ├── notifications.jsx  # Notificaciones
│   │   ├── profile.jsx        # Perfil de usuario
│   │   ├── admin.jsx          # Panel de administración
│   │   ├── about.jsx          # Sobre nosotros
│   │   └── contact.jsx        # Contacto
│   │
│   ├── 📁 styles/             # Estilos SCSS
│   │   ├── _variables.scss    # Variables globales
│   │   └── [page].scss        # Estilos por página
│   │
│   ├── 📁 lib/
│   │   └── supabase.js        # Cliente y servicios de Supabase
│   │
│   ├── App.jsx                # Componente raíz
│   ├── App.scss               # Estilos globales
│   └── main.jsx               # Entry point
│
├── 📄 vercel.json             # Configuración de Vercel
├── 📄 tailwind.config.js      # Configuración de Tailwind
├── 📄 vite.config.js          # Configuración de Vite
└── 📄 package.json            # Dependencias
```

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com) (para deploy)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/QuaDDom/web-scoutsavio.git
cd web-scoutsavio

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:5173
```

---

---

## 📱 Páginas

| Ruta                 | Página        | Descripción                    |
| -------------------- | ------------- | ------------------------------ |
| `/`                  | Home          | Página principal con countdown |
| `/galeria`           | Gallery       | Galería de fotos con subida    |
| `/guia`              | Guide         | Guía scout completa            |
| `/guia/branches`     | Branches      | Ramas scouts                   |
| `/guia/progressions` | Progressions  | Progresiones por rama          |
| `/guia/specialties`  | Specialties   | Especialidades                 |
| `/foro`              | Forum         | Foro comunitario               |
| `/notificaciones`    | Notifications | Centro de notificaciones       |
| `/perfil`            | Profile       | Perfil del usuario             |
| `/sobre`             | About         | Sobre el grupo                 |
| `/contacto`          | Contact       | Información de contacto        |
| `/admin`             | Admin         | Panel de administración        |

---

## 🔐 Panel de Administración

Acceso restringido a administradores autorizados del grupo.

### Funcionalidades

- 📷 **Moderar fotos** subidas por usuarios
- 👥 **Gestionar usuarios** y sus progresiones
- 📝 **Asignar especialidades** a usuarios
- 🔔 **Enviar notificaciones** masivas
- 📊 **Ver estadísticas** de uso

---

## 🗄️ Base de Datos

### Tablas principales

```sql
-- Usuarios
users (id, email, name, branch, bio, is_promised, promise_date, ...)

-- Fotos
photos (id, image_url, title, category, status, uploader_name, ...)

-- Foro
forum_topics (id, title, content, category, author_id, likes, ...)
forum_replies (id, topic_id, content, author_id, ...)
forum_likes (id, topic_id, user_id)

-- Progresiones y Especialidades
user_progressions (id, user_id, progression_id, earned_date)
user_specialties (id, user_id, specialty_id, earned_date)

-- Notificaciones
notifications (id, title, content, type, attachments, ...)
user_notifications (id, user_id, notification_id, read, ...)

-- Administradores
admins (id, email, role)
```

---

## 📧 Sistema de Emails

Emails automáticos enviados vía **Resend**:

| Evento                | Destinatario | Contenido                  |
| --------------------- | ------------ | -------------------------- |
| Nueva subida de fotos | Admins       | Aviso de fotos pendientes  |
| Fotos aprobadas       | Usuario      | Confirmación de aprobación |
| Fotos rechazadas      | Usuario      | Motivo del rechazo         |

---

## 🎨 Temas

El sitio soporta **modo claro y oscuro** automáticamente.

### Colores principales

- 🔴 **Primario**: `#B82722` (Rojo Scout)
- 🟠 **Secundario**: `#ff6b35` (Naranja)
- ⚫ **Fondo oscuro**: `#121b23`
- ⚪ **Fondo claro**: `#f5f5f5`

---

## 🤝 Contribuir

Este es un proyecto privado del Grupo Scout 331 Savio. Para contribuir:

1. Contactar a los administradores del grupo
2. Solicitar acceso al repositorio
3. Crear una rama desde `main`
4. Hacer tus cambios
5. Enviar un Pull Request

---

<p align="center">
  <strong>🏕️ Siempre Listos 🏕️</strong>
</p>

<p align="center">
  Hecho con ❤️ por el Grupo Scout 331 Savio<br/>
  Río Tercero, Córdoba, Argentina
</p>

<p align="center">
  <sub>© 2024-2026 Grupo Scout 331 Gral. Manuel Nicolás Savio. Todos los derechos reservados.</sub>
</p>
