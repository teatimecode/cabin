// 应用程序配置
// 定义桌面上的应用图标

export const AppType = {
  FOLDER: 'folder',
  NOTEPAD: 'notepad',
  EXPLORER: 'explorer',
  BLOG: 'blog',
};

const apps = [
  {
    id: 'explorer',
    name: '文件资源管理器',
    type: AppType.EXPLORER,
    iconName: 'explorer',
    path: '/my-computer/c-drive',
  },
  {
    id: 'notepad',
    name: '记事本',
    type: AppType.NOTEPAD,
    iconName: 'notepad',
  },
  {
    id: 'blog',
    name: '我的博客',
    type: AppType.BLOG,
    iconName: 'blog',
    path: '/my-blog',
  },
  {
    id: 'documents',
    name: '我的文档',
    type: AppType.FOLDER,
    iconName: 'folder',
    path: '/my-documents',
  },
  {
    id: 'pictures',
    name: '我的图片',
    type: AppType.FOLDER,
    iconName: 'folder',
    path: '/my-pictures',
  },
  {
    id: 'computer',
    name: '我的电脑',
    type: AppType.FOLDER,
    iconName: 'c-drive',
    path: '/my-computer',
  },
  {
    id: 'recycle',
    name: '回收站',
    type: AppType.FOLDER,
    iconName: 'recycle',
    path: '/recycle-bin',
  },
  {
    id: 'removable',
    name: '可移动磁盘',
    type: AppType.FOLDER,
    iconName: 'removable',
    path: '/removable',
  },
];

export default apps;