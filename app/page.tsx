import React from 'react';
import { createGlobalStyle } from "styled-components";
// @react95/core v9 全局样式导入
import '@react95/core/GlobalStyle';
import '@react95/core/themes/win95.css';
import Desktop from './desktop';
import MainConfig from './config/main';
import { FSProvider } from './lib/fs/FSContext';

const ResetStyles = createGlobalStyle`
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

const FullScreenStyle: React.CSSProperties = {
  position: 'fixed',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
};

export default function HomePage() {
  return (
    <div className="App" style={FullScreenStyle}>
      <ResetStyles />
      <FSProvider>
        <Desktop config={MainConfig}/>
      </FSProvider>
    </div>
  );
}