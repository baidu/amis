---
title: Page 页面
description:
type: 0
group: ⚙ 组件
menuName: Page 页面
icon:
order: 23
---

Page 组件是 amis 页面 JSON 配置中顶级容器组件，是整个页面配置的入口组件。

## 基本用法

我们这里在内容区中简单渲染一段文字。

```schema
{
  "type": "page",
  "title": "标题",
  "body": "Hello World!"
}
```

## 渲染组件

内容区同样可以渲染各种组件，这里我们渲染一个表单。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
      {
        "type": "input-text",
        "name": "name",
        "label": "姓名："
      }
    ]
}
```

## 在其他区域渲染组件

Page 默认将页面分为几个区域，分别是**内容区（`body`）**、**侧边栏（`aside`）** 和 **工具栏（`toolbar`）部分**，你可以在这些区域配置你想要的组件和内容。

```schema
{
  "type": "page",
  "aside": [
    {
      "type": "tpl",
      "tpl": "这是侧边栏部分"
    }
  ],
  "toolbar": [
    {
      "type": "tpl",
      "tpl": "这是工具栏部分"
    }
  ],
  "body": [
    {
      "type": "tpl",
      "tpl": "这是内容区"
    }
  ]
}
```

> 不同区域都是`Page`的子节点，也就是说都可以使用`Page`下数据作用域。

## 页面初始化请求

通过配置`initApi`，可以在初始化页面时请求所配置的接口。

```schema
{
  "type": "page",
  "initApi": "/api/mock2/page/initData",
  "body": [
    {
      "type": "tpl",
      "tpl": "当前时间是：${date}"
    }
  ]
}
```

具体 API 规范查看 [API 文档](../../docs/types/api)。

## 轮询初始化接口

想要在页面渲染后，轮询请求初始化接口，步骤如下：

1. 配置 initApi；
2. 配置 interval：单位为毫秒，最小 1000。

```schema
{
  "type": "page",
  "initApi": "/api/mock2/page/initData",
  "interval": 3000,
  "body": [
    {
      "type": "tpl",
      "tpl": "当前时间是：${date}"
    }
  ]
}
```

如果希望在满足某个条件的情况下停止轮询，配置`stopAutoRefreshWhen`表达式。

```schema
{
  "type": "page",
  "initApi": "/api/mock2/page/initData",
  "stopAutoRefreshWhen": "this.time % 5", // 当时间戳能被5整除时，停止轮询
  "interval": 3000,
  "body": [
    {
      "type": "tpl",
      "tpl": "当前时间戳是：${date}"
    }
  ]
}
```

## 下拉刷新

通过配置`pullRefresh`，可以设置下拉刷新功能（仅用于移动端）。

```schema
{
  "type": "page",
  "initApi": "/api/mock2/page/initData",
  "pullRefresh": {
    "disabled": false
  },
  "body": [
    {
      "type": "tpl",
      "tpl": "当前时间是：${date}"
    }
  ]
}
```

配置下拉刷新文案

```schema
{
  "type": "page",
  "initApi": "/api/mock2/page/initData",
  "pullRefresh": {
    "disabled": false,
    "pullingText": "继续下拉",
    "loosingText": "可以释放了"
  },
  "body": [
    {
      "type": "tpl",
      "tpl": "当前时间是：${date}"
    }
  ]
}
```

## CSS 变量

通过设置 CSS 变量几乎可以修改 amis 中任意组件的展现，具体细节请参考[样式](../../../style)。

```schema
{
  "type": "page",
  "cssVars": {
    "--text-color": "#108cee"
  },
  "body": {
    "type": "form",
    "body": [
      {
        "type": "input-text",
        "label": "文本框",
        "name": "text"
      }
    ]
  }
}
```

## 自定义 CSS

> 1.3.0 及以上版本

虽然 amis 提供了很多内置样式，但想要更精细控制样式，最好的方式依然是编写自定义 CSS，在之前的版本中需要外部页面配合，从 1.3.0 开始 amis 可以直接在配置中支持自定义 CSS

```schema
{
  "type": "page",
  "css": {
    ".myClass": {
      "color": "blue"
    }
  },
  "body": {
    "type": "tpl",
    "tpl": "文本",
    "className": "myClass"
  }
}
```

上面的配置会自动创建一个 `<style>` 标签，其中内容就是：

```css
.myClass {
  color: blue;
}
```

配置写法和编写普通 css 的体验是一致的，可以使用任意 css 选择符及属性。

## aside 可调整宽度

通过配置 `asideResizor`，可以让侧边栏支持动态调整宽度，同时可以通过 `asideMinWidth`、`asideMaxWidth` 设置 aside 最大最小宽度。

```schema
{
  "type": "page",
  "asideResizor": true,
  "asideMinWidth": 150,
  "asideMaxWidth": 400,
  "aside": [
    {
      "type": "tpl",
      "tpl": "这是侧边栏部分"
    }
  ],
  "body": [
    {
      "type": "tpl",
      "tpl": "这是内容区"
    }
  ]
}
```

## aside 位置固定

通过配置 `asideSticky` 来开关，默认是开启状态。

## 属性表

| 属性名              | 类型                                      | 默认值                                     | 说明                                                                                  |
| ------------------- | ----------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| type                | `string`                                  | `"page"`                                   | 指定为 Page 组件                                                                      |
| title               | [SchemaNode](../../docs/types/schemanode) |                                            | 页面标题                                                                              |
| subTitle            | [SchemaNode](../../docs/types/schemanode) |                                            | 页面副标题                                                                            |
| remark              | [Remark](./remark)                        |                                            | 标题附近会出现一个提示图标，鼠标放上去会提示该内容。                                  |
| aside               | [SchemaNode](../../docs/types/schemanode) |                                            | 往页面的边栏区域加内容                                                                |
| asideResizor        | `boolean`                                 |                                            | 页面的边栏区域宽度是否可调整                                                          |
| asideMinWidth       | `number`                                  |                                            | 页面边栏区域的最小宽度                                                                |
| asideMaxWidth       | `number`                                  |                                            | 页面边栏区域的最大宽度                                                                |
| asideSticky         | `boolean`                                 | true                                       | 用来控制边栏固定与否                                                                  |
| toolbar             | [SchemaNode](../../docs/types/schemanode) |                                            | 往页面的右上角加内容，需要注意的是，当有 title 时，该区域在右上角，没有时该区域在顶部 |
| body                | [SchemaNode](../../docs/types/schemanode) |                                            | 往页面的内容区域加内容                                                                |
| className           | `string`                                  |                                            | 外层 dom 类名                                                                         |
| cssVars             | `object`                                  |                                            | 自定义 CSS 变量，请参考[样式](../style)                                               |
| toolbarClassName    | `string`                                  | `v-middle wrapper text-right bg-light b-b` | Toolbar dom 类名                                                                      |
| bodyClassName       | `string`                                  | `wrapper`                                  | Body dom 类名                                                                         |
| asideClassName      | `string`                                  | `w page-aside-region bg-auto`              | Aside dom 类名                                                                        |
| headerClassName     | `string`                                  | `bg-light b-b wrapper`                     | Header 区域 dom 类名                                                                  |
| initApi             | [API](../../docs/types/api)               |                                            | Page 用来获取初始数据的 api。返回的数据可以整个 page 级别使用。                       |
| initFetch           | `boolean`                                 | `true`                                     | 是否起始拉取 initApi                                                                  |
| initFetchOn         | [表达式](../../docs/concepts/expression)  |                                            | 是否起始拉取 initApi, 通过表达式配置                                                  |
| interval            | `number`                                  | `3000`                                     | 刷新时间(最小 1000)                                                                   |
| silentPolling       | `boolean`                                 | `false`                                    | 配置刷新时是否显示加载动画                                                            |
| stopAutoRefreshWhen | [表达式](../../docs/concepts/expression)  | `""`                                       | 通过表达式来配置停止刷新的条件                                                        |
| pullRefresh         | `object`                                  | `{disabled: true}`                         | 下拉刷新配置（仅用于移动端）                                                          |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`event.data.xxx`事件参数变量来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称    | 事件参数                                      | 说明                                           |
| ----------- | --------------------------------------------- | ---------------------------------------------- |
| inited      | `event.data` initApi 远程请求返回的初始化数据 | 远程初始化接口请求成功时触发                   |
| pullRefresh | -                                             | 开启下拉刷新后，下拉释放后触发（仅用于移动端） |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                   | 说明                                     |
| -------- | -------------------------- | ---------------------------------------- |
| reload   | -                          | 重新加载，调用 `intiApi`，刷新数据域数据 |
| setValue | `value: object` 更新的数据 | 更新数据                                 |
