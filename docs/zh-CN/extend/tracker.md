---
title: 页面交互行为跟踪
---

从 1.5.0 版本开始，amis 内置了跟踪用户交互行为采集功能。

## 使用方法

amis 只负责采集，对行为的存储和分析都需要外部实现。

在 amis 渲染时的第三个参数 env 可以传递 tracker 函数，下面以 sdk 作为示例，具体实现可以根据实际需求修改，比如可以收集一段时间后再批量提交等。

```js
amis.embed(
  '#root',
  {
    // amis schema
  },
  {
    // 这里是初始 props
  },
  {
    tracker: (eventTrack, props) => {
      const blob = new Blob([JSON.stringify(eventTrack)], {
        type: 'application/json'
      });
      navigator.sendBeacon('/tracker', blob);
    }
  }
);
```

## 参数类型

eventTrack 的类型定义是

```typescript
interface EventTrack {
  // 后面会详细介绍
  eventType:
    | 'api'
    | 'url'
    | 'link'
    | 'dialog'
    | 'drawer'
    | 'copy'
    | 'reload'
    | 'email'
    | 'prev'
    | 'next'
    | 'cancel'
    | 'close'
    | 'submit'
    | 'confirm'
    | 'reset'
    | 'reset-and-submit'
    | 'formItemChange'
    | 'tabChange'
    | 'pageHidden'
    | 'pageVisible';

  /**
   * 事件数据，根据不同事件有不同结构，下面会详细说明
   */
  eventData: ActionSchema | Api;
}
```

有时候无法通过 `eventData` 区分点击行为，比如有个两个提交按钮

```json
[
  {
    "label": "提交",
    "primary": true
  },
  {
    "label": "提交",
    "primary": true
  }
]
```

当它触发事件的时 `EventTrack` 内容是一样的

```json
{
  "eventType": "submit",
  "eventData": {
    "primary": true,
    "label": "提交"
  }
}
```

如何区分究竟是哪个事件？可以通过增加 `id` 属性，比如

```json
[
  {
    "id": "button1",
    "label": "提交",
    "primary": true
  },
  {
    "id": "button2",
    "label": "提交",
    "primary": true
  }
]
```

这样触发事件中就会包含 `id` 字段来方便区分，比如

```json
{
  "eventType": "submit",
  "eventData": {
    "id": "button1",
    "primary": true,
    "label": "提交"
  }
}
```

另一个方法是通过 `tracker` 的第二个参数 `props` 来判断，它可以拿到这个组件的所有属性配置

## 事件示例

除了下面的文档，还可以打开浏览器的控制台，在 `debug` 分类下可以看到实际操作时的例子

### api

api 的来源有两方面，一个是各种组件的 api 及 source 配置，另一个是 action 里的 ajax 类型请求

以 crud 为例

```json
{
  "eventType": "api",
  "eventData": {
    "method": "get",
    "url": "/api/mock2/sample?page=1&perPage=10",
    "query": {
      "page": 1,
      "perPage": 10
    }
  }
}
```

如果是 post 则类似下面的数据

```json
{
  "eventType": "api",
  "eventData": {
    "method": "post",
    "url": "/api/mock2/form/saveForm"
  }
}
```

为了避免信息泄露在 eventData 里没有包含提交数据，要获取提交数据详情需要通过第二个参数，参考下面的例子

```javascript
{
  tracker: (eventTrack, data) => {
    console.log('提交数据详情', data);
    const blob = new Blob([JSON.stringify(eventTrack)], {
      type: 'application/json'
    });
    navigator.sendBeacon('/tracker', blob);
  };
}
```

### url

这是打开外部链接事件，注意不要和 link 混淆，link 一般用来做应用内相对地址无刷新跳转

示例

```json
{
  "eventType": "url",
  "eventData": {
    "url": "https://www.baidu.com",
    "blank": true,
    "label": "百度一下，你就知道"
  }
}
```

这个事件有可能是 Link 组件触发，也有可能是 Action 组件触发，如果是 Action 这是类似下面的参数

```json
{
  "eventType": "url",
  "eventData": {
    "url": "http://www.baidu.com",
    "level": "success",
    "blank": true,
    "label": "打开 Baidu"
  }
}
```

Action 组件会多些数据

### link

触发这个事件主要是 Action 和 Nav 组件

如果是 Action，数据将会是

```json
{
  "eventType": "link",
  "eventData": {
    "label": "进入介绍页",
    "level": "info",
    "link": "../index"
  }
}
```

如果是 Nav，数据将会是

