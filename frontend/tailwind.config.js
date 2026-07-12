/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark navy backgrounds
        navy: {
          DEFAULT: 'var(--navy)',
          light: 'var(--navy-light)',
          card: 'var(--navy-card)',
          border: 'var(--navy-border)',
        },
        // Graphite card surfaces
        graphite: {
          DEFAULT: 'var(--graphite)',
          light: 'var(--graphite-light)',
          border: 'var(--graphite-border)',
        },
        // Brand greens (emerald-like but non-conflicting)
        brand: {
          green: '#10b981',
          'green-light': '#34d399',
          'green-dark': '#059669',
          'green-subtle': '#052e1a',
          teal: '#06b6d4',
          'teal-light': '#22d3ee',
          'teal-dark': '#0891b2',
          gold: '#f59e0b',
          'gold-light': '#fbbf24',
          'gold-dark': '#d97706',
          red: '#ef4444',
          'red-light': '#f87171',
          'red-dark': '#dc2626',
          blue: '#1e3a5f',
          'blue-light': '#162d4a',
          'blue-dark': '#0f2035',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(30,58,95,0.4) 0, transparent 100%)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(30,45,71,0.6)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.2)',
        'glow-green': '0 0 20px rgba(16,185,129,0.3)',
        'glow-teal': '0 0 20px rgba(6,182,212,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
