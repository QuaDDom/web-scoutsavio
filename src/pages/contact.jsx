import React from 'react';
import { useState } from 'react';
import { PageContainer } from '../components/PageContainer';
import { Footer } from '../components/Footer';
import { Button, Input, Textarea, Card, CardBody } from '@nextui-org/react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaWhatsapp } from 'react-icons/fa';
import '../styles/contact.scss';

export const Contact = () => {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1>
            Ponte en <span className="gradient-text">contacto</span>
          </h1>
          <p>Estamos aquí para responder todas tus preguntas</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-container">
          {/* Contact Info */}
          <div className="contact-info">
            <h2>Información de contacto</h2>
            <p className="info-description">
              ¿Tienes preguntas sobre nuestro grupo scout? No dudes en contactarnos.
            </p>

            <div className="info-items">
              <div className="info-item">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="info-content">
                  <h4>Dirección</h4>
                  <p>Río Tercero, Córdoba, Argentina</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaPhone />
                </div>
                <div className="info-content">
                  <h4>Teléfono</h4>
                  <p>+54 351 421-2345</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <div className="info-content">
                  <h4>Email</h4>
                  <p>info@gruposcout331.com.ar</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon whatsapp">
                  <FaWhatsapp />
                </div>
                <div className="info-content">
                  <h4>WhatsApp</h4>
                  <p>+54 351 421-2345</p>
                </div>
              </div>
            </div>

            <div className="schedule">
              <h4>Horarios de reunión</h4>
              <p>Sábados de 15:00 a 18:00 hs</p>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="contact-card">
            <CardBody>
              <ContactForm />
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3392.5!2d-64.1137!3d-32.1735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x62ce7d804570a471%3A0x62ce7d804570a471!2sGrupo%20Scout%20331%20Gral.%20Manuel%20Nicolas%20Savio!5e0!3m2!1ses!2sar!4v1707000000000"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: '20px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación del grupo scout"></iframe>
        </div>
      </section>

      <Footer />
    </PageContainer>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Formulario enviado:', formData);

    // Reset form
    setFormData({
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      mensaje: ''
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h2>Envíanos un mensaje</h2>
      <p className="form-description">
        Completa el formulario y nos pondremos en contacto contigo pronto.
      </p>

      <div className="form-grid">
        <Input
          label="Nombre"
          name="nombre"
          type="text"
          variant="bordered"
          value={formData.nombre}
          onChange={handleChange}
          required
          classNames={{
            inputWrapper: 'input-wrapper'
          }}
        />
        <Input
          label="Apellidos"
          name="apellidos"
          type="text"
          variant="bordered"
          value={formData.apellidos}
          onChange={handleChange}
          required
          classNames={{
            inputWrapper: 'input-wrapper'
          }}
        />
      </div>

      <div className="form-grid">
        <Input
          label="Email"
          name="email"
          type="email"
          variant="bordered"
          value={formData.email}
          onChange={handleChange}
          required
          classNames={{
            inputWrapper: 'input-wrapper'
          }}
        />
        <Input
          label="Teléfono (opcional)"
          name="telefono"
          type="tel"
          variant="bordered"
          value={formData.telefono}
          onChange={handleChange}
          classNames={{
            inputWrapper: 'input-wrapper'
          }}
        />
      </div>

      <Textarea
        label="Mensaje"
        name="mensaje"
        variant="bordered"
        value={formData.mensaje}
        onChange={handleChange}
        required
        minRows={4}
        classNames={{
          inputWrapper: 'input-wrapper'
        }}
      />

      <Button
        type="submit"
        className="submit-btn"
        isLoading={isSubmitting}
        startContent={!isSubmitting && <FaPaperPlane />}>
        {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
      </Button>
    </form>
  );
};
