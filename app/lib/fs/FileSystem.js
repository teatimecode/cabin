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
};

// 驱动器类型
export const DriveType = {
  FIXED: 'fixed',       // 固定磁盘
  REMOVABLE: 'removable', // 可移动磁盘
  NETWORK: 'network',   // 网络驱动器
  VIRTUAL: 'virtual',   // 虚拟驱动器
};

/**
 * 文件系统节点基类
 */
export class FSNode {
  constructor(options = {}) {
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

  isFolder() {
    return this.type === NodeType.FOLDER || 
           this.type === NodeType.DRIVE || 
           this.type === NodeType.ROOT;
  }

  isFile() {
    return this.type === NodeType.FILE;
  }

  isMountable() {
    return this.type === NodeType.PLACEHOLDER;
  }
}

/**
 * 文件夹节点
 */
export class FolderNode extends FSNode {
  constructor(options = {}) {
    super(options);
    this.type = NodeType.FOLDER;
    this.children = options.children || [];
    this.expanded = false;
  }

  addChild(node) {
    node.parent = this;
    this.children.push(node);
    return node;
  }

  removeChild(nodeId) {
    const index = this.children.findIndex(c => c.id === nodeId);
    if (index !== -1) {
      this.children.splice(index, 1);
      return true;
    }
    return false;
  }

  getChild(name) {
    return this.children.find(c => c.name === name);
  }
}

/**
 * 文件节点
 */
export class FileNode extends FSNode {
  constructor(options = {}) {
    super(options);
    this.type = NodeType.FILE;
    this.content = options.content || '';
    this.app = options.app || 'notepad'; // 默认用记事本打开
    this.size = options.size || 0;
    this.extension = options.extension || '';
    this.encoding = options.encoding || 'utf-8';
  }

  // 获取文件内容
  async getContent() {
    return this.content;
  }

  // 设置文件内容
  async setContent(content) {
    this.content = content;
    this.size = content.length;
    this.modifiedAt = new Date().toISOString();
  }
}

/**
 * 驱动器节点
 */
export class DriveNode extends FolderNode {
  constructor(options = {}) {
    super(options);
    this.type = NodeType.DRIVE;
    this.driveType = options.driveType || DriveType.VIRTUAL;
    this.totalSpace = options.totalSpace || 0;
    this.freeSpace = options.freeSpace || 0;
    this.mountPoint = options.mountPoint || null; // 挂载点（用于可移动磁盘）
  }

  isRemovable() {
    return this.driveType === DriveType.REMOVABLE;
  }
}

/**
 * 文件系统管理器
 */
export class FileSystem {
  constructor() {
    this.root = new FolderNode({ id: '/', name: '桌面', path: '/' });
    this.nodeMap = new Map([['/', this.root]]);
    this.mountedDrives = new Map();
  }

  /**
   * 从JSON结构构建文件系统
   */
  buildFromJson(jsonStructure) {
    Object.entries(jsonStructure).forEach(([path, nodeData]) => {
      this.addNode(path, nodeData);
    });
    return this;
  }

  /**
   * 添加节点
   */
  addNode(path, nodeData) {
    const parentPath = this.getParentPath(path);
    const parentNode = this.nodeMap.get(parentPath);

    if (!parentNode && parentPath !== '/') {
      console.warn(`Parent path not found: ${parentPath}`);
      return null;
    }

    let node;
    if (nodeData.type === NodeType.FILE) {
      node = new FileNode({
        ...nodeData,
        id: path,
        path: path,
        parent: parentNode,
      });
    } else if (nodeData.type === NodeType.DRIVE) {
      node = new DriveNode({
        ...nodeData,
        id: path,
        path: path,
        parent: parentNode,
      });
    } else {
      node = new FolderNode({
        ...nodeData,
        id: path,
        path: path,
        parent: parentNode,
      });
    }

    this.nodeMap.set(path, node);
    
    if (parentNode) {
      parentNode.addChild(node);
    }

    return node;
  }

  /**
   * 获取父路径
   */
  getParentPath(path) {
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/');
  }

  /**
   * 获取节点
   */
  getNode(path) {
    return this.nodeMap.get(path);
  }

  /**
   * 获取目录内容
   */
  listDirectory(path) {
    const node = this.nodeMap.get(path);
    if (!node || !node.isFolder()) {
      return [];
    }
    return node.children || [];
  }

  /**
   * 查找节点（支持模糊搜索）
   */
  findNode(query, startPath = '/') {
    const results = [];
    const startNode = this.nodeMap.get(startPath);
    
    if (!startNode) return results;

    const search = (node) => {
      if (node.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(node);
      }
      if (node.children) {
        node.children.forEach(search);
      }
    };

    search(startNode);
    return results;
  }

  /**
   * 挂载驱动器
   */
  async mountDrive(mountPath, driveNode) {
    const existingNode = this.nodeMap.get(mountPath);
    
    if (existingNode && existingNode.isMountable()) {
      // 替换占位符
      const parent = existingNode.parent;
      if (parent) {
        parent.removeChild(existingNode.id);
        driveNode.id = mountPath;
        driveNode.path = mountPath;
        driveNode.parent = parent;
        parent.addChild(driveNode);
      }
    } else {
      // 添加新驱动器
      const parentPath = this.getParentPath(mountPath);
      const parentNode = this.nodeMap.get(parentPath);
      
      if (parentNode) {
        driveNode.id = mountPath;
        driveNode.path = mountPath;
        driveNode.parent = parentNode;
        parentNode.addChild(driveNode);
      }
    }

    this.nodeMap.set(mountPath, driveNode);
    this.mountedDrives.set(mountPath, driveNode);
    
    // 递归添加子节点到nodeMap
    if (driveNode.children) {
      this.addNodeToMap(driveNode);
    }

    return driveNode;
  }

  /**
   * 递归添加节点到nodeMap
   */
  addNodeToMap(node) {
    this.nodeMap.set(node.path, node);
    if (node.children) {
      node.children.forEach(child => this.addNodeToMap(child));
    }
  }

  /**
   * 卸载驱动器
   */
  async unmountDrive(mountPath) {
    const driveNode = this.mountedDrives.get(mountPath);
    if (!driveNode) return false;

    const parent = driveNode.parent;
    if (parent) {
      parent.removeChild(driveNode.id);
    }

    // 从nodeMap中移除所有子节点
    this.removeNodeFromMap(driveNode);
    this.mountedDrives.delete(mountPath);

    return true;
  }

  /**
   * 递归从nodeMap移除节点
   */
  removeNodeFromMap(node) {
    this.nodeMap.delete(node.path);
    if (node.children) {
      node.children.forEach(child => this.removeNodeFromMap(child));
    }
  }

  /**
   * 获取挂载的驱动器列表
   */
  getMountedDrives() {
    return Array.from(this.mountedDrives.values());
  }

  /**
   * 导出为JSON结构
   */
  toJson() {
    const result = {};
    this.nodeMap.forEach((node, path) => {
      result[path] = {
        type: node.type,
        name: node.name,
        icon: node.icon,
        children: node.children ? node.children.map(c => {
          const id = c.id || c.path || '';
          return id.split('/').pop();
        }).filter(Boolean) : undefined,
        app: node.app,
        content: node.content,
        postId: node.postId,
        driveType: node.driveType,
        totalSpace: node.totalSpace,
        freeSpace: node.freeSpace,
      };
    });
    return result;
  }
}

export default FileSystem;
