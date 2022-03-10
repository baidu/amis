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
            "label": "可选标签",
            "color": "active",
            "checkable": true,
            "checked": true
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

## 属性表

| 属性名      | 类型                                                                                       | 默认值     | 说明                                       |
| ----------- | ------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------ |
| displayMode | `'normal' \| 'rounded' \| 'status'`                                                        | `normal`   | 展现模式                                   |
| color       | `'active' \| 'inactive' \| 'error' \| 'success' \| 'processing' \| 'warning' \| 具体色值 ` |            | 颜色主题，提供默认主题，并支持自定义颜色值 |
| label       | `string`                                                                                   | `-`        | 标签内容                                   |
| closable    | `boolean`                                                                                  | `false`    | 是否展示关闭按钮                           |
| icon        | `SchemaIcon`                                                                               | `dot 图标` | status 模式下的前置图标                    |
| closeIcon   | `SchemaIcon`                                                                               | `true`     | 关闭图标                                   |
| checkable   | `boolean`                                                                                  | `false`    | 是否是可选择的标签                         |
| checked     | `boolean`                                                                                  | `-`        | 可选标签是否被选中                         |
| disabled    | `boolean`                                                                                  | `false`    | 是否禁用                                   |
