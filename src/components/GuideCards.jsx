import React from 'react';
import './GuideCards.scss';

export const GuideCards = ({ img, title, description }) => {
  return (
    <div className="cardContainer">
      <img
        src="https://assets.weforum.org/article/image/Qj9yjxX0VH7ASYCjQ7WIWE_qFQkEHvjkFzvKvCw8u58.jpg"
        alt=""
      />
      <div className="content">
        <h4 className="title">{title}</h4>
        <p className="description">{description}</p>
      </div>
    </div>
  );
};
