import React from 'react';
import '../styles/about.scss';
import { PageContainer } from '../components/PageContainer';
import img1 from '../assets/aboutimages/img1.jpg';

export const About = () => {
  return (
    <PageContainer>
      <div className="aboutusContainer">
        <div className="aboutus">
          <img src={img1} alt="" />
          <div className="content">
            <h1>¿Quienes somos?</h1>
            <p>
              El escultismo potencia el desarrollo integral de los jóvenes, guiándolos hacia su
              máximo potencial individual. Fortalecemos su carácter, fomentamos la ciudadanía y
              cultivamos sus cualidades espirituales, sociales, mentales y físicas. ¡Bienvenido a
              nuestra comunidad scout, donde crecemos juntos para ser líderes y ciudadanos
              comprometidos!
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
