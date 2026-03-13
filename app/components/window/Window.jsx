import React from 'react';
import styled from 'styled-components';
import { Window as R95Window, WindowHeader, WindowContent, Button } from 'react95';
import { MinimizeIcon, MaximizeIcon, RestoreIcon, CloseIcon } from '../icons';

const WindowWrapper = styled.div`
  position: absolute;
  user-select: none;
  display: ${props => props.$isMinimized ? 'none' : 'block'};
`;

const StyledWindow = styled(R95Window)`
  & > article {
    padding: 2px;
  }
`;

const StyledWindowHeader = styled(WindowHeader)`
  padding: 2px 4px;
  min-height: 20px;
  
  & > * {
    font-size: 12px;
  }
`;

const TitleText = styled.span`
  flex: 1;
  padding: 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 2px;
`;

const SmallButton = styled(Button)`
  min-width: 16px;
  width: 16px;
  height: 14px;
  padding: 0;
  font-size: 10px;
  font-weight: normal;
`;

const ResizeHandle = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  z-index: 10;
  
  /* 像素风格的 resize 手柄 */
  &::after {
    content: '';
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 8px;
    height: 8px;
    background: linear-gradient(
      135deg,
      #808080 25%,
      #c0c0c0 25%,
      #c0c0c0 50%,
      #808080 50%,
      #808080 75%,
      #c0c0c0 75%
    );
    background-size: 4px 4px;
  }
`;

class Window extends React.PureComponent {
  constructor(props) {
    super(props);
    this.resizeHandleRef = React.createRef();
  }

  state = {
    position: { x: 50, y: 50 },
    size: { width: 600, height: 400 },
    restorePosition: null,
    restoreSize: null,
    isDragging: false,
    isResizing: false,
    dragOffset: { x: 0, y: 0 },
    resizeStart: { x: 0, y: 0, width: 0, height: 0 },
  };

  componentDidMount() {
    // 使用 React95 内置的 resize 功能
    if (this.resizeHandleRef.current) {
      this.resizeHandleRef.current.addEventListener('mousedown', this.handleResizeStart);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('mousemove', this.handleResizeMove);
    document.removeEventListener('mouseup', this.handleResizeEnd);
    if (this.resizeHandleRef.current) {
      this.resizeHandleRef.current.removeEventListener('mousedown', this.handleResizeStart);
    }
  }

  handleMouseDown = (e) => {
    const { onFocus, window } = this.props;
    if (onFocus) onFocus();

    // 如果窗口已最大化，不允许拖动
    if (window.isMaximized) return;

    // 检查是否点击的是标题栏（非按钮区域）
    if (e.target.closest('.title-bar') && !e.target.closest('button')) {
      this.setState({
        isDragging: true,
        dragOffset: {
          x: e.clientX - this.state.position.x,
          y: e.clientY - this.state.position.y,
        },
      });

      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    }
  };

  handleMouseMove = (e) => {
    const { isDragging, dragOffset } = this.state;
    if (isDragging) {
      this.setState({
        position: {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        },
      });
    }
  };

  handleMouseUp = () => {
    this.setState({ isDragging: false });
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { window } = this.props;
    // 如果窗口已最大化，不允许调整大小
    if (window.isMaximized) return;

    const { size } = this.state;
    this.setState({
      isResizing: true,
      resizeStart: {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
      },
    });

    document.addEventListener('mousemove', this.handleResizeMove);
    document.addEventListener('mouseup', this.handleResizeEnd);
  };

  handleResizeMove = (e) => {
    const { isResizing, resizeStart } = this.state;
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(300, resizeStart.width + deltaX);
      const newHeight = Math.max(200, resizeStart.height + deltaY);
      
      this.setState({
        size: {
          width: newWidth,
          height: newHeight,
        },
      });
    }
  };

  handleResizeEnd = () => {
    this.setState({ isResizing: false });
    document.removeEventListener('mousemove', this.handleResizeMove);
    document.removeEventListener('mouseup', this.handleResizeEnd);
  };

  handleClose = () => {
    const { window, onClose } = this.props;
    if (onClose) onClose(window.id);
  };

  handleMinimize = () => {
    const { window, onMinimize } = this.props;
    if (onMinimize) onMinimize(window.id);
  };

  handleMaximize = () => {
    const { window, onMaximize } = this.props;
    if (onMaximize) onMaximize(window.id);
  };

  // 双击标题栏最大化/还原
  handleTitleDoubleClick = () => {
    this.handleMaximize();
  };

  render() {
    const { window, children, isActive } = this.props;
    const { position, size } = this.state;
    const { isMinimized, isMaximized } = window;

    // 计算窗口位置和大小
    let windowStyle = {
      left: position.x,
      top: position.y,
      width: size.width,
      height: size.height,
      zIndex: window.zIndex || 1,
    };

    // 最大化时占满整个桌面区域（不包括任务栏）
    if (isMaximized) {
      windowStyle = {
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: window.zIndex || 1,
      };
    }

    return (
      <WindowWrapper
        $isMinimized={isMinimized}
        style={windowStyle}
      >
        <StyledWindow
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <StyledWindowHeader
            className="title-bar"
            onMouseDown={this.handleMouseDown}
            onDoubleClick={this.handleTitleDoubleClick}
            active={isActive}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <TitleText>{window.title}</TitleText>
            <ButtonGroup>
              <SmallButton onClick={this.handleMinimize}>
                <MinimizeIcon size={8} />
              </SmallButton>
              <SmallButton onClick={this.handleMaximize}>
                {isMaximized ? <RestoreIcon size={8} /> : <MaximizeIcon size={8} />}
              </SmallButton>
              <SmallButton onClick={this.handleClose}>
                <CloseIcon size={8} />
              </SmallButton>
            </ButtonGroup>
          </StyledWindowHeader>
          <WindowContent style={{ flex: 1, overflow: 'hidden', padding: 0 }}>
            {children}
          </WindowContent>
        </StyledWindow>
        {!isMaximized && (
          <ResizeHandle
            ref={this.resizeHandleRef}
            onMouseDown={this.handleResizeStart}
          />
        )}
      </WindowWrapper>
    );
  }
}

export default Window;
