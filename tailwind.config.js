/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95'
        },
        dark: {
          DEFAULT: '#1A1B1E',
          50: '#374151',
          100: '#2D3748',
          200: '#252D3D',
          300: '#1E2433',
          400: '#171C28',
          500: '#1A1B1E',
          600: '#101114',
          700: '#0D0E10',
          800: '#0A0B0C',
          900: '#070809'
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: [],
};