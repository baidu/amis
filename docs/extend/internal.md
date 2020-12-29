---
title: 工作原理
---

实现自定义类型需要了解 amis 的工作原理。

## 工作原理

amis 的渲染过程是将 `json` 转成对应的 React 组件。先通过 `json` 的 type 找到对应的 `Component` 然后，然后把其他属性作为 `props` 传递过去完成渲染。

拿一个表单页面来说，如果用 React 组件开发一般长这样。

```jsx
<Page title="页面标题" subTitle="副标题">
  <Form
    title="用户登录"
    controls={[
      {
        type: 'text',
        name: 'username',
        label: '用户名'
      }
    ]}
  />
</Page>
```

把以上配置方式换成 amis JSON, 则是：

```json
{
  "type": "page",
  "title": "页面标题",
  "subTitle": "副标题",
  "body": {
    "type": "form",
    "title": "用户登录",
    "controls": [
      {
        "type": "text",
        "name": "username",
        "label": "用户名"
      }
    ]
  }
}
```

那么，amis 是如何将 JSON 转成组件的呢？直接根据节点的 type 去跟组件一一对应？这样会重名，比如在表格里面展示的类型 `text` 跟表单里面的 `text` 是完全不一样的，一个负责展示，一个却负责输入。所以说一个节点要被什么组件渲染，还需要携带上下文（context）信息。

如何携带上下文（context）信息？amis 中是用节点的路径（path）来作为上下文信息。从上面的例子来看，一共有三个节点，path 信息分别是。

- `page` 页面节点
- `page/body/form` 表单节点
- `page/body/form/controls/0/text` 文本框节点。

根据 path 的信息就能很容易注册组件跟节点对应了。

Page 组件的示例代码

```jsx
import * as React from 'react';
import {Renderer} from 'amis';

@Renderer({
  test: /^page$/
  // ... 其他信息隐藏了
})
export class PageRenderer extends React.Component {
  // ... 其他信息隐藏了
  render() {
    const {
      title,
      body,
      render // 用来渲染孩子节点，如果当前是叶子节点则可以忽略。
    } = this.props;
    return (
      <div className="page">
        <h1>{title}</h1>
        <div className="body-container">
          {render('body', body) /*渲染孩子节点*/}
        </div>
      </div>
    );
  }
}

// 如果不支持 Decorators 语法也可以使用如下写法
export Renderer({
  test: /^page$/
})(class PageRenderer extends React.Component {
  render() {
    // ...同上
  }
})
```

Form 组件的示例代码

```jsx
@Renderer({
  test: /(^|\/)form$/
  // ... 其他信息隐藏了
})
export class FormRenderer extends React.Component {
  // ... 其他信息隐藏了
  render() {
    const {
      title,
      controls,
      render // 用来渲染孩子节点，如果当前是叶子节点则可以忽略。
    } = this.props;
    return (
      <form className="form">
        {controls.map((control, index) => (
          <div className="form-item" key={index}>
            {render(`${index}/control`, control)}
          </div>
        ))}
      </form>
    );
  }
}
```

Text 组件的示例代码

```jsx
@Renderer({
    test: /(^|\/)form(?:\/\d+)?\/control(?\/\d+)?\/text$/
    // ... 其他信息隐藏了
})
export class FormItemTextRenderer extends React.Component {
    // ... 其他信息隐藏了
    render() {
        const {
            label,
            name,
            onChange
        } = this.props;
        return (
            <div className="form-group">
                <label>{label}<label>
                <input type="text" onChange={(e) => onChange(e.currentTarget.value)} />
            </div>
        );
    }
}
```

那么渲染过程就是根据节点 path 信息，跟组件池中的组件 `test` (检测) 信息做匹配，如果命中，则把当前节点转给对应组件渲染，节点中其他属性将作为目标组件的 props。需要注意的是，如果是容器组件，比如以上例子中的 `page` 组件，从 props 中拿到的 `body` 是一个子节点，由于节点类型是不固定，由使用者决定，所以不能直接完成渲染，所以交给属性中下发的 `render` 方法去完成渲染，`{render('body', body)}`，他的工作就是拿子节点的 path 信息去组件池里面找到对应的渲染器，然后交给对应组件去完成渲染。
