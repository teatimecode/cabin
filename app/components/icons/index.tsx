import React, { CSSProperties } from 'react';
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
  User1,
  FileText,
  Brush,
  Logo,
  Shell32136,
} from '@react95/icons';

/**
 * Windows 95 风格图标组件
 * 使用 @react95/icons 官方图标库
 */

type IconSize = 'large' | 'medium' | 'small';

interface SvgIconProps {
  size?: number;
  style?: CSSProperties;
}

// 窗口控制按钮图标
export const MinimizeIcon = ({ size = 10, style = {} }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={style}>
    <rect x="1" y="8" width="8" height="1" fill="currentColor" />
  </svg>
);

export const MaximizeIcon = ({ size = 10, style = {} }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={style}>
    <rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const RestoreIcon = ({ size = 10, style = {} }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={style}>
    <rect x="3" y="1" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1" />
    <rect x="1" y="3" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const CloseIcon = ({ size = 10, style = {} }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={style}>
    <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" />
    <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const UpArrowIcon = ({ size = 12, style = {} }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 12 12" style={style}>
    <polygon points="6,2 10,7 2,7" fill="currentColor" />
  </svg>
);

export const LeftArrowIcon = ({ size = 12, style = {} }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 12 12" style={style}>
    <polygon points="2,6 7,2 7,10" fill="currentColor" />
  </svg>
);

// 图标映射
export const IconMap: Record<string, React.ComponentType<any>> = {
  'my-computer': Computer,
  'folder': Folder,
  'folder-open': FolderOpen,
  'document': FileText,
  'notepad': Notepad,
  'picture': Brush,
  'recycle-bin': RecycleEmpty,
  'recycle-bin-full': RecycleFull,
  'explorer': Explorer100,
  'user': User,
  'windows': User1,
  'logo': Logo,
  'startup': Explorer100,
  'documents': FileText,
  'settings': Settings,
  'help': Help,
  'shutdown': Shell32136,
};

interface GetIconProps {
  size?: IconSize;
  [key: string]: any;
}

// 获取图标组件
export function getIcon(iconName: string, props: GetIconProps = {}): React.ReactElement {
  const IconComponent = IconMap[iconName];

  let variant: '32x32_4' | '22x22_4' | '16x16_4';
  if (props.size === 'large') {
    variant = '32x32_4';
  } else if (props.size === 'medium') {
    variant = '22x22_4';
  } else {
    variant = '16x16_4';
  }
  const { size, ...restProps } = props;

  if (IconComponent) {
    // @ts-ignore - react95 icons have different variant types
    return <IconComponent variant={variant} {...restProps} />;
  }
  // 默认返回 FileText，但只支持 large 和 small
  const defaultVariant = variant === '22x22_4' ? '32x32_4' : variant;
  return <FileText variant={defaultVariant} {...restProps} />;
}

export default IconMap;
