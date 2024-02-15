import React from 'react';
import { useState } from 'react';
import { PageContainer } from '../components/PageContainer';
import { Button, Input, Textarea, Card } from '@nextui-org/react';
import '../styles/contact.scss';

export const Contact = () => {
  const handleSubmit = () => {};

  return (
    <PageContainer>
      <ContactForm />
    </PageContainer>
  );
};

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí se procesaría el envío del formulario

    console.log('Formulario enviado');
    console.log('Nombre:', name);
    console.log('Email:', email);
    console.log('Mensaje:', message);

    // Restablecer el estado del formulario
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="containerAll">
      <form onSubmit={handleSubmit}>
        <Card className="contactForm">
          <h2>Formulario de contacto</h2>
          <div className="inputContainer">
            <Input
              label="Nombre"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Apellidos"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="inputContainer">
            <Input
              label="Email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Textarea
              label="Mensaje"
              type="textarea"
              className="input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <Button color="primary">Enviar</Button>
        </Card>
      </form>
    </div>
  );
};
