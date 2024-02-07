import React from 'react';
import './Nav.scss';
import scoutLogo from '../assets/lis.svg';
import { Link } from 'react-router-dom';

export const Nav = () => {
  return (
    <div className="navContainer">
      <nav className="nav">
        <Link Link to="/">
          <div className="logo">
            <img src={scoutLogo} alt="" width={40} height={40} />
            <h3>G.S Savio</h3>
          </div>
        </Link>
        <ul className="sites">
          <Link to="/about">
            <li className="link">Quiénes somos</li>
          </Link>
          <Link to="/guide">
            <li className="link">Secciones</li>
          </Link>
          <Link to="/gallery">
            <li className="link">Galería</li>
          </Link>
          <Link to="/contact">
            <li className="link">Contacto</li>
          </Link>
        </ul>
      </nav>
    </div>
  );
};
