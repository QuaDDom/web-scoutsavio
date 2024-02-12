import React from 'react';
import '../styles/guide.scss';
import { PageContainer } from '../components/PageContainer';
import { GuideCards } from '../components/GuideCards';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Title } from '../components/Useless/Title';

export const Guide = () => {
  const { pathname } = useLocation();

  if (pathname === '/guide') {
    return (
      <PageContainer>
        <Title>Guía</Title>
        <div className="cardsContainer">
          <Link to="/guide/specialties">
            <GuideCards
              img=""
              title="Especialidades"
              description="Áreas específicas para desarrollar habilidades y enriquecer la experiencia scout."
            />
          </Link>
          <Link to="/guide/progressions">
            <GuideCards
              img=""
              title="Progresiones"
              description="Sendero de desarrollo gradual que impulsa el crecimiento y la adquisición de habilidades clave en la experiencia scout."
            />
          </Link>
          <Link to="/guide/branches">
            <GuideCards
              img=""
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
