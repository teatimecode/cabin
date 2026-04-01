# Cabin 项目 - Agency Agents 使用指南

## 项目概述

**Cabin** - Win95 风格个人网站环境

**技术栈**:
- Next.js 14.2 + React 18
- React95 4.0 (Win95 UI 组件库)
- styled-components 6.1
- TypeScript + ESLint

**部署**: GitHub Pages (静态导出)

---

## 已配置 Agents 列表

根据项目需求，已评估并配置以下 agents：

| Agent | 调用命令 | 职责 | 当前状态 |
|-------|---------|------|---------|
| Frontend Developer | `/engineering-frontend-developer` | React/Next.js 开发、组件实现、性能优化 | ✅ 已配置 |
| UI Designer | `/design-ui-designer` | Win95 风格视觉设计、配色方案、图标设计 | ✅ 已配置 |
| UX Architect | `/design-ux-architect` | 交互流程、窗口管理、用户体验设计 | ✅ 已配置 |
| Code Reviewer | `/engineering-code-reviewer` | 代码质量审查、TypeScript 类型检查 | ✅ 已配置 |
| Content Writer | `/marketing-content-strategist` | 博客内容规划、文案撰写 | ✅ 已配置 |

---

## 各 Agent 详细说明

### 1. Frontend Developer

**调用方式**: `/engineering-frontend-developer`

**核心职责**:
- Next.js 应用开发与优化
- React 组件实现（函数组件 + Hooks）
- styled-components 样式编写
- TypeScript 类型定义
- GitHub Pages 部署配置

**适用场景**:
- ✅ 实现新的桌面组件（窗口、任务栏、开始菜单）
- ✅ 优化渲染性能和 bundle 大小
- ✅ 修复 TypeScript 类型错误
- ✅ 配置 Next.js 静态导出
- ✅ 集成 Markdown 渲染（react-markdown）

**产出物位置**: `doc/agents/frontend-developer/tasks/`

---

### 2. UI Designer

**调用方式**: `/design-ui-designer`

**核心职责**:
- Win95 复古风格视觉设计
- React95 主题定制
- 配色方案与图标设计
- 响应式布局适配

**适用场景**:
- ✅ 设计新的应用图标
- ✅ 调整主题配色（themes/default）
- ✅ 设计窗口样式（标题栏、边框、按钮）
- ✅ 创建桌面背景方案
- ✅ 确保 WCAG 可访问性标准

**产出物位置**: `doc/agents/ui-designer/tasks/`

---

### 3. UX Architect

**调用方式**: `/design-ux-architect`

**核心职责**:
- 窗口交互流程设计
- 用户操作体验优化
- 文件导航系统设计
- 快捷方式布局规划

**适用场景**:
- ✅ 设计窗口管理器行为（拖拽、最大化、最小化）
- ✅ 规划文件夹导航逻辑
- ✅ 设计右键菜单交互
- ✅ 优化任务栏功能
- ✅ 创建用户流程图

**产出物位置**: `doc/agents/ux-architect/tasks/`

---

### 4. Code Reviewer

**调用方式**: `/engineering-code-reviewer`

**核心职责**:
- 代码质量审查
- TypeScript 类型安全
- ESLint 规则遵循
- 最佳实践检查

**适用场景**:
- ✅ PR 代码审查
- ✅ 类型定义检查
- ✅ 性能问题检测
- ✅ 安全漏洞扫描
- ✅ 代码规范一致性检查

**产出物位置**: `doc/agents/code-reviewer/tasks/`

---

### 5. Content Writer

**调用方式**: `/marketing-content-strategist`

**核心职责**:
- 博客内容规划
- 技术文章撰写
- 内容分类组织

**适用场景**:
- ✅ 规划博客文章主题
- ✅ 撰写技术教程
- ✅ 组织内容分类结构
- ✅ 编写页面描述文案

**产出物位置**: `doc/agents/content-writer/tasks/`

---

## 任务跟踪模板

每个 agent 目录下包含 `tasks/` 文件夹，用于记录任务进度：

```markdown
# [任务名称]

**Agent**: [角色名称]
**创建日期**: YYYY-MM-DD
**状态**: 🟡 进行中 / 🟢 已完成 / 🔴 已阻塞

## 任务描述


## 实现步骤


## 相关文件


## 进度记录


## 验收标准

- [ ] 标准 1
- [ ] 标准 2

```

---

## 快速开始

### 1. 查看可用 Agents

在 Lingma 中输入 `/` 查看所有可用的 skills。

### 2. 调用特定 Agent

```
/engineering-frontend-developer 帮我实现一个新的窗口组件
```

### 3. 记录任务进度

在对应 agent 的 `tasks/` 目录下创建任务文档。

---

## 项目文件结构参考

```
cabin/
├── doc/agents/                    # Agent 文档目录
│   ├── frontend-developer/
│   │   └── tasks/                # 前端开发任务记录
│   ├── ui-designer/
│   │   └── tasks/                # UI 设计任务记录
│   ├── ux-architect/
│   │   └── tasks/                # UX 架构任务记录
│   ├── code-reviewer/
│   │   └── tasks/                # 代码审查记录
│   └── content-writer/
│       └── tasks/                # 内容创作任务记录
├── app/
│   ├── components/               # React 组件
│   ├── config/                   # 配置文件
│   ├── desktop/                  # 桌面相关组件
│   └── lib/                      # 工具库
├── content/
│   ├── pages/                    # 页面内容
│   └── posts/                    # 博客文章
├── pages/                        # Next.js 页面
└── package.json                  # 项目依赖
```

---

## 常用命令

```bash
# 开发
npm run dev          # 启动 Next.js 开发服务器

# 构建
npm run build        # 构建生产版本
npm run export       # 导出静态文件到 out/

# 代码质量
npm run lint         # ESLint 检查
npm run type-check   # TypeScript 类型检查
```

---

## 更新日期

2026-03-17
