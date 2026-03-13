import React from 'react';
import styled from 'styled-components';
import { Window as R95Window, WindowHeader, WindowContent, Button } from 'react95';

const WindowWrapper = styled.div`
  position: absolute;
  user-select: none;
`;

const TitleText = styled.span`
  flex: 1;
  padding: 2px 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 2px;
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
    const { onFocus } = this.props;
    if (onFocus) onFocus();

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

  render() {
    const { window, children, isActive } = this.props;
    const { position, size } = this.state;

    return (
      <WindowWrapper
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          zIndex: window.zIndex || 1,
        }}
      >
        <R95Window
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <WindowHeader
            className="title-bar"
            onMouseDown={this.handleMouseDown}
            active={isActive}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <TitleText>{window.title}</TitleText>
            <ButtonGroup>
              <Button size="sm" square onClick={this.handleMinimize}>_</Button>
              <Button size="sm" square onClick={this.handleMaximize}>□</Button>
              <Button size="sm" square onClick={this.handleClose}>×</Button>
            </ButtonGroup>
          </WindowHeader>
          <WindowContent style={{ flex: 1, overflow: 'hidden', padding: 0 }}>
            {children}
          </WindowContent>
        </R95Window>
        <ResizeHandle
          ref={this.resizeHandleRef}
          onMouseDown={this.handleResizeStart}
        />
      </WindowWrapper>
    );
  }
}

export default Window;
