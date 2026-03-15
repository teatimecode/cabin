/**
 * 文件系统服务入口
 * 统一管理虚拟文件系统和可移动磁盘
 */

import { FileSystem, NodeType } from './FileSystem';
import type { FSNode } from './FileSystem';
import { StaticFileSystem, getFileContent, getFileContentById } from './staticConfig';
import RemovableDiskManager, { isFileSystemAccessSupported } from './RemovableDiskManager';
import type { MountOptions } from './RemovableDiskManager';

// 创建全局文件系统实例
const globalFileSystem = new FileSystem();

// 初始化静态文件系统
globalFileSystem.buildFromJson(StaticFileSystem);

// 创建可移动磁盘管理器
const removableDiskManager = new RemovableDiskManager(globalFileSystem);

/**
 * 文件系统服务
 */
const FSService = {
  fs: globalFileSystem,
  removable: removableDiskManager,

  getNode(path: string): FSNode | undefined {
    return this.fs.getNode(path);
  },

  listDirectory(path: string): FSNode[] {
    return this.fs.listDirectory(path);
  },

  async getFileContent(path: string): Promise<string> {
    const node = this.fs.getNode(path);
    if (!node) return '';

    // 如果是可移动磁盘上的文件
    const fileNode = node as any;
    if (fileNode._handle || fileNode._file) {
      return this.removable.readFileContent(fileNode);
    }

    return getFileContent(path);
  },

  getFileContentById(postId: string): string {
    return getFileContentById(postId);
  },

  async mountRemovableDisk(options: MountOptions = {}) {
    return this.removable.mountDirectory(options);
  },

  async unmountRemovableDisk(mountPath: string): Promise<boolean> {
    return this.removable.unmountDrive(mountPath);
  },

  isFileSystemAccessSupported(): boolean {
    return isFileSystemAccessSupported();
  },

  getMountedDrives() {
    return this.removable.getMountedDrives();
  },

  searchFiles(query: string, startPath = '/'): FSNode[] {
    return this.fs.findNode(query, startPath);
  },

  addChangeListener(callback: (event: any) => void): () => void {
    return this.removable.addChangeListener(callback);
  },

  toJson() {
    return this.fs.toJson();
  },
};

export { FileSystem, NodeType };
export { StaticFileSystem, getFileContent, getFileContentById };
export { RemovableDiskManager, isFileSystemAccessSupported };
export default FSService;
