import React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { reset } from "react95";
import Desktop from 'app/desktop';
import MainConfig from 'app/config/main';

const ResetStyles = createGlobalStyle`
  ${reset}
`;

const FullScreenStyle = {
  position: 'absolute',
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
