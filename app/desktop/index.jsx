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
    isMounted: true, // 添加挂载状态标记
  };

  handleOpenApp = (app) => {
    const { windowManagerRef } = this.state;
    if (windowManagerRef) {
      windowManagerRef.openWindow(app);
    }
  };

  setWindowManagerRef = (ref) => {
    // 只在组件挂载时更新状态
    if (this.state.isMounted) {
      this.setState({ windowManagerRef: ref });
    }
  };

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

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
