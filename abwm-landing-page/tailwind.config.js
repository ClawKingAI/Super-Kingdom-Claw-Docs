/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#8B4513', // SaddleBrown
        'secondary': '#228B22', // ForestGreen
        'accent': '#D4AF37', // Gold
        'light': '#F5F5DC', // Beige
        'dark': '#3E2723', // Dark brown
      },
    },
  },
  plugins: [],
}