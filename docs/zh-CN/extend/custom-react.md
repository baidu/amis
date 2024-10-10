---
title: 自定义组件 - React
---

## React 临时扩展

amis 的配置最终会转成 React 组件来执行，所以如果只是想在某个配置中加入定制功能，可以直接在这个 JSON 配置里写 React 代码，比如下面这个例子：

```jsx
{
  "type": "page",
  "title": "自定义组件示例",
  "body": {
    "type": "form",
    "body": [
      {
        "type": "input-text",
        "label": "用户名",
        "name": "usename"
      },
      {
        "name": "mycustom",
        "asFormItem": true,
        "children": ({
          value,
          onChange,
          data
        }) => (
          <div>
            <p>这个是个自定义组件</p>
            <p>当前值：{value}</p>
            <a className="btn btn-default" onClick={
              () => onChange(Math.round(Math.random() * 10000))
            }>随机修改</a>
          </div>
        )
      }
    ]
  }
}
```

其中的 `mycustom` 就是一个临时扩展，它的 `children` 属性是一个函数，它的返回内容和 React 的 Render 方法一样，即 jsx，在这个方法里你可以写任意 JavaScript 来实现自己的定制需求，这个函数有两个参数 `value` 和 `onChange`，`value` 就是组件的值，`onChange` 方法用来改变这个值，比如上面的例子中，点击链接后就会修改 `mycustom` 为一个随机数，在提交表单的时候就变成了这个随机数，而 `data` 可以拿到其它控件的值，比如 `data.username`。

> 注意与 "children" 并列有个 "asFormItem" 属性，这个属性表示这个节点的渲染会自动包裹成表单项，包裹成表单项就能配置
> "name"、"description"、"validation" 之类的跟表单项有关的配置了。包括其中的 value 和 onChange 自动会跟 name 关联等功能，跟下面 `@FormItem` 注解是一个功能。

与之类似的还有个 `component` 属性，这个属性可以传入 React Component，如果想用 React Hooks，请通过 `component` 传递，而不是 `children`。

这种扩展方式既简单又灵活，但它是写在配置中的，无法在其他地方复用，也无法在可视化编辑器里编辑，如果需要复用或在可视化编辑器中使用，请使用下面的「注册自定义类型」方式：

## React 注册自定义类型

首先需要了解「[基本原理](internal)」，了解了基本原理后，来看个简单的例子：

```jsx
import * as React from 'react';
import {Renderer} from 'amis';

@Renderer({
  type: 'my-renderer',
  autoVar: true // amis 1.8 之后新增的功能，自动解析出参数里的变量
})
class CustomRenderer extends React.Component {
  render() {
    const {tip} = this.props;
    return <div>这是自定义组件：{tip}</div>;
  }
}
```

> 上面这个语法需要开启 Decorator 功能，如果不支持，可以改成如下写法

```javascript
Renderer({
  type: 'my-renderer',
  autoVar: true
})(CustomRenderer);
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

看了前面[amis 工作原理](#工作原理)应该不难理解，这里注册一个 React 组件，当节点的 type 信息是 `my-renderer` 结尾时，交给当前组件来完成渲染。

如果这个组件还能通过 `children` 属性添加子节点，则需要使用下面这种写法：

```jsx
import * as React from 'react';
import {Renderer} from 'amis';

@Renderer({
  type: 'my-renderer2'
})
class CustomRenderer extends React.Component {
  render() {
    const {tip, body, render} = this.props;
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
      "body": [
        {
          "type": "input-text",
          "label": "用户名",
          "name": "usename"
        }
      ]
    }
  }
}
```

跟第一个例子不同的地方是，这里多了个 `render` 方法，这个方法就是专门用来渲染子节点的。来看下参数说明：

- `region` 区域名称，你有可能有多个区域可以作为容器，请不要重复。
- `node` 子节点。
- `props` 可选，可以通过此对象跟子节点通信等。

### 属性支持变量

> 1.8.0 及以上版本新增配置，之前版本需要调用 amis 里的 resolveVariableAndFilter 方法

前面的例子中组件参数都是静态的，但因为配置了 `autoVar: true`，使得所有组件参数将自动支持变量，比如下面例子中的 `tip` 在组件内拿到的将是解析后的值

```json
{
  "type": "page",
  "data": {
    "myVar": "var"
  },
  "title": "自定义组件示例",
  "body": {
    "type": "my-renderer",
    "tip": "${myVar}"
  }
}
```

### 表单项的扩展

以上是普通渲染器的注册方式，如果是表单项，为了更简单的扩充，请使用 `FormItem` 注解，而不是 `Renderer`。 原因是如果用 `FormItem` 是不用关心：label 怎么摆，表单验证器怎么实现，如何适配表单的 3 种展现方式（水平、上下和内联模式），而只用关心：有了值后如何回显，响应用户交互设置新值。

```jsx
import * as React from 'react';
import {FormItem} from 'amis';

