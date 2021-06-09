---
title: 自定义组件 - SDK
---

## 使用 custom 组件临时扩展

基于 custom 组件可以直接在 amis 配置实现自定义功能，它的支持面最广，是唯一支持在可视化编辑器中使用的方法。

使用 custom 组件类似如下写法：

```javascript
{
  label: '使用 custom 组件',
  name: 'username',  // 如果要放在 form 中，需要设置 name，onChange 将会设置这个值
  type: 'custom',
  // onMount 将会在组件创建时执行，默认会创建一个空 div 标签，也可以设置 inline: true 来创建 span 标签
  // dom 是 dom 节点，value 是初始数据，比如表单 name 初始拿到的数据，onChange 只有在表单下才会有
  onMount: (dom, value, onChange) => {
    const button = document.createElement('button');
    button.innerText = '点击修改姓名';
    button.onclick = event => {
      onChange('new name');
      event.preventDefault();
    };
    dom.appendChild(button);
  },
  // onUpdate 将会在数据更新时被调用
  // dom 是 dom 节点、data 将包含表单所有数据，prevData 是之前表单的所有数据
  onUpdate: (dom, data, prevData) => {
    console.log('数据有变化', data);
  },
  // onUnmount 将会在组件被销毁的时候调用，用于清理资源
  onUnmount:() => {
    console.log('组件被销毁');
  }
}
```

注意上面的代码用到了 JavaScript 函数，无法转成 json 格式，但这三个函数还支持字符串形式，上面的代码可以改成如下形式，这样就能在可视化编辑器里支持自定义组件了：

```schema: scope="body"
{
  "type": "form",
  "title": "custom 组件",
  "body": [
    {
      "type": "input-text",
      "name": "username",
      "label": "姓名"
    },
    {
      "name": "username",
      "type": "custom",
      "label": "自定义组件",
      "onMount": "const button = document.createElement('button'); button.innerText = '点击修改姓名'; button.onclick = event => { onChange('new name'); event.preventDefault(); }; dom.appendChild(button);"
    }
  ]
}
```

注意上面的例子中两个组件的 name 是一样的，这是为了方便示例，因为 amis 中的数据是双向绑定的，因此 onChange 修改自身的时候，另一个「姓名」输入框由于 name 一样，也会同步更新。

关于 custom 组件的更多属性请参考「[Custom 组件](../../components/custom)」。

## JS SDK 注册组件

amis 组件都是基于 React 的，所以需要使用一个简单的 React 组件来注册，可以是函数组件也可以是类组件，下面以函数组件为例，将[快速开始](../start/getting-started)中的代码替换成如下示例：

```javascript
let amis = amisRequire('amis/embed');
let amisLib = amisRequire('amis');
let React = amisRequire('react');

// 自定义组件，props 中可以拿到配置中的所有参数，比如 props.label 是 'Name'
function CustomComponent(props) {
  let dom = React.useRef(null);
  React.useEffect(function () {
    // 从这里开始写自定义代码，dom.current 就是新创建的 dom 节点
    // 可以基于这个 dom 节点对接任意 JavaScript 框架，比如 jQuery/Vue 等
    dom.current.innerHTML = 'custom';
    // 而 props 中能拿到这个
  });
  return React.createElement('div', {
    ref: dom
  });
}

//注册自定义组件，请参考后续对工作原理的介绍
amisLib.Renderer({
  test: /(^|\/)my-custom/
})(CustomComponent);

let amisScoped = amis.embed('#root', {
  type: 'page',
  title: '表单页面',
  body: {
    type: 'form',
    mode: 'horizontal',
    api: '/saveForm',
    body: [
      {
        label: 'Name',
        type: 'my-custom', // 注意这个的 type 对应之前注册的 test
        name: 'custom'
      }
    ]
  }
});
```

### 示例：引入 Element UI

首先在页面中加入 Element UI 所需的依赖

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/element-ui/lib/theme-chalk/index.css"
/>
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/element-ui/lib/index.js"></script>
```

然后将前面的 `React.useEffect` 改成如下即可：

```javascript
React.useEffect(function () {
  dom.current.innerHTML = `
      <el-button @click="visible = true">Button</el-button>
      <el-dialog :visible.sync="visible" title="Hello world">
        <p>Try Element</p>
      </el-dialog>
    `;
  new Vue({
    el: dom.current,
    data: function () {
      return {visible: false};
    }
  });
});
```
