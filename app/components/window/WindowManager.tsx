"use client";

import React from 'react';
import { AppConfig } from '../../config/apps';
import { useFileSystem } from '../../lib/fs/FSContext';
import Window from './Window';

// 导入应用组件
import FileExplorer from '../app/FileExplorer';
import TextEditor from '../app/TextEditor';

// 窗口接口定义
export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  icon?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  appType?: string;
  postId?: string; // 用于博客文章ID
}

interface WindowManagerState {
  windows: WindowInstance[];
  nextZIndex: number;
}

interface WindowManagerProps {
  fileSystem?: any;
  getFileContent?: (_path: string) => Promise<string>;
}

class WindowManager extends React.Component<WindowManagerProps, WindowManagerState> {
  private windowPositions: Map<string, { x: number; y: number }> = new Map();
  private nextWindowPosition = { x: 50, y: 50 }; // 初始位置偏移

  constructor(props: WindowManagerProps) {
    super(props);
    this.state = {
      windows: [],
      nextZIndex: 1,
    };
  }

  // 获取下一个窗口位置，避免完全重叠
  getNextWindowPosition = () => {
    const pos = { ...this.nextWindowPosition };
    // 偏移下一个窗口的位置
    this.nextWindowPosition.x = Math.min(this.nextWindowPosition.x + 30, 200);
    this.nextWindowPosition.y = Math.min(this.nextWindowPosition.y + 30, 200);

    // 如果超出范围则重置
    if (this.nextWindowPosition.x > 150 || this.nextWindowPosition.y > 150) {
      this.nextWindowPosition = { x: 50, y: 50 };
    }

    return pos;
  };

  // 打开应用
  openApp = (app: AppConfig, postId?: string) => {
    // 检查是否已有相同应用的窗口（非唯一窗口）
    if (!app.unique) {
      const existingWindow = this.state.windows.find(w => w.appId === app.id && !w.isMinimized);
      if (existingWindow) {
        this.focusWindow(existingWindow.id);
        return;
      }
    }

    // 如果应用是唯一的，检查是否已存在
    if (app.unique) {
      const existingWindow = this.state.windows.find(w => w.appId === app.id);
      if (existingWindow) {
        this.focusWindow(existingWindow.id);
        return;
      }
    }

    const newPosition = this.getNextWindowPosition();
    const newWindow: WindowInstance = {
      id: `${app.id}-${Date.now()}`, // 使用时间戳确保唯一性
      appId: app.id,
      title: app.name,
      icon: app.iconName,
      position: newPosition,
      size: { width: 600, height: 400 },
      isMinimized: false,
      isMaximized: false,
      zIndex: this.state.nextZIndex,
      appType: app.type,
      postId: postId, // 传递postId用于博客文章
    };

    this.setState(prevState => ({
      windows: [...prevState.windows, newWindow],
      nextZIndex: prevState.nextZIndex + 1,
    }));
  };

  // 关闭窗口
  closeWindow = (id: string) => {
    this.setState(prevState => ({
      windows: prevState.windows.filter(window => window.id !== id),
      nextZIndex: prevState.nextZIndex > 1 ? prevState.nextZIndex - 1 : 1,
    }));
  };

  // 最小化窗口
  minimizeWindow = (id: string) => {
    this.setState(prevState => ({
      windows: prevState.windows.map(window =>
        window.id === id ? { ...window, isMinimized: true } : window
      ),
    }));
  };

  // 最大化窗口
  maximizeWindow = (id: string) => {
    this.setState(prevState => ({
      windows: prevState.windows.map(window =>
        window.id === id ? { ...window, isMaximized: !window.isMaximized } : window
      ),
    }));
  };

  // 聚焦窗口
  focusWindow = (id: string) => {
    const focusedZIndex = this.state.nextZIndex;
    this.setState(prevState => ({
      windows: prevState.windows.map(window => {
        if (window.id === id) {
          return { ...window, zIndex: focusedZIndex, isMinimized: false };
        } else if (window.zIndex >= focusedZIndex) {
          return { ...window, zIndex: window.zIndex - 1 };
        }
        return window;
      }),
      nextZIndex: prevState.nextZIndex + 1,
    }));
  };

  // 恢复窗口（从最小化状态）
  restoreWindow = (id: string) => {
    this.focusWindow(id);
  };

  // 获取活动窗口 ID
  getActiveWindowId = (): string | null => {
    const focusedWindow = this.state.windows.reduce((max, win) => 
      win.zIndex > (max?.zIndex || 0) ? win : max, null as WindowInstance | null);
    return focusedWindow ? focusedWindow.id : null;
  };

