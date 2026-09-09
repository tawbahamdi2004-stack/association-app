/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
  extend: {
    fontFamily: {
      arabic: ['Cairo', 'sans-serif'],
    },
    colors: {
      primary: '#059669', // Emerald 600
      secondary: '#0D9488', // Teal 600
    }
  },
},
  plugins: [],
}