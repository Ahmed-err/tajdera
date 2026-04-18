/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#041819',
        panel: '#0b2a2c',
        panelSoft: '#12383b',
        text: '#f7f1df',
        textMuted: '#c8c0a9',
        accent: '#d6a84a',
        accentGold: '#d6a84a',
        accentGoldLight: '#efd9a0',
        warning: '#f59e0b',
        danger: '#f43f5e',
      },
      fontFamily: {
        arabic: ['Tajawal', 'Cairo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        luxe: '0 20px 50px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
}

