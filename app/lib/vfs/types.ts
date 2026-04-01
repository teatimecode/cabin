// 虚拟文件系统类型定义

/** 节点类型 */
export type VNodeType = 'file' | 'folder' | 'removable' | 'cdrom';

/** 文件变更动作 */
export type ChangeAction = 'create' | 'update' | 'delete' | 'rename';

/** 驱动器类型 */
export type DriveType = 'removable' | 'cdrom';

/** 基础节点接口 */
export interface BaseVNode {
  id: string;
  name: string;
  path: string;
  createdAt: number;
  modifiedAt: number;
}

/** 文件节点 */
export interface VFileNode extends BaseVNode {
  type: 'file';
  content: string;
  mimeType?: string;
  size: number;
  isModified: boolean;
  metadata?: Record<string, any>;
}

/** 文件夹节点 */
export interface VFolderNode extends BaseVNode {
  type: 'folder';
  children: string[]; // 子节点 ID 列表
  isRoot?: boolean;
  isRemovable?: boolean;
}

/** 联合类型：所有节点类型 */
export type VNode = VFileNode | VFolderNode;

/** 驱动器信息 */
export interface DriveInfo {
  id: string;
  name: string;
  type: DriveType;
  rootId: string;
  isMounted: boolean;
}

/** 变更记录 */
export interface ChangeRecord {
  fileId: string;
  fileName: string;
  action: ChangeAction;
  originalContent?: string;
  newContent?: string;
  timestamp: number;
}

/** 虚拟文件系统状态 */
export interface VirtualFileSystemState {
  nodes: Map<string, VNode>;
  rootId: string;
  currentPath: string;
  history: string[];
  historyIndex: number;
  changes: Map<string, ChangeRecord>;
  removableDrives: Map<string, DriveInfo>;
}

/** 导出选项 */
export interface ExportOptions {
  filename?: string;
  includeDeleted?: boolean;
}

/** 弹出结果 */
export interface EjectResult {
  hasChanges: boolean;
  changes: ChangeRecord[];
  requiresConfirmation: boolean;
}

/** 变更报告 */
export interface ChangeReport {
  totalFiles: number;
  createdFiles: ChangeRecord[];
  updatedFiles: ChangeRecord[];
  deletedFiles: ChangeRecord[];
  timestamp: number;
}

/** 文件元数据（从 fs/ 目录读取） */
export interface FSMeta {
  name: string;
  type: 'file' | 'folder';
  icon?: string;
  description?: string;
  app?: string;
}

/** 导航结果 */
export interface NavigationResult {
  success: boolean;
  path?: string;
  error?: string;
}

/** 文件操作结果 */
export interface FileOperationResult {
  success: boolean;
  fileId?: string;
  error?: string;
}
