import React from 'react';
import styled from 'styled-components';
import { Button, TitleBar } from '@react95/core';

// 使用 @react95/core 的 TitleBar 组件
const WindowFrame = styled.div<{ isActive: boolean; zIndex: number; minimized: boolean; maximized: boolean }>`
  position: absolute;
  border: 2px solid;
  border-color: ${props => props.isActive ? '#0a246a #ffffff #ffffff #0a246a' : '#000000 #c0c0c0 #c0c0c0 #000000'};
  background: #c0c0c0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  z-index: ${props => props.zIndex};
  display: ${props => props.minimized ? 'none' : 'flex'};
  flex-direction: column;
  width: ${props => props.maximized ? '100vw' : 'auto'};
  height: ${props => props.maximized ? 'calc(100vh - 40px)' : 'auto'};
  top: ${props => props.maximized ? '0' : 'auto'};
  left: ${props => props.maximized ? '0' : 'auto'};
  max-width: ${props => props.maximized ? '100vw' : 'unset'};
  max-height: ${props => props.maximized ? 'calc(100vh - 40px)' : 'unset'};
  transform: ${props => props.maximized ? 'none' : 'none'};
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: auto;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

// 调整手柄（四个角和四条边）
const ResizeHandle = styled.div<{ direction: string; hidden?: boolean }>`
  position: absolute;
  z-index: 100;
  ${props => props.direction.includes('top') ? 'top: 0;' : ''}
  ${props => props.direction.includes('bottom') ? 'bottom: 0;' : ''}
  ${props => props.direction.includes('left') ? 'left: 0;' : ''}
  ${props => props.direction.includes('right') ? 'right: 0;' : ''}
  width: ${props => props.direction === 'top' || props.direction === 'bottom' ? '100%' : `${RESIZE_HANDLE_SIZE}px`};
  height: ${props => props.direction === 'left' || props.direction === 'right' ? '100%' : `${RESIZE_HANDLE_SIZE}px`};
  cursor: ${props => {
    switch(props.direction) {
      case 'top': return 'n-resize';
      case 'bottom': return 's-resize';
      case 'left': return 'w-resize';
      case 'right': return 'e-resize';
      case 'top-left': return 'nwse-resize';
      case 'top-right': return 'nesw-resize';
      case 'bottom-left': return 'nesw-resize';
      case 'bottom-right': return 'nwse-resize';
      default: return 'default';
    }
  }};
  background: ${props => props.hidden ? 'transparent' : 'rgba(0,0,0,0.05)'};
  pointer-events: ${props => props.hidden ? 'none' : 'auto'};
  
  &:hover {
    background: rgba(10, 36, 106, 0.1);
  }
