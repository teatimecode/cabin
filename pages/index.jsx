import React from 'react';
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { styleReset } from "react95";
import Desktop from 'app/desktop';
import MainConfig from 'app/config/main';
import { FSProvider } from 'app/lib/fs/FSContext';

const ResetStyles = createGlobalStyle`
  ${styleReset}
  
  * {
    box-sizing: border-box;
  }
  
  html, body, #__next {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;

const FullScreenStyle = {
  position: 'fixed',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
};

const HomePage = (props) => (
  <div className="App" style={FullScreenStyle}>
    <ResetStyles />
    <ThemeProvider theme={MainConfig.theme}>
      <FSProvider>
        <Desktop config={MainConfig}/>
      </FSProvider>
    </ThemeProvider>
  </div>
);

HomePage.displayName = 'HomePage';

export default HomePage;