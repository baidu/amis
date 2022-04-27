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

## 前后缀、千分分隔

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
            "prefix": "$",
            "suffix": "%",
            "kilobitSeparator": true
        }
    ]
}
```

## 带单位数字

> 1.4.0 及以上版本

可以通过 `unitOptions` 设置数字的单位选项，和前面的前后缀不同，它的输出结果也将会是字符串，包含单位，默认取选项的第一个。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-number",
            "name": "number",
            "label": "数字",
            "unitOptions": ["px", "%", "em"]
        }
    ]
}
```

## 加强版输入框

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-number",
            "name": "number",
            "label": "数字",
            "displayMode": "enhance"
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

| 属性名           | 类型                                    | 默认值 | 说明                 |
| ---------------- | --------------------------------------- | ------ | -------------------- |
| min              | [模板](../../../docs/concepts/template) |        | 最小值               |
| max              | [模板](../../../docs/concepts/template) |        | 最大值               |
| step             | `number`                                |        | 步长                 |
| precision        | `number`                                |        | 精度，即小数点后几位 |
| showSteps        | `boolean`                               |        | 是否显示上下点击按钮 |
| prefix           | `string`                                |        | 前缀                 |
| suffix           | `string`                                |        | 后缀                 |
| kilobitSeparator | `boolean`                               |        | 千分分隔             |
| keyboard         | `boolean`                               |        | 键盘事件（方向上下） |
| displayMode      | `string`                                |        | 样式类型             |

## 事件表

| 事件名称 | 事件参数               | 说明                 |
| -------- | ---------------------- | -------------------- |
| change   | `value: number` 值变化 | 输入值发生变化时触发 |
| blur     | -                      | -                    |
| focus    | -                      | -                    |

## 动作表

| 动作名称 | 动作配置                   | 说明                                                   |
| -------- | -------------------------- | ------------------------------------------------------ |
| clear    | -                          | 清空                                                   |
| reset    | -                          | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| setValue | `value: number` 更新的数值 | 更新数据                                               |
