import React from 'react';
import { ThemeProvider } from "styled-components";
import { MainConfigContext } from 'scripts/app/config/main';
import { Desktop } from './home';


class DesktopApp extends React.PureComponent {
  static contextType = MainConfigContext;
  render() {
    const config = this.context;
    return (
      <ThemeProvider theme={config.theme}>
        <Desktop />
      </ThemeProvider>
    )
  }
};


export default DesktopApp;
