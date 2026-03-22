/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0a0a12', 800: '#12121f', 700: '#1a1a2e' },
        gold: { 400: '#d4af37', 500: '#c5a028', 600: '#b8960f' },
        cream: { 100: '#faf8f5', 200: '#f5f0e8' }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
