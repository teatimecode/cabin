import React from 'react';
import styled from 'styled-components';
import {
  AppBar, Toolbar, Button, MenuList, MenuListItem, Divider
} from 'react95';
import { Cutout } from 'react95';

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
  
  &::before {
    content: '🪟';
    margin-right: 4px;
  }
`;

const ClockArea = styled(Cutout)`
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
          开始
        </StartButton>
        {open && (
          <DropdownMenu onClick={this.handleClose}>
            <MenuListItem>
              <span style={{ marginRight: 8 }}>📝</span>
              程序
            </MenuListItem>
            <MenuListItem>
              <span style={{ marginRight: 8 }}>📄</span>
              文档
            </MenuListItem>
            <MenuListItem>
              <span style={{ marginRight: 8 }}>⚙️</span>
              设置
            </MenuListItem>
            <Divider />
            <MenuListItem>
              <span style={{ marginRight: 8 }}>❓</span>
              帮助
            </MenuListItem>
            <Divider />
            <MenuListItem>
              <span style={{ marginRight: 8 }}>🔌</span>
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
const TaskBar = ({ config }) => {
  return (
    <AppBar position="fixed" style={{ bottom: 0, top: 'auto', width: '100%' }}>
      <Toolbar style={{ justifyContent: 'space-between', padding: '2px 4px' }}>
        <StartMenu />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DividerLine />
          <Clock />
        </div>
      </Toolbar>
    </AppBar>
  )
};

export default TaskBar;