```json
{
  "eventType": "link",
  "eventData": {
    "label": "Nav 2-2",
    "link": "?cat=2-2"
  }
}
```

它们都有 label 及 link 字段

### dialog

这个事件主要由 action 触发，示例

```json
{
  "eventType": "dialog",
  "eventData": {
    "dialog": {
      "title": "提示",
      "closeOnEsc": true,
      "body": "这是个简单的弹框"
    },
    "label": "打开弹框"
  }
}
```

需要注意 dialog 里会包含所有弹框的 schema 配置，可能会导致提交数据太大，建议根据需求裁剪。

### drawer

这个事件主要由 action 触发，示例

```json
{
  "eventType": "drawer",
  "eventData": {
    "drawer": {
      "position": "left",
      "size": "xs",
      "title": "提示",
      "body": "这是个简单的弹框"
    },
    "label": "左侧弹出-极小框"
  }
}
```

和前面的 dialog 示例，它的数据中会包含所有 drawer 配置，可能会内容过大，需要根据需求过滤

### copy

由 action 触发，示例如下

```json
{
  "eventType": "copy",
  "eventData": {
    "content": "http://www.baidu.com",
    "label": "复制一段文本"
  }
}
```

### reload

由 action 触发，示例

```json
{
  "eventType": "reload",
  "eventData": {
    "label": "搜索",
    "target": "my_form.select"
  }
}
```

### email

由 action 触发，示例

```json
{
  "eventType": "email",
  "eventData": {
    "to": "amis@baidu.com",
    "cc": "baidu@baidu.com",
    "subject": "这是邮件主题",
    "body": "这是邮件正文",
    "label": "发送邮件"
  }
}
```

### prev/next

可能有两个地方，一个是 Wizard 里的上一步下一步，还有可能是 Dialog 里的上一个下一个，示例

```json
{
  "eventType": "next",
  "eventData": {
    "level": "info",
    "label": "下一个"
  }
}
```

### cancel

action 里的取消事件，示例

```json
{
  "eventType": "cancel",
  "eventData": {
    "label": "关闭"
  }
}
```

### close

action 里的关闭事件，主要用于关闭弹框，示例

```json
{
  "eventType": "close",
  "eventData": {
    "label": "算了"
  }
}
```

### submit

点击提交按钮的事件，这个事件可能还会同时触发 `api` 事件，比如表单的提交按钮。

```json
{
  "eventType": "submit",
  "eventData": {
    "primary": true,
    "label": "提交"
  }
}
```

### confirm

action 中的事件，主要用于关闭弹框

```json
{
  "eventType": "confirm",
  "eventData": {
    "primary": true,
    "label": "确认"
  }
}
```

### reset

由 action 触发，主要用于重置表单数据，示例

```json
{
  "eventType": "reset",
  "eventData": {
    "label": "重置"
  }
}
```

### reset-and-submit

由 action 触发，会重置表单并提交数据

```json
{
  "eventType": "reset-and-submit",
  "eventData": {
    "label": "重置并提交"
  }
}
```

### formItemChange

表单项数据变化时，也就是用户在表单里输入和修改任何数据时触发，比如

> 有一个特例是 input-password 类型的字段不会触发这个事件，避免隐私风险
> 但在 api 中还是有可能包含隐私信息，因此建议前面 api 类的事件不记录数据提交内容

```json
{
  "eventType": "formItemChange",
  "eventData": {
    "name": "name",
    "label": "用户名",
    "type": "input-text",
    "value": "amis"
  }
}
```

事件数据里主要是 `name` `type` 和 `value`

需要注意这个事件非常频繁，只要修改内容就会触发。

和 action 类似，如果给表单项加上 `id` 字段也会透传到这里，方便用于区分同名输入框，比如

```json
{
  "eventType": "formItemChange",
  "eventData": {
    "id": "name1",
    "name": "name",
    "label": "用户名",
    "type": "input-text",
    "value": "amis"
  }
}
```

### tabChange

tab 切换事件，示例

```json
{
  "eventType": "tabChange",
  "eventData": {
    "key": "tab2"
  }
}
```

默认情况下 `key` 的值从 `0` 开始，如果 tab 上设置了 `hash` 值就会用这个值。

同样，如果 tabs 设置了 id，也会输出这个 id 值方便区分

### pageHidden

当 tab 切换或者页面关闭时触发，可以当成用户离开页面的时间。

### pageVisible

当用户又切换回当前页面的时间，可以当做是用户重新访问的开始时间。

由于 amis 可能被嵌入到页面中，所以 amis 无法知晓页面首次打开的时间，需要自行处理。
