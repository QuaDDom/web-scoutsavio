import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Card, CardBody, Image, Tabs, Tab } from '@nextui-org/react';
import { SEO } from '../SEO';
import './Progressions.scss';

// Manada progressions (7-10 años)
import pataTierna from '../../assets/progressions/manada/Pata-Tierna.png';
import saltador from '../../assets/progressions/manada/Saltador.png';
import rastreador from '../../assets/progressions/manada/Rastreador.png';
import cazador from '../../assets/progressions/manada/Cazador.png';
import manadaCompleta from '../../assets/progressions/manada/Completa.png';

// Unidad progressions (10-14 años)
import pista from '../../assets/progressions/unidad/Pista.png';
import senda from '../../assets/progressions/unidad/Senda.png';
import rumbo from '../../assets/progressions/unidad/Rumbo.png';
import travesia from '../../assets/progressions/unidad/Travesia.png';
import unidadCompleta from '../../assets/progressions/unidad/Completa.png';

// Caminantes progressions (14-18 años)
import norte from '../../assets/progressions/caminantes/Norte.png';
import este from '../../assets/progressions/caminantes/Este.png';
import sur from '../../assets/progressions/caminantes/Sur.png';
import oeste from '../../assets/progressions/caminantes/Oeste.png';
import caminantesCompleta from '../../assets/progressions/caminantes/Completa.png';

// Rovers progressions (18-22 años)
import encuentro from '../../assets/progressions/rovers/Encuentro.png';
import compromiso from '../../assets/progressions/rovers/Compromiso.png';
import proyeccion from '../../assets/progressions/rovers/Proyeccion.png';
import roversCompleta from '../../assets/progressions/rovers/Completa.png';

const progressionsData = {
  manada: {
    title: 'Manada',
    subtitle: '7 a 10 años',
    color: '#ff9800',
    description:
      'Las progresiones en la Manada representan el crecimiento del lobato a través de su aventura en la selva.',
    items: [
      {
        name: 'Pata Tierna',
        img: pataTierna,
        description:
          'El inicio del camino. El lobato comienza a conocer la manada y sus primeras leyes.'
      },
      {
        name: 'Saltador',
        img: saltador,
        description:
          'El lobato ya conoce la vida en la manada y empieza a desarrollar sus habilidades.'
      },
      {
        name: 'Rastreador',
        img: rastreador,
        description: 'Domina las técnicas básicas y ayuda a los más nuevos en su camino.'
      },
      {
        name: 'Cazador',
        img: cazador,
        description:
          'La máxima progresión. Es un ejemplo para toda la manada y está listo para la unidad.'
      },
      {
        name: 'Progresión Completa',
        img: manadaCompleta,
        description:
          'Ha completado todo el recorrido de la Manada y está preparado para el paso a la Unidad.'
      }
    ]
  },
  unidad: {
    title: 'Unidad',
    subtitle: '10 a 14 años',
    color: '#4caf50',
    description:
      'Las progresiones en la Unidad marcan el desarrollo del scout hacia la autonomía y el liderazgo.',
    items: [
      {
        name: 'Pista',
        img: pista,
        description: 'El scout inicia su camino, aprendiendo las bases del escultismo.'
      },
      {
        name: 'Senda',
        img: senda,
        description: 'Desarrollo de habilidades técnicas y trabajo en patrulla.'
      },
      {
        name: 'Rumbo',
        img: rumbo,
        description: 'Liderazgo dentro de la patrulla y compromiso con la tropa.'
      },
      {
        name: 'Travesía',
        img: travesia,
        description: 'Máximo desarrollo. Preparado para los desafíos de la rama Caminantes.'
      },
      {
        name: 'Progresión Completa',
        img: unidadCompleta,
        description: 'Ha completado todo el recorrido de la Unidad y está listo para Caminantes.'
      }
    ]
  },
  caminantes: {
    title: 'Caminantes',
    subtitle: '14 a 18 años',
    color: '#2196f3',
    description:
      'Las progresiones Caminantes representan los puntos cardinales, guiando el camino hacia la madurez y el servicio.',
    items: [
      {
        name: 'Norte',
        img: norte,
        description:
          'El inicio del camino caminante. Define su norte, sus metas y propósitos personales.'
      },
      {
        name: 'Este',
        img: este,
        description: 'El amanecer de nuevas experiencias. Desarrollo de proyectos personales.'
      },
      {
        name: 'Sur',
        img: sur,
        description: 'Consolidación del camino. Proyectos comunitarios y liderazgo.'
      },
      {
        name: 'Oeste',
        img: oeste,
        description: 'Preparación para el paso a Rovers. Servicio y compromiso total.'
      },
      {
        name: 'Progresión Completa',
        img: caminantesCompleta,
        description: 'Ha recorrido todos los puntos cardinales y está listo para ser Rover.'
      }
    ]
  },
  rover: {
    title: 'Rover',
    subtitle: '18 a 22 años',
    color: '#e53935',
    description:
      'La etapa Rover representa el servicio activo a la comunidad y el desarrollo personal completo.',
    items: [
      {
        name: 'Encuentro',
        img: encuentro,
        description: 'El encuentro consigo mismo y con la comunidad Rover. Inicio del compromiso.'
      },
      {
        name: 'Compromiso',
        img: compromiso,
        description: 'Compromiso formal con el escultismo y desarrollo de proyectos de servicio.'
      },
      {
        name: 'Proyección',
        img: proyeccion,
        description: 'Proyección hacia la sociedad. Impacto comunitario y liderazgo adulto.'
      },
      {
        name: 'Progresión Completa',
        img: roversCompleta,
        description: 'Ha completado su formación Rover. Preparado para la vida adulta scout.'
      }
    ]
  }
};

