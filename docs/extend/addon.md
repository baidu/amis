---
title: 扩展现有组件
---

## 修改组件标签

有些组件可以设置 `wrapperComponent`，大部分情况下都是 div 标签，或者在 Form 下是 form 标签，如果要修改组件容器的标签，可以设置这个值。

## 事件扩展

amis 默认会将配置项剩余参数都作为 React 的 props 传入对应标签，使得可以添加自己的自定义事件，比如 下面的例子

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
    controls: [
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

这样就能在点击按钮的时候执行自定义代码了。

## 同时支持多种类型编辑

在表单编辑中，每个 name 一般对应一种类型，如果这个 name 有多种类型，比如下面的例子中 id 的值有可能是字符串，也有可能是数字，但 type 只能设置为一种类型，这种情况如何处理？

```schema:height="200" scope="body"
{
    "type": "form",
    "mode": "horizontal",
    "controls": [
        {
            "name": "id",
            "type": "text",
            "label": "id"
        }
    ]
}
```

有两种方式：

### 使用另一个名称作为状态

```schema:height="250" scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "controls": [
    {
      "name": "idIsNumber",
      "type": "switch",
      "label": "id 是数字类型"
    },
    {
      "name": "id",
      "type": "text",
      "label": "id",
      "hiddenOn": "data.idIsNumber"
    },
    {
      "name": "id",
      "type": "number",
      "label": "id",
      "visibleOn": "data.idIsNumber"
    }
  ]
}
```

可以看到在一个 form 中可以有两个 name 相同的组件，通过 hiddenOn 或 visibleOn 来控制同时只显示一个。

### 使用 PipeIn/PipeOut 方法

如果不想增加一个新的 name，在 JS SDK 或 React 还有更高级的处理方法，通过一个 name 为 id 的 switch，实现 PipeIn/PipeOut 函数来进行自动识别。

```javascript
let amis = amisRequire('amis/embed');
let amisScoped = amis.embed('#root', {
  type: 'page',
  title: '表单页面',
  // 可以通过去掉下面的注释来测试
  // data: {
  //   id: 1
  // },
  body: {
    type: 'form',
    mode: 'horizontal',
    api: '/saveForm',
    controls: [
      {
        type: 'switch',
        label: 'id 是数字',
        name: 'id',
        // value 默认情况下将会是 undefined，如果有值，就判断这个值
        // pipeIn 返回的应该是这个组件所需的值，比如 switch 的返回值就应该是 true 或 false
        pipeIn: (value, data) => {
          if (typeof value === 'undefined') {
            return false;
          }
          return typeof value !== 'string';
        },
        // value 是点击 switch 之后的值，打开就是 true，关闭就是 false
        pipeOut: (value, oldValue, data) => {
          if (value) {
            return 1; // 切换到数字之后的默认值
          } else {
            return 'id1'; // 关闭之后的默认值
          }
        }
      },
      {
        name: 'id',
        type: 'text',
        label: 'id',
        visibleOn:
          'typeof data.id === "undefined" || typeof data.id === "string"'
      },
      {
        name: 'id',
        type: 'number',
        label: 'id',
        visibleOn: 'typeof data.id === "number"'
      }
    ]
  }
});
```

大部分情况下建议使用第一种方式，这种方式最为直观。
