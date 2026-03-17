/** @type {import('tailwindcss').Config} */
export default {
 content: [
 "./index.html",
 "./src/**/*.{js,ts,jsx,tsx}",
 ],
 theme: {
 extend: {
 colors: {
 navy: {
 200: '#e2e8f0',
 600: '#2a3f5f',
 700: '#1c2d4a',
 800: '#132039',
 900: '#0a1628'
 },
 water: {
 300: '#93c5fd',
 400: '#60a5fa',
 500: '#3b82f6',
 600: '#2563eb',
 700: '#1d4ed8'
 },
 steel: {
 300: '#cbd5e1',
 400: '#94a3b8',
 500: '#64748b',
 600: '#475569'
 }
 },
 fontFamily: {
 sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
 heading: ['Inter', 'system-ui', 'sans-serif']
 }
 },
 },
 plugins: [],
}
