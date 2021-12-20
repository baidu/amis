---
title: InputFormula 公式编辑器
description:
type: 0
group: null
menuName: InputFormula
icon:
order: 21
---

## 基本用法

用来输入公式。还是 beta 版本，整体待优化。

```schema: scope="formitem"
{
  "type": "input-formula",
  "name": "formula",
  "label": "公式",
  "variableMode": "tabs",
  "variables": [
  {
    "label": "表单字段",
    "children": [
      {
        "label": "ID",
        "value": "id"
      },
      {
        "label": "ID2",
        "value": "id2"
      }
    ]
  },
  {
    "label": "流程字段",
    "children": [
      {
        "label": "ID",
        "value": "id"
      },
      {
        "label": "ID2",
        "value": "id2"
      }
    ]
  }
],
}
```

## 属性表
