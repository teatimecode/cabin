"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Frame, List } from '@react95/core';
import { getIcon, UpArrow, LeftArrow, type IconName } from '../icons';
import { useFileSystem, useRemovableDisk } from '../../lib/fs/FSContext';
import { VirtualStorageToolbar } from '../vfs/VirtualStorageToolbar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #c0c0c0;
`;

const MenuBar = styled.div`
  display: flex;
  padding: 2px 4px;
  background: #c0c0c0;
  gap: 8px;
  position: relative;
  border-bottom: 1px solid #808080;
`;

const MenuItem = styled.div`
  padding: 2px 8px;
  font-size: 12px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: #0a246a;
    color: #fff;
  }
`;

const DropdownMenu = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  background: #fff;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  z-index: 1000;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  background: #c0c0c0;
  gap: 4px;
  border-bottom: 1px solid #fff;
`;

const ToolbarButton = styled(Button as any)`
  min-width: 28px;
  padding: 0 4px;
  font-size: 12px;
`;

const AddressBar = styled(Frame as any)`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: #fff;
  flex: 1;
  font-size: 12px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
`;

const Content = styled.div`
  flex: 1;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 16px;
  overflow: auto;
  background: #fff;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  margin: 4px;
`;

const FileItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 72px;
  padding: 4px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: rgba(0, 0, 128, 0.1);
  }
`;

const FileIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FileName = styled.span`
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  text-align: center;
  word-wrap: break-word;
  max-width: 68px;
  color: #000;
`;

const MountHint = styled.div`
  padding: 16px;
  color: #666;
  text-align: center;
  font-size: 12px;
`;

const MountButton = styled(Button as any)`
  margin-top: 8px;
  font-size: 12px;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  background: #c0c0c0;
  border-top: 1px solid #fff;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  color: #666;
