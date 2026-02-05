import React from 'react';
import { useState, useRef, useEffect } from 'react';
import '../styles/gallery.scss';
import { PageContainer } from '../components/PageContainer';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { galleryService, authService, userService, supabase } from '../lib/supabase';
import { FaGoogle, FaUser } from 'react-icons/fa';
// Imágenes locales de fallback
import img1 from '../assets/galleryimages/img1.jpg';
import img2 from '../assets/galleryimages/img2.jpg';
import img3 from '../assets/galleryimages/img3.jpg';
import img4 from '../assets/galleryimages/img4.jpg';
import img5 from '../assets/galleryimages/img5.jpg';
import img6 from '../assets/galleryimages/img6.jpg';
import img7 from '../assets/galleryimages/img7.jpg';
import img8 from '../assets/galleryimages/img8.jpg';
import img9 from '../assets/galleryimages/img9.jpg';
import img10 from '../assets/galleryimages/img10.jpg';
import img11 from '../assets/galleryimages/img11.jpg';
import img12 from '../assets/galleryimages/img12.jpg';
import {
  FaCamera,
  FaDownload,
  FaTimes,
  FaCloudUploadAlt,
  FaImage,
  FaCheck,
  FaSpinner
} from 'react-icons/fa';
import {
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Select,
  SelectItem,
  Progress,
  Spinner
} from '@nextui-org/react';

// Imágenes locales de fallback cuando no hay conexión a Supabase
const localGalleryData = [
  { id: 1, image_url: img1, title: 'Campamento 2024', category: 'Campamento' },
  { id: 2, image_url: img2, title: 'Actividad al aire libre', category: 'Actividades' },
  { id: 3, image_url: img3, title: 'Fogón scout', category: 'Eventos' },
  { id: 4, image_url: img4, title: 'Excursión', category: 'Excursiones' },
  { id: 5, image_url: img5, title: 'Juegos en grupo', category: 'Actividades' },
  { id: 6, image_url: img6, title: 'Ceremonia', category: 'Eventos' },
  { id: 7, image_url: img7, title: 'Naturaleza', category: 'Excursiones' },
  { id: 8, image_url: img8, title: 'Trabajo en equipo', category: 'Actividades' },
  { id: 9, image_url: img9, title: 'Campamento nocturno', category: 'Campamento' },
  { id: 10, image_url: img10, title: 'Senderismo', category: 'Excursiones' },
  { id: 11, image_url: img11, title: 'Actividad grupal', category: 'Actividades' },
  { id: 12, image_url: img12, title: 'Momentos especiales', category: 'Eventos' }
];

