/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-brown': {
          50: '#fdf8f3',
          100: '#f5e6d3',
          200: '#e8d0b3',
          300: '#d4b08a',
          400: '#c4916a',
          500: '#a67550',
          600: '#8b5e3c',
          700: '#6b4530',
          800: '#4a2f20',
          900: '#2d1a10',
        },
        'forest-green': {
          50: '#f0f7f0',
          100: '#d8edd8',
          200: '#b5dbb5',
          300: '#8bc48b',
          400: '#5fa85f',
          500: '#428a42',
          600: '#336d33',
          700: '#285528',
          800: '#1e421e',
          900: '#123112',
        },
        'golden': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d4a012',
          600: '#b8860b',
          700: '#92700c',
          800: '#705409',
          900: '#4a3606',
        },
      },
      fontFamily: {
        'serif': ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
