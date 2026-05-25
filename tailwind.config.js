/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Pages/**/*.cshtml",
    "./wwwroot/js/**/*.js",
    "./*.html"
  ],

  darkMode: 'class',

  theme: {
    extend: {

      /* =========================
         COLOR SYSTEM (CLEANED)
      ========================== */
      colors: {

        primary: {
          DEFAULT: '#2854e2',
          light: '#3b82f6',
          dark: '#1e3a8a',
          softer: 'rgba(59,130,246,0.15)',
        },

        secondary: {
          DEFAULT: '#0f766e',
          light: '#14b8a6',
          dark: '#115e59',
        },

        accent: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },

        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },

        corporate: {
          navy: '#1e3a8a',
          teal: '#0f766e',
          gold: '#f59e0b',
        },
      },

      /* =========================
         TYPOGRAPHY
      ========================== */
      fontFamily: {
        primary: ['var(--font-primary)', 'Tahoma', 'Arial', 'sans-serif'],
      },

      /* =========================
         ANIMATIONS
      ========================== */
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },

  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.rtl': { direction: 'rtl' },
        '.ltr': { direction: 'ltr' },
      });
    },
  ],
};