# babel-plugin-rn-merge-style

当 `style字段值` 为 非对象表达式时， 则会对`style字段值`加上一层 `_mergeStyle` 来进行样式合并 （非 对象表达式 零信任）

```javascript
function _mergeStyle(styleArr) {
  return [].concat(styleArr).reduce((result, style) => {
    return Object.assign(result, style);
  }, {});
}
```

例：

```tsx
// 对象表达式 - 1
<View style={{ width: 100 }} />
// =>
<View style={{ width: 100 }} />

// 对象表达式 - 2
<View style={{ ...containerStyle }} />
// =>
<View style={{ ...containerStyle }} />

// 数组表达式
<View style={[{ width: 100 }]} />
// =>
<View style={_mergeStyle([{ width: 100 }])} />

// 标识符
<View style={containerStyle} />
// =>
<View style={_mergeStyle(containerStyle)} />


// 函数调用
<View style={getStyle()} />
// =>
<View style={_mergeStyle(getStyle())} />

// 条件表达式
<View style={isActive ? activeStyle : normalStyle} />
// =>
<View style={_mergeStyle(isActive ? activeStyle : normalStyle)} />


// 逻辑表达式
<View style={activeStyle || normalStyle} />
// =>
<View style={_mergeStyle(activeStyle || normalStyle)} />


// 成员表达式
<View style={style.container} />
// =>
<View style={_mergeStyle(style.container)} />


```

## 配置

```javascript

{
  "enableMultipleStyle": boolean
}
```

当为 `true` 时， 会启动 `多style 模式`， 会将 所以的 以 `style` 结尾的属性进行值的表达式判断，然后决定是否包裹 `_mergeStyle`

如：

```tsx

// 成员表达式 - enableMultipleStyle：false
<View style={style.container} headerStyle={style.header} />
// =>
<View style={_mergeStyle(style.container)} headerStyle={style.header}  />

// 成员表达式 - enableMultipleStyle：true
<View style={style.container} headerStyle={style.header} />
// =>
<View style={_mergeStyle(style.container)} headerStyle={_mergeStyle(style.header)}  />

// 其他的以此类推 ...

```

```shell

# 安装依赖
yarn
# 构建
yarn build
# 执行测试
yarn test
# 自动修复 ESLint 错误
yarn eslint:fix
# 自动修复格式错误
yarn prettier:fix
# 发布新版本
npm version <major|minor|patch>
git push --follow-tags
npm publish

```
