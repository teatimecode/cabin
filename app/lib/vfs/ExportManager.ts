/**
 * ZIP 导出管理器
 * 
 * 负责将变更的文件打包为 ZIP 并下载
 */

import JSZip from 'jszip';
import { VirtualFileSystem } from './VirtualFileSystem';
import type { ChangeRecord, ChangeReport, ExportOptions } from './types';

export class ExportManager {
  private vfs: VirtualFileSystem;

  constructor(vfs: VirtualFileSystem) {
    this.vfs = vfs;
  }

  /**
   * 生成变更报告
   */
  generateChangeReport(): ChangeReport {
    const changes = this.vfs.getAllChanges();

    const report: ChangeReport = {
      totalFiles: changes.length,
      createdFiles: changes.filter(c => c.action === 'create'),
      updatedFiles: changes.filter(c => c.action === 'update'),
      deletedFiles: changes.filter(c => c.action === 'delete'),
      timestamp: Date.now(),
    };

    return report;
  }

  /**
   * 获取变更文件的详细列表（用于 UI 展示）
   */
  getChangeListDisplay(): Array<{
    fileName: string;
    action: string;
    actionLabel: string;
    actionIcon: string;
    timestamp: string;
    size?: number;
  }> {
    const changes = this.vfs.getAllChanges();

    return changes.map(change => ({
      fileName: change.fileName,
      action: change.action,
      actionLabel: this.getActionLabel(change.action),
      actionIcon: this.getActionIcon(change.action),
      timestamp: this.formatTimestamp(change.timestamp),
      size: change.newContent?.length,
    }));
  }

  private getActionLabel(action: string): string {
    const labels: Record<string, string> = {
      create: '新建',
      update: '修改',
      delete: '删除',
      rename: '重命名',
    };
    return labels[action] || action;
  }

  private getActionIcon(action: string): string {
    const icons: Record<string, string> = {
      create: '📄',
      update: '✏️',
      delete: '🗑️',
      rename: '🏷️',
    };
    return icons[action] || '📄';
  }

  private formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // 少于 1 分钟
    if (diff < 60000) {
      return '刚刚';
    }

    // 少于 1 小时
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}分钟前`;
    }

    // 少于 24 小时
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}小时前`;
    }

    // 显示日期时间
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * 导出为 ZIP 文件
   */
  async exportToZip(options: ExportOptions = {}): Promise<Blob> {
    const zip = new JSZip();
    const changes = this.vfs.getAllChanges();

    // 添加说明文件
    const readme = this.generateReadmeContent();
    zip.file('README_EXPORT.txt', readme);

    // 处理每个变更
    for (const change of changes) {
      if (change.action === 'delete') {
        // 删除的文件不导出
        continue;
      }

      if (change.action === 'create' || change.action === 'update') {
        const node = this.vfs.getNodeById(change.fileId);
        if (node && node.type === 'file') {
          // 计算相对路径（去掉前缀的 /）
          const relativePath = node.path.startsWith('/') 
            ? node.path.substring(1) 
            : node.path;

          // 添加到 ZIP
          zip.file(relativePath, node.content);
        }
      }
    }

    // 生成 ZIP
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    return blob;
  }

  /**
   * 生成导出说明文件
   */
  private generateReadmeContent(): string {
    const report = this.generateChangeReport();
    const timestamp = new Date().toLocaleString('zh-CN');

    return `Cabin 虚拟文件系统导出
========================

导出时间：${timestamp}

变更统计:
- 新建文件：${report.createdFiles.length} 个
- 修改文件：${report.updatedFiles.length} 个
- 删除文件：${report.deletedFiles.length} 个
- 总计变更：${report.totalFiles} 个文件

注意:
- 删除的文件未包含在此导出中
- 请手动处理删除操作
`;
  }

  /**
   * 下载 ZIP 文件
   */
  downloadZip(blob: Blob, filename: string = 'cabin-export.zip'): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * 完整的导出流程：生成报告 → 确认 → 打包 → 下载
   */
  async exportWithConfirmation(
    onConfirm: () => void,
    onCancel: () => void
  ): Promise<void> {
    const changes = this.vfs.getAllChanges();

    if (changes.length === 0) {
      // 没有变更，直接返回
      return;
    }

    // 这里应该显示确认对话框
    // 由于这是管理类，我们调用回调让 UI 层处理
    onConfirm();
  }

  /**
   * 保存并弹出驱动器
   */
  async saveAndEject(driveId: string): Promise<Blob | null> {
    const changes = this.vfs.getAllChanges();
    const driveChanges = changes.filter(change => {
      const node = this.vfs.getNodeById(change.fileId);
      return node?.path.startsWith(`/${driveId}`);
    });

    if (driveChanges.length === 0) {
      return null;
    }

    // 导出变更的文件
    return await this.exportToZip();
  }

  /**
   * 获取导出文件名（带时间戳）
   */
  generateFilename(prefix: string = 'cabin'): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    return `${prefix}-${timestamp}.zip`;
  }
}

// 导出辅助函数
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