  // 渲染窗口内容
  renderWindowContent = (window: WindowInstance) => {
    const { fileSystem, getFileContent } = this.props;
    
    switch (window.appType) {
      case 'explorer':
      case 'EXPLORER':
        return <FileExplorer initialPath="/" fileSystem={fileSystem} onOpenItem={(item) => {
          if (item.postId) {
            // 如果是博客文章，打开文本编辑器显示内容
            const postPath = `/my-blog/${item.postId}`;
            console.log('Opening blog post:', postPath);
            if (getFileContent) {
              getFileContent(postPath).then((content) => {
                console.log('Blog post content loaded:', content);
                this.openBlogPost(item.name, content);
              }).catch((err) => {
                console.error('Failed to load blog post:', err);
              });
            } else {
              console.warn('getFileContent is not available');
            }
          } else {
            console.log('Item has no postId:', item);
          }
        }} />;
      case 'notepad':
      case 'NOTEPAD':
        // 如果有postId，加载对应的文章内容
        if (window.postId) {
          const postPath = `/my-blog/posts/${window.postId}.md`;
          if (getFileContent) {
            return (
              <TextEditor initialContent={""} />
            );
          }
        }
        return <TextEditor />;
      default:
        return <div>未知应用</div>;
    }
  };

  // 打开博客文章
  openBlogPost = (title: string, content: string) => {
    const newPosition = this.getNextWindowPosition();
    const newWindow: WindowInstance = {
      id: `blog-${Date.now()}`,
      appId: 'blog-post-' + Date.now(),
      title: title,
      icon: 'notepad',
      position: newPosition,
      size: { width: 600, height: 400 },
      isMinimized: false,
      isMaximized: false,
      zIndex: this.state.nextZIndex,
      appType: 'NOTEPAD',
    };

    // 存储内容到临时位置或者使用其他方式传递内容
    // 这里我们简单地更新状态，实际应用中可能需要更复杂的状态管理
    this.setState(prevState => ({
      windows: [...prevState.windows, newWindow],
      nextZIndex: prevState.nextZIndex + 1,
    }));
  };

  render() {
    const { windows } = this.state;
    const activeWindowId = this.getActiveWindowId();

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {windows.map(window => (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            isActive={activeWindowId === window.id}
            zIndex={window.zIndex}
            isMinimized={window.isMinimized}
            isMaximized={window.isMaximized}
            position={window.position}
            size={window.size}
            onClose={this.closeWindow}
            onMinimize={this.minimizeWindow}
            onMaximize={this.maximizeWindow}
            onFocus={this.focusWindow}
          >
            {this.renderWindowContent(window)}
          </Window>
        ))}
      </div>
    );
  }
}

// 导出 WindowManager 类以便直接引用
export { WindowManager };

// 封装Hook使用逻辑的组件（使用 forwardRef）
interface WindowManagerWrapperProps {}

export interface WindowManagerAPI {
  openApp: (app: AppConfig, postId?: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  openBlogPost: (title: string, content: string) => void;
  getWindows: () => any[];
  getActiveWindowId: () => string | null;
  restoreWindow: (id: string) => void;
}

const WindowManagerWrapper = React.forwardRef<WindowManagerAPI, WindowManagerWrapperProps>((_, ref) => {
  const { fileSystem, getFileContent } = useFileSystem();
  
  // 创建内部 ref 来获取 WindowManager 实例
  const windowManagerRef = React.useRef<WindowManager>(null);
  
  console.log('WindowManagerWrapper: render called, has ref:', !!ref);
  
  // 将 WindowManager 的方法暴露给外部
  React.useImperativeHandle(ref, () => {
    console.log('WindowManagerWrapper: useImperativeHandle called');
    return {
      openApp: (app: AppConfig, postId?: string) => {
        windowManagerRef.current?.openApp(app, postId);
      },
      closeWindow: (id: string) => {
        windowManagerRef.current?.closeWindow(id);
      },
      minimizeWindow: (id: string) => {
        windowManagerRef.current?.minimizeWindow(id);
      },
      maximizeWindow: (id: string) => {
        windowManagerRef.current?.maximizeWindow(id);
      },
      focusWindow: (id: string) => {
        windowManagerRef.current?.focusWindow(id);
      },
      openBlogPost: (title: string, content: string) => {
        windowManagerRef.current?.openBlogPost(title, content);
      },
      getWindows: () => {
        return windowManagerRef.current?.state.windows || [];
      },
      getActiveWindowId: () => {
        const windows = windowManagerRef.current?.state.windows || [];
        const focusedWindow = windows.reduce((max, win) => 
          win.zIndex > (max?.zIndex || 0) ? win : max, null as any);
        return focusedWindow ? focusedWindow.id : null;
      },
      restoreWindow: (id: string) => {
        windowManagerRef.current?.restoreWindow(id);
      },
    };
  });

  return (
    <WindowManager
      ref={windowManagerRef}
      fileSystem={fileSystem}
      getFileContent={getFileContent}
    />
  );
});

WindowManagerWrapper.displayName = 'WindowManagerWrapper';

export default WindowManagerWrapper;
