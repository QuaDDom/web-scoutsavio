import React from 'react';
import './GuideCards.scss';
import { FaArrowRight } from 'react-icons/fa';

export const GuideCards = ({ img, title, description }) => {
  return (
    <div className="guide-card">
      <div className="card-image">
        <img src={img} alt={title} />
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <span className="card-link">
          Ver más <FaArrowRight />
        </span>
      </div>
    </div>
  );
};
