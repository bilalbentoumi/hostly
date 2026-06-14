/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  darkMode: ['selector', '[data-theme="dark"] &'],
  content: ['./pages/index.tsx', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',
        accent: 'var(--accent)',
        'on-accent': 'var(--accent-text)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        code: 'var(--code-text)',
      },
      backgroundColor: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        tertiary: 'var(--bg-tertiary)',
        elevated: 'var(--bg-elevated)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-light': 'var(--accent-light)',
        input: 'var(--input-bg)',
        code: 'var(--code-bg)',
        success: 'var(--success)',
      },
      borderColor: {
        line: 'var(--border)',
        subtle: 'var(--border-subtle)',
        strong: 'var(--text-tertiary)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        success: 'var(--success)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        DEFAULT: 'var(--shadow)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      fontFamily: {
        mono: [
          '"SF Mono"',
          '"Fira Code"',
          '"Cascadia Code"',
          'ui-monospace',
          'monospace',
        ],
      },
      maxWidth: {
        narrow: '680px',
        content: '800px',
        preview: '960px',
        wide: '1100px',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'hero-tag-drift': {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-15px) translateX(10px)' },
          '50%': { transform: 'translateY(-5px) translateX(-8px)' },
          '75%': { transform: 'translateY(-20px) translateX(5px)' },
          '100%': { transform: 'translateY(0) translateX(0)' },
        },
        'hero-tag-pulse-1': {
          '0%, 100%': { opacity: '0.04' },
          '30%': { opacity: '0.15' },
          '60%': { opacity: '0.03' },
          '80%': { opacity: '0.12' },
        },
        'hero-tag-pulse-2': {
          '0%, 100%': { opacity: '0.05' },
          '20%': { opacity: '0.18' },
          '50%': { opacity: '0.04' },
          '70%': { opacity: '0.1' },
        },
        'hero-tag-pulse-3': {
          '0%, 100%': { opacity: '0.03' },
          '40%': { opacity: '0.14' },
          '65%': { opacity: '0.02' },
          '90%': { opacity: '0.1' },
        },
        'term-fade': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'term-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'term-progress': {
          from: { width: '0' },
          to: { width: '100%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'hero-tag-1':
          'hero-tag-drift linear infinite, hero-tag-pulse-1 ease-in-out infinite',
        'hero-tag-2':
          'hero-tag-drift linear infinite, hero-tag-pulse-2 ease-in-out infinite',
        'hero-tag-3':
          'hero-tag-drift linear infinite, hero-tag-pulse-3 ease-in-out infinite',
        'term-fade': 'term-fade 0.4s ease-out both',
        'term-blink': 'term-blink 1.1s step-end infinite',
        'term-progress': 'term-progress 5000ms linear forwards',
      },
    },
  },
  plugins: [],
};
