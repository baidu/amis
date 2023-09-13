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

## 设置精度

`precision` 设置数字的显示精度，一般需要配合 `step` 属性使用，以实现细粒度调整。注意带有单位的输入不支持配置精度属性。若设置了 `step` 值，则会基于 `step` 和 `precision` 的值，选择更高的精度。若输入的内容不满足精度要求，组件会按照精度自动处理，遵循四舍五入规则。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "data": {
        "number2": 3.1234
    },
    "body": [
        {
            "type": "input-number",
            "name": "number1",
            "label": "数字",
            "precision": 2,
            "step": 0.01,
            "value": 2.98786
        },
        {
            "type": "input-number",
            "name": "number2",
            "label": "数字2",
            "precision": 3,
            "step": 0.001
        },
        {
            "type": "input-number",
            "name": "number3",
            "label": "数字3",
            "step": 0.001,
            "description": "不设置precision，仅设置step, 实际精度为3"
        }
    ]
}
```

## 重置值

清空/重置组件输入后，组件绑定的值将被设置为 `resetValue`，默认为 `""`。若 `resetValue` 为合法数字时，会根据 `min`、`max` 和 `precision` 属性，将组件值设置为满足条件的值。若 `resetValue` 为非数字，则组件清空/重置后设置为该值。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-number",
            "name": "number1",
            "label": "数字resetValue为0",
            "resetValue": 0,
            "value": 1234
        },
        {
            "type": "input-number",
            "name": "number2",
            "label": "数字带有min",
            "min": 100,
            "resetValue": 0,
            "value": 1234,
            "description": "清空输入后组件值变为100，因为设置了最小值min为100"
        },
        {
            "type": "input-number",
            "name": "number3",
            "label": "数字带有max和precision",
            "max": 100.5,
            "precision": 2,
            "resetValue": 1000,
            "value": 1234,
            "description": "清空输入后组件值变为100.5，因为设置了最大值max为100.5"
        },
        {
            "type": "input-number",
            "name": "number4",
            "label": "数字未设置resetValue",
            "resetValue": "string",
            "value": 1234,
            "description": "清空输入后组件值变为\"string\"，因为resetValue不是一个合法的数字"
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

## 是否是大数

> 2.3.0 及以上版本

默认情况下使用 JavaScript 原生数字类型，但如果要支持输入超过 JavaScript 支持范围的整数或浮点数，可以通过 `"big": true` 开启大数支持，开启之后输入输出都将是字符串。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-number",
            "name": "number",
            "label": "数字",
            "big": true
        }
    ]
}
```

## 内容清空时删除字段

> 2.8.0 及以上版本

如果设置了 `"clearValueOnEmpty": true`，当输入框的值清空时，会从数据域中删除该表单项对应的值。比较常见的用法是在 `combo`、`input-array` 等组件中避免 `input-number` 清空后提交空字符串。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "debugConfig": {
        "levelExpand": 2
    },
    "body": [
        {
            "type": "group",
            "body": [
                {
                    "name": "numberClear",
                    "type": "input-number",
                    "label": "清空",
                    "value": 123,
                    "clearValueOnEmpty": true
                },
                {
                    "name": "numberNotClear",
                    "type": "input-number",
                    "label": "不清空",
                    "value": 456
                }
            ]
        },
        {
            "type": "combo",
            "name": "user",
            "label": "用户",
            "items": [
                {
                    "name": "text",
                    "label": "名字",
                    "type": "input-text"
                },
                {
                    "name": "gender",
                    "label": "性别",
                    "type": "select",
                    "options": ["男", "女"]
                },
                {
                    "name": "age",
                    "label": "年龄",
                    "type": "input-number",
                    "clearValueOnEmpty": true
                }
            ]
        }
    ]
}
```

## 原生数字组件

原生数字组件将直接使用浏览器的实现，最终展现效果和浏览器有关，并且只支持 `min`、`max` 和 `step` 这几个属性设置。

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

| 属性名            | 类型                                    | 默认值   | 说明                                        | 版本    |
| ----------------- | --------------------------------------- | -------- | ------------------------------------------- | ------- |
| min               | [模板](../../../docs/concepts/template) |          | 最小值                                      |
| max               | [模板](../../../docs/concepts/template) |          | 最大值                                      |
| step              | `number`                                |          | 步长                                        |
| precision         | `number`                                |          | 精度，即小数点后几位，支持 0 和正整数       |
| showSteps         | `boolean`                               | `true`   | 是否显示上下点击按钮                        |
| readOnly          | `boolean`                               | `false`  | 只读                                        |
| prefix            | `string`                                |          | 前缀                                        |
| suffix            | `string`                                |          | 后缀                                        |
| unitOptions       | `string[]`                              |          | 单位选项                                    | `1.4.0` |
| kilobitSeparator  | `boolean`                               | `false`  | 千分分隔                                    |
| keyboard          | `boolean`                               | `true`   | 键盘事件（方向上下）                        |
| big               | `boolean`                               | `false`  | 是否使用大数                                | `2.3.0` |
| displayMode       | `"base" \| "enhance"`                   | `"base"` | 样式类型                                    |
| borderMode        | `"full" \| "half" \| "none"`            | `"full"` | 边框模式，全边框，还是半边框，或者没边框    |
| resetValue        | `number \| string`                      | `""`     | 清空输入内容时，组件值将设置为 `resetValue` |
| clearValueOnEmpty | `boolean`                               | `false`  | 内容为空时从数据域中删除该表单项对应的值    | `2.8.0` |

## 事件表

当前组件会对外派发以下事件，可以通过 `onEvent` 来监听这些事件，并通过 `actions` 来配置执行的动作，在 `actions` 中可以通过 `${事件参数名}` 或 `${event.data.[事件参数名]}` 来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]` 表示当前组件绑定的名称，即 `name` 属性，如果没有配置 `name` 属性，则通过 `value` 取值。

| 事件名称 | 事件参数                  | 说明             |
| -------- | ------------------------- | ---------------- |
| change   | `[name]: number` 组件的值 | 输入值变化时触发 |
| blur     | `[name]: number` 组件的值 | -                |
| focus    | `[name]: number` 组件的值 | -                |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定 `actionType: 动作名称`、`componentId: 该组件id` 来触发这些动作，动作配置可以通过 `args: {动作配置项名称: xxx}` 来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                   | 说明                                                     |
| -------- | -------------------------- | -------------------------------------------------------- |
| clear    | -                          | 清空                                                     |
| reset    | -                          | 将值重置为 `resetValue`，若没有配置 `resetValue`，则清空 |
| setValue | `value: number` 更新的数值 | 更新数据                                                 |
