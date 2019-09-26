import React from 'react';
import { ThemeProvider } from "styled-components";
import { AppBar, LogoIcon, Toolbar,  } from 'react95';

import ShortCutContainer from 'scripts/app/components/container/ShortCutContainer';
import TaskBar from './TaskBar';


const DesktopStyles = {
  height: '100%',
}

const Desktop = (props) => {
  const { config } = props;

  return (
    <ThemeProvider theme={config.theme}>

      <div style={{ ...DesktopStyles, background: config.background }}>

        <TaskBar config={config}/>

        <ShortCutContainer apps={config.apps} />

      </div>

    </ThemeProvider>
  )
};


export default Desktop;
