import React from 'react';
import styled from 'styled-components';
import Window from './Window';
import { AppType } from '../../config/apps';
import FileExplorer from '../app/FileExplorer';
import TextEditor from '../app/TextEditor';

// 模拟文件系统
const FileSystem = {
  '/': {
    type: 'folder',
    name: '桌面',
    children: ['my-blog', 'my-documents', 'my-pictures', 'my-computer', 'recycle-bin'],
  },
  '/my-blog': {
    type: 'folder',
    name: '我的博客',
    children: ['hello-world', 'tech-notes', 'life-diary', 'win95-style-website'],
  },
  '/my-blog/hello-world': {
    type: 'file',
    name: 'Hello World.txt',
    app: 'notepad',
    postId: 'hello-world',
    content: `# Hello World

欢迎来到我的 Win95 风格博客！

这是一个模拟 Windows 95 界面的个人网站项目。

## 关于这个项目

这个网站使用了 React95 组件库来模拟经典的 Windows 95 界面。
你可以像使用真正的 Windows 95 一样浏览文件夹和打开文件。

## 如何使用

1. 双击桌面上的"我的博客"图标
2. 浏览文件夹，双击打开文章
3. 使用地址栏导航

祝你使用愉快！
`,
  },
  '/my-blog/tech-notes': {
    type: 'file',
    name: '技术笔记.txt',
    app: 'notepad',
    postId: 'tech-notes',
    content: `# 技术笔记

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

Next.js 9.3.2 支持静态导出：

\`\`\`javascript
// next.config.js
module.exports = {
  exportPathMap: async function() {
    return {
      '/': { page: '/' }
    };
  }
}
\`\`\`
`,
  },
  '/my-blog/life-diary': {
    type: 'file',
    name: '生活日记.txt',
    app: 'notepad',
    postId: 'life-diary',
    content: `# 生活日记

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
- [ ] 添加开始菜单功能
`,
  },
  '/my-blog/win95-style-website': {
    type: 'file',
    name: 'Win95风格网站.txt',
    app: 'notepad',
    postId: 'win95-style-website',
    content: `# Win95 风格个人网站开发总结

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
- 添加更多主题
`,
  },
  '/my-documents': {
    type: 'folder',
    name: '我的文档',
    children: ['readme', 'notes'],
  },
  '/my-documents/readme': {
    type: 'file',
    name: 'README.txt',
    app: 'notepad',
    content: `# 欢迎使用

这是"我的文档"文件夹。

你可以在这里存放各种文本文件。
`,
  },
  '/my-documents/notes': {
    type: 'file',
    name: '便签.txt',
    app: 'notepad',
    content: `待办事项：
- 完成项目文档
- 提交代码
- 备份数据
`,
  },
  '/my-pictures': {
    type: 'folder',
    name: '我的图片',
    children: [],
  },
  '/my-computer': {
    type: 'folder',
    name: '我的电脑',
    children: ['c-drive', 'd-drive'],
  },
  '/my-computer/c-drive': {
    type: 'folder',
    name: 'C:',
    children: ['windows', 'program-files', 'users'],
  },
  '/my-computer/c-drive/windows': {
    type: 'folder',
    name: 'Windows',
    children: [],
  },
  '/my-computer/c-drive/program-files': {
    type: 'folder',
    name: 'Program Files',
    children: [],
  },
  '/my-computer/c-drive/users': {
    type: 'folder',
    name: 'Users',
    children: ['guest', 'admin'],
  },
  '/my-computer/c-drive/users/guest': {
    type: 'folder',
    name: 'Guest',
    children: [],
  },
  '/my-computer/c-drive/users/admin': {
    type: 'folder',
    name: 'Admin',
    children: ['desktop', 'documents', 'downloads'],
  },
  '/my-computer/c-drive/users/admin/desktop': {
    type: 'folder',
    name: 'Desktop',
    children: [],
  },
  '/my-computer/c-drive/users/admin/documents': {
    type: 'folder',
    name: 'Documents',
    children: [],
  },
  '/my-computer/c-drive/users/admin/downloads': {
    type: 'folder',
    name: 'Downloads',
    children: [],
  },
  '/my-computer/d-drive': {
    type: 'folder',
    name: 'D:',
    children: [],
  },
  '/recycle-bin': {
    type: 'folder',
    name: '回收站',
    children: [],
  },
};

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 28px;
  overflow: hidden;
