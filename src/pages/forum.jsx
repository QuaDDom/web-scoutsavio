import React, { useState, useEffect } from 'react';
import '../styles/forum.scss';
import { PageContainer } from '../components/PageContainer';
import { SEO } from '../components/SEO';
import { supabase, authService, forumService } from '../lib/supabase';
import {
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
  Chip,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@nextui-org/react';
import {
  FaPlus,
  FaComments,
  FaReply,
  FaClock,
  FaUser,
  FaEllipsisV,
  FaTrash,
  FaEdit,
  FaLock,
  FaArrowLeft,
  FaSignInAlt,
  FaThumbsUp
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const Forum = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Forms
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('general');
  const [replyContent, setReplyContent] = useState('');

  const {
    isOpen: isNewTopicOpen,
    onOpen: onNewTopicOpen,
    onClose: onNewTopicClose
  } = useDisclosure();
  const navigate = useNavigate();

  const categories = [
    { key: 'general', label: 'General', color: 'default' },
    { key: 'actividades', label: 'Actividades', color: 'success' },
    { key: 'campamentos', label: 'Campamentos', color: 'warning' },
    { key: 'ideas', label: 'Ideas y Propuestas', color: 'primary' },
    { key: 'ayuda', label: 'Ayuda', color: 'secondary' }
  ];

  useEffect(() => {
    checkAuth();
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) loadTopics();
  }, [user]);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async () => {
    setLoadingTopics(true);
    try {
      const data = await forumService.getTopics();
      console.log('Topics loaded:', data);
      setTopics(data);
    } catch (error) {
      console.error('Error loading topics:', error);
      setTopics([]);
    }
    setLoadingTopics(false);
  };

  const loadReplies = async (topicId) => {
    setLoadingReplies(true);
    const data = await forumService.getReplies(topicId);
    setReplies(data);
    setLoadingReplies(false);
  };

  const handleCreateTopic = async () => {
    if (!newTopicTitle.trim() || !newTopicContent.trim()) return;
    setProcessing(true);

    const result = await forumService.createTopic({
      title: newTopicTitle,
      content: newTopicContent,
      category: newTopicCategory,
      author_id: user.id,
      author_name: user.user_metadata?.full_name || user.email.split('@')[0],
      author_avatar: user.user_metadata?.avatar_url
    });

    if (result.success) {
      setNewTopicTitle('');
      setNewTopicContent('');
      setNewTopicCategory('general');
      onNewTopicClose();
      loadTopics();
    } else {
      alert('Error al crear el tema');
    }
    setProcessing(false);
  };

  const handleSelectTopic = async (topic) => {
    setSelectedTopic(topic);
    await loadReplies(topic.id);
    // Incrementar vistas
    forumService.incrementViews(topic.id);
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !selectedTopic) return;
    setProcessing(true);

    const result = await forumService.createReply({
      topic_id: selectedTopic.id,
      content: replyContent,
      author_id: user.id,
      author_name: user.user_metadata?.full_name || user.email.split('@')[0],
      author_avatar: user.user_metadata?.avatar_url
    });

    if (result.success) {
      setReplyContent('');
      loadReplies(selectedTopic.id);
      // Actualizar contador de respuestas
      setSelectedTopic({ ...selectedTopic, replies_count: (selectedTopic.replies_count || 0) + 1 });
    }
    setProcessing(false);
  };

  const handleDeleteTopic = async (topicId) => {
    if (!confirm('¿Eliminar este tema y todas sus respuestas?')) return;
    const result = await forumService.deleteTopic(topicId);
    if (result.success) {
      loadTopics();
      if (selectedTopic?.id === topicId) setSelectedTopic(null);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!confirm('¿Eliminar esta respuesta?')) return;
    const result = await forumService.deleteReply(replyId);
    if (result.success) loadReplies(selectedTopic.id);
  };

  const handleLikeTopic = async (topicId) => {
    await forumService.toggleLike(topicId, user.id);
    loadTopics();
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;

    if (diff < 60000) return 'Hace un momento';
    if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`;
    if (diff < 604800000) return `Hace ${Math.floor(diff / 86400000)} días`;
    return d.toLocaleDateString('es-AR');
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="forum-loading">
          <Spinner size="lg" color="warning" />
          <p>Cargando...</p>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <SEO title="Foro" url="/foro" />
        <div className="forum-login">
          <Card className="login-card">
            <CardBody>
              <div className="login-content">
                <FaComments className="login-icon" />
                <h1>Foro Scout</h1>
                <p>Inicia sesión para participar en las discusiones del grupo</p>
                <Button
                  className="login-btn"
                  onPress={() => authService.signInWithGoogle('/foro')}
                  startContent={<FaSignInAlt />}
                  size="lg">
                  Iniciar sesión con Google
                </Button>
                <p className="login-note">Solo para miembros del grupo scout</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </PageContainer>
    );
  }

  // Vista de tema seleccionado
  if (selectedTopic) {
    return (
      <PageContainer>
        <SEO title={`${selectedTopic.title} - Foro`} url="/foro" />
        <div className="forum-page">
          <div className="topic-view">
            <Button
              variant="light"
              startContent={<FaArrowLeft />}
              onPress={() => setSelectedTopic(null)}
              className="back-btn">
              Volver al foro
            </Button>

            <Card className="topic-card main">
              <CardBody>
                <div className="topic-header">
                  <Avatar src={selectedTopic.author_avatar} showFallback size="lg" />
                  <div className="topic-meta">
                    <h1>{selectedTopic.title}</h1>
                    <div className="meta-info">
                      <span className="author">{selectedTopic.author_name}</span>
                      <span className="date">
                        <FaClock /> {formatDate(selectedTopic.created_at)}
                      </span>
                      <Chip
                        size="sm"
                        color={categories.find((c) => c.key === selectedTopic.category)?.color}>
                        {categories.find((c) => c.key === selectedTopic.category)?.label}
                      </Chip>
                    </div>
                  </div>
                </div>
                <div className="topic-content">
                  <p>{selectedTopic.content}</p>
                </div>
              </CardBody>
            </Card>

            <div className="replies-section">
              <h3>
                <FaComments /> {selectedTopic.replies_count || 0} Respuestas
              </h3>

              {loadingReplies ? (
                <div className="loading-inline">
                  <Spinner size="sm" />
                </div>
              ) : (
                <div className="replies-list">
                  {replies.map((reply) => (
                    <Card key={reply.id} className="reply-card">
                      <CardBody>
                        <div className="reply-header">
                          <Avatar src={reply.author_avatar} showFallback size="sm" />
                          <div className="reply-meta">
                            <span className="author">{reply.author_name}</span>
                            <span className="date">{formatDate(reply.created_at)}</span>
                          </div>
                          {reply.author_id === user.id && (
                            <Dropdown>
                              <DropdownTrigger>
                                <Button isIconOnly variant="light" size="sm">
                                  <FaEllipsisV />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu>
                                <DropdownItem
                                  key="delete"
                                  color="danger"
                                  startContent={<FaTrash />}
                                  onPress={() => handleDeleteReply(reply.id)}>
                                  Eliminar
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          )}
                        </div>
                        <p className="reply-content">{reply.content}</p>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}

              <Card className="reply-form-card">
                <CardBody>
                  <Textarea
                    placeholder="Escribe tu respuesta..."
                    value={replyContent}
                    onValueChange={setReplyContent}
                    minRows={3}
                  />
                  <Button
                    color="warning"
                    onPress={handleReply}
                    isDisabled={!replyContent.trim() || processing}
                    startContent={<FaReply />}
                    className="reply-btn">
                    {processing ? 'Enviando...' : 'Responder'}
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Vista principal del foro
  return (
    <PageContainer>
      <SEO title="Foro Scout" url="/foro" />
      <div className="forum-page">
        <div className="forum-header">
          <div className="header-info">
            <h1>Foro Scout</h1>
            <p>Comparte ideas, haz preguntas y participa con el grupo</p>
          </div>
          <Button color="warning" startContent={<FaPlus />} onPress={onNewTopicOpen}>
            Nuevo Tema
          </Button>
        </div>

        <div className="categories-bar">
          {categories.map((cat) => (
            <Chip key={cat.key} color={cat.color} variant="flat" className="cat-chip">
              {cat.label}
            </Chip>
          ))}
        </div>

        {loadingTopics ? (
          <div className="forum-loading inline">
            <Spinner size="lg" color="warning" />
          </div>
        ) : topics.length === 0 ? (
          <div className="forum-empty">
            <FaComments className="empty-icon" />
            <h2>No hay temas todavía</h2>
            <p>¡Sé el primero en crear un tema de discusión!</p>
            <Button color="warning" startContent={<FaPlus />} onPress={onNewTopicOpen}>
              Crear primer tema
            </Button>
          </div>
        ) : (
          <div className="topics-list">
            {topics.map((topic) => (
              <Card
                key={topic.id}
                className="topic-card"
                isPressable
                onPress={() => handleSelectTopic(topic)}>
                <CardBody>
                  <div className="topic-row">
                    <Avatar src={topic.author_avatar} showFallback className="topic-avatar" />
                    <div className="topic-info">
                      <h3>{topic.title}</h3>
                      <div className="topic-meta">
                        <span className="author">{topic.author_name}</span>
                        <span className="date">
                          <FaClock /> {formatDate(topic.created_at)}
                        </span>
                        <Chip
                          size="sm"
                          color={categories.find((c) => c.key === topic.category)?.color}
                          variant="flat">
                          {categories.find((c) => c.key === topic.category)?.label}
                        </Chip>
                      </div>
                    </div>
                    <div className="topic-stats">
                      <div className="stat">
                        <FaComments /> {topic.replies_count || 0}
                      </div>
                      <div className="stat">
                        <FaThumbsUp /> {topic.likes_count || 0}
                      </div>
                    </div>
                    {topic.author_id === user.id && (
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}>
                            <FaEllipsisV />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem
                            key="delete"
                            color="danger"
                            startContent={<FaTrash />}
                            onPress={() => handleDeleteTopic(topic.id)}>
                            Eliminar
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal Nuevo Tema */}
      <Modal isOpen={isNewTopicOpen} onClose={onNewTopicClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <FaPlus /> Nuevo Tema
          </ModalHeader>
          <ModalBody>
            <div className="new-topic-form">
              <Input
                label="Título"
                placeholder="¿De qué quieres hablar?"
                value={newTopicTitle}
                onValueChange={setNewTopicTitle}
              />
              <div className="category-select">
                <label>Categoría</label>
                <div className="category-options">
                  {categories.map((cat) => (
                    <Chip
                      key={cat.key}
                      color={cat.color}
                      variant={newTopicCategory === cat.key ? 'solid' : 'flat'}
                      className="cat-option"
                      onClick={() => setNewTopicCategory(cat.key)}>
                      {cat.label}
                    </Chip>
                  ))}
                </div>
              </div>
              <Textarea
                label="Contenido"
                placeholder="Describe tu tema, pregunta o idea..."
                value={newTopicContent}
                onValueChange={setNewTopicContent}
                minRows={5}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onNewTopicClose}>
              Cancelar
            </Button>
            <Button
              color="warning"
              onPress={handleCreateTopic}
              isDisabled={!newTopicTitle.trim() || !newTopicContent.trim() || processing}>
              {processing ? 'Creando...' : 'Crear Tema'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};
