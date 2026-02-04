/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        display: ['"Cinzel"', 'serif'],
        'serif-en': ['"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'pattern': 'radial-gradient(#d7ccc8 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}