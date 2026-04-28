/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        'surface-low': 'rgb(var(--color-surface-low) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-high': 'rgb(var(--color-surface-high) / <alpha-value>)',
        'surface-highest': 'rgb(var(--color-surface-highest) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        outline: 'rgb(var(--color-outline) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-strong': 'rgb(var(--color-accent-strong) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        label: ['"Work Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        data: ['"Space Grotesk"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      borderRadius: {
        card: '0.75rem',
        tool: '0.375rem'
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--color-accent) / 0.25), 0 0 24px rgb(var(--color-accent) / 0.08)',
        'glow-success': '0 0 12px rgb(var(--color-success) / 0.45)',
        'glow-warning': '0 0 12px rgb(var(--color-warning) / 0.45)'
      }
    }
  },
  plugins: []
};
