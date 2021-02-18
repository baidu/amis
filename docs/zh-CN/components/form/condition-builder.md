---
title: 组合条件
description:
type: 0
group: null
menuName: 组合条件
icon:
---

## 基本用法

用于设置复杂组合条件，支持添加条件，分组，组合方式，拖拽排序等。

```schema: scope="body"
{
    "type": "form",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
        {
          "type": "condition-builder",
          "label": "条件组件",
          "name": "conditions",
          "description": "适合让用户自己拼查询条件，然后后端根据数据生成 query where",
          "fields": [
            {
              "label": "文本",
              "type": "text",
              "name": "text"
            },
            {
              "label": "数字",
              "type": "number",
              "name": "number"
            },
            {
              "label": "布尔",
              "type": "boolean",
              "name": "boolean"
            },
            {
              "label": "选项",
              "type": "select",
              "name": "select",
              "options": [
                {
                  "label": "A",
                  "value": "a"
                },
                {
                  "label": "B",
                  "value": "b"
                },
                {
                  "label": "C",
                  "value": "c"
                },
                {
                  "label": "D",
                  "value": "d"
                },
                {
                  "label": "E",
                  "value": "e"
                }
              ]
            },
            {
              "label": "动态选项",
              "type": "select",
              "name": "select2",
              "source": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1"
            },
            {
              "label": "日期",
              "children": [
                {
                  "label": "日期",
                  "type": "date",
                  "name": "date"
                },
                {
                  "label": "时间",
                  "type": "time",
                  "name": "time"
                },
                {
                  "label": "日期时间",
                  "type": "datetime",
                  "name": "datetime"
                }
              ]
            }
          ]
        }
    ]
}
```
