import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        foreground: '#f9fafb',
        accent: '#38bdf8',
        muted: '#1f1f1f',
        border: 'rgba(255, 255, 255, 0.08)',
      },
      boxShadow: {
        focus: '0 0 0 3px rgba(56, 189, 248, 0.45)',
        subtle: '0 10px 40px 0 rgba(0, 0, 0, 0.35)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};

export default config;
