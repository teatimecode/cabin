// 内容索引文件
// 自动从 content/posts/ 和 content/pages/ 目录导入 Markdown 文件

// 自动导入博客文章
const posts: Record<string, string> = {
  'hello-world': require('./posts/hello-world.md?raw').default,
  'tech-notes': require('./posts/tech-notes.md?raw').default,
  'life-diary': require('./posts/life-diary.md?raw').default,
  'win95-style-website': require('./posts/win95-style-website.md?raw').default,
};

// 自动导入文档页面
const pages: Record<string, string> = {
  'readme': require('./pages/readme.md?raw').default,
  'notes': require('./pages/notes.md?raw').default,
};

// 合并所有内容
export const contentFiles: Record<string, string> = {
  ...posts,
  ...pages,
};

export interface FileMetadata {
  name: string;
  type: 'file' | 'folder';
  app: string;
  parentId: string;
}

// 文件元数据
export const fileMetadata: Record<string, FileMetadata> = {
  // 博客文章
  'hello-world': {
    name: 'Hello World.txt',
    type: 'file',
    app: 'notepad',
    parentId: 'my-blog',
  },
  'tech-notes': {
    name: '技术笔记.txt',
    type: 'file',
    app: 'notepad',
    parentId: 'my-blog',
  },
  'life-diary': {
    name: '生活日记.txt',
    type: 'file',
    app: 'notepad',
    parentId: 'my-blog',
  },
  'win95-style-website': {
    name: 'Win95风格网站.txt',
    type: 'file',
    app: 'notepad',
    parentId: 'my-blog',
  },

  // 文档
  'readme': {
    name: 'README.txt',
    type: 'file',
    app: 'notepad',
    parentId: 'my-documents',
  },
  'notes': {
    name: '便签.txt',
    type: 'file',
    app: 'notepad',
    parentId: 'my-documents',
  },
};

// 获取文件内容
export function getFileContent(fileId: string): string {
  return contentFiles[fileId] || '';
}

// 获取所有博客文章
export function getAllPosts(): Array<{ id: string } & FileMetadata> {
  return Object.keys(posts).map(id => ({
    id,
    ...fileMetadata[id],
  }));
}

export default contentFiles;