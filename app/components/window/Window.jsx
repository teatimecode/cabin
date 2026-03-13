import React from 'react';
import styled from 'styled-components';
import { Window as R95Window, WindowHeader, Button } from 'react95';

const WindowWrapper = styled.div`
  position: absolute;
  user-select: none;
`;

class Window extends React.PureComponent {
  state = {
    position: { x: 50, y: 50 },
    size: { width: 600, height: 400 },
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
  };

  handleMouseDown = (e) => {
    const { onFocus } = this.props;
    if (onFocus) onFocus();

    // 检查是否点击的是标题栏（非按钮区域）
    if (e.target.closest('.title-bar')) {
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
          >
            <span style={{ flex: 1, padding: '2px 4px' }}>{window.title}</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              <Button onClick={this.handleMinimize} style={{ minWidth: '20px', padding: '2px' }}>─</Button>
              <Button onClick={this.handleMaximize} style={{ minWidth: '20px', padding: '2px' }}>□</Button>
              <Button onClick={this.handleClose} style={{ minWidth: '20px', padding: '2px' }}>×</Button>
            </div>
          </WindowHeader>
          <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
            {children}
          </div>
        </R95Window>
      </WindowWrapper>
    );
  }
}

export default Window;
