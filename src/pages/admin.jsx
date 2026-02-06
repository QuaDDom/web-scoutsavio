import React, { useState, useEffect, useCallback } from 'react';
import './admin.scss';
import { PageContainer } from '../components/PageContainer';
import { SEO } from '../components/SEO';
import { adminService, notificationService, authService } from '../lib/supabase';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Spinner,
  Chip,
  Tabs,
  Tab,
  Select,
  SelectItem,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio
} from '@nextui-org/react';
import {
  FaCheck,
  FaTimes,
  FaSignInAlt,
  FaSignOutAlt,
  FaImages,
  FaExclamationTriangle,
  FaUsers,
  FaSearch,
  FaTrash,
  FaEye,
  FaEdit,
  FaMedal,
  FaStar,
  FaHandPaper,
  FaEllipsisV,
  FaPlus,
  FaUndo,
  FaBell,
  FaPaperPlane,
  FaFile,
  FaUpload,
  FaBox,
  FaCalendar,
  FaUserCheck,
  FaUserTimes
} from 'react-icons/fa';
import { MdPhotoLibrary, MdPending, MdVerified, MdNotifications } from 'react-icons/md';
import { AdminProducts } from '../components/Admin/AdminProducts';
import { AdminEvents } from '../components/Admin/AdminEvents';

// Imágenes de especialidades
import arteImg from '../assets/specialties/arte.png';
import cienciaImg from '../assets/specialties/ciencia.png';
import deporteImg from '../assets/specialties/deporte.png';
import espiritualidadImg from '../assets/specialties/espiritualidad.png';
import naturalezaImg from '../assets/specialties/naturaleza.png';
import servicioImg from '../assets/specialties/servicio.png';

// Imágenes de progresiones - Manada
import pataTiernaImg from '../assets/progressions/manada/Pata-Tierna.png';
import saltadorImg from '../assets/progressions/manada/Saltador.png';
import rastreadorImg from '../assets/progressions/manada/Rastreador.png';
import cazadorImg from '../assets/progressions/manada/Cazador.png';
import manadaCompletaImg from '../assets/progressions/manada/Completa.png';

// Imágenes de progresiones - Unidad
import pistaImg from '../assets/progressions/unidad/Pista.png';
import sendaImg from '../assets/progressions/unidad/Senda.png';
import rumboImg from '../assets/progressions/unidad/Rumbo.png';
import travesiaImg from '../assets/progressions/unidad/Travesia.png';
import unidadCompletaImg from '../assets/progressions/unidad/Completa.png';

// Imágenes de progresiones - Caminantes
import norteImg from '../assets/progressions/caminantes/Norte.png';
import esteImg from '../assets/progressions/caminantes/Este.png';
import surImg from '../assets/progressions/caminantes/Sur.png';
import oesteImg from '../assets/progressions/caminantes/Oeste.png';
import caminantesCompletaImg from '../assets/progressions/caminantes/Completa.png';

// Imágenes de progresiones - Rovers
import encuentroImg from '../assets/progressions/rovers/Encuentro.png';
import compromisoImg from '../assets/progressions/rovers/Compromiso.png';
import proyeccionImg from '../assets/progressions/rovers/Proyeccion.png';
import roversCompletaImg from '../assets/progressions/rovers/Completa.png';

// Lista de emails de administradores autorizados (debe coincidir con api/lib/supabase.js)
const ADMIN_EMAILS = [
  'scoutsavio331@gmail.com',
  'matquadev@gmail.com',
  'burgosagostina60@gmail.com',
  'vickyrivero.scout@gmail.com',
  'monjesana@gmail.com',
  'psicocecirodriguez@gmail.com',
  'leitogottero@gmail.com'
];

// Verificar si un email es admin
const isAdmin = (email) => ADMIN_EMAILS.includes(email?.toLowerCase());

// Datos de especialidades
const specialtiesData = [
  { id: 'arte', name: 'Arte', img: arteImg, color: '#9025bb' },
  { id: 'ciencia', name: 'Ciencia y Tecnología', img: cienciaImg, color: '#00bfff' },
  { id: 'deporte', name: 'Deporte', img: deporteImg, color: '#0e0d5d' },
  { id: 'servicio', name: 'Servicio a los demás', img: servicioImg, color: '#e71b1b' },
  { id: 'naturaleza', name: 'Naturaleza', img: naturalezaImg, color: '#1f6a2a' },
  { id: 'espiritualidad', name: 'Espiritualidad', img: espiritualidadImg, color: '#f0e000' }
];

// Datos de ramas y progresiones con imágenes
const branchesData = {
  manada: {
    name: 'Manada',
    color: '#ff9800',
    progressions: [
      { id: 'pata-tierna', name: 'Pata Tierna', img: pataTiernaImg },
      { id: 'saltador', name: 'Saltador', img: saltadorImg },
      { id: 'rastreador', name: 'Rastreador', img: rastreadorImg },
      { id: 'cazador', name: 'Cazador', img: cazadorImg },
      { id: 'completa', name: 'Progresión Completa', img: manadaCompletaImg }
    ]
  },
  unidad: {
    name: 'Unidad',
    color: '#4caf50',
    progressions: [
      { id: 'pista', name: 'Pista', img: pistaImg },
      { id: 'senda', name: 'Senda', img: sendaImg },
      { id: 'rumbo', name: 'Rumbo', img: rumboImg },
      { id: 'travesia', name: 'Travesía', img: travesiaImg },
      { id: 'completa', name: 'Progresión Completa', img: unidadCompletaImg }
    ]
  },
  caminantes: {
    name: 'Caminantes',
    color: '#2196f3',
    progressions: [
      { id: 'norte', name: 'Norte', img: norteImg },
      { id: 'este', name: 'Este', img: esteImg },
      { id: 'sur', name: 'Sur', img: surImg },
      { id: 'oeste', name: 'Oeste', img: oesteImg },
      { id: 'completa', name: 'Progresión Completa', img: caminantesCompletaImg }
    ]
  },
  rover: {
    name: 'Rover',
    color: '#e53935',
    progressions: [
      { id: 'encuentro', name: 'Encuentro', img: encuentroImg },
      { id: 'compromiso', name: 'Compromiso', img: compromisoImg },
      { id: 'proyeccion', name: 'Proyección', img: proyeccionImg },
      { id: 'completa', name: 'Progresión Completa', img: roversCompletaImg }
    ]
  }
};

