---
title: Definitions
description:
type: 0
group: ⚙ 组件
menuName: Definitions
icon:
order: 40
---

`Definitions`建立当前页面公共的配置项，在其他组件中可以通过`$ref`来引用当前配置项中的内容。

> 注意 definitions 只能在顶级节点中定义。

```schema
{
  "definitions": {
          "aa": {
              "type": "input-text",
              "name": "jack",
              "value": "ref value",
              "labelRemark": "通过<code>\\$ref</code>引入的组件"
          }
      },
      "type": "page",
      "title": "引用",
      "body": [
          {
              "type": "form",
              "api": "api/xxx",
              "actions": [],
              "body": [
                  {
                      "$ref": "aa"
                  }
              ]
          }
      ]
}
```

## 树形结构

`Definitions` 最大的作用其实是能够实现对数据格式的递归引用，实现无限层级编辑：

```schema
{
  "definitions": {
          "options": {
            "type": "combo",
            "multiple": true,
            "multiLine": true,
            "name": "options",
            "items": [
            {
                "type": "group",
                "body": [
                {
                    "label": "名称",
                    "name": "label",
                    "type": "input-text",
                    "required": true
                },
                {
                    "label": "值",
                    "name": "value",
                    "type": "input-text",
                    "required": true
                }
                ]
            },
            {
                "label": "包含子选项",
                "type": "switch",
                "name": "hasChildren",
                "mode": "inline",
                "className": "block"
            },
            {
                "$ref": "options",
                "label": "子选项",
                "name": "children",
                "visibleOn": "this.hasOwnProperty('hasChildren') && this.hasChildren",
                "addButtonText": "新增子选项"
            }
            ]
        }
      },
      "type": "page",
      "title": "引用",
      "body": [
          {
              "type": "form",
              "api": "api/xxx",
              "actions": [],
              "body": [
                  {
                      "$ref": "options",
                      "label": "选项"
                  },

                  {
                      "type": "static",
                      "label": "当前值",
                      "tpl": "<pre>${options|json}</pre>"
                  }
              ]
          }
      ]
}
```
