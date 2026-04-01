"use client";

import React from 'react';
import styled from 'styled-components';

import ShortCutContainer from '../components/window/ShortCutContainer';
import WindowManager from '../components/window/WindowManager';
import type { WindowManagerAPI } from 'app/components/window/WindowManager';
import ContextMenu, { type ContextMenuItem } from '../components/window/ContextMenu';
import TaskBar from './TaskBar';
import { FSProvider } from '../lib/fs/FSContext';
import type { AppConfig } from 'app/config/apps';

interface DesktopWrapperProps {
  $background?: string;
}

const DesktopWrapper = styled.div<DesktopWrapperProps>`
  position: relative;
  width: 100%;
  height: calc(100vh - 28px);
  overflow: hidden;
  background: ${(props) => props.$background || '#008080'};
`;

const DesktopContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

const WindowManagerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  pointer-events: none;
  
  > * {
    pointer-events: auto;
  }
`;

interface DesktopProps {
  config: {
    background: string;
    apps: AppConfig[];
  };
}

interface DesktopState {
  isMounted: boolean;
  desktopItems: AppConfig[];
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    items: ContextMenuItem[];
  } | null;
}

class Desktop extends React.Component<DesktopProps, DesktopState> {
  windowManagerRef: WindowManagerAPI | null = null;

  constructor(props: DesktopProps) {
    super(props);
    this.state = {
      isMounted: false,
      desktopItems: [],
      contextMenu: null,
    };
  }

  handleOpenApp = (app: AppConfig) => {
    if (this.windowManagerRef) {
      this.windowManagerRef.openApp(app);
    }
  };

  setWindowManagerRef = (ref: WindowManagerAPI | null) => {
    if (ref !== this.windowManagerRef) {
      this.windowManagerRef = ref;
    }
  };

  componentDidMount() {
    // 确保只在客户端执行
    if (typeof window === 'undefined') {
      return;
    }
    
    this.setState({ isMounted: true });
    
    // 动态导入 StaticFileSystem，避免 SSR 问题
    import('../lib/fs/staticConfig').then(({ StaticFileSystem: importedStaticFS }) => {
      // 类型和存在性检查
      if (!importedStaticFS || typeof importedStaticFS !== 'object') {
        this.setState({ desktopItems: [] });
        return;
      }
      
      // 检查根节点
      const rootNode = importedStaticFS['/'];
      if (!rootNode) {
        this.setState({ desktopItems: [] });
        return;
      }
      
      if (rootNode && rootNode.children) {
        const childIds = Object.keys(rootNode.children);
        
        const desktopItems = childIds.map((childId: string) => {
          const childItem = rootNode.children[childId];
          if (childItem) {
            let iconName = childItem.icon || this.getDefaultIcon(childItem.type);
            
            if (childId === 'recycle-bin') {
              // 检查回收站是否有内容
              const hasItems = childItem.children && Object.keys(childItem.children).length > 0;
              iconName = hasItems ? 'recycle-full' : 'recycle-empty';
            }
            
            return {
              id: childId,
              name: childItem.name,
              type: childItem.type || 'folder',
              iconName: iconName,
              path: `/${childId}`,
            } as AppConfig;
          }
          return null;
        }).filter(Boolean) as AppConfig[];
        
        this.setState({ desktopItems });
      } else {
        this.setState({ desktopItems: [] });
      }
    }).catch(() => {
      this.setState({ desktopItems: [] });
    });
  }

  getDefaultIcon(type?: string): string {
    const iconMap: Record<string, string> = {
      'folder': 'folder',
      'root': 'my-computer',
      'drive': 'drive',
      'placeholder': 'drive-removable',
      'file': 'document',
    };
    return iconMap[type || 'folder'] || 'folder';
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const items: ContextMenuItem[] = [
      {
        label: '刷新',
        onClick: () => window.location.reload(),
      },
      {
        label: '属性',
        onClick: () => alert('桌面属性'),
        disabled: true,
      },
    ];

    this.setState({
      contextMenu: {
        visible: true,
        x: e.clientX,
        y: e.clientY,
        items,
      },
    });
  };

  handleContextMenu = (app: AppConfig, x: number, y: number) => {
    const items: ContextMenuItem[] = [
      {
        label: '打开',
        onClick: () => this.handleOpenApp(app),
      },
      {
        label: '属性',
        onClick: () => alert(`${app.name}\n类型：${app.type}\n路径：${app.path || 'N/A'}`),
        disabled: true, // 待实现
      },
    ];

    this.setState({
      contextMenu: {
        visible: true,
        x,
        y,
        items,
      },
    });
  };

  handleCloseContextMenu = () => {
    this.setState({ contextMenu: null });
  };

  render() {
    const { config } = this.props;
    const { desktopItems, contextMenu } = this.state;

    return (
      <FSProvider>
        <DesktopWrapper $background={config.background}>
          <DesktopContent>
            <ShortCutContainer 
              apps={desktopItems} 
              onOpenApp={this.handleOpenApp}
              onContextMenu={this.handleContextMenu}
            />
          </DesktopContent>
          <WindowManagerContainer>
            <WindowManager ref={this.setWindowManagerRef} />
          </WindowManagerContainer>
          {contextMenu && (
            <ContextMenu
              items={contextMenu.items}
              x={contextMenu.x}
              y={contextMenu.y}
              onClose={this.handleCloseContextMenu}
            />
          )}
          <TaskBar windowManager={this.windowManagerRef} />
        </DesktopWrapper>
      </FSProvider>
    );
  }
}

export default Desktop;