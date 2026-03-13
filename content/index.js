// 内容索引文件
// 将文件ID映射到实际的内容字符串

// 博客文章内容
const posts = {
  'hello-world': `# Hello World

欢迎来到我的 Win95 风格博客！

这是一个模拟 Windows 95 界面的个人网站项目。

## 关于这个项目

这个网站使用了 React95 组件库来模拟经典的 Windows 95 界面。
你可以像使用真正的 Windows 95 一样浏览文件夹和打开文件。

## 如何使用

1. 双击桌面上的"我的博客"图标
2. 浏览文件夹，双击打开文章
3. 使用地址栏导航

祝你使用愉快！`,

  'tech-notes': `# 技术笔记

## React 学习笔记

### 组件生命周期

React 组件有多个生命周期方法：
- constructor - 构造函数
- componentDidMount - 组件挂载后
- componentDidUpdate - 组件更新后
- componentWillUnmount - 组件卸载前

### 状态管理

推荐使用 useState 和 useReducer 来管理组件状态。

## Next.js 配置

Next.js 支持静态导出：

\`\`\`javascript
// next.config.js
module.exports = {
  output: 'export',
  trailingSlash: true,
}
\`\`\``,

  'life-diary': `# 生活日记

## 2024年1月1日 星期一

今天是元旦，新年快乐！

终于完成了 Win95 风格网站的开发。
虽然还有很多功能要完善，但是基本框架已经搭建好了。

## 2024年1月2日 星期二

今天学习了 React95 组件库的使用方法。
这个库真的很好用，可以快速构建 Win95 风格的界面。

## TODO

- [ ] 添加更多博客文章
- [ ] 实现图片查看器
- [ ] 添加开始菜单功能`,

  'win95-style-website': `# Win95 风格个人网站开发总结

## 项目背景

这个项目旨在创建一个怀旧的 Windows 95 风格个人网站，
让用户能够在一个模拟的桌面环境中浏览博客内容。

## 技术选型

- **Next.js**: React 框架，支持静态导出
- **React95**: Win95 风格 UI 组件库
- **Styled-components**: CSS-in-JS 样式方案

## 核心功能

1. **桌面环境**
   - 任务栏
   - 开始菜单
   - 桌面图标

2. **窗口系统**
   - 拖拽移动
   - 最小化/最大化
   - 窗口聚焦

3. **文件浏览器**
   - 文件夹导航
   - 文件图标显示

4. **记事本**
   - Markdown 支持
   - 滚动查看

## 未来计划

- 添加图片查看器
- 实现文件上传功能
- 添加更多主题`,
};

// 文档内容
const pages = {
  'readme': `# 欢迎使用

这是"我的文档"文件夹。

你可以在这里存放各种文本文件。`,

  'notes': `待办事项：
- 完成项目文档
- 提交代码
- 备份数据`,
};

// 合并所有内容
export const contentFiles = {
  ...posts,
  ...pages,
};

// 文件元数据
export const fileMetadata = {
  // 博客文章
  'hello-world': {
    name: 'Hello World.txt',
    type: 'file',
    app: 'notepad',
    parentId: 'my-blog',
  },
  'tech-notes': {
    name: '技术笔记.txt',
    type: 'file',
    app: 'notepad',
    parentId: 'my-blog',
  },
  'life-diary': {
    name: '生活日记.txt',
    type: 'file',
    app: 'notepad',
    parentId: 'my-blog',
  },
  'win95-style-website': {
    name: 'Win95风格网站.txt',
    type: 'file',
    app: 'notepad',
    parentId: 'my-blog',
  },
  
  // 文档
  'readme': {
    name: 'README.txt',
    type: 'file',
    app: 'notepad',
    parentId: 'my-documents',
  },
  'notes': {
    name: '便签.txt',
    type: 'file',
    app: 'notepad',
    parentId: 'my-documents',
  },
};

// 获取文件内容
export function getFileContent(fileId) {
  return contentFiles[fileId] || '';
}

// 获取所有博客文章
export function getAllPosts() {
  return Object.keys(posts).map(id => ({
    id,
    ...fileMetadata[id],
  }));
}

export default contentFiles;
