import React from 'react';
import '../styles/home.scss';
import { PageContainer } from '../components/PageContainer';
import { Footer } from '../components/Footer';
import img1 from '../assets/homeimages/img1.jpg';

export const Home = () => {
  return (
    <PageContainer>
      <div className="welcome">
        <img src={img1} alt="" />
        <div className="content">
          <h1>Bienvenido a la página de Scouts Savio</h1>
          <button>Únete a la aventura</button>
        </div>
      </div>
      <main>
        <p>
          El escultismo potencia el desarrollo integral de los jóvenes, guiándolos hacia su máximo
          potencial individual. Fortalecemos su carácter, fomentamos la ciudadanía y cultivamos sus
          cualidades espirituales, sociales, mentales y físicas. ¡Bienvenido a nuestra comunidad
          scout, donde crecemos juntos para ser líderes y ciudadanos comprometidos!
        </p>
      </main>
      <Footer />
    </PageContainer>
  );
};
