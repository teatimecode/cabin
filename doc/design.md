# Cabin 项目设计文档

## 1. 项目概述

**项目名称**：Cabin - Win95 风格个人网站

**项目描述**：一个基于 Windows 95 界面的个人网站项目，模拟经典 Win95 桌面环境，可用于展示博客内容和其他个人信息。

**技术栈**：
- Next.js 9.3.2 - React 框架
- React 16.9.0 - UI 库
- React95 2.0.0 - Win95 风格 UI 组件库
- Styled-components 4.3.2 - CSS-in-JS 样式方案

---

## 2. 现有代码结构分析

### 2.1 目录结构

```
cabin/
├── .github/
│   └── workflows/
│       └── build.yml          # CI/CD 构建配置
├── app/
│   ├── components/
│   │   ├── app/
│   │   │   ├── AppIcon.js     # 应用图标组件
│   │   │   └── common.js      # 通用组件工具
│   │   └── window/
│   │       └── ShortCutContainer.jsx  # 桌面快捷方式容器
│   ├── config/
│   │   └── main/
│   │       └── index.js       # 主配置文件
│   └── desktop/
│       ├── index.jsx          # 桌面主组件
│       └── TaskBar.jsx        # 任务栏组件
├── pages/
│   └── index.jsx              # 应用入口页面
├── next.config.js             # Next.js 配置
├── package.json               # 项目依赖
└── yarn.lock                  # 依赖锁定文件
```

### 2.2 核心组件说明

| 组件/文件 | 功能描述 | 状态 |
|-----------|----------|------|
| `pages/index.jsx` | 应用入口，加载 Desktop 组件，配置全局样式和主题 | ✅ 已完成 |
| `app/desktop/index.jsx` | 桌面主容器，包含任务栏和快捷方式区域 | ✅ 已完成 |
| `app/desktop/TaskBar.jsx` | 任务栏，包含开始菜单和右侧信息栏 | ✅ 已完成 |
| `app/config/main/index.js` | 主配置文件，定义主题和应用列表 | ✅ 已完成 |
| `app/components/window/ShortCutContainer.jsx` | 桌面快捷方式容器 | ⚠️ 框架已搭建，内容为空 |
| `app/components/app/AppIcon.js` | 应用图标组件 | ⚠️ 文件存在，内容为空 |
| `app/components/app/common.js` | 通用组件工具函数 | ✅ 提供 `createAppMeta` 工具函数 |

### 2.3 数据流

```
pages/index.jsx
    ↓
Desktop (app/desktop/index.jsx)
    ├── TaskBar (任务栏)
    └── ShortCutContainer (快捷方式列表)
```

### 2.4 配置系统

`app/config/main/index.js` 中的 `MainConfig` 对象结构：

```javascript
const MainConfig = {
  theme: themes.default,    // React95 主题
  background: 'teal',       // 桌面背景色
  apps: []                  // 应用程序列表（待完善）
}
```

---

## 3. 功能需求分析

### 3.1 核心功能

#### 3.1.1 文件夹功能（我的电脑/资源管理器）

模拟 Windows 文件管理器，实现以下功能：

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 文件夹浏览 | 以图标/列表形式显示文件夹内容 | 高 |
| 文件夹导航 | 支持进入子文件夹、返回上级 | 高 |
| 双击打开 | 双击图标打开文件或文件夹 | 高 |
| 地址栏 | 显示当前路径 | 中 |
| 菜单栏 | 文件、编辑、查看、帮助 | 中 |

#### 3.1.2 文本编辑器功能（记事本）

模拟 Windows 记事本，实现以下功能：

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 文本显示 | 显示博客文章内容 | 高 |
| 滚动查看 | 支持内容滚动阅读 | 高 |
| 菜单栏 | 文件、编辑、格式、查看、帮助 | 中 |
| 状态栏 | 显示行号、字符数等信息 | 低 |

#### 3.1.3 博客内容集成

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 博客列表 | 在文件夹中显示博客文章 | 高 |
| 文章读取 | 读取并显示博客文章内容 | 高 |
| 文章分类 | 按分类组织博客文章 | 中 |

---

## 4. 系统架构设计

### 4.1 组件层次结构

```
App (pages/index.jsx)
└── Desktop (桌面)
    ├── TaskBar (任务栏)
    │   ├── StartMenu (开始菜单)
    │   └── TaskBarInfo (右侧信息)
    ├── ShortCutContainer (快捷方式容器)
    │   └── AppIcon[] (应用图标列表)
    └── WindowManager (窗口管理器 - 新增)
        └── Window (窗口组件)
            ├── TitleBar (标题栏)
            ├── MenuBar (菜单栏 - 新增)
            ├── Content (内容区域)
            │   ├── FileExplorer (文件浏览器 - 新增)
            │   └── TextEditor (文本编辑器 - 新增)
            └── StatusBar (状态栏 - 新增)
```

### 4.2 新增组件规划

| 组件路径 | 功能描述 |
|----------|----------|
| `app/components/window/WindowManager.jsx` | 窗口管理器，处理窗口打开/关闭/聚焦 |
| `app/components/window/Window.jsx` | 基础窗口组件，拖拽、最大化、最小化、关闭 |
| `app/components/window/TitleBar.jsx` | 窗口标题栏 |
| `app/components/window/MenuBar.jsx` | 窗口菜单栏 |
| `app/components/window/StatusBar.jsx` | 窗口状态栏 |
| `app/components/app/FileExplorer.jsx` | 文件浏览器组件 |
| `app/components/app/TextEditor.jsx` | 文本编辑器组件 |
| `app/config/apps/index.js` | 应用程序配置 |
| `app/data/posts.js` | 博客文章数据 |

