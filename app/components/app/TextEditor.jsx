import React from 'react';
import styled from 'styled-components';
import { MenuList, MenuListItem, Separator, ScrollView, Frame } from 'react95';
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

const MenuItem = styled(MenuListItem)`
  font-size: 12px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  padding: 0 8px;
  height: 20px !important;
  line-height: 20px !important;
  min-height: 20px;
  display: flex;
  justify-content: space-between;
  
  &.disabled {
    color: #808080;
    pointer-events: none;
  }
`;

const Shortcut = styled.span`
  color: #808080;
  margin-left: 16px;
`;

const EditorArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #808080;
`;

const EditorContent = styled(ScrollView)`
  flex: 1;
  margin: 4px;
  background: #fff;
  padding: 8px;
  overflow: auto;
  font-size: 14px;
  line-height: 1.5;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
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

// 关于对话框
const AboutOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const AboutDialog = styled(Frame)`
  padding: 16px;
  min-width: 300px;
  text-align: center;
`;

const AboutTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
`;

const AboutText = styled.p`
  margin: 8px 0;
  font-size: 12px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
`;

const AboutButton = styled.button`
  margin-top: 16px;
  padding: 4px 24px;
  font-size: 12px;
  cursor: pointer;
`;

class TextEditor extends React.PureComponent {
  state = {
    menuOpen: null,
    wordWrap: true,
    showStatusBar: true,
    zoom: 100,
    showAbout: false,
  };

  handleMenuClick = (menuName) => {
    this.setState(prevState => ({
      menuOpen: prevState.menuOpen === menuName ? null : menuName,
    }));
  };

  handleMenuItemClick = (action) => {
    this.setState({ menuOpen: null });

    switch (action) {
      case 'new':
        // 新建文件 - 可以触发回调或显示提示
        alert('新建文件功能：此为演示版本，暂不支持编辑功能');
        break;
      case 'open':
        alert('打开文件功能：此为演示版本，暂不支持编辑功能');
        break;
      case 'save':
        alert('保存文件功能：此为演示版本，暂不支持编辑功能');
        break;
      case 'exit':
        // 退出 - 关闭窗口
        const { onClose } = this.props;
        if (onClose) onClose();
        break;
      case 'undo':
        alert('撤销功能：此为演示版本，暂不支持编辑功能');
        break;
      case 'cut':
        alert('剪切功能：此为演示版本，暂不支持编辑功能');
        break;
      case 'copy':
        alert('复制功能：此为演示版本，暂不支持编辑功能');
        break;
      case 'paste':
        alert('粘贴功能：此为演示版本，暂不支持编辑功能');
        break;
      case 'selectAll':
        alert('全选功能：此为演示版本，暂不支持编辑功能');
        break;
      case 'wordWrap':
        this.setState(prev => ({ wordWrap: !prev.wordWrap }));
        break;
      case 'font':
        alert('字体设置：此为演示版本，暂不支持此功能');
        break;
      case 'statusBar':
        this.setState(prev => ({ showStatusBar: !prev.showStatusBar }));
        break;
      case 'zoomIn':
        this.setState(prev => ({ zoom: Math.min(prev.zoom + 10, 200) }));
        break;
      case 'zoomOut':
        this.setState(prev => ({ zoom: Math.max(prev.zoom - 10, 50) }));
        break;
      case 'help':
        alert('查看帮助：请访问 GitHub 仓库了解更多信息');
        break;
      case 'about':
        this.setState({ showAbout: true });
        break;
      default:
        const { onAction } = this.props;
        if (onAction) onAction(action);
    }
  };

  handleClickOutside = () => {
    this.setState({ menuOpen: null });
  };

  renderMenuBar() {
    const { menuOpen, wordWrap, showStatusBar, zoom } = this.state;

    const menus = [
      {
        name: '文件',
        items: [
          { label: '新建(N)', action: 'new', shortcut: 'Ctrl+N' },
          { label: '打开(O)...', action: 'open', shortcut: 'Ctrl+O' },
          { label: '保存(S)', action: 'save', shortcut: 'Ctrl+S' },
          { type: 'divider' },
          { label: '退出(X)', action: 'exit' },
        ],
      },
      {
        name: '编辑',
        items: [
          { label: '撤销(U)', action: 'undo', shortcut: 'Ctrl+Z', disabled: true },
          { type: 'divider' },
          { label: '剪切(T)', action: 'cut', shortcut: 'Ctrl+X', disabled: true },
          { label: '复制(C)', action: 'copy', shortcut: 'Ctrl+C', disabled: true },
          { label: '粘贴(P)', action: 'paste', shortcut: 'Ctrl+V', disabled: true },
          { type: 'divider' },
          { label: '全选(A)', action: 'selectAll', shortcut: 'Ctrl+A', disabled: true },
        ],
      },
      {
        name: '格式',
        items: [
          { label: `自动换行(W) ${wordWrap ? '✓' : ''}`, action: 'wordWrap' },
          { label: '字体(F)...', action: 'font' },
        ],
      },
      {
        name: '查看',
        items: [
          { label: `状态栏(S) ${showStatusBar ? '✓' : ''}`, action: 'statusBar' },
          { type: 'divider' },
          { label: '放大(I)', action: 'zoomIn', shortcut: 'Ctrl++' },
          { label: '缩小(O)', action: 'zoomOut', shortcut: 'Ctrl+-' },
          { label: `缩放: ${zoom}%`, action: 'zoomDisplay', disabled: true },
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
                    return <Separator key={index} />;
                  }
                  return (
                    <MenuItem
                      key={index}
                      className={item.disabled ? 'disabled' : ''}
                      onClick={() => !item.disabled && this.handleMenuItemClick(item.action)}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && <Shortcut>{item.shortcut}</Shortcut>}
                    </MenuItem>
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
    const { content, showStatusBar: propsShowStatusBar } = this.props;
    const { showStatusBar, zoom, showAbout } = this.state;
    const lineCount = content ? content.split('\n').length : 0;
    const charCount = content ? content.length : 0;

    const displayStatusBar = propsShowStatusBar !== false && showStatusBar;

    return (
      <Container onClick={this.handleClickOutside}>
        {this.renderMenuBar()}

        <EditorArea>
          <EditorContent 
            shadow={false}
            style={{ 
              fontSize: `${14 * zoom / 100}px`,
              whiteSpace: this.state.wordWrap ? 'pre-wrap' : 'pre',
            }}
          >
            <MarkdownRenderer content={content} />
          </EditorContent>
        </EditorArea>

        {displayStatusBar && (
          <StatusBar>
            <span>第 1 行，第 1 列</span>
            <span>{zoom}% | Windows (CRLF) | UTF-8</span>
          </StatusBar>
        )}

        {showAbout && (
          <AboutOverlay onClick={() => this.setState({ showAbout: false })}>
            <AboutDialog variant="well" onClick={e => e.stopPropagation()}>
              <AboutTitle>记事本</AboutTitle>
              <AboutText>版本 1.0</AboutText>
              <AboutText>Windows 95 风格记事本</AboutText>
              <AboutText>使用 React95 构建</AboutText>
              <AboutText>© 2024 TeaTime Code</AboutText>
              <AboutButton onClick={() => this.setState({ showAbout: false })}>
                确定
              </AboutButton>
            </AboutDialog>
          </AboutOverlay>
        )}
      </Container>
    );
  }
}

export default TextEditor;
