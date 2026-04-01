import AppsConfig, { AppConfig } from '../apps';

export interface MainConfigType {
  background: string;
  taskBarPosition: 'bottom' | 'top';
  apps: AppConfig[];
}

/*
  每一个 Win95 桌面应用有一个主的 config，
  注意：@react95/core v9 不再需要 theme 对象，改用 CSS 导入
*/
const MainConfig: MainConfigType = {
  background: 'teal',
  taskBarPosition: 'bottom',
  apps: AppsConfig,
};

export default MainConfig;
