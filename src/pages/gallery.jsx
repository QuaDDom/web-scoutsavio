import React from 'react';
import { useState } from 'react';
import '../styles/gallery.scss';
import { PageContainer } from '../components/PageContainer';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
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
import { FaCamera, FaDownload, FaTimes } from 'react-icons/fa';
import {
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from '@nextui-org/react';

const galleryData = [
  { id: 1, imgSrc: img1, title: 'Campamento 2024', category: 'Campamento' },
  { id: 2, imgSrc: img2, title: 'Actividad al aire libre', category: 'Actividades' },
  { id: 3, imgSrc: img3, title: 'Fogón scout', category: 'Eventos' },
  { id: 4, imgSrc: img4, title: 'Excursión', category: 'Excursiones' },
  { id: 5, imgSrc: img5, title: 'Juegos en grupo', category: 'Actividades' },
  { id: 6, imgSrc: img6, title: 'Ceremonia', category: 'Eventos' },
  { id: 7, imgSrc: img7, title: 'Naturaleza', category: 'Excursiones' },
  { id: 8, imgSrc: img8, title: 'Trabajo en equipo', category: 'Actividades' },
  { id: 9, imgSrc: img9, title: 'Campamento nocturno', category: 'Campamento' },
  { id: 10, imgSrc: img10, title: 'Senderismo', category: 'Excursiones' },
  { id: 11, imgSrc: img11, title: 'Actividad grupal', category: 'Actividades' },
  { id: 12, imgSrc: img12, title: 'Momentos especiales', category: 'Eventos' }
];

export const Gallery = () => {
  const [filter, setFilter] = useState('Todos');
  const categories = ['Todos', 'Campamento', 'Actividades', 'Excursiones', 'Eventos'];

  const filteredData =
    filter === 'Todos' ? galleryData : galleryData.filter((item) => item.category === filter);

  return (
    <PageContainer>
      <SEO
        title="Galería"
        description="Galería de fotos del Grupo Scout 331 Savio. Revive los mejores momentos de nuestros campamentos, actividades, excursiones y eventos scouts en Río Tercero."
        keywords="fotos scouts, galería scout, campamentos scouts, actividades scouts, eventos scouts, excursiones"
        url="/galeria"
      />
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <FaCamera />
          </div>
          <h1>
            Galería <span className="gradient-text">Scout</span>
          </h1>
          <p>Revive los mejores momentos de nuestras aventuras</p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="filter-container">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}>
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-section">
        <div className="gallery-grid">
          {filteredData.map((item) => (
            <GalleryImage key={item.id} {...item} />
          ))}
        </div>
      </section>

      <Footer />
    </PageContainer>
  );
};

const GalleryImage = ({ id, imgSrc, title, category }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <div className="gallery-item" onClick={onOpen}>
        <Image className="gallery-img" src={imgSrc} alt={title} />
        <div className="gallery-overlay">
          <span className="gallery-category">{category}</span>
          <h3>{title}</h3>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        classNames={{
          backdrop: 'bg-black/80 backdrop-blur-sm',
          base: 'bg-transparent shadow-none'
        }}>
        <ModalContent className="modal-content">
          <ModalHeader className="modal-header">
            <h3>{title}</h3>
            <span className="modal-category">{category}</span>
          </ModalHeader>
          <ModalBody className="modal-body">
            <Image src={imgSrc} alt={title} className="modal-image" />
          </ModalBody>
          <ModalFooter className="modal-footer">
            <Button className="download-btn" startContent={<FaDownload />}>
              Descargar
            </Button>
            <Button variant="bordered" onPress={onClose} className="close-btn">
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