`;

// 图标映射
const fileIconMap: Record<string, string> = {
  'folder': 'folder',
  'folder-open': 'folder-open',
  'file': 'document',
  'notepad': 'notepad',
  'image': 'picture',
  'my-computer': 'my-computer',
  'drive': 'my-computer',
  'drive-removable': 'my-computer',
  'root': 'my-computer',
  'placeholder': 'my-computer',
  'default': 'document',
};

interface FSItem {
  id?: string;
  name: string;
  type: string;
  icon?: string;
  path: string;
  app?: string;
  mountable?: boolean;
  driveType?: string;
  postId?: string;
}

interface FileExplorerContentProps {
  initialPath?: string;
  onOpenItem?: (item: FSItem) => void;
  fileSystem?: any;
}

function FileExplorerContent({ initialPath, onOpenItem, fileSystem: propFileSystem }: FileExplorerContentProps) {
  const [currentPath, setCurrentPath] = React.useState(initialPath || '/');
  const { fileSystem, mountedDrives } = useFileSystem();
  const { isSupported, mount, mounting } = useRemovableDisk();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fs = propFileSystem || fileSystem;

  const getCurrentItems = (): FSItem[] => {
    const currentDir = fs[currentPath];
    const items: FSItem[] = [];

    if (currentDir && currentDir.children) {
      // children 现在是对象形式，需要转换为数组
      const childIds = typeof currentDir.children === 'object' ? Object.keys(currentDir.children) : currentDir.children;
      childIds.forEach((childId: string) => {
        const childPath = currentPath === '/' ? `/${childId}` : `${currentPath}/${childId}`;
        const childItem = fs[childPath];
        if (childItem) {
          items.push({
            ...childItem,
            id: childId,
            path: childPath,
          });
        }
      });
    }

    if (currentPath === '/removable' || currentPath === '/') {
      mountedDrives.forEach((drive: any) => {
        if (!items.find(i => i.path === drive.path)) {
          items.push({
            id: drive.id,
            name: drive.name,
            type: 'drive',
            icon: 'drive-removable',
            path: drive.path,
            driveType: 'removable',
          });
        }
      });
    }

    return items;
  };

  const items = getCurrentItems();

  const handleGoUp = () => {
    if (currentPath !== '/') {
      const parts = currentPath.split('/').filter(Boolean);
      if (parts.length > 0) {
        parts.pop();
        const newPath = '/' + parts.join('/');
        setCurrentPath(newPath || '/');
      }
    }
  };

  const handleItemDoubleClick = (item: FSItem) => {
    if (item.type === 'placeholder' && item.mountable) {
      handleMountDisk();
      return;
    }

    if (item.type === 'folder' || item.type === 'drive' || item.type === 'root') {
      setCurrentPath(item.path);
    } else if (item.type === 'file' && onOpenItem) {
      onOpenItem(item);
    }
  };

  const handleGoBack = handleGoUp;

  const handleMountDisk = async () => {
    if (!isSupported) {
      alert('您的浏览器不支持 File System Access API\n请使用 Chrome、Edge 等现代浏览器');
      return;
    }

    try {
      await mount({ mountPath: '/removable' });
    } catch (error) {
      // 挂载失败时静默处理，避免在生产环境显示错误信息
    }
  };

  const getFileIcon = (item: FSItem) => {
    // 驱动器图标
    if (item.type === 'drive') {
      return getIcon((item.icon || 'my-computer') as IconName, { size: 'large' });
    }
    
    // 我的电脑
    if (item.type === 'root' || item.id === 'my-computer') {
      return getIcon('my-computer', { size: 'large' });
    }
    
    // 可挂载占位符
    if (item.type === 'placeholder') {
      return getIcon((item.icon || 'drive-removable') as IconName, { size: 'large' });
    }
    
    // 根据类型或应用获取图标
    const iconName = fileIconMap[item.type] || fileIconMap[item.app!] || fileIconMap['default'];
    return getIcon(iconName as IconName, { size: 'large' });
  };

  const getDisplayName = (path: string): string => {
    const names: Record<string, string> = {
      '/': '桌面',
      '/my-blog': '我的博客',
      '/my-documents': '我的文档',
      '/my-pictures': '我的图片',
      '/my-computer': '我的电脑',
      '/removable': '可移动磁盘',
    };
    return names[path] || path;
  };

  const handleItemClick = (e: React.MouseEvent, _item: FSItem) => {
    // 防止冒泡，为将来的选择功能预留
    e.stopPropagation();
  };

  // 菜单相关处理
  const handleMenuClick = (menu: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuAction = (action: string) => {
    setActiveMenu(null);
    switch(action) {
      case 'back':
        handleGoBack();
        break;
      case 'up':
        handleGoUp();
        break;
      case 'refresh':
        // 刷新当前目录
        setCurrentPath(currentPath);
        break;
    }
  };

  // 点击其他地方关闭菜单
  React.useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // 计算状态栏信息
  const itemCount = items.length;
  const statusText = `${itemCount} 个项目`;

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      {/* 菜单栏 */}
      <MenuBar>
        <div onClick={(e) => handleMenuClick('file', e)}>
          文件
          <DropdownMenu show={activeMenu === 'file'}>
            <List>
              <List.Item onClick={() => handleMenuAction('up')}>打开上级文件夹</List.Item>
              <List.Divider />
              <List.Item onClick={() => handleMenuAction('refresh')}>刷新</List.Item>
            </List>
          </DropdownMenu>
        </div>
        <div onClick={(e) => handleMenuClick('edit', e)}>
          编辑
          <DropdownMenu show={activeMenu === 'edit'}>
            <List>
              <List.Item>复制</List.Item>
              <List.Item>粘贴</List.Item>
              <List.Divider />
              <List.Item>全选</List.Item>
            </List>
          </DropdownMenu>
        </div>
        <div onClick={(e) => handleMenuClick('view', e)}>
          查看
          <DropdownMenu show={activeMenu === 'view'}>
            <List>
              <List.Item>大图标</List.Item>
              <List.Item>小图标</List.Item>
              <List.Item>列表</List.Item>
              <List.Item>详细资料</List.Item>
            </List>
          </DropdownMenu>
        </div>
        <div onClick={(e) => handleMenuClick('help', e)}>
          帮助
          <DropdownMenu show={activeMenu === 'help'}>
            <List>
              <List.Item>帮助主题</List.Item>
              <List.Item>关于</List.Item>
            </List>
          </DropdownMenu>
        </div>
      </MenuBar>

      {/* 虚拟存储工具栏 - 新增 */}
      <VirtualStorageToolbar
        onMountSuccess={() => {}}
        onEjectComplete={() => {}}
      />
      
      {/* 原有工具栏 */}
      <Toolbar>
        <ToolbarButton onClick={handleGoBack} disabled={currentPath === '/'}>
          <LeftArrow />
        </ToolbarButton>
        <ToolbarButton onClick={handleGoUp} disabled={currentPath === '/'}>
          <UpArrow />
        </ToolbarButton>
        <AddressBar shadow={false}>
          {getDisplayName(currentPath)}
        </AddressBar>
      </Toolbar>
      <Content>
        {items.length > 0 ? (
          items.map((item) => (
            <FileItem
              key={`file-item-${item.path}`}
              onClick={(e) => handleItemClick(e, item)}
              onDoubleClick={() => handleItemDoubleClick(item)}
            >
              <FileIconWrapper>{getFileIcon(item)}</FileIconWrapper>
              <FileName>{item.name}</FileName>
            </FileItem>
          ))
        ) : (
          // 可移动磁盘占位符
          currentPath === '/removable' && (
            <div key="mount-placeholder">
              <MountHint>
                <p>未检测到可移动磁盘</p>
                <p>点击下方按钮选择一个目录作为可移动磁盘</p>
              </MountHint>
              <MountButton onClick={handleMountDisk} disabled={mounting}>
                {mounting ? '正在挂载...' : '挂载可移动磁盘'}
              </MountButton>
            </div>
          )
        )}
      </Content>
      {/* 状态栏 */}
      <StatusBar>
        <span>{statusText}</span>
        <span>{getDisplayName(currentPath)}</span>
      </StatusBar>
    </Container>
  );
}

// 兼容旧版类组件接口
const FileExplorer: React.FC<FileExplorerContentProps> = (props) => {
  return <FileExplorerContent {...props} />;
};

export default FileExplorer;