`;

interface WindowState {
  minimized: boolean;
  maximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isResizing: boolean;
  resizeDirection: string | null;
}

interface WindowProps {
  id: string;
  title: string;
  isActive: boolean;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  children: React.ReactNode;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

// 调整手柄的尺寸
const RESIZE_HANDLE_SIZE = 4;
// 最小窗口尺寸
const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;

class Window extends React.Component<WindowProps, WindowState> {
  private dragStartPos: { x: number; y: number } | null = null;
  private startPos: { x: number; y: number } | null = null;
  private startSize: { width: number; height: number } | null = null;

  constructor(props: WindowProps) {
    super(props);
    this.state = {
      minimized: props.isMinimized,
      maximized: props.isMaximized,
      position: props.position || { x: 100, y: 100 },
      size: props.size || { width: 600, height: 400 },
      zIndex: props.zIndex,
      isResizing: false,
      resizeDirection: null,
    };
  }

  static getDerivedStateFromProps(props: WindowProps, state: WindowState): Partial<WindowState> | null {
    const updates: Partial<WindowState> = {};
    let hasChanges = false;

    if (props.isMinimized !== state.minimized) {
      updates.minimized = props.isMinimized;
      hasChanges = true;
    }

    if (props.isMaximized !== state.maximized) {
      updates.maximized = props.isMaximized;
      hasChanges = true;
    }

    if (props.zIndex !== state.zIndex) {
      updates.zIndex = props.zIndex;
      hasChanges = true;
    }

    // 同步位置变化
    if (props.position && props.position.x !== state.position.x && props.position.y !== state.position.y) {
      updates.position = props.position;
      hasChanges = true;
    }

    return hasChanges ? updates : null;
  }

  handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // 只处理左键点击
    this.props.onFocus(this.props.id);
    this.startDrag(e);
  };

  startDrag = (e: React.MouseEvent) => {
    this.dragStartPos = { x: e.clientX, y: e.clientY };
    this.startPos = { ...this.state.position };
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.stopDrag);
  };

  onMouseMove = (e: MouseEvent) => {
    if (!this.dragStartPos || !this.startPos) return;

    const dx = e.clientX - this.dragStartPos.x;
    const dy = e.clientY - this.dragStartPos.y;

    this.setState(prevState => ({
      position: {
        x: Math.max(0, prevState.position.x + dx),
        y: Math.max(0, prevState.position.y + dy)
      }
    }));
  };

  stopDrag = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.stopDrag);
    this.dragStartPos = null;
    this.startPos = null;
  };

  // 调整大小相关方法
  handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
    if (this.state.maximized || e.button !== 0) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    this.props.onFocus(this.props.id);
    
    this.setState({
      isResizing: true,
      resizeDirection: direction,
    });
    
    this.dragStartPos = { x: e.clientX, y: e.clientY };
    this.startSize = { ...this.state.size };
    this.startPos = { ...this.state.position };
    
    document.addEventListener('mousemove', this.onResizeMove);
    document.addEventListener('mouseup', this.stopResize);
  };

  onResizeMove = (e: MouseEvent) => {
    if (!this.state.isResizing || !this.dragStartPos || !this.startSize || !this.startPos) return;

    const dx = e.clientX - this.dragStartPos.x;
    const dy = e.clientY - this.dragStartPos.y;
    const direction = this.state.resizeDirection;

    if (!direction) return;

    let newX = this.startPos.x;
    let newY = this.startPos.y;
    let newWidth = this.startSize.width;
    let newHeight = this.startSize.height;

    // 处理水平方向调整
    if (direction.includes('right')) {
      newWidth = Math.max(MIN_WIDTH, this.startSize.width + dx);
    }
    if (direction.includes('left')) {
      const proposedWidth = this.startSize.width - dx;
      if (proposedWidth >= MIN_WIDTH) {
        newWidth = proposedWidth;
        newX = this.startPos.x + dx;
      } else {
        newX = this.startPos.x + (this.startSize.width - MIN_WIDTH);
        newWidth = MIN_WIDTH;
      }
    }

    // 处理垂直方向调整
    if (direction.includes('bottom')) {
      newHeight = Math.max(MIN_HEIGHT, this.startSize.height + dy);
    }
    if (direction.includes('top')) {
      const proposedHeight = this.startSize.height - dy;
      if (proposedHeight >= MIN_HEIGHT) {
        newHeight = proposedHeight;
        newY = this.startPos.y + dy;
      } else {
        newY = this.startPos.y + (this.startSize.height - MIN_HEIGHT);
        newHeight = MIN_HEIGHT;
      }
    }

    this.setState({
      position: { x: newX, y: newY },
      size: { width: newWidth, height: newHeight },
    });
  };

  stopResize = () => {
    document.removeEventListener('mousemove', this.onResizeMove);
    document.removeEventListener('mouseup', this.stopResize);
    this.setState({
      isResizing: false,
      resizeDirection: null,
    });
    this.dragStartPos = null;
    this.startSize = null;
    this.startPos = null;
  };

  handleClose = () => {
    this.props.onClose(this.props.id);
  };

  handleMinimize = () => {
    this.props.onMinimize(this.props.id);
  };

  handleMaximize = () => {
    this.props.onMaximize(this.props.id);
  };

  render() {
    const { title, isActive, children } = this.props;
    const { position, minimized, maximized, zIndex, size } = this.state;

    if (minimized) return null;

    return (
      <WindowFrame
        isActive={isActive}
        zIndex={zIndex}
        minimized={minimized}
        maximized={maximized}
        style={{
          left: maximized ? 0 : position.x,
          top: maximized ? 0 : position.y,
          width: maximized ? '100vw' : `${size.width}px`,
          height: maximized ? 'calc(100vh - 40px)' : `${size.height}px`,
        }}
      >
        <TitleBar
          active={isActive}
          title={title}
          onMouseDown={this.handleMouseDown}
        >
          <TitleBar.OptionsBox>
            <TitleBar.Minimize onClick={this.handleMinimize} />
            {maximized ? (
              <TitleBar.Restore onClick={this.handleMaximize} />
            ) : (
              <TitleBar.Maximize onClick={this.handleMaximize} />
            )}
            <TitleBar.Close onClick={this.handleClose} />
          </TitleBar.OptionsBox>
        </TitleBar>
        <ContentArea>
          {children}
        </ContentArea>
        
        {/* 调整手柄 - 只在非最大化时显示 */}
        {!maximized && (
          <>
            {/* 四个角 */}
            <ResizeHandle direction="top-left" onMouseDown={this.handleResizeStart('top-left')} />
            <ResizeHandle direction="top-right" onMouseDown={this.handleResizeStart('top-right')} />
            <ResizeHandle direction="bottom-left" onMouseDown={this.handleResizeStart('bottom-left')} />
            <ResizeHandle direction="bottom-right" onMouseDown={this.handleResizeStart('bottom-right')} />
            
            {/* 四条边 */}
            <ResizeHandle direction="top" onMouseDown={this.handleResizeStart('top')} />
            <ResizeHandle direction="bottom" onMouseDown={this.handleResizeStart('bottom')} />
            <ResizeHandle direction="left" onMouseDown={this.handleResizeStart('left')} />
            <ResizeHandle direction="right" onMouseDown={this.handleResizeStart('right')} />
          </>
        )}
      </WindowFrame>
    );
  }
}

export default Window;
export type { WindowState, WindowProps };
