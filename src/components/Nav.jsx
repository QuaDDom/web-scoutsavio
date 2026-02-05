import React, { useState, useEffect } from 'react';
import './Nav.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdMenu, MdClose } from 'react-icons/md';
import { MdDarkMode, MdLightMode, MdNotifications } from 'react-icons/md';
import { FaUser, FaComments, FaCamera, FaSignOutAlt, FaCog, FaUserCircle } from 'react-icons/fa';
import {
  Switch,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge
} from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { authService, notificationService } from '../lib/supabase';
import savioLogo from '../assets/logo/scoutsaviologo.png';

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  const navLinks = [
    { to: '/sobre', label: 'Quiénes somos' },
    { to: '/guia', label: 'Guía' },
    { to: '/galeria', label: 'Galería' },
    { to: '/contacto', label: 'Contacto' }
  ];

  // Links solo para usuarios logueados
  const userLinks = [
    { to: '/foro', label: 'Foro', icon: FaComments },
    { to: '/notificaciones', label: 'Avisos', icon: MdNotifications }
  ];

  // Check auth state
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          const count = await notificationService.getUnreadCount(currentUser.id);
          setUnreadCount(count);
        }
      } catch (error) {
        // Ignorar errores de abort en desarrollo
        if (error.name === 'AbortError') return;
        console.error('Nav auth error:', error);
      }
    };
    checkUser();

    const {
      data: { subscription }
    } = authService.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        try {
          const count = await notificationService.getUnreadCount(session.user.id);
          setUnreadCount(count);
        } catch (error) {
          if (error.name !== 'AbortError') console.error(error);
        }
      } else {
        setUnreadCount(0);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Actualizar contador de notificaciones cada 30 segundos
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      const count = await notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

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

  const handleSignOut = async () => {
    await authService.signOut();
    navigate('/');
  };

  return (
    <Navbar
      className={`navContainer ${scrolled ? 'scrolled' : ''} ${!isHomePage ? 'not-home' : ''}`}
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
            <img src={savioLogo} alt="Grupo Scout Savio - Logo" className="savioLogo" />
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
        {/* Links solo para usuarios logueados */}
        {user &&
          userLinks.map((link) => (
            <NavbarItem key={link.to}>
              <Link
                to={link.to}
                className={`nav-link user-link ${location.pathname === link.to ? 'active' : ''}`}>
                {link.to === '/notificaciones' && unreadCount > 0 ? (
                  <Badge content={unreadCount} color="danger" size="sm" shape="circle">
                    <link.icon className="nav-link-icon" />
                  </Badge>
                ) : (
                  <link.icon className="nav-link-icon" />
                )}
                {link.label}
              </Link>
            </NavbarItem>
          ))}
      </NavbarContent>

      <NavbarContent justify="end" className="nav-right">
        {/* User Avatar / Profile */}
        {user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="nav-avatar"
                size="sm"
                src={user.user_metadata?.avatar_url}
                showFallback
                fallback={<FaUser />}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Acciones de usuario" className="profile-dropdown-menu">
              <DropdownItem
                key="profile"
                textValue="Mi Perfil"
                startContent={<FaUserCircle className="dropdown-icon" />}
                onClick={() => navigate('/perfil')}>
                Mi Perfil
              </DropdownItem>
              <DropdownItem
                key="gallery"
                textValue="Subir fotos"
                startContent={<FaCamera className="dropdown-icon" />}
                onClick={() => navigate('/galeria')}>
                Subir fotos
              </DropdownItem>
              <DropdownItem
                key="logout"
                textValue="Cerrar sesión"
                startContent={<FaSignOutAlt className="dropdown-icon" />}
                className="text-danger"
                color="danger"
                onClick={handleSignOut}>
                Cerrar sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Avatar
            as="button"
            className="nav-avatar nav-avatar-guest"
            size="sm"
            showFallback
            fallback={<FaUser />}
            onClick={() => navigate('/perfil')}
          />
        )}

        <Switch
          isSelected={theme === 'dark'}
          onValueChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          size="lg"
          color="warning"
          thumbIcon={({ className }) =>
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
        {/* Links de usuario en menú móvil */}
        {user &&
          userLinks.map((link, index) => (
            <NavbarMenuItem key={link.to}>
              <Link
                to={link.to}
                className={`mobile-link mobile-user-link ${location.pathname === link.to ? 'active' : ''}`}
                style={{ animationDelay: `${(navLinks.length + index) * 0.1}s` }}>
                {link.to === '/notificaciones' && unreadCount > 0 ? (
                  <Badge content={unreadCount} color="danger" size="sm" shape="circle">
                    <link.icon className="mobile-link-icon" />
                  </Badge>
                ) : (
                  <link.icon className="mobile-link-icon" />
                )}
                {link.label}
              </Link>
            </NavbarMenuItem>
          ))}
        {/* Profile link in mobile menu */}
        <NavbarMenuItem>
          <Link
            to="/perfil"
            className={`mobile-link mobile-profile-link ${location.pathname === '/perfil' ? 'active' : ''}`}
            style={{
              animationDelay: `${(navLinks.length + (user ? userLinks.length : 0)) * 0.1}s`
            }}>
            {user ? (
              <>
                <Avatar
                  size="sm"
                  src={user.user_metadata?.avatar_url}
                  showFallback
                  fallback={<FaUser />}
                  className="mobile-avatar"
                />
                Mi Perfil
              </>
            ) : (
              <>
                <FaUser className="profile-icon" />
                Iniciar sesión
              </>
            )}
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};
