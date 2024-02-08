import React, { useState, useEffect } from 'react';
import './Nav.scss';
import scoutLogo from '../assets/lis.svg';
import { Link } from 'react-router-dom';
import { MdMenu, MdClose } from 'react-icons/md';

export const Nav = () => {
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(!open);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="navContainer">
      <nav className="nav">
        <Link to="/">
          <div className="logo">
            <img src={scoutLogo} alt="" width={40} height={40} />
            <h3>G.S Savio</h3>
          </div>
        </Link>
        {!mobile ? (
          <ul className={`sites`}>
            <Link to="/about">
              <li className="link">Quiénes somos</li>
            </Link>
            <Link to="/guide">
              <li className="link">Guía</li>
            </Link>
            <Link to="/gallery">
              <li className="link">Galería</li>
            </Link>
            <Link to="/contact">
              <li className="link">Contacto</li>
            </Link>
          </ul>
        ) : (
          <>
            {open && (
              <ul className={`sitesMobile`}>
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
            )}
          </>
        )}
        {mobile && (
          <button className="mobileMenuBtn" onClick={handleClick}>
            {!open ? <MdMenu /> : <MdClose />}
          </button>
        )}
      </nav>
    </div>
  );
};
