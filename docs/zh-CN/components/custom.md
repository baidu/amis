---
title: Custom 自定义组件
description:
type: 0
group: ⚙ 组件
menuName: Custom 自定义组件
icon:
order: 26
---

用于实现自定义组件，它解决了之前 JS SDK 和可视化编辑器中难以支持自定义组件的问题。

## 基本用法

设置 type 类型为 custom

### onMount

这是节点在初始化的时候执行的函数，它接收三个参数：

- dom，组件加载之后的 dom 节点
- data，组件初始值，需要设置 name
- onChange，修改这个组件对应 name 的值
- props，后面会单独介绍

比如在这样的 form 组件中：

```javascript
{
  type: 'page',
  title: '表单页面',
  body: {
    type: 'form',
    title: 'custom 组件',
    body: [
      {
        type: 'custom',
        name: 'myName',
        label: '自定义组件',
        onMount: (dom, value, onChange, props) => {
          const button = document.createElement('button');
          button.innerText = '点击修改';
          button.onclick = event => {
            // 这个 onChange 方法只有放在表单项中才能调用，第二个参数是表单项名称
            onChange('new', 'myName');
            event.preventDefault();
          };
          dom.appendChild(button);
        }
      }
    ]
  }
}
```

点击按钮之后，执行 `onChange` 函数，就会将 `myName` 这个参数的值改成 `new`，点击表单提交的时候，就会有一个 `myName=new` 的表单数据。

### onUpdate

onUpdate 是在数据变更的时候调用，注意这个数据变更会包含表单内的所有其他组件。

```javascript
{
  type: 'page',
  title: '表单页面',
  body: {
    type: 'form',
    title: 'custom 组件',
    body: [
      {
        name: 'email',
        label: '邮箱',
        type: 'input-text'
      },
      {
        name: 'username',
        label: '用户名',
        type: 'input-text'
      },
      {
        type: 'custom',
        label: '自定义组件',
        onUpdate: (dom, data, prevData, props) => {
          console.log('data', data, prevData)
        }
      }
    ]
  }
}
```

这个例子中，无论是邮箱还是用户名修改，都会触发 onUpdata 函数，其中 `data` 是当前值，`prevData` 是之前的值：

1. 如果修改 email，则 data 将会是 `{email: 'xxx'}`，prevData 是 `{}`
2. 如果再次修改 email，则 data 将会是 `{email: 'xxx1'}`，prevData 是 `{email: 'xxx '}`
3. 如果修改 username，则 data 将会是 `{email: 'xxx1', username: 'yyy'}`，prevData 是 `{email: 'xxx1'}`

### onUnmount

onUnmount 是在组件销毁的时候执行，可以在这里做资源清理，这个函数只有一个 props 参数。

### Vue.js

因为 onMount 拿到的 dom 就是标准的 dom，所以可以执行任意 JavaScript 代码，包括 jQuery 等，下面的例子演示了如何使用 vue 实现自定义组件：

```javascript
{
  type: 'page',
  title: '表单页面',
  body: {
    type: 'form',
    title: 'custom 组件',
    body: [
      {
        type: 'custom',
        name: 'my-custom',
        html: `
        <ol>
          <li v-for="todo in todos">
            {{ todo.text }}
          </li>
        </ol>
        `,
        label: '自定义组件',
        onMount: (dom, data, onChange, props) => {
          const app = new Vue({
            el: dom,
            data: {
              todos: [
                { text: 'hello' },
                { text: 'world' },
                { text: 'vue' }
              ]
            }
          })
        }
      }
    ]
  }
}
```

### props

前面可以看到所有函数最后都有一个 props 参数，在这个参数里能拿到 amis 内部属性和方法，比如弹框

```javascript
onMount: (dom, data, onChange, props) => {
  const button = document.createElement('button');
  button.innerText = '点击修改姓名';
  button.onclick = event => {
    onChange('new name', 'name');
    props.onAction(
      event,
      {
        type: 'action',
        label: '弹个框',
        actionType: 'dialog',
        dialog: {
          title: '弹框',
          body: 'Hello World!'
        }
      },
      {} // 这是 data
    );
    event.preventDefault();
  };
  dom.appendChild(button);
};
```

或者执行 `props.env.notify('success', '执行成功')` 来在右上角弹出提示等。

## 属性表

| 属性名    | 类型      | 默认值   | 说明                                          |
| --------- | --------- | -------- | --------------------------------------------- |
| type      | 'custom'  |          |                                               |
| id        | `string`  |          | 节点 id                                       |
| name      | `string`  |          | 节点 名称                                     |
| className | `string`  |          | 节点 class                                    |
| inline    | `boolean` | false    | 默认使用 div 标签，如果 true 就使用 span 标签 |
| html      | `string`  |          | 初始化节点 html                               |
| onMount   | `string`  | Function | 节点初始化之后调的用函数                      |
| onUpdate  | `string`  | Function | 数据有更新的时候调用的函数                    |
| onUnmount | `string`  | Function | 节点销毁的时候调用的函数                      |
