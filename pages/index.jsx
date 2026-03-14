import React from "react";
import { createGlobalStyle } from "styled-components";
import { styleReset } from "react95";
import Desktop from 'app/desktop';
import MainConfig from 'app/config/main';

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

export default props =>
  <div className="App" style={FullScreenStyle}>
    <ResetStyles />
    <Desktop config={MainConfig}/>
  </div>
