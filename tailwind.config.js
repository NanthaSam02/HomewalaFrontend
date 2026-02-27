/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          500: '#08A7F3', 
          600: '#08A7F3', 
        },
      },
      fontFamily: {
        sans: ['Rubik', 'sans-serif'], 
        heading: ['Rubik', 'sans-serif'], 
      },
      spacing: {
        '128': '32rem',
      },
      textColor: {
        footer: '#B7B7B7',
        subheading: '#7C7979'
      },
      backgroundColor: {
        lightblue: "#EEFEFF"
      }
    },
  },
  plugins: [],
}

