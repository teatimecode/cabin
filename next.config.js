// next.config.js
const path = require('path');

module.exports = {
  cssModules: true,
  // for github pages deployment
  assetPrefix: process.env.NODE_ENV === 'production' ? '/{cabin}' : '',

  // custom webpack config
  webpack: function(config) {
    const { alias } = config.resolve;
    Object.assign(alias, {
      "app": path.join(__dirname, 'app'),
    })
    return config;
  }
};
