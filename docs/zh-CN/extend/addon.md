---
title: 扩展现有组件
---

除了新增组件，在 amis 中还能扩展和修改现有组件。

## 扩展表单验证

如果默认的表单检测规则不满足需求，还可以通过代码的方式扩展。

JSSDK 中的用法：

```javascript
let amisLib = amisRequire('amis');
amisLib.addRule(
  // 校验名
  'isZXS',
  // 校验函数，values 是表单里所有表单项的值，可用于做联合校验；value 是当前表单项的值
  (values, value) => {
    if (
      value === '北京' ||
      value === '上海' ||
      value === '天津' ||
      value === '重庆'
    ) {
      return true;
    }
    return false;
  },
  // 出错时的报错信息
  '输入的不是直辖市'
);
```

这样在配置中就能使用下面的验证方法

```
"validations": {
  "isZXS": true
}
```

在 React 的使用方法是类似的

```javascript
import {addRule} from 'amis';
```

## 同时支持多种类型编辑

在表单编辑中，每个 name 一般对应一种类型，如果这个 name 有多种类型，比如下面的例子中 id 的值有可能是字符串，也有可能是数字，但 type 只能设置为一种类型，这种情况如何处理？

```schema: scope="body"
{
    "type": "form",
    "mode": "horizontal",
    "body": [
        {
            "name": "id",
            "type": "input-text",
            "label": "id"
        }
    ]
}
```

有两种方式：

### 使用另一个名称作为状态

```schema: scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "body": [
    {
      "name": "idIsNumber",
      "type": "switch",
      "label": "id 是数字类型"
    },
    {
      "name": "id",
      "type": "input-text",
      "label": "id",
      "hiddenOn": "data.idIsNumber"
    },
    {
      "name": "id",
      "type": "input-number",
      "label": "id",
      "visibleOn": "data.idIsNumber"
    }
  ]
}
```

可以看到在一个 form 中可以有两个 name 相同的组件，通过 hiddenOn 或 visibleOn 来控制同时只显示一个。

### 使用 PipeIn/PipeOut 方法

如果不想增加一个新的 name，在 JS SDK 或 React 还有更高级的处理方法，可以增加一个 name 同样为 id 的 switch，实现 PipeIn/PipeOut 函数来进行自动识别，下面是个示例：

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
    body: [
      {
        type: 'switch',
        label: 'id 是数字',
        name: 'id',
        // pipeIn 返回的应该是这个组件所需的值，比如 switch 的返回值就应该是 true 或 false
        // 这里的 value 就是初始值，如果不设置将会是 undefined
        pipeIn: (value, data) => {
          if (typeof value === 'undefined') {
            return false;
          }
          return typeof value !== 'string';
        },
        // 这里的 value 是点击 switch 之后的值，比如打开就是 true，关闭就是 false
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

不过这种写法的复杂度较高

## 修改组件标签

有些组件可以设置 `wrapperComponent`，比如 Form 下默认使用 form 标签，在浏览器中会自带回车提交功能，如果想去掉这个功能，可以将 `wrapperComponent` 设置为 `div`。
