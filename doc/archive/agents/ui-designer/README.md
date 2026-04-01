# UI Designer Agent - 使用说明

## 角色定位

专家级 UI 设计师，专注于 Win95 复古风格视觉设计，负责创建一致的、美观的、可访问的用户界面。

---

## 核心技能

### 1. Win95 设计语言专家
- ✅ 经典 Win95 视觉元素（斜面、阴影、灰色调）
- ✅ 复古像素风格图标设计
- ✅ 90 年代 UI 美学还原
- ✅ 现代可访问性适配

### 2. React95 主题定制
- ✅ 主题颜色系统（themes/default, themes/dark）
- ✅ 组件样式覆盖
- ✅ 自定义主题创建
- ✅ 品牌色彩集成

### 3. 配色方案设计
- ✅ Win95 经典配色（teal 背景、灰色窗口）
- ✅ 语义化颜色（成功、警告、错误、信息）
- ✅ 明暗主题适配
- ✅ WCAG 对比度标准（4.5:1）

### 4. 图标与视觉资产
- ✅ 应用图标设计（32x32, 48x48, 64x64）
- ✅ 文件夹图标系统
- ✅ 文件类型图标
- ✅ 状态指示图标

### 5. 响应式与适配
- ✅ 多屏幕尺寸适配
- ✅ 高 DPI 显示优化
- ✅ 移动端兼容设计

---

## 调用示例

### 场景 1: 设计新应用图标

```
/design-ui-designer
为我们的"我的博客"应用设计一个 Win95 风格的图标，
需要体现博客/文章的主题，使用经典的文件夹或文档样式。
```

### 场景 2: 主题配色调整

```
/design-ui-designer
当前的 teal 桌面背景感觉太单调了，
请提供 3 个替代的 Win95 经典配色方案，
并说明每种方案的情感表达和适用场景。
```

### 场景 3: 窗口样式优化

```
/design-ui-designer
设计一套改进的窗口样式，包括:
- 更明显的激活/非激活状态区分
- 更美观的标题栏渐变
- 优化的按钮 hover 效果
```

### 场景 4: 可访问性审查

```
/design-ui-designer
审查当前界面的颜色对比度，
确保符合 WCAG AA 标准，
列出需要调整的配色。
```

---

## 工作流程

### 需求分析 → 设计探索 → 方案输出 → 开发对接

1. **理解需求**: 明确设计风格和功能要求
2. **灵感收集**: 参考真实 Win95 界面截图
3. **设计输出**: 提供配色方案、组件样式、图标资产
4. **开发对接**: 提供 styled-components 样式代码

---

## 设计规范

### Win95 经典配色

```javascript
// ✅ Win95 经典颜色系统
const win95Colors = {
  // 桌面背景
  teal: '#008080',
  
  // 窗口颜色
  windowFace: '#c0c0c0',
  windowShadow: '#808080',
  windowHighlight: '#ffffff',
  windowText: '#000000',
  
  // 按钮颜色
  buttonFace: '#c0c0c0',
  buttonShadow: '#808080',
  buttonText: '#000000',
  
  // 选中状态
  selectionBlue: '#000080',
  selectionText: '#ffffff',
  
  // 语义颜色
  success: '#00ff00',
  warning: '#ffff00',
  error: '#ff0000',
};
```

### 斜面设计规范

```javascript
// ✅ Win95 经典斜面效果 (凸起)
const raisedStyle = `
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-right: 2px solid #808080;
  border-bottom: 2px solid #808080;
  background: #c0c0c0;
`;

// ✅ Win95 经典斜面效果 (凹陷)
const sunkenStyle = `
  border-top: 2px solid #808080;
  border-left: 2px solid #808080;
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  background: #ffffff;
`;
```

### 字体规范

```javascript
// ✅ Win95 经典字体栈
const fontFamily = `'MS Sans Serif', 'Segoe UI', sans-serif`;

// 字号系统
const fontSizes = {
  xs: '10px',   // 状态栏
  sm: '11px',   // 菜单项
  base: '12px', // 正文
  lg: '14px',   // 标题
  xl: '16px',   // 大标题
};
```

---

## 设计交付物

### 1. 配色方案文档

```markdown
## 配色方案：Classic Teal

**桌面背景**: #008080 (teal)
**主窗口**: #c0c0c0 (silver)
**强调色**: #000080 (navy blue)

### 可访问性
- 文本对比度：7.2:1 ✅
- 链接识别度：明显下划线 ✅
```

### 2. 组件样式代码

```tsx
// 直接可用的 styled-components
const Win95Window = styled.div`
  background: ${({ theme }) => theme.window.face};
  border-top: 2px solid ${({ theme }) => theme.window.highlight};
  border-left: 2px solid ${({ theme }) => theme.window.highlight};
  border-right: 2px solid ${({ theme }) => theme.window.shadow};
  border-bottom: 2px solid ${({ theme }) => theme.window.shadow};
  box-shadow: 1px 1px 0 #000;
`;
```

### 3. 图标资产

```
/icons
├── my-computer.ico      # 我的电脑图标
├── my-documents.ico     # 我的文档图标
├── notepad.ico          # 记事本图标
└── folder-open.ico      # 打开的文件夹图标
```

---

## 任务记录模板

在 `tasks/` 目录下创建文件：`tasks/[任务名称].md`

```markdown
# [设计任务名称]

**创建日期**: 2026-03-17
**状态**: 🟡 进行中

## 设计需求


## 灵感参考


## 配色方案


## 样式代码


## 设计资产


## 开发对接说明

```

---

## 验收标准

UI Designer 完成的设计应满足：

- ✅ 符合 Win95 视觉风格
- ✅ 颜色对比度符合 WCAG AA 标准
- ✅ 提供可直接使用的样式代码
- ✅ 图标清晰、风格一致
- ✅ 主题系统可扩展

---

## 相关资源

- [React95 主题文档](https://github.com/React95/React95)
- [Win95 美学指南](https://windows93.net)
- [WCAG 对比度检查器](https://webaim.org/resources/contrastchecker/)
- [Coolors 配色工具](https://coolors.co)
