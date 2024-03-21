---
title: Office Viewer Excel
description:
type: 0
group: ⚙ 组件
menuName: OfficeViewer Excel 渲染
icon:
order: 24
---

> 6.3 及以上版本

## 基本用法

```schema: scope="body"
{
  "type": "office-viewer",
  "src": "/examples/static/all.xlsx",
  "excelOptions": {
    "height": 500
  }
}
```

除了 `xlsx`，也支持后缀为 `csv` 及 `tsv` 的文件

## 配置项

由于接口可能有变化，这里只列出少量配置项，后续补充

```schema: scope="body"
{
  "type": "office-viewer",
  "excelOptions": {
    "showSheetTabBar": false,
    "showFormulaBar": false
  },
  "src": "/examples/static/all.xlsx"
}
```

| 属性名          | 类型      | 默认值 | 说明                     |
| --------------- | --------- | ------ | ------------------------ |
| showFormulaBar  | `boolean` | true   | 是否显示公式拦           |
| showSheetTabBar | `boolean` | true   | 是否显示底部 sheet 切换  |
| fontURL         | `object`  |        | 字体地址，参考下面的说明 |

## 字体配置

由于浏览器中缺少特定字体，将展现会不一致，这些字体都是有版权的，因此本项目中不提供，需要自行准备，然后配置 `fontURL` 映射到对应的地址，渲染时就会加载。

类似如下配置

```json
{
  "type": "office-viewer",
  "excelOptions": {
    "fontURL": {
      "等线": "/static/font/DengXian.ttf",
      "仿宋": "/static/font/STFANGSO.TTF",
      "黑体": "/static/font/simhei.ttf"
    }
  },
  "src": "/examples/static/all.xlsx"
}
```
