---
title: Radios 单选框
description:
type: 0
group: null
menuName: Radios 单选框
icon:
order: 36
---

用于实现单选。

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "name": "radios",
      "type": "radios",
      "label": "radios",
      "options": [
        {
          "label": "OptionA",
          "value": "a"
        },
        {
          "label": "OptionB",
          "value": "b"
        },
        {
          "label": "OptionC",
          "value": "c"
        },
        {
          "label": "OptionD",
          "value": "d"
        }
      ]
    }
  ]
}
```

## 列显示

设置 `inline` 可以纵向显示，用于显示列很多的情况

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "name": "radios",
      "type": "radios",
      "label": "radios",
      "inline": false,
      "options": [
        {
          "label": "OptionA",
          "value": "a"
        },
        {
          "label": "OptionB",
          "value": "b"
        },
        {
          "label": "OptionC",
          "value": "c"
        },
        {
          "label": "OptionD",
          "value": "d"
        }
      ]
    }
  ]
}
```

## 控制列显示的分裂

通过 columnsCount 来设置列显示的列数，比如下面例子是两列。

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "name": "radios",
      "type": "radios",
      "label": "radios",
      "inline": false,
      "columnsCount": 2,
      "options": [
        {
          "label": "OptionA",
          "value": "a"
        },
        {
          "label": "OptionB",
          "value": "b"
        },
        {
          "label": "OptionC",
          "value": "c"
        },
        {
          "label": "OptionD",
          "value": "d"
        }
      ]
    }
  ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名       | 类型                                      | 默认值    | 说明                                                                                        |
| ------------ | ----------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| options      | `Array<object>`或`Array<string>`          |           | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| source       | `string`或 [API](../../../docs/types/api) |           | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| labelField   | `boolean`                                 | `"label"` | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField   | `boolean`                                 | `"value"` | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| columnsCount | `number`                                  | `1`       | 选项按几列显示，默认为一列                                                                  |
| inline       | `boolean`                                 | `true`    | 是否显示为一行                                                                              |
| autoFill     | `object`                                  |           | [自动填充](./options#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85-autofill)                         |

## 事件表

| 事件名称 | 事件参数                                                                                           | 说明 |
| -------- | -------------------------------------------------------------------------------------------------- | ---- |
| change    |  value: string \| Option 选中值 | 选中值发生变化时触发 |

## 动作表

| 动作名称 | 动作配置                                                                                           | 说明 |
| -------- | -------------------------------------------------------------------------------------------------- | ---- |
| clear    |  - | 清空 |
| reset    |  resetValue: boolean 重置值 | 重置 |
