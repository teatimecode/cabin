/**
 * 可移动磁盘管理器
 * 使用 File System Access API 实现浏览器端文件系统访问
 */

import { DriveNode, FolderNode, FileNode, DriveType } from './FileSystem';

/**
 * 检查浏览器是否支持 File System Access API
 */
export function isFileSystemAccessSupported() {
  if (typeof window === 'undefined') return false;
  return 'showDirectoryPicker' in window;
}

/**
 * 可移动磁盘管理器
 */
export class RemovableDiskManager {
  constructor(fileSystem) {
    this.fileSystem = fileSystem;
    this.directoryHandles = new Map(); // 存储目录句柄
    this.watchers = new Set(); // 变更监听器
  }

  /**
   * 检查是否支持挂载
   */
  isSupported() {
    return isFileSystemAccessSupported();
  }

  /**
   * 请求用户选择目录并挂载
   * @param {Object} options - 选项
   * @param {string} options.mountPath - 挂载路径（默认在 /removable 下）
   * @param {string} options.suggestedName - 建议的驱动器名称
   * @returns {Promise<DriveNode>} 挂载的驱动器节点
   */
  async mountDirectory(options = {}) {
    if (!this.isSupported()) {
      throw new Error('您的浏览器不支持 File System Access API，无法挂载本地目录');
    }

    try {
      // 请求用户选择目录
      const dirHandle = await window.showDirectoryPicker({
        mode: 'read', // 可以改为 'readwrite' 支持写入
        startIn: options.startIn || 'downloads',
      });

      // 生成挂载路径
      const driveName = options.suggestedName || dirHandle.name || '可移动磁盘';
      const mountPath = options.mountPath || `/removable/${this.generateDriveId(driveName)}`;

      // 创建驱动器节点
      const driveNode = await this.createDriveNode(dirHandle, driveName, mountPath);
      
      // 存储句柄
      this.directoryHandles.set(mountPath, dirHandle);

      // 挂载到文件系统
      await this.fileSystem.mountDrive(mountPath, driveNode);

      // 通知变更
      this.notifyChange('mount', { path: mountPath, node: driveNode });

      return driveNode;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('用户取消了目录选择');
        return null;
      }
      throw error;
    }
  }

  /**
   * 从目录句柄创建驱动器节点
   */
  async createDriveNode(dirHandle, name, mountPath) {
    const driveNode = new DriveNode({
      id: mountPath,
      name: name,
      path: mountPath,
      icon: 'drive-removable',
      driveType: DriveType.REMOVABLE,
    });

    // 递归读取目录结构
    await this.readDirectory(dirHandle, driveNode, mountPath);

    return driveNode;
  }

  /**
   * 递归读取目录内容
   */
  async readDirectory(dirHandle, parentNode, parentPath) {
    const entries = [];
    
    for await (const entry of dirHandle.values()) {
      const entryPath = `${parentPath}/${entry.name}`;
      
      if (entry.kind === 'directory') {
        // 文件夹
        const folderNode = new FolderNode({
          id: entryPath,
          name: entry.name,
          path: entryPath,
          icon: 'folder',
          parent: parentNode,
        });
        
        // 递归读取子目录
        await this.readDirectory(entry, folderNode, entryPath);
        parentNode.addChild(folderNode);
        
        // 存储目录句柄
        this.directoryHandles.set(entryPath, entry);
      } else {
        // 文件
        const fileNode = await this.createFileNode(entry, entryPath, parentNode);
        parentNode.addChild(fileNode);
      }
    }

    return entries;
  }

  /**
   * 创建文件节点
   */
  async createFileNode(fileHandle, path, parent) {
    const file = await fileHandle.getFile();
    const extension = this.getFileExtension(file.name);
    
    const fileNode = new FileNode({
      id: path,
      name: file.name,
      path: path,
      parent: parent,
      extension: extension,
      size: file.size,
      app: this.getAppForExtension(extension),
      // 不立即加载内容，按需加载
      content: null,
    });

    // 存储文件句柄以便后续读取
    fileNode._handle = fileHandle;
    fileNode._file = file;

    return fileNode;
  }

  /**
   * 读取文件内容
   */
  async readFileContent(fileNode) {
    if (fileNode.content !== null) {
      return fileNode.content;
    }

    if (fileNode._handle) {
      const file = await fileNode._handle.getFile();
      const content = await file.text();
      fileNode.content = content;
      return content;
    }

    if (fileNode._file) {
      const content = await fileNode._file.text();
      fileNode.content = content;
      return content;
    }

    return '';
  }

  /**
   * 写入文件内容（需要 'readwrite' 权限）
   */
  async writeFileContent(fileNode, content) {
    if (!fileNode._handle) {
      throw new Error('文件句柄不存在');
    }

    try {
      // 检查写入权限
      const permission = await fileNode._handle.requestPermission({ mode: 'readwrite' });
      if (permission !== 'granted') {
        throw new Error('没有写入权限');
      }

      // 创建可写流
      const writable = await fileNode._handle.createWritable();
      await writable.write(content);
      await writable.close();

      fileNode.content = content;
      fileNode.size = content.length;
      fileNode.modifiedAt = new Date().toISOString();

      this.notifyChange('write', { node: fileNode });
      
      return true;
    } catch (error) {
      console.error('写入文件失败:', error);
      throw error;
    }
  }

  /**
   * 卸载驱动器
   */
  async unmountDrive(mountPath) {
    const driveNode = this.fileSystem.getMountedDrives().find(d => d.path === mountPath);
    
    if (!driveNode) {
      return false;
    }

    // 清理句柄
    for (const [path] of this.directoryHandles) {
      if (path.startsWith(mountPath)) {
        this.directoryHandles.delete(path);
      }
    }

    // 从文件系统移除
    await this.fileSystem.unmountDrive(mountPath);

    this.notifyChange('unmount', { path: mountPath });

    return true;
  }

  /**
   * 获取挂载的驱动器列表
   */
  getMountedDrives() {
    return this.fileSystem.getMountedDrives();
  }

  /**
   * 生成驱动器ID
   */
  generateDriveId(name) {
    const sanitized = name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    return `${sanitized}_${Date.now().toString(36)}`;
  }

  /**
   * 获取文件扩展名
   */
  getFileExtension(filename) {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  }

  /**
   * 根据扩展名获取默认应用
   */
  getAppForExtension(ext) {
    const appMap = {
      'txt': 'notepad',
      'md': 'notepad',
      'json': 'notepad',
      'js': 'notepad',
      'jsx': 'notepad',
      'ts': 'notepad',
      'tsx': 'notepad',
      'css': 'notepad',
      'html': 'notepad',
      'xml': 'notepad',
      'log': 'notepad',
      'jpg': 'image-viewer',
      'jpeg': 'image-viewer',
      'png': 'image-viewer',
      'gif': 'image-viewer',
      'svg': 'image-viewer',
      'webp': 'image-viewer',
      'bmp': 'image-viewer',
      'mp3': 'media-player',
      'wav': 'media-player',
      'mp4': 'media-player',
      'webm': 'media-player',
      'pdf': 'pdf-viewer',
    };
    return appMap[ext] || 'notepad';
  }

  /**
   * 添加变更监听器
   */
  addChangeListener(callback) {
    this.watchers.add(callback);
    return () => this.watchers.delete(callback);
  }

  /**
   * 通知变更
   */
  notifyChange(type, data) {
    this.watchers.forEach(callback => {
      try {
        callback({ type, ...data, timestamp: Date.now() });
      } catch (err) {
        console.error('ChangeListener error:', err);
      }
    });
  }

  /**
   * 检查挂载状态
   */
  isMounted(mountPath) {
    return this.directoryHandles.has(mountPath);
  }

  /**
   * 刷新目录内容
   */
  async refreshDirectory(path) {
    const handle = this.directoryHandles.get(path);
    if (!handle) return null;

    const node = this.fileSystem.getNode(path);
    if (!node || !node.isFolder()) return null;

    // 清空现有子节点
    node.children = [];

    // 重新读取
    await this.readDirectory(handle, node, path);

    this.notifyChange('refresh', { path, node });

    return node;
  }
}

export default RemovableDiskManager;
