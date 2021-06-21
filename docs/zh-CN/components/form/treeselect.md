---
title: TreeSelect 树形选择器
description:
type: 0
group: null
menuName: TreeSelect 树形选择器
icon:
order: 60
---

## 基本使用

```schema: scope="body"
{
  "type": "form",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "body": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "searchable": true,
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        },
        {
          "label": "Folder E",
          "children": [
            {
              "label": "Folder G",
              "children": [
                {
                  "label": "file H",
                  "value": 6
                },
                {
                  "label": "file I",
                  "value": 7
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

更多用法，见 [InputTree](./input-tree)
