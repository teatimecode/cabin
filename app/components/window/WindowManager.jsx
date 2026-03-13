import React from 'react';
import styled from 'styled-components';
import Window from './Window';
import { AppType } from '../../config/apps';
import FileExplorer from '../app/FileExplorer';
import TextEditor from '../app/TextEditor';
import { getFileContent } from '../../../content';

// 模拟文件系统（仅包含结构，内容从外部文件加载）
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
  },
  '/my-blog/tech-notes': {
    type: 'file',
    name: '技术笔记.txt',
    app: 'notepad',
    postId: 'tech-notes',
  },
  '/my-blog/life-diary': {
    type: 'file',
    name: '生活日记.txt',
    app: 'notepad',
    postId: 'life-diary',
  },
  '/my-blog/win95-style-website': {
    type: 'file',
    name: 'Win95风格网站.txt',
    app: 'notepad',
    postId: 'win95-style-website',
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
    postId: 'readme',
  },
  '/my-documents/notes': {
    type: 'file',
    name: '便签.txt',
    app: 'notepad',
    postId: 'notes',
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
  bottom: 0;
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

    // 从外部内容获取文件内容
    const content = getFileContent(file.postId);

    // 打开记事本窗口
    const newWindow = {
      id: `window-${Date.now()}`,
      appId: 'notepad',
      fileId: file.postId,
      title: file.name,
      app: { id: 'notepad', name: '记事本', type: AppType.NOTEPAD },
      content: content,
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
    const { app, path, content, title } = window;

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
            content={content || ''}
            fileName={title || '无标题'}
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
