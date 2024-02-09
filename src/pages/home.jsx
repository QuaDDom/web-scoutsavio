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
      <main></main>
      <Footer />
    </PageContainer>
  );
};
