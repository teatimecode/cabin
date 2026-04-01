/**
 * 虚拟文件系统 React Hooks
 * 
 * 提供易于在组件中使用的 hooks
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { VirtualFileSystem } from './VirtualFileSystem';
// vfsInstance 是单例模式，在组件中直接创建实例即可
import { ExportManager } from './ExportManager';
import { initialFSData } from './FSLoader';
import type { VNode, ChangeRecord, DriveInfo } from './types';

/**
 * useVirtualFileSystem Hook
 * 
 * 提供虚拟文件系统的基本操作
 */
export function useVirtualFileSystem() {
  const [vfs] = useState<VirtualFileSystem>(() => {
    const instance = new VirtualFileSystem();
    instance.initializeFromData(initialFSData);
    return instance;
  });

  const [currentPath, setCurrentPath] = useState<string>(vfs.getCurrentPath());
  const [nodes, setNodes] = useState<VNode[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // 监听当前路径变化，加载文件夹内容
  const loadCurrentFolder = useCallback(() => {
    const contents = vfs.getCurrentFolderContents();
    setNodes(contents);
    setCurrentPath(vfs.getCurrentPath());
    setCanGoBack(vfs.canGoBack());
    setCanGoForward(vfs.canGoForward());
  }, [vfs]);

  // 初始加载
  useEffect(() => {
    loadCurrentFolder();
  }, [loadCurrentFolder]);

  // 导航到指定路径
  const navigateTo = useCallback((path: string): boolean => {
    const result = vfs.navigateTo(path);
    if (result.success) {
      loadCurrentFolder();
    }
    return result.success;
  }, [vfs, loadCurrentFolder]);

  // 返回上级
  const navigateUp = useCallback((): boolean => {
    const result = vfs.navigateUp();
    if (result.success) {
      loadCurrentFolder();
    }
    return result.success;
  }, [vfs, loadCurrentFolder]);

  // 前进
  const goForward = useCallback((): boolean => {
    const result = vfs.goForward();
    if (result.success) {
      loadCurrentFolder();
    }
    return result.success;
  }, [vfs, loadCurrentFolder]);

  // 后退
  const goBack = useCallback((): boolean => {
    const result = vfs.goBack();
    if (result.success) {
      loadCurrentFolder();
    }
    return result.success;
  }, [vfs, loadCurrentFolder]);

  // 读取文件
  const readFile = useCallback((path: string): string | null => {
    return vfs.readFile(path);
  }, [vfs]);

  // 写入文件
  const writeFile = useCallback((path: string, content: string): boolean => {
    const result = vfs.writeFile(path, content);
    return result.success;
  }, [vfs]);

  // 创建文件
  const createFile = useCallback((path: string, content: string = ''): string | null => {
    const result = vfs.createFile(path, content);
    return result.fileId || null;
  }, [vfs]);

  // 删除文件
  const deleteFile = useCallback((path: string): boolean => {
    const result = vfs.deleteFile(path);
    return result.success;
  }, [vfs]);

  return {
    // 状态
    currentPath,
    nodes,
    canGoBack,
    canGoForward,
    
    // 导航
    navigateTo,
    navigateUp,
    goForward,
    goBack,
    
    // 文件操作
    readFile,
    writeFile,
    createFile,
    deleteFile,
    
    // 直接访问 VFS 实例（用于高级操作）
    vfs,
  };
}

/**
 * useRemovableDrive Hook
 * 
 * 管理可移动磁盘的挂载和弹出
 */
export function useRemovableDrive(vfs: VirtualFileSystem) {
  const [drives, setDrives] = useState<DriveInfo[]>([]);
  const [isMounting, setIsMounting] = useState(false);
  const [mountError, setMountError] = useState<string | null>(null);

  // 刷新驱动器列表
  const refreshDrives = useCallback(() => {
    const state = vfs.getState();
    setDrives(Array.from(state.removableDrives.values()));
  }, [vfs]);

  // 初始加载
  useEffect(() => {
    refreshDrives();
  }, [refreshDrives]);

  // 挂载可移动磁盘
  const mountDrive = useCallback(async (
    type: 'removable' | 'cdrom' = 'removable'
  ): Promise<string | null> => {
    try {
      setIsMounting(true);
      setMountError(null);

      // 检查浏览器支持
      if (!('showDirectoryPicker' in window)) {
        throw new Error('您的浏览器不支持目录选择功能，请使用 Chrome 或 Edge');
      }

      // 请求用户选择目录
      const dirHandle = await window.showDirectoryPicker();
      
      // 挂载到虚拟文件系统
      const driveId = await vfs.mountRemovableDrive(type, dirHandle);
      
      // 刷新驱动器列表
      refreshDrives();
      
      return driveId;
    } catch (error: any) {
      setMountError(error.message || '挂载失败');
      console.error('挂载失败:', error);
      return null;
    } finally {
      setIsMounting(false);
    }
  }, [vfs, refreshDrives]);

  // 弹出磁盘
  const ejectDrive = useCallback(async (driveId: string): Promise<{
    success: boolean;
    hasChanges: boolean;
    changes: ChangeRecord[];
  }> => {
    const result = vfs.ejectDrive(driveId);
    
    if (result.hasChanges) {
      // 有未保存的更改，需要用户确认
      return {
        success: false,
        hasChanges: true,
        changes: result.changes,
      };
    }

    // 无变更，直接刷新列表（实际弹出逻辑由 UI 处理）
    refreshDrives();
    
    return {
      success: true,
      hasChanges: false,
      changes: [],
    };
  }, [vfs, refreshDrives]);

  // 确认弹出并导出
  const confirmEjectAndExport = useCallback(async (
    driveId: string
  ): Promise<Blob | null> => {
    const exportManager = new ExportManager(vfs);
    const blob = await exportManager.saveAndEject(driveId);
    
    if (blob) {
      // 清除变更
      vfs.clearChanges();
      // 刷新列表
      refreshDrives();
    }
    
    return blob;
  }, [vfs, refreshDrives]);

  return {
    drives,
    isMounting,
    mountError,
    mountDrive,
    ejectDrive,
    confirmEjectAndExport,
    refreshDrives,
  };
}

/**
 * useFileChanges Hook
 * 
 * 追踪和管理文件变更
 */
export function useFileChanges(vfs: VirtualFileSystem) {
  const [changes, setChanges] = useState<ChangeRecord[]>([]);

  const refreshChanges = useCallback(() => {
    const allChanges = vfs.getAllChanges();
    setChanges(allChanges);
  }, [vfs]);

  // 初始加载
  useEffect(() => {
    refreshChanges();
  }, [refreshChanges]);

  // 撤销变更
  const undoChange = useCallback((fileId: string): boolean => {
    const success = vfs.undoLastChange(fileId);
    if (success) {
      refreshChanges();
    }
    return success;
  }, [vfs, refreshChanges]);

  // 清除所有变更
  const clearAllChanges = useCallback(() => {
    vfs.clearChanges();
    refreshChanges();
  }, [vfs, refreshChanges]);

  // 变更统计
  const changeStats = useMemo(() => ({
    total: changes.length,
    created: changes.filter(c => c.action === 'create').length,
    updated: changes.filter(c => c.action === 'update').length,
    deleted: changes.filter(c => c.action === 'delete').length,
  }), [changes]);

  return {
    changes,
    changeStats,
    undoChange,
    clearAllChanges,
    refreshChanges,
  };
}

/**
 * useExportManager Hook
 * 
 * 管理 ZIP 导出功能
 */
export function useExportManager(vfs: VirtualFileSystem) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportToZip = useCallback(async (
    filename?: string
  ): Promise<boolean> => {
    try {
      setIsExporting(true);
      setExportProgress(0);

      const exportManager = new ExportManager(vfs);
      
      // 生成 ZIP
      const blob = await exportManager.exportToZip();
      
      setExportProgress(50);
      
      // 下载
      const finalFilename = filename || exportManager.generateFilename();
      exportManager.downloadZip(blob, finalFilename);
      
      setExportProgress(100);
      
      return true;
    } catch (error: any) {
      console.error('导出失败:', error);
      return false;
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [vfs]);

  const getChangeList = useCallback(() => {
    const exportManager = new ExportManager(vfs);
    return exportManager.getChangeListDisplay();
  }, [vfs]);

  return {
    isExporting,
    exportProgress,
    exportToZip,
    getChangeList,
  };
}

/**
 * 组合式 Hook - 提供完整的虚拟文件系统功能
 */
export function useVirtualStorage() {
  const {
    currentPath,
    nodes,
    canGoBack,
    canGoForward,
    navigateTo,
    navigateUp,
    goForward,
    goBack,
    readFile,
    writeFile,
    createFile,
    deleteFile,
    vfs,
  } = useVirtualFileSystem();

  const removableDrive = useRemovableDrive(vfs);
  const fileChanges = useFileChanges(vfs);
  const exportManager = useExportManager(vfs);

  return {
    // 基本状态
    currentPath,
    nodes,
    canGoBack,
    canGoForward,
    
    // 导航
    navigateTo,
    navigateUp,
    goForward,
    goBack,
    
    // 文件操作
    readFile,
    writeFile,
    createFile,
    deleteFile,
    
    // 可移动磁盘
    ...removableDrive,
    
    // 变更管理
    ...fileChanges,
    
    // 导出
    ...exportManager,
    
    // VFS 实例
    vfs,
  };
}
