import { heroui } from '@heroui/theme';

export default heroui({
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: '#16a34a',
          foreground: '#ffffff',
          50: '#ecfdf3',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },

        secondary: {
          DEFAULT: '#111827',
          foreground: '#f9fafb',
        },

        danger: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },

        background: '#f9fafb',
      },
    },
  },
});
