import React from 'react';
import styled from 'styled-components';
import { ThemeProvider } from "styled-components";
import PropTypes from 'prop-types';

import ShortCutContainer from 'app/components/window/ShortCutContainer';
import WindowManager from 'app/components/window/WindowManager';
import TaskBar from './TaskBar';
import { FSProvider } from 'app/lib/fs/FSContext';

const DesktopWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 28px;
  overflow: hidden;
`;

class Desktop extends React.Component {
  static propTypes = {
    config: PropTypes.shape({
      theme: PropTypes.object.isRequired,
      background: PropTypes.string.isRequired,
      apps: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
    };
    // 将 windowManagerRef 作为实例属性而不是状态
    this.windowManagerRef = null;
  }

  handleOpenApp = (app) => {
    if (this.windowManagerRef && this.state.isMounted) {
      this.windowManagerRef.openWindow(app);
    }
  };

  setWindowManagerRef = (ref) => {
    // 只有当ref真正改变时才更新
    if (ref !== this.windowManagerRef) {
      this.windowManagerRef = ref;
    }
  };

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  componentWillUnmount() {
    this.setState({ isMounted: false }); // 组件即将卸载时设置为false
  }

  render() {
    const { config } = this.props;

    return (
      <ThemeProvider theme={config.theme}>
        <FSProvider>
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
            windowManager={this.windowManagerRef}
          />
        </FSProvider>
      </ThemeProvider>
    );
  }
}


export default Desktop;