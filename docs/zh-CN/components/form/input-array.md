---
title: InputArray 数组输入框
description:
type: 0
group: null
menuName: InputArray 数组输入框
icon:
order: 3
---

InputArray 是一种简化的 [Combo](./combo)，用于输入多个某种类型的[表单项](./formitem)，提交的时将以数组的形式提交。

## 基本用法

```schema: scope="form2"
[
  {
    "name": "array",
    "label": "颜色集合",
    "type": "input-array",
    "value": ["red"],
    "inline": true,
    "items": {
      "type": "input-color",
      "clearable": false
    }
  }
]
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名        | 类型                                      | 默认值    | 说明                                                                     |
| ------------- | ----------------------------------------- | --------- | ------------------------------------------------------------------------ |
| type          | `string`                                  | `"array"` | 指明为`array`组件                                                        |
| items         | `string`或 [API](../../../docs/types/api) |           | 配置单项表单类型                                                         |
| addable       | `boolean`                                 |           | 是否可新增。                                                             |
| removable     | `boolean`                                 |           | 是否可删除                                                               |
| draggable     | `boolean`                                 | `false`   | 是否可以拖动排序, 需要注意的是当启用拖动排序的时候，会多一个\$id 字段    |
| draggableTip  | `string`                                  |           | 可拖拽的提示文字，默认为：`"可通过拖动每行中的【交换】按钮进行顺序调整"` |
| addButtonText | `string`                                  | `"新增"`  | 新增按钮文字                                                             |
| minLength     | `number`                                  |           | 限制最小长度                                                             |
| maxLength     | `number`                                  |           | 限制最大长度                                                             |
