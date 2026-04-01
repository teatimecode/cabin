# TypeScript 迁移规范文档

## 问题总结

在 TypeScript 迁移过程中出现的问题主要集中在以下几个方面：

### 1. 重复文件问题 ❌

**问题描述**：
- 旧的 `.js`/`.jsx` 文件没有被删除，与新的 `.tsx` 文件共存
- 导致编译时可能使用错误的文件版本

**发现的重复文件**：
- `app/components/app/AppIcon.js` + `AppIcon.tsx`
- `app/config/apps/index.js` + `index.ts`

**规范要求**：
```bash
# 迁移步骤
1. 创建 .tsx 文件并迁移代码
2. 验证新文件编译通过
3. 立即删除旧的 .js/.jsx 文件
4. 运行 git status 确认没有遗漏
```

### 2. 类型定义不完整 ❌

**问题描述**：
- 接口定义中的参数在实际使用中未使用
- Props 类型定义与实际组件不匹配
- 缺少必要的类型导出

**规范要求**：
```typescript
// ✅ 正确：接口参数即使未使用也要明确标注
interface ComponentProps {
  onOpen?: (app: AppConfig) => void;
  onSelect?: (app: AppConfig, isMultiSelect: boolean) => void;
}

// ✅ 正确：如果确实不需要使用，用下划线前缀
interface CallbackProps {
  onChange?: (_value: string) => void;
}

// ✅ 正确：类型需要导出供其他模块使用
export type { WindowState, WindowProps };
```

### 3. styled-components transient props 使用错误 ❌

**问题描述**：
- 使用了 `$` 前缀的 transient props 但仍然被传递到 DOM
- react95 组件不支持某些 props

**规范要求**：
```typescript
// ✅ 正确：使用标准 prop 名称
const StyledButton = styled(Button)<{ active?: boolean }>`
  // 样式定义
`;

// ❌ 错误：transient prop 可能被传递到 DOM
const StyledButton = styled(Button)<{ $active?: boolean }>`
  // 样式定义
`;

// ✅ 正确：移除不支持的 props
<ClockArea />  // 而不是 <ClockArea shadow={false}>
```

### 4. 组件方法缺失 ❌

**问题描述**：
- WindowManager 缺少 `restoreWindow` 方法
- 类型定义中存在但实现缺失

**规范要求**：
```typescript
// 当 API 接口定义了某个方法时，实现类必须提供该方法
export interface WindowManagerAPI {
  restoreWindow: (id: string) => void;
}

// 必须在 WindowManager 中实现
restoreWindow = (id: string) => {
  this.focusWindow(id);
};
```

### 5. 图标系统迁移不彻底 ❌

**问题描述**：
- 部分图标还在使用 emoji 或文本
- 图标变体（variant）类型不匹配
- 图标名称拼写错误

**规范要求**：
```typescript
// ✅ 正确：使用真实的 @react95/icons 组件
import { Close, Folder, Computer } from '@react95/icons';

// ✅ 正确：注意不同图标支持的 variant
const iconRenderers = {
  'close': () => <Close variant="16x16_4" />,  // 只支持 16x16_4
  'folder': () => <Folder {...{ variant }} />,  // 支持两种 variant
};

// ❌ 错误：图标名称不正确
getIcon('icon', ...)  // 'icon' 不是有效的 IconName
```

### 6. 运行时错误处理不足 ❌

**问题描述**：
- 缺少运行时调试日志
- 错误边界不完善
- 状态初始化不完整

**规范要求**：
```typescript
// ✅ 正确：添加调试日志和默认值
componentDidMount() {
  const items = this.generateItems();
  console.log('Generated items:', items); // 调试日志
  this.setState({ items });
}

// ✅ 正确：提供默认值
iconName: childItem.icon || this.getDefaultIcon(childItem.type),
```

## 迁移检查清单

### 文件清理
- [ ] 删除所有旧的 `.js`/`.jsx` 文件
- [ ] 确认 `git status` 没有遗留文件
- [ ] 检查是否有重复定义的模块

### 类型定义
- [ ] 所有接口参数都有实际用途或明确标注为未使用
- [ ] 导出的类型完整且正确
- [ ] Props 类型与实际组件匹配

### 组件实现
- [ ] 所有接口方法都已实现
- [ ] styled-components 不使用可能导致 DOM 警告的 transient props
- [ ] 组件有适当的错误处理和调试日志

### 图标系统
- [ ] 所有图标都使用 @react95/icons
- [ ] 图标 variant 类型正确
- [ ] 图标名称在 IconName 类型范围内

### 运行时验证
- [ ] 应用启动无控制台错误
- [ ] 关键功能有调试日志
- [ ] 状态初始化有默认值保护

## 代码审查要点

### 必须修复的问题（阻塞发布）
1. TypeScript 编译错误
2. 运行时 TypeError
3. 重复文件导致的模块冲突
4. 缺失的接口方法实现

### 应该修复的问题（尽快修复）
1. ESLint error 级别的警告
2. 未使用的导入和变量
3. 不完整的类型定义

### 可以延后修复的问题（技术债务）
1. ESLint warn 级别的警告（未使用变量等）
2. console.log 语句（开发阶段可接受）
3. 代码风格优化

## 最佳实践

### 1. 渐进式迁移
```
不要一次性迁移所有文件
→ 按功能模块逐个迁移
→ 每迁移一个模块就验证功能
→ 立即删除旧文件
```

### 2. 类型安全第一
```
宁可类型复杂一些，也要保证类型准确
→ 使用类型断言时要谨慎
→ 为动态数据提供运行时检查
→ 导出完整的类型定义
```

### 3. 保持向后兼容
```
迁移期间保持功能可用
→ 先实现基本功能
→ 再优化类型和代码质量
→ 确保每个提交点都是可运行的
```

### 4. 文档同步更新
```
代码变更要同步更新文档
→ 记录迁移过程中的问题
→ 更新组件 API 文档
→ 维护检查清单
```

## 工具推荐

### 自动化检查
```bash
# 类型检查
npm run build

# 代码质量检查
npm run lint

# 查找重复文件
find . -name "*.js" -o -name "*.jsx" | grep -v node_modules
```

### IDE 配置
- 启用 TypeScript 严格模式
- 配置 ESLint 自动修复
- 保存时自动格式化

## 总结

TypeScript 迁移不是一次性的任务，而是一个持续改进的过程。关键是：

1. **立即清理**：迁移后立即删除旧文件
2. **小步快跑**：逐个模块迁移，及时验证
3. **类型安全**：宁可类型复杂也要保证准确
4. **功能优先**：保证迁移过程中功能始终可用
5. **文档同步**：记录问题和解决方案

---

*最后更新：2026-03-18*
