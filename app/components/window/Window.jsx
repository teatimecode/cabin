import React from 'react';
import styled from 'styled-components';
import { Window as R95Window, WindowHeader, Button } from 'react95';

const WindowWrapper = styled.div`
  position: absolute;
  user-select: none;
`;

const TitleBarWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  cursor: move;
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
            style={{ display: 'flex', alignItems: 'center', padding: '2px 4px' }}
          >
            <TitleText>{window.title}</TitleText>
            <ButtonGroup>
              <Button onClick={this.handleMinimize} style={{ minWidth: '16px', height: '16px', padding: '0 2px', fontSize: '10px' }}>_</Button>
              <Button onClick={this.handleMaximize} style={{ minWidth: '16px', height: '16px', padding: '0 2px', fontSize: '10px' }}>□</Button>
              <Button onClick={this.handleClose} style={{ minWidth: '16px', height: '16px', padding: '0 2px', fontSize: '10px' }}>×</Button>
            </ButtonGroup>
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
