import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#12100E',
        'text-primary': '#F2EDE8',
        'accent-terracotta': '#8B3A2A',
        'surface-dark': '#1C1916',
        'phase-menstrual': '#8B3A2A',
        'phase-follicular': '#D4A574',
        'phase-ovulatory': '#F2EDE8',
        'phase-luteal': '#4A3428',
      },
      fontFamily: {
        'display': ['var(--font-display)'],
        'body': ['var(--font-body)'],
      },
      letterSpacing: {
        'wide': '0.05em',
        'wider': '0.1em',
        'widest': '0.15em',
      },
      animation: {
        'fade-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-up-delayed': 'fadeInUp 0.6s 0.2s ease-out forwards',
        'fade-up-delayed-2': 'fadeInUp 0.6s 0.4s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
