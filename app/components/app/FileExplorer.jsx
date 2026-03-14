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
const fileIconMap = {
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

// 函数式组件版本
function FileExplorerContent({ initialPath, onOpenItem, fileSystem: propFileSystem }) {
  const [currentPath, setCurrentPath] = React.useState(initialPath || '/');
  const { fileSystem, mountedDrives } = useFileSystem();
  const { isSupported, mount, mounting } = useRemovableDisk();

  // 使用prop传入的fileSystem或context中的
  const fs = propFileSystem || fileSystem;

  // 获取当前目录内容
  const getCurrentItems = () => {
    const currentDir = fs[currentPath];
    const items = [];

    if (currentDir && currentDir.children) {
      currentDir.children.forEach(childId => {
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

    // 添加挂载的可移动磁盘
    if (currentPath === '/removable' || currentPath === '/') {
      mountedDrives.forEach(drive => {
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

  // 返回上级目录
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

  // 返回上一级
  const handleGoBack = handleGoUp;

  // 处理双击
  const handleItemDoubleClick = (item) => {
    // 可挂载的占位符
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

  // 挂载磁盘
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

  // 获取图标
  const getFileIcon = (item) => {
    // 驱动器图标
    if (item.type === 'drive') {
      return getIcon(item.icon || 'my-computer', { size: 'large' });
    }
    
    // 我的电脑
    if (item.type === 'root' || item.id === 'my-computer') {
      return getIcon('my-computer', { size: 'large' });
    }
    
    // 可挂载占位符
    if (item.type === 'placeholder') {
      return getIcon('my-computer', { size: 'large' });
    }
    
    // 根据类型或应用获取图标
    const iconName = fileIconMap[item.type] || fileIconMap[item.app] || fileIconMap['default'];
    return getIcon(iconName, { size: 'large' });
  };

  // 显示名称映射
  const getDisplayName = (path) => {
    const names = {
      '/': '桌面',
      '/my-blog': '我的博客',
      '/my-documents': '我的文档',
      '/my-pictures': '我的图片',
      '/my-computer': '我的电脑',
      '/removable': '可移动磁盘',
    };
    return names[path] || path;
  };

  // 检查当前目录是否是可挂载区域
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
        
        {/* 可挂载区域显示提示 */}
        {isMountableArea && items.filter(i => i.type === 'placeholder').length > 0 && (
          <MountHint>
            <div>点击"挂载可移动磁盘..."或</div>
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
class FileExplorer extends React.PureComponent {
  render() {
    return <FileExplorerContent {...this.props} />;
  }
}

export default FileExplorer;
