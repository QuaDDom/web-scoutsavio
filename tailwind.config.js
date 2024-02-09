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
  theme: {
    extend: {}, // Personaliza los estilos aquí si lo deseas
  },
  darkMode: 'class', // Activa el modo oscuro basado en clases
  plugins: [nextui()], // Habilita el plugin de NextUI
};
