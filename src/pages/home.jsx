import React from 'react';
import '../styles/home.scss';
import { PageContainer } from '../components/PageContainer';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody } from '@nextui-org/react';
import {
  FaUsers,
  FaCompass,
  FaCampground,
  FaHeart,
  FaArrowRight,
  FaLeaf,
  FaHandshake,
  FaStar
} from 'react-icons/fa';

// Logos de las ramas
import logoManada from '../assets/ramas/logo_manada.webp';
import logoUnidad from '../assets/ramas/unidad.jpg';
import logoCaminantes from '../assets/ramas/Logo_Caminantes.png';
import logoRover from '../assets/ramas/Logo_Rovers-1.png';

export const Home = () => {
  return (
    <PageContainer>
      <SEO
        title="Inicio"
        description="Grupo Scout 331 Gral. Manuel Nicolás Savio en Río Tercero, Córdoba. Formando líderes del mañana desde 1982 a través de la aventura, el servicio y los valores scout."
        keywords="grupo scout río tercero, scouts córdoba, actividades scouts, campamentos scouts, educación scout, manada, unidad, caminantes, rover"
        url="/"
      />
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <img src="/img1.jpg" alt="Scouts en la naturaleza" className="hero-bg" />
        <div className="hero-content">
          <span className="hero-badge">Grupo Scout 331</span>
          <h1>
            Bienvenido a <span className="gradient-text">Scouts Savio</span>
          </h1>
          <p className="hero-subtitle">
            Formando líderes del mañana a través de la aventura, el servicio y los valores
          </p>
          <div className="hero-buttons">
            <Link to="/contacto">
              <Button className="btn-primary" size="lg">
                Únete a la aventura
                <FaArrowRight />
              </Button>
            </Link>
            <Link to="/sobre">
              <Button className="btn-secondary" size="lg" variant="bordered">
                Conoce más
              </Button>
            </Link>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Descubre más</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Marquee Section - Values */}
      <section className="marquee-section">
        <div className="marquee-track">
          <div className="marquee-wrapper marquee-left">
            <div className="marquee-content">
              <span className="marquee-item">⚜️ Siempre Listos</span>
              <span className="marquee-item">🏕️ Aventura</span>
              <span className="marquee-item">🤝 Hermandad</span>
              <span className="marquee-item">🌲 Naturaleza</span>
              <span className="marquee-item">💪 Servicio</span>
              <span className="marquee-item">🔥 Fogones</span>
            </div>
            <div className="marquee-content" aria-hidden="true">
              <span className="marquee-item">⚜️ Siempre Listos</span>
              <span className="marquee-item">🏕️ Aventura</span>
              <span className="marquee-item">🤝 Hermandad</span>
              <span className="marquee-item">🌲 Naturaleza</span>
              <span className="marquee-item">💪 Servicio</span>
              <span className="marquee-item">🔥 Fogones</span>
            </div>
          </div>
        </div>
        <div className="marquee-track">
          <div className="marquee-wrapper marquee-right">
            <div className="marquee-content">
              <span className="marquee-item highlight">40+ años formando scouts</span>
              <span className="marquee-item">🎯 Liderazgo</span>
              <span className="marquee-item">🌟 Crecimiento</span>
              <span className="marquee-item">❤️ Comunidad</span>
              <span className="marquee-item">🧭 Exploración</span>
              <span className="marquee-item">✨ Valores</span>
            </div>
            <div className="marquee-content" aria-hidden="true">
              <span className="marquee-item highlight">40+ años formando scouts</span>
              <span className="marquee-item">🎯 Liderazgo</span>
              <span className="marquee-item">🌟 Crecimiento</span>
              <span className="marquee-item">❤️ Comunidad</span>
              <span className="marquee-item">🧭 Exploración</span>
              <span className="marquee-item">✨ Valores</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>¿Por qué ser Scout?</h2>
          <p>Descubre los valores y experiencias que te esperan</p>
        </div>
        <div className="features-grid">
          <Card className="feature-card">
            <CardBody>
              <div className="feature-icon">
                <FaLeaf />
              </div>
              <h3>Conexión con la Naturaleza</h3>
              <p>
                Aprende a vivir en armonía con el medio ambiente a través de campamentos y
                actividades al aire libre.
              </p>
            </CardBody>
          </Card>
          <Card className="feature-card">
            <CardBody>
              <div className="feature-icon">
                <FaHandshake />
              </div>
              <h3>Trabajo en Equipo</h3>
              <p>
                Desarrolla habilidades sociales y aprende a trabajar en conjunto para alcanzar metas
                comunes.
              </p>
            </CardBody>
          </Card>
          <Card className="feature-card">
            <CardBody>
              <div className="feature-icon">
                <FaStar />
              </div>
              <h3>Liderazgo</h3>
              <p>
                Fortalece tu capacidad de liderar y tomar decisiones responsables en diferentes
                situaciones.
              </p>
            </CardBody>
          </Card>
          <Card className="feature-card">
            <CardBody>
              <div className="feature-icon">
                <FaHeart />
              </div>
              <h3>Servicio Comunitario</h3>
              <p>Participa en proyectos que impactan positivamente en tu comunidad y el mundo.</p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Branches Preview */}
      <section className="branches-preview">
        <div className="section-header">
          <h2>Nuestras Ramas</h2>
          <p>Un programa adaptado a cada etapa de desarrollo</p>
        </div>
        <div className="branches-grid">
          <div className="branch-item manada">
            <img src={logoManada} alt="Logo Manada" className="branch-logo" />
            <div className="branch-content">
              <span className="branch-age">7-10 años</span>
              <h3>Manada</h3>
              <p>El inicio de la aventura scout</p>
            </div>
          </div>
          <div className="branch-item unidad">
            <img src={logoUnidad} alt="Logo Unidad" className="branch-logo" />
            <div className="branch-content">
              <span className="branch-age">10-14 años</span>
              <h3>Unidad</h3>
              <p>Explorando nuevos horizontes</p>
            </div>
          </div>
          <div className="branch-item caminantes">
            <img src={logoCaminantes} alt="Logo Caminantes" className="branch-logo" />
            <div className="branch-content">
              <span className="branch-age">14-18 años</span>
              <h3>Caminantes</h3>
              <p>El camino hacia la madurez</p>
            </div>
          </div>
          <div className="branch-item rover">
            <img src={logoRover} alt="Logo Rover" className="branch-logo" />
            <div className="branch-content">
              <span className="branch-age">18-22 años</span>
              <h3>Rover</h3>
              <p>Servicio y compromiso social</p>
            </div>
          </div>
        </div>
        <div className="branches-cta">
          <Link to="/guia/branches">
            <Button className="btn-primary" size="lg">
              Conoce todas las ramas
              <FaArrowRight />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para la aventura?</h2>
          <p>Únete a nuestra familia scout y comienza tu camino hacia nuevas experiencias</p>
          <div className="cta-buttons">
            <Link to="/contacto">
              <Button className="btn-primary" size="lg">
                Contáctanos
                <FaArrowRight />
              </Button>
            </Link>
            <Link to="/galeria">
              <Button className="btn-secondary" size="lg" variant="bordered">
                Ver galería
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </PageContainer>
  );
};