// Función auxiliar para obtener imagen de progresión
const getProgressionImage = (progressionId, branch) => {
  const branchData = branchesData[branch];
  if (!branchData) return null;
  const prog = branchData.progressions.find(
    (p) => p.id === progressionId || p.name.toLowerCase() === progressionId?.toLowerCase()
  );
  return prog?.img || null;
};

// Función auxiliar para obtener imagen de especialidad
const getSpecialtyImage = (specialtyId) => {
  const spec = specialtiesData.find(
    (s) => s.id === specialtyId || s.name.toLowerCase() === specialtyId?.toLowerCase()
  );
  return spec?.img || null;
};

export const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  // Estados para fotos
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [photoFilter, setPhotoFilter] = useState('all');
  const [photoPage, setPhotoPage] = useState(1);
  const [photoTotal, setPhotoTotal] = useState(0);

  // Estados para usuarios
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Estados para modales
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Modales
  const { isOpen: isRejectOpen, onOpen: onRejectOpen, onClose: onRejectClose } = useDisclosure();
  const {
    isOpen: isPhotoViewOpen,
    onOpen: onPhotoViewOpen,
    onClose: onPhotoViewClose
  } = useDisclosure();
  const {
    isOpen: isUserEditOpen,
    onOpen: onUserEditOpen,
    onClose: onUserEditClose
  } = useDisclosure();
  const {
    isOpen: isAddBadgeOpen,
    onOpen: onAddBadgeOpen,
    onClose: onAddBadgeClose
  } = useDisclosure();

  // Form para editar usuario
  const [userEditForm, setUserEditForm] = useState({
    branch: '',
    is_promised: false,
    promise_date: ''
  });

  // Form para agregar insignia
  const [badgeForm, setBadgeForm] = useState({
    type: 'progression',
    name: '',
    level: 'basic'
  });

  // Estados para notificaciones
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'general',
    sendMode: 'all', // 'all' | 'branch' | 'users'
    selectedBranch: '',
    selectedUsers: []
  });
  const [attachments, setAttachments] = useState([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Modal para enviar notificación
  const {
    isOpen: isNotificationOpen,
    onOpen: onNotificationOpen,
    onClose: onNotificationClose
  } = useDisclosure();

  const notificationTypes = [
    { key: 'general', label: 'General', icon: '📢' },
    { key: 'payment', label: 'Aviso de Pago', icon: '💰' },
    { key: 'document', label: 'Documento', icon: '📄' },
    { key: 'permission', label: 'Permiso', icon: '📝' },
    { key: 'urgent', label: 'Urgente', icon: '🚨' },
    { key: 'activity', label: 'Actividad', icon: '🏕️' }
  ];

  const getToken = async () => {
    return await authService.getAccessToken();
  };

  useEffect(() => {
    let isMounted = true;

    // Patrón exacto de la documentación de Supabase
    const {
      data: { subscription }
    } = authService.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      } else if (session) {
        setUser(session.user);
        setLoading(false);
        // Diferir operaciones de Supabase para después del callback
        setTimeout(() => {
          if (isMounted && session.access_token) {
            loadPendingPhotos(session.access_token);
          }
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await authService.signInWithGoogle('/admin');
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error al iniciar sesión');
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setPendingPhotos([]);
    setAllPhotos([]);
    setUsers([]);
  };

  // ========== FOTOS ==========
  const loadPendingPhotos = async (token) => {
    setLoadingPhotos(true);
    try {
      const result = await adminService.getPendingPhotos(token);
      setPendingPhotos(result.photos || []);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
    setLoadingPhotos(false);
  };

  const loadAllPhotos = async (status = 'all', page = 1) => {
    setLoadingPhotos(true);
    try {
      const token = await getToken();
      const result = await adminService.getAllPhotos(token, status, page, 20);
      setAllPhotos(result.photos || []);
      setPhotoTotal(result.total_pages || 1);
    } catch (error) {
      console.error('Error loading all photos:', error);
    }
    setLoadingPhotos(false);
  };

  const handleApprove = async (photo) => {
    setProcessing(true);
    try {
      const token = await getToken();
      const result = await adminService.approvePhoto(token, photo.id);
      if (result.success) {
        setPendingPhotos(pendingPhotos.filter((p) => p.id !== photo.id));
        if (activeTab === 'all-photos') loadAllPhotos(photoFilter, photoPage);
      } else {
        alert('Error al aprobar la foto');
      }
    } catch (error) {
      console.error('Error approving:', error);
      alert('Error al aprobar la foto');
    }
    setProcessing(false);
  };

  const handleReject = async () => {
    if (!selectedPhoto) return;
    setProcessing(true);
    try {
      const token = await getToken();
      const result = await adminService.rejectPhoto(token, selectedPhoto.id, rejectReason);
      if (result.success) {
        setPendingPhotos(pendingPhotos.filter((p) => p.id !== selectedPhoto.id));
        if (activeTab === 'all-photos') loadAllPhotos(photoFilter, photoPage);
        onRejectClose();
        setRejectReason('');
        setSelectedPhoto(null);
      } else {
        alert('Error al rechazar la foto');
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Error al rechazar la foto');
    }
    setProcessing(false);
  };

  const handleDeletePhoto = async (photo) => {
    if (!confirm('¿Eliminar esta foto permanentemente?')) return;
    setProcessing(true);
    try {
      const token = await getToken();
      const result = await adminService.deletePhoto(token, photo.id);
      if (result.success) {
        setAllPhotos(allPhotos.filter((p) => p.id !== photo.id));
        setPendingPhotos(pendingPhotos.filter((p) => p.id !== photo.id));
      } else {
        alert('Error al eliminar la foto');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error al eliminar la foto');
    }
    setProcessing(false);
  };

  const handleRestorePhoto = async (photo) => {
    setProcessing(true);
    try {
      const token = await getToken();
      const result = await adminService.restorePhoto(token, photo.id);
      if (result.success) loadAllPhotos(photoFilter, photoPage);
      else alert('Error al restaurar la foto');
    } catch (error) {
      console.error('Error restoring:', error);
    }
    setProcessing(false);
  };

  const openRejectModal = (photo) => {
    setSelectedPhoto(photo);
    onRejectOpen();
  };
  const openPhotoView = (photo) => {
    setSelectedPhoto(photo);
    onPhotoViewOpen();
  };

  // ========== USUARIOS ==========
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = await getToken();
      const result = await adminService.getAllUsers(token, userSearch);
      setUsers(result.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setLoadingUsers(false);
  };

  const openUserEdit = (u) => {
    setSelectedUser(u);
    setUserEditForm({
      branch: u.branch || '',
      is_promised: u.is_promised || false,
      promise_date: u.promise_date || ''
    });
    onUserEditOpen();
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    setProcessing(true);
    try {
      const token = await getToken();
      const result = await adminService.updateUserProfile(token, selectedUser.id, userEditForm);
      if (result.success) {
        loadUsers();
        onUserEditClose();
      } else alert('Error al actualizar usuario');
    } catch (error) {
      console.error('Error updating user:', error);
    }
    setProcessing(false);
  };

  const openAddBadge = (u) => {
    setSelectedUser(u);
    setBadgeForm({ type: 'progression', name: '', level: 'basic' });
    onAddBadgeOpen();
  };

  const handleAddBadge = async () => {
    if (!selectedUser || !badgeForm.name) return;
    setProcessing(true);
    try {
      const token = await getToken();
      let result;
      if (badgeForm.type === 'progression') {
        // Buscar la progresión seleccionada para obtener el nombre
        const selectedProg = branchesData[selectedUser.branch]?.progressions.find(
          (p) => p.id === badgeForm.name
        );
        result = await adminService.addProgression(token, selectedUser.id, {
          progression_id: badgeForm.name,
          progression_name: selectedProg?.name || badgeForm.name
        });
      } else {
        // Buscar la especialidad seleccionada para obtener el nombre
        const selectedSpec = specialtiesData.find((s) => s.id === badgeForm.name);
        result = await adminService.addSpecialty(token, selectedUser.id, {
          specialty_id: badgeForm.name,
          specialty_name: selectedSpec?.name || badgeForm.name,
          level: badgeForm.level
        });
      }
      if (result.success) {
        loadUsers();
        onAddBadgeClose();
      } else alert('Error al agregar insignia');
    } catch (error) {
      console.error('Error adding badge:', error);
    }
    setProcessing(false);
  };

  const handleRemoveBadge = async (badgeId, type) => {
    if (!confirm('¿Eliminar esta insignia?')) return;
    try {
      const token = await getToken();
      const result = await adminService.removeBadge(token, badgeId, type);
      if (result.success) loadUsers();
    } catch (error) {
      console.error('Error removing badge:', error);
    }
  };

  const handleVerifyUser = async (userId, verified) => {
    try {
      const token = await getToken();
      const result = await adminService.verifyUser(token, userId, verified);
      if (result.success) {
        loadUsers();
      } else {
        alert('Error al cambiar verificación');
      }
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  // === FUNCIONES DE NOTIFICACIONES ===
  const loadSentNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const data = await notificationService.getAllNotifications();
      setSentNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
    setLoadingNotifications(false);
  };

  const handleAttachmentUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingAttachment(true);
    try {
      for (const file of files) {
        const result = await notificationService.uploadAttachment(file);
        if (result.success) {
          setAttachments((prev) => [...prev, result.attachment]);
        } else {
          alert(`Error subiendo ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Error uploading:', error);
    }
    setUploadingAttachment(false);
    e.target.value = '';
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendNotification = async () => {
    if (!notificationForm.title.trim() || !notificationForm.message.trim()) {
      alert('Por favor completa el título y mensaje');
      return;
    }

    // Validar selección según el modo
    if (notificationForm.sendMode === 'branch' && !notificationForm.selectedBranch) {
      alert('Por favor selecciona una rama');
      return;
    }

    if (notificationForm.sendMode === 'users' && notificationForm.selectedUsers.length === 0) {
      alert('Por favor selecciona al menos un usuario');
      return;
    }

    setSendingNotification(true);
    try {
      // Determinar destinatarios según el modo de envío
      let recipientIds = null;
      let targetBranch = null;

      if (notificationForm.sendMode === 'branch') {
        targetBranch = notificationForm.selectedBranch;
      } else if (notificationForm.sendMode === 'users') {
        recipientIds = notificationForm.selectedUsers;
      }

      const result = await notificationService.createNotification({
        title: notificationForm.title,
        message: notificationForm.message,
        type: notificationForm.type,
        recipientIds,
        targetBranch,
        attachments: attachments,
        createdBy: user.id
      });

      if (result.success) {
        let successMsg = 'Notificación enviada correctamente';
        if (result.recipientCount) {
          successMsg += ` a ${result.recipientCount} usuarios de ${branchesData[notificationForm.selectedBranch]?.name}`;
        }
        alert(successMsg);
        setNotificationForm({
          title: '',
          message: '',
          type: 'general',
          sendMode: 'all',
          selectedBranch: '',
          selectedUsers: []
        });
        setAttachments([]);
        onNotificationClose();
        loadSentNotifications();
      } else {
        alert(result.error || 'Error al enviar notificación');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error al enviar notificación');
    }
    setSendingNotification(false);
  };

  const openNotificationModal = () => {
    // Cargar usuarios si no están cargados
    if (users.length === 0) {
      loadUsers();
    }
    onNotificationOpen();
  };

  useEffect(() => {
    if (activeTab === 'all-photos' && user) loadAllPhotos(photoFilter, photoPage);
    else if (activeTab === 'users' && user) loadUsers();
    else if (activeTab === 'notifications' && user) loadSentNotifications();
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab === 'all-photos') {
      loadAllPhotos(photoFilter, 1);
      setPhotoPage(1);
    }
  }, [photoFilter]);

  useEffect(() => {
    if (activeTab === 'all-photos') loadAllPhotos(photoFilter, photoPage);
  }, [photoPage]);

  if (loading) {
    return (
      <PageContainer>
        <div className="admin-loading">
          <Spinner size="lg" color="warning" />
          <p>Cargando...</p>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <SEO title="Admin" url="/admin" />
        <div className="admin-login">
          <Card className="login-card">
            <CardBody>
              <div className="login-content">
                <FaImages className="login-icon" />
                <h1>Panel de Administración</h1>
                <p>Inicia sesión para gestionar el grupo scout</p>
                <Button
                  className="login-btn"
                  onPress={signInWithGoogle}
                  startContent={<FaSignInAlt />}
                  size="lg">
                  Iniciar sesión con Google
                </Button>
                <p className="login-note">Solo los administradores autorizados pueden acceder</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </PageContainer>
    );
  }

  // Verificar si el usuario es admin
  if (!isAdmin(user.email)) {
    return (
      <PageContainer>
        <SEO title="Acceso Denegado" url="/admin" />
        <div className="admin-login">
          <Card className="login-card">
            <CardBody>
              <div className="login-content">
                <FaExclamationTriangle className="login-icon denied" />
                <h1>Acceso Denegado</h1>
                <p>Tu cuenta ({user.email}) no tiene permisos de administrador.</p>
                <p className="login-note">
                  Si creés que esto es un error, contactá con los administradores del grupo.
                </p>
                <Button
                  variant="bordered"
                  onPress={signOut}
                  startContent={<FaSignOutAlt />}
                  className="logout-btn">
                  Cerrar sesión
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SEO title="Panel de Administración" url="/admin" />
      <div className="admin-page">
        <div className="admin-header">
          <div className="header-info">
            <h1>Panel de Administración</h1>
            <p>Bienvenido, {user.email}</p>
          </div>
          <Button
            variant="bordered"
            onPress={signOut}
            startContent={<FaSignOutAlt />}
            className="logout-btn">
            Cerrar sesión
          </Button>
        </div>

        <div className="admin-quick-stats">
          <div className="quick-stat pending">
            <MdPending />
            <span className="value">{pendingPhotos.length}</span>
            <span className="label">Pendientes</span>
          </div>
          <div className="quick-stat users">
            <FaUsers />
            <span className="value">{users.length}</span>
            <span className="label">Usuarios</span>
          </div>
        </div>

        <Tabs
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          className="admin-tabs"
          color="warning"
          variant="underlined"
          size="lg">
          <Tab
            key="pending"
            title={
              <div className="tab-title">
                <MdPending />
                <span>Pendientes</span>
                {pendingPhotos.length > 0 && (
                  <Chip size="sm" color="warning">
                    {pendingPhotos.length}
                  </Chip>
                )}
              </div>
            }>
            <div className="tab-content">
              {loadingPhotos ? (
                <div className="admin-loading inline">
                  <Spinner size="lg" color="warning" />
                  <p>Cargando...</p>
                </div>
              ) : pendingPhotos.length === 0 ? (
                <div className="admin-empty">
                  <FaCheck className="empty-icon" />
                  <h2>¡Todo revisado!</h2>
                  <p>No hay fotos pendientes</p>
                </div>
              ) : (
                <div className="photos-grid">
                  {pendingPhotos.map((photo) => (
                    <Card key={photo.id} className="photo-card">
                      <CardBody>
                        <div className="photo-preview" onClick={() => openPhotoView(photo)}>
                          <img
                            src={photo.image_url}
                            alt={photo.title}
                            className="photo-img"
                            loading="lazy"
                          />
                        </div>
                        <div className="photo-info">
                          <h3>{photo.title}</h3>
                          <Chip size="sm" variant="flat">
                            {photo.category}
                          </Chip>
                          <div className="uploader-info">
                            <p>
                              <strong>De:</strong> {photo.uploader_name}
                            </p>
                            <p>
                              <strong>Email:</strong> {photo.uploader_email}
                            </p>
                          </div>
                          <p className="photo-date">
                            {new Date(photo.created_at).toLocaleDateString('es-AR')}
                          </p>
                        </div>
                        <div className="photo-actions">
                          <Button
                            color="success"
                            onPress={() => handleApprove(photo)}
                            isDisabled={processing}
                            startContent={<FaCheck />}
                            className="approve-btn">
                            Aprobar
                          </Button>
                          <Button
                            color="danger"
                            variant="bordered"
                            onPress={() => openRejectModal(photo)}
                            isDisabled={processing}
                            startContent={<FaTimes />}
                            className="reject-btn">
                            Rechazar
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Tab>

          <Tab
            key="all-photos"
            title={
              <div className="tab-title">
                <MdPhotoLibrary />
                <span>Todas las Fotos</span>
              </div>
            }>
            <div className="tab-content">
              <div className="photos-toolbar">
                <Select
                  label="Estado"
                  selectedKeys={[photoFilter]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    setPhotoFilter(selected || 'all');
                  }}
                  className="filter-select"
                  size="sm">
                  <SelectItem key="all" value="all" textValue="Todas">
                    Todas
                  </SelectItem>
                  <SelectItem key="approved" value="approved" textValue="Aprobadas">
                    Aprobadas
                  </SelectItem>
                  <SelectItem key="pending" value="pending" textValue="Pendientes">
                    Pendientes
                  </SelectItem>
                  <SelectItem key="rejected" value="rejected" textValue="Rechazadas">
                    Rechazadas
                  </SelectItem>
                </Select>
                <Button
                  variant="flat"
                  startContent={<FaUndo />}
                  onPress={() => loadAllPhotos(photoFilter, photoPage)}
                  size="sm">
                  Recargar
                </Button>
              </div>

              {loadingPhotos ? (
                <div className="admin-loading inline">
                  <Spinner size="lg" color="warning" />
                </div>
              ) : allPhotos.length === 0 ? (
                <div className="admin-empty small">
                  <FaImages className="empty-icon small" />
                  <p>No hay fotos</p>
                </div>
              ) : (
                <>
                  <div className="photos-table-grid">
                    {allPhotos.map((photo) => (
                      <Card key={photo.id} className={`photo-card compact ${photo.status}`}>
                        <CardBody>
                          <div className="photo-preview small" onClick={() => openPhotoView(photo)}>
                            <img src={photo.thumbnail_url || photo.image_url} alt={photo.title} />
                            <Chip size="sm" className={`status-badge ${photo.status}`}>
                              {photo.status === 'approved' && 'Aprobada'}
                              {photo.status === 'pending' && 'Pendiente'}
                              {photo.status === 'rejected' && 'Rechazada'}
                            </Chip>
                          </div>
                          <div className="photo-info compact">
                            <h4>{photo.title}</h4>
                            <span className="photo-meta">
                              {photo.category} •{' '}
                              {new Date(photo.created_at).toLocaleDateString('es-AR')}
                            </span>
                          </div>
                          <div className="photo-actions-dropdown">
                            <Dropdown>
                              <DropdownTrigger>
                                <Button isIconOnly variant="flat" size="sm">
                                  <FaEllipsisV />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu aria-label="Acciones">
                                <DropdownItem
                                  key="view"
                                  startContent={<FaEye />}
                                  onPress={() => openPhotoView(photo)}>
                                  Ver
                                </DropdownItem>
                                {photo.status !== 'approved' && (
                                  <DropdownItem
                                    key="approve"
                                    startContent={<FaCheck />}
                                    onPress={() => handleApprove(photo)}>
                                    Aprobar
                                  </DropdownItem>
                                )}
                                {photo.status !== 'rejected' && (
                                  <DropdownItem
                                    key="reject"
                                    startContent={<FaTimes />}
                                    onPress={() => openRejectModal(photo)}>
                                    Rechazar
                                  </DropdownItem>
                                )}
                                {photo.status === 'rejected' && (
                                  <DropdownItem
                                    key="restore"
                                    startContent={<FaUndo />}
                                    onPress={() => handleRestorePhoto(photo)}>
                                    Restaurar
                                  </DropdownItem>
                                )}
                                <DropdownItem
                                  key="delete"
                                  startContent={<FaTrash />}
                                  className="text-danger"
                                  color="danger"
                                  onPress={() => handleDeletePhoto(photo)}>
                                  Eliminar
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                  {photoTotal > 1 && (
                    <div className="pagination-container">
                      <Pagination
                        total={photoTotal}
                        page={photoPage}
                        onChange={setPhotoPage}
                        color="warning"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </Tab>

          <Tab
            key="users"
            title={
              <div className="tab-title">
                <FaUsers />
                <span>Usuarios</span>
              </div>
            }>
            <div className="tab-content">
              <div className="users-toolbar">
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  startContent={<FaSearch />}
                  className="search-input"
                  onKeyPress={(e) => e.key === 'Enter' && loadUsers()}
                />
                <Button color="warning" onPress={loadUsers} startContent={<FaSearch />}>
                  Buscar
                </Button>
              </div>

              {loadingUsers ? (
                <div className="admin-loading inline">
                  <Spinner size="lg" color="warning" />
                </div>
              ) : users.length === 0 ? (
                <div className="admin-empty small">
                  <FaUsers className="empty-icon small" />
                  <p>No se encontraron usuarios</p>
                </div>
              ) : (
                <div className="users-grid">
                  {users.map((u) => (
                    <Card
                      key={u.id}
                      className={`user-card ${u.is_verified ? 'verified' : 'unverified'}`}>
                      <CardBody>
                        <div className="user-header">
                          <div className="avatar-wrapper">
                            <Avatar
                              src={u.avatar_url}
                              showFallback
                              size="lg"
                              className="user-avatar"
                            />
                            {u.is_verified ? (
                              <span
                                className="verification-badge verified"
                                title="Usuario verificado">
                                <FaUserCheck />
                              </span>
                            ) : (
                              <span
                                className="verification-badge unverified"
                                title="Pendiente de verificación">
                                <FaUserTimes />
                              </span>
                            )}
                          </div>
                          <div className="user-info">
                            <h4>
                              {u.name}
                              {u.is_promised && <MdVerified className="verified" />}
                            </h4>
                            <p className="user-email">{u.email}</p>
                            <div className="user-chips">
                              {u.branch && (
                                <Chip
                                  size="sm"
                                  style={{
                                    backgroundColor: branchesData[u.branch]?.color,
                                    color: '#fff'
                                  }}>
                                  {branchesData[u.branch]?.name}
                                </Chip>
                              )}
                              <Chip
                                size="sm"
                                color={u.is_verified ? 'success' : 'danger'}
                                variant="flat">
                                {u.is_verified ? 'Verificado' : 'Sin verificar'}
                              </Chip>
                            </div>
                          </div>
                        </div>
                        <div className="user-badges">
                          {u.user_progressions?.length > 0 && (
                            <div className="badges-section">
                              <span className="badges-label">
                                <FaMedal /> Progresiones
                              </span>
                              <div className="badges-list">
                                {u.user_progressions.map((prog) => {
                                  const progImg = getProgressionImage(
                                    prog.progression_id,
                                    u.branch
                                  );
                                  return (
                                    <div key={prog.id} className="badge-item">
                                      {progImg && (
                                        <img
                                          src={progImg}
                                          alt={prog.progression_name}
                                          className="badge-img"
                                        />
                                      )}
                                      <Chip
                                        size="sm"
                                        variant="flat"
                                        color="warning"
                                        onClose={() => handleRemoveBadge(prog.id, 'progression')}>
                                        {prog.progression_name}
                                      </Chip>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {u.user_specialties?.length > 0 && (
                            <div className="badges-section">
                              <span className="badges-label">
                                <FaStar /> Especialidades
                              </span>
                              <div className="badges-list">
                                {u.user_specialties.map((spec) => {
                                  const specImg = getSpecialtyImage(spec.specialty_id);
                                  return (
                                    <div key={spec.id} className="badge-item">
                                      {specImg && (
                                        <img
                                          src={specImg}
                                          alt={spec.specialty_name}
                                          className="badge-img"
                                        />
                                      )}
                                      <Chip
                                        size="sm"
                                        variant="flat"
                                        color="secondary"
                                        onClose={() => handleRemoveBadge(spec.id, 'specialty')}>
                                        {spec.specialty_name} ({spec.level})
                                      </Chip>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="user-actions">
                          <Button
                            size="sm"
                            variant="flat"
                            color={u.is_verified ? 'danger' : 'success'}
                            startContent={u.is_verified ? <FaUserTimes /> : <FaUserCheck />}
                            onPress={() => handleVerifyUser(u.id, !u.is_verified)}>
                            {u.is_verified ? 'Quitar verificación' : 'Verificar'}
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            startContent={<FaEdit />}
                            onPress={() => openUserEdit(u)}>
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            color="warning"
                            startContent={<FaPlus />}
                            onPress={() => openAddBadge(u)}>
                            Agregar insignia
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Tab>

          <Tab
            key="notifications"
            title={
              <div className="tab-title">
                <MdNotifications />
                <span>Notificaciones</span>
              </div>
            }>
            <div className="tab-content">
              <div className="notifications-toolbar">
                <Button
                  color="warning"
                  onPress={openNotificationModal}
                  startContent={<FaPaperPlane />}>
                  Nueva Notificación
                </Button>
                <Button
                  variant="flat"
                  startContent={<FaUndo />}
                  onPress={loadSentNotifications}
                  size="sm">
                  Recargar
                </Button>
              </div>

              {loadingNotifications ? (
                <div className="admin-loading inline">
                  <Spinner size="lg" color="warning" />
                </div>
              ) : sentNotifications.length === 0 ? (
                <div className="admin-empty small">
                  <MdNotifications className="empty-icon small" />
                  <p>No hay notificaciones enviadas</p>
                </div>
              ) : (
                <div className="notifications-list">
                  {sentNotifications.map((notif) => (
                    <Card key={notif.id} className="notification-card-admin">
                      <CardBody>
                        <div className="notif-header">
                          <span className={`notif-type-badge ${notif.type}`}>
                            {notificationTypes.find((t) => t.key === notif.type)?.icon}
                            {notificationTypes.find((t) => t.key === notif.type)?.label ||
                              notif.type}
                          </span>
                          <span className="notif-date">
                            {new Date(notif.created_at).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <h4 className="notif-title">{notif.title}</h4>
                        <p className="notif-message">{notif.message}</p>
                        <div className="notif-meta">
                          <span className="notif-recipient">
                            {notif.recipient_id ? (
                              <>👤 {notif.profiles?.name || 'Usuario'}</>
                            ) : (
                              <>👥 Todos los usuarios</>
                            )}
                          </span>
                          {notif.attachments?.length > 0 && (
                            <span className="notif-attachments">
                              📎 {notif.attachments.length} archivo(s)
                            </span>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Tab>

          <Tab
            key="products"
            title={
              <div className="tab-title">
                <FaBox />
                <span>Productos</span>
              </div>
            }>
            <div className="tab-content">
              <AdminProducts />
            </div>
          </Tab>

          <Tab
            key="events"
            title={
              <div className="tab-title">
                <FaCalendar />
                <span>Eventos</span>
              </div>
            }>
            <div className="tab-content">
              <AdminEvents />
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* Modal Rechazar */}
      <Modal isOpen={isRejectOpen} onClose={onRejectClose}>
        <ModalContent>
          <ModalHeader>
            <FaExclamationTriangle className="modal-icon warning" /> Rechazar foto
          </ModalHeader>
          <ModalBody>
            <p>¿Rechazar esta foto? El usuario será notificado.</p>
            <Textarea
              label="Motivo del rechazo"
              placeholder="Explica por qué..."
              value={rejectReason}
              onValueChange={setRejectReason}
              minRows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onRejectClose}>
              Cancelar
            </Button>
            <Button color="danger" onPress={handleReject} isDisabled={processing}>
              {processing ? 'Procesando...' : 'Rechazar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Ver Foto */}
      <Modal isOpen={isPhotoViewOpen} onClose={onPhotoViewClose} size="4xl">
        <ModalContent>
          {selectedPhoto && (
            <>
              <ModalHeader>
                {selectedPhoto.title}{' '}
                <Chip size="sm" className={`status-chip ${selectedPhoto.status}`}>
                  {selectedPhoto.status}
                </Chip>
              </ModalHeader>
              <ModalBody>
                <div className="photo-view-content">
                  <img
                    src={selectedPhoto.image_url}
                    alt={selectedPhoto.title}
                    className="photo-view-img"
                  />
                  <div className="photo-view-info">
                    <p>
                      <strong>Categoría:</strong> {selectedPhoto.category}
                    </p>
                    <p>
                      <strong>Subido por:</strong> {selectedPhoto.uploader_name}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{' '}
                      {new Date(selectedPhoto.created_at).toLocaleDateString('es-AR')}
                    </p>
                    {selectedPhoto.rejection_reason && (
                      <p className="rejection-reason">
                        <strong>Motivo rechazo:</strong> {selectedPhoto.rejection_reason}
                      </p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                {selectedPhoto.status !== 'approved' && (
                  <Button
                    color="success"
                    onPress={() => {
                      handleApprove(selectedPhoto);
                      onPhotoViewClose();
                    }}>
                    Aprobar
                  </Button>
                )}
                {selectedPhoto.status !== 'rejected' && (
                  <Button
                    color="danger"
                    variant="bordered"
                    onPress={() => {
                      onPhotoViewClose();
                      openRejectModal(selectedPhoto);
                    }}>
                    Rechazar
                  </Button>
                )}
                <Button
                  color="danger"
                  onPress={() => {
                    handleDeletePhoto(selectedPhoto);
                    onPhotoViewClose();
                  }}>
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Editar Usuario */}
      <Modal isOpen={isUserEditOpen} onClose={onUserEditClose}>
        <ModalContent>
          <ModalHeader>
            <FaEdit className="modal-icon" /> Editar Usuario
          </ModalHeader>
          <ModalBody>
            {selectedUser && (
              <div className="user-edit-form">
                <div className="user-edit-header">
                  <Avatar src={selectedUser.avatar_url} size="lg" />
                  <div>
                    <h4>{selectedUser.name}</h4>
                    <p>{selectedUser.email}</p>
                  </div>
                </div>
                <Select
                  label="Rama"
                  placeholder="Seleccionar rama"
                  selectedKeys={userEditForm.branch ? [userEditForm.branch] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    setUserEditForm({ ...userEditForm, branch: selected || '' });
                  }}
                  popoverProps={{
                    classNames: { content: 'z-[9999]' },
                    portalContainer: document.body
                  }}>
                  {Object.entries(branchesData).map(([key, data]) => (
                    <SelectItem key={key} value={key} textValue={data.name}>
                      {data.name}
                    </SelectItem>
                  ))}
                </Select>
                <div className="promise-section">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={userEditForm.is_promised}
                      onChange={(e) =>
                        setUserEditForm({ ...userEditForm, is_promised: e.target.checked })
                      }
                    />
                    <FaHandPaper />
                    <span>Scout Prometido</span>
                  </label>
                  {userEditForm.is_promised && (
                    <Input
                      type="date"
                      label="Fecha de promesa"
                      value={userEditForm.promise_date}
                      onChange={(e) =>
                        setUserEditForm({ ...userEditForm, promise_date: e.target.value })
                      }
                    />
                  )}
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onUserEditClose}>
              Cancelar
            </Button>
            <Button color="warning" onPress={handleSaveUser} isDisabled={processing}>
              {processing ? 'Guardando...' : 'Guardar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Agregar Insignia */}
      <Modal isOpen={isAddBadgeOpen} onClose={onAddBadgeClose}>
        <ModalContent>
          <ModalHeader>
            <FaMedal className="modal-icon" /> Agregar Insignia
          </ModalHeader>
          <ModalBody>
            {selectedUser && (
              <div className="badge-form">
                <p className="badge-form-user">
                  Para: <strong>{selectedUser.name}</strong>
                </p>
                <Select
                  label="Tipo"
                  selectedKeys={[badgeForm.type]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    setBadgeForm({ ...badgeForm, type: selected || 'progression', name: '' });
                  }}
                  popoverProps={{
                    classNames: { content: 'z-[9999]' },
                    portalContainer: document.body
                  }}>
                  <SelectItem key="progression" value="progression" textValue="Progresión">
                    Progresión
                  </SelectItem>
                  <SelectItem key="specialty" value="specialty" textValue="Especialidad">
                    Especialidad
                  </SelectItem>
                </Select>
                {badgeForm.type === 'progression' && selectedUser.branch && (
                  <Select
                    label="Progresión"
                    placeholder="Seleccionar progresión"
                    selectedKeys={badgeForm.name ? [badgeForm.name] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      setBadgeForm({ ...badgeForm, name: selected || '' });
                    }}
                    popoverProps={{
                      classNames: { content: 'z-[9999]' },
                      portalContainer: document.body
                    }}>
                    {branchesData[selectedUser.branch]?.progressions.map((prog) => (
                      <SelectItem key={prog.id} value={prog.id} textValue={prog.name}>
                        <div className="badge-select-item">
                          <img src={prog.img} alt={prog.name} className="badge-select-img" />
                          <span>{prog.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                )}
                {badgeForm.type === 'specialty' && (
                  <>
                    <Select
                      label="Especialidad"
                      placeholder="Seleccionar especialidad"
                      selectedKeys={badgeForm.name ? [badgeForm.name] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0];
                        setBadgeForm({ ...badgeForm, name: selected || '' });
                      }}
                      popoverProps={{
                        classNames: { content: 'z-[9999]' },
                        portalContainer: document.body
                      }}>
                      {specialtiesData.map((spec) => (
                        <SelectItem key={spec.id} value={spec.id} textValue={spec.name}>
                          <div className="badge-select-item">
                            <img src={spec.img} alt={spec.name} className="badge-select-img" />
                            <span>{spec.name}</span>
                            <span
                              className="badge-select-color"
                              style={{ background: spec.color }}></span>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Nivel"
                      selectedKeys={[badgeForm.level]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0];
                        setBadgeForm({ ...badgeForm, level: selected || 'basic' });
                      }}
                      popoverProps={{
                        classNames: { content: 'z-[9999]' },
                        portalContainer: document.body
                      }}>
                      <SelectItem key="basic" value="basic" textValue="Básico">
                        Básico
                      </SelectItem>
                      <SelectItem key="advanced" value="advanced" textValue="Avanzado">
                        Avanzado
                      </SelectItem>
                      <SelectItem key="master" value="master" textValue="Maestro">
                        Maestro
                      </SelectItem>
                    </Select>
                  </>
                )}
                {badgeForm.type === 'progression' && !selectedUser.branch && (
                  <p className="warning-text">⚠️ Usuario sin rama asignada</p>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onAddBadgeClose}>
              Cancelar
            </Button>
            <Button
              color="warning"
              onPress={handleAddBadge}
              isDisabled={processing || !badgeForm.name}>
              {processing ? 'Agregando...' : 'Agregar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Enviar Notificación */}
      <Modal
        isOpen={isNotificationOpen}
        onClose={onNotificationClose}
        size="2xl"
        scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            <MdNotifications className="modal-icon" /> Nueva Notificación
          </ModalHeader>
          <ModalBody>
            <div className="notification-form">
              <Select
                label="Tipo de notificación"
                selectedKeys={[notificationForm.type]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  setNotificationForm({ ...notificationForm, type: selected || 'info' });
                }}
                popoverProps={{
                  classNames: { content: 'z-[9999]' },
                  portalContainer: document.body
                }}>
                {notificationTypes.map((type) => (
                  <SelectItem key={type.key} value={type.key} textValue={type.label}>
                    {type.icon} {type.label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Título"
                placeholder="Título de la notificación"
                value={notificationForm.title}
                onChange={(e) =>
                  setNotificationForm({ ...notificationForm, title: e.target.value })
                }
              />

              <Textarea
                label="Mensaje"
                placeholder="Escribe el mensaje de la notificación..."
                value={notificationForm.message}
                onChange={(e) =>
                  setNotificationForm({ ...notificationForm, message: e.target.value })
                }
                minRows={4}
              />

              <div className="recipient-selector">
                <p className="recipient-label">Destinatarios:</p>
                <RadioGroup
                  value={notificationForm.sendMode}
                  onValueChange={(value) =>
                    setNotificationForm({
                      ...notificationForm,
                      sendMode: value,
                      selectedBranch: '',
                      selectedUsers: []
                    })
                  }
                  orientation="horizontal"
                  className="send-mode-radio">
                  <Radio value="all">Todos los usuarios</Radio>
                  <Radio value="branch">Por rama</Radio>
                  <Radio value="users">Usuarios específicos</Radio>
                </RadioGroup>

                {notificationForm.sendMode === 'branch' && (
                  <div className="branch-select-section">
                    <Select
                      label="Seleccionar rama"
                      placeholder="Elige una rama"
                      selectedKeys={
                        notificationForm.selectedBranch ? [notificationForm.selectedBranch] : []
                      }
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0];
                        setNotificationForm({
                          ...notificationForm,
                          selectedBranch: selected || ''
                        });
                      }}
                      className="branch-select">
                      {Object.entries(branchesData).map(([key, data]) => (
                        <SelectItem
                          key={key}
                          value={key}
                          startContent={
                            <span className="branch-dot" style={{ backgroundColor: data.color }} />
                          }>
                          {data.name}
                        </SelectItem>
                      ))}
                    </Select>
                    {notificationForm.selectedBranch && (
                      <Chip
                        size="sm"
                        style={{
                          backgroundColor: branchesData[notificationForm.selectedBranch]?.color,
                          color: '#fff',
                          marginTop: '8px'
                        }}>
                        Enviando a: {branchesData[notificationForm.selectedBranch]?.name}
                      </Chip>
                    )}
                  </div>
                )}

                {notificationForm.sendMode === 'users' && (
                  <div className="user-select-list">
                    <p className="select-hint">Selecciona los destinatarios:</p>
                    {users.length === 0 ? (
                      <p className="no-users">Cargando usuarios...</p>
                    ) : (
                      <CheckboxGroup
                        value={notificationForm.selectedUsers}
                        onChange={(value) =>
                          setNotificationForm({ ...notificationForm, selectedUsers: value })
                        }
                        className="users-checkbox-group">
                        {users.map((u) => (
                          <Checkbox key={u.id} value={u.id}>
                            <div className="user-checkbox-item">
                              <Avatar src={u.avatar_url} size="sm" showFallback />
                              <span>{u.name}</span>
                              {u.branch && (
                                <Chip
                                  size="sm"
                                  style={{
                                    backgroundColor: branchesData[u.branch]?.color,
                                    color: '#fff',
                                    marginLeft: '8px'
                                  }}>
                                  {branchesData[u.branch]?.name}
                                </Chip>
                              )}
                            </div>
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    )}
                  </div>
                )}
              </div>

              <div className="attachments-section">
                <label className="attachments-label">
                  <FaFile /> Archivos adjuntos
                </label>

                <div className="attachments-list">
                  {attachments.map((att, index) => (
                    <div key={index} className="attachment-item">
                      <span className="att-name">{att.name}</span>
                      <span className="att-size">{(att.size / 1024).toFixed(1)} KB</span>
                      <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        isIconOnly
                        onPress={() => removeAttachment(index)}>
                        <FaTimes />
                      </Button>
                    </div>
                  ))}
                </div>

                <label className="upload-btn-label">
                  <input
                    type="file"
                    multiple
                    onChange={handleAttachmentUpload}
                    disabled={uploadingAttachment}
                    style={{ display: 'none' }}
                  />
                  <Button
                    as="span"
                    variant="bordered"
                    startContent={uploadingAttachment ? <Spinner size="sm" /> : <FaUpload />}
                    isDisabled={uploadingAttachment}>
                    {uploadingAttachment ? 'Subiendo...' : 'Subir archivo'}
                  </Button>
                </label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onNotificationClose}>
              Cancelar
            </Button>
            <Button
              color="warning"
              onPress={handleSendNotification}
              isDisabled={
                sendingNotification ||
                !notificationForm.title.trim() ||
                !notificationForm.message.trim()
              }
              startContent={sendingNotification ? <Spinner size="sm" /> : <FaPaperPlane />}>
              {sendingNotification ? 'Enviando...' : 'Enviar Notificación'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};
