---
title: Table View 表格展现
description:
type: 0
group: ⚙ 组件
menuName: Table View 表格展现
icon:
order: 68
---

通过表格的方式来展现数据，可以更灵活控制展现效果。

## 基本用法

```schema: scope="body"
{
  "type": "service",
  "data": {
    "mydata": "2G"
  },
  "body": [
    {
      "type": "table-view",
      "trs": [
        {
          "background": "#F7F7F7",
          "tds": [
            {
              "body": {
                "type": "tpl",
                "tpl": "key"
              }
            },
            {
              "body": {
                "type": "tpl",
                "tpl": "value"
              }
            }
          ]
        },
        {
          "tds": [
            {
              "rowspan": 2,
              "body": {
                "type": "tpl",
                "tpl": "memory"
              }
            },
            {
              "body": {
                "type": "tpl",
                "tpl": "${mydata}"
              }
            }
          ]
        },
        {
          "tds": [
            {
              "body": {
                "type": "tpl",
                "tpl": "${mydata}"
              }
            }
          ]
        }
      ]
    }
  ]
}
```
