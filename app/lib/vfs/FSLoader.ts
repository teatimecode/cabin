/**
 * FS 目录数据加载器
 * 
 * 负责从项目的 fs/ 目录读取元数据并转换为虚拟文件系统格式
 */

/**
 * FS 目录结构接口
 */
export interface FSDirectory {
  name: string;
  type: 'folder';
  icon?: string;
  description?: string;
  children?: (FSDirectory | FSFile)[];
}

export interface FSFile {
  name: string;
  type: 'file';
  content?: string;
  mimeType?: string;
  app?: string;
}

/**
 * 从 fs/ 目录加载数据的加载器类
 */
export class FSLoader {
  /**
   * 加载 fs/ 目录的元数据
   * 注意：由于浏览器限制，这里使用硬编码的初始数据结构
   * 在实际项目中，可以通过构建时生成 JSON 文件来提供完整数据
   */
  static loadInitialData(): Record<string, any> {
    // 这是从 fs/ 目录结构转换而来的初始化数据
    return {
      name: '桌面',
      type: 'folder',
      icon: 'desktop',
      description: 'Windows 95 桌面',
      children: [
        {
          id: 'my-computer',
          name: '我的电脑',
          type: 'folder',
          icon: 'computer',
          children: [
            {
              id: 'c-drive',
              name: '本地磁盘 (C:)',
              type: 'folder',
              icon: 'drive',
              children: [
                {
                  id: 'windows',
                  name: 'Windows',
                  type: 'folder',
                  children: [],
                },
                {
                  id: 'program-files',
                  name: 'Program Files',
                  type: 'folder',
                  children: [],
                },
                {
                  id: 'users',
                  name: 'Users',
                  type: 'folder',
                  children: [
                    {
                      id: 'admin',
                      name: 'Admin',
                      type: 'folder',
                      children: [
                        {
                          id: 'downloads',
                          name: 'Downloads',
                          type: 'folder',
                          children: [],
                        },
                        {
                          id: 'documents',
                          name: 'Documents',
                          type: 'folder',
                          children: [],
                        },
                        {
                          id: 'desktop',
                          name: 'Desktop',
                          type: 'folder',
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'my-documents',
          name: '我的文档',
          type: 'folder',
          icon: 'documents',
          children: this.loadMyDocuments(),
        },
        {
          id: 'my-pictures',
          name: '我的图片',
          type: 'folder',
          icon: 'pictures',
          children: [],
        },
        {
          id: 'my-blog',
          name: '我的博客',
          type: 'folder',
          icon: 'blog',
          children: this.loadMyBlog(),
        },
        {
          id: 'recycle-bin',
          name: '回收站',
          type: 'folder',
          icon: 'recycle-bin',
          children: [],
        },
        {
          id: 'removable',
          name: '可移动磁盘',
          type: 'folder',
          icon: 'removable',
          children: [],
          isRemovableContainer: true,
        },
      ],
    };
  }

  /**
   * 加载"我的文档"内容
   */
  private static loadMyDocuments(): any[] {
    // 可以从 content/index.ts 或其他地方加载实际内容
    return [
      {
        id: 'readme',
        name: 'README.txt',
        type: 'file',
        content: `# 欢迎使用

这是"我的文档"文件夹。

你可以在这里存放各种文本文件。`,
        app: 'notepad',
      },
      {
        id: 'notes',
        name: '便签.txt',
        type: 'file',
        content: `待办事项：
- 完成项目文档
- 提交代码
- 备份数据`,
        app: 'notepad',
      },
    ];
  }

  /**
   * 加载"我的博客"内容
   */
  private static loadMyBlog(): any[] {
    // 从 content/posts 加载博客文章
    return [
      {
        id: 'hello-world',
        name: 'Hello World.txt',
        type: 'file',
        content: `# Hello World

欢迎来到我的 Win95 风格博客！

这是一个模拟 Windows 95 界面的个人网站项目。

## 关于这个项目

这个网站使用了 React95 组件库来模拟经典的 Windows 95 界面。
你可以像使用真正的 Windows 95 一样浏览文件夹和打开文件。

## 如何使用

1. 双击桌面上的"我的博客"图标
2. 浏览文件夹，双击打开文章
3. 使用地址栏导航

祝你使用愉快！`,
        app: 'notepad',
      },
      {
        id: 'tech-notes',
        name: '技术笔记.txt',
        type: 'file',
        content: `# 技术笔记

## React 学习笔记

### 组件生命周期

React 组件有多个生命周期方法：
- constructor - 构造函数
- componentDidMount - 组件挂载后
- componentDidUpdate - 组件更新后
- componentWillUnmount - 组件卸载前

### 状态管理

推荐使用 useState 和 useReducer 来管理组件状态。

## Next.js 配置

Next.js 支持静态导出：

\`\`\`javascript
// next.config.js
module.exports = {
  output: 'export',
  trailingSlash: true,
}
\`\`\``,
        app: 'notepad',
      },
      {
        id: 'life-diary',
        name: '生活日记.txt',
        type: 'file',
        content: `# 生活日记

## 2024 年 1 月 1 日 星期一

今天是元旦，新年快乐！

终于完成了 Win95 风格网站的开发。
虽然还有很多功能要完善，但是基本框架已经搭建好了。

## 2024 年 1 月 2 日 星期二

今天学习了 React95 组件库的使用方法。
这个库真的很好用，可以快速构建 Win95 风格的界面。

## TODO

- [ ] 添加更多博客文章
- [ ] 实现图片查看器
- [ ] 添加开始菜单功能`,
        app: 'notepad',
      },
      {
        id: 'win95-style-website',
        name: 'Win95 风格网站.txt',
        type: 'file',
        content: `# Win95 风格个人网站开发总结

## 项目背景

这个项目旨在创建一个怀旧的 Windows 95 风格个人网站，
让用户能够在一个模拟的桌面环境中浏览博客内容。

## 技术选型

- **Next.js**: React 框架，支持静态导出
- **React95**: Win95 风格 UI 组件库
- **Styled-components**: CSS-in-JS 样式方案

## 核心功能

1. **桌面环境**
   - 任务栏
   - 开始菜单
   - 桌面图标

2. **窗口系统**
   - 拖拽移动
   - 最小化/最大化
   - 窗口聚焦

3. **文件浏览器**
   - 文件夹导航
   - 文件图标显示

4. **记事本**
   - Markdown 支持
   - 滚动查看

## 未来计划

- 添加图片查看器
- 实现文件上传功能
- 添加更多主题`,
        app: 'notepad',
      },
    ];
  }

  /**
   * 将 FS 数据转换为 VirtualFileSystem 可用的格式
   */
  static convertToVFSFormat(data: any): Record<string, any> {
    const result: Record<string, any> = {};

    function processNode(node: any, path: string) {
      const nodePath = path === '/' ? '/' : `${path}/${node.name}`;
      
      result[node.id || nodePath] = {
        ...node,
        path: nodePath,
      };

      if (node.children) {
        for (const child of node.children) {
          processNode(child, nodePath);
        }
      }
    }

    processNode(data, '');
    return result;
  }

  /**
   * 获取文件的实际内容（用于 content/ 目录）
   */
  static async loadFileContent(_filePath: string): Promise<string> {
    // 在实际项目中，这里可以 fetch 构建时生成的 JSON 文件
    // 例如：/static/fs-content/hello-world.json
    
    // 暂时返回示例内容
    return '';
  }

  /**
   * 预加载所有文件内容
   */
  static async preloadAllContent(_fsData: any): Promise<void> {
    // 可以在应用启动时预加载所有内容到内存
    // 提高后续访问速度
  }
}

// 导出单例数据
export const initialFSData = FSLoader.loadInitialData();
