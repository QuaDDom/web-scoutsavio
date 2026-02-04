import React from 'react';
import { Card, Image, CardBody } from '@nextui-org/react';
import './BranchCard.scss';

export const BranchCard = ({ img, rama, edades, enfoques, objetivos, color }) => {
  return (
    <Card className="branch-card">
      <CardBody>
        <div className="branch-card-content">
          <div className="branch-image">
            <Image isBlurred src={img} alt={rama} />
            <div className="branch-badge" style={{ background: color }}>
              {rama}
            </div>
          </div>
          <div className="branch-info">
            <div className="branch-header">
              <h3>{rama}</h3>
              <span className="branch-age" style={{ borderColor: color, color: color }}>
                {edades}
              </span>
            </div>

            <div className="branch-section">
              <h4>
                <span className="section-indicator" style={{ background: color }}></span>
                Enfoque
              </h4>
              <ul>
                {enfoques.map((e, index) => (
                  <li key={index}>{e}</li>
                ))}
              </ul>
            </div>

            <div className="branch-section">
              <h4>
                <span className="section-indicator" style={{ background: color }}></span>
                Objetivos
              </h4>
              <ul>
                {objetivos.map((e, index) => (
                  <li key={index}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
