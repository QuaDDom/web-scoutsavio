import React from 'react';
import '../styles/about.scss';
import { PageContainer } from '../components/PageContainer';

export const About = () => {
  return (
    <PageContainer>
      <h1>About</h1>
      <div className="aboutus">
        <p>
          El escultismo potencia el desarrollo integral de los jóvenes, guiándolos hacia su máximo
          potencial individual. Fortalecemos su carácter, fomentamos la ciudadanía y cultivamos sus
          cualidades espirituales, sociales, mentales y físicas. ¡Bienvenido a nuestra comunidad
          scout, donde crecemos juntos para ser líderes y ciudadanos comprometidos!
        </p>
      </div>
    </PageContainer>
  );
};
