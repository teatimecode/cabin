"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Frame, List } from '@react95/core';
import MarkdownRenderer from './MarkdownRenderer';
import { useVirtualStorage } from '../../lib/vfs/hooks';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #c0c0c0;
`;

const MenuBar = styled.div`
  display: flex;
  padding: 2px 4px;
  background: #c0c0c0;
  gap: 8px;
  position: relative;
`;

const MenuItem = styled.div`
  padding: 2px 8px;
  font-size: 12px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: #0a246a;
    color: #fff;
  }
`;

const DropdownMenu = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  background: #fff;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  z-index: 1000;
`;

const Toolbar = styled.div`
  display: flex;
  padding: 4px;
  background: #c0c0c0;
  gap: 4px;
  border-bottom: 1px solid #808080;
`;

const StyledButton = styled.button`
  border: 1px solid #808080;
  background: #c0c0c0;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  outline: none;
  &:hover {
    background: #d0d0d0;
  }
  &:active {
    background: #a0a0a0;
  }
`;

const EditorContent = styled.div`
  flex: 1;
  padding: 8px;
  display: flex;
  overflow: hidden;
`;

const StyledTextArea = styled.textarea`
  flex: 1;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  background: #fff;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  padding: 8px;
  resize: none;
  outline: none;
`;

const PreviewPane = styled(Frame as any)`
  flex: 1;
  margin-left: 8px;
  padding: 8px;
  background: #fff;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  overflow: auto;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  background: #c0c0c0;
  border-top: 1px solid #fff;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  color: #666;
`;

interface TextEditorProps {
  initialContent?: string;
  isPreview?: boolean;
  filePath?: string;  // 新增：文件路径
  onSave?: (content: string) => void;  // 新增：保存回调
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  initialContent = '', 
  isPreview = false,
  filePath,
  onSave,
}) => {
  // 确保 content 始终是一个字符串，避免非受控到受控的警告
  const [content, setContent] = useState(initialContent || '');
  const [previewMode, setPreviewMode] = useState(isPreview);
  const [isSaving, setIsSaving] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // 使用虚拟存储 Hook
  const { writeFile } = useVirtualStorage();

  // 如果初始内容改变，则更新状态（确保始终为字符串）
  useEffect(() => {
    setContent(initialContent || '');
    setIsModified(false);
  }, [initialContent]);

  const handleSave = () => {
    if (filePath) {
      // 使用虚拟存储保存
      setIsSaving(true);
      try {
        const success = writeFile(filePath, content);
        if (success) {
          setIsModified(false);
          alert('文件已保存到虚拟文件系统\n弹出时会询问是否导出到磁盘');
        } else {
          alert('保存失败');
        }
      } catch (error) {
        // 静默处理错误，避免在生产环境显示错误信息
      } finally {
        setIsSaving(false);
      }
    } else if (onSave) {
      // 使用回调保存（兼容旧版）
      onSave(content);
      alert('内容已保存');
    } else {
      // 无文件路径时的提示
      alert('请使用"另存为"功能选择保存位置');
    }
  };

  const handleNew = () => {
    if (isModified && !window.confirm('当前内容有未保存的修改，确定要新建吗？')) {
      return;
    }
    setContent('');
    setIsModified(false);
  };

  const handleCopy = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.select();
      document.execCommand('copy');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent(prev => prev + text);
      setIsModified(true);
    } catch (err) {
      alert('无法读取剪贴板内容');
    }
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuAction = (action: string) => {
    setActiveMenu(null);
    switch(action) {
      case 'new':
        handleNew();
        break;
      case 'save':
        handleSave();
        break;
      case 'copy':
        handleCopy();
        break;
      case 'paste':
        handlePaste();
        break;
      case 'preview':
        togglePreview();
        break;
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  // 计算行数
  const lineCount = content.split('\n').length;
  // 计算字符数
  const charCount = content.length;
  // 计算当前光标位置（简化版本）
  const cursorPosition = 'Ln 1, Col 1';

  // 点击其他地方关闭菜单
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <EditorContainer onClick={(e) => e.stopPropagation()}>
      {/* 菜单栏 */}
      <MenuBar>
        <div onClick={(e) => { e.stopPropagation(); handleMenuClick('file'); }}>
          文件
          <DropdownMenu show={activeMenu === 'file'}>
            <List>
              <List.Item onClick={() => handleMenuAction('new')}>新建</List.Item>
              <List.Item onClick={() => handleMenuAction('save')}>保存</List.Item>
              <List.Divider />
              <List.Item onClick={() => handleMenuAction('copy')}>复制</List.Item>
              <List.Item onClick={() => handleMenuAction('paste')}>粘贴</List.Item>
            </List>
          </DropdownMenu>
        </div>
        <div onClick={(e) => { e.stopPropagation(); handleMenuClick('edit'); }}>
          编辑
          <DropdownMenu show={activeMenu === 'edit'}>
            <List>
              <List.Item onClick={() => handleMenuAction('copy')}>复制</List.Item>
              <List.Item onClick={() => handleMenuAction('paste')}>粘贴</List.Item>
            </List>
          </DropdownMenu>
        </div>
        <div onClick={(e) => { e.stopPropagation(); handleMenuClick('view'); }}>
          查看
          <DropdownMenu show={activeMenu === 'view'}>
            <List>
              <List.Item onClick={() => handleMenuAction('preview')}>
                {previewMode ? '编辑模式' : '预览模式'}
              </List.Item>
            </List>
          </DropdownMenu>
        </div>
      </MenuBar>

      {/* 工具栏 */}
      <Toolbar>
        <StyledButton onClick={handleSave} disabled={isSaving || !isModified}>
          {isSaving ? '保存中...' : isModified ? '* 保存' : '保存'}
        </StyledButton>
        <StyledButton onClick={togglePreview}>
          {previewMode ? '编辑' : '预览'}
        </StyledButton>
        {filePath && (
          <span style={{ fontSize: '11px', color: '#666', marginLeft: '8px' }}>
            {filePath} {isModified && <span style={{ color: 'red' }}>*</span>}
          </span>
        )}
      </Toolbar>
      <EditorContent>
        {!previewMode ? (
          <StyledTextArea
            value={content || ''}
            onChange={handleContentChange}
            placeholder="在这里输入文本..."
          />
        ) : (
          <PreviewPane shadow>
            <MarkdownRenderer content={content || ''} />
          </PreviewPane>
        )}
      </EditorContent>
      {/* 状态栏 */}
      <StatusBar>
        <span>{lineCount} 行，{charCount} 字符</span>
        <span>{cursorPosition}</span>
        <span>{filePath ? 'UTF-8' : '未命名'}</span>
      </StatusBar>
    </EditorContainer>
  );
};

export default TextEditor;