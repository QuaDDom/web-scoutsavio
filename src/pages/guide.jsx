import React from 'react';
import '../styles/guide.scss';
import { PageContainer } from '../components/PageContainer';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { GuideCards } from '../components/GuideCards';
import { Link, Outlet, useLocation } from 'react-router-dom';
import imgPertenencia from '../assets/guideimages/pertenenciarama.png';
import imgProgresiones from '../assets/guideimages/progresiones.png';
import imgEspecialidades from '../assets/guideimages/especialidades.png';
import { FaBook, FaArrowRight } from 'react-icons/fa';

export const Guide = () => {
  const { pathname } = useLocation();

  if (pathname === '/guia') {
    return (
      <PageContainer>
        <SEO
          title="Guía Scout"
          description="Guía completa del escultismo: especialidades, progresiones y ramas scouts. Todo lo que necesitas saber sobre el movimiento scout en el Grupo Scout 331 Savio."
          keywords="guía scout, especialidades scout, progresiones scout, ramas scouts, manada, unidad, caminantes, rover, insignias scout"
          url="/guia"
        />
        {/* Hero Section */}
        <section className="guide-hero">
          <div className="hero-content">
            <div className="hero-icon">
              <FaBook />
            </div>
            <h1>
              Guía <span className="gradient-text">Scout</span>
            </h1>
            <p>Todo lo que necesitas saber sobre el movimiento scout</p>
          </div>
        </section>

        {/* Cards Section */}
        <section className="guide-cards-section">
          <div className="cards-grid">
            <Link to="/guia/specialties" className="guide-link">
              <GuideCards
                img={imgEspecialidades}
                title="Especialidades"
                description="Áreas específicas para desarrollar habilidades y enriquecer la experiencia scout."
              />
            </Link>
            <Link to="/guia/progressions" className="guide-link">
              <GuideCards
                img={imgProgresiones}
                title="Progresiones"
                description="Sendero de desarrollo gradual que impulsa el crecimiento y la adquisición de habilidades clave."
              />
            </Link>
            <Link to="/guia/branches" className="guide-link">
              <GuideCards
                img={imgPertenencia}
                title="Ramas"
                description="Divisiones por edad con programas adaptados para el desarrollo progresivo."
              />
            </Link>
          </div>
        </section>

        {/* Info Section */}
        <section className="guide-info-section">
          <div className="info-content">
            <h2>¿Por qué es importante la guía scout?</h2>
            <p>
              La guía scout es una herramienta fundamental para el desarrollo integral de cada
              scout. A través de las progresiones, especialidades y el trabajo en cada rama, los
              scouts aprenden valores, desarrollan habilidades y crecen como personas.
            </p>
            <div className="info-features">
              <div className="feature">
                <span className="number">01</span>
                <div>
                  <h4>Progresión personal</h4>
                  <p>Cada scout avanza a su propio ritmo</p>
                </div>
              </div>
              <div className="feature">
                <span className="number">02</span>
                <div>
                  <h4>Aprendizaje práctico</h4>
                  <p>Aprende haciendo</p>
                </div>
              </div>
              <div className="feature">
                <span className="number">03</span>
                <div>
                  <h4>Desarrollo integral</h4>
                  <p>Cuerpo, mente y espíritu</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="guide-subpage">
        <Outlet />
      </div>
      <Footer />
    </PageContainer>
  );
};
