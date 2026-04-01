/**
 * 图标组件库 - 基于 @react95/icons
 * 
 * 提供统一的图标接口和尺寸管理
 * 所有图标均来自 @react95/icons 包，确保 Windows 95 风格一致性
 */

import React from 'react';
import styled from 'styled-components';

// 从 @react95/icons 导入真实图标组件
// 注意：@react95/icons v2.2.0 导出的是命名导出
import { 
  Computer,
  Folder,
  FolderOpen,
  FileText as Document,
  Notepad,
  Explorer100 as Explorer,
  Help,
  Settings,
  PowerOff as Shutdown,
  Close,
  ArrowLeft,
  Back,
  ReaderDisket as Drive,
  CdExe as DriveRemovable,
  RecycleEmpty,
  RecycleFull,
  User1,
} from '@react95/icons';

// 定义可用的图标名称类型
export type IconName = 
  | 'close'
  | 'arrow-left'
  | 'back'
  | 'folder'
  | 'folder-open'
  | 'my-computer'
  | 'notepad'
  | 'document'
  | 'explorer'
  | 'help'
  | 'settings'
  | 'drive'
  | 'drive-removable'
  | 'minimize'
  | 'restore'
  | 'maximize'
  | 'startup'
  | 'shutdown'
  | 'blog'
  | 'picture'
  | 'recycle-bin'
  | 'recycle-empty'
  | 'recycle-full'
  | 'removable'
  | 'user1';

// 定义图标尺寸类型
export type IconSize = 'small' | 'medium' | 'large';

// 尺寸映射到像素值
const sizeMap: Record<IconSize, number> = {
  small: 16,
  medium: 24,
  large: 32,
};

// 根据尺寸选择 variant
const getVariant = (size: IconSize): '16x16_4' | '32x32_4' => {
  return size === 'small' ? '16x16_4' : '32x32_4';
};

// 图标容器样式
const StyledIconContainer = styled.div<{ size: IconSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => sizeMap[props.size]}px;
  height: ${props => sizeMap[props.size]}px;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

interface GetIconOptions {
  size?: IconSize;
  style?: React.CSSProperties;
}

/**
 * 获取指定名称的图标组件
 * @param name 图标名称
 * @param options 图标选项（尺寸、样式等）
 * @returns React 图标组件
 */
export function getIcon(name: IconName, options?: GetIconOptions) {
  const size = options?.size || 'medium';
  const style = options?.style || {};
  const variant = getVariant(size);

  // 图标渲染函数映射 - 根据各图标支持的 variant 分别处理
  const iconRenderers: Record<IconName, () => React.ReactNode> = {
    'close': () => <Close variant="16x16_4" />,
    'arrow-left': () => <ArrowLeft variant="32x32_4" />, // ArrowLeft 只支持 32x32_4
    'back': () => <Back variant="16x16_4" />, // Back 只支持 16x16_4
    'folder': () => <Folder {...{ variant }} />,
    'folder-open': () => <FolderOpen {...{ variant }} />,
    'my-computer': () => <Computer {...{ variant }} />,
    'notepad': () => <Notepad {...{ variant }} />,
    'document': () => <Document {...{ variant }} />,
    'explorer': () => <Explorer {...{ variant }} />,
    'help': () => <Help variant="16x16_4" />, // Help 只支持 16x16_4
    'settings': () => <Settings {...{ variant }} />,
    'drive': () => <Drive {...{ variant }} />,
    'drive-removable': () => <DriveRemovable variant="32x32_4" />, // DriveRemovable 只支持 32x32_4
    'minimize': () => <span style={{ fontSize: `${sizeMap[size] * 0.6}px`, fontWeight: 'bold' }}>−</span>,
    'restore': () => <span style={{ fontSize: `${sizeMap[size] * 0.6}px` }}>❐</span>,
    'maximize': () => <span style={{ fontSize: `${sizeMap[size] * 0.6}px` }}>□</span>,
    'startup': () => <Folder {...{ variant }} />,
    'shutdown': () => <Shutdown {...{ variant }} />,
    'blog': () => <Document {...{ variant }} />,
    'picture': () => <Folder {...{ variant }} />, // 使用 folder 图标代替
    'recycle-bin': () => <RecycleEmpty {...{ variant }} />, // 默认使用空回收站
    'recycle-empty': () => <RecycleEmpty {...{ variant }} />,
    'recycle-full': () => <RecycleFull {...{ variant }} />,
    'removable': () => <DriveRemovable variant="32x32_4" />,
    'user1': () => <User1 {...{ variant }} />,
  };

  const IconRenderer = iconRenderers[name];
  
  if (!IconRenderer) {
    // 如果图标不存在，回退到 document 图标
    // eslint-disable-next-line no-console
    console.warn(`Icon "${name}" not found, falling back to document icon`);
    return (
      <StyledIconContainer size={size} style={style}>
        <Document {...{ variant }} />
      </StyledIconContainer>
    );
  }

  return (
    <StyledIconContainer size={size} style={style}>
      {IconRenderer()}
    </StyledIconContainer>
  );
}

// 导出原始图标组件供直接使用
export {
  Computer,
  Folder,
  FolderOpen,
  Document,
  Notepad,
  Explorer,
  Help,
  Settings,
  Shutdown,
  Close,
  ArrowLeft,
  Back,
  Drive,
  DriveRemovable,
};

// 使用 SVG 创建向上箭头图标
export const UpArrow: React.FC<{ variant?: '16x16_4' | '32x32_4' }> = ({ variant = '16x16_4' }) => (
  <svg width={variant === '16x16_4' ? 16 : 32} height={variant === '16x16_4' ? 16 : 32} viewBox="0 0 32 32" shapeRendering="crispEdges">
    <path fill="#000" d="M16 2L8 12h5v8h6v-8h5L16 2z"/>
    <path fill="#fff" d="M16 4l6 7h-4v8h-4v-8H10l6-7z"/>
  </svg>
);

// 使用 SVG 创建向左箭头图标  
export const LeftArrow: React.FC<{ variant?: '16x16_4' | '32x32_4' }> = ({ variant = '16x16_4' }) => (
  <svg width={variant === '16x16_4' ? 16 : 32} height={variant === '16x16_4' ? 16 : 32} viewBox="0 0 32 32" shapeRendering="crispEdges">
    <path fill="#000" d="M14 8L4 16l10 8v-5h14v-6H14V8z"/>
    <path fill="#fff" d="M12 10l-6 6 6 6v-4h14v-4H12v-4z"/>
  </svg>
);

// 导出尺寸常量
export const IconSizes = {
  SMALL: 'small' as IconSize,
  MEDIUM: 'medium' as IconSize,
  LARGE: 'large' as IconSize,
};
