import React, { useState, useEffect } from 'react';
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
  Input,
  Textarea,
  Spinner,
  Chip,
  Select,
  SelectItem,
  Switch,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@nextui-org/react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaSave,
  FaUndo,
  FaImage,
  FaUsers,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaCalendarDay,
  FaStar
} from 'react-icons/fa';
import { authService } from '../../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || '';

const EVENT_TYPES = [
  { key: 'activity', label: 'Actividad', icon: <FaUsers />, color: '#4caf50' },
  { key: 'fundraiser', label: 'Recaudación', icon: <FaTicketAlt />, color: '#ff9800' },
  { key: 'meeting', label: 'Reunión', icon: <FaCalendarCheck />, color: '#2196f3' },
  { key: 'camp', label: 'Campamento', icon: <FaMapMarkerAlt />, color: '#9c27b0' },
  { key: 'celebration', label: 'Celebración', icon: <FaCalendarDay />, color: '#e91e63' },
  { key: 'other', label: 'Otro', icon: <FaCalendarAlt />, color: '#607d8b' }
];

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // Form state
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    content: '',
    cover_image: '',
    images: [],
    event_date: '',
    event_type: 'activity',
    location: '',
    is_featured: false,
    is_published: true
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const getAuthHeaders = async () => {
    const session = await authService.getSession();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`
    };
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/admin/events`, { headers });
      const data = await res.json();
      if (data.events) setEvents(data.events);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedEvent(null);
    setForm({
      title: '',
      subtitle: '',
      content: '',
      cover_image: '',
      images: [],
      event_date: '',
      event_type: 'activity',
      location: '',
      is_featured: false,
      is_published: true
    });
    onOpen();
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    const dateForInput = event.event_date
      ? new Date(event.event_date).toISOString().slice(0, 16)
      : '';
    setForm({
      title: event.title,
      subtitle: event.subtitle || '',
      content: event.content || '',
      cover_image: event.cover_image || '',
      images: event.images || [],
      event_date: dateForInput,
      event_type: event.event_type,
      location: event.location || '',
      is_featured: event.is_featured || false,
      is_published: event.is_published
    });
    onOpen();
  };

  const handleSave = async () => {
    try {
      setProcessing(true);
      const headers = await getAuthHeaders();

      const payload = {
        ...form,
        event_date: new Date(form.event_date).toISOString()
      };

      if (selectedEvent) {
        payload.id = selectedEvent.id;
        await fetch(`${API_URL}/api/admin/events`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${API_URL}/api/admin/events`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      }

      onClose();
      loadEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      setProcessing(true);
      const headers = await getAuthHeaders();
      await fetch(`${API_URL}/api/admin/events?id=${selectedEvent.id}`, {
        method: 'DELETE',
        headers
      });
      onDeleteClose();
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setProcessing(false);
    }
  };

  const confirmDelete = (event) => {
    setSelectedEvent(event);
    onDeleteOpen();
  };

  const handleAddImage = () => {
    const url = prompt('URL de la imagen:');
    if (url) {
      setForm({ ...form, images: [...form.images, url] });
    }
  };

  const handleRemoveImage = (index) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isPast = (dateString) => new Date(dateString) < new Date();

  if (loading) {
    return (
      <div className="admin-loading inline">
        <Spinner size="lg" color="warning" />
        <p>Cargando eventos...</p>
      </div>
    );
  }

  return (
    <div className="admin-events">
      <div className="events-toolbar">
        <Button color="warning" startContent={<FaPlus />} onPress={openCreateModal}>
          Nuevo Evento
        </Button>
        <Button variant="flat" startContent={<FaUndo />} onPress={loadEvents}>
          Recargar
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="admin-empty">
          <FaCalendarAlt className="empty-icon" />
          <h2>Sin eventos</h2>
          <p>Crea tu primer evento</p>
        </div>
      ) : (
        <Table aria-label="Events table" className="events-table">
          <TableHeader>
            <TableColumn>Evento</TableColumn>
            <TableColumn>Tipo</TableColumn>
            <TableColumn>Fecha</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} className={isPast(event.event_date) ? 'past-event' : ''}>
                <TableCell>
                  <div className="event-cell">
                    {event.cover_image && (
                      <img src={event.cover_image} alt={event.title} className="event-thumb" />
                    )}
                    <div>
                      <strong>{event.title}</strong>
                      {event.is_featured && (
                        <Chip size="sm" color="warning" variant="flat" startContent={<FaStar />}>
                          Destacado
                        </Chip>
                      )}
                      {event.subtitle && (
                        <p className="text-small text-default-500">{event.subtitle}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    style={{
                      backgroundColor: EVENT_TYPES.find((t) => t.key === event.event_type)?.color
                    }}
                    className="event-type-chip">
                    {EVENT_TYPES.find((t) => t.key === event.event_type)?.icon}
                    {EVENT_TYPES.find((t) => t.key === event.event_type)?.label}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div>
                    <span>{formatDate(event.event_date)}</span>
                    {isPast(event.event_date) && (
                      <Chip size="sm" variant="flat" color="default">
                        Pasado
                      </Chip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip size="sm" color={event.is_published ? 'success' : 'default'} variant="dot">
                    {event.is_published ? 'Publicado' : 'Borrador'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="action-buttons">
                    <Button
                      size="sm"
                      variant="flat"
                      isIconOnly
                      onPress={() => openEditModal(event)}>
                      <FaEdit />
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      isIconOnly
                      onPress={() => confirmDelete(event)}>
                      <FaTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>{selectedEvent ? 'Editar Evento' : 'Nuevo Evento'}</ModalHeader>
          <ModalBody>
            <div className="event-form">
              <Input
                label="Título"
                placeholder="Ej: Peña de Fin de Año"
                value={form.title}
                onValueChange={(v) => setForm({ ...form, title: v })}
                isRequired
              />

              <Input
                label="Subtítulo"
                placeholder="Descripción corta..."
                value={form.subtitle}
                onValueChange={(v) => setForm({ ...form, subtitle: v })}
              />

              <Textarea
                label="Contenido (HTML permitido)"
                placeholder="<p>Descripción del evento...</p>"
                value={form.content}
                onValueChange={(v) => setForm({ ...form, content: v })}
                minRows={4}
              />

              <div className="form-row">
                <Input
                  type="datetime-local"
                  label="Fecha y hora"
                  value={form.event_date}
                  onValueChange={(v) => setForm({ ...form, event_date: v })}
                  isRequired
                />
                <Select
                  label="Tipo de evento"
                  selectedKeys={[form.event_type]}
                  onSelectionChange={(keys) =>
                    setForm({ ...form, event_type: Array.from(keys)[0] })
                  }>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.key} textValue={type.label}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <Input
                label="Ubicación"
                placeholder="Ej: Sede Scout - Av. Principal 123"
                value={form.location}
                onValueChange={(v) => setForm({ ...form, location: v })}
                startContent={<FaMapMarkerAlt />}
              />

              <Input
                label="Imagen de portada (URL)"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={form.cover_image}
                onValueChange={(v) => setForm({ ...form, cover_image: v })}
                startContent={<FaImage />}
              />

              {form.cover_image && (
                <div className="cover-preview">
                  <img src={form.cover_image} alt="Portada" />
                </div>
              )}

              <div className="images-section">
                <label>Imágenes adicionales:</label>
                <div className="images-grid">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="image-preview">
                      <img src={img} alt={`Imagen ${idx + 1}`} />
                      <Button
                        size="sm"
                        color="danger"
                        isIconOnly
                        className="remove-btn"
                        onPress={() => handleRemoveImage(idx)}>
                        <FaTrash />
                      </Button>
                    </div>
                  ))}
                  <Button variant="bordered" className="add-image-btn" onPress={handleAddImage}>
                    <FaImage /> Agregar imagen
                  </Button>
                </div>
              </div>

              <div className="switches-row">
                <Switch
                  isSelected={form.is_featured}
                  onValueChange={(v) => setForm({ ...form, is_featured: v })}>
                  <FaStar /> Evento destacado
                </Switch>
                <Switch
                  isSelected={form.is_published}
                  onValueChange={(v) => setForm({ ...form, is_published: v })}>
                  Publicar evento
                </Switch>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              color="warning"
              onPress={handleSave}
              isDisabled={processing || !form.title || !form.event_date}
              startContent={<FaSave />}>
              {processing ? 'Guardando...' : 'Guardar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Eliminar Evento</ModalHeader>
          <ModalBody>
            <p>
              ¿Estás seguro de eliminar <strong>{selectedEvent?.title}</strong>?
            </p>
            <p className="text-small text-default-500">Esta acción no se puede deshacer.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Cancelar
            </Button>
            <Button color="danger" onPress={handleDelete} isDisabled={processing}>
              {processing ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminEvents;
