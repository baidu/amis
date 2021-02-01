---
title: Panel 面板
description:
type: 0
group: ⚙ 组件
menuName: Panel
icon:
order: 59
---

可以把相关信息以面板的形式展示到一块。

## 基本用法

```schema: scope="body"
{
    "type": "panel",
    "title": "面板标题",
    "body": "面板内容"
}
```

## 底部配置按钮

可以通过配置`actions`数组，实现渲染底部按钮栏

```schema: scope="body"
{
  "type": "panel",
  "title": "面板标题",
  "body": "面板内容",
  "actions": [
    {
      "type": "button",
      "label": "按钮 1",
      "actionType": "dialog",
      "dialog": {
        "title": "提示",
        "body": "对，你刚点击了！"
      }
    },

    {
      "type": "button",
      "label": "按钮 2",
      "actionType": "dialog",
      "dialog": {
        "title": "提示",
        "body": "对，你刚点击了！"
      }
    }
  ]
}
```

## 固定底部

有时 panel 内，内容过多，导致底部操作按钮不是很方便，可以配置`"affixFooter": true`，将底部部分贴在浏览器底部展示。

```schema: scope="body"
{
  "type": "panel",
  "title": "面板标题",
  "body": "面板内容",
  "affixFooter": true,
  "actions": [
    {
      "type": "button",
      "label": "按钮 1",
      "actionType": "dialog",
      "dialog": {
        "title": "提示",
        "body": "对，你刚点击了！"
      }
    },

    {
      "type": "button",
      "label": "按钮 2",
      "actionType": "dialog",
      "dialog": {
        "title": "提示",
        "body": "对，你刚点击了！"
      }
    }
  ]
}
```

## 属性表

| 属性名           | 类型                                      | 默认值                                 | 说明                |
| ---------------- | ----------------------------------------- | -------------------------------------- | ------------------- |
| type             | `string`                                  | `"panel"`                              | 指定为 Panel 渲染器 |
| className        | `string`                                  | `"panel-default"`                      | 外层 Dom 的类名     |
| headerClassName  | `string`                                  | `"panel-heading"`                      | header 区域的类名   |
| footerClassName  | `string`                                  | `"panel-footer bg-light lter wrapper"` | footer 区域的类名   |
| actionsClassName | `string`                                  | `"panel-footer"`                       | actions 区域的类名  |
| bodyClassName    | `string`                                  | `"panel-body"`                         | body 区域的类名     |
| title            | [SchemaNode](../../docs/types/schemanode) |                                        | 标题                |
| header           | [SchemaNode](../../docs/types/schemanode) |                                        | 头部容器            |
| body             | [SchemaNode](../../docs/types/schemanode) |                                        | 内容容器            |
| footer           | [SchemaNode](../../docs/types/schemanode) |                                        | 底部容器            |
| affixFooter      | `boolean`                                 |                                        | 是否固定底部容器    |
| actions          | Array<[Action](./action)>                 |                                        | 按钮区域            |
