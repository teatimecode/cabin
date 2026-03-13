import React from 'react';
import styled from 'styled-components';
import { Button, MenuList, MenuListItem, Divider } from 'react95';
import MarkdownRenderer from './MarkdownRenderer';

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

const MenuBar = styled.div`
  display: flex;
  background: #c0c0c0;
  border-bottom: 1px solid #808080;
  padding: 2px 4px;
  gap: 4px;
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: rgba(0, 0, 128, 0.1);
  }

  &:active {
    background: rgba(0, 0, 128, 0.2);
  }
`;

const EditorContent = styled.div`
  flex: 1;
  overflow: auto;
  background: #fff;
  border: 1px solid #808080;
  border-style: inset;
  margin: 4px;
  padding: 8px;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  background: #c0c0c0;
  border-top: 1px solid #808080;
  font-size: 12px;
`;

class TextEditor extends React.PureComponent {
  state = {
    menuOpen: null,
  };

  handleMenuClick = (menuName) => {
    this.setState(prevState => ({
      menuOpen: prevState.menuOpen === menuName ? null : menuName,
    }));
  };

  handleMenuItemClick = (action) => {
    this.setState({ menuOpen: null });

    const { onAction } = this.props;
    if (onAction) {
      onAction(action);
    }
  };

  handleClickOutside = () => {
    this.setState({ menuOpen: null });
  };

  renderMenuBar() {
    const { menuOpen } = this.state;

    const menus = [
      {
        name: '文件',
        items: [
          { label: '新建', action: 'new' },
          { label: '打开...', action: 'open' },
          { label: '保存', action: 'save' },
          { type: 'divider' },
          { label: '退出', action: 'exit' },
        ],
      },
      {
        name: '编辑',
        items: [
          { label: '撤销', action: 'undo' },
          { type: 'divider' },
          { label: '剪切', action: 'cut' },
          { label: '复制', action: 'copy' },
          { label: '粘贴', action: 'paste' },
          { type: 'divider' },
          { label: '全选', action: 'selectAll' },
        ],
      },
      {
        name: '格式',
        items: [
          { label: '自动换行', action: 'wordWrap' },
          { label: '字体...', action: 'font' },
        ],
      },
      {
        name: '查看',
        items: [
          { label: '状态栏', action: 'statusBar' },
          { type: 'divider' },
          { label: '放大', action: 'zoomIn' },
          { label: '缩小', action: 'zoomOut' },
        ],
      },
      {
        name: '帮助',
        items: [
          { label: '关于记事本', action: 'about' },
        ],
      },
    ];

    return (
      <MenuBar onClick={this.handleClickOutside}>
        {menus.map(menu => (
          <div key={menu.name} style={{ position: 'relative' }}>
            <MenuButton
              onClick={(e) => {
                e.stopPropagation();
                this.handleMenuClick(menu.name);
              }}
            >
              {menu.name}
            </MenuButton>
            {menuOpen === menu.name && (
              <MenuList
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  zIndex: 1000,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {menu.items.map((item, index) => {
                  if (item.type === 'divider') {
                    return <Divider key={index} />;
                  }
                  return (
                    <MenuListItem
                      key={index}
                      onClick={() => this.handleMenuItemClick(item.action)}
                    >
                      {item.label}
                    </MenuListItem>
                  );
                })}
              </MenuList>
            )}
          </div>
        ))}
      </MenuBar>
    );
  }

  render() {
    const { content, fileName, showStatusBar } = this.props;
    const lineCount = content ? content.split('\n').length : 0;
    const charCount = content ? content.length : 0;

    return (
      <Container onClick={this.handleClickOutside}>
        {this.renderMenuBar()}

        <Toolbar>
          <Button onClick={() => this.handleMenuItemClick('new')}>
            新建
          </Button>
          <Button onClick={() => this.handleMenuItemClick('save')}>
            保存
          </Button>
        </Toolbar>

        <EditorContent>
          <MarkdownRenderer content={content} />
        </EditorContent>

        {showStatusBar !== false && (
          <StatusBar>
            <span>行: {lineCount}</span>
            <span>字符: {charCount}</span>
            <span>UTF-8</span>
          </StatusBar>
        )}
      </Container>
    );
  }
}

export default TextEditor;
