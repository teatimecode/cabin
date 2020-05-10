import React from 'react';
import { themes } from 'react95';


/*
  每一个Win95桌面应用有一个主的config，
 */
const MainConfig = {
  theme: themes.default,
  background: 'teal',
  apps: [

  ],

}

export const MainConfigContext = React.createContext(MainConfig);

export default MainConfig;
