# Code Reviewer Agent - 使用说明

## 角色定位

专业代码审查员，负责确保代码质量、类型安全、遵循最佳实践和项目规范。

---

## 核心技能

### 1. TypeScript 类型审查专家
- ✅ 接口与类型定义检查
- ✅ 泛型正确使用
- ✅ 类型推断优化
- ✅ any 类型滥用检测

### 2. React 最佳实践
- ✅ Hooks 使用规范
- ✅ 组件性能优化（memo、useMemo、useCallback）
- ✅ 副作用管理（useEffect 清理）
- ✅ 组件组合模式

### 3. Next.js 规范检查
- ✅ 页面路由约定
- ✅ 静态导出配置
- ✅ 图片优化（next/image）
- ✅ SEO 元数据设置

### 4. 代码质量工具
- ✅ ESLint 规则解读
- ✅ TSC 类型错误分析
- ✅ 代码重复检测
- ✅ 复杂度评估

### 5. 安全问题检测
- ✅ XSS 风险识别
- ✅ 敏感信息泄露
- ✅ 依赖漏洞扫描
- ✅ 输入验证检查

---

## 调用示例

### 场景 1: PR 代码审查

```
/engineering-code-reviewer
请审查这个 PR 的代码变更：
[粘贴 diff 或文件路径]

重点关注:
- TypeScript 类型安全
- React Hooks 正确使用
- 潜在的性能问题
```

### 场景 2: 类型错误修复

```
/engineering-code-reviewer
以下 TypeScript 错误如何修复？

error TS2322: Type 'string | undefined' is not assignable to type 'string'.
```

### 场景 3: 性能问题分析

```
/engineering-code-reviewer
分析这段代码的性能问题：
[粘贴代码]

特别关注:
- 不必要的重渲染
- 内存泄漏风险
- 大列表渲染优化
```

### 场景 4: 代码规范检查

```
/engineering-code-reviewer
运行 npm run lint 并解释所有警告和错误的含义，
提供具体的修复方案。
```

---

## 审查清单

### TypeScript 类型检查

```markdown
## 必查项目

- [ ] 没有使用 `any` 类型（除非绝对必要）
- [ ] Props 有明确的 interface 定义
- [ ] 函数返回值类型明确
- [ ] 联合类型使用恰当
- [ ] 类型导入正确（import type）
- [ ] 泛型约束合理

## 常见错误

❌ const data: any = getData();
✅ const data: DataType = getData();

❌ function process(obj: object) {}
✅ function process(obj: Record<string, unknown>) {}
```

### React Hooks 审查

```markdown
## useEffect 检查

- [ ] 依赖数组完整
- [ ] 清理函数正确实现
- [ ] 避免无限循环

❌ useEffect(() => {
  fetchData().then(setData);
}); // 缺少依赖数组

✅ useEffect(() => {
  fetchData().then(setData);
}, [userId]); // 明确的依赖

## useMemo/useCallback 检查

- [ ] 计算密集型操作使用 useMemo
- [ ] 传递给子组件的函数使用 useCallback
- [ ] 依赖数组正确

❌ const filtered = items.filter(item => item.active);

✅ const filtered = useMemo(
  () => items.filter(item => item.active),
  [items]
);
```

### 组件性能审查

```markdown
## 重渲染优化

- [ ] 大型组件使用 React.memo
- [ ] Props 传递原始值而非对象
- [ ] 列表项使用稳定 key

❌ <ListItem data={{ name: item.name }} />
✅ <ListItem name={item.name} />

❌ items.map(item => <ListItem key={Math.random()} />)
✅ items.map(item => <ListItem key={item.id} />)
```

---

## 审查报告模板

```markdown
# 代码审查报告

**审查日期**: 2026-03-17
**审查文件**: [文件路径]

## 严重问题 (必须修复)

### 1. [问题标题]
**位置**: [文件：行号]
**描述**: [问题说明]
**建议修复**: 
\`\`\`typescript
// 修复前
const data: any = getData();

// 修复后
interface DataType { /* ... */ }
const data: DataType = getData();
\`\`\`

## 警告 (建议修复)

### 1. [问题标题]
**影响**: [性能/可维护性]
**建议**: [改进方案]

## 代码亮点

- [值得表扬的代码片段]

## 总体评价

**代码质量**: ⭐⭐⭐⭐☆ (4/5)
**类型安全**: ⭐⭐⭐☆☆ (3/5)
**性能表现**: ⭐⭐⭐⭐⭐ (5/5)
```

---

## 自动化检查命令

```bash
# 类型检查
npm run type-check

# ESLint 检查
npm run lint

# 构建验证
npm run build

# 格式化检查
npx prettier --check "app/**/*.tsx"
```

---

## 常见问题速查

### 问题 1: React Hook 调用条件错误

```typescript
// ❌ 错误：条件调用 Hook
if (condition) {
  useEffect(() => {});
}

// ✅ 正确：顶层调用
useEffect(() => {
  if (condition) {
    // 逻辑在内部处理
  }
}, [condition]);
```

### 问题 2: useState 初始类型推断

```typescript
// ❌ 错误：类型推断为 never[]
const [items, setItems] = useState([]);

// ✅ 正确：明确类型
const [items, setItems] = useState<Item[]>([]);
```

### 问题 3: Props 展开导致过度重渲染

```typescript
// ❌ 错误：每次渲染都创建新对象
<Component {...{ prop1, prop2, prop3 }} />

// ✅ 正确：直接传递
<Component prop1={prop1} prop2={prop2} prop3={prop3} />
```

---

## 任务记录模板

在 `tasks/` 目录下创建文件：`tasks/[审查任务].md`

```markdown
# [审查任务名称]

**创建日期**: 2026-03-17
**审查人**: Code Reviewer Agent
**状态**: 🟡 进行中 / 🟢 已完成

## 审查范围

- 文件列表
- PR 链接

## 发现的问题

### 严重问题


### 警告


### 建议


## 修复进度

- [ ] 问题 1
- [ ] 问题 2

## 复查结果

```

---

## 验收标准

Code Reviewer 的审查应满足：

- ✅ 所有 TypeScript 错误已识别并给出修复方案
- ✅ ESLint 警告已解释和处理
- ✅ 性能问题已标记并提供优化建议
- ✅ 安全隐患已明确指出
- ✅ 审查报告清晰、可操作

---

## 相关资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [React Hooks 最佳实践](https://react.dev/reference/react)
- [ESLint 规则文档](https://eslint.org/docs/rules/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
