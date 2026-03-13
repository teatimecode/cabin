import React from 'react';
import styled from 'styled-components';
import { getIcon } from '../icons';

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

const IconLabel = styled.span`
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

class AppIcon extends React.PureComponent {
  handleDoubleClick = () => {
    const { app, onOpen } = this.props;
    if (onOpen) {
      onOpen(app);
    }
  };

  handleClick = (e) => {
    const { app, onSelect } = this.props;
    if (onSelect) {
      onSelect(app, e.ctrlKey);
    }
  };

  render() {
    const { app, selected } = this.props;

    // 获取图标，如果没有指定则根据类型使用默认图标
    const renderIcon = () => {
      if (app.iconName) {
        return getIcon(app.iconName);
      }
      
      // 根据应用类型返回默认图标
      switch (app.type) {
        case 'folder':
        case 'explorer':
          return getIcon('folder');
        case 'notepad':
          return getIcon('notepad');
        default:
          return getIcon('document');
      }
    };

    return (
      <IconWrapper
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
      >
        <IconImage>{renderIcon()}</IconImage>
        <IconLabel selected={selected}>{app.name}</IconLabel>
      </IconWrapper>
    );
  }
}

export default AppIcon;
