/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: {
          DEFAULT: 'var(--surface)',
          muted: 'var(--surface-muted)',
        },
        border: 'var(--border)',
        foreground: {
          DEFAULT: 'var(--foreground)',
          muted: 'var(--foreground-muted)',
        },
        subtle: 'var(--subtle)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          text: 'var(--primary-text)',
        },
        ring: 'var(--ring)',
        priority: {
          high: '#EF4444',
          medium: '#F59E0B',
          low: '#A3A3A3',
        },
        status: {
          todo: '#A3A3A3',
          progress: '#3B82F6',
          review: '#8B5CF6',
          done: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', '"SF Pro Text"', '"Segoe UI"', 'sans-serif'],
      },
      fontSize: {
        'micro': ['11px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.05em' }],
      },
    },
  },
  plugins: [],
};
