---
title: ChartRadios 图表单选框
description:
type: 0
group: ⚙ 组件
menuName: ChartRadios 图表单选框
icon:
order: 34
---

图表点选功能，用来做多个图表联动。

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "body": [
    {
      "type": "chart-radios",
      name: 'main',
      chartValueField: 'num',
      "options": [
        {
          "label": "A",
          "num": 100,
          value: 'a'
        },
        {
          "label": "B",
          "num": 120,
          value: 'b'
        },
        {
          "label": "C",
          "num": 30,
          value: 'c'
        },
        {
          "label": "D",
          "num": 40,
          value: 'd'
        }
      ]
    }
  ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名                 | 类型      | 默认值    | 说明 ## 二级标题           |
| ---------------------- | --------- | --------- | -------------------------- |
| config                 | `object`  |           | echart 图表配置            |
| showTooltipOnHighlight | `boolean` | `false`   | 高亮的时候是否显示 tooltip |
| chartValueField        | `string`  | `"value"` | 图表数值字段名             |
