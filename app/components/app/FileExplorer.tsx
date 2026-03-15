import React from 'react';
import styled from 'styled-components';
import { Button, ScrollView } from 'react95';
import { getIcon, UpArrowIcon, LeftArrowIcon } from '../icons';
import { useFileSystem, useRemovableDisk } from '../../lib/fs/FSContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #c0c0c0;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  background: #c0c0c0;
  gap: 4px;
`;

const ToolbarButton = styled(Button)`
  min-width: 28px;
  padding: 0 4px;
  font-size: 12px;
`;

const AddressBar = styled(ScrollView)`
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

const MountButton = styled(Button)`
  margin-top: 8px;
  font-size: 12px;
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

  const fs = propFileSystem || fileSystem;

  const getCurrentItems = (): FSItem[] => {
    const currentDir = fs[currentPath];
    const items: FSItem[] = [];

    if (currentDir && currentDir.children) {
      currentDir.children.forEach((childId: string) => {
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

  const handleGoBack = handleGoUp;

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

  const handleMountDisk = async () => {
    if (!isSupported) {
      alert('您的浏览器不支持 File System Access API\n请使用 Chrome、Edge 等现代浏览器');
      return;
    }

    try {
      await mount({ mountPath: '/removable' });
    } catch (error) {
      console.error('挂载失败:', error);
    }
  };

  const getFileIcon = (item: FSItem) => {
    if (item.type === 'drive') {
      return getIcon(item.icon || 'my-computer', { size: 'large' });
    }
    
    if (item.type === 'root' || item.id === 'my-computer') {
      return getIcon('my-computer', { size: 'large' });
    }
    
    if (item.type === 'placeholder') {
      return getIcon(item.icon || 'drive-removable', { size: 'large' });
    }
    
    const iconName = fileIconMap[item.type] || (item.app ? fileIconMap[item.app] : undefined) || fileIconMap['default'];
    return getIcon(iconName, { size: 'large' });
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

  const isMountableArea = currentPath === '/removable' || 
    (currentPath === '/' && items.some(i => i.type === 'placeholder'));

  return (
    <Container>
      <Toolbar>
        <ToolbarButton onClick={handleGoUp} disabled={currentPath === '/'}>
          <UpArrowIcon size={10} />
        </ToolbarButton>
        <ToolbarButton onClick={handleGoBack}>
          <LeftArrowIcon size={10} />
        </ToolbarButton>
        <AddressBar shadow={false}>
          {getDisplayName(currentPath)}
        </AddressBar>
      </Toolbar>
      <Content>
        {items.map(item => (
          <FileItem
            key={item.id || item.path}
            onDoubleClick={() => handleItemDoubleClick(item)}
          >
            <FileIconWrapper>
              {getFileIcon(item)}
            </FileIconWrapper>
            <FileName>{item.name}</FileName>
          </FileItem>
        ))}
        
        {isMountableArea && items.filter(i => i.type === 'placeholder').length > 0 && (
          <MountHint>
            <div>点击&quot;挂载可移动磁盘...&quot;或</div>
            <MountButton 
              onClick={handleMountDisk}
              disabled={mounting || !isSupported}
            >
              {mounting ? '挂载中...' : '挂载本地目录'}
            </MountButton>
            {!isSupported && (
              <div style={{ marginTop: '8px', color: '#999', fontSize: '10px' }}>
                需要 Chrome/Edge 等现代浏览器
              </div>
            )}
          </MountHint>
        )}
        
        {items.length === 0 && !isMountableArea && (
          <div style={{ padding: '16px', color: '#666' }}>
            此文件夹为空
          </div>
        )}
      </Content>
    </Container>
  );
}

// 兼容旧版类组件接口
class FileExplorer extends React.PureComponent<FileExplorerContentProps> {
  render() {
    return <FileExplorerContent {...this.props} />;
  }
}

export default FileExplorer;
