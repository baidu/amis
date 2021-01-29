---
title: Page 页面
description:
type: 0
group: ⚙ 组件
menuName: Page 页面
icon:
order: 23
---

Page 组件是 amis 页面 JSON 配置中，**唯一的** 顶级容器组件，是整个页面配置的入口组件。

## 基本用法

我们这里在内容区中简单渲染一段文字。

```schema
{
  "type": "page",
  "body": "Hello World!"
}
```

## 渲染组件

内容区同样可以渲染各种组件，这里我们渲染一个表单。

```schema: scope="body"
{
    "type": "form",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
      {
        "type": "text",
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
  "initApi": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData",
  "body": [
    {
      "type": "tpl",
      "tpl": "当前时间是：${date}"
    }
  ]
}
```

具体 API 规范查看 [API 文档](../types/api)。

## 轮询初始化接口

想要在页面渲染后，轮询请求初始化接口，步骤如下：

1. 配置 initApi；
2. 配置 interval：单位为毫秒，最小 1000。

```schema
{
  "type": "page",
  "initApi": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData",
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
  "initApi": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData",
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
    "controls": [
      {
        "type": "text",
        "label": "文本框",
        "name": "text"
      }
    ]
  }
}
```

## 属性表

| 属性名              | 类型                              | 默认值                                     | 说明                                                                                  |
| ------------------- | --------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------- |
| type                | `string`                          | `"page"`                                   | 指定为 Page 组件                                                                      |
| title               | [SchemaNode](../types/schemanode) |                                            | 页面标题                                                                              |
| subTitle            | [SchemaNode](../types/schemanode) |                                            | 页面副标题                                                                            |
| remark              | [Remark](./remark)                |                                            | 标题附近会出现一个提示图标，鼠标放上去会提示该内容。                                  |
| aside               | [SchemaNode](../types/schemanode) |                                            | 往页面的边栏区域加内容                                                                |
| toolbar             | [SchemaNode](../types/schemanode) |                                            | 往页面的右上角加内容，需要注意的是，当有 title 时，该区域在右上角，没有时该区域在顶部 |
| body                | [SchemaNode](../types/schemanode) |                                            | 往页面的内容区域加内容                                                                |
| className           | `string`                          |                                            | 外层 dom 类名                                                                         |
| cssVars             | `object`                          |                                            | 自定义 CSS 变量，请参考[样式](../../../style)                                         |
| toolbarClassName    | `string`                          | `v-middle wrapper text-right bg-light b-b` | Toolbar dom 类名                                                                      |
| bodyClassName       | `string`                          | `wrapper`                                  | Body dom 类名                                                                         |
| asideClassName      | `string`                          | `w page-aside-region bg-auto`              | Aside dom 类名                                                                        |
| headerClassName     | `string`                          | `bg-light b-b wrapper`                     | Header 区域 dom 类名                                                                  |
| initApi             | [API](../types/api)               |                                            | Page 用来获取初始数据的 api。返回的数据可以整个 page 级别使用。                       |
| initFetch           | `boolean`                         | `true`                                     | 是否起始拉取 initApi                                                                  |
| initFetchOn         | [表达式](../concepts/expression)  |                                            | 是否起始拉取 initApi, 通过表达式配置                                                  |
| interval            | `number`                          | `3000`                                     | 刷新时间(最小 1000)                                                                   |
| silentPolling       | `boolean`                         | `false`                                    | 配置刷新时是否显示加载动画                                                            |
| stopAutoRefreshWhen | [表达式](../concepts/expression)  | `""`                                       | 通过表达式来配置停止刷新的条件                                                        |
