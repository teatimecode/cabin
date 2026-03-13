import React from 'react';
import styled from 'styled-components';
import { MenuList, MenuListItem, Divider } from 'react95';
import { Cutout } from 'react95';
import MarkdownRenderer from './MarkdownRenderer';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #c0c0c0;
`;

const MenuBar = styled.div`
  display: flex;
  background: #c0c0c0;
  padding: 2px 0;
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  padding: 2px 8px;
  cursor: pointer;
  font-size: 12px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  height: 20px;

  &:hover {
    background: #000080;
    color: #fff;
  }

  &:active, &[data-open="true"] {
    background: #000080;
    color: #fff;
  }
`;

const DropdownMenu = styled(MenuList)`
  min-width: 150px;
`;

const EditorArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #808080;
`;

const EditorContent = styled(Cutout)`
  flex: 1;
  margin: 4px;
  background: #fff;
  padding: 4px;
  overflow: auto;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2px 8px;
  background: #c0c0c0;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  border-top: 1px solid #fff;
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
          { label: '新建(N)', action: 'new' },
          { label: '打开(O)...', action: 'open' },
          { label: '保存(S)', action: 'save' },
          { type: 'divider' },
          { label: '退出(X)', action: 'exit' },
        ],
      },
      {
        name: '编辑',
        items: [
          { label: '撤销(U)', action: 'undo' },
          { type: 'divider' },
          { label: '剪切(T)', action: 'cut' },
          { label: '复制(C)', action: 'copy' },
          { label: '粘贴(P)', action: 'paste' },
          { type: 'divider' },
          { label: '全选(A)', action: 'selectAll' },
        ],
      },
      {
        name: '格式',
        items: [
          { label: '自动换行(W)', action: 'wordWrap' },
          { label: '字体(F)...', action: 'font' },
        ],
      },
      {
        name: '查看',
        items: [
          { label: '状态栏(S)', action: 'statusBar' },
          { type: 'divider' },
          { label: '放大(I)', action: 'zoomIn' },
          { label: '缩小(O)', action: 'zoomOut' },
        ],
      },
      {
        name: '帮助',
        items: [
          { label: '查看帮助(H)', action: 'help' },
          { type: 'divider' },
          { label: '关于记事本(A)', action: 'about' },
        ],
      },
    ];

    return (
      <MenuBar onClick={this.handleClickOutside}>
        {menus.map(menu => (
          <div key={menu.name} style={{ position: 'relative' }}>
            <MenuButton
              data-open={menuOpen === menu.name}
              onClick={(e) => {
                e.stopPropagation();
                this.handleMenuClick(menu.name);
              }}
            >
              {menu.name}
            </MenuButton>
            {menuOpen === menu.name && (
              <DropdownMenu
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
                      size="sm"
                      onClick={() => this.handleMenuItemClick(item.action)}
                    >
                      {item.label}
                    </MenuListItem>
                  );
                })}
              </DropdownMenu>
            )}
          </div>
        ))}
      </MenuBar>
    );
  }

  render() {
    const { content, showStatusBar } = this.props;
    const lineCount = content ? content.split('\n').length : 0;
    const charCount = content ? content.length : 0;

    return (
      <Container onClick={this.handleClickOutside}>
        {this.renderMenuBar()}

        <EditorArea>
          <EditorContent shadow={false}>
            <MarkdownRenderer content={content} />
          </EditorContent>
        </EditorArea>

        {showStatusBar !== false && (
          <StatusBar>
            <span>第 1 行，第 1 列</span>
            <span>100% | Windows (CRLF) | UTF-8</span>
          </StatusBar>
        )}
      </Container>
    );
  }
}

export default TextEditor;
