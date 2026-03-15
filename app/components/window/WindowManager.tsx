import React from 'react';
import styled from 'styled-components';
import Window from './Window';
import type { WindowState } from './Window';
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

interface WindowManagerInnerProps {
  onRef?: (inst: WindowManagerInnerInstance | null) => void;
  fileSystem?: any;
  getFileContent?: (path: string) => Promise<string>;
}

interface WindowManagerInnerState {
  windows: WindowState[];
  activeWindowId: string | null;
  nextZIndex: number;
}

interface WindowManagerInnerInstance {
  openWindow: (app: any) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string | null) => void;
  restoreWindow: (windowId: string) => void;
  getWindows: () => WindowState[];
  getActiveWindowId: () => string | null;
}

/**
 * 窗口管理器内部组件（使用Context）
 */
class WindowManagerInner extends React.PureComponent<WindowManagerInnerProps, WindowManagerInnerState> {
  state: WindowManagerInnerState = {
    windows: [],
    activeWindowId: null,
    nextZIndex: 1,
  };

  openWindow = (app: any) => {
    const { windows, nextZIndex } = this.state;

    if (app.type !== AppType.FOLDER && app.type !== AppType.EXPLORER) {
      const existingWindow = windows.find(w => w.appId === app.id);
      if (existingWindow) {
        this.focusWindow(existingWindow.id);
        return;
      }
    }

    const newWindow: WindowState = {
      id: `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      appId: app.id,
      title: app.name,
      app: app,
      path: app.path || '/',
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

  closeWindow = (windowId: string) => {
    const { windows, activeWindowId } = this.state;
    const newWindows = windows.filter(w => w.id !== windowId);

    let newActiveId = activeWindowId;
    if (activeWindowId === windowId) {
      newActiveId = newWindows.length > 0 ? newWindows[newWindows.length - 1].id : null;
    }

    this.setState({
      windows: newWindows,
      activeWindowId: newActiveId,
    });
  };

  focusWindow = (windowId: string | null) => {
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

  minimizeWindow = (windowId: string) => {
    const { windows } = this.state;
    const newWindows = windows.map(w =>
      w.id === windowId ? { ...w, isMinimized: true } : w
    );

    const visibleWindows = newWindows.filter(w => !w.isMinimized);
    const newActiveId = visibleWindows.length > 0 ? visibleWindows[visibleWindows.length - 1].id : null;

    this.setState({
      windows: newWindows,
      activeWindowId: newActiveId,
    });
  };

  maximizeWindow = (windowId: string) => {
    const { windows } = this.state;
    const newWindows = windows.map(w =>
      w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
    );

    this.setState({ windows: newWindows });
  };

  restoreWindow = (windowId: string) => {
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

  getWindows = (): WindowState[] => {
    return this.state.windows;
  };

  getActiveWindowId = (): string | null => {
    return this.state.activeWindowId;
  };

  handleOpenFile = async (file: any) => {
    const { windows, nextZIndex } = this.state;
    const { getFileContent } = this.props;

    if (file.type === 'folder' || file.type === 'drive' || file.type === 'root') {
      const newWindow: WindowState = {
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

    if (file.type === 'placeholder' && file.mountable) {
      return;
    }

    const existingWindow = windows.find(w => w.appId === 'notepad' && w.fileId === file.postId);
    if (existingWindow) {
      this.focusWindow(existingWindow.id);
      return;
    }

    let content = '';
    if (file.postId) {
      content = getFileContentById(file.postId);
    } else if (file.path && getFileContent) {
      content = await getFileContent(file.path);
    }

    const newWindow: WindowState = {
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

  handleClose = () => {
    const { activeWindowId } = this.state;
    if (activeWindowId) {
      this.closeWindow(activeWindowId);
    }
  };

  handleNewFile = (_windowId: string) => {
    const { windows, nextZIndex } = this.state;
    
    const newWindow: WindowState = {
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

  handleSaveFile = (windowId: string, content: string) => {
    const { windows } = this.state;
    const newWindows = windows.map(w => 
      w.id === windowId ? { ...w, content } : w
    );
    this.setState({ windows: newWindows });
  };

  updateWindowTitle = (windowId: string, title: string) => {
    const { windows } = this.state;
    const newWindows = windows.map(w => 
      w.id === windowId ? { ...w, title } : w
    );
    this.setState({ windows: newWindows });
  };

  componentDidMount() {
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

  getWindowContent = (win: WindowState) => {
    const { app, path, content, title, id } = win;
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
            onSave={(newContent: string) => this.handleSaveFile(id, newContent)}
            onOpen={() => {}}
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
        {windows.map(win => (
          <Window
            key={win.id}
            window={win}
            isActive={activeWindowId === win.id}
            onFocus={() => this.focusWindow(win.id)}
            onClose={this.closeWindow}
            onMinimize={this.minimizeWindow}
            onMaximize={this.maximizeWindow}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              this.focusWindow(win.id);
            }}
          >
            {this.getWindowContent(win)}
          </Window>
        ))}
      </Container>
    );
  }
}

export interface WindowManagerAPI {
  openWindow: (app: any) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string | null) => void;
  restoreWindow: (windowId: string) => void;
  getWindows: () => WindowState[];
  getActiveWindowId: () => string | null;
}

/**
 * 窗口管理器包装组件（使用Context）
 */
const WindowManagerWrapper = React.forwardRef<WindowManagerAPI>((props, ref) => {
  const fsContext = useFileSystem();
  const [instance, setInstance] = React.useState<WindowManagerInnerInstance | null>(null);

  React.useImperativeHandle(ref, () => ({
    openWindow: (app) => instance?.openWindow(app),
    closeWindow: (windowId) => instance?.closeWindow(windowId),
    focusWindow: (windowId) => instance?.focusWindow(windowId),
    restoreWindow: (windowId) => instance?.restoreWindow(windowId),
    getWindows: () => instance?.getWindows() ?? [],
    getActiveWindowId: () => instance?.getActiveWindowId() ?? null,
  }));

  const handleRef = React.useCallback((inst: WindowManagerInnerInstance | null) => {
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
const WindowManager = React.forwardRef<WindowManagerAPI>((props, ref) => {
  return (
    <FSProvider>
      <WindowManagerWrapper {...props} ref={ref} />
    </FSProvider>
  );
});

WindowManager.displayName = 'WindowManager';

export default WindowManager;
