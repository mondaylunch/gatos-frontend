/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
      extend: {
        animation: {
          'spin-half': 'spin-half 0.25s linear',
          'spin-half-reverse': 'spin-half-reverse 0.25s linear',
        },
        keyframes: {
          'spin-half': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(90deg)' },
          },
          'spin-half-reverse': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(-90deg)' },
          },
        }
      }
    },
    plugins: []
  };