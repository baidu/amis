---
title: 如何使用
---


## 如何使用

```bash
npm i amis
```

安装完后可以在 React Component 这么使用。

```tsx
import * as React from 'react';
import {
    render as renderAmis
} from 'amis';

class MyComponent extends React.Component<any, any> {
    render() {
        return (
            <div>
                <p>通过 amis 渲染页面</p>
                {renderAmis({
                    // schema
                    // 这里是 amis 的 Json 配置。
                    type: 'page',
                    title: '简单页面',
                    body: '内容'
                }, {
                    // props
                }, {
                    // env
                    // 这些是 amis 需要的一些接口实现
                    // 可以参考本项目里面的 Demo 部分代码。

                    updateLocation: (location:string/*目标地址*/, replace:boolean/*是replace，还是push？*/) => {
                        // 用来更新地址栏
                    },

                    jumpTo: (location:string/*目标地址*/) => {
                        // 页面跳转， actionType:  link、url 都会进来。
                    },

                    fetcher: ({
                        url,
                        method,
                        data,
                        config
                    }:{
                        url:string/*目标地址*/,
                        method:'get' | 'post' | 'put' | 'delete'/*发送方式*/,
                        data: object | void/*数据*/,
                        config: object/*其他配置*/
                    }) => {
                        // 用来发送 Ajax 请求，建议使用 axios
                    },
                    notify: (type:'error'|'success'/**/, msg:string/*提示内容*/) => {
                        // 用来提示用户
                    },
                    alert: (content:string/*提示信息*/) => {
                        // 另外一种提示，可以直接用系统框
                    },
                    confirm: (content:string/*提示信息*/) => {
                        // 确认框。
                    }
                });}
            </div>
        );
    }
}
```

## 工作原理

amis 的渲染过程就是将 `json` 转成对应的 React 组件。先通过 `json` 的 type 找到对应的 `Component` 然后，然后把其他属性作为 `props` 传递过去完成渲染。

拿一个表单页面来说，如果用React组件调用大概是这样。

