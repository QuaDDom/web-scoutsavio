import React from 'react';
import './Footer.scss';
import { Card, CardBody } from '@nextui-org/react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <p>Creado por Mateo Quadrelli &copy; {new Date().getFullYear()}</p>
            <p>
              <strong>Información del sitio:</strong>
            </p>
            <ul>
              <li>Nombre: Grupo Scout 331 Gral. Manuel Nicolas Savio</li>
              <li>Dirección: Av. Pte. Arturo Frondizi 225, Córdoba, Argentina</li>
              <li>Teléfono: +54 351 421-2345</li>
              <li>Email: info@gruposcout331.com.ar</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
