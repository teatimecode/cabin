// 应用程序配置
// 定义桌面上的应用图标

export const AppType = {
  FOLDER: 'folder',
  NOTEPAD: 'notepad',
  EXPLORER: 'explorer',
};

export default [
  {
    id: 'my-blog',
    name: '我的博客',
    type: AppType.FOLDER,
    iconName: 'folder',
    path: '/my-blog',
  },
  {
    id: 'my-documents',
    name: '我的文档',
    type: AppType.FOLDER,
    iconName: 'folder',
    path: '/my-documents',
  },
  {
    id: 'my-pictures',
    name: '我的图片',
    type: AppType.FOLDER,
    iconName: 'picture',
    path: '/my-pictures',
  },
  {
    id: 'my-computer',
    name: '我的电脑',
    type: AppType.EXPLORER,
    iconName: 'my-computer',
    path: '/',
  },
  {
    id: 'notepad',
    name: '记事本',
    type: AppType.NOTEPAD,
    iconName: 'notepad',
    path: null,
  },
];
