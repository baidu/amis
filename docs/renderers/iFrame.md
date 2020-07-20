## iFrame

如果需要内嵌外部站点，可用 iframe 来实现。

```schema:height="300" scope="body"
{
    "type": "iframe",
    "src": "raw:http://www.baidu.com",
    "style": {
        "height": 260
    }
}
```

## 如何和 iframe 通信

#### amis 向 iframe 通信

在 iframe 页面中添加`message`事件监听器，在 iframe 初始化、更新、reload 的时候，会通过 `postMessage` 发送当前数据域数据，iframe 页面的事件监听器中可以通过`e.data`进行获取：

```js
window.addEventListener('message', e => {
  // e.data 获取当前数据域数据，进行使用
});
```

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

2. iframe 页面中，获取父级 window，并使用`postMessage`传递数据，格式如下：

```js
window.parent.postMessage(
  {
    event: 'detail',
    data: {
      iframeId: '111'
    }
  },
  '*'
);
```

`message`格式：

- `event`: 标识要触发的 amis 行为，这里我们设置为配置好的`detail`事件
- `data`: 传给 amis 的数据，amis 会将该数据与当前数据域进行合并进行使用

这样 amis 弹框中就会渲染内容:`iframe 传给 amis 的 id 是：111`
