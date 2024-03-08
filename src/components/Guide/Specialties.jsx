import React from 'react';
import { SpecialtiesModal } from './SpecialtiesModal';
import arte from '../../assets/specialties/arte.png';
import ciencia from '../../assets/specialties/ciencia.png';
import deporte from '../../assets/specialties/deporte.png';
import espiritualidad from '../../assets/specialties/espiritualidad.png';
import naturaleza from '../../assets/specialties/naturaleza.png';
import servicio from '../../assets/specialties/servicio.png';

export const Specialties = () => {
  return (
    <div>
      <h2 className="title text-5xl font-bold pb-10">Especialidades</h2>
      <div>
        <h4 className="text-2xl font-medium pb-2">¿Qué es una especialidad?</h4>
        <p className="text-gray-400">
          Una especialidad, es el conocimiento o habilidad particular, que se posee sobre una
          determinada materia. La especialidad scout, se origina y se desarrolla, según los
          intereses de cada uno de los chicos y chicas. Para llegar a dominarla, hace falta
          investigación, constancia y esfuerzo personal, pero siempre se comienza de manera
          sencilla.
        </p>
      </div>
      <br />
      <div>
        <h4 className="text-2xl font-medium pb-2">¿Quiénes pueden realizar la especialidad?:</h4>
        <p className="text-gray-400">
          Cualquier chico/a, una vez hecho su ingreso a su rama puede solicitar iniciarse en alguna
          especialidad. No necesita haber formulado su promesa, ni haber adquirido insignia de etapa
          alguna.
        </p>
        <p className="text-gray-400">
          <span className="font-bold text-gray-300">Único requisito:</span> Querer realizarla
        </p>
      </div>
      <br />
      <div className="pb-10">
        <h4 className="text-2xl font-medium pb-2">Descripción de la insignia:</h4>
        <p className="text-gray-400">
          Todos los parches tendrán el fondo de color arena como la camisa del Uniforme Scout. El
          color de los bordes (interior y exterior) variará dependiendo del color del campo. En su
          interior, lleva un icono que representa el campo al cual pertenece. (Exceptuando la de
          vida religiosa, que solo lo representa el color)
        </p>
      </div>
      <h3 className="text-3xl font-bold">Las especialidades están divididas en 6:</h3>
      <div className="flex flex-grap gap-10 pt-5">
        <SpecialtiesModal
          img={arte}
          specialtie="Arte"
          color="purple"
          colorname="Violeta"
          about="Este campo comprende lo relacionado a creatividad y cultura regional
        Este campo, abarca especialidades como: Aeromodelismo, Alfarería, Bellas Artes, Bonsái, Bordado, Cabuyería Artesanal, Cerámica, Cestería, Danza, Dibujo, Efectos Especiales, Encuadernación, Escenografía, Escritor, Folclore, Guardián de Leyenda, Hojalatería, Histrión, Lector, Maquetista, Música, Pintura, Talabarte ría, Tallado, Teatro, Tejido, Tradiciones Indígenas,Tradiciones Marinas, entre otras."
        />
        <SpecialtiesModal
          img={ciencia}
          specialtie="Ciencia y Tecnología"
          color="lightblue"
          colorname="Celeste"
          about="Este campo comprende lo relacionado a profesiones, oficios, oficios mecánicos y arte industrial.
        Este campo, abarca especialidades como Agrimensor, Albañilería, Bibliotecario, Camarógrafo, Carpintería, Cocina en general, Cocina sin utensilios, Construcción de Campamento, Costura, Diseño de Páginas Web, Electricidad, Electrónica, Energía, Genealogía, Informática, Internet, Mecánico, Panadero, Periodismo, Plomero, Química, Reparaciones, Reparador de PC, Repostería y Decoración, Secretariado, Sonidista, Tambero, Utilero y Vidriero."
        />
        <SpecialtiesModal
          img={deporte}
          specialtie="Deporte"
          color="blue"
          colorname="Azul"
          about="Este campo comprende lo relacionado con la actividad física o juegos de competencia.
        Este campo abarca especialidades como Aeróbic, Ajedrez, Andinismo, Arquería, Atletismo, Básquet, Buceo, Ciclismo, Defensa Personal, Equitación, Esgrima, Esquí, Fútbol, Gimnasia Artística, Gimnasia Deportiva, Golf, Handball, Hockey, Lucha Libre, Motonáutica, Natación, Navegación a vela, Paddle, Patinaje, Parapente, Pesca, Ping Pong, Polo, Remo, Rugby, Skalting, Ski Acuático, Softball, Squash, Sumo, Surf, Tenis, Voleibol, etc."
        />
      </div>
      <div className="flex flex-grap gap-10 pt-10">
        <SpecialtiesModal
          img={servicio}
          specialtie="Servicio a los demás"
          color="red"
          colorname="Rojo"
          about="Este campo comprende lo relacionado al trabajo comunitario y la solidaridad.
        Este campo abarca especialidades como Bombero, Civismo, Coleccionismo, Defensa Civil, Dentista, Guardacostas, Guardavidas, Guía, Intérprete, Primeros Auxilios, Puericultura, Radio operador, Seguridad, Señalización, Servicio Comunitario, Tránsito, Turismo, etc."
        />
        <SpecialtiesModal
          img={naturaleza}
          specialtie="Naturaleza"
          color="green"
          colorname="Verde"
          about="Este campo comprende la relación del hombre con la naturaleza y la manera de protegerla y servirse de ella.
        Este campo abarca especialidades como Acuarismo, Agropecuario, Astronomía, Avicultor, Apicultor, Botánica, Campismo, Cocina de Campamento, Conservación, Cría menor, Entomología, Excursionismo, Forestal, Geología, Horticultura, Jardinería, Lombricultura, Meteorología, Observación de la naturaleza, Orientación, Ornitología, Pionerismo, Protección de Animales, Reciclaje, Supervivencia, Vida Silvestre, Zoología."
        />
        <SpecialtiesModal
          img={espiritualidad}
          specialtie="Espiritualidad"
          color="yellow"
          colorname="Amarillo"
          about="Este campo comprende la relación del hombre con la naturaleza y la manera de protegerla y servirse de ella.
        Este campo abarca especialidades como Acuarismo, Agropecuario, Astronomía, Avicultor, Apicultor, Botánica, Campismo, Cocina de Campamento, Conservación, Cría menor, Entomología, Excursionismo, Forestal, Geología, Horticultura, Jardinería, Lombricultura, Meteorología, Observación de la naturaleza, Orientación, Ornitología, Pionerismo, Protección de Animales, Reciclaje, Supervivencia, Vida Silvestre, Zoología."
        />
      </div>
    </div>
  );
};
