import React from 'react';
import styled from 'styled-components';
import {
  AppBar, Toolbar, Button, MenuList, MenuListItem, Separator
} from 'react95';
import { ScrollView } from 'react95';
import { getIcon } from '../components/icons';

const MenuWrapper = styled.div`
  position: relative;
`;

const DropdownMenu = styled(MenuList)`
  position: absolute;
  bottom: 100%;
  left: 0;
  min-width: 180px;
  margin-bottom: 2px;
`;

const StartButton = styled(Button)`
  font-weight: bold;
  font-size: 12px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const WindowButton = styled(Button)`
  font-size: 11px;
  padding: 0 8px;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const WindowButtonsContainer = styled.div`
  display: flex;
  flex: 1;
  margin-left: 4px;
  gap: 2px;
  overflow: hidden;
`;

const ClockArea = styled(ScrollView)`
  padding: 2px 8px;
  background: #c0c0c0;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
`;

const DividerLine = styled.div`
  width: 2px;
  height: 22px;
  background: linear-gradient(to right, #808080, #fff);
  margin: 0 4px;
`;

/*
  开始菜单
*/
class StartMenu extends React.PureComponent {
  state = {
    open: false
  };

  handleClick = () => {
    this.setState(prev => ({ open: !prev.open }));
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  render() {
    const { open } = this.state;

    return (
      <MenuWrapper>
        <StartButton 
          onClick={this.handleClick} 
          active={open}
        >
          {getIcon('windows', { size: 'medium' })}
          开始
        </StartButton>
        {open && (
          <DropdownMenu onClick={this.handleClose}>
            <MenuListItem>
              <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>{getIcon('startup')}</span>
              程序
            </MenuListItem>
            <MenuListItem>
              <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>{getIcon('documents')}</span>
              文档
            </MenuListItem>
            <MenuListItem>
              <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>{getIcon('settings')}</span>
              设置
            </MenuListItem>
            <Separator />
            <MenuListItem>
              <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>{getIcon('help')}</span>
              帮助
            </MenuListItem>
            <Separator />
            <MenuListItem>
              <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>{getIcon('shutdown')}</span>
              关机
            </MenuListItem>
          </DropdownMenu>
        )}
      </MenuWrapper>
    );
  }
}

/*
  时钟组件
*/
class Clock extends React.PureComponent {
  state = {
    time: new Date()
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ time: new Date() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { time } = this.state;
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    
    return (
      <ClockArea>
        {hours}:{minutes}
      </ClockArea>
    );
  }
}

/*
  任务栏
*/
class TaskBar extends React.PureComponent {
  state = {
    windows: [],
    activeWindowId: null,
  };

  componentDidMount() {
    // 定期从 WindowManager 获取窗口状态
    this.updateInterval = setInterval(() => {
      const { windowManager } = this.props;
      if (windowManager) {
        const windows = windowManager.getWindows();
        const activeWindowId = windowManager.getActiveWindowId();
        this.setState({ windows, activeWindowId });
      }
    }, 100);
  }

  componentWillUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  handleWindowClick = (window) => {
    const { windowManager } = this.props;
    if (windowManager) {
      if (window.isMinimized) {
        // 如果窗口已最小化，恢复它
        windowManager.restoreWindow(window.id);
      } else {
        // 否则聚焦窗口
        windowManager.focusWindow(window.id);
      }
    }
  };

  render() {
    const { config } = this.props;
    const { windows, activeWindowId } = this.state;

    return (
      <AppBar position="fixed" style={{ bottom: 0, top: 'auto', width: '100%' }}>
        <Toolbar style={{ justifyContent: 'space-between', padding: '2px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <StartMenu />
            <WindowButtonsContainer>
              {windows.map(window => (
                <WindowButton
                  key={window.id}
                  active={activeWindowId === window.id && !window.isMinimized}
                  onClick={() => this.handleWindowClick(window)}
                >
                  {getIcon(window.icon || 'folder', { size: 'small' })}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {window.title}
                  </span>
                </WindowButton>
              ))}
            </WindowButtonsContainer>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DividerLine />
            <Clock />
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TaskBar;
