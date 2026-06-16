/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          // Custom deep slate variant for sleek layout boundaries/table hover accenting
          850: '#1e293b', 
        },
      },
    },
  },
  plugins: [],
}