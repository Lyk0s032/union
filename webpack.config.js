const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser', // Polyfill para process en el navegador
    }),
  ],
  resolve: {
    fallback: {
      process: require.resolve('process/browser'), // Asegura que process está definido
    },
  },
};