import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider
} from '@nextui-org/react';
import { FaGoogle } from 'react-icons/fa';
import { authService } from '../lib/supabase';
import './LoginModal.scss';

export const LoginModal = ({ isOpen, onClose, redirectPath = null }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Si hay redirectPath, usarlo, sino quedarse en la página actual
      const redirect = redirectPath || window.location.pathname;
      await authService.signInWithGoogle(redirect);
    } catch (error) {
      console.error('Error signing in:', error);
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      classNames={{
        base: 'login-modal',
        backdrop: 'login-modal-backdrop',
        wrapper: 'login-modal-wrapper'
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut'
            }
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn'
            }
          }
        }
      }}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="login-modal-header">
              <div className="header-content">
                <span className="header-emoji">🏕️</span>
                <h2>¡Bienvenido Scout!</h2>
              </div>
            </ModalHeader>

            <ModalBody className="login-modal-body">
              <p className="login-description">
                Iniciá sesión para acceder a todas las funciones del Grupo Scout 331 Savio
              </p>

              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">📸</span>
                  <span>Subir fotos a la galería</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💬</span>
                  <span>Participar en el foro</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔔</span>
                  <span>Recibir notificaciones</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⭐</span>
                  <span>Registrar tus progresiones</span>
                </div>
              </div>

              <Divider className="login-divider" />

              <Button
                size="lg"
                className="google-login-btn"
                startContent={!loading && <FaGoogle />}
                isLoading={loading}
                onPress={handleGoogleLogin}>
                {loading ? 'Conectando...' : 'Continuar con Google'}
              </Button>

              <p className="login-note">
                Al iniciar sesión, aceptás formar parte de nuestra comunidad scout 🤝
              </p>
            </ModalBody>

            <ModalFooter className="login-modal-footer">
              <Button variant="light" onPress={onClose} className="cancel-btn">
                Cancelar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
