/**
 * 文件系统服务入口
 * 统一管理虚拟文件系统和可移动磁盘
 */

import { FileSystem, NodeType } from './FileSystem';
import { StaticFileSystem, getFileContent, getFileContentById } from './staticConfig';
import RemovableDiskManager, { isFileSystemAccessSupported } from './RemovableDiskManager';

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
  // 文件系统实例
  fs: globalFileSystem,
  
  // 可移动磁盘管理器
  removable: removableDiskManager,

  /**
   * 获取节点
   */
  getNode(path) {
    return this.fs.getNode(path);
  },

  /**
   * 列出目录内容
   */
  listDirectory(path) {
    return this.fs.listDirectory(path);
  },

  /**
   * 获取文件内容
   */
  async getFileContent(path) {
    const node = this.fs.getNode(path);
    
    if (!node) return '';
    
    // 如果是可移动磁盘上的文件
    if (node._handle || node._file) {
      return this.removable.readFileContent(node);
    }
    
    // 静态文件系统
    return getFileContent(path);
  },

  /**
   * 通过postId获取文件内容
   */
  getFileContentById(postId) {
    return getFileContentById(postId);
  },

  /**
   * 挂载可移动磁盘
   */
  async mountRemovableDisk(options = {}) {
    return this.removable.mountDirectory(options);
  },

  /**
   * 卸载可移动磁盘
   */
  async unmountRemovableDisk(mountPath) {
    return this.removable.unmountDrive(mountPath);
  },

  /**
   * 检查是否支持File System Access API
   */
  isFileSystemAccessSupported() {
    return isFileSystemAccessSupported();
  },

  /**
   * 获取挂载的驱动器列表
   */
  getMountedDrives() {
    return this.removable.getMountedDrives();
  },

  /**
   * 搜索文件
   */
  searchFiles(query, startPath = '/') {
    return this.fs.findNode(query, startPath);
  },

  /**
   * 添加变更监听
   */
  addChangeListener(callback) {
    return this.removable.addChangeListener(callback);
  },

  /**
   * 获取文件系统JSON结构（兼容旧代码）
   */
  toJson() {
    return this.fs.toJson();
  },
};

// 导出类型和工具
export { FileSystem, NodeType };
export { StaticFileSystem, getFileContent, getFileContentById };
export { RemovableDiskManager, isFileSystemAccessSupported };
export default FSService;
