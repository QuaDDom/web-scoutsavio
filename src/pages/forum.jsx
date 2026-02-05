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
  FaEllipsisV,
  FaTrash,
  FaArrowLeft,
  FaSignInAlt,
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegCommentAlt,
  FaShare,
  FaBookmark,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaFire
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
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
  const [likedTopics, setLikedTopics] = useState(new Set());

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
    { key: 'general', label: 'General', color: 'default', emoji: '💬' },
    { key: 'actividades', label: 'Actividades', color: 'success', emoji: '🏕️' },
    { key: 'campamentos', label: 'Campamentos', color: 'warning', emoji: '⛺' },
    { key: 'ideas', label: 'Ideas', color: 'primary', emoji: '💡' },
    { key: 'ayuda', label: 'Ayuda', color: 'secondary', emoji: '🙋' }
  ];

  useEffect(() => {
    let isMounted = true;

    // Usar onAuthStateChange con callback síncrono (según docs de Supabase)
    // INITIAL_SESSION se emite al cargar la sesión desde storage
    const {
      data: { subscription }
    } = authService.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      // INITIAL_SESSION: sesión cargada desde localStorage
      // SIGNED_IN: usuario inició sesión o refocused tab
      // SIGNED_OUT: usuario cerró sesión
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setUser(session?.user || null);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED') {
        // Token refrescado, actualizar usuario si existe
        if (session?.user) {
          setUser(session.user);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) loadTopics();
  }, [user]);

  const loadTopics = async () => {
    setLoadingTopics(true);
    try {
      const data = await forumService.getTopics();
      setTopics(data);
      // Cargar likes del usuario
      if (user) {
        const userLikes = await forumService.getUserLikes(user.id);
        if (userLikes) {
          setLikedTopics(new Set(userLikes.map((l) => l.topic_id)));
        }
      }
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

  const handleDeleteTopic = async (topicId, e) => {
    e?.stopPropagation();
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

  const handleLikeTopic = async (topicId, e) => {
    e?.stopPropagation();
    await forumService.toggleLike(topicId, user.id);
    setLikedTopics((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
    // Actualizar contador local
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? { ...t, likes_count: (t.likes_count || 0) + (likedTopics.has(topicId) ? -1 : 1) }
          : t
      )
    );
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;

    if (diff < 60000) return 'ahora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  };

  const getCategoryInfo = (key) => categories.find((c) => c.key === key) || categories[0];

  if (loading) {
    return (
      <PageContainer>
        <div className="forum-loading">
          <Spinner size="lg" color="warning" />
          <p>Cargando foro...</p>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <SEO title="Foro Scout" url="/foro" />
        <div className="forum-login">
          <Card className="login-card">
            <CardBody>
              <div className="login-content">
                <FaComments className="login-icon" />
                <h1>Foro Scout</h1>
                <p>
                  Unite a las conversaciones del grupo. Compartí ideas, hacé preguntas y participá
                  con otros scouts.
                </p>
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
    const topicCat = getCategoryInfo(selectedTopic.category);
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
                <div className="topic-main-header">
                  <Avatar
                    src={selectedTopic.author_avatar}
                    showFallback
                    size="lg"
                    className="author-avatar"
                  />
                  <div className="header-content">
                    <Chip size="sm" color={topicCat.color} className="topic-category">
                      {topicCat.emoji} {topicCat.label}
                    </Chip>
                    <h1>{selectedTopic.title}</h1>
                    <div className="meta-row">
                      <span className="author-name">{selectedTopic.author_name}</span>
                      <span className="meta-dot">•</span>
                      <span className="meta-item">
                        <FaClock /> {formatDate(selectedTopic.created_at)}
                      </span>
                      <span className="meta-dot">•</span>
                      <span className="meta-item">
                        <FaEye /> {selectedTopic.views_count || 0} vistas
                      </span>
                    </div>
                  </div>
                </div>

                <div className="topic-body">{selectedTopic.content}</div>

                <div className="topic-stats-bar">
                  <button
                    className={`stat-item ${likedTopics.has(selectedTopic.id) ? 'liked' : ''}`}
                    onClick={() => handleLikeTopic(selectedTopic.id)}>
                    {likedTopics.has(selectedTopic.id) ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    {selectedTopic.likes_count || 0}
                  </button>
                  <span className="stat-item">
                    <FaRegCommentAlt /> {selectedTopic.replies_count || 0} comentarios
                  </span>
                  <button className="stat-item">
                    <FaShare /> Compartir
                  </button>
                  <button className="stat-item">
                    <FaBookmark /> Guardar
                  </button>
                </div>
              </CardBody>
            </Card>

            <div className="replies-section">
              <div className="replies-header">
                <h3>
                  <FaRegCommentAlt /> Comentarios
                </h3>
                <span className="replies-count">({selectedTopic.replies_count || 0})</span>
              </div>

              {loadingReplies ? (
                <div className="loading-inline">
                  <Spinner size="sm" color="warning" />
                </div>
              ) : (
                <div className="replies-list">
                  {replies.length === 0 ? (
                    <p className="no-replies">No hay comentarios todavía. ¡Sé el primero!</p>
                  ) : (
                    replies.map((reply) => (
                      <Card key={reply.id} className="reply-card">
                        <CardBody>
                          <div className="reply-header">
                            <Avatar
                              src={reply.author_avatar}
                              showFallback
                              size="sm"
                              className="reply-avatar"
                            />
                            <div className="reply-info">
                              <span className="reply-author">{reply.author_name}</span>
                              {reply.author_id === selectedTopic.author_id && (
                                <span className="op-badge">OP</span>
                              )}
                              <span className="reply-date">{formatDate(reply.created_at)}</span>
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
                          <p className="reply-body">{reply.content}</p>
                        </CardBody>
                      </Card>
                    ))
                  )}
                </div>
              )}

              <Card className="reply-form-card">
                <CardBody>
                  <div className="reply-form-header">
                    <Avatar src={user.user_metadata?.avatar_url} showFallback size="sm" />
                    <span>
                      Comentar como{' '}
                      <strong>{user.user_metadata?.full_name || user.email.split('@')[0]}</strong>
                    </span>
                  </div>
                  <Textarea
                    placeholder="¿Qué pensás?"
                    value={replyContent}
                    onValueChange={setReplyContent}
                    minRows={3}
                    className="reply-input"
                  />
                  <div className="reply-form-footer">
                    <Button
                      color="warning"
                      onPress={handleReply}
                      isDisabled={!replyContent.trim() || processing}
                      isLoading={processing}
                      startContent={!processing && <FaReply />}
                      className="reply-submit-btn">
                      Comentar
                    </Button>
                  </div>
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
            <h1>
              <FaFire className="header-icon" />
              Foro Scout
            </h1>
            <p>Compartí ideas, hacé preguntas y participá con el grupo</p>
          </div>
          <Button className="create-btn" startContent={<FaPlus />} onPress={onNewTopicOpen}>
            Crear Post
          </Button>
        </div>

        <div className="categories-bar">
          <span className="filter-label">Filtrar:</span>
          {categories.map((cat) => (
            <Chip key={cat.key} color={cat.color} variant="flat" className="cat-chip">
              {cat.emoji} {cat.label}
            </Chip>
          ))}
        </div>

        {loadingTopics ? (
          <div className="forum-loading inline">
            <Spinner size="lg" color="warning" />
          </div>
        ) : topics.length === 0 ? (
          <div className="forum-empty">
            <HiSparkles className="empty-icon" />
            <h2>¡Empezá la conversación!</h2>
            <p>Todavía no hay posts. Sé el primero en crear uno y compartir algo con el grupo.</p>
            <Button className="empty-btn" startContent={<FaPlus />} onPress={onNewTopicOpen}>
              Crear primer post
            </Button>
          </div>
        ) : (
          <div className="topics-list">
            {topics.map((topic) => {
              const cat = getCategoryInfo(topic.category);
              const isLiked = likedTopics.has(topic.id);
              return (
                <Card
                  key={topic.id}
                  className="topic-card"
                  isPressable
                  onPress={() => handleSelectTopic(topic)}>
                  <CardBody>
                    <div className="topic-row">
                      {/* Vote section */}
                      <div className="vote-section">
                        <Button
                          isIconOnly
                          className={`vote-btn ${isLiked ? 'active' : ''}`}
                          onClick={(e) => handleLikeTopic(topic.id, e)}>
                          <FaArrowUp />
                        </Button>
                        <span className="vote-count">{topic.likes_count || 0}</span>
                        <Button isIconOnly className="vote-btn downvote">
                          <FaArrowDown />
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="topic-content-wrapper">
                        <div className="topic-header-row">
                          <Chip size="sm" color={cat.color} className="category-tag">
                            {cat.emoji} {cat.label}
                          </Chip>
                          <span className="author-info">
                            Publicado por <span className="author-name">{topic.author_name}</span>
                            <span className="separator">•</span>
                            {formatDate(topic.created_at)}
                          </span>
                        </div>

                        <h3 className="topic-title">{topic.title}</h3>

                        {topic.content && <p className="topic-preview">{topic.content}</p>}

                        <div className="topic-actions">
                          <button className="action-btn">
                            <FaRegCommentAlt /> {topic.replies_count || 0} Comentarios
                          </button>
                          <button className="action-btn">
                            <FaShare /> Compartir
                          </button>
                          <button className="action-btn">
                            <FaBookmark /> Guardar
                          </button>
                        </div>
                      </div>

                      {/* Menu */}
                      {topic.author_id === user.id && (
                        <div className="topic-menu">
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
                                onPress={(e) => handleDeleteTopic(topic.id, e)}>
                                Eliminar
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Nuevo Tema */}
      <Modal
        isOpen={isNewTopicOpen}
        onClose={onNewTopicClose}
        size="2xl"
        className="new-topic-modal">
        <ModalContent>
          <ModalHeader>
            <span className="modal-title">
              <FaPlus /> Crear nuevo post
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="new-topic-form">
              <Input
                label="Título"
                placeholder="Un título interesante para tu post..."
                value={newTopicTitle}
                onValueChange={setNewTopicTitle}
                size="lg"
              />

              <div className="category-select">
                <label>Categoría</label>
                <div className="category-options">
                  {categories.map((cat) => (
                    <Chip
                      key={cat.key}
                      color={cat.color}
                      variant={newTopicCategory === cat.key ? 'solid' : 'flat'}
                      className={`cat-option ${newTopicCategory === cat.key ? 'selected' : ''}`}
                      onClick={() => setNewTopicCategory(cat.key)}>
                      {cat.emoji} {cat.label}
                    </Chip>
                  ))}
                </div>
              </div>

              <Textarea
                label="Contenido"
                placeholder="¿Qué querés compartir o preguntar?"
                value={newTopicContent}
                onValueChange={setNewTopicContent}
                minRows={6}
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
              isDisabled={!newTopicTitle.trim() || !newTopicContent.trim() || processing}
              isLoading={processing}>
              {processing ? 'Publicando...' : 'Publicar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};
