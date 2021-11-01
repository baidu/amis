---
title: Web Component
description:
type: 0
group: ⚙ 组件
menuName: WebComponent
icon:
order: 73
---

专门用来渲染 web component 的组件，可以通过这种方式来扩展 amis 组件，比如使用 Angular。

## 基本用法

比如下面这个 web component

```html
<random-number prefix="hello" class="my-class"></random-number>
```

对应代码类似

```javascript
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';

class RandomNumber extends HTMLElement {
  connectedCallback() {
    const prefix = this.getAttribute('prefix') || '';
    const shadow = this.attachShadow({mode: 'open'});
    const text = document.createElement('span');
    text.textContent = `${prefix}: ${Math.floor(Math.random() * 1000)}`;
    shadow.appendChild(text);
    setInterval(function () {
      const count = `${prefix}: ${Math.floor(Math.random() * 1000)}`;
      text.textContent = count;
    }, 2000);
  }
}

customElements.define('random-number', RandomNumber);
```

使用 amis 可以这样渲染出来

```json
{
  "type": "web-component",
  "tag": "random-number",
  "props": {
    "prefix": "hello",
    "class": "my-class"
  }
}
```

其中 `tag` 指定标签，属性放在 `props` 对象里，props 里的值支持变量替换，比如：

```json
{
  "data": {
    "text": "World"
  },
  "type": "page",
  "body": {
    "type": "web-component",
    "tag": "random-number",
    "props": {
      "prefix": "${text}"
    }
  }
}
```

## 属性表

| 属性名 | 类型                                      | 默认值            | 说明                          |
| ------ | ----------------------------------------- | ----------------- | ----------------------------- |
| type   | `string`                                  | `"web-component"` | 指定为 web-component 渲染器   |
| tag    | `string`                                  |                   | 具体使用的 web-component 标签 |
| props  | `object`                                  |                   | 标签上的属性                  |
| body   | [SchemaNode](../../docs/types/schemanode) |                   | 子节点                        |
