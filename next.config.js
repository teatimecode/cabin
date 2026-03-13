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
};

module.exports = nextConfig;
