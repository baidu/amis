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

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "body": [
    {
      "type": "input-formula",
      "name": "formula",
      "label": "公式",
      "variableMode": "tabs",
      "evalMode": false,
      "value": "SUM(1 + 2)",
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
  ]
}
```

## 属性表

| 属性名       | 类型                                                | 默认值 | 说明                                                                           |
| ------------ | --------------------------------------------------- | ------ | ------------------------------------------------------------------------------ |
| header       | string                                              |        | 弹出来的弹框标题                                                               |
| evalMode     | Boolean                                             | true   | 表达式模式 或者 模板模式，模板模式则需要将表达式写在 `${` 和 `}` 中间。        |
| variables    | {label: string; value: string; children?: any[];}[] | []     | 可用变量                                                                       |
| variableMode | string                                              | `list` | 可配置成 `tabs` 或者 `tree` 默认为列表，支持分组。                             |
| functions    | Object[]                                            |        | 可以不设置，默认就是 amis-formula 里面定义的函数，如果扩充了新的函数则需要指定 |
