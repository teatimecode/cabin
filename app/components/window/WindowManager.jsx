import React from 'react';
import styled from 'styled-components';
import Window from './Window';
import { AppType } from '../../config/apps';
import FileExplorer from '../app/FileExplorer';
import TextEditor from '../app/TextEditor';
import { FSProvider, useFileSystem } from '../../lib/fs/FSContext';
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
 * 窗口管理器内部组件（使用Context）
 */
class WindowManagerInner extends React.PureComponent {
  state = {
    windows: [],
    activeWindowId: null,
    nextZIndex: 1,
  };

  openWindow = (app) => {
    const { windows, nextZIndex } = this.state;

    // 检查窗口是否已经打开（对于文件夹类型的窗口，允许打开多个）
    if (app.type !== AppType.FOLDER && app.type !== AppType.EXPLORER) {
      const existingWindow = windows.find(w => w.appId === app.id);
      if (existingWindow) {
        this.focusWindow(existingWindow.id);
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

  // 恢复窗口（从最小化状态）
  restoreWindow = (windowId) => {
    const { windows, nextZIndex } = this.state;
    const newWindows = windows.map(w =>
      w.id === windowId ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
    );

    this.setState({
      windows: newWindows,
      activeWindowId: windowId,
      nextZIndex: nextZIndex + 1,
    });
  };

  // 获取窗口列表（供任务栏使用）
  getWindows = () => {
    return this.state.windows;
  };

  // 获取活动窗口ID
  getActiveWindowId = () => {
    return this.state.activeWindowId;
  };

  handleOpenFile = async (file) => {
    const { windows, nextZIndex } = this.state;
    const { fileSystem, getFileContent } = this.props;

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

      this.setState({
        windows: [...windows, newWindow],
        activeWindowId: newWindow.id,
        nextZIndex: nextZIndex + 1,
      });
      return;
    }

    // 可挂载占位符
    if (file.type === 'placeholder' && file.mountable) {
      // 在FileExplorer中处理挂载
      return;
    }

    // 查找是否已有该文件的窗口
    const existingWindow = windows.find(w => w.appId === 'notepad' && w.fileId === file.postId);
    if (existingWindow) {
      this.focusWindow(existingWindow.id);
      return;
    }

    // 获取文件内容
    let content = '';
    if (file.postId) {
      // 通过postId获取内容（兼容旧代码）
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

    this.setState({
      windows: [...windows, newWindow],
      activeWindowId: newWindow.id,
      nextZIndex: nextZIndex + 1,
    });
  };

  // 关闭当前窗口（供 TextEditor 使用）
  handleClose = () => {
    const { activeWindowId } = this.state;
    if (activeWindowId) {
      this.closeWindow(activeWindowId);
    }
  };

  // 新建文件
  handleNewFile = (windowId) => {
    const { windows, nextZIndex } = this.state;
    
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

    this.setState({
      windows: [...windows, newWindow],
      activeWindowId: newWindow.id,
      nextZIndex: nextZIndex + 1,
    });
  };

  // 保存文件内容
  handleSaveFile = (windowId, content) => {
    const { windows } = this.state;
    const window = windows.find(w => w.id === windowId);
    if (window) {
      // 更新窗口内容
      const newWindows = windows.map(w => 
        w.id === windowId ? { ...w, content } : w
      );
      this.setState({ windows: newWindows });
    }
  };

  // 更新窗口标题
  updateWindowTitle = (windowId, title) => {
    const { windows } = this.state;
    const newWindows = windows.map(w => 
      w.id === windowId ? { ...w, title } : w
    );
    this.setState({ windows: newWindows });
  };

  componentDidMount() {
    // 组件挂载后，将方法暴露给父组件
    const { onRef } = this.props;
    if (onRef) {
      onRef({
        openWindow: this.openWindow,
        closeWindow: this.closeWindow,
        focusWindow: this.focusWindow,
        restoreWindow: this.restoreWindow,
        getWindows: this.getWindows,
        getActiveWindowId: this.getActiveWindowId,
      });
    }
  }

  componentWillUnmount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(null);
    }
  }

  getWindowContent = (window) => {
    const { app, path, content, title, id } = window;
    const { fileSystem } = this.props;

    switch (app.type) {
      case AppType.FOLDER:
      case AppType.EXPLORER:
        return (
          <FileExplorer
            fileSystem={fileSystem}
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
            onClose={() => this.closeWindow(id)}
            onNew={() => this.handleNewFile(id)}
            onSave={(newContent) => this.handleSaveFile(id, newContent)}
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

/**
 * 窗口管理器包装组件（使用Context）
 */
const WindowManagerWrapper = React.forwardRef((props, ref) => {
  const fsContext = useFileSystem();
  const [instance, setInstance] = React.useState(null);

  // 暴露内部组件的方法给父组件
  React.useImperativeHandle(ref, () => ({
    openWindow: (app) => {
      if (instance) {
        instance.openWindow(app);
      }
    },
    closeWindow: (windowId) => {
      if (instance) {
        instance.closeWindow(windowId);
      }
    },
    focusWindow: (windowId) => {
      if (instance) {
        instance.focusWindow(windowId);
      }
    },
    restoreWindow: (windowId) => {
      if (instance) {
        instance.restoreWindow(windowId);
      }
    },
    getWindows: () => {
      if (instance) {
        return instance.getWindows();
      }
      return [];
    },
    getActiveWindowId: () => {
      if (instance) {
        return instance.getActiveWindowId();
      }
      return null;
    },
  }));

  const handleRef = React.useCallback((inst) => {
    setInstance(inst);
  }, []);
  
  return (
    <WindowManagerInner
      onRef={handleRef}
      {...props}
      fileSystem={fsContext.fileSystem}
      getFileContent={fsContext.getFileContent}
    />
  );
});

WindowManagerWrapper.displayName = 'WindowManagerWrapper';

/**
 * 窗口管理器主组件
 */
const WindowManager = React.forwardRef((props, ref) => {
  return (
    <FSProvider>
      <WindowManagerWrapper {...props} ref={ref} />
    </FSProvider>
  );
});

WindowManager.displayName = 'WindowManager';

export default WindowManager;
