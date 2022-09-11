const path = require('path');
const CracoLessPlugin = require('craco-less');
const resolve = (...p) => path.resolve(__dirname, ...p);
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    alias: {
      '@': resolve('src'),
      '@style': resolve('src/style'),
      '@pages': resolve('src/pages'),
      '@utils': resolve('src/utils'),
      '@hooks': resolve('src/hooks'),
      '@components': resolve('src/components'),
      '@forms': resolve('src/forms'),
    },
  }
};