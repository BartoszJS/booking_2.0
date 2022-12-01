/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#121212',
        'dark-primary': '#1F1B24',
        'dark-purple': '#1F1A24',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
