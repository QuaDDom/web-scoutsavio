import React, { useState, useEffect } from 'react';
import './Nav.scss';
import { Link, useLocation } from 'react-router-dom';
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
  NavbarMenuItem
} from '@nextui-org/react';
import { useTheme } from 'next-themes';
import whiteLogo from '../assets/logo/whiteLogo.png';

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const handleChangeTheme = () => (theme === 'light' ? setTheme('dark') : setTheme('light'));

  const navLinks = [
    { to: '/sobre', label: 'Quiénes somos' },
    { to: '/guia', label: 'Guía' },
    { to: '/galeria', label: 'Galería' },
    { to: '/contacto', label: 'Contacto' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <Navbar
      className={`navContainer ${scrolled ? 'scrolled' : ''}`}
      maxWidth="xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll={false}>
      <NavbarContent className="nav-left">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="mobile-toggle"
        />
        <NavbarBrand>
          <Link to="/" className="logo">
            <img src={whiteLogo} alt="Grupo Scout Savio - Logo" className="savioLogo" />
            <span className="logoTitle">Savio</span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="nav-links" justify="center">
        {navLinks.map((link) => (
          <NavbarItem key={link.to}>
            <Link
              to={link.to}
              className={`nav-link ${location.pathname.startsWith(link.to) ? 'active' : ''}`}>
              {link.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="nav-right">
        <Switch
          onClick={handleChangeTheme}
          size="lg"
          color="warning"
          thumbIcon={({ isSelected, className }) =>
            theme === 'light' ? (
              <MdLightMode className={className} />
            ) : (
              <MdDarkMode className={className} />
            )
          }
        />
      </NavbarContent>

      <NavbarMenu className="mobile-menu">
        {navLinks.map((link, index) => (
          <NavbarMenuItem key={link.to}>
            <Link
              to={link.to}
              className={`mobile-link ${location.pathname.startsWith(link.to) ? 'active' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}>
              {link.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
