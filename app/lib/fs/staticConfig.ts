/**
 * 静态文件系统配置
 * 由 scripts/generate-fs.js 自动生成
 */

import type { NodeData } from './FileSystem';

export type StaticFSNode = NodeData & {
  mountable?: boolean;
  system?: boolean;
};

// 默认的静态文件系统结构（自动生成）
export const StaticFileSystem: Record<string, any> = {
  "/": {
    "type": "folder",
    "name": "桌面",
    "children": {
      "my-computer": {
        "type": "root",
        "name": "我的电脑",
        "icon": "my-computer",
        "children": {
          "c-drive": {
            "type": "drive",
            "name": "C:",
            "icon": "drive",
            "driveType": "fixed",
            "totalSpace": "256GB",
            "freeSpace": "128GB",
            "children": {
              "windows": {
                "type": "folder",
                "name": "Windows",
                "icon": "folder",
                "system": true,
                "children": {}
              },
              "program-files": {
                "type": "folder",
                "name": "Program Files",
                "icon": "folder",
                "children": {}
              },
              "users": {
                "type": "folder",
                "name": "Users",
                "icon": "folder",
                "children": {
                  "guest": {
                    "type": "folder",
                    "name": "Guest",
                    "icon": "folder",
                    "children": {}
                  },
                  "admin": {
                    "type": "folder",
                    "name": "Admin",
                    "icon": "folder",
                    "children": {
                      "desktop": {
                        "type": "folder",
                        "name": "Desktop",
                        "icon": "folder",
                        "children": {}
                      },
                      "documents": {
                        "type": "folder",
                        "name": "Documents",
                        "icon": "folder",
                        "children": {}
                      },
                      "downloads": {
                        "type": "folder",
                        "name": "Downloads",
                        "icon": "folder",
                        "children": {}
                      }
                    }
                  }
                }
              }
            }
          },
          "d-drive": {
            "type": "drive",
            "name": "D:",
            "icon": "drive",
            "driveType": "fixed",
            "totalSpace": "512GB",
            "freeSpace": "256GB",
            "children": {}
          }
        }
      },
      "recycle-bin": {
        "type": "folder",
        "name": "回收站",
        "icon": "recycle-bin",
        "children": {}
      },
      "my-documents": {
        "type": "folder",
        "name": "我的文档",
        "icon": "folder",
        "children": {
          "readme": {
            "type": "file",
            "name": "README.txt",
            "app": "notepad",
            "extension": "txt",
            "content": "# 欢迎使用\n\n这是\"我的文档\"文件夹。\n\n你可以在这里存放各种文本文件。\n"
          },
          "notes": {
            "type": "file",
            "name": "便签.txt",
            "app": "notepad",
            "extension": "txt",
            "content": "待办事项：\n- 完成项目文档\n- 提交代码\n- 备份数据\n"
          }
        }
      },
      "my-pictures": {
        "type": "folder",
        "name": "我的图片",
        "icon": "picture",
        "children": {}
      },
      "my-blog": {
        "type": "folder",
        "name": "我的博客",
        "icon": "folder",
        "children": {
          "hello-world": {
            "type": "file",
            "name": "Hello World.txt",
            "app": "notepad",
            "extension": "txt",
            "content": "# Hello World\n\n欢迎来到我的 Win95 风格博客！\n\n这是一个模拟 Windows 95 界面的个人网站项目。\n\n## 关于这个项目\n\n这个网站使用了 React95 组件库来模拟经典的 Windows 95 界面。\n你可以像使用真正的 Windows 95 一样浏览文件夹和打开文件。\n\n## 如何使用\n\n1. 双击桌面上的\"我的博客\"图标\n2. 浏览文件夹，双击打开文章\n3. 使用地址栏导航\n\n祝你使用愉快！\n"
          },
          "tech-notes": {
            "type": "file",
            "name": "技术笔记.txt",
            "app": "notepad",
            "extension": "txt",
            "content": "# 技术笔记\n\n## React 学习笔记\n\n### 组件生命周期\n\nReact 组件有多个生命周期方法：\n- constructor - 构造函数\n- componentDidMount - 组件挂载后\n- componentDidUpdate - 组件更新后\n- componentWillUnmount - 组件卸载前\n\n### 状态管理\n\n推荐使用 useState 和 useReducer 来管理组件状态。\n\n## Next.js 配置\n\nNext.js 支持静态导出：\n\n```javascript\n// next.config.js\nmodule.exports = {\n  output: 'export',\n  trailingSlash: true,\n}\n```\n"
          },
          "life-diary": {
            "type": "file",
            "name": "生活日记.txt",
            "app": "notepad",
            "extension": "txt",
            "content": "# 生活日记\n\n## 2024年1月1日 星期一\n\n今天是元旦，新年快乐！\n\n终于完成了 Win95 风格网站的开发。\n虽然还有很多功能要完善，但是基本框架已经搭建好了。\n\n## 2024年1月2日 星期二\n\n今天学习了 React95 组件库的使用方法。\n这个库真的很好用，可以快速构建 Win95 风格的界面。\n\n## TODO\n\n- [ ] 添加更多博客文章\n- [ ] 实现图片查看器\n- [ ] 添加开始菜单功能\n"
          },
          "win95-style-website": {
            "type": "file",
            "name": "Win95风格网站.txt",
            "app": "notepad",
            "extension": "txt",
            "content": "# Win95 风格个人网站开发总结\n\n## 项目背景\n\n这个项目旨在创建一个怀旧的 Windows 95 风格个人网站，\n让用户能够在一个模拟的桌面环境中浏览博客内容。\n\n## 技术选型\n\n- **Next.js**: React 框架，支持静态导出\n- **React95**: Win95 风格 UI 组件库\n- **Styled-components**: CSS-in-JS 样式方案\n\n## 核心功能\n\n1. **桌面环境**\n   - 任务栏\n   - 开始菜单\n   - 桌面图标\n\n2. **窗口系统**\n   - 拖拽移动\n   - 最小化/最大化\n   - 窗口聚焦\n\n3. **文件浏览器**\n   - 文件夹导航\n   - 文件图标显示\n\n4. **记事本**\n   - Markdown 支持\n   - 滚动查看\n\n## 未来计划\n\n- 添加图片查看器\n- 实现文件上传功能\n- 添加更多主题\n"
          }
        }
      },
      "removable": {
        "type": "folder",
        "name": "可移动磁盘",
        "icon": "drive-removable",
        "children": {
          "placeholder": {
            "type": "placeholder",
            "name": "插入可移动磁盘",
            "icon": "drive-removable",
            "mountable": true
          }
        }
      }
    }
  }
};

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
