import React from 'react';

// Windows 95 风格图标
// 基于 React95 和 Windows 95 原版图标设计

export const ComputerIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 显示器 */}
    <rect x="4" y="4" width="24" height="16" fill="#c0c0c0" stroke="#000" strokeWidth="1"/>
    {/* 屏幕 */}
    <rect x="6" y="6" width="20" height="12" fill="#000080"/>
    {/* 底座 */}
    <rect x="10" y="20" width="12" height="4" fill="#c0c0c0" stroke="#000" strokeWidth="1"/>
    {/* 支架 */}
    <rect x="8" y="24" width="16" height="2" fill="#c0c0c0" stroke="#000" strokeWidth="1"/>
    {/* 底部 */}
    <rect x="6" y="26" width="20" height="3" fill="#c0c0c0" stroke="#000" strokeWidth="1"/>
  </svg>
);

export const FolderIcon = ({ open = false }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {open ? (
      <>
        {/* 打开的文件夹 */}
        <path d="M2 10 L6 10 L8 6 L16 6 L18 10 L30 10 L28 26 L4 26 Z" fill="#ffff00" stroke="#808000" strokeWidth="1"/>
        <path d="M4 12 L26 12 L24 24 L6 24 Z" fill="#ffff80"/>
      </>
    ) : (
      <>
        {/* 关闭的文件夹 */}
        <path d="M2 8 L2 26 L30 26 L30 12 L16 12 L14 8 Z" fill="#ffff00" stroke="#808000" strokeWidth="1"/>
        <path d="M2 8 L14 8 L16 12 L30 12 L30 10 L16 10 L14 6 L2 6 Z" fill="#ffff00" stroke="#808000" strokeWidth="1"/>
      </>
    )}
  </svg>
);

export const DocumentIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 文档 */}
    <path d="M6 2 L22 2 L26 6 L26 30 L6 30 Z" fill="#fff" stroke="#000" strokeWidth="1"/>
    {/* 折角 */}
    <path d="M22 2 L22 6 L26 6" fill="#c0c0c0" stroke="#000" strokeWidth="1"/>
    {/* 文字线条 */}
    <line x1="10" y1="12" x2="22" y2="12" stroke="#000" strokeWidth="1"/>
    <line x1="10" y1="16" x2="20" y2="16" stroke="#000" strokeWidth="1"/>
    <line x1="10" y1="20" x2="18" y2="20" stroke="#000" strokeWidth="1"/>
  </svg>
);

export const NotepadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 窗口背景 */}
    <rect x="2" y="4" width="28" height="24" fill="#fff" stroke="#000" strokeWidth="1"/>
    {/* 标题栏 */}
    <rect x="2" y="4" width="28" height="6" fill="#000080"/>
    {/* 菜单栏 */}
    <rect x="2" y="10" width="28" height="4" fill="#c0c0c0"/>
    {/* 文本区域 */}
    <rect x="4" y="16" width="24" height="10" fill="#fff" stroke="#808080" strokeWidth="1"/>
    {/* 文字 */}
    <line x1="6" y1="20" x2="20" y2="20" stroke="#000" strokeWidth="1"/>
    <line x1="6" y1="23" x2="16" y2="23" stroke="#000" strokeWidth="1"/>
  </svg>
);

export const PictureIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 相框 */}
    <rect x="2" y="4" width="28" height="24" fill="#fff" stroke="#000" strokeWidth="1"/>
    {/* 山 */}
    <polygon points="4,24 12,14 18,20 24,12 28,24" fill="#008000"/>
    {/* 太阳 */}
    <circle cx="22" cy="10" r="4" fill="#ffff00"/>
  </svg>
);

export const RecycleBinIcon = ({ empty = true }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 垃圾桶盖 */}
    <path d="M8 6 L24 6 L26 8 L6 8 Z" fill="#c0c0c0" stroke="#000" strokeWidth="1"/>
    {/* 把手 */}
    <rect x="14" y="4" width="4" height="3" fill="#c0c0c0" stroke="#000" strokeWidth="1"/>
    {/* 桶身 */}
    <path d="M6 8 L8 28 L24 28 L26 8 Z" fill="#c0c0c0" stroke="#000" strokeWidth="1"/>
    {!empty && (
      <>
        {/* 废纸团 */}
        <circle cx="12" cy="16" r="3" fill="#fff" stroke="#808080" strokeWidth="1"/>
        <circle cx="20" cy="20" r="2" fill="#fff" stroke="#808080" strokeWidth="1"/>
        <circle cx="14" cy="22" r="2" fill="#fff" stroke="#808080" strokeWidth="1"/>
      </>
    )}
  </svg>
);

// 图标映射
export const IconMap = {
  'my-computer': ComputerIcon,
  'folder': FolderIcon,
  'folder-open': (props) => <FolderIcon open {...props} />,
  'document': DocumentIcon,
  'notepad': NotepadIcon,
  'picture': PictureIcon,
  'recycle-bin': RecycleBinIcon,
  'recycle-bin-full': (props) => <RecycleBinIcon empty={false} {...props} />,
};

// 获取图标组件
export function getIcon(iconName) {
  const IconComponent = IconMap[iconName];
  return IconComponent ? <IconComponent /> : <DocumentIcon />;
}

export default IconMap;
