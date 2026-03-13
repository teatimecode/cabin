import React from 'react';
import styled from 'styled-components';
import { Button } from 'react95';
import { AppType } from '../../config/apps';

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
  border-bottom: 1px solid #808080;
  gap: 4px;
`;

const AddressBar = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: #fff;
  border: 1px solid #808080;
  border-style: inset;
  flex: 1;
  font-size: 12px;
`;

const Content = styled.div`
  flex: 1;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 16px;
  overflow: auto;
`;

const FileItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  padding: 4px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 128, 0.1);
  }

  &:active {
    background: rgba(0, 0, 128, 0.2);
  }
`;

const FileIcon = styled.div`
  font-size: 32px;
  margin-bottom: 4px;
`;

const FileName = styled.span`
  font-size: 12px;
  text-align: center;
  word-wrap: break-word;
  max-width: 72px;
`;

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
    if (item.type === 'folder') {
      return '📁';
    }
    switch (item.app) {
      case 'notepad':
        return '📝';
      case 'image':
        return '🖼️';
      default:
        return '📄';
    }
  };

  render() {
    const { fileSystem, onOpenItem } = this.props;
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

    return (
      <Container>
        <Toolbar>
          <Button onClick={this.handleGoUp} disabled={currentPath === '/'}>
            ⬆️
          </Button>
          <Button onClick={this.handleGoBack}>
            🔙
          </Button>
          <AddressBar>
            {currentPath === '/' ? '桌面' : currentPath}
          </AddressBar>
        </Toolbar>
        <Content>
          {items.map(item => (
            <FileItem
              key={item.id}
              onDoubleClick={() => this.handleItemDoubleClick(item)}
            >
              <FileIcon>{this.getFileIcon(item)}</FileIcon>
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
