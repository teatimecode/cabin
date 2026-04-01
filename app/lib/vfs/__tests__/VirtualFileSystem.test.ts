/**
 * 虚拟文件系统基础测试
 */

import { VirtualFileSystem } from '../VirtualFileSystem';
import { initialFSData } from '../FSLoader';

describe('VirtualFileSystem', () => {
  let vfs: VirtualFileSystem;

  beforeEach(() => {
    vfs = new VirtualFileSystem();
    vfs.initializeFromData(initialFSData);
  });

  describe('初始化', () => {
    it('应该正确初始化根目录', () => {
      const path = vfs.getCurrentPath();
      expect(path).toBe('/');
    });

    it('应该能获取根目录内容', () => {
      const contents = vfs.getCurrentFolderContents();
      expect(contents.length).toBeGreaterThan(0);
      
      // 检查是否包含默认文件夹
      const folderNames = contents.map(node => node.name);
      expect(folderNames).toContain('我的电脑');
      expect(folderNames).toContain('我的文档');
      expect(folderNames).toContain('我的博客');
    });
  });

  describe('导航功能', () => {
    it('应该能导航到子文件夹', () => {
      const result = vfs.navigateTo('/my-blog');
      expect(result.success).toBe(true);
      expect(vfs.getCurrentPath()).toBe('/my-blog');
    });

    it('应该能返回上级目录', () => {
      vfs.navigateTo('/my-blog');
      const result = vfs.navigateUp();
      expect(result.success).toBe(true);
      expect(vfs.getCurrentPath()).toBe('/');
    });

    it('应该支持前进后退', () => {
      vfs.navigateTo('/my-blog');
      
      const backResult = vfs.goBack();
      expect(backResult.success).toBe(true);
      expect(vfs.getCurrentPath()).toBe('/');
      
      const forwardResult = vfs.goForward();
      expect(forwardResult.success).toBe(true);
      expect(vfs.getCurrentPath()).toBe('/my-blog');
    });

    it('应该在根目录时无法返回上级', () => {
      const result = vfs.navigateUp();
      expect(result.success).toBe(false);
    });
  });

  describe('文件读写', () => {
    it('应该能读取文件内容', () => {
      // 先创建一个文件
      vfs.createFile('/test.txt', 'Hello World');
      
      // 读取内容
      const content = vfs.readFile('/test.txt');
      expect(content).toBe('Hello World');
    });

    it('应该能写入文件并追踪变更', () => {
      vfs.createFile('/test.txt', 'Original');
      
      // 写入新内容
      const result = vfs.writeFile('/test.txt', 'Modified');
      expect(result.success).toBe(true);
      
      // 验证内容已更新
      const content = vfs.readFile('/test.txt');
      expect(content).toBe('Modified');
      
      // 验证有变更记录
      const changes = vfs.getAllChanges();
      expect(changes.length).toBeGreaterThan(0);
    });

    it('应该能创建新文件', () => {
      const result = vfs.createFile('/new-file.txt', 'Content');
      expect(result.success).toBe(true);
      expect(result.fileId).toBeTruthy();
      
      // 验证文件存在
      const content = vfs.readFile('/new-file.txt');
      expect(content).toBe('Content');
    });

    it('应该能删除文件', () => {
      vfs.createFile('/to-delete.txt', 'Content');
      
      const result = vfs.deleteFile('/to-delete.txt');
      expect(result.success).toBe(true);
      
      // 验证文件已被删除
      const content = vfs.readFile('/to-delete.txt');
      expect(content).toBeNull();
    });
  });

  describe('变更追踪', () => {
    it('应该记录所有变更', () => {
      vfs.createFile('/file1.txt', 'Content 1');
      vfs.createFile('/file2.txt', 'Content 2');
      vfs.writeFile('/file1.txt', 'Modified');
      
      const changes = vfs.getAllChanges();
      expect(changes.length).toBe(3);
    });

    it('应该能清除所有变更', () => {
      vfs.createFile('/test.txt', 'Content');
      vfs.clearChanges();
      
      const changes = vfs.getAllChanges();
      expect(changes.length).toBe(0);
    });

    it('应该能撤销修改', () => {
      vfs.createFile('/test.txt', 'Original');
      vfs.writeFile('/test.txt', 'Modified');
      
      const success = vfs.undoLastChange('/test.txt');
      expect(success).toBe(true);
      
      const content = vfs.readFile('/test.txt');
      expect(content).toBe('Original');
    });
  });

  describe('错误处理', () => {
    it('应该处理不存在的文件路径', () => {
      const content = vfs.readFile('/non-existent.txt');
      expect(content).toBeNull();
    });

    it('应该处理无效的导航路径', () => {
      const result = vfs.navigateTo('/invalid-path');
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('应该处理在文件上执行文件夹操作', () => {
      vfs.createFile('/file.txt', 'Content');
      const result = vfs.navigateTo('/file.txt');
      expect(result.success).toBe(false);
    });
  });
});
