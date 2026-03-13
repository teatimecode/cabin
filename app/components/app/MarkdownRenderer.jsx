import React from 'react';
import styled from 'styled-components';

// 简单的 Markdown 解析器（无需外部依赖）
const parseMarkdown = (text) => {
  if (!text) return [];

  const lines = text.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let inList = false;
  let inListItem = false;
  let listItems = [];
  let codeContent = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push({ type: 'ul', items: [...listItems] });
      listItems = [];
    }
    inList = false;
  };

  const flushCodeBlock = () => {
    if (codeContent.length > 0) {
      elements.push({ type: 'codeblock', content: codeContent.join('\n') });
      codeContent = [];
    }
    inCodeBlock = false;
  };

  lines.forEach((line, index) => {
    // 代码块
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        flushList();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    // 标题
    if (line.startsWith('# ')) {
      flushList();
      elements.push({ type: 'h1', content: line.slice(2) });
      return;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push({ type: 'h2', content: line.slice(3) });
      return;
    }
    if (line.startsWith('### ')) {
      flushList();
      elements.push({ type: 'h3', content: line.slice(4) });
      return;
    }

    // 无序列表
    if (line.match(/^[-*]\s/)) {
      if (!inList) {
        flushList();
        inList = true;
      }
      listItems.push({ type: 'li', content: line.slice(2) });
      return;
    }

    // 待办事项列表
    if (line.match(/^[-*]\s\[[ x]\]/)) {
      flushList();
      const checked = line.match(/^[-*]\s\[x\]/);
      const content = line.replace(/^[-*]\s\[[ x]\]\s*/, '');
      elements.push({ type: 'task', checked: !!checked, content });
      return;
    }

    // 水平线
    if (line.match(/^---+$/)) {
      flushList();
      elements.push({ type: 'hr' });
      return;
    }

    // 引用
    if (line.startsWith('> ')) {
      flushList();
      elements.push({ type: 'blockquote', content: line.slice(2) });
      return;
    }

    // 空行
    if (line.trim() === '') {
      flushList();
      return;
    }

    // 普通段落
    flushList();
    elements.push({ type: 'p', content: line });
  });

  flushList();
  flushCodeBlock();

  return elements;
};

// 解析内联样式
const parseInline = (text) => {
  if (!text) return [];

  const parts = [];
  let remaining = text;

  while (remaining) {
    // 代码 `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push({ type: 'code', content: codeMatch[1] });
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // 粗体 **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push({ type: 'bold', content: boldMatch[1] });
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // 斜体 *text*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      parts.push({ type: 'italic', content: italicMatch[1] });
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // 普通文本
    const plainMatch = remaining.match(/^[^*`]+/);
    if (plainMatch) {
      parts.push({ type: 'text', content: plainMatch[0] });
      remaining = remaining.slice(plainMatch[0].length);
      continue;
    }

    // 其他字符
    parts.push({ type: 'text', content: remaining[0] });
    remaining = remaining.slice(1);
  }

  return parts;
};

const MarkdownContent = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #000;

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin: 16px 0 8px 0;
    padding-bottom: 4px;
    border-bottom: 1px solid #808080;
  }

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin: 14px 0 6px 0;
  }

  h3 {
    font-size: 16px;
    font-weight: bold;
    margin: 12px 0 4px 0;
  }

  p {
    margin: 8px 0;
  }

  ul {
    margin: 8px 0;
    padding-left: 24px;
    list-style-type: disc;
  }

  li {
    margin: 4px 0;
  }

  blockquote {
    margin: 8px 0;
    padding: 8px 16px;
    border-left: 4px solid #808080;
    background: #f0f0f0;
    font-style: italic;
  }

  code {
    font-family: 'Courier New', Courier, monospace;
    background: #f0f0f0;
    padding: 2px 4px;
    border: 1px solid #c0c0c0;
  }

  pre {
    background: #000;
    color: #0f0;
    padding: 12px;
    margin: 8px 0;
    overflow-x: auto;
    border: 2px inset #c0c0c0;

    code {
      background: transparent;
      border: none;
      color: inherit;
      padding: 0;
    }
  }

  hr {
    border: none;
    border-top: 1px solid #808080;
    margin: 16px 0;
  }

  input[type="checkbox"] {
    margin-right: 8px;
  }
`;

const InlineText = ({ parts }) => {
  return (
    <>
      {parts.map((part, index) => {
        switch (part.type) {
          case 'code':
            return <code key={index}>{part.content}</code>;
          case 'bold':
            return <strong key={index}>{part.content}</strong>;
          case 'italic':
            return <em key={index}>{part.content}</em>;
          default:
            return <span key={index}>{part.content}</span>;
        }
      })}
    </>
  );
};

const MarkdownRenderer = ({ content }) => {
  const elements = parseMarkdown(content);

  return (
    <MarkdownContent>
      {elements.map((el, index) => {
        switch (el.type) {
          case 'h1':
            return <h1 key={index}><InlineText parts={parseInline(el.content)} /></h1>;
          case 'h2':
            return <h2 key={index}><InlineText parts={parseInline(el.content)} /></h2>;
          case 'h3':
            return <h3 key={index}><InlineText parts={parseInline(el.content)} /></h3>;
          case 'p':
            return <p key={index}><InlineText parts={parseInline(el.content)} /></p>;
          case 'ul':
            return (
              <ul key={index}>
                {el.items.map((item, i) => (
                  <li key={i}><InlineText parts={parseInline(item.content)} /></li>
                ))}
              </ul>
            );
          case 'li':
            return <li key={index}><InlineText parts={parseInline(el.content)} /></li>;
          case 'blockquote':
            return <blockquote key={index}><InlineText parts={parseInline(el.content)} /></blockquote>;
          case 'codeblock':
            return (
              <pre key={index}>
                <code>{el.content}</code>
              </pre>
            );
          case 'hr':
            return <hr key={index} />;
          case 'task':
            return (
              <div key={index} style={{ margin: '4px 0' }}>
                <input type="checkbox" checked={el.checked} readOnly />
                <InlineText parts={parseInline(el.content)} />
              </div>
            );
          default:
            return null;
        }
      })}
    </MarkdownContent>
  );
};

export default MarkdownRenderer;
