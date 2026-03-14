/**
 * 静态文件系统配置
 * 从 fs/ 目录结构生成
 */

// 复用现有的内容模块
import { contentFiles, getFileContent as getExistingContent } from '../../../content';

// 默认的静态文件系统结构
export const StaticFileSystem = {
  '/': {
    type: 'folder',
    name: '桌面',
    children: ['my-blog', 'my-documents', 'my-pictures', 'my-computer', 'recycle-bin', 'removable'],
  },
  
  // 我的博客
  '/my-blog': {
    type: 'folder',
    name: '我的博客',
    icon: 'folder',
    children: ['hello-world', 'tech-notes', 'life-diary', 'win95-style-website'],
  },
  '/my-blog/hello-world': {
    type: 'file',
    name: 'Hello World.txt',
    app: 'notepad',
    extension: 'txt',
    postId: 'hello-world',
  },
  '/my-blog/tech-notes': {
    type: 'file',
    name: '技术笔记.txt',
    app: 'notepad',
    extension: 'txt',
    postId: 'tech-notes',
  },
  '/my-blog/life-diary': {
    type: 'file',
    name: '生活日记.txt',
    app: 'notepad',
    extension: 'txt',
    postId: 'life-diary',
  },
  '/my-blog/win95-style-website': {
    type: 'file',
    name: 'Win95风格网站.txt',
    app: 'notepad',
    extension: 'txt',
    postId: 'win95-style-website',
  },

  // 我的文档
  '/my-documents': {
    type: 'folder',
    name: '我的文档',
    icon: 'folder',
    children: ['readme', 'notes'],
  },
  '/my-documents/readme': {
    type: 'file',
    name: 'README.txt',
    app: 'notepad',
    extension: 'txt',
    postId: 'readme',
  },
  '/my-documents/notes': {
    type: 'file',
    name: '便签.txt',
    app: 'notepad',
    extension: 'txt',
    postId: 'notes',
  },

  // 我的图片
  '/my-pictures': {
    type: 'folder',
    name: '我的图片',
    icon: 'picture',
    children: [],
  },

  // 我的电脑
  '/my-computer': {
    type: 'root',
    name: '我的电脑',
    icon: 'my-computer',
    children: ['c-drive', 'd-drive'],
  },
  '/my-computer/c-drive': {
    type: 'drive',
    name: 'C:',
    icon: 'drive',
    driveType: 'fixed',
    totalSpace: '256GB',
    freeSpace: '128GB',
    children: ['windows', 'program-files', 'users'],
  },
  '/my-computer/c-drive/windows': {
    type: 'folder',
    name: 'Windows',
    icon: 'folder',
    system: true,
    children: [],
  },
  '/my-computer/c-drive/program-files': {
    type: 'folder',
    name: 'Program Files',
    icon: 'folder',
    children: [],
  },
  '/my-computer/c-drive/users': {
    type: 'folder',
    name: 'Users',
    icon: 'folder',
    children: ['guest', 'admin'],
  },
  '/my-computer/c-drive/users/guest': {
    type: 'folder',
    name: 'Guest',
    icon: 'folder',
    children: [],
  },
  '/my-computer/c-drive/users/admin': {
    type: 'folder',
    name: 'Admin',
    icon: 'folder',
    children: ['desktop', 'documents', 'downloads'],
  },
  '/my-computer/c-drive/users/admin/desktop': {
    type: 'folder',
    name: 'Desktop',
    icon: 'folder',
    children: [],
  },
  '/my-computer/c-drive/users/admin/documents': {
    type: 'folder',
    name: 'Documents',
    icon: 'folder',
    children: [],
  },
  '/my-computer/c-drive/users/admin/downloads': {
    type: 'folder',
    name: 'Downloads',
    icon: 'folder',
    children: [],
  },

  // D盘
  '/my-computer/d-drive': {
    type: 'drive',
    name: 'D:',
    icon: 'drive',
    driveType: 'fixed',
    totalSpace: '512GB',
    freeSpace: '256GB',
    children: [],
  },

  // 回收站
  '/recycle-bin': {
    type: 'folder',
    name: '回收站',
    icon: 'recycle-bin',
    children: [],
  },

  // 可移动磁盘占位符
  '/removable': {
    type: 'placeholder',
    name: '可移动磁盘',
    icon: 'drive-removable',
    mountable: true,
    children: [],
  },
};

/**
 * 获取文件内容
 */
export function getFileContent(filePath) {
  const node = StaticFileSystem[filePath];
  if (node && node.postId) {
    return getExistingContent(node.postId);
  }
  return '';
}

/**
 * 获取文件内容的替代方法（用于postId查找）
 */
export function getFileContentById(postId) {
  return getExistingContent(postId) || '';
}

export default StaticFileSystem;
