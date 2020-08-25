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

```schema:height="400" scope="body"
{
  "type": "form",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
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
        }
      ]
    }
  ]
}
```

更多用法，见 [Tree](./tree)