export const Gallery = () => {
  const [filter, setFilter] = useState('Todos');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingLocalData, setUsingLocalData] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const categories = ['Todos', 'Campamento', 'Actividades', 'Excursiones', 'Eventos'];
  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onOpenChange: onUploadOpenChange
  } = useDisclosure();

  // Verificar sesión al cargar
  useEffect(() => {
    let isMounted = true;

    // Patrón exacto de la documentación de Supabase
    const {
      data: { subscription }
    } = authService.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
      } else if (session) {
        setUser(session.user);
        // Diferir operaciones de Supabase para después del callback
        setTimeout(async () => {
          if (!isMounted) return;
          try {
            const profile = await userService.getOrCreateProfile(session.user);
            if (isMounted) setUserProfile(profile);
          } catch (error) {
            console.error('Error loading profile:', error);
          }
        }, 0);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Cargar fotos al inicio y cuando cambia el filtro
  useEffect(() => {
    loadPhotos();
  }, [filter]);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const result = await galleryService.getApprovedPhotos(filter);
      if (result.photos && result.photos.length > 0) {
        setPhotos(result.photos);
        setUsingLocalData(false);
      } else {
        // Usar datos locales si no hay fotos en la API
        const filtered =
          filter === 'Todos'
            ? localGalleryData
            : localGalleryData.filter((p) => p.category === filter);
        setPhotos(filtered);
        setUsingLocalData(true);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
      // Usar datos locales en caso de error
      const filtered =
        filter === 'Todos'
          ? localGalleryData
          : localGalleryData.filter((p) => p.category === filter);
      setPhotos(filtered);
      setUsingLocalData(true);
    }
    setLoading(false);
  };

  return (
    <PageContainer>
      <SEO
        title="Galería"
        description="Galería de fotos del Grupo Scout 331 Savio. Revive los mejores momentos de nuestros campamentos, actividades, excursiones y eventos scouts en Río Tercero."
        keywords="fotos scouts, galería scout, campamentos scouts, actividades scouts, eventos scouts, excursiones"
        url="/galeria"
      />
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <FaCamera />
          </div>
          <h1>
            Galería <span className="gradient-text">Scout</span>
          </h1>
          <p>Revive los mejores momentos de nuestras aventuras</p>
          <Button
            className="upload-hero-btn"
            onPress={onUploadOpen}
            startContent={<FaCloudUploadAlt />}>
            Subir mis fotos
          </Button>
          {user && (
            <p className="user-logged-in">
              <FaUser /> Conectado como {userProfile?.name || user.email}
            </p>
          )}
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="filter-container">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}>
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-section">
        {loading ? (
          <div className="loading-container">
            <Spinner size="lg" color="warning" />
            <p>Cargando fotos...</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {photos.map((item) => (
              <GalleryImage
                key={item.id}
                id={item.id}
                imgSrc={item.image_url}
                title={item.title}
                category={item.category}
              />
            ))}
          </div>
        )}
        {!loading && photos.length === 0 && (
          <div className="empty-gallery">
            <FaCamera />
            <p>No hay fotos en esta categoría</p>
          </div>
        )}
      </section>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onOpenChange={onUploadOpenChange}
        categories={categories.filter((c) => c !== 'Todos')}
        user={user}
        userProfile={userProfile}
        onLoadPhotos={loadPhotos}
      />

      <Footer />
    </PageContainer>
  );
};

const GalleryImage = ({ id, imgSrc, title, category }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      <div className="gallery-item" onClick={onOpen}>
        <img
          className="gallery-img"
          src={imgSrc}
          alt={title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
        />
        <div className="gallery-overlay">
          <span className="gallery-category">{category}</span>
          <h3>{title}</h3>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        classNames={{
          backdrop: 'bg-black/80 backdrop-blur-sm',
          base: 'bg-transparent shadow-none'
        }}>
        <ModalContent className="modal-content">
          <ModalHeader className="modal-header">
            <h3>{title}</h3>
            <span className="modal-category">{category}</span>
          </ModalHeader>
          <ModalBody className="modal-body">
            <img src={imgSrc} alt={title} className="modal-image" />
          </ModalBody>
          <ModalFooter className="modal-footer">
            <Button
              className="download-btn"
              startContent={<FaDownload />}
              as="a"
              href={imgSrc}
              download={title}
              target="_blank">
              Descargar
            </Button>
            <Button variant="bordered" onPress={onClose} className="close-btn">
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// Función para comprimir imágenes antes de subir
const compressImage = (file, maxWidth = 1920, maxHeight = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    // Si no es imagen, devolver el archivo original
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo el aspect ratio
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Crear canvas para redimensionar
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a blob comprimido
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Crear nuevo File con el blob comprimido
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Si falla, devolver original
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file); // Si falla, devolver original
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file); // Si falla, devolver original
    reader.readAsDataURL(file);
  });
};

