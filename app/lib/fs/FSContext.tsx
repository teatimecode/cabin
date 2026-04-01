"use client";

/**
 * 文件系统 React Context
 * 提供全局文件系统状态和操作
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import FSService from './index';
import { isFileSystemAccessSupported } from './RemovableDiskManager';
import type { FSNode, DriveNode } from './FileSystem';

export interface FSContextValue {
  fs: typeof FSService;
  mountedDrives: DriveNode[];
  isSupported: boolean;
  refreshKey: number;
  mountDisk: (options?: Record<string, any>) => Promise<DriveNode | null>;
  unmountDisk: (mountPath: string) => Promise<void>;
  getNode: (path: string) => FSNode | undefined;
  listDirectory: (path: string) => FSNode[];
  getFileContent: (path: string) => Promise<string>;
  searchFiles: (query: string, startPath?: string) => FSNode[];
  fileSystem: Record<string, any>;
}

const FSContext = createContext<FSContextValue | null>(null);

type FSProviderProps = {
  children: React.ReactNode;
};

/**
 * 文件系统Provider组件
 */
export function FSProvider({ children }: FSProviderProps) {
  const [mountedDrives, setMountedDrives] = useState<DriveNode[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setIsSupported(isFileSystemAccessSupported());

    const unsubscribe = FSService.addChangeListener(() => {
      setMountedDrives(FSService.getMountedDrives());
      setRefreshKey(prev => prev + 1);
    });

    return unsubscribe;
  }, []);

  const mountDisk = useCallback(async (options: Record<string, any> = {}) => {
    return await FSService.mountRemovableDisk(options);
  }, []);

  const unmountDisk = useCallback(async (mountPath: string) => {
    await FSService.unmountRemovableDisk(mountPath);
  }, []);

  const getNode = useCallback((path: string) => {
    return FSService.getNode(path);
  }, []);

  const listDirectory = useCallback((path: string) => {
    return FSService.listDirectory(path);
  }, []);

  const getFileContent = useCallback(async (path: string) => {
    return FSService.getFileContent(path);
  }, []);

  const searchFiles = useCallback((query: string, startPath = '/') => {
    return FSService.searchFiles(query, startPath);
  }, []);

  const value: FSContextValue = {
    fs: FSService,
    mountedDrives,
    isSupported,
    refreshKey,
    mountDisk,
    unmountDisk,
    getNode,
    listDirectory,
    getFileContent,
    searchFiles,
    // fileSystem 使用 fs 实例代替 toJson
    fileSystem: FSService.fs as any,
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
export function useFileSystem(): FSContextValue {
  const context = useContext(FSContext);
  if (!context) {
    throw new Error('useFileSystem must be used within FSProvider');
  }
  return context;
}

/**
 * 使用目录内容Hook
 */
export function useDirectory(path: string): FSNode[] {
  const { listDirectory } = useFileSystem();
  return listDirectory(path);
}

export type UseFileContentResult = {
  content: string;
  loading: boolean;
  error: Error | null;
};

/**
 * 使用文件内容Hook
 */
export function useFileContent(path: string): UseFileContentResult {
  const { getFileContent } = useFileSystem();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

export type UseRemovableDiskResult = {
  isSupported: boolean;
  mountedDrives: DriveNode[];
  mounting: boolean;
  error: string | null;
  mount: (options?: Record<string, any>) => Promise<DriveNode | null>;
  unmount: (mountPath: string) => Promise<void>;
};

/**
 * 使用可移动磁盘Hook
 */
export function useRemovableDisk(): UseRemovableDiskResult {
  const { isSupported, mountedDrives, mountDisk, unmountDisk } = useFileSystem();
  const [mounting, setMounting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mount = useCallback(async (options: Record<string, any> = {}) => {
    setMounting(true);
    setError(null);
    try {
      return await mountDisk(options);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setMounting(false);
    }
  }, [mountDisk]);

  const unmount = useCallback(async (mountPath: string) => {
    setError(null);
    try {
      await unmountDisk(mountPath);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [unmountDisk]);

  return { isSupported, mountedDrives, mounting, error, mount, unmount };
}

export default FSContext;
