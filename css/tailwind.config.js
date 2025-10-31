module.exports = {
  darkMode: 'class',
  // Include all template types used by Eleventy
  content: ['src/**/*.html', 'src/**/*.md', 'src/**/*.njk'],
  safelist: [],
  theme: {
    extend: {
      colors: {
        change: 'transparent'
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
      fontFamily: {
        'open': ['"Open Sans"', 'sans-serif'],
        'mont': ['"Montserrat"', 'sans-serif'],
        'inter': ['"Inter"', 'sans-serif']
      },
    },
  },
  variants: {
    extend: {
      translate: ['group-hover'],
    }
  },
  plugins: [],
}
