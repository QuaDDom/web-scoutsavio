import React from 'react';
import { BranchCard } from './BranchCard';
import './Branches.scss';
import imgManada from '../../assets/ramas/manada.jpg';
import imgUnidad from '../../assets/ramas/unidad.jpg';
import imgCaminantes from '../../assets/ramas/caminantes.webp';
import imgRover from '../../assets/ramas/rover.jpg';

export const Branches = () => {
  return (
    <div>
      <h2 className="title text-5xl font-bold">Ramas</h2>
      <div className="branchCardsContainer">
        <BranchCard
          rama="Manada"
          img={imgManada}
          edades={'De 6 a 11 años.'}
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
          edades={'De 11 a 14 años.'}
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
          edades={'Edades: De 15 a 18 años.'}
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
          edades={'A partir de los 18 años.'}
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
