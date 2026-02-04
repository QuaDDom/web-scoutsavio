import React from 'react';
import { PageContainer } from '../PageContainer';
import { Link } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import { FaHome, FaCompass, FaArrowLeft } from 'react-icons/fa';
import './NotFound.scss';

export const NotFound = () => {
  return (
    <PageContainer>
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-icon">
            <FaCompass />
          </div>
          <h1>
            4<span className="gradient-text">0</span>4
          </h1>
          <h2>¡Parece que te perdiste en el bosque!</h2>
          <p>
            La página que buscas no existe o ha sido movida. No te preocupes, incluso los mejores
            exploradores a veces pierden el camino.
          </p>
          <div className="not-found-actions">
            <Link to="/">
              <Button className="btn-primary" size="lg" startContent={<FaHome />}>
                Volver al inicio
              </Button>
            </Link>
            <Button
              className="btn-secondary"
              size="lg"
              variant="bordered"
              startContent={<FaArrowLeft />}
              onClick={() => window.history.back()}>
              Página anterior
            </Button>
          </div>
        </div>

        <div className="decoration">
          <div className="tree tree-1"></div>
          <div className="tree tree-2"></div>
          <div className="tree tree-3"></div>
        </div>
      </div>
    </PageContainer>
  );
};
