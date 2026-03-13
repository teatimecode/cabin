import React from 'react';
// 导入 React95 官方图标
import '@react95/icons/icons.css';
import {
  Computer,
  Folder,
  FolderOpen,
  Notepad,
  RecycleEmpty,
  RecycleFull,
  Settings,
  Help,
  Explorer100,
  User,
  FileText,
  Brush,
  Logo,
  Shell32136,
} from '@react95/icons';

/**
 * Windows 95 风格图标组件
 * 使用 @react95/icons 官方图标库
 */

// 图标映射
export const IconMap = {
  'my-computer': Computer,
  'folder': Folder,
  'folder-open': FolderOpen,
  'document': FileText,
  'notepad': Notepad,
  'picture': Brush, // 使用 Brush 图标
  'recycle-bin': RecycleEmpty,
  'recycle-bin-full': RecycleFull,
  'explorer': Explorer100,
  'user': User,
  'windows': Logo, // Windows Logo 图标
  // 开始菜单图标
  'startup': Explorer100,
  'documents': FileText,
  'settings': Settings,
  'help': Help,
  'shutdown': Shell32136, // 关机图标
};

// 获取图标组件
// size: 'large' (32x32) 或 'small' (16x16)
export function getIcon(iconName, props = {}) {
  const IconComponent = IconMap[iconName];
  
  // 根据 size 参数设置 variant
  const variant = props.size === 'large' ? '32x32_4' : '16x16_4';
  const { size, ...restProps } = props;
  
  if (IconComponent) {
    return <IconComponent variant={variant} {...restProps} />;
  }
  // 默认返回文档图标
  return <FileText variant={variant} {...restProps} />;
}

export default IconMap;
