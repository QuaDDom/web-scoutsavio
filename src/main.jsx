import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <NextThemesProvider defaultTheme="light" attribute="class">
        <App />
      </NextThemesProvider>
    </NextUIProvider>
  </React.StrictMode>
);
