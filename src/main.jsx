import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { supabase } from './lib/supabase';

// Procesar OAuth callback si hay hash con access_token
const handleOAuthCallback = async () => {
  if (window.location.hash && window.location.hash.includes('access_token')) {
    try {
      // Supabase detectará automáticamente el token en el hash
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error processing OAuth callback:', error);
      }
      // Limpiar el hash de la URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      console.error('OAuth callback error:', err);
    }
  }
};

// Procesar callback antes de renderizar
handleOAuthCallback();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <NextThemesProvider defaultTheme="light" attribute="class">
        <App />
      </NextThemesProvider>
    </NextUIProvider>
  </React.StrictMode>
);