@FormItem({
  type: 'custom'
})
class MyFormItem extends React.Component {
  render() {
    const {value, onChange} = this.props;

    return (
      <div>
        <p>这个是个自定义组件</p>
        <p>当前值：{value}</p>
        <a
          className="btn btn-default"
          onClick={() => onChange(Math.round(Math.random() * 10000))}
        >
          随机修改
        </a>
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
    "body": [
      {
        "type": "input-text",
        "label": "用户名",
        "name": "usename"
      },

      {
        "type": "custom",
        "label": "随机值",
        "name": "random"
      }
    ]
  }
}
```

> 注意: 使用 FormItem 默认是严格模式，即只有必要的属性变化才会重新渲染，有可能满足不了你的需求，如果忽略性能问题，可以传入 `strictMode`: `false` 来关闭。

表单项开发主要关心两件事。

1. 呈现当前值。如以上例子，通过 `this.props.value` 判定如果勾选了则显示`已勾选`，否则显示`请勾选`。
2. 接收用户交互，通过 `this.props.onChange` 修改表单项值。如以上例子，当用户点击按钮时，切换当前选中的值。

至于其他功能如：label/description 的展示、表单验证功能、表单布局（常规、左右或者内联）等等，只要是通过 FormItem 注册进去的都无需自己实现。

需要注意，获取或者修改的是什么值跟配置中 `type` 并列的 `name` 属性有关，也就是说直接关联某个变量，自定义中直接通过 props 下发了某个指定变量的值和修改的方法。如果你想获取其他数据，或者设置其他数据可以看下以下说明：

- `获取其他数据` 可以通过 `this.props.data` 查看，作用域中所有的数据都在这了。
- `设置其他数据` 可以通过 `this.props.onBulkChange`， 比如: `this.props.onBulkChange({a: 1, b: 2})` 等于同时设置了两个值。当做数据填充的时候，这个方法很有用。

### 其它高级定制

下面是一些不太常用的 amis 扩展方式及技巧。

#### 自定义验证器

如果 amis [自带的验证](../../components/form/formitem.md)能满足需求了，则不需要关心。组件可以有自己的验证逻辑。

```jsx
import * as React from 'react';
import {FormItem} from 'amis';
import * as cx from 'classnames';

@FormItem({
  type: 'custom-checkbox'
})
export default class CustomCheckbox extends React.Component {
  validate() {
    // 通过 this.props.value 可以知道当前值。

    return isValid ? '' : '不合法，说明不合法原因。';
  }
  // ... 其他省略了
}
```

上面的例子只是简单说明，另外可以做`异步验证`，validate 方法可以返回一个 promise。

#### OptionsControl

如果你的表单组件性质和 amis 的 Select、Checkboxes、List 差不多，用户配置配置 source 可通过 API 拉取选项，你可以用 OptionsControl 取代 FormItem 这个注解。

用法是一样，功能方面主要多了以下功能。

- 可以配置 options，options 支持配置 visibleOn hiddenOn 等表达式
- 可以配置 `source` 换成动态拉取 options 的功能，source 中有变量依赖会自动重新拉取。
- 下发了这些 props，可以更方便选项。
  - `options` 不管是用户配置的静态 options 还是配置 source 拉取的，下发到组件已经是最终的选项了。
  - `selectedOptions` 数组类型，当前用户选中的选项。
  - `loading` 当前选项是否在加载
  - `onToggle` 切换一个选项的值
  - `onToggleAll` 切换所有选项的值，类似于全选。

#### 组件间通信

关于组件间通信，amis 中有个机制就是，把需要被引用的组件设置一个 name 值，然后其他组件就可以通过这个 name 与其通信，比如这个[例子](../concepts/linkage)。其实内部是依赖于内部的一个 Scoped Context。你的组件希望可以被别的组件引用，你需要把自己注册进去，默认自定义的非表单类组件并没有把自己注册进去，可以参考以下代码做添加。

```js
import * as React from 'react';
import {Renderer, ScopedContext} from 'amis';
@Renderer({
  type: 'my-renderer'
})
export class CustomRenderer extends React.Component {
  static contextType = ScopedContext;

  constructor() {
    const scoped = this.context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context;
    scoped.unRegisterComponent(this);
  }

  // 其他部分省略了。
}
```

把自己注册进去了，其他组件就能引用到了。同时，如果你想找别的组件，也同样是通过 scoped 这个 context，如： `scoped.getComponentByName("xxxName")` 这样就能拿到目标组件的实例了（前提是目标组件已经配置了 name 为 `xxxName`）。

#### 其他功能方法

自定义的渲染器 props 会下发一个非常有用的 env 对象。这个 env 有以下功能方法。

- `env.fetcher` 可以用来做 ajax 请求如： `this.props.env.fetcher('xxxAPi', this.props.data).then((result) => console.log(result))`
- `env.confirm` 确认框，返回一个 promise 等待用户确认如： `this.props.env.confirm('你确定要这么做？').then((confirmed) => console.log(confirmed))`
- `env.alert` 用 Modal 实现的弹框，个人觉得更美观。
- `env.notify` toast 某个消息 如： `this.props.env.notify("error", "出错了")`
- `env.jumpTo` 页面跳转。
