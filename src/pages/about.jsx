import React from 'react';
import '../styles/about.scss';
import { PageContainer } from '../components/PageContainer';
import { Footer } from '../components/Footer';
import imgPanoleta from '../assets/pañoleta.png';
import { Image, Card, CardBody } from '@nextui-org/react';
import imgWalle from '../assets/walle.jpg';
import imgPromesa from '../assets/promesa.jpg';
import { FaUsers, FaHeart, FaGlobeAmericas, FaHandsHelping } from 'react-icons/fa';

export const About = () => {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>
            ¿Quiénes <span className="gradient-text">somos</span>?
          </h1>
          <p>Conoce nuestra historia y valores</p>
        </div>
      </section>

      {/* Pañoleta Section */}
      <section className="panoleta-section">
        <div className="panoleta-container">
          <img src={imgPanoleta} alt="Pañoleta Scout Savio" className="panoleta-img" />
          <div className="panoleta-info">
            <h2>Nuestra Identidad</h2>
            <p>
              La pañoleta es el símbolo distintivo de nuestro grupo. Sus colores representan los
              valores que nos definen y el compromiso que asumimos como scouts.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="section-header">
          <h2>
            Nuestros <span className="gradient-text">Valores</span>
          </h2>
        </div>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">
              <FaUsers />
            </div>
            <h3>Comunidad</h3>
            <p>Creemos en el poder del trabajo en equipo y la construcción de lazos fraternales.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <FaHeart />
            </div>
            <h3>Compromiso</h3>
            <p>Nos comprometemos con nuestra promesa scout y con cada acción que realizamos.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <FaGlobeAmericas />
            </div>
            <h3>Naturaleza</h3>
            <p>Respetamos y cuidamos el medio ambiente como parte esencial de nuestra formación.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <FaHandsHelping />
            </div>
            <h3>Servicio</h3>
            <p>Servir a los demás es parte fundamental de lo que significa ser scout.</p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="history-section">
        <Card className="history-card">
          <CardBody>
            <div className="history-content">
              <div className="history-image">
                <Image src={imgWalle} alt="Historia del grupo" className="card-image" />
              </div>
              <div className="history-text">
                <h2>
                  Nuestra <span className="gradient-text">Historia</span>
                </h2>
                <p>
                  El grupo Scout Gral Manuel Nicolás Savio nace en marzo de 1982, de la mano de un
                  grupo de educadores que proyectaron sumar una propuesta scout más a la ciudad de
                  Río Tercero.
                </p>
                <p>
                  Desde entonces somos una parte activa de la comunidad de la ciudad de Río Tercero
                  que brinda un espacio de aprendizaje colectivo en el marco de la naturaleza,
                  potenciando las habilidades de cada niño, niña y jóven que forma parte de nuestro
                  grupo.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="history-card reverse">
          <CardBody>
            <div className="history-content">
              <div className="history-image">
                <Image src={imgPromesa} alt="Promesa Scout" className="card-image" />
              </div>
              <div className="history-text">
                <h2>
                  ¿A qué <span className="gradient-text">pertenecemos</span>?
                </h2>
                <p>
                  Nuestro grupo pertenece a la Scouts de Argentina Asociación Civil (SAAC), a través
                  de la cual ofrecemos una propuesta educativa no formal que contempla la vida en la
                  naturaleza, trabajo en equipo, ejercicio del liderazgo, gestión de proyectos, toma
                  de decisiones democráticas, acompañados por adultos voluntarios que creen en el
                  potencial de cada chico, chica y jóven de nuestra comunidad.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      <Footer />
    </PageContainer>
  );
};
