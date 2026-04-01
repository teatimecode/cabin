/**
 * 弹出确认对话框组件
 * 
 * 显示变更列表并询问用户是否保存
 */

import React from 'react';
import type { ChangeRecord } from '../../lib/vfs/types';

interface EjectConfirmationDialogProps {
  driveName: string;
  changes: ChangeRecord[];
  onConfirm: () => void;
  onCancel: () => void;
  onEjectWithoutSave: () => void;
}

export const EjectConfirmationDialog: React.FC<EjectConfirmationDialogProps> = ({
  driveName,
  changes,
  onConfirm,
  onCancel,
  onEjectWithoutSave,
}) => {
  const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
      create: '新建',
      update: '修改',
      delete: '删除',
      rename: '重命名',
    };
    return labels[action] || action;
  };

  const getActionIcon = (action: string): string => {
    const icons: Record<string, string> = {
      create: '📄',
      update: '✏️',
      delete: '🗑️',
      rename: '🏷️',
    };
    return icons[action] || '📄';
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="eject-dialog-overlay">
      <div className="eject-dialog">
        <div className="eject-dialog-header">
          <span className="eject-icon">💾</span>
          <h3>确认弹出 &quot;{driveName}&quot;</h3>
        </div>

        <div className="eject-dialog-body">
          <p className="warning-text">
            ⚠️ 有以下 {changes.length} 个文件被修改，是否保存到磁盘？
          </p>

          <div className="change-list">
            {changes.map((change) => {
              const key = `${change.action}-${change.fileName}-${change.timestamp}`;
              return (
                <div key={key} className={`change-item ${change.action}`}>
                  <span className="change-icon">{getActionIcon(change.action)}</span>
                  <span className="file-name">{change.fileName}</span>
                  <span className="action-label">{getActionLabel(change.action)}</span>
                  <span className="change-time">{formatTimestamp(change.timestamp)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="eject-dialog-actions">
          <button onClick={onConfirm} className="btn-primary">
            💾 保存并弹出
          </button>
          <button onClick={onEjectWithoutSave} className="btn-secondary">
            ❌ 不保存
          </button>
          <button onClick={onCancel} className="btn-tertiary">
            ↩️ 取消弹出
          </button>
        </div>
      </div>

      <style>{`
        .eject-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .eject-dialog {
          background: #c0c0c0;
          border: 2px solid;
          border-color: #ffffff #808080 #808080 #ffffff;
          box-shadow: 2px 2px 0 #000;
          padding: 16px;
          min-width: 400px;
          max-width: 600px;
        }

        .eject-dialog-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .eject-dialog-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: bold;
        }

        .eject-icon {
          font-size: 24px;
        }

        .warning-text {
          background: #ffffe0;
          border: 1px solid #808080;
          padding: 8px;
          margin: 0 0 16px 0;
          font-size: 12px;
        }

        .change-list {
          max-height: 300px;
          overflow-y: auto;
          border: 2px solid;
          border-color: #808080 #ffffff #ffffff #808080;
          background: #fff;
          padding: 8px;
          margin-bottom: 16px;
        }

        .change-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 12px;
        }

        .change-item:last-child {
          border-bottom: none;
        }

        .change-item.create {
          background: #e8f5e9;
        }

        .change-item.update {
          background: #fff3e0;
        }

        .change-item.delete {
          background: #ffebee;
        }

        .change-icon {
          font-size: 14px;
        }

        .file-name {
          flex: 1;
          font-weight: 500;
        }

        .action-label {
          color: #666;
          padding: 2px 6px;
          background: #e0e0e0;
          border-radius: 2px;
        }

        .change-time {
          color: #999;
          font-size: 11px;
        }

        .eject-dialog-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        button {
          padding: 6px 16px;
          font-size: 12px;
          border: 2px solid;
          cursor: pointer;
          font-family: inherit;
        }

        .btn-primary {
          background: #000080;
          color: #fff;
          border-color: #ffffff #000060 #000060 #ffffff;
        }

        .btn-primary:hover {
          background: #0000a0;
        }

        .btn-secondary {
          background: #c0c0c0;
          color: #000;
          border-color: #ffffff #808080 #808080 #ffffff;
        }

        .btn-secondary:hover {
          background: #d0d0d0;
        }

        .btn-tertiary {
          background: #c0c0c0;
          color: #000;
          border-color: #808080 #ffffff #ffffff #808080;
        }

        .btn-tertiary:hover {
          background: #d0d0d0;
        }
      `}</style>
    </div>
  );
};

export default EjectConfirmationDialog;
