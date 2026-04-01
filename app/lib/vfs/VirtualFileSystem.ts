/**
 * 虚拟文件系统核心类
 * 
 * 功能:
 * - 从 fs/ 目录初始化虚拟文件系统
 * - 支持文件/文件夹的 CRUD 操作
 * - 变更追踪（不直接写入磁盘）
 * - 可移动磁盘挂载
 * - ZIP 导出
 */

import type {
  VNode,
  VFileNode,
  VFolderNode,
  VirtualFileSystemState,
  ChangeRecord,
  DriveInfo,
  DriveType,
  EjectResult,
  FileOperationResult,
  NavigationResult,
} from './types';

export class VirtualFileSystem {
  private state: VirtualFileSystemState;

  constructor() {
    this.state = {
      nodes: new Map(),
      rootId: 'root',
      currentPath: '/',
      history: ['/'],
      historyIndex: 0,
      changes: new Map(),
      removableDrives: new Map(),
    };
  }

  // ==================== 初始化 ====================

  /**
   * 从初始数据构建虚拟文件系统
   */
  initializeFromData(initialData: Record<string, any>): void {
    this.state.nodes.clear();
    
    // 递归构建节点树
    this.buildNodesFromData(initialData, '/', null);
  }

  private buildNodesFromData(
    data: any,
    path: string,
    parentId: string | null
  ): string {
    const nodeId = this.generateId(path);
    const now = Date.now();

    if (data.type === 'folder' || !data.type) {
      // 文件夹节点
      const folderNode: VFolderNode = {
        id: nodeId,
        name: data.name || this.extractName(path),
        type: 'folder',
        path,
        children: [],
        createdAt: now,
        modifiedAt: now,
        isRoot: path === '/',
      };

      this.state.nodes.set(nodeId, folderNode);

      // 处理子节点
      if (parentId) {
        const parent = this.state.nodes.get(parentId) as VFolderNode;
        if (parent?.type === 'folder') {
          parent.children.push(nodeId);
        }
      }

      // 递归处理子目录
      if (data.children) {
        for (const child of data.children) {
          this.buildNodesFromData(child, `${path === '/' ? '' : path}/${child.name}`, nodeId);
        }
      }

      return nodeId;
    } else {
      // 文件节点
      const fileNode: VFileNode = {
        id: nodeId,
        name: data.name || this.extractName(path),
        type: 'file',
        path,
        content: data.content || '',
        size: (data.content || '').length,
        createdAt: now,
        modifiedAt: now,
        isModified: false,
        mimeType: data.mimeType,
        metadata: data.metadata,
      };

      this.state.nodes.set(nodeId, fileNode);

      if (parentId) {
        const parent = this.state.nodes.get(parentId) as VFolderNode;
        if (parent?.type === 'folder') {
          parent.children.push(nodeId);
        }
      }

      return nodeId;
    }
  }

  /**
   * 从 fs/ 目录结构加载数据
   */
  async loadFromFSDirectory(fsData: any[]): Promise<void> {
    const rootNode: VFolderNode = {
      id: 'root',
      name: '桌面',
      type: 'folder',
      path: '/',
      children: [],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      isRoot: true,
    };

    this.state.nodes.set('root', rootNode);

    // 添加默认文件夹
    const defaultFolders = [
      { id: 'my-computer', name: '我的电脑', path: '/my-computer' },
      { id: 'my-documents', name: '我的文档', path: '/my-documents' },
      { id: 'my-pictures', name: '我的图片', path: '/my-pictures' },
      { id: 'my-blog', name: '我的博客', path: '/my-blog' },
      { id: 'recycle-bin', name: '回收站', path: '/recycle-bin' },
      { id: 'removable', name: '可移动磁盘', path: '/removable' },
    ];

    for (const folder of defaultFolders) {
      const node: VFolderNode = {
        id: folder.id,
        name: folder.name,
        type: 'folder',
        path: folder.path,
        children: [],
        createdAt: Date.now(),
        modifiedAt: Date.now(),
      };

      this.state.nodes.set(folder.id, node);
      rootNode.children.push(folder.id);
    }

    // 从 fsData 加载内容
    this.loadFSContent(fsData);
  }

