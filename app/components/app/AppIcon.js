import React from 'react';
import styled from 'styled-components';

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
  font-size: 32px;
  margin-bottom: 4px;
`;

const IconLabel = styled.span`
  font-size: 12px;
  color: #000;
  text-align: center;
  word-wrap: break-word;
  max-width: 72px;
  background: ${props => props.selected ? 'rgba(0, 0, 128, 0.2)' : 'transparent'};
  border: ${props => props.selected ? '1px dotted #000' : '1px dotted transparent'};
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

    return (
      <IconWrapper
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
      >
        <IconImage>{app.icon || '📄'}</IconImage>
        <IconLabel selected={selected}>{app.name}</IconLabel>
      </IconWrapper>
    );
  }
}

export default AppIcon;
