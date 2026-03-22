/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#0d0d0f',
          800: '#1a1a1f',
          700: '#202123',
          600: '#2a2a32',
        },
        gold: {
          400: '#d4af37',
          500: '#c5a028',
          600: '#b8960f',
        },
        crimson: {
          500: '#dc2626',
          600: '#b91c1c',
        }
      }
    },
  },
  plugins: [],
}
