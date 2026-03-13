import React from 'react';
import styled from 'styled-components';
import AppIcon from '../app/AppIcon';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 8px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px;
`;

class ShortCutContainer extends React.PureComponent {
  state = {
    selectedAppId: null,
  };

  handleSelect = (app, isMultiSelect) => {
    this.setState({ selectedAppId: app.id });
  };

  handleOpen = (app) => {
    const { onOpenApp } = this.props;
    if (onOpenApp) {
      onOpenApp(app);
    }
  };

  render() {
    const { apps } = this.props;
    const { selectedAppId } = this.state;

    if (!apps || apps.length === 0) {
      return <Container />;
    }

    return (
      <Container>
        {apps.map(app => (
          <AppIcon
            key={app.id}
            app={app}
            selected={selectedAppId === app.id}
            onSelect={this.handleSelect}
            onOpen={this.handleOpen}
          />
        ))}
      </Container>
    );
  }
}

export default ShortCutContainer;
