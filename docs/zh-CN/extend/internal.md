---
title: 工作原理
---

实现自定义类型需要了解 amis 的工作原理。

## 工作原理

amis 的渲染过程是将 `json` 转成对应的 React 组件。先通过 `json` 的 type 找到对应的 `Component`，然后把其他属性作为 `props` 传递过去完成渲染。

拿一个表单页面来说，如果用 React 组件开发一般长这样。

```jsx
<Page title="页面标题" subTitle="副标题">
  <Form title="用户登录">
    <InputText name="username" label="用户名" />
  </Form>
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
    "body": [
      {
        "type": "input-text",
        "name": "username",
        "label": "用户名"
      }
    ]
  }
}
```

其实只需要把 json 节点，根据 type 信息自动转成 React Component 即可。

> 原来组件注册是根据节点 path 注册，可以类型相同在不同的上下文中用不同的渲染器去渲染，后来发现这样反而增加了使用成本
> 所以新版本直接通过 type 类型来注册组件，跟节点所在上下文无关。

Page 组件的示例代码

```jsx
import * as React from 'react';
import {Renderer} from 'amis';

@Renderer({
  type: 'page'
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
  type: 'page'
})(class PageRenderer extends React.Component {
  render() {
    // ...同上
  }
})
```

Form 组件的示例代码

```jsx
@Renderer({
  type: 'form'
  // ... 其他信息隐藏了
})
export class FormRenderer extends React.Component {
  // ... 其他信息隐藏了
  render() {
    const {
      title,
      body,
      render // 用来渲染孩子节点，如果当前是叶子节点则可以忽略。
    } = this.props;
    return (
      <form className="form">
        {body.map((control, index) => (
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
    type: 'input-text'
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

那么渲染过程就是根据节点 type 信息，跟组件池中的找到对应的组件实现，如果命中，则把当前节点转给对应组件渲染，节点中其他属性将作为目标组件的 props。需要注意的是，如果是容器组件，比如以上例子中的 `page` 组件，从 props 中拿到的 `body` 是一个子节点，由于节点类型是不固定，由使用者决定，所以不能直接完成渲染，所以交给属性中下发的 `render` 方法去完成渲染，`{render('body', body)}`，他的工作就是拿子节点的 type 信息去组件池里面找到对应的渲染器，然后交给对应组件去完成渲染。
