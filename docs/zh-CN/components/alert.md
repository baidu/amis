---
title: Alert 提示
description:
type: 0
group: ⚙ 组件
menuName: Alert 提示
icon:
order: 27
---

用来做文字特殊提示，分为四类：提示类、成功类、警告类和危险类。

## 基本使用

```schema: scope="body"
[
  {
    "type": "alert",
    "body": "提示类提示",
    "level": "info"
  },
  {
    "type": "alert",
    "body": "成功类提示",
    "level": "success"
  },
  {
    "type": "alert",
    "body": "警告类提示",
    "level": "warning"
  },
  {
    "type": "alert",
    "body": "危险类提示",
    "level": "danger"
  }
]
```

## 显示关闭按钮

配置`"showCloseButton": true`实现显示关闭按钮。

```schema: scope="body"
[
  {
    "type": "alert",
    "body": "默认提示",
    "level": "info"
  },
  {
    "type": "alert",
    "body": "显示关闭按钮的提示",
    "level": "info",
    "showCloseButton": true
  }
]
```

## 属性表

| 属性名          | 类型                                      | 默认值    | 说明                                                     |
| --------------- | ----------------------------------------- | --------- | -------------------------------------------------------- |
| type            | `string`                                  | `"alert"` | 指定为 alert 渲染器                                      |
| className       | `string`                                  |           | 外层 Dom 的类名                                          |
| level           | `string`                                  | `info`    | 级别，可以是：`info`、`success`、`warning` 或者 `danger` |
| body            | [SchemaNode](../../docs/types/schemanode) |           | 显示内容                                                 |
| showCloseButton | `boolean`                                 | false     | 是否显示关闭按钮                                         |
