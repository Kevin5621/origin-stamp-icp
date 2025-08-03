/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Map to CSS variables for theme consistency
        surface: 'var(--color-surface)',
        'on-surface': 'var(--color-on-surface)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover, var(--color-accent))',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
      spacing: {
        // Map to CSS variables
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      borderRadius: {
        'sm': 'var(--border-radius-sm)',
        'md': 'var(--border-radius-md)',
        'lg': 'var(--border-radius-lg)',
        'xl': 'var(--border-radius-xl)',
        '2xl': 'var(--border-radius-2xl)',
        '3xl': '2rem',
      },
      fontFamily: {
        primary: ['var(--font-family-primary)', 'Raleway', 'sans-serif'],
        mono: ['var(--font-family-mono)', 'Fira Code', 'monospace'],
      },
      transitionDuration: {
        normal: 'var(--transition-normal)',
      },
      boxShadow: {
        'neumorphic-sm': 'var(--shadow-neumorphic-sm)',
        'neumorphic-md': 'var(--shadow-neumorphic-md)',
        'neumorphic-lg': 'var(--shadow-neumorphic-lg)',
      },
    },
  },
  plugins: [
    // Custom plugin for theme utilities
    function({ addUtilities }) {
      const newUtilities = {
        // Theme-aware backgrounds
        '.bg-theme-surface': {
          backgroundColor: 'var(--color-surface)',
        },
        '.bg-theme-accent': {
          backgroundColor: 'var(--color-accent)',
        },
        // Theme-aware text colors
        '.text-theme-primary': {
          color: 'var(--color-text-primary)',
        },
        '.text-theme-secondary': {
          color: 'var(--color-text-secondary)',
        },
        '.text-theme-accent': {
          color: 'var(--color-accent)',
        },
        // Theme-aware borders
        '.border-theme': {
          borderColor: 'var(--color-border)',
        },
        '.border-theme-accent': {
          borderColor: 'var(--color-accent)',
        },
        // Neumorphic shadows
        '.shadow-neumorphic': {
          boxShadow: 'var(--shadow-neumorphic-md)',
        },
        // Line clamp utilities
        '.line-clamp-1': {
          display: '-webkit-box',
          '-webkit-line-clamp': '1',
          'line-clamp': '1',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          'line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          'line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
      }
      
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
}
