import React, { useState, useEffect } from 'react';
import './Nav.scss';
import scoutLogo from '../assets/lis.svg';
import { Link } from 'react-router-dom';
import { MdMenu, MdClose } from 'react-icons/md';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import {
  Switch,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link as LinkContainer
} from '@nextui-org/react';
import { useTheme } from 'next-themes';
import whiteLogo from '../assets/logo/whitelogo.png';

export const Nav = () => {
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleClick = () => setOpen(!open);
  const handleChangeTheme = () => (theme === 'light' ? setTheme('dark') : setTheme('light'));

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
    <Navbar className="navContainer" maxWidth="xl">
      <NavbarBrand className="logo">
        <Link to="/" className="logo">
          <img
            src={whiteLogo}
            alt="Grupo Scout Savio - Logo"
            width={'40px'}
            className="savioLogo"
          />
          <h3 className="logoTitle"> Savio</h3>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        {!mobile ? (
          <>
            <NavbarItem>
              <Link to="/sobre">
                <li className="link">Quiénes somos</li>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/guia">
                <li className="link">Guía</li>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/galeria">
                <li className="link">Galería</li>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/contacto">
                <li className="link">Contacto</li>
              </Link>
            </NavbarItem>
          </>
        ) : (
          <>
            {open && (
              <ul className={`sitesMobile`} onClick={handleClick}>
                <Link to="/sobre">
                  <li className="link">Quiénes somos</li>
                </Link>
                <Link to="/guia">
                  <li className="link">Secciones</li>
                </Link>
                <Link to="/galeria">
                  <li className="link">Galería</li>
                </Link>
                <Link to="/contacto">
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
      </NavbarContent>
      <NavbarContent justify="end">
        <Switch
          onClick={handleChangeTheme}
          size="lg"
          color="danger"
          thumbIcon={({ isSelected, className }) =>
            theme === 'light' ? (
              <MdLightMode className={className} />
            ) : (
              <MdDarkMode className={className} />
            )
          }
        />
      </NavbarContent>
    </Navbar>
  );
};
