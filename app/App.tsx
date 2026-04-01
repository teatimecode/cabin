"use client";

import React from 'react';
import Desktop from './desktop';

// 模拟 Next.js 页面的数据获取
const App = () => {
  // 从配置中获取桌面配置
  const desktopConfig = {
    background: '#008080',
    apps: [], // 这将由 Desktop 组件从 StaticFileSystem 动态加载
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <Desktop config={desktopConfig} />
    </div>
  );
};

export default App;
