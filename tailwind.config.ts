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
