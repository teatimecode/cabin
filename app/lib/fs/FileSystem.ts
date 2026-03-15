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
      this.type === NodeType.ROOT;
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

/**
 * 文件系统管理器
 */
export class FileSystem {
  root: FolderNode;
  nodeMap: Map<string, FSNode>;
  mountedDrives: Map<string, DriveNode>;

  constructor() {
    this.root = new FolderNode({ id: '/', name: '桌面', path: '/' });
    this.nodeMap = new Map([['/', this.root]]);
    this.mountedDrives = new Map();
  }

  buildFromJson(jsonStructure: Record<string, NodeData>): this {
    Object.entries(jsonStructure).forEach(([path, nodeData]) => {
      this.addNode(path, nodeData);
    });
    return this;
  }

  addNode(path: string, nodeData: NodeData): FSNode | null {
    const parentPath = this.getParentPath(path);
    const parentNode = this.nodeMap.get(parentPath) as FolderNode | undefined;

    if (!parentNode && parentPath !== '/') {
      console.warn(`Parent path not found: ${parentPath}`);
      return null;
    }

    // 排除children属性，因为它可能是string[]类型，而构造函数期望FSNode[]
    const { children, ...restData } = nodeData;

    let node: FSNode;
    if (nodeData.type === NodeType.FILE) {
      node = new FileNode({ ...restData, id: path, path, parent: parentNode });
    } else if (nodeData.type === NodeType.DRIVE) {
      node = new DriveNode({ ...restData, id: path, path, parent: parentNode });
    } else {
      node = new FolderNode({ ...restData, id: path, path, parent: parentNode });
    }

    this.nodeMap.set(path, node);
    if (parentNode) {
      (parentNode as FolderNode).addChild(node);
    }

    return node;
  }

  getParentPath(path: string): string {
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/');
  }

  getNode(path: string): FSNode | undefined {
    return this.nodeMap.get(path);
  }

  listDirectory(path: string): FSNode[] {
    const node = this.nodeMap.get(path);
    if (!node || !node.isFolder()) return [];
    return (node as FolderNode).children || [];
  }

  findNode(query: string, startPath = '/'): FSNode[] {
    const results: FSNode[] = [];
    const startNode = this.nodeMap.get(startPath) as FolderNode | undefined;
    if (!startNode) return results;

    const search = (node: FSNode) => {
      if (node.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(node);
      }
      if ((node as FolderNode).children) {
        (node as FolderNode).children.forEach(search);
      }
    };

    search(startNode);
    return results;
  }

  async mountDrive(mountPath: string, driveNode: DriveNode): Promise<DriveNode> {
    const existingNode = this.nodeMap.get(mountPath);
    if (existingNode && existingNode.isMountable()) {
      const parent = existingNode.parent as FolderNode | null;
      if (parent) {
        parent.removeChild(existingNode.id);
        driveNode.id = mountPath;
        driveNode.path = mountPath;
        driveNode.parent = parent;
        parent.addChild(driveNode);
      }
    } else {
      const parentPath = this.getParentPath(mountPath);
      const parentNode = this.nodeMap.get(parentPath) as FolderNode | undefined;
      if (parentNode) {
        driveNode.id = mountPath;
        driveNode.path = mountPath;
        driveNode.parent = parentNode;
        parentNode.addChild(driveNode);
      }
    }

    this.nodeMap.set(mountPath, driveNode);
    this.mountedDrives.set(mountPath, driveNode);
    if (driveNode.children) {
      this.addNodeToMap(driveNode);
    }
    return driveNode;
  }

  addNodeToMap(node: FSNode): void {
    this.nodeMap.set(node.path, node);
    if ((node as FolderNode).children) {
      (node as FolderNode).children.forEach(child => this.addNodeToMap(child));
    }
  }

  async unmountDrive(mountPath: string): Promise<boolean> {
    const driveNode = this.mountedDrives.get(mountPath);
    if (!driveNode) return false;

    const parent = driveNode.parent as FolderNode | null;
    if (parent) {
      parent.removeChild(driveNode.id);
    }
    this.removeNodeFromMap(driveNode);
    this.mountedDrives.delete(mountPath);
    return true;
  }

  removeNodeFromMap(node: FSNode): void {
    this.nodeMap.delete(node.path);
    if ((node as FolderNode).children) {
      (node as FolderNode).children.forEach(child => this.removeNodeFromMap(child));
    }
  }

  getMountedDrives(): DriveNode[] {
    return Array.from(this.mountedDrives.values());
  }

  toJson(): Record<string, NodeData> {
    const result: Record<string, NodeData> = {};
    this.nodeMap.forEach((node, path) => {
      result[path] = {
        type: node.type,
        name: node.name,
        icon: node.icon,
        children: (node as FolderNode).children
          ? (node as FolderNode).children.map(c => {
              const id = c.id || c.path || '';
              return id.split('/').pop()!;
            }).filter(Boolean)
          : undefined,
        app: (node as FileNode).app,
        content: (node as FileNode).content ?? undefined,
        postId: (node as any).postId,
        driveType: (node as DriveNode).driveType,
        totalSpace: (node as DriveNode).totalSpace,
        freeSpace: (node as DriveNode).freeSpace,
      };
    });
    return result;
  }
}

export default FileSystem;
