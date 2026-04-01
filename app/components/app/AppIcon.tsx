import React from 'react';
import styled from 'styled-components';
import { getIcon, type IconName } from '../icons';
import type { AppConfig } from '../../config/apps';

interface AppIconProps {
  app: AppConfig;
  selected?: boolean;
  onOpen?: (app: AppConfig) => void;
  onSelect?: (app: AppConfig, isMultiSelect: boolean) => void;
  onContextMenu?: (app: AppConfig, x: number, y: number) => void;
}

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  padding: 8px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: rgba(0, 0, 128, 0.1);
  }

  &:active {
    background: rgba(0, 0, 128, 0.2);
  }
`;

const IconImage = styled.div`
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconLabel = styled.span<{ selected?: boolean }>`
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  color: #fff;
  text-align: center;
  word-wrap: break-word;
  max-width: 72px;
  padding: 1px 2px;
  background: ${props => props.selected ? '#000080' : 'transparent'};
  color: ${props => props.selected ? '#fff' : '#fff'};
  text-shadow: 1px 1px 1px #000;
`;

class AppIcon extends React.PureComponent<AppIconProps> {
  handleDoubleClick = () => {
    const { app, onOpen } = this.props;
    console.log('AppIcon: Double clicked on', app.name);
    if (onOpen) {
      console.log('AppIcon: Calling onOpen for', app.name);
      onOpen(app);
    } else {
      console.log('AppIcon: onOpen is not defined');
    }
  };

  handleClick = (e: React.MouseEvent) => {
    const { app, onSelect } = this.props;
    if (onSelect) {
      onSelect(app, e.ctrlKey || e.metaKey);
    }
  };

  handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { app, onContextMenu } = this.props;
    if (onContextMenu) {
      onContextMenu(app, e.clientX, e.clientY);
    }
  };

  render() {
    const { app, selected } = this.props;

    // 获取图标，如果没有指定则根据类型使用默认图标
    // 桌面图标使用大尺寸 (32x32)
    const renderIcon = () => {
      if (app.iconName) {
        return getIcon(app.iconName as IconName, { size: 'large' });
      }
      
      // 根据应用类型返回默认图标
      switch (app.type) {
        case 'folder':
        case 'FOLDER':
          return getIcon('folder', { size: 'large' });
        case 'explorer':
        case 'EXPLORER':
          return getIcon('explorer', { size: 'large' });
        case 'notepad':
        case 'NOTEPAD':
          return getIcon('notepad', { size: 'large' });
        case 'blog':
        case 'BLOG':
          return getIcon('blog', { size: 'large' });
        case 'drive':
        case 'DRIVE':
          return getIcon('drive', { size: 'large' });
        case 'placeholder':
        case 'PLACEHOLDER':
          return getIcon('drive-removable', { size: 'large' });
        case 'root':
        case 'ROOT':
          return getIcon('my-computer', { size: 'large' });
        default:
          return getIcon('document', { size: 'large' });
      }
    };

    return (
      <IconWrapper
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
        onContextMenu={this.handleContextMenu}
      >
        <IconImage>{renderIcon()}</IconImage>
        <IconLabel selected={selected}>{app.name}</IconLabel>
      </IconWrapper>
    );
  }
}

export default AppIcon;