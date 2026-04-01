import React from 'react';
import styled from 'styled-components';
import AppIcon from '../app/AppIcon';
import { AppConfig } from '../../config/apps';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px;
  padding: 8px;
  height: 100%;
  overflow: auto;
  width: fit-content;
  max-width: 100%;
`;

interface ShortCutContainerProps {
  apps: AppConfig[];
  onOpenApp: (app: AppConfig) => void;
  onContextMenu?: (app: AppConfig, x: number, y: number) => void;
}

class ShortCutContainer extends React.PureComponent<ShortCutContainerProps> {
  handleOpenApp = (app: AppConfig) => {
    this.props.onOpenApp(app);
  };

  render() {
    const { apps, onContextMenu } = this.props;

    return (
      <Container>
        {apps.map(app => (
          <AppIcon
            key={app.id}
            app={app}
            onOpen={this.handleOpenApp}
            onContextMenu={onContextMenu}
          />
        ))}
      </Container>
    );
  }
}

export default ShortCutContainer;