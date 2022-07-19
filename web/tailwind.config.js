/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ukraine-blue': '#0057b7',
        'ukraine-yellow': '#ffd700'
      }
    }
  },
  plugins: []
};
