/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: { DEFAULT: '#A67C00', dark: '#D4A030', light: 'rgba(166,124,0,0.09)' },
        oui:  { navy: '#0D1B3E', cream: '#FEFCF8' },
      },
    },
  },
  plugins: [],
}
