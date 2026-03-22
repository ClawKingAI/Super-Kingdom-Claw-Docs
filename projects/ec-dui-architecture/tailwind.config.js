/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 800: '#1e3a5f', 900: '#0f2744' },
        brand: {
          blue: '#1e88e5',
          yellow: '#fbc02d',
          green: '#43a047',
          orange: '#ef6c00',
        },
      },
    },
  },
  plugins: [],
}