`;

class WindowManager extends React.PureComponent {
  state = {
    windows: [],
    activeWindowId: null,
    nextZIndex: 1,
  };

  static FileSystem = FileSystem;

  openWindow = (app) => {
    const { windows, nextZIndex } = this.state;

    // 检查窗口是否已经打开
    const existingWindow = windows.find(w => w.appId === app.id);
    if (existingWindow) {
      this.focusWindow(existingWindow.id);
      return;
    }

    // 创建新窗口
    const newWindow = {
      id: `window-${Date.now()}`,
      appId: app.id,
      title: app.name,
      app: app,
      path: app.path || '/',  // 文件浏览器路径
      zIndex: nextZIndex,
      isMinimized: false,
      isMaximized: false,
    };

    this.setState({
      windows: [...windows, newWindow],
      activeWindowId: newWindow.id,
      nextZIndex: nextZIndex + 1,
    });
  };

  closeWindow = (windowId) => {
    const { windows, activeWindowId } = this.state;
    const newWindows = windows.filter(w => w.id !== windowId);

    // 如果关闭的是活动窗口，激活另一个窗口
    let newActiveId = activeWindowId;
    if (activeWindowId === windowId) {
      newActiveId = newWindows.length > 0 ? newWindows[newWindows.length - 1].id : null;
    }

    this.setState({
      windows: newWindows,
      activeWindowId: newActiveId,
    });
  };

  focusWindow = (windowId) => {
    if (!windowId) return;

    const { windows, nextZIndex } = this.state;
    const newWindows = windows.map(w => ({
      ...w,
      zIndex: w.id === windowId ? nextZIndex : w.zIndex,
    }));

    this.setState({
      windows: newWindows,
      activeWindowId: windowId,
      nextZIndex: nextZIndex + 1,
    });
  };

  minimizeWindow = (windowId) => {
    const { windows } = this.state;
    const newWindows = windows.map(w =>
      w.id === windowId ? { ...w, isMinimized: true } : w
    );

    // 激活另一个未最小化的窗口
    const visibleWindows = newWindows.filter(w => !w.isMinimized);
    const newActiveId = visibleWindows.length > 0 ? visibleWindows[visibleWindows.length - 1].id : null;

    this.setState({
      windows: newWindows,
      activeWindowId: newActiveId,
    });
  };

  maximizeWindow = (windowId) => {
    const { windows } = this.state;
    const newWindows = windows.map(w =>
      w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
    );

    this.setState({ windows: newWindows });
  };

  handleOpenFile = (file) => {
    const { windows, nextZIndex } = this.state;

    // 查找是否已有该文件的窗口
    const existingWindow = windows.find(w => w.appId === 'notepad' && w.fileId === file.postId);
    if (existingWindow) {
      this.focusWindow(existingWindow.id);
      return;
    }

    // 打开记事本窗口
    const newWindow = {
      id: `window-${Date.now()}`,
      appId: 'notepad',
      title: file.name,
      app: { id: 'notepad', name: '记事本', type: AppType.NOTEPAD },
      file: file,
      zIndex: nextZIndex,
      isMinimized: false,
      isMaximized: false,
    };

    this.setState({
      windows: [...windows, newWindow],
      activeWindowId: newWindow.id,
      nextZIndex: nextZIndex + 1,
    });
  };

  getWindowContent = (window) => {
    const { app, path, file } = window;

    switch (app.type) {
      case AppType.FOLDER:
      case AppType.EXPLORER:
        return (
          <FileExplorer
            fileSystem={FileSystem}
            initialPath={path || '/'}
            onOpenItem={this.handleOpenFile}
          />
        );
      case AppType.NOTEPAD:
        return (
          <TextEditor
            content={file ? file.content : ''}
            fileName={file ? file.name : '无标题'}
            showStatusBar={true}
          />
        );
      default:
        return <div>未知应用</div>;
    }
  };

  render() {
    const { windows, activeWindowId } = this.state;

    return (
      <Container onClick={() => this.focusWindow(null)}>
        {windows.map(window => (
          <Window
            key={window.id}
            window={window}
            isActive={activeWindowId === window.id}
            onFocus={() => this.focusWindow(window.id)}
            onClose={this.closeWindow}
            onMinimize={this.minimizeWindow}
            onMaximize={this.maximizeWindow}
            onClick={(e) => {
              e.stopPropagation();
              this.focusWindow(window.id);
            }}
          >
            {this.getWindowContent(window)}
          </Window>
        ))}
      </Container>
    );
  }
}

export default WindowManager;
