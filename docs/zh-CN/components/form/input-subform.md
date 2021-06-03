---
title: InputSubForm 子表单
description:
type: 0
group: null
menuName: InputSubForm 子表单
icon:
order: 50
---

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "body": [
      {
        "type": "input-sub-form",
        "name": "form",
        "label": "子Form",
        "btnLabel": "设置子表单",
        "form": {
          "title": "配置子表单",
          "body": [
            {
              "name": "a",
              "label": "A",
              "type": "input-text"
            },

            {
              "name": "b",
              "label": "B",
              "type": "input-text"
            }
          ]
        }
      }
    ]
}
```

## 多选模式

可以配置`"multiple": true`，实现多选模式

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "body": [
      {
        "type": "input-sub-form",
        "name": "form2",
        "label": "多选",
        "multiple": true,
        "maxLength": 3,
        "btnLabel": "设置子表单",
        "form": {
          "title": "配置子表单",
          "body": [
            {
              "name": "a",
              "label": "A",
              "type": "input-text"
            },
            {
              "name": "b",
              "label": "B",
              "type": "input-text"
            }
          ]
        }
      }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名              | 类型            | 默认值                      | 说明                                                   |
| ------------------- | --------------- | --------------------------- | ------------------------------------------------------ |
| multiple            | `boolean`       | `false`                     | 是否为多选模式                                         |
| labelField          | `string`        |                             | 当值中存在这个字段，则按钮名称将使用此字段的值来展示。 |
| btnLabel            | `string`        | `"设置"`                    | 按钮默认名称                                           |
| minLength           | `number`        | `0`                         | 限制最小个数。                                         |
| maxLength           | `number`        | `0`                         | 限制最大个数。                                         |
| addButtonClassName  | `string`        | `btn-success btn-sm`        | 新增按钮 CSS 类名                                      |
| editButtonClassName | `string`        | `btn-info btn-addon btn-sm` | 修改按钮 CSS 类名                                      |
| form                | [Form](./index) |                             | 子表单配置，同 [Form](./index)                         |
