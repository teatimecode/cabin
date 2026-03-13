import React from 'react';
import { ThemeProvider } from "styled-components";
import { AppBar } from 'react95';

import ShortCutContainer from 'app/components/window/ShortCutContainer';
import WindowManager from 'app/components/window/WindowManager';
import TaskBar from './TaskBar';


const DesktopStyles = {
  height: '100%',
}

class Desktop extends React.Component {
  state = {
    windowManagerRef: null,
  };

  handleOpenApp = (app) => {
    const { windowManagerRef } = this.state;
    if (windowManagerRef) {
      windowManagerRef.openWindow(app);
    }
  };

  render() {
    const { config } = this.props;

    return (
      <ThemeProvider theme={config.theme}>

        <div style={{ ...DesktopStyles, background: config.background }}>
          <WindowManager
            ref={(ref) => this.setState({ windowManagerRef: ref })}
          />

          <ShortCutContainer
            apps={config.apps}
            onOpenApp={this.handleOpenApp}
          />

          <TaskBar config={config} />

        </div>

      </ThemeProvider>
    )
  };
}


export default Desktop;
