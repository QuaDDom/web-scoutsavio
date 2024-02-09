import React from 'react';
import { useState } from 'react';
import { PageContainer } from '../components/PageContainer';
import { Button, Input } from '@nextui-org/react';

export const Contact = () => {
  const handleSubmit = () => {};

  return (
    <PageContainer>
      <h1>Contact</h1>
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
    <div>
      <h2>Formulario de contacto</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Nombre"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Apellidos"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Mensaje"
          type="textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <Button color="primary">Enviar</Button>
      </form>
    </div>
  );
};
