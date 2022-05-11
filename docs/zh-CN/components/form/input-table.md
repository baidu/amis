---
title: InputTable 表格
description:
type: 0
group: null
menuName: InputTable 表格
icon:
order: 54
---

## 基本用法

可以用来展示数组类型的数据。配置`columns` 数组，来定义列信息。

```schema: scope="body"
{
  "type": "page",
  "body": [
    {
      "type": "form",
      "body": [
        {
          "type": "input-table",
          "name": "table",
          "value": [
            {
              "a": 1,
              "b": 2
            },
            {
              "a": 11,
              "b": 22,
              "children": [
                {
                  "a": 111,
                  "b": 222,
                  "children": [
                    {
                      "a": 1111,
                      "b": 2222
                    }
                  ]
                }
              ]
            }
          ],
          "addable": true,
          "editable": true,
          "columns": [
            {
              "name": "a",
              "label": "A"
            },
            {
              "name": "b",
              "label": "B"
            }
          ]
        }
      ]
    }
  ]
}
```
