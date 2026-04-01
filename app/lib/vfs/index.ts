/**
 * 虚拟文件系统模块导出
 */

// 核心类
export { VirtualFileSystem, vfsInstance } from './VirtualFileSystem';
export { FSLoader, initialFSData } from './FSLoader';
export { ExportManager, formatFileSize } from './ExportManager';

// Hooks
export {
  useVirtualFileSystem,
  useRemovableDrive,
  useFileChanges,
  useExportManager,
  useVirtualStorage,
} from './hooks';

// 类型
export type {
  VNodeType,
  ChangeAction,
  DriveType,
  BaseVNode,
  VFileNode,
  VFolderNode,
  VNode,
  DriveInfo,
  ChangeRecord,
  VirtualFileSystemState,
  ExportOptions,
  EjectResult,
  ChangeReport,
  FSMeta,
  NavigationResult,
  FileOperationResult,
} from './types';
