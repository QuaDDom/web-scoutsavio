// tailwind.config.js
const { nextui } = require('@nextui-org/react');

module.exports = {
  content: [
    // Agrega aquí las rutas a tus archivos de componentes JSX o TypeScript
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Incluir los archivos de NextUI para que sus clases sean reconocidas
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  defaultTheme: "dark",
  defaultExtendTheme: "dark",
  themes: {
    light: {
      layout: {
        body: {
          bg: "white", // Background color
          color: "black", // Text color
        },
        container: {
          bg: "white",
          color: "inherit", // Inherit from body color
        },
      },
      colors: {
        primary: "#dd1d1d",
        secondary: "#f6e741",
        success: "#28a745",
        warning: "#ffc107",
        danger: "#dc3545",
      },
    },
    dark: {
      layout: {
        body: {
          bg: "#212529", // Background color
          color: "white", // Text color
        },
        container: {
          bg: "#2c3034",
          color: "inherit", // Inherit from body color
        },
      },
      colors: {
        // Define your dark theme colors here
        primary: "#00b894",
        secondary: "#808080",
        success: "#198754",
        warning: "#ffc107",
        danger: "#dc3545",
        // ... other colors
      },
    },
  },
  darkMode: 'class', // Activa el modo oscuro basado en clases
  plugins: [nextui()], // Habilita el plugin de NextUI
};
