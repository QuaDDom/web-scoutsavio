import React, { useState, useEffect, useCallback } from 'react';
import '../styles/profile.scss';
import { PageContainer } from '../components/PageContainer';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { supabase, authService, userService } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Image,
  Skeleton,
  useDisclosure
} from '@nextui-org/react';
import {
  FaUser,
  FaCamera,
  FaEdit,
  FaSignOutAlt,
  FaGoogle,
  FaStar,
  FaMedal,
  FaImages,
  FaCheck,
  FaClock,
  FaTimes,
  FaCalendarAlt,
  FaHandPaper,
  FaInfoCircle
} from 'react-icons/fa';
import { MdVerified, MdPhotoLibrary, MdSettings, MdBadge } from 'react-icons/md';

// Datos de ramas
const branchesData = {
  manada: { name: 'Manada', color: '#ff9800', age: '7-10 años', icon: '🐺' },
  unidad: { name: 'Unidad', color: '#4caf50', age: '10-14 años', icon: '⚜️' },
  caminantes: { name: 'Caminantes', color: '#2196f3', age: '14-18 años', icon: '🥾' },
  rover: { name: 'Rover', color: '#e53935', age: '18-22 años', icon: '🔴' }
};

// Componente principal del perfil
export const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userPhotos, setUserPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [saving, setSaving] = useState(false);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isPhotoOpen, onOpen: onPhotoOpen, onClose: onPhotoClose } = useDisclosure();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Form state para edición
  const [editForm, setEditForm] = useState({
    name: '',
    branch: '',
    bio: '',
    is_promised: false,
    promise_date: ''
  });

  // Cargar datos del usuario
  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();

      if (!currentUser) {
        navigate('/galeria');
        return;
      }

      setUser(currentUser);

      // Obtener o crear perfil
      const userProfile = await userService.getOrCreateProfile(currentUser);
      setProfile(userProfile);

      // Cargar formulario de edición
      if (userProfile) {
        setEditForm({
          name: userProfile.name || '',
          branch: userProfile.branch || '',
          bio: userProfile.bio || '',
          is_promised: userProfile.is_promised || false,
          promise_date: userProfile.promise_date || ''
        });

        // Cargar fotos del usuario
        const photos = await userService.getUserPhotos(userProfile.id);
        setUserPhotos(photos || []);
      }
    } catch (error) {
      // Ignorar errores de abort que son normales en desarrollo con React Strict Mode
      if (error.name === 'AbortError') return;
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;

    // Patrón exacto de la documentación de Supabase
    const {
      data: { subscription }
    } = authService.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT') {
        // Diferir navegación para después del callback
        setTimeout(() => {
          if (isMounted) navigate('/galeria');
        }, 0);
      } else if (session) {
        // Diferir carga de datos para después del callback
        setTimeout(() => {
          if (isMounted) loadUserData();
        }, 0);
      } else {
        // Sin sesión, redirigir
        setTimeout(() => {
          if (isMounted) navigate('/galeria');
        }, 0);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [loadUserData, navigate]);

  // Cerrar sesión
  const handleSignOut = async () => {
    try {
      await authService.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Guardar cambios del perfil
  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      const result = await userService.updateProfile(profile.id, editForm);

      if (result.success) {
        setProfile({ ...profile, ...editForm });
        onEditClose();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  // Abrir foto en modal
  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    onPhotoOpen();
  };

  // Estado de carga
  if (loading) {
    return (
      <PageContainer>
        <SEO title="Mi Perfil" description="Tu perfil de scout" url="/perfil" />
        <div className="profile-page">
          <div className="profile-loading">
            <div className="loading-avatar">
              <Skeleton className="skeleton-circle" />
            </div>
            <Skeleton className="skeleton-text skeleton-name" />
            <Skeleton className="skeleton-text skeleton-email" />
            <div className="loading-stats">
              <Skeleton className="skeleton-stat" />
              <Skeleton className="skeleton-stat" />
              <Skeleton className="skeleton-stat" />
            </div>
          </div>
        </div>
        <Footer />
      </PageContainer>
    );
  }

  // Si no hay usuario autenticado
  if (!user) {
    return (
      <PageContainer>
        <SEO title="Iniciar Sesión" description="Inicia sesión para ver tu perfil" url="/perfil" />
        <div className="profile-page">
          <div className="profile-login">
            <div className="login-card">
              <div className="login-icon">
                <FaUser />
              </div>
              <h2>Inicia Sesión</h2>
              <p>Accede a tu perfil scout para ver tus fotos, progresiones y especialidades.</p>
              <Button
                className="google-btn"
                startContent={<FaGoogle />}
                onClick={() => authService.signInWithGoogle('/perfil')}>
                Continuar con Google
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </PageContainer>
    );
  }

  const branchInfo = profile?.branch ? branchesData[profile.branch] : null;

  // Stats del usuario
  const stats = {
    photos: userPhotos.length,
    approved: userPhotos.filter((p) => p.status === 'approved').length,
    pending: userPhotos.filter((p) => p.status === 'pending').length,
    progressions: profile?.user_progressions?.length || 0,
    specialties: profile?.user_specialties?.length || 0
  };

  return (
    <PageContainer>
      <SEO
        title={`${profile?.name || 'Mi Perfil'} - Scout Savio`}
        description="Tu perfil de scout con progresiones, especialidades y fotos"
        url="/perfil"
      />

      <div className="profile-page">
        {/* Hero del Perfil */}
        <section className="profile-hero">
          <div className="hero-background">
            <div className="hero-gradient"></div>
          </div>

          <div className="hero-content">
            <div className="profile-header">
              <div className="avatar-section">
                <Avatar
                  src={profile?.avatar_url || user?.user_metadata?.avatar_url}
                  className="profile-avatar"
                  isBordered
                  color={branchInfo ? 'warning' : 'default'}
                  showFallback
                  fallback={<FaUser className="avatar-fallback" />}
                />
                {profile?.is_promised && (
                  <div className="promised-badge" title="Scout Prometido">
                    <MdVerified />
                  </div>
                )}
              </div>

              <div className="user-info">
                <h1 className="user-name">
                  {profile?.name || user?.email?.split('@')[0]}
                  {profile?.is_promised && <MdVerified className="verified-icon" />}
                </h1>
                <p className="user-email">{profile?.email || user?.email}</p>

                {branchInfo && (
                  <Chip
                    className="branch-chip"
                    style={{
                      backgroundColor: branchInfo.color,
                      color: '#fff'
                    }}
                    startContent={<span>{branchInfo.icon}</span>}>
                    {branchInfo.name} • {branchInfo.age}
                  </Chip>
                )}

                {profile?.bio && <p className="user-bio">{profile.bio}</p>}
              </div>

              <div className="header-actions">
                <Button
                  className="edit-btn"
                  startContent={<FaEdit />}
                  variant="flat"
                  onClick={onEditOpen}>
                  Editar perfil
                </Button>
                <Button
                  className="logout-btn"
                  startContent={<FaSignOutAlt />}
                  variant="flat"
                  color="danger"
                  onClick={handleSignOut}>
                  Cerrar sesión
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-icon photos">
                  <FaImages />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stats.photos}</span>
                  <span className="stat-label">Fotos subidas</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon progressions">
                  <FaMedal />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stats.progressions}</span>
                  <span className="stat-label">Progresiones</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon specialties">
                  <FaStar />
                </div>
                <div className="stat-info">
                  <span className="stat-value">{stats.specialties}</span>
                  <span className="stat-label">Especialidades</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenido Principal */}
        <section className="profile-content">
          <Tabs
            aria-label="Secciones del perfil"
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
            className="profile-tabs"
            color="warning"
            variant="underlined">
            {/* Tab de Resumen */}
            <Tab
              key="overview"
              title={
                <div className="tab-title">
                  <FaUser />
                  <span>Resumen</span>
                </div>
              }>
              <div className="tab-content overview-content">
                {/* Info Card */}
                <Card className="info-card">
                  <CardHeader className="card-header">
                    <MdSettings />
                    <h3>Información Personal</h3>
                  </CardHeader>
                  <CardBody className="card-body">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Nombre</span>
                        <span className="info-value">{profile?.name || '-'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Email</span>
                        <span className="info-value">{profile?.email || user?.email}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Rama</span>
                        <span className="info-value">
                          {branchInfo ? (
                            <Chip
                              size="sm"
                              style={{ backgroundColor: branchInfo.color, color: '#fff' }}>
                              {branchInfo.icon} {branchInfo.name}
                            </Chip>
                          ) : (
                            <span className="not-set">No configurada</span>
                          )}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Estado</span>
                        <span className="info-value">
                          {profile?.is_promised ? (
                            <Chip color="success" size="sm" startContent={<FaHandPaper />}>
                              Scout Prometido
                            </Chip>
                          ) : (
                            <span className="not-set">Sin promesa</span>
                          )}
                        </span>
                      </div>
                      {profile?.promise_date && (
                        <div className="info-item full">
                          <span className="info-label">Fecha de Promesa</span>
                          <span className="info-value">
                            <FaCalendarAlt className="date-icon" />
                            {new Date(profile.promise_date).toLocaleDateString('es-AR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                      {profile?.bio && (
                        <div className="info-item full">
                          <span className="info-label">Biografía</span>
                          <span className="info-value bio">{profile.bio}</span>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>

                {/* Quick Stats */}
                <div className="quick-stats">
                  <Card className="quick-stat-card">
                    <CardBody>
                      <div className="quick-stat approved">
                        <FaCheck />
                        <div>
                          <span className="value">{stats.approved}</span>
                          <span className="label">Fotos aprobadas</span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="quick-stat-card">
                    <CardBody>
                      <div className="quick-stat pending">
                        <FaClock />
                        <div>
                          <span className="value">{stats.pending}</span>
                          <span className="label">En revisión</span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                {/* Badges Preview */}
                {(stats.progressions > 0 || stats.specialties > 0) && (
                  <Card className="badges-preview-card">
                    <CardHeader className="card-header">
                      <MdBadge />
                      <h3>Mis Insignias</h3>
                    </CardHeader>
                    <CardBody className="card-body">
                      {stats.progressions === 0 && stats.specialties === 0 ? (
                        <div className="empty-badges">
                          <FaInfoCircle />
                          <p>Aún no tenés insignias asignadas</p>
                        </div>
                      ) : (
                        <div className="badges-preview">
                          {profile?.user_progressions?.slice(0, 4).map((prog) => (
                            <div key={prog.id} className="badge-item progression">
                              <FaMedal />
                              <span>{prog.progression_name}</span>
                            </div>
                          ))}
                          {profile?.user_specialties?.slice(0, 4).map((spec) => (
                            <div key={spec.id} className="badge-item specialty">
                              <FaStar />
                              <span>{spec.specialty_name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                )}
              </div>
            </Tab>

            {/* Tab de Fotos */}
            <Tab
              key="photos"
              title={
                <div className="tab-title">
                  <MdPhotoLibrary />
                  <span>Mis Fotos ({stats.photos})</span>
                </div>
              }>
              <div className="tab-content photos-content">
                {userPhotos.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <FaCamera />
                    </div>
                    <h3>No has subido fotos aún</h3>
                    <p>Compartí tus momentos scouts con el grupo</p>
                    <Button
                      className="upload-btn"
                      color="warning"
                      onClick={() => navigate('/galeria')}>
                      Subir fotos
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Filtros por estado */}
                    <div className="photos-filters">
                      <Chip color="success" variant="flat" startContent={<FaCheck />}>
                        {stats.approved} Aprobadas
                      </Chip>
                      <Chip color="warning" variant="flat" startContent={<FaClock />}>
                        {stats.pending} Pendientes
                      </Chip>
                      {userPhotos.filter((p) => p.status === 'rejected').length > 0 && (
                        <Chip color="danger" variant="flat" startContent={<FaTimes />}>
                          {userPhotos.filter((p) => p.status === 'rejected').length} Rechazadas
                        </Chip>
                      )}
                    </div>

                    {/* Grid de fotos */}
                    <div className="photos-grid">
                      {userPhotos.map((photo) => (
                        <div
                          key={photo.id}
                          className={`photo-card ${photo.status}`}
                          onClick={() => openPhotoModal(photo)}>
                          <Image
                            src={photo.thumbnail_url || photo.image_url}
                            alt={photo.title}
                            className="photo-image"
                            loading="lazy"
                          />
                          <div className="photo-overlay">
                            <span className="photo-title">{photo.title}</span>
                            <Chip size="sm" className={`status-chip ${photo.status}`}>
                              {photo.status === 'approved' && (
                                <>
                                  <FaCheck /> Aprobada
                                </>
                              )}
                              {photo.status === 'pending' && (
                                <>
                                  <FaClock /> Pendiente
                                </>
                              )}
                              {photo.status === 'rejected' && (
                                <>
                                  <FaTimes /> Rechazada
                                </>
                              )}
                            </Chip>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Tab>

            {/* Tab de Insignias */}
            <Tab
              key="badges"
              title={
                <div className="tab-title">
                  <MdBadge />
                  <span>Insignias</span>
                </div>
              }>
              <div className="tab-content badges-content">
                {/* Progresiones */}
                <div className="badges-section">
                  <div className="section-header">
                    <FaMedal className="section-icon progressions" />
                    <h3>Progresiones</h3>
                    <Chip size="sm" variant="flat">
                      {stats.progressions}
                    </Chip>
                  </div>

                  {stats.progressions === 0 ? (
                    <div className="empty-badges-section">
                      <p>No tenés progresiones asignadas aún</p>
                      <span className="hint">
                        Las progresiones son otorgadas por los dirigentes
                      </span>
                    </div>
                  ) : (
                    <div className="badges-grid">
                      {profile?.user_progressions?.map((prog) => (
                        <Card key={prog.id} className="badge-card progression">
                          <CardBody>
                            <div className="badge-icon">
                              <FaMedal />
                            </div>
                            <h4>{prog.progression_name}</h4>
                            <span className="badge-date">
                              <FaCalendarAlt />
                              {new Date(prog.awarded_at).toLocaleDateString('es-AR')}
                            </span>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Especialidades */}
                <div className="badges-section">
                  <div className="section-header">
                    <FaStar className="section-icon specialties" />
                    <h3>Especialidades</h3>
                    <Chip size="sm" variant="flat">
                      {stats.specialties}
                    </Chip>
                  </div>

                  {stats.specialties === 0 ? (
                    <div className="empty-badges-section">
                      <p>No tenés especialidades asignadas aún</p>
                      <span className="hint">
                        Explorá las especialidades disponibles en la{' '}
                        <a href="/guia/specialties" className="link">
                          guía
                        </a>
                      </span>
                    </div>
                  ) : (
                    <div className="badges-grid">
                      {profile?.user_specialties?.map((spec) => (
                        <Card key={spec.id} className="badge-card specialty">
                          <CardBody>
                            <div className="badge-icon">
                              <FaStar />
                            </div>
                            <h4>{spec.specialty_name}</h4>
                            <Chip size="sm" className={`level-chip ${spec.level}`}>
                              {spec.level === 'basic' && 'Básico'}
                              {spec.level === 'advanced' && 'Avanzado'}
                              {spec.level === 'master' && 'Maestro'}
                            </Chip>
                            <span className="badge-date">
                              <FaCalendarAlt />
                              {new Date(spec.awarded_at).toLocaleDateString('es-AR')}
                            </span>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </section>
      </div>

      {/* Modal de Edición de Perfil */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg" className="edit-profile-modal">
        <ModalContent>
          <ModalHeader className="modal-header">
            <FaEdit />
            Editar Perfil
          </ModalHeader>
          <ModalBody className="modal-body">
            <div className="edit-form">
              <Input
                label="Nombre"
                placeholder="Tu nombre completo"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                startContent={<FaUser className="input-icon" />}
              />

              <Select
                label="Rama"
                placeholder="Seleccioná tu rama"
                selectedKeys={editForm.branch ? [editForm.branch] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  setEditForm({ ...editForm, branch: selected || '' });
                }}
                popoverProps={{
                  classNames: {
                    content: 'z-[9999]'
                  },
                  portalContainer: document.body
                }}>
                {Object.entries(branchesData).map(([key, data]) => (
                  <SelectItem key={key} value={key}>
                    {data.icon} {data.name} ({data.age})
                  </SelectItem>
                ))}
              </Select>

              <div className="promise-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editForm.is_promised}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        is_promised: e.target.checked,
                        promise_date: e.target.checked ? editForm.promise_date : ''
                      })
                    }
                  />
                  <span>Ya hice mi promesa scout</span>
                </label>

                {editForm.is_promised && (
                  <Input
                    type="date"
                    label="Fecha de promesa"
                    value={editForm.promise_date}
                    onChange={(e) => setEditForm({ ...editForm, promise_date: e.target.value })}
                    className="date-input"
                  />
                )}
              </div>

              <Textarea
                label="Biografía"
                placeholder="Contanos un poco sobre vos..."
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                maxLength={300}
                description={`${editForm.bio.length}/300 caracteres`}
              />
            </div>
          </ModalBody>
          <ModalFooter className="modal-footer">
            <Button variant="flat" onClick={onEditClose}>
              Cancelar
            </Button>
            <Button color="warning" onClick={handleSaveProfile} isLoading={saving}>
              Guardar cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Foto */}
      <Modal isOpen={isPhotoOpen} onClose={onPhotoClose} size="4xl" className="photo-modal">
        <ModalContent>
          {selectedPhoto && (
            <>
              <ModalHeader className="photo-modal-header">
                {selectedPhoto.title}
                <Chip size="sm" className={`status-chip ${selectedPhoto.status}`}>
                  {selectedPhoto.status === 'approved' && 'Aprobada'}
                  {selectedPhoto.status === 'pending' && 'Pendiente'}
                  {selectedPhoto.status === 'rejected' && 'Rechazada'}
                </Chip>
              </ModalHeader>
              <ModalBody className="photo-modal-body">
                <Image
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.title}
                  className="photo-full"
                />
                <div className="photo-details">
                  <div className="detail-item">
                    <span className="label">Categoría</span>
                    <span className="value">{selectedPhoto.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Subida</span>
                    <span className="value">
                      {new Date(selectedPhoto.created_at).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {selectedPhoto.description && (
                    <div className="detail-item full">
                      <span className="label">Descripción</span>
                      <span className="value">{selectedPhoto.description}</span>
                    </div>
                  )}
                  {selectedPhoto.status === 'rejected' && selectedPhoto.rejection_reason && (
                    <div className="detail-item full rejection">
                      <span className="label">Motivo de rechazo</span>
                      <span className="value">{selectedPhoto.rejection_reason}</span>
                    </div>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Footer />
    </PageContainer>
  );
};
