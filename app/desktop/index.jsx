import React from 'react';
import styled from 'styled-components';
import { ThemeProvider } from "styled-components";

import ShortCutContainer from 'app/components/window/ShortCutContainer';
import WindowManager from 'app/components/window/WindowManager';
import TaskBar from './TaskBar';

const DesktopWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 28px;
  overflow: hidden;
`;

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

  setWindowManagerRef = (ref) => {
    this.setState({ windowManagerRef: ref });
  };

  render() {
    const { config } = this.props;
    const { windowManagerRef } = this.state;

    return (
      <ThemeProvider theme={config.theme}>
        <DesktopWrapper style={{ background: config.background }}>
          <WindowManager
            ref={this.setWindowManagerRef}
          />
          <ShortCutContainer
            apps={config.apps}
            onOpenApp={this.handleOpenApp}
          />
        </DesktopWrapper>
        <TaskBar 
          config={config} 
          windowManager={windowManagerRef}
        />
      </ThemeProvider>
    )
  };
}


export default Desktop;
