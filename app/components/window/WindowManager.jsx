import React from 'react';
import styled from 'styled-components';
import Window from './Window';
import { AppType } from '../../config/apps';
import FileExplorer from '../app/FileExplorer';
import TextEditor from '../app/TextEditor';
import { useFileSystem } from '../../lib/fs/FSContext';
import { getFileContentById } from '../../lib/fs';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

/**
 * 窗口管理器组件（使用 Hooks）
 */
const WindowManager = React.forwardRef((props, ref) => {
  const fsContext = useFileSystem();
  const [windows, setWindows] = React.useState([]);
  const [activeWindowId, setActiveWindowId] = React.useState(null);
  const [nextZIndex, setNextZIndex] = React.useState(1);

  // 暴露内部组件的方法给父组件
  React.useImperativeHandle(ref, () => ({
    openWindow: (app) => {
      openWindow(app);
    },
    closeWindow: (windowId) => {
      closeWindow(windowId);
    },
    focusWindow: (windowId) => {
      focusWindow(windowId);
    },
    restoreWindow: (windowId) => {
      restoreWindow(windowId);
    },
    getWindows: () => {
      return windows;
    },
    getActiveWindowId: () => {
      return activeWindowId;
    },
  }));

  const openWindow = (app) => {
    // 检查窗口是否已经打开（对于文件夹类型的窗口，允许打开多个）
    if (app.type !== AppType.FOLDER && app.type !== AppType.EXPLORER) {
      const existingWindow = windows.find(w => w.appId === app.id);
      if (existingWindow) {
        focusWindow(existingWindow.id);
        return;
      }
    }

    // 创建新窗口
    const newWindow = {
      id: `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      appId: app.id,
      title: app.name,
      app: app,
      path: app.path || '/',  // 文件浏览器路径
      icon: app.iconName || 'folder',
      zIndex: nextZIndex,
      isMinimized: false,
      isMaximized: false,
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (windowId) => {
    const newWindows = windows.filter(w => w.id !== windowId);

    // 如果关闭的是活动窗口，激活另一个窗口
    let newActiveId = activeWindowId;
    if (activeWindowId === windowId) {
      newActiveId = newWindows.length > 0 ? newWindows[newWindows.length - 1].id : null;
    }

    setWindows(newWindows);
    setActiveWindowId(newActiveId);
  };

  const focusWindow = (windowId) => {
    if (!windowId) {
      setActiveWindowId(null);
      return;
    }

    const newWindows = windows.map(w => ({
      ...w,
      zIndex: w.id === windowId ? nextZIndex : w.zIndex,
    }));

    setWindows(newWindows);
    setActiveWindowId(windowId);
    setNextZIndex(prev => prev + 1);
  };

  const minimizeWindow = (windowId) => {
    const newWindows = windows.map(w =>
      w.id === windowId ? { ...w, isMinimized: true } : w
    );

    // 激活另一个未最小化的窗口
    const visibleWindows = newWindows.filter(w => !w.isMinimized);
    const newActiveId = visibleWindows.length > 0 ? visibleWindows[visibleWindows.length - 1].id : null;

    setWindows(newWindows);
    setActiveWindowId(newActiveId);
  };

  const maximizeWindow = (windowId) => {
    const newWindows = windows.map(w =>
      w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
    );

    setWindows(newWindows);
  };

  // 恢复窗口（从最小化状态）
  const restoreWindow = (windowId) => {
    const newWindows = windows.map(w =>
      w.id === windowId ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
    );

    setWindows(newWindows);
    setActiveWindowId(windowId);
    setNextZIndex(prev => prev + 1);
  };

  const handleOpenFile = async (file) => {
    const { fileSystem } = fsContext;

    // 如果是文件夹，打开新的文件浏览器窗口
    if (file.type === 'folder' || file.type === 'drive' || file.type === 'root') {
      const newWindow = {
        id: `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        appId: `folder-${file.path}`,
        title: file.name,
        app: { id: 'explorer', name: file.name, type: AppType.EXPLORER, iconName: file.icon || 'folder' },
        path: file.path,
        icon: file.icon || 'folder',
        zIndex: nextZIndex,
        isMinimized: false,
        isMaximized: false,
      };

      setWindows(prev => [...prev, newWindow]);
      setActiveWindowId(newWindow.id);
      setNextZIndex(prev => prev + 1);
      return;
    }

    // 可挂载占位符
    if (file.type === 'placeholder' && file.mountable) {
      // 在 FileExplorer 中处理挂载
      return;
    }

    // 查找是否已有该文件的窗口
    const existingWindow = windows.find(w => w.appId === 'notepad' && w.fileId === file.postId);
    if (existingWindow) {
      focusWindow(existingWindow.id);
      return;
    }

    // 获取文件内容
    let content = '';
    if (file.postId) {
      // 通过 postId 获取内容（兼容旧代码）
      content = getFileContentById(file.postId);
    } else if (file.path) {
      // 通过路径获取内容
      content = await getFileContent(file.path);
    }

    // 打开记事本窗口
    const newWindow = {
      id: `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      appId: 'notepad',
      fileId: file.postId || file.path,
      title: file.name,
      app: { id: 'notepad', name: '记事本', type: AppType.NOTEPAD, iconName: 'notepad' },
      content: content,
      icon: 'notepad',
      zIndex: nextZIndex,
      isMinimized: false,
      isMaximized: false,
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setNextZIndex(prev => prev + 1);
  };

  // 关闭当前窗口（供 TextEditor 使用）
  const handleClose = () => {
    if (activeWindowId) {
      closeWindow(activeWindowId);
    }
  };

  // 新建文件
  const handleNewFile = (windowId) => {
    // 创建新的记事本窗口
    const newWindow = {
      id: `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      appId: 'notepad',
      fileId: null,
      title: '无标题',
      app: { id: 'notepad', name: '记事本', type: AppType.NOTEPAD, iconName: 'notepad' },
      content: '',
      icon: 'notepad',
      zIndex: nextZIndex,
      isMinimized: false,
      isMaximized: false,
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setNextZIndex(prev => prev + 1);
  };

  // 保存文件内容
  const handleSaveFile = (windowId, content) => {
    const newWindows = windows.map(w => 
      w.id === windowId ? { ...w, content } : w
    );
    setWindows(newWindows);
  };

  // 更新窗口标题
  const updateWindowTitle = (windowId, title) => {
    const newWindows = windows.map(w => 
      w.id === windowId ? { ...w, title } : w
    );
    setWindows(newWindows);
  };

  const getWindowContent = (window) => {
    const { app, path, content, title, id } = window;
    const { fileSystem, getFileContent } = fsContext;

    switch (app.type) {
      case AppType.FOLDER:
      case AppType.EXPLORER:
        return (
          <FileExplorer
            fileSystem={fileSystem}
            initialPath={path || '/'}
            onOpenItem={handleOpenFile}
          />
        );
      case AppType.NOTEPAD:
        return (
          <TextEditor
            content={content || ''}
            fileName={title || '无标题'}
            showStatusBar={true}
            onClose={handleClose}
            onNew={() => handleNewFile(id)}
            onSave={(newContent) => handleSaveFile(id, newContent)}
            onOpen={() => {
              // 打开文件选择器 - 这里可以扩展为显示文件对话框
              // 暂时通过打开新窗口实现
            }}
          />
        );
      default:
        return <div>未知应用</div>;
    }
  };

  return (
    <Container onClick={() => focusWindow(null)}>
      {windows.map(window => (
        <Window
          key={window.id}
          window={window}
          isActive={activeWindowId === window.id}
          onFocus={() => focusWindow(window.id)}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onClick={(e) => {
            e.stopPropagation();
            focusWindow(window.id);
          }}
        >
          {getWindowContent(window)}
        </Window>
      ))}
    </Container>
  );
});

WindowManager.displayName = 'WindowManager';

export default WindowManager;