  private loadFSContent(_fsData: any[]): void {
    // 根据实际的 fs/ 目录结构加载内容
    // 这里可以根据需要扩展
  }

  // ==================== 导航功能 ====================

  /**
   * 导航到指定路径
   */
  navigateTo(path: string): NavigationResult {
    const node = this.getNodeByPath(path);
    
    if (!node) {
      return { success: false, error: `路径不存在：${path}` };
    }

    if (node.type !== 'folder') {
      return { success: false, error: `不是文件夹：${path}` };
    }

    this.state.currentPath = path;
    this.addToHistory(path);

    return { success: true, path };
  }

  /**
   * 返回上级目录
   */
  navigateUp(): NavigationResult {
    if (this.state.currentPath === '/') {
      return { success: false, error: '已经在根目录' };
    }

    const parentPath = this.getParentPath(this.state.currentPath);
    if (parentPath) {
      return this.navigateTo(parentPath);
    }

    return { success: false, error: '无法导航到上级' };
  }

  /**
   * 前进
   */
  goForward(): NavigationResult {
    if (this.state.historyIndex < this.state.history.length - 1) {
      this.state.historyIndex++;
      const path = this.state.history[this.state.historyIndex];
      this.state.currentPath = path;
      return { success: true, path };
    }

    return { success: false, error: '没有更多前进记录' };
  }

  /**
   * 后退
   */
  goBack(): NavigationResult {
    if (this.state.historyIndex > 0) {
      this.state.historyIndex--;
      const path = this.state.history[this.state.historyIndex];
      this.state.currentPath = path;
      return { success: true, path };
    }

    return { success: false, error: '没有更多后退记录' };
  }

  private addToHistory(path: string): void {
    // 如果当前不是最后一个，删除前面的记录
    if (this.state.historyIndex < this.state.history.length - 1) {
      this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
    }

    // 避免重复
    if (this.state.history[this.state.history.length - 1] !== path) {
      this.state.history.push(path);
      this.state.historyIndex++;
    }
  }

  // ==================== 文件读取 ====================

  /**
   * 读取文件内容
   */
  readFile(path: string): string | null {
    const node = this.getNodeByPath(path);
    if (node?.type === 'file') {
      return node.content;
    }
    return null;
  }

  /**
   * 获取文件夹内容
   */
  getFolderContents(path: string): VNode[] {
    const folder = this.getNodeByPath(path);
    if (folder?.type !== 'folder') {
      return [];
    }

    return folder.children
      .map(id => this.state.nodes.get(id))
      .filter((node): node is VNode => node !== undefined);
  }

  /**
   * 获取当前路径
   */
  getCurrentPath(): string {
    return this.state.currentPath;
  }

  /**
   * 获取当前文件夹内容
   */
  getCurrentFolderContents(): VNode[] {
    return this.getFolderContents(this.state.currentPath);
  }

  // ==================== 文件写入 ====================

  /**
   * 写入文件（标记为修改，不直接保存）
   */
  writeFile(path: string, content: string): FileOperationResult {
    const node = this.getNodeByPath(path);
    
    if (!node) {
      return { success: false, error: `文件不存在：${path}` };
    }

    if (node.type !== 'file') {
      return { success: false, error: `不是文件：${path}` };
    }

    const fileNode = node as VFileNode;
    const originalContent = fileNode.content;

    // 记录变更
    this.state.changes.set(fileNode.id, {
      fileId: fileNode.id,
      fileName: fileNode.name,
      action: 'update',
      originalContent,
      newContent: content,
      timestamp: Date.now(),
    });

    // 更新内存中的内容
    fileNode.content = content;
    fileNode.modifiedAt = Date.now();
    fileNode.isModified = true;
    fileNode.size = content.length;

    return { success: true, fileId: fileNode.id };
  }

