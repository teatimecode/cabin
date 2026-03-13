import React from 'react';
import styled from 'styled-components';
import {
  AppBar, Toolbar, Button, MenuList, MenuListItem, Divider
} from 'react95';

const MenuWrapper = styled.div`
  position: relative;
`;

const DropdownMenu = styled(MenuList)`
  position: absolute;
  bottom: 100%;
  left: 0;
  min-width: 150px;
  margin-bottom: 2px;
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
        <Button 
          onClick={this.handleClick} 
          active={open} 
          style={{ fontWeight: 'bold' }}
        >
          Start
        </Button>
        {open && (
          <DropdownMenu onClick={this.handleClose}>
            <MenuListItem>Profile</MenuListItem>
            <MenuListItem>My account</MenuListItem>
            <Divider />
            <MenuListItem disabled>Logout</MenuListItem>
          </DropdownMenu>
        )}
      </MenuWrapper>
    );
  }
}

/*
  右侧信息栏
 */
const TaskBarInfo = styled.div`
  padding: 0 8px;
`;

/*
  任务栏
 */
const TaskBar = ({ config }) => {
  return (
    <AppBar position="fixed" style={{ bottom: 0, top: 'auto', width: '100%' }}>
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <StartMenu />
        <TaskBarInfo>TeaTimeCode</TaskBarInfo>
      </Toolbar>
    </AppBar>
  )
};

export default TaskBar;
