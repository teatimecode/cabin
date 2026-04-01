import React from 'react';
import styled from 'styled-components';
import { List } from '@react95/core';

const ContextMenuContainer = styled.div<{ x: number; y: number }>`
  position: fixed;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  min-width: 180px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 10000;
`;

const DisabledItem = styled.span`
  color: #808080;
  pointer-events: none;
`;

export interface ContextMenuItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  React.useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  const handleItemClick = (item: ContextMenuItem) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.disabled && item.onClick) {
      item.onClick();
    }
    onClose();
  };

  // 确保菜单不会超出屏幕
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 300);

  return (
    <ContextMenuContainer x={adjustedX} y={adjustedY}>
      <List>
        {/* eslint-disable-next-line react/no-array-index-key */}
        {items.map((item, index) => (
          <List.Item
            key={item.label || index}
            onClick={() => {
              if (!item.disabled && item.onClick) {
                item.onClick();
              }
              onClose();
            }}
          >
            {item.disabled ? (
              <DisabledItem>{item.label}</DisabledItem>
            ) : (
              item.label
            )}
          </List.Item>
        ))}
      </List>
    </ContextMenuContainer>
  );
};

export default ContextMenu;
