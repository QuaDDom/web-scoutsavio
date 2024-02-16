// tailwind.config.js
const { nextui } = require('@nextui-org/react');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  defaultTheme: "dark",
  defaultExtendTheme: "dark",
  themes: {
    light: {
      layout: {
        body: {
          bg: "white",
          color: "black",
        },
        container: {
          bg: "white",
          color: "inherit",
        },
      },
    },
    dark: {
      layout: {
        body: {
          bg: "#121212",
          color: "white",
        },
        container: {
          bg: "#2c3034",
          color: "inherit",
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
