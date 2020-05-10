import React from 'react';
// import { AppBar, LogoIcon, Toolbar } from 'react95';

import TaskBar from './TaskBar';
import ShortCutContainer from 'scripts/app/components/container/ShortCutContainer';
import { MainConfigContext } from 'scripts/app/config/main';


const DesktopStyles = {
  height: '100%',
}


export class Desktop extends React.PureComponent {
  static contextType = MainConfigContext;
  render() {

    const config = this.context;
    return (
      <div style={{ ...DesktopStyles, background: config.background }}>

        <TaskBar config={config}/>

        <ShortCutContainer apps={config.apps} />

      </div>
    )
  }
}
