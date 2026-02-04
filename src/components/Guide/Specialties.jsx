import React from 'react';
import { SpecialtiesModal } from './SpecialtiesModal';
import './Specialties.scss';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import arte from '../../assets/specialties/arte.png';
import ciencia from '../../assets/specialties/ciencia.png';
import deporte from '../../assets/specialties/deporte.png';
import espiritualidad from '../../assets/specialties/espiritualidad.png';
import naturaleza from '../../assets/specialties/naturaleza.png';
import servicio from '../../assets/specialties/servicio.png';

export const Specialties = () => {
  return (
    <div className="specialties-page">
      <Link to="/guia" className="back-link">
        <FaArrowLeft /> Volver a la guía
      </Link>

      <div className="specialties-header">
        <h1>
          Las <span className="gradient-text">Especialidades</span>
        </h1>
        <p>Descubre las diferentes áreas de conocimiento que puedes explorar</p>
      </div>

      <div className="specialties-intro">
        <div className="intro-card">
          <h3>¿Qué es una especialidad?</h3>
          <p>
            Una especialidad es el conocimiento o habilidad particular que se posee sobre una
            determinada materia. La especialidad scout se origina y se desarrolla según los
            intereses de cada uno de los chicos y chicas. Para llegar a dominarla, hace falta
            investigación, constancia y esfuerzo personal, pero siempre se comienza de manera
            sencilla.
          </p>
        </div>

        <div className="intro-card">
          <h3>¿Quiénes pueden realizarla?</h3>
          <p>
            Cualquier chico/a, una vez hecho su ingreso a su rama puede solicitar iniciarse en
            alguna especialidad. No necesita haber formulado su promesa, ni haber adquirido insignia
            de etapa alguna.
          </p>
          <div className="highlight">
            <strong>Único requisito:</strong> ¡Querer realizarla!
          </div>
        </div>

        <div className="intro-card">
          <h3>Descripción de la insignia</h3>
          <p>
            Todos los parches tendrán el fondo de color arena como la camisa del Uniforme Scout. El
            color de los bordes (interior y exterior) variará dependiendo del color del campo. En su
            interior, lleva un icono que representa el campo al cual pertenece.
          </p>
        </div>
      </div>

      <div className="specialties-categories">
        <h2>
          Las especialidades están divididas en <span className="gradient-text">6 campos</span>
        </h2>

        <div className="categories-grid">
          <SpecialtiesModal
            img={arte}
            specialtie="Arte"
            color="purple"
            colorname="Violeta"
            about="Este campo comprende lo relacionado a creatividad y cultura regional. Este campo abarca especialidades como: Aeromodelismo, Alfarería, Bellas Artes, Bonsái, Bordado, Cabuyería Artesanal, Cerámica, Cestería, Danza, Dibujo, Efectos Especiales, Encuadernación, Escenografía, Escritor, Folclore, Guardián de Leyenda, Hojalatería, Histrión, Lector, Maquetista, Música, Pintura, Talabartería, Tallado, Teatro, Tejido, Tradiciones Indígenas, Tradiciones Marinas, entre otras."
          />
          <SpecialtiesModal
            img={ciencia}
            specialtie="Ciencia y Tecnología"
            color="lightblue"
            colorname="Celeste"
            about="Este campo comprende lo relacionado a profesiones, oficios, oficios mecánicos y arte industrial. Este campo abarca especialidades como Agrimensor, Albañilería, Bibliotecario, Camarógrafo, Carpintería, Cocina en general, Cocina sin utensilios, Construcción de Campamento, Costura, Diseño de Páginas Web, Electricidad, Electrónica, Energía, Genealogía, Informática, Internet, Mecánico, Panadero, Periodismo, Plomero, Química, Reparaciones, Reparador de PC, Repostería y Decoración, Secretariado, Sonidista, Tambero, Utilero y Vidriero."
          />
          <SpecialtiesModal
            img={deporte}
            specialtie="Deporte"
            color="blue"
            colorname="Azul"
            about="Este campo comprende lo relacionado con la actividad física o juegos de competencia. Este campo abarca especialidades como Aeróbic, Ajedrez, Andinismo, Arquería, Atletismo, Básquet, Buceo, Ciclismo, Defensa Personal, Equitación, Esgrima, Esquí, Fútbol, Gimnasia Artística, Gimnasia Deportiva, Golf, Handball, Hockey, Lucha Libre, Motonáutica, Natación, Navegación a vela, Paddle, Patinaje, Parapente, Pesca, Ping Pong, Polo, Remo, Rugby, Skalting, Ski Acuático, Softball, Squash, Sumo, Surf, Tenis, Voleibol, etc."
          />
          <SpecialtiesModal
            img={servicio}
            specialtie="Servicio a los demás"
            color="red"
            colorname="Rojo"
            about="Este campo comprende lo relacionado al trabajo comunitario y la solidaridad. Este campo abarca especialidades como Bombero, Civismo, Coleccionismo, Defensa Civil, Dentista, Guardacostas, Guardavidas, Guía, Intérprete, Primeros Auxilios, Puericultura, Radio operador, Seguridad, Señalización, Servicio Comunitario, Tránsito, Turismo, etc."
          />
          <SpecialtiesModal
            img={naturaleza}
            specialtie="Naturaleza"
            color="green"
            colorname="Verde"
            about="Este campo comprende la relación del hombre con la naturaleza y la manera de protegerla y servirse de ella. Este campo abarca especialidades como Acuarismo, Agropecuario, Astronomía, Avicultor, Apicultor, Botánica, Campismo, Cocina de Campamento, Conservación, Cría menor, Entomología, Excursionismo, Forestal, Geología, Horticultura, Jardinería, Lombricultura, Meteorología, Observación de la naturaleza, Orientación, Ornitología, Pionerismo, Protección de Animales, Reciclaje, Supervivencia, Vida Silvestre, Zoología."
          />
          <SpecialtiesModal
            img={espiritualidad}
            specialtie="Espiritualidad"
            color="yellow"
            colorname="Amarillo"
            about="Este campo comprende el desarrollo espiritual y la conexión con la fe. Las especialidades en este campo buscan fortalecer los valores espirituales y la reflexión personal, promoviendo la paz interior y el compromiso con los demás."
          />
        </div>
      </div>
    </div>
  );
};
