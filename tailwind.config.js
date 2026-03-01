/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        jarvis: {
          pink: '#ff1a88', purple: '#7c3aed', cyan: '#00d4ff',
          dark: '#05050f', surface: '#0d0d1f', muted: '#6b6b8a',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2.5s ease-in-out infinite',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
        'orb-morph': 'orbMorph 4s ease-in-out infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        glow: { '0%,100%': { boxShadow: '0 0 20px rgba(255,26,136,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(255,26,136,0.7)' } },
        pulseRing: { '0%': { transform: 'scale(1)', opacity: '0.8' }, '100%': { transform: 'scale(1.6)', opacity: '0' } },
        orbMorph: { '0%,100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' }, '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' } },
      },
      backdropBlur: { '24': '24px', '32': '32px' },
    },
  },
  plugins: [],
}
