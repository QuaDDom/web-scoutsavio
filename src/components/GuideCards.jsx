import React from 'react';
import './GuideCards.scss';

export const GuideCards = ({ img, title, description }) => {
  return (
    <div className="cardContainer">
      <img src={img} alt="" width="100%" />
      {/* <div className="content">
        <h4 className="title">{title}</h4>
        <p className="description">{description}</p>
      </div> */}
    </div>
  );
};
