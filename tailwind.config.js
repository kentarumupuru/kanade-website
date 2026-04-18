/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Soft, gentle palette — blush pinks, dusty lavenders, warm creams
        kanade: {
          blush:    '#f2c4ce',  // soft pink
          rose:     '#d4788a',  // medium rose
          lavender: '#c3aed6',  // dusty lavender
          lilac:    '#e8d5f5',  // light lilac
          cream:    '#fdf6ec',  // warm cream
          sand:     '#e8dcc8',  // warm sand
          mist:     '#dce8f0',  // cool mist blue
          deep:     '#2d1f3d',  // deep plum (dark bg)
          charcoal: '#1a1225',  // darkest bg
          gold:     '#d4af7a',  // warm gold accent
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'float-slower': 'float 12s ease-in-out infinite',
        'fade-in':      'fadeIn 0.8s ease forwards',
        'slide-up':     'slideUp 0.6s ease forwards',
        'pulse-soft':   'pulseSoft 3s ease-in-out infinite',
        'spin-slow':    'spin 20s linear infinite',
        'particle':     'particle 8s linear infinite',
        'bg-fade-in':   'bgFadeIn 2s ease forwards',
        'bg-fade-out':  'bgFadeOut 2s ease forwards',
        'ken-burns':    'kenBurns 12s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%':       { opacity: '1' },
        },
        particle: {
          '0%':   { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '1' },
          '100%': { transform: 'translateY(-10vh) rotate(720deg)', opacity: '0' },
        },
        bgFadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        bgFadeOut: {
          from: { opacity: '1' },
          to:   { opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
