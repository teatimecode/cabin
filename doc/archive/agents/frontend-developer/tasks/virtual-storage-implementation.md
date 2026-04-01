# 虚拟文件系统实现文档

**Agent**: Frontend Developer  
**创建日期**: 2026-03-17  
**状态**: ✅ 核心功能已完成  

---

## 实现摘要

已完成虚拟存储系统的核心功能实现，包括：

### ✅ 已完成的功能

1. **核心类** (`app/lib/vfs/`)
   - `VirtualFileSystem.ts` - 虚拟文件系统核心类
   - `FSLoader.ts` - fs/ 目录数据加载器
   - `ExportManager.ts` - ZIP 导出管理器
   - `types.ts` - TypeScript 类型定义
   - `hooks.ts` - React Hooks
   - `index.ts` - 模块导出

2. **UI 组件** (`app/components/vfs/`)
   - `EjectConfirmationDialog.tsx` - 弹出确认对话框
   - `VirtualStorageToolbar.tsx` - 工具栏组件
   - `VirtualStorageExample.tsx` - 使用示例

3. **依赖安装**
   - ✅ jszip (ZIP 生成)
   - ✅ @types/jszip (类型定义)

---

## 文件结构

```
app/
├── lib/
│   └── vfs/
│       ├── types.ts              # 类型定义
│       ├── VirtualFileSystem.ts  # 核心 VFS 类
│       ├── FSLoader.ts           # 数据加载器
│       ├── ExportManager.ts      # ZIP 导出管理
│       ├── hooks.ts              # React Hooks
│       ├── global.d.ts           # 浏览器 API 类型
│       └── index.ts              # 模块导出
└── components/
    └── vfs/
        ├── EjectConfirmationDialog.tsx  # 弹出确认对话框
        ├── VirtualStorageToolbar.tsx    # 工具栏组件
        └── VirtualStorageExample.tsx    # 使用示例
```

---

## 核心 API

### 1. VirtualFileSystem 类

```typescript
import { VirtualFileSystem } from '@/lib/vfs';

const vfs = new VirtualFileSystem();

// 初始化
vfs.initializeFromData(initialFSData);

// 导航
vfs.navigateTo('/my-blog');
vfs.navigateUp();
vfs.goBack();
vfs.goForward();

// 文件操作
const content = vfs.readFile('/my-blog/hello-world.txt');
vfs.writeFile('/my-blog/hello-world.txt', '新内容');
vfs.createFile('/my-blog/new.txt', '内容');
vfs.deleteFile('/my-blog/old.txt');

// 变更追踪
const changes = vfs.getAllChanges();
vfs.clearChanges();
```

### 2. React Hooks

```typescript
import { useVirtualStorage } from '@/lib/vfs/hooks';

function MyComponent() {
  const {
    // 状态
    currentPath,
    nodes,
    canGoBack,
    canGoForward,
    
    // 导航
    navigateTo,
    navigateUp,
    goForward,
    goBack,
    
    // 文件操作
    readFile,
    writeFile,
    createFile,
    deleteFile,
    
    // 可移动磁盘
    drives,
    mountDrive,
    ejectDrive,
    
    // 变更管理
    changes,
    changeStats,
    
    // 导出
    exportToZip,
    getChangeList,
  } = useVirtualStorage();
  
  return <div>...</div>;
}
```

---

## 使用示例

### 示例 1: 基础文件浏览

```tsx
import { useVirtualStorage } from '@/lib/vfs';

const FileBrowser = () => {
  const { currentPath, nodes, navigateTo } = useVirtualStorage();
  
  return (
    <div>
      <div>当前路径：{currentPath}</div>
      {nodes.map(node => (
        <div
          key={node.id}
          onDoubleClick={() => node.type === 'folder' && navigateTo(node.path)}
        >
          {node.type === 'folder' ? '📁' : '📄'} {node.name}
        </div>
      ))}
    </div>
  );
};
```

### 示例 2: 文件编辑器

