import React from 'react';
import { useState } from 'react';
import '../styles/gallery.scss';
import { PageContainer } from '../components/PageContainer';
import { Title } from '../components/Useless/Title';
import img1 from '../assets/galleryimages/img1.jpg';
import img2 from '../assets/galleryimages/img2.jpg';
import img3 from '../assets/galleryimages/img3.jpg';
import img4 from '../assets/galleryimages/img4.jpg';
import img5 from '../assets/galleryimages/img5.jpg';
import img6 from '../assets/galleryimages/img6.jpg';
import img7 from '../assets/galleryimages/img7.jpg';
import img8 from '../assets/galleryimages/img8.jpg';
import img9 from '../assets/galleryimages/img9.jpg';
import img10 from '../assets/galleryimages/img10.jpg';
import img11 from '../assets/galleryimages/img11.jpg';
import img12 from '../assets/galleryimages/img12.jpg';
import { Popover, PopoverTrigger, PopoverContent, Button, Tooltip } from '@nextui-org/react';
import { FaQuestionCircle } from 'react-icons/fa';
import {
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react';

let data = [
  { id: 1, imgSrc: img1, title: 'example' },
  { id: 2, imgSrc: img2, title: 'example' },
  { id: 3, imgSrc: img3, title: 'example' },
  { id: 4, imgSrc: img4, title: 'example' },
  { id: 5, imgSrc: img5, title: 'example' },
  { id: 6, imgSrc: img6, title: 'example' },
  { id: 7, imgSrc: img7, title: 'example' },
  { id: 8, imgSrc: img8, title: 'example' },
  { id: 9, imgSrc: img9, title: 'example' },
  { id: 10, imgSrc: img10, title: 'example' },
  { id: 11, imgSrc: img11, title: 'example' },
  { id: 12, imgSrc: img12, title: 'example' }
];

export const Gallery = () => {
  return (
    <PageContainer>
      <div className="headerContainer">
        <Title>Galería Scout</Title>
        <Tooltip
          placement="left"
          showArrow={true}
          backdrop="opaque"
          className="popover"
          content={
            <div className="px-1 py-2 w-[250px]">
              <div className="text-lg font-bold">¿Qué es la galería Scout?</div>
              <div className="text-small">
                Aquí se muestran y se subirán fotos de los campamentos y actividades scout
              </div>
            </div>
          }>
          <button className="aboutButton">
            <FaQuestionCircle />
          </button>
        </Tooltip>
      </div>
      <div className="gallery">
        {data.map(({ id, imgSrc }, index) => (
          <GalleryImage id={id} imgSrc={imgSrc} key={id} />
        ))}
      </div>
    </PageContainer>
  );
};

const GalleryImage = ({ id, imgSrc }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleClick = () => setIsOpen(!isOpen);
  return (
    <>
      <Image
        className="pics"
        onClick={onOpen}
        isBlurred
        width="100%"
        src={imgSrc}
        alt={id}
        classNames="m-5"
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Titulo de imagen</ModalHeader>
          <ModalBody>
            <Image isBlurred width="100%" src={imgSrc} alt={id} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onClose}>
              Descargar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
