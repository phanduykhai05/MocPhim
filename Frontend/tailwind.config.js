// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        logoShine: {
          '0%':   { transform: 'translateX(-100%) skewX(-15deg)' },
          '60%':  { transform: 'translateX(200%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' },
        },
      },
      animation: {
        'logo-shine': 'logoShine 3s ease-in-out infinite',
      },
    }
  }
}