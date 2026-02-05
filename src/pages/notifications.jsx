import React, { useState, useEffect } from 'react';
import '../styles/notifications.scss';
import { PageContainer } from '../components/PageContainer';
import { SEO } from '../components/SEO';
import { supabase, authService, notificationService } from '../lib/supabase';
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Spinner,
  Tabs,
  Tab
} from '@nextui-org/react';
import {
  FaBell,
  FaEnvelope,
  FaEnvelopeOpen,
  FaFile,
  FaFileAlt,
  FaFilePdf,
  FaMoneyBill,
  FaClipboardList,
  FaExclamationCircle,
  FaCheckCircle,
  FaSignInAlt,
  FaDownload,
  FaTrash,
  FaClock
} from 'react-icons/fa';
import { MdNotifications, MdMarkEmailRead } from 'react-icons/md';

export const Notifications = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filter, setFilter] = useState('all');

  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();

  const notificationTypes = {
    general: { icon: FaBell, label: 'General', color: 'default' },
    payment: { icon: FaMoneyBill, label: 'Pago', color: 'warning' },
    document: { icon: FaFileAlt, label: 'Documento', color: 'primary' },
    permission: { icon: FaClipboardList, label: 'Permiso', color: 'secondary' },
    urgent: { icon: FaExclamationCircle, label: 'Urgente', color: 'danger' },
    activity: { icon: FaCheckCircle, label: 'Actividad', color: 'success' }
  };

  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        if (isMounted) setLoading(false);
      }
    };
    
    initAuth();
    
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user || null);
      }
    });
    
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    setLoadingNotifications(true);
    try {
      const data = await notificationService.getUserNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    }
    setLoadingNotifications(false);
  };

  const handleOpenNotification = async (notification) => {
    setSelectedNotification(notification);
    onDetailOpen();

    // Marcar como leída si no lo está
    if (!notification.read_at) {
      await notificationService.markAsRead(notification.id);
      setNotifications(
        notifications.map((n) =>
          n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead(user.id);
    setNotifications(
      notifications.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    );
  };

  const handleDeleteNotification = async (notificationId) => {
    await notificationService.deleteNotification(notificationId);
    setNotifications(notifications.filter((n) => n.id !== notificationId));
    onDetailClose();
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;

    if (diff < 60000) return 'Hace un momento';
    if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`;
    if (diff < 604800000) return `Hace ${Math.floor(diff / 86400000)} días`;
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read_at;
    if (filter === 'read') return !!n.read_at;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const getFileIcon = (filename) => {
    if (!filename) return FaFile;
    if (filename.endsWith('.pdf')) return FaFilePdf;
    return FaFileAlt;
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="notifications-loading">
          <Spinner size="lg" color="warning" />
          <p>Cargando...</p>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <SEO title="Notificaciones" url="/notificaciones" />
        <div className="notifications-login">
          <Card className="login-card">
            <CardBody>
              <div className="login-content">
                <MdNotifications className="login-icon" />
                <h1>Notificaciones</h1>
                <p>Inicia sesión para ver tus notificaciones y documentos</p>
                <Button
                  className="login-btn"
                  onPress={() => authService.signInWithGoogle('/notificaciones')}
                  startContent={<FaSignInAlt />}
                  size="lg">
                  Iniciar sesión con Google
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
      <SEO title="Notificaciones" url="/notificaciones" />
      <div className="notifications-page">
        <div className="notifications-header">
          <div className="header-info">
            <h1>
              <MdNotifications /> Notificaciones
              {unreadCount > 0 && (
                <Chip size="sm" color="danger" className="unread-badge">
                  {unreadCount}
                </Chip>
              )}
            </h1>
            <p>Avisos, documentos y comunicados del grupo</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="flat" startContent={<MdMarkEmailRead />} onPress={handleMarkAllAsRead}>
              Marcar todo como leído
            </Button>
          )}
        </div>

        <Tabs
          selectedKey={filter}
          onSelectionChange={setFilter}
          className="filter-tabs"
          color="warning"
          variant="underlined">
          <Tab key="all" title={<span>Todas ({notifications.length})</span>} />
          <Tab key="unread" title={<span>Sin leer ({unreadCount})</span>} />
          <Tab key="read" title={<span>Leídas ({notifications.length - unreadCount})</span>} />
        </Tabs>

        {loadingNotifications ? (
          <div className="notifications-loading inline">
            <Spinner size="lg" color="warning" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="notifications-empty">
            <FaBell className="empty-icon" />
            <h2>
              {filter === 'unread' ? 'No hay notificaciones sin leer' : 'No hay notificaciones'}
            </h2>
            <p>Las notificaciones del grupo aparecerán aquí</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map((notification) => {
              const TypeIcon = notificationTypes[notification.type]?.icon || FaBell;
              const typeConfig = notificationTypes[notification.type] || notificationTypes.general;

              return (
                <Card
                  key={notification.id}
                  className={`notification-card ${!notification.read_at ? 'unread' : ''}`}
                  isPressable
                  onPress={() => handleOpenNotification(notification)}>
                  <CardBody>
                    <div className="notification-row">
                      <div className={`notification-icon ${typeConfig.color}`}>
                        <TypeIcon />
                      </div>
                      <div className="notification-content">
                        <div className="notification-header">
                          <h3>{notification.title}</h3>
                          <Chip size="sm" color={typeConfig.color} variant="flat">
                            {typeConfig.label}
                          </Chip>
                        </div>
                        <p className="notification-preview">
                          {notification.message?.substring(0, 100)}...
                        </p>
                        <div className="notification-meta">
                          <span className="date">
                            <FaClock /> {formatDate(notification.created_at)}
                          </span>
                          {notification.attachments?.length > 0 && (
                            <span className="attachments">
                              <FaFile /> {notification.attachments.length} archivo(s)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="notification-status">
                        {notification.read_at ? (
                          <FaEnvelopeOpen className="read-icon" />
                        ) : (
                          <FaEnvelope className="unread-icon" />
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Detalle de Notificación */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {selectedNotification &&
            (() => {
              const TypeIcon = notificationTypes[selectedNotification.type]?.icon || FaBell;
              const typeConfig =
                notificationTypes[selectedNotification.type] || notificationTypes.general;

              return (
                <>
                  <ModalHeader className="notification-modal-header">
                    <div className={`type-icon ${typeConfig.color}`}>
                      <TypeIcon />
                    </div>
                    <div className="header-text">
                      <h2>{selectedNotification.title}</h2>
                      <div className="header-meta">
                        <Chip size="sm" color={typeConfig.color}>
                          {typeConfig.label}
                        </Chip>
                        <span className="date">{formatDate(selectedNotification.created_at)}</span>
                      </div>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <div className="notification-detail-content">
                      <p className="message">{selectedNotification.message}</p>

                      {selectedNotification.attachments?.length > 0 && (
                        <div className="attachments-section">
                          <h4>
                            <FaFile /> Archivos adjuntos
                          </h4>
                          <div className="attachments-list">
                            {selectedNotification.attachments.map((file, index) => {
                              const FileIcon = getFileIcon(file.name);
                              return (
                                <a
                                  key={index}
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="attachment-item">
                                  <FileIcon className="file-icon" />
                                  <span className="file-name">{file.name}</span>
                                  <FaDownload className="download-icon" />
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="light"
                      startContent={<FaTrash />}
                      onPress={() => handleDeleteNotification(selectedNotification.id)}>
                      Eliminar
                    </Button>
                    <Button color="warning" onPress={onDetailClose}>
                      Cerrar
                    </Button>
                  </ModalFooter>
                </>
              );
            })()}
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};