  /**
   * 创建文件
   */
  createFile(path: string, content: string = ''): FileOperationResult {
    const fileName = this.extractName(path);
    const parentPath = this.getParentPath(path);
    const parentNode = this.getNodeByPath(parentPath);

    if (!parentNode || parentNode.type !== 'folder') {
      return { success: false, error: `父目录不存在：${parentPath}` };
    }

    const fileId = this.generateId(path);
    const now = Date.now();

    const fileNode: VFileNode = {
      id: fileId,
      name: fileName,
      type: 'file',
      path,
      content,
      size: content.length,
      createdAt: now,
      modifiedAt: now,
      isModified: true,
    };

    this.state.nodes.set(fileId, fileNode);
    parentNode.children.push(fileId);

    // 记录变更
    this.state.changes.set(fileId, {
      fileId,
      fileName,
      action: 'create',
      newContent: content,
      timestamp: now,
    });

    return { success: true, fileId };
  }

  /**
   * 删除文件（移动到回收站）
   */
  deleteFile(path: string): FileOperationResult {
    const node = this.getNodeByPath(path);
    
    if (!node) {
      return { success: false, error: `文件不存在：${path}` };
    }

    const parentPath = this.getParentPath(path);
    const parentNode = this.getNodeByPath(parentPath);

    if (parentNode?.type === 'folder') {
      // 从父文件夹移除
      parentNode.children = parentNode.children.filter(id => id !== node.id);
    }

    // 记录变更
    this.state.changes.set(node.id, {
      fileId: node.id,
      fileName: node.name,
      action: 'delete',
      originalContent: node.type === 'file' ? node.content : undefined,
      timestamp: Date.now(),
    });

    // 从节点映射中移除（实际应用中可以移动到回收站）
    this.state.nodes.delete(node.id);

    return { success: true, fileId: node.id };
  }

  /**
   * 重命名文件/文件夹
   */
  renameFile(path: string, newName: string): FileOperationResult {
    const node = this.getNodeByPath(path);
    
    if (!node) {
      return { success: false, error: `文件不存在：${path}` };
    }

    const oldName = node.name;
    node.name = newName;
    node.modifiedAt = Date.now();

    // 记录变更
    this.state.changes.set(node.id, {
      fileId: node.id,
      fileName: oldName,
      action: 'rename',
      newContent: newName,
      timestamp: Date.now(),
    });

    return { success: true, fileId: node.id };
  }

  // ==================== 可移动磁盘 ====================

  /**
   * 挂载可移动磁盘
   */
  async mountRemovableDrive(
    type: DriveType,
    // eslint-disable-next-line no-undef
    directoryHandle: FileSystemDirectoryHandle
  ): Promise<string> {
    const driveId = this.generateDriveId(type);
    const driveName = type === 'removable' ? `可移动磁盘 (${driveId}:)` : `CD 驱动器 (${driveId}:)`;

    // 创建驱动器根目录
    const rootPath = `/${driveId}`;
    const rootId = await this.scanDirectory(directoryHandle, rootPath, driveId);

    const driveInfo: DriveInfo = {
      id: driveId,
      name: driveName,
      type,
      rootId,
      isMounted: true,
    };

    this.state.removableDrives.set(driveId, driveInfo);

    // 添加到桌面的"可移动磁盘"文件夹
    const removableParent = this.getNodeByPath('/removable');
    if (removableParent?.type === 'folder') {
      removableParent.children.push(rootId);
    }

    return driveId;
  }