export const Progressions = () => {
  const [selectedBranch, setSelectedBranch] = useState('manada');

  return (
    <div className="progressions-page">
      <SEO
        title="Progresiones Scout"
        description="Sistema de progresiones scout: Pata Tierna, Saltador, Rastreador, Cazador (Manada), Pista, Senda, Rumbo, Travesía (Unidad) y más."
        keywords="progresiones scout, insignias scout, pata tierna, saltador, rastreador, cazador, pista, senda, rumbo"
        url="/guia/progressions"
      />
      <Link to="/guia" className="back-link">
        <FaArrowLeft /> Volver a la guía
      </Link>

      <div className="progressions-header">
        <h1>
          Sistema de <span className="gradient-text">Progresiones</span>
        </h1>
        <p>El camino de desarrollo personal en cada rama scout</p>
      </div>

      <div className="progressions-intro">
        <Card className="intro-card">
          <CardBody>
            <h3>¿Qué son las progresiones?</h3>
            <p>
              Las progresiones son el sistema de avance personal dentro del escultismo. Cada scout
              avanza a su propio ritmo, desarrollando habilidades, valores y actitudes que lo
              preparan para las siguientes etapas de su vida.
            </p>
          </CardBody>
        </Card>
      </div>

      <Tabs
        selectedKey={selectedBranch}
        onSelectionChange={setSelectedBranch}
        className="branch-tabs"
        color="warning"
        variant="underlined"
        size="lg">
        {Object.entries(progressionsData).map(([key, branch]) => (
          <Tab
            key={key}
            title={
              <span className="tab-title" style={{ '--branch-color': branch.color }}>
                {branch.title}
              </span>
            }>
            <div className="branch-content">
              <div className="branch-subtitle">{branch.subtitle}</div>
              <p className="branch-description">{branch.description}</p>

              <div className="progressions-grid">
                {branch.items.map((item, index) => (
                  <Card key={item.name} className="progression-card">
                    <CardBody>
                      <div className="progression-number" style={{ background: branch.color }}>
                        {index + 1}
                      </div>
                      {item.img && (
                        <div className="progression-image">
                          <Image src={item.img} alt={item.name} />
                        </div>
                      )}
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};
