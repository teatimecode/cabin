import React from 'react';
import styled from 'styled-components';
import { Button, ScrollView } from 'react95';
import { getIcon } from '../icons';

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

// 图标映射
const fileIconMap = {
  'folder': 'folder',
  'folder-open': 'folder-open',
  'notepad': 'notepad',
  'image': 'picture',
  'my-computer': 'my-computer',
  'default': 'document',
};

class FileExplorer extends React.PureComponent {
  state = {
    currentPath: '/',
  };

  static getDerivedStateFromProps(props, state) {
    if (props.initialPath && props.initialPath !== state.initialPath) {
      return { currentPath: props.initialPath };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialPath !== prevProps.initialPath && this.props.initialPath) {
      this.setState({ currentPath: this.props.initialPath });
    }
  }

  handleGoBack = () => {
    const { currentPath } = this.state;
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length > 0) {
      parts.pop();
      const newPath = '/' + parts.join('/');
      this.setState({ currentPath: newPath || '/' });
    }
  };

  handleGoUp = () => {
    const { currentPath } = this.state;
    if (currentPath !== '/') {
      const parts = currentPath.split('/').filter(Boolean);
      if (parts.length > 0) {
        parts.pop();
        const newPath = '/' + parts.join('/');
        this.setState({ currentPath: newPath || '/' });
      }
    }
  };

  handleItemDoubleClick = (item) => {
    const { onOpenItem } = this.props;

    if (item.type === 'folder') {
      this.setState({ currentPath: item.path });
    } else if (item.type === 'file' && onOpenItem) {
      onOpenItem(item);
    }
  };

  getFileIcon = (item) => {
    // 根据项目 ID 获取特定图标
    if (item.id === 'my-computer' || item.id === 'c-drive' || item.id === 'd-drive') {
      return getIcon('my-computer', { size: 'large' });
    }
    
    // 根据类型获取图标
    const iconName = fileIconMap[item.type] || fileIconMap[item.app] || fileIconMap['default'];
    return getIcon(iconName, { size: 'large' });
  };

  render() {
    const { fileSystem } = this.props;
    const { currentPath } = this.state;

    // 获取当前目录内容
    const currentDir = fileSystem[currentPath];
    const items = [];

    if (currentDir && currentDir.children) {
      currentDir.children.forEach(childId => {
        const childPath = currentPath === '/' ? `/${childId}` : `${currentPath}/${childId}`;
        const childItem = fileSystem[childPath];
        if (childItem) {
          items.push({
            ...childItem,
            id: childId,
            path: childPath,
          });
        }
      });
    }

    // 显示名称映射
    const getDisplayName = (path) => {
      const names = {
        '/': '桌面',
        '/my-blog': '我的博客',
        '/my-documents': '我的文档',
        '/my-pictures': '我的图片',
        '/my-computer': '我的电脑',
      };
      return names[path] || path;
    };

    return (
      <Container>
        <Toolbar>
          <ToolbarButton onClick={this.handleGoUp} disabled={currentPath === '/'}>
            ⬆
          </ToolbarButton>
          <ToolbarButton onClick={this.handleGoBack}>
            ◀
          </ToolbarButton>
          <AddressBar shadow={false}>
            {getDisplayName(currentPath)}
          </AddressBar>
        </Toolbar>
        <Content>
          {items.map(item => (
            <FileItem
              key={item.id}
              onDoubleClick={() => this.handleItemDoubleClick(item)}
            >
              <FileIconWrapper>
                {this.getFileIcon(item)}
              </FileIconWrapper>
              <FileName>{item.name}</FileName>
            </FileItem>
          ))}
          {items.length === 0 && (
            <div style={{ padding: '16px', color: '#666' }}>
              此文件夹为空
            </div>
          )}
        </Content>
      </Container>
    );
  }
}

export default FileExplorer;
