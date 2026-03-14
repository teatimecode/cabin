/**
 * 文件系统 React Context
 * 提供全局文件系统状态和操作
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import FSService from './index';
import { isFileSystemAccessSupported } from './RemovableDiskManager';

const FSContext = createContext(null);

/**
 * 文件系统Provider组件
 */
export function FSProvider({ children }) {
  // 在 SSR 时返回默认值
  const [mountedDrives, setMountedDrives] = useState([]);
  const [isSupported, setIsSupported] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // 只在客户端执行
    setIsSupported(isFileSystemAccessSupported());
    
    // 监听文件系统变更
    const unsubscribe = FSService.addChangeListener((event) => {
      // 更新挂载驱动器列表
      setMountedDrives(FSService.getMountedDrives());
      // 触发重新渲染
      setRefreshKey(prev => prev + 1);
    });

    return unsubscribe;
  }, []);

  /**
   * 挂载可移动磁盘
   */
  const mountDisk = useCallback(async (options = {}) => {
    try {
      const drive = await FSService.mountRemovableDisk(options);
      return drive;
    } catch (error) {
      console.error('挂载磁盘失败:', error);
      throw error;
    }
  }, []);

  /**
   * 卸载可移动磁盘
   */
  const unmountDisk = useCallback(async (mountPath) => {
    try {
      await FSService.unmountRemovableDisk(mountPath);
    } catch (error) {
      console.error('卸载磁盘失败:', error);
      throw error;
    }
  }, []);

  /**
   * 获取节点
   */
  const getNode = useCallback((path) => {
    return FSService.getNode(path);
  }, []);

  /**
   * 列出目录
   */
  const listDirectory = useCallback((path) => {
    return FSService.listDirectory(path);
  }, []);

  /**
   * 获取文件内容
   */
  const getFileContent = useCallback(async (path) => {
    return FSService.getFileContent(path);
  }, []);

  /**
   * 搜索文件
   */
  const searchFiles = useCallback((query, startPath = '/') => {
    return FSService.searchFiles(query, startPath);
  }, []);

  const value = {
    // 服务实例
    fs: FSService,
    
    // 状态
    mountedDrives,
    isSupported,
    refreshKey,
    
    // 操作方法
    mountDisk,
    unmountDisk,
    getNode,
    listDirectory,
    getFileContent,
    searchFiles,
    
    // 兼容旧API
    fileSystem: FSService.toJson(),
  };

  return (
    <FSContext.Provider value={value}>
      {children}
    </FSContext.Provider>
  );
}

/**
 * 使用文件系统Hook
 */
export function useFileSystem() {
  const context = useContext(FSContext);
  if (!context) {
    throw new Error('useFileSystem must be used within FSProvider');
  }
  return context;
}

/**
 * 使用目录内容Hook
 */
export function useDirectory(path) {
  const { listDirectory, refreshKey } = useFileSystem();
  return listDirectory(path);
}

/**
 * 使用文件内容Hook
 */
export function useFileContent(path) {
  const { getFileContent } = useFileSystem();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) return;
    
    setLoading(true);
    setError(null);
    
    getFileContent(path)
      .then(setContent)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [path, getFileContent]);

  return { content, loading, error };
}

/**
 * 使用可移动磁盘Hook
 */
export function useRemovableDisk() {
  const { 
    isSupported, 
    mountedDrives, 
    mountDisk, 
    unmountDisk 
  } = useFileSystem();

  const [mounting, setMounting] = useState(false);
  const [error, setError] = useState(null);

  const mount = useCallback(async (options) => {
    setMounting(true);
    setError(null);
    try {
      const drive = await mountDisk(options);
      return drive;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setMounting(false);
    }
  }, [mountDisk]);

  const unmount = useCallback(async (mountPath) => {
    setError(null);
    try {
      await unmountDisk(mountPath);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [unmountDisk]);

  return {
    isSupported,
    mountedDrives,
    mounting,
    error,
    mount,
    unmount,
  };
}

export default FSContext;