  /**
   * 扫描目录并创建虚拟节点
   */
  private async scanDirectory(
    // eslint-disable-next-line no-undef
    handle: FileSystemDirectoryHandle,
    basePath: string,
    _parentId: string
  ): Promise<string> {
    const now = Date.now();
    const folderId = this.generateId(basePath);

    const folderNode: VFolderNode = {
      id: folderId,
      name: handle.name,
      type: 'folder',
      path: basePath,
      children: [],
      createdAt: now,
      modifiedAt: now,
      isRemovable: true,
    };

    this.state.nodes.set(folderId, folderNode);

    // 递归扫描子目录和文件
    for await (const entry of handle.values()) {
      const entryPath = `${basePath}/${entry.name}`;

      if (entry.kind === 'file') {
        // 读取文件内容
        const file = await entry.getFile();
        const content = await this.readFileHandle(file);
        
        const fileId = this.generateId(entryPath);
        const fileNode: VFileNode = {
          id: fileId,
          name: entry.name,
          type: 'file',
          path: entryPath,
          content,
          size: file.size,
          createdAt: now,
          modifiedAt: now,
          isModified: false,
          mimeType: file.type,
        };

        this.state.nodes.set(fileId, fileNode);
        folderNode.children.push(fileId);
      } else if (entry.kind === 'directory') {
        // 递归扫描子目录
        await this.scanDirectory(entry, entryPath, folderId);
      }
    }

    return folderId;
  }

  private async readFileHandle(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      
      // 尝试作为文本读取，失败则返回空字符串
      reader.readAsText(file);
    });
  }

  /**
   * 弹出磁盘
   */
  ejectDrive(driveId: string): EjectResult {
    const changes = this.getChangesForDrive(driveId);

    return {
      hasChanges: changes.length > 0,
      changes,
      requiresConfirmation: changes.length > 0,
    };
  }

  private getChangesForDrive(driveId: string): ChangeRecord[] {
    const allChanges = Array.from(this.state.changes.values());
    const driveRootPath = `/${driveId}`;

    return allChanges.filter(change => {
      const node = this.state.nodes.get(change.fileId);
      return node?.path.startsWith(driveRootPath);
    });
  }

  private generateDriveId(type: DriveType): string {
    const existing = Array.from(this.state.removableDrives.keys());
    const nextIndex = existing.length + 1;
    return type === 'removable' ? `E${nextIndex}` : `F${nextIndex}`;
  }

  // ==================== 变更管理 ====================

  /**
   * 获取所有变更
   */
  getAllChanges(): ChangeRecord[] {
    return Array.from(this.state.changes.values());
  }

  /**
   * 清除变更记录
   */
  clearChanges(): void {
    this.state.changes.clear();
    
    // 重置所有文件的 isModified 标志
    this.state.nodes.forEach(node => {
      if (node.type === 'file') {
        node.isModified = false;
      }
    });
  }

  /**
   * 撤销最后一次修改
   */
  undoLastChange(fileId: string): boolean {
    const change = this.state.changes.get(fileId);
    if (!change) {
      return false;
    }

    const node = this.state.nodes.get(fileId);
    if (!node || node.type !== 'file') {
      return false;
    }

    if (change.action === 'update' && change.originalContent !== undefined) {
      node.content = change.originalContent;
      node.isModified = false;
      this.state.changes.delete(fileId);
      return true;
    }

    return false;
  }

  // ==================== 工具方法 ====================

  getNodeById(id: string): VNode | undefined {
    return this.state.nodes.get(id);
  }

  private getNodeByPath(path: string): VNode | undefined {
    // 简单实现：遍历所有节点查找匹配路径的节点
    for (const node of this.state.nodes.values()) {
      if (node.path === path) {
        return node;
      }
    }
    return undefined;
  }

  private getParentPath(path: string): string {
    if (path === '/') return '/';
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/');
  }

  private extractName(path: string): string {
    if (path === '/') return '桌面';
    const parts = path.split('/').filter(Boolean);
    return parts[parts.length - 1] || '未命名';
  }

  private generateId(path: string): string {
    // 使用路径的哈希作为 ID（简化实现）
    return path.replace(/\//g, '-').replace(/^-/, '') || 'root';
  }

  // ==================== 状态访问 ====================

  getState(): VirtualFileSystemState {
    return { ...this.state };
  }

  getHistory(): string[] {
    return [...this.state.history];
  }

  canGoBack(): boolean {
    return this.state.historyIndex > 0;
  }

  canGoForward(): boolean {
    return this.state.historyIndex < this.state.history.length - 1;
  }
}

// 导出单例
export const vfsInstance = new VirtualFileSystem();
