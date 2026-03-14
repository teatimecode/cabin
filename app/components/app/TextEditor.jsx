import React from 'react';
import styled from 'styled-components';
import { MenuList, MenuListItem, Separator, ScrollView, Frame, Button } from 'react95';

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

const EditorTextarea = styled.textarea`
  flex: 1;
  margin: 4px;
  background: #fff;
  padding: 8px;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  font-size: 14px;
  line-height: 1.5;
  font-family: 'Fixedsys', 'Consolas', 'Courier New', monospace;
  resize: none;
  outline: none;
  white-space: ${props => props.wordWrap ? 'pre-wrap' : 'pre'};
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

const DialogButton = styled(Button)`
  margin-top: 16px;
  min-width: 75px;
`;

// 保存确认对话框
const ConfirmDialog = styled(Frame)`
  padding: 16px;
  min-width: 300px;
`;

const ConfirmText = styled.p`
  margin: 0 0 16px 0;
  font-size: 12px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

class TextEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.textareaRef = React.createRef();
    this.state = {
      menuOpen: null,
      wordWrap: true,
      showStatusBar: true,
      zoom: 100,
      showAbout: false,
      showSaveConfirm: false,
      pendingAction: null, // 待执行的操作
      editedContent: props.content || '', // 编辑中的内容
      isModified: false, // 是否有未保存的修改
      cursorLine: 1,
      cursorColumn: 1,
    };
  }

  componentDidUpdate(prevProps) {
    // 当外部content变化时更新（如打开新文件）
    if (prevProps.content !== this.props.content && !this.state.isModified) {
      this.setState({ editedContent: this.props.content || '' });
    }
  }

  handleMenuClick = (menuName) => {
    this.setState(prevState => ({
      menuOpen: prevState.menuOpen === menuName ? null : menuName,
    }));
  };

  handleMenuItemClick = (action) => {
    this.setState({ menuOpen: null });

    switch (action) {
      case 'new':
        this.handleNew();
        break;
      case 'open':
        this.handleOpen();
        break;
      case 'save':
        this.handleSave();
        break;
      case 'saveAs':
        this.handleSaveAs();
        break;
      case 'exit':
        this.handleExit();
        break;
      case 'undo':
        document.execCommand('undo');
        break;
      case 'cut':
        document.execCommand('cut');
        break;
      case 'copy':
        document.execCommand('copy');
        break;
      case 'paste':
        if (navigator.clipboard) {
          navigator.clipboard.readText().then(text => {
            const textarea = this.textareaRef.current;
            if (textarea) {
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const newContent = 
                this.state.editedContent.substring(0, start) + 
                text + 
                this.state.editedContent.substring(end);
              this.handleContentChange(newContent);
              setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + text.length;
              }, 0);
            }
          });
        }
        break;
      case 'selectAll':
        const textarea = this.textareaRef.current;
        if (textarea) {
          textarea.select();
        }
        break;
      case 'delete':
        document.execCommand('delete');
        break;
      case 'wordWrap':
        this.setState(prev => ({ wordWrap: !prev.wordWrap }));
        break;
      case 'font':
        alert('字体设置功能暂未实现');
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

  // 处理内容变化
  handleContentChange = (newContent) => {
    this.setState({ 
      editedContent: newContent,
      isModified: true,
    });
  };

  // 更新光标位置
  handleCursorChange = () => {
    const textarea = this.textareaRef.current;
    if (!textarea) return;

    const text = textarea.value.substring(0, textarea.selectionStart);
    const lines = text.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    this.setState({ cursorLine: line, cursorColumn: column });
  };

  // 新建文件
  handleNew = () => {
    if (this.state.isModified) {
      this.setState({ showSaveConfirm: true, pendingAction: 'new' });
    } else {
      this.setState({ 
        editedContent: '', 
        isModified: false,
      });
      const { onNew } = this.props;
      if (onNew) onNew();
    }
  };

  // 打开文件
  handleOpen = () => {
    if (this.state.isModified) {
      this.setState({ showSaveConfirm: true, pendingAction: 'open' });
    } else {
      const { onOpen } = this.props;
      if (onOpen) onOpen();
    }
  };

  // 保存文件
  handleSave = () => {
    const { onSave } = this.props;
    if (onSave) {
      onSave(this.state.editedContent);
      this.setState({ isModified: false });
    } else {
      // 如果没有保存回调，尝试使用下载
      this.handleDownload();
    }
  };

  // 另存为
  handleSaveAs = () => {
    this.handleDownload();
  };

  // 下载文件
  handleDownload = () => {
    const { fileName } = this.props;
    const blob = new Blob([this.state.editedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || '未命名.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.setState({ isModified: false });
  };

  // 退出
  handleExit = () => {
    if (this.state.isModified) {
      this.setState({ showSaveConfirm: true, pendingAction: 'exit' });
    } else {
      const { onClose } = this.props;
      if (onClose) onClose();
    }
  };

  // 处理保存确认对话框
  handleConfirmSave = () => {
    this.handleSave();
    this.executePendingAction();
  };

  handleConfirmDontSave = () => {
    this.executePendingAction();
  };

  handleConfirmCancel = () => {
    this.setState({ showSaveConfirm: false, pendingAction: null });
  };

  executePendingAction = () => {
    const { pendingAction } = this.state;
    this.setState({ showSaveConfirm: false, isModified: false, pendingAction: null });

    switch (pendingAction) {
      case 'new':
        this.setState({ editedContent: '' });
        const { onNew } = this.props;
        if (onNew) onNew();
        break;
      case 'open':
        const { onOpen } = this.props;
        if (onOpen) onOpen();
        break;
      case 'exit':
        const { onClose } = this.props;
        if (onClose) onClose();
        break;
    }
  };

  handleClickOutside = () => {
    this.setState({ menuOpen: null });
  };

  // 键盘快捷键
  handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          this.handleNew();
          break;
        case 'o':
          e.preventDefault();
          this.handleOpen();
          break;
        case 's':
          e.preventDefault();
          this.handleSave();
          break;
        case 'a':
          // 全选使用默认行为
          break;
      }
    }
  };

  renderMenuBar() {
    const { menuOpen, wordWrap, showStatusBar, zoom, isModified } = this.state;

    const menus = [
      {
        name: '文件(F)',
        items: [
          { label: '新建(N)', action: 'new', shortcut: 'Ctrl+N' },
          { label: '打开(O)...', action: 'open', shortcut: 'Ctrl+O' },
          { label: '保存(S)', action: 'save', shortcut: 'Ctrl+S' },
          { label: '另存为(A)...', action: 'saveAs' },
          { type: 'divider' },
          { label: '退出(X)', action: 'exit' },
        ],
      },
      {
        name: '编辑(E)',
        items: [
          { label: '撤销(U)', action: 'undo', shortcut: 'Ctrl+Z' },
          { type: 'divider' },
          { label: '剪切(T)', action: 'cut', shortcut: 'Ctrl+X' },
          { label: '复制(C)', action: 'copy', shortcut: 'Ctrl+C' },
          { label: '粘贴(P)', action: 'paste', shortcut: 'Ctrl+V' },
          { label: '删除(D)', action: 'delete', shortcut: 'Del' },
          { type: 'divider' },
          { label: '全选(A)', action: 'selectAll', shortcut: 'Ctrl+A' },
        ],
      },
      {
        name: '格式(O)',
        items: [
          { label: `${wordWrap ? '✓ ' : ''}自动换行(W)`, action: 'wordWrap' },
          { label: '字体(F)...', action: 'font' },
        ],
      },
      {
        name: '查看(V)',
        items: [
          { label: `${showStatusBar ? '✓ ' : ''}状态栏(S)`, action: 'statusBar' },
          { type: 'divider' },
          { label: '放大(I)', action: 'zoomIn', shortcut: 'Ctrl++' },
          { label: '缩小(O)', action: 'zoomOut', shortcut: 'Ctrl+-' },
          { label: `缩放: ${zoom}%`, action: 'zoomDisplay', disabled: true },
        ],
      },
      {
        name: '帮助(H)',
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
    const { fileName, showStatusBar: propsShowStatusBar } = this.props;
    const { 
      showStatusBar, 
      zoom, 
      showAbout, 
      showSaveConfirm,
      editedContent, 
      isModified,
      wordWrap,
      cursorLine,
      cursorColumn,
    } = this.state;
    
    const lineCount = editedContent ? editedContent.split('\n').length : 0;
    const displayStatusBar = propsShowStatusBar !== false && showStatusBar;
    const title = fileName ? (isModified ? `*${fileName}` : fileName) : (isModified ? '*无标题' : '无标题');

    return (
      <Container onClick={this.handleClickOutside} onKeyDown={this.handleKeyDown}>
        {this.renderMenuBar()}

        <EditorArea>
          <EditorTextarea
            ref={this.textareaRef}
            wordWrap={wordWrap}
            style={{ fontSize: `${14 * zoom / 100}px` }}
            value={editedContent}
            onChange={(e) => this.handleContentChange(e.target.value)}
            onClick={this.handleCursorChange}
            onKeyUp={this.handleCursorChange}
            spellCheck={false}
          />
        </EditorArea>

        {displayStatusBar && (
          <StatusBar>
            <span>第 {cursorLine} 行，第 {cursorColumn} 列</span>
            <span>{zoom}% | Windows (CRLF) | UTF-8</span>
          </StatusBar>
        )}

        {/* 关于对话框 */}
        {showAbout && (
          <AboutOverlay onClick={() => this.setState({ showAbout: false })}>
            <AboutDialog variant="well" onClick={e => e.stopPropagation()}>
              <AboutTitle>记事本</AboutTitle>
              <AboutText>版本 1.0</AboutText>
              <AboutText>Windows 95 风格记事本</AboutText>
              <AboutText>使用 React95 构建</AboutText>
              <AboutText>支持编辑、新建、保存功能</AboutText>
              <AboutText>© 2024 TeaTime Code</AboutText>
              <DialogButton onClick={() => this.setState({ showAbout: false })}>
                确定
              </DialogButton>
            </AboutDialog>
          </AboutOverlay>
        )}

        {/* 保存确认对话框 */}
        {showSaveConfirm && (
          <AboutOverlay>
            <ConfirmDialog variant="well" onClick={e => e.stopPropagation()}>
              <ConfirmText>
                是否保存对 {fileName || '无标题'} 的更改？
              </ConfirmText>
              <ButtonRow>
                <DialogButton onClick={this.handleConfirmSave}>
                  保存(S)
                </DialogButton>
                <DialogButton onClick={this.handleConfirmDontSave}>
                  不保存(N)
                </DialogButton>
                <DialogButton onClick={this.handleConfirmCancel}>
                  取消
                </DialogButton>
              </ButtonRow>
            </ConfirmDialog>
          </AboutOverlay>
        )}
      </Container>
    );
  }
}

export default TextEditor;
