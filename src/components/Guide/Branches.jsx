import React from 'react';
import { BranchCard } from './BranchCard';
import './Branches.scss';
import { SEO } from '../SEO';
import imgManada from '../../assets/ramas/manada.jpg';
import imgUnidad from '../../assets/ramas/unidad.jpg';
import imgCaminantes from '../../assets/ramas/caminantes.webp';
import imgRover from '../../assets/ramas/rover.jpg';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export const Branches = () => {
  return (
    <div className="branches-page">
      <SEO
        title="Ramas Scouts"
        description="Conoce las 4 ramas del escultismo: Manada (7-11 años), Unidad (11-14 años), Caminantes (15-18 años) y Rover (+18 años). Cada rama con programas adaptados a cada edad."
        keywords="ramas scouts, manada scout, unidad scout, caminantes scout, rover, edades scouts, programa scout"
        url="/guia/branches"
      />
      <Link to="/guia" className="back-link">
        <FaArrowLeft /> Volver a la guía
      </Link>

      <div className="branches-header">
        <h1>
          Nuestras <span className="gradient-text">Ramas</span>
        </h1>
        <p>
          Cada rama tiene un programa adaptado a las necesidades y características de cada grupo de
          edad
        </p>
      </div>

      <div className="branches-grid">
        <BranchCard
          rama="Manada"
          img={imgManada}
          color="#ff9800"
          edades="De 7 a 11 años"
          objetivos={[
            'Fomento de la amistad, el compañerismo y el respeto por la naturaleza.',
            'Introducción a la Ley y Promesa Scout.'
          ]}
          enfoques={[
            'Desarrollo Integral: La Manada se centra en el desarrollo físico, intelectual, social y espiritual de los niños y niñas.',
            'Aprendizaje Lúdico: Las actividades incluyen juegos, canciones, manualidades y actividades al aire libre para estimular la imaginación y la creatividad.'
          ]}
        />
        <BranchCard
          rama="Unidad"
          img={imgUnidad}
          color="#4caf50"
          edades="De 11 a 14 años"
          objetivos={[
            'Campamentos que incluyen actividades de cocina al aire libre y construcción de refugios.',
            'Proyectos comunitarios para inculcar el espíritu de servicio.'
          ]}
          enfoques={[
            'Desarrollo Personal y Social: La Tropa busca fortalecer la autonomía y responsabilidad de los scouts, promoviendo la participación activa en la sociedad.',
            'Trabajo en Equipo: Se enfatiza el trabajo en equipo y la toma de decisiones democráticas.'
          ]}
        />
        <BranchCard
          rama="Caminantes"
          img={imgCaminantes}
          color="#2196f3"
          edades="De 15 a 18 años"
          objetivos={[
            'Excursiones de mayor duración, promoviendo la resistencia y la planificación.',
            'Proyectos sociales más complejos y desafiantes.'
          ]}
          enfoques={[
            'Desafíos Físicos y Mentales: Los Caminantes enfrentan retos más exigentes, promoviendo el crecimiento personal y la superación de obstáculos.',
            'Liderazgo y Autonomía: Desarrollo de habilidades de liderazgo y toma de decisiones autónomas.'
          ]}
        />
        <BranchCard
          rama="Rover"
          img={imgRover}
          color="#9c27b0"
          edades="A partir de los 18 años"
          objetivos={[
            'Liderazgo en eventos scouts y participación en acciones solidarias.',
            'Proyectos personales y grupales orientados al desarrollo social y personal.'
          ]}
          enfoques={[
            'Servicio a la Comunidad: Los Rovers se comprometen en proyectos de servicio comunitario, contribuyendo al bienestar de la sociedad.',
            'Crecimiento Personal: Fomenta el desarrollo personal, la reflexión y la toma de responsabilidades.'
          ]}
        />
      </div>
    </div>
  );
};
