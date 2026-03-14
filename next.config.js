// next.config.js
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  
  // GitHub Pages 需要配置 basePath
  basePath: isGitHubPages ? '/cabin' : '',
  
  // React95 需要设置为 false 以避免 SSR 问题
  reactStrictMode: false,
  
  // styled-components 编译时配置
  compiler: {
    styledComponents: true,
  },
  
  // 图片优化配置（静态导出需要）
  images: {
    unoptimized: true,
  },

  // Webpack 配置
  webpack: (config, { isServer }) => {
    // 添加对 .md 文件的原始导入支持
    config.module.rules.push({
      test: /\.md$/,
      oneOf: [
        {
          resourceQuery: /raw/,
          type: 'asset/source',
        },
        {
          type: 'asset/source',
        },
      ],
    });

    // 添加对 ?raw 查询参数的支持
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    return config;
  },
};

module.exports = nextConfig;
