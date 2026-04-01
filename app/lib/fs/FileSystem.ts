/**
 * 虚拟文件系统核心类
 * 支持静态文件系统定义和动态挂载
 */

// 文件/文件夹类型
export const NodeType = {
  FOLDER: 'folder',
  FILE: 'file',
  DRIVE: 'drive',
  ROOT: 'root',
  PLACEHOLDER: 'placeholder', // 可挂载的占位符
} as const;

export type NodeTypeValue = typeof NodeType[keyof typeof NodeType];

// 驱动器类型
export const DriveType = {
  FIXED: 'fixed',
  REMOVABLE: 'removable',
  NETWORK: 'network',
  VIRTUAL: 'virtual',
} as const;

export type DriveTypeValue = typeof DriveType[keyof typeof DriveType];

export interface FSNodeOptions {
  id?: string;
  name?: string;
  type?: NodeTypeValue;
  icon?: string;
  description?: string;
  parent?: FSNode | null;
  path?: string;
  createdAt?: string;
  modifiedAt?: string;
  [key: string]: any;
}

/**
 * 文件系统节点基类
 */
export class FSNode {
  id: string;
  name: string;
  type: NodeTypeValue;
  icon: string;
  description: string;
  parent: FSNode | null;
  path: string;
  createdAt: string;
  modifiedAt: string;

