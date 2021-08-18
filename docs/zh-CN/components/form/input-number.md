---
title: InputNumber 数字输入框
description:
type: 0
group: null
menuName: InputNumber
icon:
order: 32
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-number",
            "name": "number",
            "label": "数字"
        }
    ]
}
```

## 格式化展示

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-number",
            "name": "number",
            "label": "数字",
            "value": 111111,
            "formatter": "value => `${value}%`.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')",
            "parser": "value => value.replace(/,|%/g, '')"
        }
    ]
}
```

## 原生数字组件

原生数字组件将直接使用浏览器的实现，最终展现效果和浏览器有关，而且只支持 `min`、`max`、`step` 这几个属性设置。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "native-number",
            "name": "number",
            "label": "数字"
        }
    ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名    | 类型                                    | 默认值 | 说明                 |
| --------- | --------------------------------------- | ------ | -------------------- |
| min       | [模板](../../../docs/concepts/template) |        | 最小值               |
| max       | [模板](../../../docs/concepts/template) |        | 最大值               |
| step      | `number`                                |        | 步长                 |
| precision | `number`                                |        | 精度，即小数点后几位 |
| showSteps | `boolean`                               |        | 是否显示上下点击按钮 |
| formatter | `string` like `function(value: number \| string): string` |       | 指定输入框展示值的格式 |
| parser    | `string` like `function(string): number`             |        | 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用 |