### 4.3 状态管理

需要管理的状态：

```javascript
// 窗口状态
windows: [
  {
    id: string,
    appId: string,
    title: string,
    isMinimized: boolean,
    isMaximized: boolean,
    position: { x: number, y: number },
    size: { width: number, height: number },
    zIndex: number
  }
]

// 当前激活窗口
activeWindowId: string | null

// 文件夹导航状态
currentPath: string[]
```

---

## 5. UI/UX 设计指南

### 5.1 配色方案

使用 React95 的默认主题，桌面背景色为 `teal`（蓝绿色）。

### 5.2 布局规范

- 任务栏高度：28px
- 窗口最小尺寸：300x200px
- 桌面图标间距：80px
- 窗口内边距：8px

### 5.3 交互行为

| 行为 | 实现 |
|------|------|
| 窗口拖拽 | 鼠标拖动标题栏移动窗口 |
| 窗口调整 | 鼠标拖动窗口边缘调整大小 |
| 双击打开 | 双击桌面图标打开应用 |
| 窗口聚焦 | 点击窗口将其置顶 |

---

## 6. 数据结构设计

### 6.1 博客文章数据

```javascript
// app/data/posts.js
const posts = [
  {
    id: 'hello-world',
    title: 'Hello World',
    category: 'intro',
    date: '2024-01-01',
    content: '博客内容...',
    excerpt: '简短描述...'
  },
  // ...
];
```

### 6.2 文件系统模拟

```javascript
// 虚拟文件系统结构
const fileSystem = {
  '/': {
    type: 'folder',
    children: ['my-blog', 'my-pictures', 'my-documents']
  },
  '/my-blog': {
    type: 'folder',
    children: ['hello-world', 'tech-notes', 'life-diary']
  },
  '/my-blog/hello-world': {
    type: 'file',
    app: 'notepad',
    postId: 'hello-world'
  }
};
```

---

## 7. 开发计划

### Phase 1: 基础框架搭建 ✅
- [x] 完善 ShortCutContainer 快捷方式显示
- [x] 实现 AppIcon 桌面图标组件
- [x] 配置桌面应用列表

### Phase 2: 窗口系统 ✅
- [x] 实现 WindowManager 窗口管理器
- [x] 实现基础 Window 窗口组件
- [x] 实现 TitleBar 标题栏

### Phase 3: 文件浏览器 ✅
- [x] 实现 FileExplorer 文件浏览器组件
- [x] 实现文件夹导航逻辑（进入/返回）
- [x] 实现文件图标显示
- [x] 实现地址栏显示

### Phase 4: 文本编辑器 ✅
- [x] 实现 TextEditor 文本编辑器组件
- [x] 集成博客文章数据
- [x] 实现文章读取功能
- [x] 支持 Markdown 渲染

### Phase 5: 完善与优化
- [x] 添加菜单栏
- [x] 添加状态栏
- [x] 优化交互体验
- [ ] 添加博客内容编辑功能

### Phase 6: GitHub Pages 部署 ✅
- [x] 配置 Next.js 静态导出
- [x] 创建 GitHub Actions 部署工作流
- [x] 配置构建和发布脚本

---

## 8. 部署方案

### 8.1 部署架构

本项目采用 **GitHub Pages + GitHub Actions** 进行持续集成和部署。

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │   Source Code   │    │     GitHub Actions          │ │
│  │   (cabin/)      │───▶│  1. Build Next.js           │ │
│  │                 │    │  2. Export to static        │ │
│  └─────────────────┘    │  3. Deploy to gh-pages      │ │
│                          └──────────────┬──────────────┘ │
└─────────────────────────────────────────┼────────────────┘
                                          │
                                          ▼
                              ┌─────────────────────────┐
                              │    GitHub Pages         │
                              │  (teatimecode.github.io)│
                              └─────────────────────────┘
```

### 8.2 GitHub Actions 工作流

构建流程：
1. 触发条件：`main` 分支有 `push` 事件
2. 安装依赖：`npm install`
3. 构建项目：`npm run export`（使用 `next export` 输出静态文件）
4. 部署发布：使用 `actions/upload-pages-artifact` 和 `actions/deploy-pages`

### 8.3 静态导出配置

在 `next.config.js` 中配置静态导出：

```javascript
module.exports = {
  // ... existing config
  exportPathMap: async function() {
    return {
      '/': { page: '/' }
    };
  }
}
```

### 8.4 博客内容管理

博客文章存储在 `app/data/posts.js` 中，支持以下格式：

```javascript
// app/data/posts.js
export const posts = [
  {
    id: 'hello-world',
    title: 'Hello World',
    slug: 'hello-world',
    category: 'intro',
    date: '2024-01-01',
    content: '# Markdown 内容...\n\n正文...',
    excerpt: '简短描述...'
  },
];
```

文章更新流程：
1. 编辑 `app/data/posts.js` 添加新文章
2. 提交并推送到 `main` 分支
3. GitHub Actions 自动构建并部署

### 8.5 访问方式

- **桌面应用**：`https://teatimecode.github.io/cabin/`
- **博客文章**：在桌面应用中通过"我的博客"文件夹访问

---

## 9. 注意事项

---

## 8. 注意事项

1. **React95 版本**：当前使用 v2.0.0，需要注意 API 兼容性
2. **Next.js 配置**：使用 `alias` 配置简化导入路径
3. **样式方案**：使用 styled-components 处理所有样式
4. **窗口层级**：通过 z-index 管理窗口叠加顺序