```tsx
import { useVirtualStorage } from '@/lib/vfs';

const FileEditor = ({ filePath }: { filePath: string }) => {
  const { readFile, writeFile } = useVirtualStorage();
  const [content, setContent] = useState('');
  
  useEffect(() => {
    const fileContent = readFile(filePath);
    if (fileContent) setContent(fileContent);
  }, [filePath]);
  
  const handleSave = () => {
    writeFile(filePath, content);
    // 文件被标记为修改，但未保存到磁盘
  };
  
  return (
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  );
};
```

### 示例 3: 挂载可移动磁盘

```tsx
import { useVirtualStorage } from '@/lib/vfs';

const DriveManager = () => {
  const { drives, mountDrive, ejectDrive } = useVirtualStorage();
  
  const handleMount = async () => {
    const driveId = await mountDrive('removable');
    console.log('挂载成功:', driveId);
  };
  
  const handleEject = async (driveId: string) => {
    const result = await ejectDrive(driveId);
    if (result.hasChanges) {
      // 显示确认对话框
    }
  };
  
  return (
    <div>
      <button onClick={handleMount}>💾 插入磁盘</button>
      {drives.map(drive => (
        <div key={drive.id}>
          {drive.name}
          <button onClick={() => handleEject(drive.id)}>⏏️</button>
        </div>
      ))}
    </div>
  );
};
```

### 示例 4: 导出变更

```tsx
import { useVirtualStorage } from '@/lib/vfs';

const ExportButton = () => {
  const { changeStats, exportToZip } = useVirtualStorage();
  
  const handleExport = async () => {
    const success = await exportToZip('my-export.zip');
    if (success) {
      alert('导出成功！');
    }
  };
  
  return (
    <button onClick={handleExport} disabled={changeStats.total === 0}>
      📦 导出变更 ({changeStats.total})
    </button>
  );
};
```

---

## 集成到现有组件

### 步骤 1: 在文件浏览器中添加工具栏

```tsx
// app/components/window/FileExplorer.tsx
import { VirtualStorageToolbar } from '@/components/vfs/VirtualStorageToolbar';

const FileExplorer = () => {
  return (
    <div>
      {/* 添加虚拟存储工具栏 */}
      <VirtualStorageToolbar
        onMountSuccess={(driveId) => console.log('挂载成功:', driveId)}
        onEjectComplete={() => console.log('弹出完成')}
      />
      
      {/* 原有的文件浏览器内容 */}
      {/* ... */}
    </div>
  );
};
```

### 步骤 2: 在记事本中支持保存

```tsx
// app/components/app/TextEditor.tsx
import { useVirtualStorage } from '@/lib/vfs';

const TextEditor = ({ filePath, initialContent }) => {
  const { writeFile, vfs } = useVirtualStorage();
  const [content, setContent] = useState(initialContent);
  
  const handleSave = () => {
    // 写入虚拟文件系统（标记为修改）
    writeFile(filePath, content);
    
    // 获取变更记录
    const changes = vfs.getAllChanges();
    console.log('未保存的变更:', changes.length);
  };
  
  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSave}>保存</button>
    </div>
  );
};
```

---

## 工作流程

### 1. 页面加载流程

```
1. 应用启动
   ↓
2. VirtualFileSystem 初始化
   ↓
3. FSLoader 加载 fs/ 目录数据
   ↓
4. 构建虚拟节点树
   ↓
5. 显示桌面和文件夹
```

### 2. 文件编辑流程

```
1. 用户双击打开文件
   ↓
2. 读取文件内容到内存
   ↓
3. 用户在编辑器中修改
   ↓
4. 调用 writeFile() 保存
   ↓
5. VFS 记录变更（不写入磁盘）
   ↓
6. 文件标记为 isModified: true
```

### 3. 弹出磁盘流程

```
1. 用户右键点击"弹出"
   ↓
2. VFS 检查该驱动器的变更
   ↓
3. 显示确认对话框（有变更时）
   ↓
4a. 选择"保存" → 导出 ZIP → 下载 → 弹出
4b. 选择"不保存" → 直接弹出
4c. 选择"取消" → 关闭对话框
```

---

## 技术细节

### 1. 变更追踪机制

