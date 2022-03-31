---
title: iFrame
description:
type: 0
group: ⚙ 组件
menuName: iFrame
icon:
order: 51
---

## 基本使用

内嵌外部站点，可用 iframe 来实现。

```schema: scope="body"
{
    "type": "iframe",
    "src": "https://github.com/baidu/amis",
    "height": 300
}
```

## src 也可以从上下文获取

> 1.1.6

```schema:
{
  "type": "page",
  "data": {
    "iframeSrc": "https://github.com/baidu/amis"
  },
  "body": {
    "type": "iframe",
    "src": "${iframeSrc}",
    "height": 300
  }
}
```

## 如何和 iframe 通信

#### amis 向 iframe 通信

在 iframe 页面中添加`message`事件监听器，在 iframe 初始化、更新或者接收到其他组件发送数据的时候，会通过 `postMessage` 发送当前数据域数据，iframe 页面的事件监听器中可以通过`e.data`进行获取：

```js
window.addEventListener('message', e => {
  // e.data 获取当前数据域数据，进行使用
});
```

`e.data` 格式及参数说明：

```json
{
  "type": "amis:init", // 当前事件类型
  "data": {
    //... 当前数据域数据
  }
}
```

- **type**: 当前事件类型
  - amis:init：初始化的时候触发
  - amis:update：组件更新时触发
  - amis:receive：组件通过 target 接收到其他组件发送来数据的时候
- **data**：当前数据源数据

> 如果是 webpack 开发环境，注意过滤掉`webpackOk`类型消息

#### iframe 页面向 amis 通信

1. 首先在 amis 的 iframe 配置项中配置 events 对象，指明 iframe 需要触发的 amis 行为

```json
{
  "type": "iframe",
  "src": "http://www.xxx.com",
  "events": {
    "detail": {
      "actionType": "dialog",
      "dialog": {
        "title": "弹框",
        "body": "iframe 传给 amis 的 id 是：${iframeId}"
      }
    }
  }
}
```

上面 `events` 对象中配置了`detail`事件，该行为会触发 amis 弹框行为，并在弹框中渲染`"iframe 传给 amis 的 id 是：${iframeId}"`这段模板。

那么要如何触发该事件和传递数据呢？

2. iframe 页面中，获取父级 window，并使用`postMessage`传递数据，格式如下，：

```js
window.parent.postMessage(
  {
    type: 'amis:detail',
    data: {
      iframeId: '111'
    }
  },
  '*'
);
```

`message`格式：

- `type`: 标识要触发的 amis 行为，请使用 `amis:xxx` 的格式，这里我们设置为配置好的`detail`事件
- `data`: 传给 amis 的数据，amis 会将该数据与当前数据域进行合并进行使用

这样 amis 弹框中就会渲染内容:`iframe 传给 amis 的 id 是：111`

## 设置高度自适应

默认 amis 中只支持给 iframe 配置固定高度，我们可以通过上面说到的通信机制实现高度自适应。

1. 首先在 iframe 页面中获取到页面高度
2. 通过`amis:resize`事件，将高度信息发送给 amis

```js
window.parent.postMessage(
  {
    type: 'amis:resize',
    data: {
      height: 400
    }
  },
  '*'
);
```

这样就可以动态设置 iframe 组件高度

## 属性表

| 属性名      | 类型               | 默认值     | 说明                 |
| ----------- | ------------------ | ---------- | -------------------- |
| type        | `string`           | `"iframe"` | 指定为 iFrame 渲染器 |
| className   | `string`           |            | iFrame 的类名        |
| frameBorder | `Array`            |            | frameBorder          |
| style       | `object`           |            | 样式对象             |
| src         | `string`           |            | iframe 地址          |
| height      | `number`或`string` | `"100%"`   | iframe 高度          |
| width       | `number`或`string` | `"100%"`   | iframe 宽度          |