```jsx
<Page
    title="页面标题"
    subTitle="副标题"
>
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

那么，amis 是如何将 JSON 转成组件的呢？直接根据节点的 type 去跟组件一一对应？似乎很可能会重名比如在表格里面展示的类型 `text` 跟表单里面的 `text`是完全不一样的，一个负责展示，一个却负责输入。所以说一个节点要被什么组件渲染，还需要携带上下文(context)信息。

如何去携带上下文（context）信息？amis 中直接是用节点的路径（path）来作为上下文信息。从上面的例子来看，一共有三个节点，path 信息分别是。

* `page` 页面节点
* `page/body/form` 表单节点
* `page/body/form/controls/0/text` 文本框节点。

根据 path 的信息就能很容易注册组件跟节点对应了。

Page 组件的示例代码

```jsx
@Renderer({
    test: /^page$/,
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
                    {render('body', body)/*渲染孩子节点*/}
                </div>
            </div>
        );
    }
}
```

Form 组件的示例代码

```jsx
@Renderer({
    test: /(^|\/)form$/,
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

## 自定义组件

如果 amis 中组件不能满足你的需求，同时你又会 React 组件开发，那么就自己定制一个吧。

先来看个简单的例子

```jsx
import * as React from 'react';
import {
    Renderer
} from 'amis';

@Renderer({
    test: /(^|\/)my\-renderer$/,
})
class CustomRenderer extends React.Component {
    render() {
        const  {tip} = this.props;
        return (
            <div>这是自定义组件：{tip}</div>
        );
    }
}
```

有了以上这段代码后，就可以这样使用了。

```json
{
    "type": "page",
    "title": "自定义组件示例",
    "body": {
        "type": "my-renderer",
        "tip": "简单示例"
    }
}
```

如果你看了[amis工作原理](#工作原理)应该不难理解，这里注册一个 React 组件，当节点的 path 信息是 `my-renderer` 结尾时，交给当前组件来完成渲染。
如果你只写叶子节点的渲染器，已经可以不用看了，如果你的渲染器中有容器需要可以放置其他节点，那么接着看以下这段代码。

```jsx
import * as React from 'react';
import {
    Renderer
} from 'amis';

@Renderer({
    test: /(^|\/)my\-renderer2$/,
})
class CustomRenderer extends React.Component {
    render() {
        const  {
            tip,
            body,
            render
        } = this.props;
        return (
            <div>
                <p>这是自定义组件：{tip}</p>
                {body ? (
                    <div className="container">
                        {render('body', body, {
                            // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个
                        })}
                    </div>
                ) : null}
            </div>
        );
    }
}
```

有了以上这段代码后，就可以这样使用了。

```json
{
    "type": "page",
    "title": "自定义组件示例",
    "body": {
        "type": "my-renderer2",
        "tip": "简单示例",
        "body": {
            "type": "form",
            "controls": [
                {
                    "type": "text",
                    "label": "用户名",
                    "name": "usename"
                }
            ]
        }
    }
}
```

跟第一个列子不同的地方是，这里多了个 `render` 方法，这个方法就是专门用来渲染子节点的。来看下参数说明：

* `region` 区域名称，你有可能有多个区域可以作为容器，请不要重复。
* `node` 子节点。
* `props` 可选，可以通过此对象跟子节点通信等。

以上是普通渲染器的注册方式，如果是表单项，为了更简单的扩充，请使用 `FormItem` 注解，而不是 `Renderer`。 原因是如果用 `FormItem` 是不用关心：label怎么摆，表单验证器怎么实现，如何适配表单的3中展现方式（水平、上下和内联模式），而只用关心：有了值后如何回显，响应用户交互设置新值。

```jsx
import * as React from 'react';
import {
    FormItem
} from 'amis';

@FormItem({
    type: 'custom'
})
class MyFormItem extends React.Component {
    render() {
        const {
            value,
            onChange
        } = this.props;

        return (
            <div>
                <p>这个是个自定义组件</p>
                <p>当前值：{value}</p>
                <a className="btn btn-default" onClick={() => onChange(Math.round(Math.random() * 10000))}>随机修改</a>
            </div>
        );
    }
}
```

有了以上这段代码后，就可以这样使用了。

```json
{
    "type": "page",
    "title": "自定义组件示例",
    "body": {
            "type": "form",
            "controls": [
                {
                    "type": "text",
                    "label": "用户名",
                    "name": "usename"
                },

                {
                    "type": "custom",
                    "label": "随机值",
                    "name": "randon"
                }
            ]
        }
}
```

> 注意: 使用 FormItem 默认是严格模式，即只有必要的属性变化才会重新渲染，有可能满足不了你的需求，如果忽略性能问题，可以传入 `strictMode`: `false` 来关闭。

以上的例子都是需要先注册组件，然后再使用的，如果你在自己项目中使用，还有更简单的用法，以下示例直接无需注册。

```jsx
{
    "type": "page",
    "title": "自定义组件示例",
    "body": {
            "type": "form",
            "controls": [
                {
                    "type": "text",
                    "label": "用户名",
                    "name": "usename"
                },

                {
                    "name": "a",
                    "children": ({
                        value,
                        onChange
                    }) => (
                        <div>
                            <p>这个是个自定义组件</p>
                            <p>当前值：{value}</p>
                            <a className="btn btn-default" onClick={() => onChange(Math.round(Math.random() * 10000))}>随机修改</a>
                        </div>
                    )
                }
            ]
        }
}
```

即：通过 `children` 传递一个React组件，这个示例是一个React Stateless Functional Component，也可以是传统的 React 组件。
任何节点如果包含 `children` 这个属性，则都会把当前节点交给 `children` 来处理，跳过了从 amis 渲染器池子中选择渲染器的过程。