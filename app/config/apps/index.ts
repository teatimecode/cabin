// 应用配置类型定义
export interface AppConfig {
  id: string;
  name: string;
  type: string;
  icon?: string;
  iconName?: string; // 图标名称
  unique?: boolean; // 是否唯一实例
  path?: string; // 可选路径
}

// 预设的应用配置
export const PRESET_APPS: AppConfig[] = [
  {
    id: 'explorer',
    name: '资源管理器',
    type: 'explorer',
    iconName: 'explorer',
    unique: false,
  },
  {
    id: 'notepad',
    name: '记事本',
    type: 'notepad',
    iconName: 'notepad',
    unique: false,
  },
  {
    id: 'my-computer',
    name: '我的电脑',
    type: 'root',
    iconName: 'my-computer',
    unique: true,
  },
  {
    id: 'blog',
    name: '我的博客',
    type: 'blog',
    iconName: 'blog',
    unique: true,
  },
];

// 动态应用生成器
export const useDynamicApps = (): AppConfig[] => {
  // 基于文件系统内容动态生成应用列表
  // 这里可以根据实际情况扩展
  const dynamicApps: AppConfig[] = [];
  
  return [...PRESET_APPS, ...dynamicApps];
};

// 应用程序配置类型键
export type AppTypeKey = 'FOLDER' | 'NOTEPAD' | 'EXPLORER' | 'BLOG';

// 应用程序类型映射
export const AppType: Record<AppTypeKey, string> = {
  FOLDER: 'folder',
  NOTEPAD: 'notepad',
  EXPLORER: 'explorer',
  BLOG: 'blog',
};

// 桌面应用程序配置（保留向后兼容）
const apps: AppConfig[] = [
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