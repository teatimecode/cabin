import original from 'react95/dist/themes/original.js';
import AppsConfig, { AppConfig } from '../apps';

export interface MainConfigType {
  theme: object;
  background: string;
  taskBarPosition: 'bottom' | 'top';
  apps: AppConfig[];
}

/*
  每一个Win95桌面应用有一个主的config，
*/
const MainConfig: MainConfigType = {
  theme: original,
  background: 'teal',
  taskBarPosition: 'bottom',
  apps: AppsConfig,
};

export default MainConfig;
