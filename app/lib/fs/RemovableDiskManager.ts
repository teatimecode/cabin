/**
 * 可移动磁盘管理器
 * 使用 File System Access API 实现浏览器端文件系统访问
 */

import { DriveNode, FolderNode, FileNode, DriveType, FileSystem } from './FileSystem';
import mitt from 'mitt';

/**
 * 检查浏览器是否支持 File System Access API
 */
export function isFileSystemAccessSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'showDirectoryPicker' in window;
}

export interface MountOptions {
  mountPath?: string;
  suggestedName?: string;
  startIn?: string;
}

export interface ChangeEvent {
  type: 'mount' | 'unmount' | 'write' | 'refresh';
  path?: string;
  node?: any;
  timestamp: number;
}

export type ChangeListener = (event: ChangeEvent) => void;

/**
 * 可移动磁盘管理器
 */
export class RemovableDiskManager {
  private mountedDrives: Map<string, any> = new Map();
  private observers: Array<(drives: Array<any>) => void> = [];
  private watchers: Set<ChangeListener> = new Set();
  private directoryHandles: Map<string, any> = new Map();
  private fileSystem: FileSystem;

constructor(fileSystem: FileSystem) {
  this.fileSystem = fileSystem;
  this.emitter = mitt();
}

  isSupported(): boolean {
    return isFileSystemAccessSupported();
  }

  async mountDirectory(options: MountOptions = {}): Promise<DriveNode | null> {
    if (!this.isSupported()) {
      throw new Error('您的浏览器不支持 File System Access API，无法挂载本地目录');
    }

    try {
      const dirHandle = await (window as any).showDirectoryPicker({
        mode: 'read',
        startIn: options.startIn || 'downloads',
      });

      const driveName = options.suggestedName || dirHandle.name || '可移动磁盘';
      const mountPath = options.mountPath || `/removable/${this.generateDriveId(driveName)}`;

      const driveNode = await this.createDriveNode(dirHandle, driveName, mountPath);
      this.directoryHandles.set(mountPath, dirHandle);
      await this.fileSystem.mountDrive(mountPath, driveNode);
      this.notifyChange('mount', { path: mountPath, node: driveNode });

      return driveNode;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('用户取消了目录选择');
        return null;
      }
      throw error;
    }
  }

  async createDriveNode(dirHandle: any, name: string, mountPath: string): Promise<DriveNode> {
    const driveNode = new DriveNode({
      id: mountPath,
      name,
      path: mountPath,
      icon: 'drive-removable',
      driveType: DriveType.REMOVABLE,
    });

    await this.readDirectory(dirHandle, driveNode, mountPath);
    return driveNode;
  }

  async readDirectory(dirHandle: any, parentNode: FolderNode, parentPath: string): Promise<void> {
    for await (const entry of dirHandle.values()) {
      const entryPath = `${parentPath}/${entry.name}`;

      if (entry.kind === 'directory') {
        const folderNode = new FolderNode({
          id: entryPath,
          name: entry.name,
          path: entryPath,
          icon: 'folder',
          parent: parentNode,
        });

        await this.readDirectory(entry, folderNode, entryPath);
        parentNode.addChild(folderNode);
        this.directoryHandles.set(entryPath, entry);
      } else {
        const fileNode = await this.createFileNode(entry, entryPath, parentNode);
        parentNode.addChild(fileNode);
      }
    }
  }

  async createFileNode(fileHandle: any, path: string, parent: FolderNode): Promise<FileNode> {
    const file = await fileHandle.getFile();
    const extension = this.getFileExtension(file.name);

    const fileNode = new FileNode({
      id: path,
      name: file.name,
      path,
      parent,
      extension,
      size: file.size,
      app: this.getAppForExtension(extension),
      content: null,
    });

    fileNode._handle = fileHandle;
    fileNode._file = file;

    return fileNode;
  }

  async readFileContent(fileNode: FileNode): Promise<string> {
    if (fileNode.content !== null) {
      return fileNode.content as string;
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

  async writeFileContent(fileNode: FileNode, content: string): Promise<boolean> {
    if (!fileNode._handle) {
      throw new Error('文件句柄不存在');
    }

    try {
      const permission = await fileNode._handle.requestPermission({ mode: 'readwrite' });
      if (permission !== 'granted') {
        throw new Error('没有写入权限');
      }

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

  async unmountDrive(mountPath: string): Promise<boolean> {
    const driveNode = this.fileSystem.getMountedDrives().find(d => d.path === mountPath);
    if (!driveNode) return false;

    for (const [path] of this.directoryHandles) {
      if (path.startsWith(mountPath)) {
        this.directoryHandles.delete(path);
      }
    }

    await this.fileSystem.unmountDrive(mountPath);
    this.notifyChange('unmount', { path: mountPath });
    return true;
  }

  getMountedDrives(): DriveNode[] {
    return this.fileSystem.getMountedDrives();
  }

  generateDriveId(name: string): string {
    const sanitized = name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    return `${sanitized}_${Date.now().toString(36)}`;
  }

  getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
  }

  getAppForExtension(ext: string): string {
    const appMap: Record<string, string> = {
      txt: 'notepad', md: 'notepad', json: 'notepad',
      js: 'notepad', jsx: 'notepad', ts: 'notepad', tsx: 'notepad',
      css: 'notepad', html: 'notepad', xml: 'notepad', log: 'notepad',
      jpg: 'image-viewer', jpeg: 'image-viewer', png: 'image-viewer',
      gif: 'image-viewer', svg: 'image-viewer', webp: 'image-viewer', bmp: 'image-viewer',
      mp3: 'media-player', wav: 'media-player', mp4: 'media-player', webm: 'media-player',
      pdf: 'pdf-viewer',
    };
    return appMap[ext] || 'notepad';
  }

  addChangeListener(callback: ChangeListener): () => void {
    this.watchers.add(callback);
    return () => this.watchers.delete(callback);
  }

  notifyChange(type: ChangeEvent['type'], data: Partial<ChangeEvent> = {}): void {
    this.watchers.forEach(callback => {
      try {
        callback({ type, ...data, timestamp: Date.now() } as ChangeEvent);
      } catch (err) {
        console.error('ChangeListener error:', err);
      }
    });
  }

  isMounted(mountPath: string): boolean {
    return this.directoryHandles.has(mountPath);
  }

async refreshDirectory(path: string): Promise<FolderNode | null> {
  const handle = this.directoryHandles.get(path);
  if (!handle) return null;

  const node = this.fileSystem.getNode(path);
  if (!node || node.type !== 'folder') return null;

  const folderNode = node as FolderNode;
  folderNode.children = [];
  await this.readDirectory(handle, folderNode, path);
  this.notifyChange('refresh', { path, node: folderNode });

  return folderNode;
}

async mountDrive(path: string, options?: any) {
  // 模拟挂载过程
  const driveNode = new DriveNode({
    id: `drive_${Date.now()}`,
    name: `可移动磁盘 (${path})`,
    path,
    icon: 'drive-removable',
    driveType: DriveType.REMOVABLE,
    totalSpace: options?.capacity || 0,
    freeSpace: options?.freeSpace || 0,
    mountPoint: path,
  });

  this.fileSystem.mountDrive(path, driveNode);
  this.notifyChange('mount', { path, node: driveNode });

  return driveNode;
}

  subscribe(callback: (drives: Array<any>) => void) {
    this.observers.push(callback);
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private notifyObservers() {
    const drives = this.getMountedDrives();
    this.observers.forEach(observer => observer(drives));
  }
}

export default RemovableDiskManager;
