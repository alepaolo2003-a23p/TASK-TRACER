/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        stride: {
          bg: '#0F0F14',
          surface: '#1A1A22',
          primary: '#7C5CFC',
          secondary: '#3DD9C4',
          alert: '#FF6B6B',
          text: '#F2F2F5',
          'text-muted': '#9494A0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
};
