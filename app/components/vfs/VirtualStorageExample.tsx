/**
 * 虚拟存储使用示例
 * 
 * 展示如何在组件中使用虚拟文件系统功能
 */

import React from 'react';
import { useVirtualStorage } from '../../lib/vfs/hooks';

export const VirtualStorageExample: React.FC = () => {
  const {
    currentPath,
    nodes,
    navigateTo,
    navigateUp,
    readFile,
  } = useVirtualStorage();

  const handleFileOpen = (path: string) => {
    readFile(path);
    // 在这里可以打开编辑器窗口显示内容
  };

  const handleFolderOpen = (path: string) => {
    navigateTo(path);
  };

  return (
    <div className="virtual-storage-example">
      {/* 导航栏 */}
      <div className="navigation-bar">
        <button onClick={() => navigateUp()}>⬆️ 上级</button>
        <span className="current-path">{currentPath}</span>
      </div>

      {/* 文件列表 */}
      <div className="file-grid">
        {nodes.map(node => (
          <div
            key={node.id}
            className="file-item"
            onDoubleClick={() => {
              if (node.type === 'folder') {
                handleFolderOpen(node.path);
              } else {
                handleFileOpen(node.path);
              }
            }}
          >
            <span className="file-icon">
              {node.type === 'folder' ? '📁' : '📄'}
            </span>
            <span className="file-name">{node.name}</span>
            {node.type === 'file' && node.isModified && (
              <span className="modified-indicator">*</span>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .virtual-storage-example {
          padding: 16px;
        }

        .navigation-bar {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 16px;
          padding: 8px;
          background: #f0f0f0;
          border: 1px solid #ccc;
        }

        .current-path {
          flex: 1;
          font-family: monospace;
          font-size: 12px;
        }

        .file-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 16px;
        }

        .file-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .file-item:hover {
          background: #e0e0e0;
          border: 1px solid #999;
        }

        .file-icon {
          font-size: 32px;
          margin-bottom: 4px;
        }

        .file-name {
          font-size: 11px;
          text-align: center;
          word-break: break-word;
        }

        .modified-indicator {
          color: red;
          font-weight: bold;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default VirtualStorageExample;
