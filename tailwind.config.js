const plugin = require('tailwindcss/plugin')
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing:{
        "128":"28rem",
        "132":"32rem",
        "138":"38rem",
        "142":"42rem",
        "152":"52rem"
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    plugin(function({ addUtilities }) {
      plugin(function ({ addUtilities }) {
        addUtilities({
          '.scrollbar-hide': {
            /* IE and Edge */
            '-ms-overflow-style': 'none',
  
            /* Firefox */
            'scrollbar-width': 'none',
  
            /* Safari and Chrome */
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }
        }
        )
      })
    })
  ],
  variants: {
    scrollbar: ['rounded']
  }
}