/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rugai': {
          black: '#121212',
          green: '#00ff9d',
          'green-dark': '#00cc7d',
          'gray-dark': '#1e1e1e',
          'gray-light': '#2d2d2d',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}