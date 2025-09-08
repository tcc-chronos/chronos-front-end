import daisyui from 'daisyui'
import type { Config } from "tailwindcss";
import tailwindcssAnimated from 'tailwindcss-animated';

const config: Config = {
  content: [
    "./src/**",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Roboto', 'var(--font-primary)', 'system-ui', 'sans-serif'],
        secondary: ['Poppins', 'var(--font-secondary)', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        light: 'var(--font-weight-light)',
        normal: 'var(--font-weight-regular)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
        extrabold: 'var(--font-weight-extrabold)',
        black: 'var(--font-weight-black)',
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
        '5xl': 'var(--font-size-5xl)',
        '6xl': 'var(--font-size-6xl)',
        '7xl': 'var(--font-size-7xl)',
        '8xl': 'var(--font-size-8xl)',
        '9xl': 'var(--font-size-9xl)',
      },
      lineHeight: {
        none: 'var(--line-height-none)',
        tight: 'var(--line-height-tight)',
        snug: 'var(--line-height-snug)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
        loose: 'var(--line-height-loose)',
      },
      colors: {
        brand: {
          primary: {
            darkest: 'var(--brand-primary-darkest)',
            dark: 'var(--brand-primary-dark)',
            medium: 'var(--brand-primary-medium)',
            light: 'var(--brand-primary-light)',
            lightest: 'var(--brand-primary-lightest)',
          },
        },
        functional: {
          heavy: {
            darkest: 'var(--functional-heavy-darkest)',
            dark: 'var(--functional-heavy-dark)',
            medium: 'var(--functional-heavy-medium)',
            light: 'var(--functional-heavy-light)',
            lightest: 'var(--functional-heavy-lightest)',
          },
          soft: {
            darkest: 'var(--functional-soft-darkest)',
            dark: 'var(--functional-soft-dark)',
            medium: 'var(--functional-soft-medium)',
            light: 'var(--functional-soft-light)',
            lightest: 'var(--functional-soft-lightest)',
          }
        },
        feedback: {
          success: {
            dark: 'var(--feedback-success-dark)',
            medium: 'var(--feedback-success-medium)',
            light: 'var(--feedback-success-light)',
          },
          warning: {
            dark: 'var(--feedback-warning-dark)',
            light: 'var(--feedback-warning-light)',
          },
          danger: {
            dark: 'var(--feedback-danger-dark)',
            medium: 'var(--feedback-danger-medium)',
            light: 'var(--feedback-danger-light)',
          },
          info: {
            dark: 'var(--feedback-info-dark)',
            light: 'var(--feedback-info-light)',
          },
        }
      },
    },
  },
  plugins: [
    tailwindcssAnimated,
    daisyui,
  ],
};
export default config;
