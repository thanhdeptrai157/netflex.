/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        animation: {
          scroll: 'scroll 20s linear infinite',
          wobble: 'wobble 0.6s ease-in-out',
        },
        keyframes: {
          scroll: {
            '0%': { transform: 'translateX(20%)' },
            '100%': { transform: 'translateX(-200%)' },
          },
          wobble: {
            '0%, 100%': { transform: 'translateX(0%)' },
            '15%': { transform: 'translateX(-10%) rotate(-2deg)' },
            '30%': { transform: 'translateX(8%) rotate(2deg)' },
            '45%': { transform: 'translateX(-6%) rotate(-1.5deg)' },
            '60%': { transform: 'translateX(4%) rotate(1deg)' },
            '75%': { transform: 'translateX(-2%) rotate(-0.5deg)' },
          }
        },
      },
    },
    plugins: [
      require('tailwind-scrollbar'),
    ],
  }
  