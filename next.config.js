// next.config.js
const path = require('path');

module.exports = {
  // 静态导出配置
  exportTrailingSlash: true,
  exportPathMap: async function() {
    return {
      '/': { page: '/' }
    };
  },

  // React95 需要设置为 false 以避免 SSR 问题
  reactStrictMode: false,

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
