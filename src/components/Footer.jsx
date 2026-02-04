import React from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone
} from 'react-icons/fa';
import whiteLogo from '../assets/logo/whitelogo.png';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="brand-logo">
              <img src={whiteLogo} alt="Scout Savio Logo" />
              <span>Scout Savio</span>
            </div>
            <p className="brand-description">
              Formando líderes del mañana a través de la aventura, el servicio y los valores scout
              desde 1982.
            </p>
            <div className="social-links">
              <a
                href="https://www.facebook.com/scoutsavio/?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook">
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com/gruposcout_savio331/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram">
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/543514212345"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Enlaces rápidos</h4>
            <ul>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/sobre">Quiénes somos</Link>
              </li>
              <li>
                <Link to="/guia">Guía Scout</Link>
              </li>
              <li>
                <Link to="/galeria">Galería</Link>
              </li>
              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>

          {/* Guide Links */}
          <div className="footer-links">
            <h4>Guía Scout</h4>
            <ul>
              <li>
                <Link to="/guia/branches">Ramas</Link>
              </li>
              <li>
                <Link to="/guia/progressions">Progresiones</Link>
              </li>
              <li>
                <Link to="/guia/specialties">Especialidades</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h4>Contacto</h4>
            <ul>
              <li>
                <FaMapMarkerAlt />
                <span>Río Tercero, Córdoba, Argentina</span>
              </li>
              <li>
                <FaPhone />
                <span>+54 351 421-2345</span>
              </li>
              <li>
                <FaEnvelope />
                <span>info@gruposcout331.com.ar</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <p>Grupo Scout 331 Gral. Manuel Nicolas Savio &copy; {currentYear}</p>
            <p className="credits">Diseñado con ❤️ por Mateo Quadrelli</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
