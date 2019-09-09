// next.config.js
const path = require('path');

module.exports = {
  cssModules: true,

  // custom webpack config
  webpack: function(config) {
    const { alias } = config.resolve;
    Object.assign(alias, {
      "app": path.join(__dirname, 'app'),
    })
    return config;
  }
};
