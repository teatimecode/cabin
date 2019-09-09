import React from 'react';
import {
  AppBar, Toolbar, Button, List, ListItem, Divider
} from 'react95';

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
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {open && (
          <List horizontalAlign="left" verticalAlign="bottom" open={open} onClick={this.handleClose}>
            <ListItem>👨‍💻 Profile</ListItem>
            <ListItem>📁 My account</ListItem>
            <Divider />
            <ListItem disabled>🔙 Logout</ListItem>
          </List>
        )}
        <Button onClick={this.handleClick} active={open} style={{ fontWeight: 'bold' }}>
          Start
        </Button>
      </div>
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
    <AppBar>
      <Toolbar style={{ justifyContent: 'space-between' }}>

        <StartMenu />

        <TaskBarInfo />

      </Toolbar>
    </AppBar>

  )
};

export default TaskBar;