  constructor(options: FSNodeOptions = {}) {
    this.id = options.id || `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.name = options.name || '未命名';
    this.type = options.type || NodeType.FOLDER;
    this.icon = options.icon || 'folder';
    this.description = options.description || '';
    this.parent = options.parent || null;
    this.path = options.path || '/';
    this.createdAt = options.createdAt || new Date().toISOString();
    this.modifiedAt = options.modifiedAt || new Date().toISOString();
  }

  isFolder(): boolean {
    return this.type === NodeType.FOLDER ||
      this.type === NodeType.DRIVE ||
      this.type === NodeType.ROOT ||
      this.type === NodeType.PLACEHOLDER;
  }

  isFile(): boolean {
    return this.type === NodeType.FILE;
  }

  isMountable(): boolean {
    return this.type === NodeType.PLACEHOLDER;
  }
}

export interface FolderNodeOptions extends FSNodeOptions {
  children?: FSNode[];
}

/**
 * 文件夹节点
 */
export class FolderNode extends FSNode {
  children: FSNode[];
  expanded: boolean;

  constructor(options: FolderNodeOptions = {}) {
    super(options);
    this.type = NodeType.FOLDER;
    this.children = options.children || [];
    this.expanded = false;
  }

  addChild(node: FSNode): FSNode {
    node.parent = this;
    this.children.push(node);
    return node;
  }

  removeChild(nodeId: string): boolean {
    const index = this.children.findIndex(c => c.id === nodeId);
    if (index !== -1) {
      this.children.splice(index, 1);
      return true;
    }
    return false;
  }

  getChild(name: string): FSNode | undefined {
    return this.children.find(c => c.name === name);
  }
}

export interface FileNodeOptions extends FSNodeOptions {
  content?: string | null;
  app?: string;
  size?: number;
  extension?: string;
  encoding?: string;
}

/**
 * 文件节点
 */
export class FileNode extends FSNode {
  content: string | null;
  app: string;
  size: number;
  extension: string;
  encoding: string;
  _handle?: any;
  _file?: any;

  constructor(options: FileNodeOptions = {}) {
    super(options);
    this.type = NodeType.FILE;
    this.content = options.content !== undefined ? options.content : '';
    this.app = options.app || 'notepad';
    this.size = options.size || 0;
    this.extension = options.extension || '';
    this.encoding = options.encoding || 'utf-8';
  }

  async getContent(): Promise<string | null> {
    return this.content;
  }

  async setContent(content: string): Promise<void> {
    this.content = content;
    this.size = content.length;
    this.modifiedAt = new Date().toISOString();
  }
}

export interface DriveNodeOptions extends FolderNodeOptions {
  driveType?: DriveTypeValue;
  totalSpace?: number | string;
  freeSpace?: number | string;
  mountPoint?: string | null;
}

/**
 * 驱动器节点
 */
export class DriveNode extends FolderNode {
  driveType: DriveTypeValue;
  totalSpace: number | string;
  freeSpace: number | string;
  mountPoint: string | null;

  constructor(options: DriveNodeOptions = {}) {
    super(options);
    this.type = NodeType.DRIVE;
    this.driveType = options.driveType || DriveType.VIRTUAL;
    this.totalSpace = options.totalSpace || 0;
    this.freeSpace = options.freeSpace || 0;
    this.mountPoint = options.mountPoint || null;
  }

  isRemovable(): boolean {
    return this.driveType === DriveType.REMOVABLE;
  }
}

export interface NodeData {
  type?: NodeTypeValue;
  name?: string;
  icon?: string;
  children?: string[];
  app?: string;
  content?: string;
  postId?: string;
  driveType?: DriveTypeValue;
  totalSpace?: number | string;
  freeSpace?: number | string;
  [key: string]: any;
}

export interface FileSystemNode {
  type: 'file' | 'folder' | 'drive';
  name: string;
  content?: string;
  children?: FSNode[];
  parentId?: string;
  size?: number;
  createdAt?: Date;
  updatedAt?: Date;
  icon?: string;
  app?: string;
  postId?: string; // 用于博客文章ID
}

export class FileSystem {
  private nodes: Map<string, FSNode> = new Map();
  private rootNode: FolderNode;

  constructor(initialStructure?: any) {
    // 初始化根节点
    this.rootNode = new FolderNode({
      id: '/',
      name: 'Root',
      path: '/',
      icon: 'folder',
      children: [],
    });
    this.nodes.set('/', this.rootNode);

    if (initialStructure) {
      this.buildFromStructure(initialStructure, '/');
    }
  }

  private getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }

  private getAppForExtension(extension: string): string {
    // 根据文件扩展名返回相应的应用程序
    switch (extension) {
      case 'txt':
        return 'notepad';
      case 'md':
        return 'markdown-editor';
      case 'json':
        return 'json-viewer';
      default:
        return 'default-app';
    }
  }

  private buildNodeFromData(data: any, path: string): FSNode {
    if (data.type === 'folder' || data.type === 'root' || data.type === 'placeholder') {
      return new FolderNode({
        id: path,
        name: data.name || path,
        path,
        icon: data.icon || 'folder',
        type: data.type, // 保留原始类型（folder、root 或 placeholder）
        children: [],
      });
    } else if (data.type === 'file') {
      return new FileNode({
        id: path,
        name: data.name || path,
        path,
        icon: data.icon || 'file',
        content: data.content,
        size: data.size || 0,
        extension: this.getFileExtension(data.name || path),
        app: this.getAppForExtension(this.getFileExtension(data.name || path)),
        encoding: data.encoding || 'utf-8',
      });
    } else if (data.type === 'drive') {
      return new DriveNode({
        id: path,
        name: data.name || path,
        path,
        icon: data.icon || 'drive-removable',
        children: [],
        driveType: data.driveType || DriveType.VIRTUAL,
        totalSpace: data.totalSpace || 0,
        freeSpace: data.freeSpace || 0,
        mountPoint: data.mountPoint || path,
      });
    } else {
      throw new Error(`Unknown node type: ${data.type}`);
    }
  }

private buildFromStructure(structure: any, parentPath: string): void {
  Object.entries(structure).forEach(([path, nodeData]) => {
    const fullPath = path === '/' ? '/' : `${parentPath}${parentPath === '/' ? '' : '/'}${path}`;
    
    if (typeof nodeData === 'object' && nodeData !== null) {
      const data = nodeData as NodeData;
      const node = this.buildNodeFromData(data, fullPath);
      this.nodes.set(fullPath, node);
      
      if (data.children && typeof data.children === 'object') {
        Object.entries(data.children).forEach(([childPath, childData]) => {
          this.buildFromStructure({ [childPath]: childData }, fullPath);
        });
      }
    }
  });
}

getNode(path: string): FSNode | null {
  return this.nodes.get(path) || null;
}

listDirectory(path: string): FSNode[] {
  const node = this.getNode(path);
  if (!node || !node.isFolder()) {
    return [];
  }

  const folderNode = node as FolderNode;
  return folderNode.children || [];
}

  async readFile(path: string): Promise<string> {
    const node = this.getNode(path);
    if (!node || !node.isFile()) {
      throw new Error(`File not found: ${path}`);
    }
    const fileNode = node as FileNode;
    return fileNode.content || '';
  }

async writeFile(path: string, content: string): Promise<void> {
  const pathParts = path.split('/').filter(Boolean);
  const fileName = pathParts[pathParts.length - 1] || '';
  const parentPath = '/' + pathParts.slice(0, -1).join('/');

  // 创建父级目录（如果不存在）
  if (parentPath !== '/' && !this.getNode(parentPath)) {
    await this.createDirectory(parentPath);
  }

  const fileNode = new FileNode({
    id: path,
    name: fileName,
    path,
    content,
    size: new Blob([content]).size,
    app: this.getAppForExtension(this.getFileExtension(fileName)),
    encoding: 'utf-8',
    updatedAt: new Date(),
  });

  this.nodes.set(path, fileNode);

  // 更新父目录的子节点列表
  if (parentPath && parentPath !== path) {
    const parentNode = this.getNode(parentPath);
    if (parentNode && parentNode.type === 'folder') {
      (parentNode as FolderNode).addChild(fileNode);
      this.nodes.set(parentPath, parentNode);
    }
  }
  }

  async createDirectory(path: string): Promise<void> {
    const pathParts = path.split('/').filter(Boolean);
    const dirName = pathParts[pathParts.length - 1] || '';
    const parentPath = '/' + pathParts.slice(0, -1).join('/');

    // 检查目录是否已存在
    if (this.getNode(path)) {
      return;
    }

    // 创建父级目录（如果不存在）
    if (parentPath !== '/' && !this.getNode(parentPath)) {
      await this.createDirectory(parentPath);
    }

    const dirNode = new FolderNode({
      id: path,
      name: dirName,
      path,
      icon: 'folder',
      children: [],
    });

    this.nodes.set(path, dirNode);

    // 更新父目录的子节点列表
    if (parentPath && parentPath !== path) {
      const parentNode = this.getNode(parentPath);
      if (parentNode && parentNode.type === 'folder') {
        (parentNode as FolderNode).addChild(dirNode);
        this.nodes.set(parentPath, parentNode);
      }
    }
  }

async mountDirectory(mountPath: string, dirHandle: any): Promise<void> {
  // 在实际实现中，这里会连接到真实的文件系统
  // 当前模拟实现仅添加一个占位符节点
  const placeholderNode = new FolderNode({
    id: mountPath,
    name: '可移动磁盘',
    path: mountPath,
    icon: 'drive-removable',
    children: [],
  });

  this.nodes.set(mountPath, placeholderNode);
}

  // 可移动磁盘管理器需要的方法
async mountDrive(mountPath: string, driveNode: DriveNode) {
  this.nodes.set(mountPath, driveNode);
}

  unmountDrive(mountPath: string): boolean {
    return this.nodes.delete(mountPath);
  }

  getMountedDrives(): DriveNode[] {
    const drives: DriveNode[] = [];
    this.nodes.forEach((node, path) => {
      if (path.startsWith('/removable/') && node.type === 'drive') {
        drives.push(node as any);
      }
    });
    return drives;
  }
}

export default FileSystem;
