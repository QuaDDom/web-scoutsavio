import React, { useState, useEffect, useMemo } from 'react';
import '../styles/events.scss';
import { PageContainer } from '../components/PageContainer';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { supabase } from '../lib/supabase';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaTicketAlt,
  FaInfoCircle,
  FaShare,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaLink,
  FaTimes,
  FaImage,
  FaCalendarCheck,
  FaCalendarDay,
  FaSpinner
} from 'react-icons/fa';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
  Spinner,
  Tabs,
  Tab
} from '@nextui-org/react';
import { motion, AnimatePresence } from 'framer-motion';

// Event type colors and labels
const EVENT_TYPES = {
  activity: { label: 'Actividad', color: '#4caf50', icon: <FaUsers /> },
  fundraiser: { label: 'Recaudación', color: '#ff9800', icon: <FaTicketAlt /> },
  meeting: { label: 'Reunión', color: '#2196f3', icon: <FaCalendarCheck /> },
  camp: { label: 'Campamento', color: '#9c27b0', icon: <FaMapMarkerAlt /> },
  celebration: { label: 'Celebración', color: '#e91e63', icon: <FaCalendarDay /> },
  other: { label: 'Evento', color: '#607d8b', icon: <FaCalendarAlt /> }
};

// Helper para formatear fechas
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatShortDate = (dateString) => {
  const date = new Date(dateString);
  return {
    day: date.getDate(),
    month: date.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase(),
    weekday: date.toLocaleDateString('es-AR', { weekday: 'short' })
  };
};

