---
title: Tag 标签
description:
type: 0
group: ⚙ 组件
menuName: Tabs
icon:
---

用于标记和选择的标签

## 基本用法

```schema
{
    type: "page",
    body: [
        {
            "type": "tag",
            "label": "普通的标签",
            "displayMode": "rounded",
            "color": "inactive"
        },
        {
            "type": "tag",
            "label": "普通标签",
            "color": "processing"
        },
        {
            "type": "tag",
            "label": "这是一个很长长长长长长长长长长长长长的标签",
            "color": "success"
        },
        {
            "type": "tag",
            "label": "这是一个很长长长长长长长长长长长长长的标签",
            "closable": true
        }
    ]
}
```

## 不同的模式

```schema
{
    "type": "page",
    "body": [
        {
            "type": "tag",
            "label": "面性标签",
            "displayMode": "normal",
            "color": "active"
        },
        {
            "type": "tag",
            "label": "线性标签",
            "displayMode": "rounded",
            "color": "inactive"
        },
        {
            "type": "tag",
            "label": "状态标签",
            "displayMode": "status",
            "color": "active",
            "closable": true
        },
        {
            "type": "tag",
            "label": "#4096ff",
            "displayMode": "rounded",
            "color": "#4096ff"
        },
        {
            "type": "tag",
            "label": "#f70e47",
            "displayMode": "rounded",
            "color": "#f70e47"
        }
    ]
}
```

## 标签颜色

标签有几种预设的色彩样式，可以通过设置 color 属性为 active、inactive、error、success、iprocessing、warning 用作不同场景使用。如果预设值不能满足需求，可以设置为具体的色值

```schema
{
    "type": "page",
    "body": [
        {
            "type": "tag",
            "label": "active",
            "displayMode": "normal",
            "color": "active"
        },
        {
            "type": "tag",
            "label": "inactive",
            "displayMode": "normal",
            "color": "inactive"
        },
        {
            "type": "tag",
            "label": "error",
            "displayMode": "normal",
            "color": "error"
        },
        {
            "type": "tag",
            "label": "success",
            "displayMode": "normal",
            "color": "success"
        },
        {
            "type": "tag",
            "label": "processing",
            "displayMode": "normal",
            "color": "processing"
        },
        {
            "type": "tag",
            "label": "warning",
            "displayMode": "normal",
            "color": "warning"
        }
    ]
}
```

## 自定义样式

可以通过 style 来控制背景、边框及文字颜色。如下

```schema
{
    "type": "page",
    "body": [
        {
            "type": "tag",
            "label": "面性标签",
            "displayMode": "normal",
            "color": "active"
        },
        {
            "type": "tag",
            "label": "线性标签",
            "displayMode": "rounded",
            "color": "inactive"
        },
        {
            "type": "tag",
            "label": "自定义样式1",
            "displayMode": "normal",
            "style": {
                "backgroundColor": "#fff",
                "border": "1px solid #ccc",
                "color": "#666",
            }
        },
        {
            "type": "tag",
            "label": "自定义样式2",
            "displayMode": "rounded",
            "style": {
                "backgroundColor": "#2468f2",
                "borderColor": "#2468f2",
                "color": "#fff",
            }
        },
    ]
}
```

## 属性表

| 属性名      | 类型                                                                                       | 默认值     | 说明                                       |
| ----------- | ------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------ |
| displayMode | `'normal' \| 'rounded' \| 'status'`                                                        | `normal`   | 展现模式                                   |
| color       | `'active' \| 'inactive' \| 'error' \| 'success' \| 'processing' \| 'warning' \| 具体色值 ` |            | 颜色主题，提供默认主题，并支持自定义颜色值 |
| label       | `string`                                                                                   | `-`        | 标签内容                                   |
| icon        | `SchemaIcon`                                                                               | `dot 图标` | status 模式下的前置图标                    |
| className   | `string`                                                                                   |            | 自定义 CSS 样式类名                        |
| style       | `object`                                                                                   | {}         | 自定义样式（行内样式），优先级最高         |

## 事件表

> 2.6.1 及以上版本

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，详细查看[事件动作](../../docs/concepts/event-action)。

| 事件名称   | 事件参数                               | 说明           |
| ---------- | -------------------------------------- | -------------- |
| click      | `nativeEvent: MouseEvent` 鼠标事件对象 | 点击时触发     |
| mouseenter | `nativeEvent: MouseEvent` 鼠标事件对象 | 鼠标移入时触发 |
| mouseleave | `nativeEvent: MouseEvent` 鼠标事件对象 | 鼠标移出时触发 |
