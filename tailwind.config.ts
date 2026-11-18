import type { Config } from 'tailwindcss';

const withOpacity = (varName: string) => `rgb(var(${varName}) / <alpha-value>)`;

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: withOpacity('--color-primary'),
          container: withOpacity('--color-primary-container'),
          fixed: withOpacity('--color-primary-fixed'),
          'fixed-dim': withOpacity('--color-primary-fixed-dim'),
          foreground: withOpacity('--color-on-primary'),
        },
        'on-primary': withOpacity('--color-on-primary'),
        secondary: {
          DEFAULT: withOpacity('--color-secondary'),
          container: withOpacity('--color-secondary-container'),
          fixed: withOpacity('--color-secondary-fixed'),
          'fixed-dim': withOpacity('--color-secondary-fixed-dim'),
          foreground: withOpacity('--color-on-secondary'),
          'on-container': withOpacity('--color-on-secondary-container'),
        },
        'on-secondary-container': withOpacity('--color-on-secondary-container'),
        tertiary: {
          DEFAULT: withOpacity('--color-tertiary'),
          container: withOpacity('--color-tertiary-container'),
          fixed: withOpacity('--color-tertiary-fixed'),
          foreground: withOpacity('--color-on-primary'),
        },
        surface: {
          DEFAULT: withOpacity('--color-surface'),
          dim: withOpacity('--color-surface-dim'),
          bright: withOpacity('--color-surface-bright'),
          container: withOpacity('--color-surface-container'),
          'container-lowest': withOpacity('--color-surface-container-lowest'),
          'container-low': withOpacity('--color-surface-container-low'),
          'container-high': withOpacity('--color-surface-container-high'),
          'container-highest': withOpacity('--color-surface-container-highest'),
          variant: withOpacity('--color-surface-highest'),
        },
        'on-surface': withOpacity('--color-on-surface'),
        'on-surface-variant': withOpacity('--color-on-surface-variant'),
        outline: withOpacity('--color-outline'),
        'outline-variant': withOpacity('--color-outline-variant'),
        background: withOpacity('--color-background'),
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      spacing: {
        margin: '1.25rem',
        gutter: '1rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.25rem',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        warm: '0 2px 14px -2px rgba(28, 25, 23, 0.05), 0 1px 4px -1px rgba(28, 25, 23, 0.03)',
        'warm-nav': '0 -4px 24px rgba(28, 25, 23, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