```typescript
interface ChangeRecord {
  fileId: string;
  fileName: string;
  action: 'create' | 'update' | 'delete' | 'rename';
  originalContent?: string;  // 原始内容
  newContent?: string;       // 新内容
  timestamp: number;
}

// 所有变更存储在 Map 中
changes: Map<string, ChangeRecord>;
```

### 2. 文件 ID 生成

```typescript
// 使用路径的哈希作为 ID（简化实现）
generateId(path: string): string {
  return path.replace(/\//g, '-').replace(/^-/, '') || 'root';
}
```

### 3. 可移动磁盘挂载

```typescript
// 使用 File System Access API
async mountRemovableDrive(
  type: DriveType,
  directoryHandle: FileSystemDirectoryHandle
): Promise<string> {
  // 递归扫描目录
  const rootId = await this.scanDirectory(directoryHandle, `/${driveId}`, driveId);
  
  // 创建驱动器信息
  const driveInfo: DriveInfo = { /* ... */ };
  
  return driveId;
}
```

### 4. ZIP 导出

```typescript
// 使用 JSZip 打包
async exportToZip(): Promise<Blob> {
  const zip = new JSZip();
  const changes = this.vfs.getAllChanges();
  
  for (const change of changes) {
    if (change.action !== 'delete') {
      const node = this.vfs.getNodeById(change.fileId);
      if (node?.type === 'file') {
        zip.file(node.path.substring(1), node.content);
      }
    }
  }
  
  return await zip.generateAsync({ /* 配置 */ });
}
```

---

## 浏览器兼容性

| 功能 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| 虚拟文件系统 | ✅ | ✅ | ✅ | ✅ |
| 可移动磁盘 | ✅ 86+ | ❌ | ❌ | ✅ 86+ |
| ZIP 导出 | ✅ | ✅ | ✅ | ✅ |

**注意**: File System Access API 仅在 Chromium 系浏览器可用。Firefox/Safari 需要提供降级方案（如文件输入）。

---

## 待完成功能

### Phase 3 (可选优化)

- [ ] 拖拽上传文件到虚拟文件系统
- [ ] 批量操作（多选、批量删除）
- [ ] 撤销/重做功能
- [ ] 文件搜索功能
- [ ] 文件夹压缩/解压
- [ ] 文件历史版本
- [ ] 云存储同步

---

## 测试建议

### 单元测试

```typescript
// __tests__/VirtualFileSystem.test.ts
import { VirtualFileSystem } from '../app/lib/vfs';

describe('VirtualFileSystem', () => {
  it('should initialize from data', () => {
    const vfs = new VirtualFileSystem();
    vfs.initializeFromData(testData);
    expect(vfs.getCurrentPath()).toBe('/');
  });
  
  it('should track changes when writing file', () => {
    const vfs = new VirtualFileSystem();
    vfs.writeFile('/test.txt', 'content');
    const changes = vfs.getAllChanges();
    expect(changes.length).toBe(1);
  });
});
```

### 集成测试

1. 测试完整的挂载 → 编辑 → 弹出流程
2. 测试 ZIP 导出包含正确的文件
3. 测试导航历史记录
4. 测试大文件处理性能

---

## 性能优化建议

1. **懒加载**: 大型目录延迟加载子项
2. **缓存**: 缓存已读取的文件内容
3. **防抖**: 文件保存操作添加防抖
4. **Web Workers**: 在 Worker 中处理 ZIP 打包
5. **IndexedDB**: 使用 IndexedDB 持久化虚拟文件系统

---

## 相关文档

- [UX 设计方案](./doc/agents/ux-architect/tasks/virtual-storage-design.md)
- [JSZip 文档](https://stuk.github.io/jszip/)
- [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)

---

## 下一步

1. ✅ 核心功能实现完成
2. ⏳ 集成到现有文件浏览器组件
3. ⏳ 添加单元测试
4. ⏳ 用户测试和优化
5. ⏳ 完善错误处理和边界情况

---

**更新时间**: 2026-03-17  
**负责人**: Frontend Developer Agent
