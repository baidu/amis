---
title: 页面交互行为跟踪
---

从 1.5.0 版本开始，amis 内置了跟踪用户交互行为采集功能。

## 使用方法

amis 只负责采集，对行为的存储和分析都需要外部实现。

在 amis 渲染时的第三个参数 env 可以传递 tracker 函数，比如 sdk 中的例子是

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
    tracker: eventTrack => {}
  }
);
```

## 事件类型

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
    | 'add'
    | 'reset'
    | 'reset-and-submit'
    | 'formItemChange'
    | 'formSubmit'
    | 'tabChange'
    | 'error';

  /**
   * 事件数据
   */
  eventData: ActionSchema | Api;

  /**
   * 触发事件的组件属性，可以用来存放自定义属性
   */
  props?: PlainObject;
}
```
