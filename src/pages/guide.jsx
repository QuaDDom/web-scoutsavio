import React from 'react';
import '../styles/guide.scss';
import { PageContainer } from '../components/PageContainer';
import { GuideCards } from '../components/GuideCards';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export const Guide = () => {
  return (
    <PageContainer>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <div className="cardsContainer">
        <GuideCards
          img=""
          title="Especialidades"
          description="Áreas específicas para desarrollar habilidades y enriquecer la experiencia scout."
        />
        <GuideCards
          img=""
          title="Progresiones"
          description="Sendero de desarrollo gradual que impulsa el crecimiento y la adquisición de habilidades clave en la experiencia scout."
        />
        <GuideCards
          img=""
          title="Ramas"
          description="Divisiones por edad con programas adaptados para el desarrollo progresivo de habilidades."
        />
      </div>
    </PageContainer>
  );
};