// Upload Modal Component
const UploadModal = ({ isOpen, onOpenChange, categories, user, userProfile, onLoadPhotos }) => {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const handleSignIn = async () => {
    setAuthLoading(true);
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error al iniciar sesión. Intenta nuevamente.');
    }
    setAuthLoading(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = async (newFiles) => {
    setIsCompressing(true);

    try {
      // Comprimir todas las imágenes en paralelo
      const compressedFiles = await Promise.all(
        newFiles.map(async (file) => {
          const compressed = await compressImage(file);
          return {
            file: compressed,
            originalSize: file.size,
            compressedSize: compressed.size,
            preview: URL.createObjectURL(compressed),
            id: Math.random().toString(36).substr(2, 9),
            title: file.name.replace(/\.[^/.]+$/, '') // Nombre sin extensión como título inicial
          };
        })
      );

      setFiles((prev) => [...prev, ...compressedFiles].slice(0, 10)); // Max 10 files
    } catch (error) {
      console.error('Error compressing files:', error);
      // Fallback: agregar sin comprimir
      const filesWithPreview = newFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9),
        title: file.name.replace(/\.[^/.]+$/, '')
      }));
      setFiles((prev) => [...prev, ...filesWithPreview].slice(0, 10));
    }

    setIsCompressing(false);
  };

  const updateFileTitle = (id, title) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, title } : f)));
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (files.length === 0 || !category || !user) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar archivos con títulos
      const filesWithTitles = files.map((f) => ({
        file: f.file,
        title: f.title || f.file.name.replace(/\.[^/.]+$/, '')
      }));

      const result = await galleryService.uploadPhotos(filesWithTitles, {
        name: userProfile?.name || user.user_metadata?.full_name || user.email.split('@')[0],
        email: user.email,
        category,
        description,
        userId: userProfile?.id
      });

      if (result.success) {
        setSubmitSuccess(true);
        // Recargar fotos si se agregaron algunas aprobadas
        if (onLoadPhotos) onLoadPhotos();
      } else {
        console.error('Upload failed:', result.error);
        alert('Error al subir las fotos. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error al subir las fotos. Intenta nuevamente.');
    }

    setIsSubmitting(false);

    // Reset después de 3 segundos
    setTimeout(() => {
      setSubmitSuccess(false);
      setFiles([]);
      setDescription('');
      setCategory('');
      onOpenChange(false);
    }, 3000);
  };

  const resetForm = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setDescription('');
    setCategory('');
    setSubmitSuccess(false);
  };

  // Si no está autenticado, mostrar pantalla de login
  if (!user) {
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
        classNames={{
          backdrop: 'bg-black/80 backdrop-blur-sm'
        }}>
        <ModalContent className="upload-modal-content">
          {(onClose) => (
            <>
              <ModalHeader className="upload-modal-header">
                <div className="header-icon">
                  <FaCloudUploadAlt />
                </div>
                <div>
                  <h3>Compartí tus fotos</h3>
                  <p>Iniciá sesión para subir fotos a la galería</p>
                </div>
              </ModalHeader>

              <ModalBody className="upload-modal-body">
                <div className="auth-required">
                  <FaUser className="auth-icon" />
                  <h4>¿Querés compartir tus fotos?</h4>
                  <p>
                    Para subir fotos necesitás iniciar sesión con tu cuenta de Google. Esto nos
                    ayuda a mantener la galería organizada y poder contactarte si tus fotos son
                    aprobadas.
                  </p>
                  <Button
                    className="google-signin-btn"
                    onPress={handleSignIn}
                    isLoading={authLoading}
                    startContent={!authLoading && <FaGoogle />}
                    size="lg">
                    {authLoading ? 'Conectando...' : 'Iniciar sesión con Google'}
                  </Button>
                  <p className="auth-note">Solo usamos tu información para identificar tus fotos</p>
                </div>
              </ModalBody>

              <ModalFooter className="upload-modal-footer">
                <Button variant="bordered" onPress={onClose} className="cancel-btn">
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) resetForm();
        onOpenChange(open);
      }}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        backdrop: 'bg-black/80 backdrop-blur-sm'
      }}>
      <ModalContent className="upload-modal-content">
        {(onClose) => (
          <>
            <ModalHeader className="upload-modal-header">
              <div className="header-icon">
                <FaCloudUploadAlt />
              </div>
              <div>
                <h3>Compartí tus fotos</h3>
                <p>Tus fotos serán revisadas antes de publicarse</p>
              </div>
            </ModalHeader>

            <ModalBody className="upload-modal-body">
              {submitSuccess ? (
                <div className="success-state">
                  <div className="success-icon">
                    <FaCheck />
                  </div>
                  <h4>¡Fotos enviadas!</h4>
                  <p>
                    Tus fotos fueron recibidas correctamente. Te notificaremos cuando sean
                    aprobadas.
                  </p>
                </div>
              ) : (
                <>
                  {/* Drop Zone */}
                  <div
                    className={`drop-zone ${dragActive ? 'active' : ''} ${files.length > 0 ? 'has-files' : ''} ${isCompressing ? 'compressing' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !isCompressing && fileInputRef.current?.click()}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    {isCompressing ? (
                      <>
                        <FaSpinner className="drop-icon spin" />
                        <p className="drop-text">Comprimiendo imágenes...</p>
                        <span className="drop-hint">Optimizando para menor tamaño</span>
                      </>
                    ) : (
                      <>
                        <FaImage className="drop-icon" />
                        <p className="drop-text">
                          Arrastrá tus fotos aquí o hacé clic para seleccionar
                        </p>
                        <span className="drop-hint">
                          Máximo 10 fotos • JPG, PNG o WebP • Se comprimen automáticamente
                        </span>
                      </>
                    )}
                  </div>

                  {/* Compression Stats */}
                  {files.length > 0 && files.some((f) => f.originalSize) && (
                    <div className="compression-stats">
                      <span className="stat-label">💾 Ahorro por compresión:</span>
                      <span className="stat-value">
                        {(() => {
                          const totalOriginal = files.reduce(
                            (acc, f) => acc + (f.originalSize || f.file.size),
                            0
                          );
                          const totalCompressed = files.reduce((acc, f) => acc + f.file.size, 0);
                          const savedBytes = totalOriginal - totalCompressed;
                          const savedPercent = ((savedBytes / totalOriginal) * 100).toFixed(0);
                          const formatSize = (bytes) => {
                            if (bytes < 1024) return `${bytes} B`;
                            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
                            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
                          };
                          return `${formatSize(savedBytes)} (${savedPercent}% menos)`;
                        })()}
                      </span>
                    </div>
                  )}

                  {/* Preview Grid */}
                  {files.length > 0 && (
                    <div className="preview-grid">
                      {files.map((file) => (
                        <div key={file.id} className="preview-item">
                          <img src={file.preview} alt="Preview" />
                          <button
                            className="remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(file.id);
                            }}>
                            <FaTimes />
                          </button>
                          <Input
                            size="sm"
                            variant="flat"
                            placeholder="Título de la imagen"
                            value={file.title}
                            onChange={(e) => updateFileTitle(file.id, e.target.value)}
                            className="preview-title-input"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="upload-form">
                    <div className="user-info-box">
                      <FaUser />
                      <div>
                        <strong>
                          {userProfile?.name || user?.user_metadata?.full_name || 'Usuario'}
                        </strong>
                        <span>{user?.email}</span>
                      </div>
                    </div>

                    <Select
                      label="Categoría"
                      placeholder="Selecciona una categoría"
                      selectedKeys={category ? [category] : []}
                      onSelectionChange={(keys) => setCategory(Array.from(keys)[0])}
                      isRequired
                      classNames={{
                        trigger: 'upload-input-wrapper'
                      }}
                      popoverProps={{
                        classNames: {
                          content: 'z-[9999]'
                        },
                        portalContainer: document.body
                      }}>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </Select>

                    <Textarea
                      label="Descripción (opcional)"
                      placeholder="Contanos sobre estas fotos... ¿Cuándo fueron tomadas? ¿Qué actividad era?"
                      value={description}
                      onValueChange={setDescription}
                      minRows={2}
                      classNames={{
                        inputWrapper: 'upload-input-wrapper'
                      }}
                    />
                  </div>

                  <div className="upload-notice">
                    <p>
                      📋 Al enviar tus fotos, aceptás que sean revisadas y publicadas en nuestra
                      galería. Nos reservamos el derecho de rechazar contenido inapropiado.
                    </p>
                  </div>
                </>
              )}
            </ModalBody>

            {!submitSuccess && (
              <ModalFooter className="upload-modal-footer">
                <Button variant="bordered" onPress={onClose} className="cancel-btn">
                  Cancelar
                </Button>
                <Button
                  className="submit-btn"
                  onPress={handleSubmit}
                  isDisabled={files.length === 0 || !category || isSubmitting}
                  startContent={
                    isSubmitting ? <FaSpinner className="spin" /> : <FaCloudUploadAlt />
                  }>
                  {isSubmitting
                    ? 'Enviando...'
                    : `Enviar ${files.length} foto${files.length !== 1 ? 's' : ''}`}
                </Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
