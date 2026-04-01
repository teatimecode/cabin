/**
 * 虚拟存储工具栏组件
 * 
 * 提供挂载可移动磁盘和导出功能
 */

import React, { useState } from 'react';
import { useVirtualStorage } from '../../lib/vfs/hooks';
import EjectConfirmationDialog from './EjectConfirmationDialog';
import type { DriveInfo } from '../../lib/vfs/types';

interface VirtualStorageToolbarProps {
  onMountSuccess?: () => void;
  onEjectComplete?: () => void;
}

export const VirtualStorageToolbar: React.FC<VirtualStorageToolbarProps> = ({
  onMountSuccess,
  onEjectComplete,
}) => {
  const {
    drives,
    isMounting,
    mountDrive,
    ejectDrive,
    confirmEjectAndExport,
    exportToZip,
    changeStats,
  } = useVirtualStorage();

  const [showEjectDialog, setShowEjectDialog] = useState(false);
  const [pendingEjectDrive, setPendingEjectDrive] = useState<DriveInfo | null>(null);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);

  // 挂载可移动磁盘
  const handleMountDrive = async (type: 'removable' | 'cdrom') => {
    await mountDrive(type);
  };

  // 弹出驱动器
  const handleEjectDrive = async (drive: DriveInfo) => {
    const result = await ejectDrive(drive.id);

    if (result.hasChanges) {
      // 有变更，显示确认对话框
      setPendingEjectDrive(drive);
      setPendingChanges(result.changes);
      setShowEjectDialog(true);
    } else {
      // 无变更，直接弹出（实际逻辑需要 UI 处理移除图标）
      onEjectComplete?.();
    }
  };

  // 确认保存并弹出
  const handleConfirmEject = async () => {
    if (!pendingEjectDrive) return;

    const blob = await confirmEjectAndExport(pendingEjectDrive.id);
    
    if (blob) {
      // 下载 ZIP
      const filename = `cabin-${pendingEjectDrive.name}-${Date.now()}.zip`;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }

    setShowEjectDialog(false);
    setPendingEjectDrive(null);
    onEjectComplete?.();
  };

  // 不保存直接弹出
  const handleEjectWithoutSave = () => {
    setShowEjectDialog(false);
    setPendingEjectDrive(null);
    onEjectComplete?.();
  };

  // 取消弹出
  const handleCancelEject = () => {
    setShowEjectDialog(false);
    setPendingEjectDrive(null);
  };

  // 导出所有变更
  const handleExportAll = async () => {
    const success = await exportToZip();
    if (success) {
      alert('导出成功！');
    }
  };

  return (
    <>
      <div className="virtual-storage-toolbar">
        {/* 挂载按钮组 */}
        <div className="toolbar-group">
          <button
            onClick={() => handleMountDrive('removable')}
            disabled={isMounting}
            className="toolbar-btn"
            title="插入可移动磁盘"
          >
            💾 插入磁盘
          </button>
          
          <button
            onClick={() => handleMountDrive('cdrom')}
            disabled={isMounting}
            className="toolbar-btn"
            title="载入 CD 光盘"
          >
            💿 载入 CD
          </button>
        </div>

        {/* 驱动器列表 */}
        {drives.length > 0 && (
          <div className="toolbar-group">
            <span className="toolbar-label">已挂载驱动器:</span>
            {drives.map(drive => (
              <div key={drive.id} className="drive-badge">
                <span className="drive-icon">{drive.type === 'removable' ? '💾' : '💿'}</span>
                <span className="drive-name">{drive.name}</span>
                <button
                  onClick={() => handleEjectDrive(drive)}
                  className="eject-btn"
                  title="弹出磁盘"
                >
                  ⏏️
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 导出按钮 */}
        {changeStats.total > 0 && (
          <div className="toolbar-group">
            <button
              onClick={handleExportAll}
              className="toolbar-btn btn-export"
              title={`导出 ${changeStats.total} 个变更的文件`}
            >
              📦 导出变更 ({changeStats.total})
            </button>
          </div>
        )}

        {isMounting && (
          <div className="toolbar-status">
            正在挂载...
          </div>
        )}
      </div>

      {/* 弹出确认对话框 */}
      {showEjectDialog && pendingEjectDrive && (
        <EjectConfirmationDialog
          driveName={pendingEjectDrive.name}
          changes={pendingChanges}
          onConfirm={handleConfirmEject}
          onCancel={handleCancelEject}
          onEjectWithoutSave={handleEjectWithoutSave}
        />
      )}

      <style>{`
        .virtual-storage-toolbar {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 8px;
          background: #c0c0c0;
          border-bottom: 2px solid #808080;
          flex-wrap: wrap;
        }

        .toolbar-group {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .toolbar-btn {
          padding: 4px 12px;
          font-size: 12px;
          background: #c0c0c0;
          border: 2px solid;
          border-color: #ffffff #808080 #808080 #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .toolbar-btn:hover:not(:disabled) {
          background: #d0d0d0;
        }

        .toolbar-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-export {
          background: #000080;
          color: #fff;
        }

        .btn-export:hover {
          background: #0000a0;
        }

        .toolbar-label {
          font-size: 11px;
          color: #666;
        }

        .drive-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: #fff;
          border: 1px solid #808080;
          font-size: 11px;
        }

        .drive-icon {
          font-size: 14px;
        }

        .drive-name {
          font-weight: 500;
        }

        .eject-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 12px;
          padding: 0 2px;
        }

        .eject-btn:hover {
          transform: scale(1.1);
        }

        .toolbar-status {
          font-size: 11px;
          color: #666;
          font-style: italic;
        }
      `}</style>
    </>
  );
};

export default VirtualStorageToolbar;
