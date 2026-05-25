// postcss.config.js
const resolveId = require('postcss-import/lib/resolve-id')

module.exports = {
  syntax: require('postcss-scss'),
  plugins: {
    'postcss-import': {
      resolve(id, basedir, importOptions) {
        if (id === 'tailwindcss') {
          return require.resolve('tailwindcss')
        }
        return resolveId(id, basedir, importOptions)
      }
    },
    tailwindcss: {},
    autoprefixer: {},
  }
}
