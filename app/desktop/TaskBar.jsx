import React from 'react';
import styled from 'styled-components';
import {
  AppBar, Toolbar, Button, List, ListItem, Divider
} from 'react95';

const StartMenuWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const MenuList = styled(List)`
  position: absolute;
  bottom: 100%;
  left: 0;
  min-width: 150px;
`;

/*
  开始菜单
 */
class StartMenu extends React.PureComponent {
  state = {
    open: false
  };

  setOpen = (flag) => {
    this.setState({
      open: flag
    });
  }

  handleClick = () => {
    this.setOpen(!this.state.open);
  }

  handleClose = () => {
    this.setOpen(false);
  }

  render() {
    const { open } = this.state;

    return (
      <StartMenuWrapper>
        <Button onClick={this.handleClick} active={open} style={{ fontWeight: 'bold' }}>
          Start
        </Button>
        {open && (
          <MenuList onClick={this.handleClose}>
            <ListItem>Profile</ListItem>
            <ListItem>My account</ListItem>
            <Divider />
            <ListItem disabled>Logout</ListItem>
          </MenuList>
        )}
      </StartMenuWrapper>
    );
  }
}

/*
  右侧信息栏
 */
const TaskBarInfo = () => {
  return (
    <div style={{ marginRight: '10px' }}>TeaTimeCode</div>
  );
}


/*
  任务栏
 */
const TaskBar = ({ config }) => {
  const { taskBarPosition } = config;

  return (
    <AppBar style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <Toolbar style={{ justifyContent: 'space-between', padding: '2px 4px' }}>

        <StartMenu />

        <TaskBarInfo />

      </Toolbar>
    </AppBar>

  )
};

export default TaskBar;
