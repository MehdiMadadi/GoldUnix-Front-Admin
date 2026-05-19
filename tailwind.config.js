/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d59f2',
          50: '#e7edff',
          100: '#c5d4ff',
          200: '#9eb6ff',
          300: '#7597ff',
          400: '#4d78ff',
          500: '#0d59f2',
          600: '#0a45c0',
          700: '#07328e',
          800: '#04205c',
          900: '#020e2a',
        },
        background: {
          light: '#f8fafc',
          dark: '#0f1219',
        },
        surface: {
          light: '#ffffff',
          dark: '#1a1e2b',
        },
        border: {
          light: '#e2e8f0',
          dark: '#2d3442',
        },
      },
      fontFamily: {
        display: ['Vazirmatn', 'sans-serif'],
        sans: ['Vazirmatn', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
