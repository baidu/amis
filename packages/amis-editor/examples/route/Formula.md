# 公式相关

公式输入相关组件规范说明。

## 显隐表达式

比如：`visibleOn`, `disabledOn` 因为存在两种表达式的写法，所以这里需要明确区分。

- 没有初始值时出现「点击编写表达式」按钮，点击会弹出一个表达式编辑器。
- 初始值存在时，且为 js 表达式（即不是 `${` 和 `}`包裹的）时，直接用文本输入框展示与输入。
- 初始值存在时，且为 `${` 和 `}`包裹的公式表达式时，用公式编辑器展示，同时点击后，会弹出一个表达式编辑器，能直接回显当前公式
- 公式弹窗内部始终是公式语法，不存在模版拼接语法。
- 当 js 表达式被删除后，只能用新版公式编辑器了。

```schema
getSchemaTpl('expressionFormulaControl', {
  label: '无默认值',
  name: 'var1'
}),

getSchemaTpl('expressionFormulaControl', {
  label: '默认值为旧语法',
  name: 'var2',
  value: 'data.a == 1'
}),

getSchemaTpl('expressionFormulaControl', {
  label: '默认值为新语法',
  name: 'var3',
  value: '\\${a == 1 ? "1" : a == 2 ? "二" : a == 3 ? "三" : "一个很长的表达式"}'
})
```

## 文本输入框默认值

默认展示为文本输入框，通过点击 `+fx` 来添加公式片段，公式部分高亮展示，是整体高亮，而不是表达式内部 token 高亮（变量名、操作符、字面量等会用不同的方式高亮）。整体高亮内部不细化高亮，展示 tooltip 时再细化高亮，并且点击后开始编辑点击部分公式，注意这里是编辑局部公式，而不是整个默认值输入框。

值格式中如果没有出现 `${` 和 `}` 包裹的公式，则认为是普通文本，如果存在，则会做公式处理。当时用户直接通过文本输入框输入公式时，会当成时输入普通文本，如果用户输入了 `$` 符号，要将其转成 `\\$`，这样就不会被误认为是公式了。要添加公式片段，用户必须通过点击 `+fx` 按钮添加。`+fx` 可以添加多个片段。

```schema
getSchemaTpl('tplFormulaControl', {
  name: 'value',
  label: '默认值'
}),

getSchemaTpl('tplFormulaControl', {
  name: 'value2',
  label: '默认值',
  value: 'My name is \\${name}'
})
```

## 多行文本输入框默认值

```schema
getSchemaTpl('textareaDefaultValue', {
  name: 'var1',
  value: 'My name is \\${name}'
})
```

## 数字输入框默认值

默认展示为数字输入框，通过点击 `fx` 输入公式，因为不是文本，无法拼接，所以默认值要么是公式，要么是静态值。

```schema
getSchemaTpl('valueFormula', {
  mode: 'vertical',
  rendererSchema: (schema) => ({
    type: 'input-number',
    ...schema,
    displayMode: 'base'
  }),
  valueType: 'number' // 期望数值类型
})
```

## 日期输入框默认值

```schema
getSchemaTpl('valueFormula', {
  mode: 'vertical',
  rendererSchema: (schema) => ({
    type: 'input-date',
    ...schema
  }),
  placeholder: '请选择静态值',
  header: '表达式或相对值',
  DateTimeType: 1,
  label: tipedLabel('默认值', '支持例如: <code>now、+3days、-2weeks、+1hour、+2years</code> 等（minute|min|hour|day|week|month|year|weekday|second|millisecond）这种相对值用法')
})
```

## 选项类输入框默认值

```schema
getSchemaTpl('valueFormula', {
  rendererSchema: (schema) => ({
    ...schema,
    type: 'select',
    options: [
      {
        label: '选项1',
        value: '1'
      },
      {
        label: '选项2',
        value: '2'
      }
    ]
  }),
  // 默认值组件设计有些问题，自动发起了请求，接口数据作为了默认值选项，接口形式应该是设置静态值或者FX
  needDeleteProps: ['source'],
  // 当数据源是自定义静态选项时，不额外配置默认值，在选项上直接勾选即可，放开会有个bug：当去掉勾选时，默认值配置组件不清空，只是schema清空了value
  visibleOn: 'this.selectFirst !== true && this.source != null'
})
```
