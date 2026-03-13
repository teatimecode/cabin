# 技术笔记

## React 学习笔记

### 组件生命周期

React 组件有多个生命周期方法：
- constructor - 构造函数
- componentDidMount - 组件挂载后
- componentDidUpdate - 组件更新后
- componentWillUnmount - 组件卸载前

### 状态管理

推荐使用 useState 和 useReducer 来管理组件状态。

## Next.js 配置

Next.js 支持静态导出：

```javascript
// next.config.js
module.exports = {
  output: 'export',
  trailingSlash: true,
}
```
