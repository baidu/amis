---
title: Number 数字展示
description:
type: 0
group: ⚙ 组件
menuName: Number
icon:
order: 39
---

用于展示数字

## 基本使用

```schema
{
    "type": "page",
    "body": {
        "type": "number",
        "value": "1591326307",
        "kilobitSeparator": true
    }
}
```

## 配置精度

配置 `precision` 属性来控制小数点位数

```schema
{
    "type": "page",
    "body": {
        "type": "number",
        "value": 13525646.295,
        "precision": 2
    }
}
```

## 百分比展示

配置 `percent` 来开启百分比展示，这个属性同时控制小数位数，如果是 `true` 则表示小数点位数为 `0`。

```schema
{
    "type": "page",
    "body": [
      {
          "type": "number",
          "value": 0.8965,
          "percent": true
      },

      {
        type: 'divider'
      },
      {
          "type": "number",
          "value": 0.8965,
          "percent": 1
      }
    ]
}
```

## 前缀、后缀

配置 `prefix` 或者 `affix` 来控制前缀后缀，可以用来实现单位效果。

```schema
{
    "type": "page",
    "body": [
      {
          "type": "number",
          "value": 1589.98,
          "prefix": '￥'
      },

      {
        type: 'divider'
      },

      {
          "type": "number",
          "value": 1589.98,
          "affix": '公里'
      }
    ]
}
```

## inputNumber 静态展示

inputNumber 配置 `static` 为 `true` 也会通过此组件来展示

```schema
{
    "type": "page",
    "body": [
      {
          "type": "input-number",
          "mode": "horizontal",
          "label": "数字1",
          "name": "num",
          "static": true,
          "value": 1589.98,
          "precision": 2,
          "prefix": '￥'
      },

      {
          "type": "input-number",
          "mode": "horizontal",
          "label": "数字2",
          "name": "num2",
          "static": true,
          "precision": 2,
          "prefix": '￥'
      },

      {
          "type": "input-number",
          "mode": "horizontal",
          "label": "数字3",
          "name": "num3",
          "static": true,
          "placeholder": "无"
      }
    ]
}
```

## 属性表

| 属性名           | 类型                  | 默认值 | 说明                                                                                                                          |
| ---------------- | --------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| type             | `string`              |        | 如果在 Table、Card 和 List 中，为`"number"`；在 Form 中用作静态展示，为`"static-number"` 或者 `input-number` 配置 static 属性 |
| className        | `string`              |        | 外层 CSS 类名                                                                                                                 |
| value            | `string`              |        | 数值                                                                                                                          |
| name             | `string`              |        | 在其他组件中，时，用作变量映射                                                                                                |
| placeholder      | `string`              | `-`    | 占位内容                                                                                                                      |
| kilobitSeparator | `boolean`             | `true` | 是否千分位展示                                                                                                                |
| precision        | `number`              |        | 用来控制小数点位数                                                                                                            |
| percent          | `boolean` \| `number` |        | 是否用百分比展示，如果是数字，还可以控制百分比小数点位数                                                                      |
| prefix           | `string`              |        | 前缀                                                                                                                          |
| affix            | `string`              |        | 后缀                                                                                                                          |
