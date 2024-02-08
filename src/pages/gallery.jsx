import React from 'react';
import { useState } from 'react';
import '../styles/gallery.scss';
import { PageContainer } from '../components/PageContainer';
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
      <h1>Gallery</h1>
      <div className="gallery">
        {data.map(({ id, imgSrc }, index) => (
          <GalleryImage id={id} imgSrc={imgSrc} key={id} />
        ))}
      </div>
    </PageContainer>
  );
};

const GalleryImage = ({ id, imgSrc }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);
  return (
    <>
      <div className="pics" onClick={handleClick}>
        <img src={imgSrc} alt={id} style={{ width: '100%' }} />
      </div>
      {isOpen && (
        <div className={`imgOpen ${isOpen && 'isOpen'}`} onClick={handleClick}>
          <div className="imgContainer">
            <img src={imgSrc} alt={id} style={{ width: '100%' }} />
          </div>
        </div>
      )}
    </>
  );
};
