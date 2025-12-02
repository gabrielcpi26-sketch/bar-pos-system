/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#c084fc',
        surface: '#0f0a1a',
        card: '#1c1329'
      }
    }
  },
  plugins: []
};
