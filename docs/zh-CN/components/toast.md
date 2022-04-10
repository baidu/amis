---
title: Toast 轻提示
description:
type: 0
group: ⚙ 组件
menuName: Toast
icon:
order: 70
---

## 基本用法

```schema: scope="body"
[
  {
    "label": "提示",
    "type": "button",
    "actionType": "toast",
    "toast": {
      "items": [
        {body: '轻提示内容'}
      ]
    }
  },
  {
    "label": "提示2",
    "type": "button",
    "actionType": "toast",
    "toast": {
      "items": [
        {body: '轻提示内容2'}
      ]
    }
  },
]
```

## 设置位置

```schema: scope="body"
{
    "label": "提示",
    "type": "button",
    "actionType": "toast",
    "toast": {
      "position": "bottom-center",
      "items": [
        {body: '轻提示内容2'}
      ]
    }
}
```

## 不展示关闭按钮

```schema: scope="body"
{
    "label": "提示",
    "type": "button",
    "actionType": "toast",
    "toast": {
      "closeButton": false,
      "items": [
        {body: '轻提示内容'}
      ]
    }
}
```

## 关闭图标展示

```schema: scope="body"
{
    "label": "提示",
    "type": "button",
    "actionType": "toast",
    "toast": {
      "showIcon": false,
      "items": [
        {body: '轻提示内容'}
      ]
    }
}
```

## 持续时间设置

```schema: scope="body"
{
    "label": "提示",
    "type": "button",
    "actionType": "toast",
    "toast": {
      "timeout": 1000,
      "items": [
        {body: '轻提示内容'}
      ]
    }
}
```

## 带标题的提示

```schema: scope="body"
{
    "label": "提示",
    "type": "button",
    "actionType": "toast",
    "toast": {
      "items": [
        {title: '标题', body: '轻提示内容'}
      ]
    }
}
```

## 提示单独设置不同的类型

```schema: scope="body"
{
    "label": "提示",
    "type": "button",
    "actionType": "toast",
    "toast": {
      "items": [
        {body: '普通消息提示', level: 'info'},
        {body: '成功消息提示', level: 'success'},
        {body: '错误消息提示', level: 'error'},
        {body: '警告消息提示', level: 'warning'}
      ]
    }
}
```

## 提示单独设置不同的位置

```schema: scope="body"
{
    "label": "提示",
    "type": "button",
    "actionType": "toast",
    "toast": {
      "items": [
        {body: '左上方提示', position: 'top-left'},
        {body: '上方提示', position: 'top-center'},
        {body: '右上方提示', position: 'top-right'},
        {body: '中间提示', position: 'center'},
        {body: '左下方提示', position: 'bottom-left'},
        {body: '下方提示', position: 'bottom-center'},
        {body: '右上下方提示', position: 'bottom-right'}
      ]
    }
}
```

## 提示单独设置是否展示关闭按钮

```schema: scope="body"
{
    "label": "提示",
    "type": "button",
    "actionType": "toast",
    "toast": {
      "items": [
        {body: '展示关闭按钮', closeButton: true},
        {body: '不展示关闭按钮', closeButton: false}
      ]
    }
}
```

## 提示单独设置不同的持续时间

```schema: scope="body"
{
    "label": "提示",
    "type": "button",
    "actionType": "toast",
    "toast": {
      "items": [
        {body: '持续1秒', timeout: 1000},
        {body: '持续3秒', timeout: 3000}
      ]
    }
}
```

## 属性表

| 属性名        | 类型                   | 默认值     | 说明                                 |
| ------------ | --------------------- | --------- | ----------------------------------- |
| actionType   | `string`              | `"toast"` | 指定为 toast 轻提示组件                |
| items        | `Array<ToastItem>`    | `[]`      | 轻提示内容                            |
| position     | `string`              | `top-center（移动端为center）`    | 提示显示位置，可用'top-right'、'top-center'、'top-left'、'bottom-center'、'bottom-left'、'bottom-right'、'center'         |
| closeButton  | `boolean`            | `false`    | 是否展示关闭按钮，移动端不展示            |
| showIcon     | `boolean`            | `true`     | 是否展示图标                           |
| timeout      | `number`             | `5000（error类型为6000，移动端为3000）` | 持续时间     |

## ToastItem属性表
| 属性名        | 类型                     | 默认值     | 说明                                |
| ------------ | ----------------------- | --------- | ---------------------------------- |
| title        | `string \| SchemaNode`  |           | 标题                                |
| body         | `string \| SchemaNode`  |           | 内容                                |
| level        | `string`                | `info`    | 展示图标，可选'info'、'success'、'error'、'warning' |
| position     | `string`                | `top-center（移动端为center）`    | 提示显示位置，可用'top-right'、'top-center'、'top-left'、'bottom-center'、'bottom-left'、'bottom-right'、'center'          |
| closeButton  | `boolean`               | `false`   | 是否展示关闭按钮                      |
| showIcon     | `boolean`               | `true`    | 是否展示图标                         |
| timeout      | `number`                | `5000（error类型为6000，移动端为3000）` | 持续时间  |
