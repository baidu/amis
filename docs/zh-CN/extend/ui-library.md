---
title: 将 amis 当成 UI 库用
---

amis 不仅有纯配置的用法，还能当成 UI 库来使用，实现 90% 低代码，10% 代码开发的混合模式，在灵活性上。

> 需要注意以下都需要在配置中写函数，因此不再是纯粹的 JSON，所以暂时不能在可视化编辑器的「代码」模式下使用
> 从 1.3.0 开始按钮的 onClick 支持字符串格式，因此可以在可视化编辑器中使用

## 事件监听

amis 提供了一些交互配置，但有时候这些交互无法满足需求，这时我们可以监听这些事件，然后用代码实现复杂交互需求，比如最常见的是表单事件。

```javascript
let amisJSON = {
  type: 'page',
  title: '表单页面',
  body: [
    {
      type: 'form',
      mode: 'horizontal',
      onFinished: values => {
        console.log('form', values);
        return false; // 这样可以禁掉 amis 后续的默认行为
      },
      body: [
        {
          label: 'Name',
          type: 'input-text',
          name: 'name',
          onChange: value => {
            console.log('Name', value);
          }
        },
        {
          type: 'button',
          label: '按钮修改',
          onClick: (e, props) => {
            console.log('消息通知');
            props.formStore.setValues({name: 'amis'});
          }
        }
      ]
    }
  ]
};
```

这个例子中我们监听了 3 个事件，输入框数据变化、表单提交、按钮点击，然后在这些地方使用代码实现特殊功能。

## 使用 amis 公共方法

amis 对外还提供了一些方法，比如弹出消息通知，可以通过 `amisRequire('amis')` 获取到这些 amis 对外提供的方法。

```javascript
let amis = amisRequire('amis/embed');
let amisLib = amisRequire('amis');
let amisScoped = amis.embed('#root', {
  type: 'page',
  title: '表单页面',
  body: {
    type: 'form',
    mode: 'horizontal',
    api: '/saveForm',
    body: [
      {
        type: 'button',
        label: '按钮',
        onClick: () => {
          amisLib.toast.info('消息通知');
        }
      }
    ]
  }
});
```

具体有哪些可以参考 `https://github.com/baidu/amis/blob/master/src/index.tsx`

## React 中引入 amis 的组件

在 React 环境下使用 amis，还可以直接引入 amis 内置组件，在 amis 项目源码 `src/components` 下的组件都是标准 React 组件，可以在项目中直接引用，这样就能将 amis 当成纯粹 UI 库来使用。

```jsx
import {Button} from 'amis-ui';

...

<Button
  onClick={() => {}}
  type="button"
  level="link"
  className="navbar-btn"
>
  按钮
</Button>
```
