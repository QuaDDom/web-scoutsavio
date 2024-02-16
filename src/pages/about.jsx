import React from 'react';
import '../styles/about.scss';
import { PageContainer } from '../components/PageContainer';
import img1 from '../assets/aboutimages/img1.jpg';
import imgPanoleta from '../assets/pañoleta.png';
import { Title } from '../components/Useless/Title';
import { Image, Card, CardBody } from '@nextui-org/react';
import imgWalle from '../assets/walle.jpg';
import imgPromesa from '../assets/promesa.jpg';

export const About = () => {
  return (
    <PageContainer>
      <div className="aboutusContainer">
        <div className="aboutus">
          <Title>¿Quienes somos?</Title>
          <div className="panoletaContainer">
            <img src={imgPanoleta} alt="Pañoleta Scout Savio" />
          </div>
          <div className="content">
            <Card className=" dark:bg-default-100/50 w-[85%] p-7">
              <CardBody>
                <div className="grid grid-cols-2 md:grid-cols-12 items-center justify-center">
                  <div className="relative col-span-6 md:col-span-3">
                    <Image src={imgWalle} alt="" width="250px" className="cardImage" />
                  </div>
                  <div className="flex flex-col col-span-6 md:col-span-8 gap-8">
                    <h3 className="font-bold text-3xl">Historia</h3>
                    <p>
                      El grupo Scout Gral Manuel Nicolás Savio nace en marzo de 1982, de la mano de
                      un grupo de educadores que proyectaron sumar una propuesta scout más a la
                      ciudad de Río Tercero.
                    </p>
                    <p>
                      Desde entonces somos una parte activa de la comunidad de la ciudad de Río
                      Tercero que brinda un espacio de aprendizaje colectivo en el marco de la
                      naturaleza, potenciando las habilidades de cada niño, niña y jóven que forma
                      parte de nuestro grupo.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className=" dark:bg-default-100/50 w-[85%] p-7">
              <CardBody>
                <div className="grid grid-cols-2 md:grid-cols-12 items-center justify-center">
                  <div className="relative col-span-12 md:col-span-3">
                    <Image src={imgPromesa} alt="" className="cardImage" />
                  </div>
                  <div className="flex flex-col col-span-6 md:col-span-8 gap-5">
                    <h3 className="font-bold text-3xl">¿A qué pertenecemos?</h3>
                    <p>
                      Nuestro grupo pertenece a la Scouts de Argentina Asociación Civil (SAAC), a
                      través de la cual ofrecemos una propuesta educativa no formal que contempla la
                      vida en la naturaleza, trabajo en equipo, ejercicio del liderazgo, gestión de
                      proyectos, toma de decisiones democráticas, acompañados por adultos
                      voluntarios que creen en el potencial de cada chico, chica y jóven de nuestra
                      comunidad.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
