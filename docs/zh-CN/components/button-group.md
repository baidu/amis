---
title: ButtonGroup 按钮组
description:
type: 0
group: ⚙ 组件
menuName: ButtonGroup
icon:
order: 30
---

## 基本用法

```schema: scope="body"
{
  "type": "button-group",
  "buttons": [
    {
      "type": "button",
      "label": "Button",
      "actionType": "dialog",
      "dialog": {
        "confirmMode": false,
        "title": "提示",
        "body": "对，你刚点击了！"
      }
    },

    {
      "type": "button",
      "actionType": "url",
      "url": "https://www.baidu.com",
      "blank": true,
      "label": "百度一下"
    },

    {
      "type": "button",
      "label": "普通按钮"
    }
  ]
}
```

## 垂直模式

配置`"vertical": true`，实现垂直模式

```schema: scope="body"
[
  {
    "type": "button-group",
    "vertical": true,
    "buttons": [
      {
        "type": "button",
        "label": "按钮1"
      },
      {
        "type": "button",
        "label": "按钮2"
      },
      {
        "type": "button",
        "label": "按钮3"
      }
    ]
  }
]
```

## 平铺模式

配置 `"tiled": true` 实现平铺模式

```schema: scope="body"
[
  {
    "type": "button-group",
    "tiled": true,
    "buttons": [
      {
        "type": "button",
        "label": "按钮1"
      },
      {
        "type": "button",
        "label": "按钮2"
      },
      {
        "type": "button",
        "label": "按钮3"
      }
    ]
  }
]
```

## 按钮主题样式

配置 `btnLevel` 统一设置按钮主题样式，注意 `buttons ` 或 `options` 中的`level`属性优先级高于`btnLevel`。配置 `btnActiveLevel` 为按钮设置激活态时的主题样式。

```schema: scope="body"
[
  {
    "type": "button-group",
    "btnLevel": "light",
    "btnActiveLevel": "warning",
    "buttons": [
      {
        "type": "button",
        "label": "按钮1"
      },
      {
        "type": "button",
        "label": "按钮2"
      },
      {
        "type": "button",
        "label": "按钮3",
        "level": "primary"
      }
    ]
  }
]
```

## 属性表

| 属性名         | 类型                                                                                                                | 默认值           | 说明                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------- | -------------------------- |
| type           | `string`                                                                                                            | `"button-group"` | 指定为 button-group 渲染器 |
| vertical       | `boolean`                                                                                                           | `false`          | 是否使用垂直模式           |
| tiled          | `boolean`                                                                                                           | `false`          | 是否使用平铺模式           |
| btnLevel       | `'link' \| 'primary' \| 'secondary' \| 'info'\|'success' \| 'warning' \| 'danger' \| 'light'\| 'dark' \| 'default'` | `"default"`      | 按钮样式                   |
| btnActiveLevel | `'link' \| 'primary' \| 'secondary' \| 'info'\|'success' \| 'warning' \| 'danger' \| 'light'\| 'dark' \| 'default'` | `"default"`      | 选中按钮样式               |
| buttons        | `Array<Action>`                                                                                                     |                  | [按钮](./action)           |
| className      | `string`                                                                                                            |                  | 外层 Dom 的类名            |
