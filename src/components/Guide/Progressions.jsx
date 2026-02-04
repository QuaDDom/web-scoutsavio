import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Card, CardBody, Image, Tabs, Tab } from '@nextui-org/react';
import { SEO } from '../SEO';
import './Progressions.scss';

// Manada progressions
import pataTierna from '../../assets/progressions/manada/PATA-TIERNA.png';
import saltador from '../../assets/progressions/manada/SALTADOR.png';
import rastreador from '../../assets/progressions/manada/RASTREADOR.png';
import cazador from '../../assets/progressions/manada/CAZADOR.png';

// Unidad progressions
import unidad1 from '../../assets/progressions/unidad/1.png';
import unidad2 from '../../assets/progressions/unidad/2.png';
import unidad3 from '../../assets/progressions/unidad/3.png';
import unidad4 from '../../assets/progressions/unidad/4.png';

const progressionsData = {
  manada: {
    title: 'Manada',
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
      }
    ]
  },
  unidad: {
    title: 'Unidad',
    color: '#4caf50',
    description:
      'Las progresiones en la Unidad marcan el desarrollo del scout hacia la autonomía y el liderazgo.',
    items: [
      {
        name: 'Pista',
        img: unidad1,
        description: 'El scout inicia su camino, aprendiendo las bases del escultismo.'
      },
      {
        name: 'Senda',
        img: unidad2,
        description: 'Desarrollo de habilidades técnicas y trabajo en patrulla.'
      },
      {
        name: 'Rumbo',
        img: unidad3,
        description: 'Liderazgo dentro de la patrulla y compromiso con la tropa.'
      },
      {
        name: 'Travesía',
        img: unidad4,
        description: 'Máximo desarrollo. Preparado para los desafíos de la rama Caminantes.'
      }
    ]
  },
  caminantes: {
    title: 'Caminantes',
    color: '#2196f3',
    description:
      'Las progresiones Caminantes representan el camino hacia la madurez y el servicio.',
    items: [
      {
        name: 'Rumbo',
        description: 'Inicio del camino caminante, definiendo metas personales.'
      },
      {
        name: 'Travesía',
        description: 'Desarrollo de proyectos personales y comunitarios.'
      },
      {
        name: 'Desafío',
        description: 'Compromiso total con el servicio y preparación para ser Rover.'
      }
    ]
  },
  rover: {
    title: 'Rover',
    color: '#9c27b0',
    description:
      'La etapa Rover representa el servicio activo a la comunidad y el desarrollo personal completo.',
    items: [
      {
        name: 'Partida',
        description: 'Inicio del compromiso como joven adulto en el movimiento.'
      },
      {
        name: 'Servicio',
        description: 'Desarrollo de proyectos de impacto comunitario.'
      },
      {
        name: 'Partida Rover',
        description: 'Máximo compromiso con el escultismo y la sociedad.'
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
