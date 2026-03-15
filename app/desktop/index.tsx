import React from 'react';
import styled from 'styled-components';
import { ThemeProvider } from "styled-components";

import ShortCutContainer from 'app/components/window/ShortCutContainer';
import WindowManager from 'app/components/window/WindowManager';
import type { WindowManagerAPI } from 'app/components/window/WindowManager';
import TaskBar from './TaskBar';
import { FSProvider } from 'app/lib/fs/FSContext';
import { StaticFileSystem } from 'app/lib/fs/staticConfig';
import type { AppConfig } from 'app/config/apps';

const DesktopWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 28px;
  overflow: hidden;
`;

interface DesktopProps {
  config: {
    theme: object;
    background: string;
    apps: AppConfig[];
  };
}

interface DesktopState {
  isMounted: boolean;
  desktopItems: AppConfig[];
}

class Desktop extends React.Component<DesktopProps, DesktopState> {
  windowManagerRef: WindowManagerAPI | null = null;

  constructor(props: DesktopProps) {
    super(props);
    this.state = {
      isMounted: false,
      desktopItems: [],
    };
  }

  handleOpenApp = (app: AppConfig) => {
    if (this.windowManagerRef && this.state.isMounted) {
      this.windowManagerRef.openWindow(app);
    }
  };

  setWindowManagerRef = (ref: WindowManagerAPI | null) => {
    if (ref !== this.windowManagerRef) {
      this.windowManagerRef = ref;
    }
  };

  componentDidMount() {
    this.setState({ isMounted: true });
    
    const rootNode = StaticFileSystem['/'];
    if (rootNode && rootNode.children) {
      const desktopItems = rootNode.children.map((childId: string) => {
        const childPath = `/${childId}`;
        const childItem = StaticFileSystem[childPath];
        if (childItem) {
          return {
            id: childId,
            name: childItem.name,
            type: childItem.type,
            iconName: childItem.icon,
            path: childPath,
          } as AppConfig;
        }
        return null;
      }).filter(Boolean) as AppConfig[];
      
      this.setState({ desktopItems });
    }
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  render() {
    const { config } = this.props;
    const { desktopItems } = this.state;

    return (
      <ThemeProvider theme={config.theme}>
        <FSProvider>
          <DesktopWrapper style={{ background: config.background }}>
            <WindowManager
              ref={this.setWindowManagerRef}
            />
            <ShortCutContainer
              apps={desktopItems}
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
