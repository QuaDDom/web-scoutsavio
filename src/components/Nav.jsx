import React from 'react'
import './Nav.scss';
import scoutLogo from '../assets/lis.jpg'
import { Link } from 'react-router-dom';

export const Nav = () => {
  return (
  <div className="navContainer">
    <nav className="nav">
      <div className="logo">
        <img src={scoutLogo} alt="Scout Savio" />
        <h3>Grupo Scout  Savio</h3>
      </div>
      <ul className="sites">
        <Link>
          <li>Quiénes somos</li>
        </Link>
        <Link>
          <li>Secciones</li>
        </Link>
        <Link>
          <li>Galería</li>
        </Link>
        <Link>
          <li>Contacto</li>
        </Link>
      </ul>
    </nav>
  </div>
  )
}