// Componente de tarjeta de evento
const EventCard = ({ event, onViewDetails }) => {
  const dateInfo = formatShortDate(event.event_date);
  const eventType = EVENT_TYPES[event.event_type] || EVENT_TYPES.other;
  const isPast = new Date(event.event_date) < new Date();

  return (
    <motion.article
      className={`event-card ${isPast ? 'past' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => onViewDetails(event)}>
      <div className="event-date-badge">
        <span className="day">{dateInfo.day}</span>
        <span className="month">{dateInfo.month}</span>
      </div>

      {event.cover_image && (
        <div className="event-image">
          <img src={event.cover_image} alt={event.title} />
          {isPast && <span className="past-badge">Finalizado</span>}
        </div>
      )}

      <div className="event-content">
        <div className="event-meta">
          <Chip size="sm" style={{ backgroundColor: eventType.color }} className="type-chip">
            {eventType.icon} {eventType.label}
          </Chip>
          {event.is_featured && (
            <Chip size="sm" color="warning" variant="flat">
              Destacado
            </Chip>
          )}
        </div>

        <h3 className="event-title">{event.title}</h3>
        {event.subtitle && <p className="event-subtitle">{event.subtitle}</p>}

        <div className="event-info">
          <div className="info-item">
            <FaClock />
            <span>{formatTime(event.event_date)}</span>
          </div>
          {event.location && (
            <div className="info-item">
              <FaMapMarkerAlt />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        <button className="view-more-btn">
          Ver más <FaArrowRight />
        </button>
      </div>
    </motion.article>
  );
};

// Componente del calendario
const EventCalendar = ({ events, currentMonth, setCurrentMonth, onSelectDate, selectedDate }) => {
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthName = currentMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getEventsForDay = (day) => {
    return events.filter((event) => {
      const eventDate = new Date(event.event_date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day);
    const isToday =
      new Date().getDate() === day &&
      new Date().getMonth() === currentMonth.getMonth() &&
      new Date().getFullYear() === currentMonth.getFullYear();
    const isSelected =
      selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth();

    days.push(
      <div
        key={day}
        className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
        onClick={() =>
          onSelectDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
        }>
        <span className="day-number">{day}</span>
        {dayEvents.length > 0 && (
          <div className="event-dots">
            {dayEvents.slice(0, 3).map((e, i) => (
              <span
                key={i}
                className="dot"
                style={{ backgroundColor: EVENT_TYPES[e.event_type]?.color || '#607d8b' }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="event-calendar">
      <div className="calendar-header">
        <button onClick={prevMonth}>
          <FaChevronLeft />
        </button>
        <h3>{monthName}</h3>
        <button onClick={nextMonth}>
          <FaChevronRight />
        </button>
      </div>

      <div className="calendar-weekdays">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-days">{days}</div>
    </div>
  );
};

// Modal de detalle del evento
const EventDetailModal = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  const eventType = EVENT_TYPES[event.event_type] || EVENT_TYPES.other;
  const isPast = new Date(event.event_date) < new Date();

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `${event.title} - ${formatDate(event.event_date)}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('¡Link copiado!');
        break;
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent className="event-detail-modal">
        {(onCloseModal) => (
          <>
            {event.cover_image && (
              <div className="modal-cover">
                <img src={event.cover_image} alt={event.title} />
                <div className="cover-overlay" />
              </div>
            )}

            <ModalBody>
              <div className="event-detail-content">
                <div className="detail-header">
                  <Chip
                    size="md"
                    style={{ backgroundColor: eventType.color }}
                    className="type-chip">
                    {eventType.icon} {eventType.label}
                  </Chip>
                  {isPast && (
                    <Chip color="default" variant="flat">
                      Evento finalizado
                    </Chip>
                  )}
                </div>

                <h1>{event.title}</h1>
                {event.subtitle && <p className="subtitle">{event.subtitle}</p>}

                <div className="event-details-grid">
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <div>
                      <span className="label">Fecha</span>
                      <span className="value">{formatDate(event.event_date)}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaClock />
                    <div>
                      <span className="label">Hora</span>
                      <span className="value">{formatTime(event.event_date)}</span>
                    </div>
                  </div>

                  {event.location && (
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <div>
                        <span className="label">Lugar</span>
                        <span className="value">{event.location}</span>
                      </div>
                    </div>
                  )}
                </div>

                {event.content && (
                  <div
                    className="event-content-html"
                    dangerouslySetInnerHTML={{ __html: event.content }}
                  />
                )}

                {event.images && event.images.length > 0 && (
                  <div className="event-images-gallery">
                    {event.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`${event.title} ${idx + 1}`} />
                    ))}
                  </div>
                )}

                <div className="share-section">
                  <span>Compartir:</span>
                  <div className="share-buttons">
                    <button onClick={() => handleShare('whatsapp')} className="whatsapp">
                      <FaWhatsapp />
                    </button>
                    <button onClick={() => handleShare('facebook')} className="facebook">
                      <FaFacebook />
                    </button>
                    <button onClick={() => handleShare('twitter')} className="twitter">
                      <FaTwitter />
                    </button>
                    <button onClick={() => handleShare('copy')} className="copy">
                      <FaLink />
                    </button>
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={onCloseModal}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// Componente principal de eventos
export const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [filter, setFilter] = useState('upcoming'); // 'upcoming' | 'past' | 'all'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar eventos
  const filteredEvents = useMemo(() => {
    const now = new Date();
    let filtered = events;

    if (filter === 'upcoming') {
      filtered = events.filter((e) => new Date(e.event_date) >= now);
    } else if (filter === 'past') {
      filtered = events.filter((e) => new Date(e.event_date) < now);
    }

    if (selectedDate) {
      filtered = filtered.filter((e) => {
        const eventDate = new Date(e.event_date);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    }

    return filtered;
  }, [events, filter, selectedDate]);

  // Eventos destacados
  const featuredEvents = useMemo(() => {
    return events.filter((e) => e.is_featured && new Date(e.event_date) >= new Date()).slice(0, 3);
  }, [events]);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    onOpen();
  };

  const handleSelectDate = (date) => {
    if (selectedDate && selectedDate.getTime() === date.getTime()) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  return (
    <>
      <SEO
        title="Eventos - Grupo Scout 331 Savio"
        description="Calendario de eventos, actividades, peñas y campamentos del Grupo Scout 331 Savio"
      />
      <PageContainer>
        <main className="events-page">
          {/* Hero Section */}
          <section className="events-hero">
            <div className="hero-content">
              <motion.div
                className="hero-text"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}>
                <h1>
                  <FaCalendarAlt /> Eventos
                </h1>
                <p>
                  Enterate de todas las actividades, campamentos, peñas y eventos del grupo. ¡No te
                  pierdas nada!
                </p>
              </motion.div>
            </div>
          </section>

          {/* Featured Events */}
          {featuredEvents.length > 0 && (
            <section className="featured-events">
              <h2>Próximos eventos destacados</h2>
              <div className="featured-grid">
                {featuredEvents.map((event) => (
                  <EventCard key={event.id} event={event} onViewDetails={handleViewDetails} />
                ))}
              </div>
            </section>
          )}

          {/* View Controls */}
          <section className="events-controls">
            <div className="controls-container">
              <div className="view-toggle">
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}>
                  <FaCalendarDay /> Lista
                </button>
                <button
                  className={viewMode === 'calendar' ? 'active' : ''}
                  onClick={() => setViewMode('calendar')}>
                  <FaCalendarAlt /> Calendario
                </button>
              </div>

              <div className="filter-tabs">
                <button
                  className={filter === 'upcoming' ? 'active' : ''}
                  onClick={() => {
                    setFilter('upcoming');
                    setSelectedDate(null);
                  }}>
                  Próximos
                </button>
                <button
                  className={filter === 'past' ? 'active' : ''}
                  onClick={() => {
                    setFilter('past');
                    setSelectedDate(null);
                  }}>
                  Pasados
                </button>
                <button
                  className={filter === 'all' ? 'active' : ''}
                  onClick={() => {
                    setFilter('all');
                    setSelectedDate(null);
                  }}>
                  Todos
                </button>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="events-content">
            {viewMode === 'calendar' && (
              <aside className="calendar-sidebar">
                <EventCalendar
                  events={events}
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  onSelectDate={handleSelectDate}
                  selectedDate={selectedDate}
                />
                {selectedDate && (
                  <button className="clear-date" onClick={() => setSelectedDate(null)}>
                    <FaTimes /> Limpiar selección
                  </button>
                )}
              </aside>
            )}

            <div className="events-list-container">
              {loading ? (
                <div className="loading-state">
                  <Spinner size="lg" color="warning" />
                  <p>Cargando eventos...</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="empty-state">
                  <FaCalendarAlt />
                  <h3>No hay eventos</h3>
                  <p>
                    {filter === 'upcoming'
                      ? 'No hay eventos próximos programados'
                      : filter === 'past'
                        ? 'No hay eventos pasados'
                        : 'No hay eventos registrados'}
                  </p>
                </div>
              ) : (
                <div className="events-grid">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} onViewDetails={handleViewDetails} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </PageContainer>

      {/* Event Detail Modal */}
      <EventDetailModal event={selectedEvent} isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Events;
