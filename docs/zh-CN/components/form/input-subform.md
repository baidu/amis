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

## 设置按钮名称

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
        "btnLabel": "设置${title}",
        "form": {
          "title": "配置子表单",
          "body": [
            {
              "name": "title",
              "label": "标题",
              "required": true,
              "type": "input-text"
            },
            {
              "name": "b",
              "label": "其他",
              "type": "input-text"
            }
          ]
        }
      }
    ]
}
```

## 支持拖拽

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
      "btnLabel": "设置${title}",
      "draggable": true,
      "addable": false,
      "removable": false,
      "value": [
        {
          "title": "a"
        },
        {
          "title": "b"
        },
        {
          "title": "c"
        },
        {
          "title": "d"
        }
      ],
      "form": {
        "title": "配置子表单",
        "body": [
          {
            "name": "title",
            "label": "标题",
            "required": true,
            "type": "input-text"
          },
          {
            "name": "b",
            "label": "其他",
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

| 属性名             | 类型            | 默认值   | 说明                                                   |
| ------------------ | --------------- | -------- | ------------------------------------------------------ |
| multiple           | `boolean`       | `false`  | 是否为多选模式                                         |
| labelField         | `string`        |          | 当值中存在这个字段，则按钮名称将使用此字段的值来展示。 |
| btnLabel           | `string`        | `"设置"` | 按钮默认名称                                           |
| minLength          | `number`        | `0`      | 限制最小个数。                                         |
| maxLength          | `number`        | `0`      | 限制最大个数。                                         |
| draggable          | `boolean`       |          | 是否可拖拽排序                                         |
| addable            | `boolean`       |          | 是否可新增                                             |
| removable          | `boolean`       |          | 是否可删除                                             |
| addButtonClassName | `string`        | ``       | 新增按钮 CSS 类名                                      |
| itemClassName      | `string`        | ``       | 值元素 CSS 类名                                        |
| itemsClassName     | `string`        | ``       | 值包裹元素 CSS 类名                                    |
| form               | [Form](./index) |          | 子表单配置，同 [Form](./index)                         |
