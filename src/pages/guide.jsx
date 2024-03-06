import React from 'react';
import '../styles/guide.scss';
import { PageContainer } from '../components/PageContainer';
import { GuideCards } from '../components/GuideCards';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Title } from '../components/Useless/Title';
import imgPertenencia from '../assets/guideimages/pertenenciarama.png';
import imgProgresiones from '../assets/guideimages/progresiones.png';
import imgEspecialidades from '../assets/guideimages/especialidades.png';

export const Guide = () => {
  const { pathname } = useLocation();

  if (pathname === '/guia') {
    return (
      <PageContainer>
        <Title>Guía</Title>
        <div className="cardsContainer">
          <Link to="/guia/specialties">
            <GuideCards
              img={imgEspecialidades}
              title="Especialidades"
              description="Áreas específicas para desarrollar habilidades y enriquecer la experiencia scout."
            />
          </Link>
          <Link to="/guia/progressions">
            <GuideCards
              img={imgProgresiones}
              title="Progresiones"
              description="Sendero de desarrollo gradual que impulsa el crecimiento y la adquisición de habilidades clave en la experiencia scout."
            />
          </Link>
          <Link to="/guia/branches">
            <GuideCards
              img={imgPertenencia}
              title="Ramas"
              description="Divisiones por edad con programas adaptados para el desarrollo progresivo de habilidades."
            />
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  );
};
