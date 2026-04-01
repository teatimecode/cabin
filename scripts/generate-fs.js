#!/usr/bin/env node

/**
 * 构建时虚拟文件系统元数据生成器
 * 
 * 功能：
 * 1. 从 content/index.ts 获取文件内容和元数据
 * 2. 生成完整的虚拟文件系统结构
 * 3. 输出到 app/lib/fs/staticConfig.ts
 */

const fs = require('fs');
const path = require('path');

// 读取所有 Markdown 文件内容并内联到生成的配置中
function readMarkdownFile(relativePath) {
  try {
    const fullPath = path.join(__dirname, '../', relativePath);
    return fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    console.warn('Warning: Could not read file ' + relativePath + ': ' + error.message);
    return '';
  }
}

// 构建完整的虚拟文件系统结构
const staticFileSystem = {
  '/': {
    type: 'folder',
    name: '桌面',
    children: {
      'my-computer': {
        type: 'root',
        name: '我的电脑',
        icon: 'my-computer',
        children: {
          'c-drive': {
            type: 'drive',
            name: 'C:',
            icon: 'drive',
            driveType: 'fixed',
            totalSpace: '256GB',
            freeSpace: '128GB',
            children: {
              'windows': {
                type: 'folder',
                name: 'Windows',
                icon: 'folder',
                system: true,
                children: {}
              },
              'program-files': {
                type: 'folder',
                name: 'Program Files',
                icon: 'folder',
                children: {}
              },
              'users': {
                type: 'folder',
                name: 'Users',
                icon: 'folder',
                children: {
                  'guest': {
                    type: 'folder',
                    name: 'Guest',
                    icon: 'folder',
                    children: {}
                  },
                  'admin': {
                    type: 'folder',
                    name: 'Admin',
                    icon: 'folder',
                    children: {
                      'desktop': {
                        type: 'folder',
                        name: 'Desktop',
                        icon: 'folder',
                        children: {}
                      },
                      'documents': {
                        type: 'folder',
                        name: 'Documents',
                        icon: 'folder',
                        children: {}
                      },
                      'downloads': {
                        type: 'folder',
                        name: 'Downloads',
                        icon: 'folder',
                        children: {}
                      }
                    }
                  }
                }
              }
            }
          },
          'd-drive': {
            type: 'drive',
            name: 'D:',
            icon: 'drive',
            driveType: 'fixed',
            totalSpace: '512GB',
            freeSpace: '256GB',
            children: {}
          }
        }
      },
      'recycle-bin': {
        type: 'folder',
        name: '回收站',
        icon: 'recycle-bin',
        children: {}
      },
      'my-documents': {
        type: 'folder',
        name: '我的文档',
        icon: 'folder',
        children: {
          'readme': {
            type: 'file',
            name: 'README.txt',
            app: 'notepad',
            extension: 'txt',
            content: readMarkdownFile('content/pages/readme.md')
          },
          'notes': {
            type: 'file',
            name: '便签.txt',
            app: 'notepad',
            extension: 'txt',
            content: readMarkdownFile('content/pages/notes.md')
          }
        }
      },
      'my-pictures': {
        type: 'folder',
        name: '我的图片',
        icon: 'picture',
        children: {}
      },
      'my-blog': {
        type: 'folder',
        name: '我的博客',
        icon: 'folder',
        children: {
          'hello-world': {
            type: 'file',
            name: 'Hello World.txt',
            app: 'notepad',
            extension: 'txt',
            content: readMarkdownFile('content/posts/hello-world.md')
          },
          'tech-notes': {
            type: 'file',
            name: '技术笔记.txt',
            app: 'notepad',
            extension: 'txt',
            content: readMarkdownFile('content/posts/tech-notes.md')
          },
          'life-diary': {
            type: 'file',
            name: '生活日记.txt',
            app: 'notepad',
            extension: 'txt',
            content: readMarkdownFile('content/posts/life-diary.md')
          },
          'win95-style-website': {
            type: 'file',
            name: 'Win95风格网站.txt',
            app: 'notepad',
            extension: 'txt',
            content: readMarkdownFile('content/posts/win95-style-website.md')
          }
        }
      },
      'removable': {
        type: 'folder',
        name: '可移动磁盘',
        icon: 'drive-removable',
        children: {
          'placeholder': {
            type: 'placeholder',
            name: '插入可移动磁盘',
            icon: 'drive-removable',
            mountable: true
          }
        }
      }
    }
  }
};

// 生成 TypeScript 文件内容（不包含任何导入语句）
const tsContent = `/**
 * 静态文件系统配置
 * 由 scripts/generate-fs.js 自动生成
 */

import type { NodeData } from './FileSystem';

export type StaticFSNode = NodeData & {
  mountable?: boolean;
  system?: boolean;
};

// 默认的静态文件系统结构（自动生成）
export const StaticFileSystem: Record<string, any> = ${JSON.stringify(staticFileSystem, null, 2)};

/**
 * 获取文件内容
 */
export function getFileContent(filePath: string): string {
  const pathParts = filePath.split('/').filter(part => part);
  
  if (pathParts.length === 0) return '';
  
  let current: any = StaticFileSystem['/'];
  for (const part of pathParts) {
    if (!current?.children?.[part]) {
      return '';
    }
    current = current.children[part];
  }
  
  if (current.postId) {
    // 从内联内容中获取
    return current.content || '';
  }
  return '';
}

/**
 * 获取文件内容的替代方法（用于postId查找）
 */
export function getFileContentById(postId: string): string {
  // 遍历所有节点查找 postId
  const findContentByPostId = (node: any): string => {
    if (node.postId === postId) {
      return node.content || '';
    }
    if (node.children) {
      for (const childKey of Object.keys(node.children)) {
        const result = findContentByPostId(node.children[childKey]);
        if (result) return result;
      }
    }
    return '';
  };
  
  return findContentByPostId(StaticFileSystem['/']) || '';
}

export default StaticFileSystem;
`;

// 写入文件
const outputFilePath = path.join(__dirname, '../app/lib/fs/staticConfig.ts');
fs.writeFileSync(outputFilePath, tsContent, 'utf8');

console.log('✅ 虚拟文件系统元数据生成完成！');
console.log(`📄 输出文件: ${outputFilePath}`);