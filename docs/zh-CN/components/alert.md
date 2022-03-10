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

`level`属性支持 4 种预设样式：`info`, `success`, `warning`, `danger`。

```schema: scope="body"
[
  {
    "type": "alert",
    "body": "提示类文案",
    "level": "info",
    "className": "mb-1"
  },
  {
    "type": "alert",
    "title": "提示类标题",
    "body": "提示类文案",
    "level": "info",
    "className": "mb-3"
  },
  {
    "type": "alert",
    "body": "成功类文案",
    "level": "success",
    "className": "mb-1"
  },
  {
    "type": "alert",
    "title": "成功类标题",
    "body": "成功类文案",
    "level": "success",
    "className": "mb-3"
  },
  {
    "type": "alert",
    "body": "警告类文案",
    "level": "warning",
    "className": "mb-1"
  },
  {
    "type": "alert",
    "title": "警告类标题",
    "body": "警告类文案",
    "level": "warning",
    "className": "mb-3"
  },
  {
    "type": "alert",
    "body": "危险类文案",
    "level": "danger",
    "className": "mb-1"
  },
  {
    "type": "alert",
    "title": "危险类标题",
    "body": "危险类文案",
    "level": "danger",
  },
]
```

## 图标

配置`"showIcon": true`后展示图标让信息更加醒目。可以通过`icon`属性自定义设置 icon 内容，如果`icon`属性为空，则根据`level`值添加默认 icon。

```schema: scope="body"
[
  {
    "type": "alert",
    "body": "提示类文案",
    "level": "info",
    "showIcon": true,
    "className": "mb-1"
  },
  {
    "type": "alert",
    "title": "提示类标题",
    "body": "提示类文案",
    "level": "info",
    "showIcon": true,
    "className": "mb-3"
  },
  {
    "type": "alert",
    "body": "成功类文案",
    "level": "success",
    "showIcon": true,
    "className": "mb-1"
  },
  {
    "type": "alert",
    "title": "成功类标题",
    "body": "成功类文案",
    "level": "success",
    "showIcon": true,
    "className": "mb-3"
  },
  {
    "type": "alert",
    "body": "警告类文案",
    "level": "warning",
    "showIcon": true,
    "className": "mb-1"
  },
  {
    "type": "alert",
    "title": "警告类标题",
    "body": "警告类文案",
    "level": "warning",
    "showIcon": true,
    "className": "mb-3"
  },
  {
    "type": "alert",
    "body": "危险类文案",
    "level": "danger",
    "showIcon": true,
    "className": "mb-1"
  },
  {
    "type": "alert",
    "title": "危险类标题",
    "body": "危险类文案",
    "level": "danger",
    "showIcon": true,
    "className": "mb-3"
  },
  {
    "type": "alert",
    "body": "自定义ICON文案",
    "showIcon": true,
    "icon": "info-circle",
    "className": "mb-1"
  },
  {
    "type": "alert",
    "title": "自定义ICON标题",
    "body": "自定义ICON文案",
    "showIcon": true,
    "icon": "fa fa-list"
  }
]
```

## level 支持表达式

> 1.6.4 及以上版本

修改下面例子的 status 值为 2 就能看到变化

```schema:
{
  "type": "page",
  "data": {
    "status": 1
  },
  "body": [
    {
      "type": "alert",
      "level": "${IFS(status===1, 'danger', status===2, 'warning')}",
      "body": "这是内容区"
    }
  ]
}
```

同时 icon 和 showIcon 也都支持表达式

## 显示关闭按钮

配置`"showCloseButton": true`实现显示关闭按钮。

```schema: scope="body"
[
  {
    "type": "alert",
    "body": "显示关闭按钮的提示",
    "level": "info",
    "showCloseButton": true,
    "showIcon": true,
    "className": "mb-2"
  },
  {
    "type": "alert",
    "title": "可关闭提示",
    "body": "显示关闭按钮的提示",
    "level": "success",
    "showCloseButton": true,
    "showIcon": true
  }
]
```

## 属性表

| 属性名               | 类型                                      | 默认值    | 说明                                                     |
| -------------------- | ----------------------------------------- | --------- | -------------------------------------------------------- |
| type                 | `string`                                  | `"alert"` | 指定为 alert 渲染器                                      |
| className            | `string`                                  |           | 外层 Dom 的类名                                          |
| level                | `string`                                  | `info`    | 级别，可以是：`info`、`success`、`warning` 或者 `danger` |
| body                 | [SchemaNode](../../docs/types/schemanode) |           | 显示内容                                                 |
| showCloseButton      | `boolean`                                 | `false`   | 是否显示关闭按钮                                         |
| closeButtonClassName | `string`                                  |           | 关闭按钮的 CSS 类名                                      |
| showIcon             | `boolean`                                 | `false`   | 是否显示 icon                                            |
| icon                 | `string`                                  |           | 自定义 icon                                              |
| iconClassName        | `string`                                  |           | icon 的 CSS 类名                                         |
