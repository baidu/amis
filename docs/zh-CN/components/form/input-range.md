---
title: InputRange 滑块
description:
type: 0
group: null
menuName: InputRange 范围
icon:
order: 38
---

可以用于选择单个数值或数值范围。

## 基本用法

默认是单个数值，结果是个整数。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "label": '滑块',
            "name": 'range',
            "value": 20
        }
    ]
}
```

## 选择范围

对于范围的渲染，结果将是个字符串，两个数值通过分隔符来隔开。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "name": "range",
            "label": "range",
            "multiple": true,
            "joinValues": false,
            "value": {
                "min": 10,
                "max": 50
            }
        }
    ]
}
```

## 控制调整的粒度

使用 `step` 可以控制调整粒度，默认是 1。`3.3.0`版本后支持使用变量。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "name": "range",
            "min": 0,
            "max": 1,
            "step": 0.01,
            "label": "range"
        }
    ]
}
```

## 禁用

使用`disabled`禁用滑块。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "label": '滑块',
            "name": 'range',
            "value": 10,
            "disabled": true,
            "showInput": true,
            "clearable": true
        }
    ]
}
```

## 显示步长

开启`showSteps`可显示每个`step`长度

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "label": '滑块',
            "name": 'range',
            "max": 10,
            "showSteps": true
        }
    ]
}
```

## 分割块数

通过`parts`可对整个滑动条平均分为`parts`块。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "label": '滑块',
            "name": 'range',
            "showSteps": true,
            "parts": 20
        }
    ]
}
```

## 刻度标记

通过`marks`可对刻度进行自定义。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "label": '滑块',
            "name": 'range',
            "parts": 5,
            "marks": {
                '0': '0',
                '20%': '20Mbps',
                '40%': '40Mbps',
                '60%': '60Mbps',
                '80%': '80Mbps',
                '100': '100'
            }
        }
    ]
}
```

## 输入框

通过开启`showInput`会展示输入框，输入框数据于滑块数据同步。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "name": "range",
            "label": "range",
            "value": 20,
            "showInput": true
        }
    ]
}
```

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "name": "range",
            "label": "range",
            "multiple": true,
            "value": [10, 20],
            "showInput": true
        }
    ]
}
```

## 清除输入

在打开`showInput`输入框的前提下，开启`clearable`可对数据进行清除。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "name": "range",
            "label": "range",
            "value": 20,
            "showInput": true,
            "clearable": true
        }
    ]
}
```

## 显示单位

在打开`showInput`输入框且设置了`unit`单位的前提下，开启`showInputUnit`可在 input 框中显示已配置的单位。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "name": "range",
            "label": "range",
            "value": 20,
            "unit": "个",
            "showInput": true,
            "showInputUnit": true
        }
    ]
}
```

## 显示标签

标签默认在 hover 和拖拽过程中展示，通过`tooltipVisible`或者`tipFormatter`可指定标签是否展示。标签默认展示在滑块上方，通过`tooltipPlacement`可指定标签展示的位置。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "name": "range",
            "label": "range",
            "value": 20,
            "tooltipVisible": true,
            "tooltipPlacement": "right"
        }
    ]
}
```

## 存成两个字段

默认滑块多选存储一个字段，用 `delimiter` 分割，如果配置 `extraName` 则会存两个字段。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "multiple": true,
            "name": "begin",
            "extraName": "end",
            "label": "range"
        }
    ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名           | 类型                                                                                                                                                                  | 默认值  | 说明                                                                                                                                     | 版本              |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| className        | `string`                                                                                                                                                              |         | css 类名                                                                                                                                 |
| value            | `number` or `string` or `{min: number, max: number}` or `[number, number]`                                                                                            |         |                                                                                                                                          |
| min              | `number \| string`                                                                                                                                                    | `0`     | 最小值，支持变量                                                                                                                         | `3.3.0`后支持变量 |
| max              | `number \| string`                                                                                                                                                    | `100`   | 最大， 支持变量值                                                                                                                        | `3.3.0`后支持变量 |
| disabled         | `boolean`                                                                                                                                                             | `false` | 是否禁用                                                                                                                                 |
| step             | `number \| string`                                                                                                                                                    | `1`     | 步长，支持变量                                                                                                                           | `3.3.0`后支持变量 |
| showSteps        | `boolean`                                                                                                                                                             | `false` | 是否显示步长                                                                                                                             |
| parts            | `number` or `number[]`                                                                                                                                                | `1`     | 分割的块数<br/>主持数组传入分块的节点                                                                                                    |
| marks            | <code>{ [number &#124; string]: string &#124; number &#124; SchemaObject }</code> or <code>{ [number &#124; string]: { style: CSSProperties, label: string } }</code> |         | 刻度标记<br/>- 支持自定义样式<br/>- 设置百分比                                                                                           |
| tooltipVisible   | `boolean`                                                                                                                                                             | `false` | 是否显示滑块标签                                                                                                                         |
| tooltipPlacement | `auto` or `bottom` or `left` or `right`                                                                                                                               | `top`   | 滑块标签的位置，默认`auto`，方向自适应<br/>前置条件：tooltipVisible 不为 false 时有效                                                    |
| tipFormatter     | `function`                                                                                                                                                            |         | 控制滑块标签显隐函数<br/>前置条件：tooltipVisible 不为 false 时有效                                                                      |
| multiple         | `boolean`                                                                                                                                                             | `false` | 支持选择范围                                                                                                                             |
| joinValues       | `boolean`                                                                                                                                                             | `true`  | 默认为 `true`，选择的 `value` 会通过 `delimiter` 连接起来，否则直接将以`{min: 1, max: 100}`的形式提交<br/>前置条件：开启`multiple`时有效 |
| delimiter        | `string`                                                                                                                                                              | `,`     | 分隔符                                                                                                                                   |
| unit             | `string`                                                                                                                                                              |         | 单位                                                                                                                                     |
| clearable        | `boolean`                                                                                                                                                             | `false` | 是否可清除<br/>前置条件：开启`showInput`时有效                                                                                           |
| showInput        | `boolean`                                                                                                                                                             | `false` | 是否显示输入框                                                                                                                           |
| showInputUnit    | `boolean`                                                                                                                                                             | `false` | 是否显示输入框单位<br/>前置条件：开启`showInput`且配置了`unit`单位时有效                                                                 | `6.0.0`后支持变量 |
| onChange         | `function`                                                                                                                                                            |         | 当 组件 的值发生改变时，会触发 onChange 事件，并把改变后的值作为参数传入                                                                 |
| onAfterChange    | `function`                                                                                                                                                            |         | 与 `onmouseup` 触发时机一致，把当前值作为参数传入                                                                                        |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                                                         | 说明                                              |
| -------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| change   | `[name]: number \| string \|{min: number, max: number}` 组件的值 | 当值变化时触发的事件                              |
| blur     | `[name]: number \| string \|{min: number, max: number}` 组件的值 | 当设置 showInput 为 true 时，输入框失去焦点时触发 |
| focus    | `[name]: number \| string \|{min: number, max: number}` 组件的值 | 当设置 showInput 为 true 时，输入框获取焦点时触发 |

### change

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
      {
        "type": "input-range",
        "label": "滑块",
        "name": "range",
        "value": 20,
        "onEvent": {
            "change": {
                "actions": [
                    {
                      "actionType": "toast",
                      "args": {
                          "msg": "${event.data.value|json}"
                      }
                    }
                ]
            }
        }
      }
    ]
  }
```

### blur

当设置 `showInput` 为 true 时，输入框失去焦点时触发。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
      {
        "type": "input-range",
        "label": "滑块",
        "name": "range",
        "value": 20,
        "showInput": true,
        "onEvent": {
            "blur": {
                "actions": [
                    {
                      "actionType": "toast",
                      "args": {
                          "msg": "${event.data.value|json}"
                      }
                    }
                ]
            }
        }
      }
    ]
  }
```

### focus

当设置 `showInput` 为 true 时，输入框获取焦点时触发。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
      {
        "type": "input-range",
        "label": "滑块",
        "name": "range",
        "value": 20,
        "showInput": true,
        "onEvent": {
            "focus": {
                "actions": [
                    {
                      "actionType": "toast",
                      "args": {
                          "msg": "${event.data.value|json}"
                      }
                    }
                ]
            }
        }
      }
    ]
  }
```

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                                                         | 说明                                             |
| -------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| clear    | -                                                                | 清除输入框                                       |
| reset    | -                                                                | 将值重置为初始值。6.3.0 及以下版本为`resetValue` |
| setValue | `value: number \| string \| {min: number, max: number}` 更新的值 | 更新数据                                         |

### clear

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "type": "input-range",
            "label": "滑块",
            "name": "range",
            "value": 20,
            "id": "clear_text"
        },
        {
            "type": "button",
            "label": "清空",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "clear",
                            "componentId": "clear_text"
                        }
                    ]
                }
            }
        }
    ]
}
```

### reset

如果配置了`resetValue`，则重置时使用`resetValue`的值，否则使用初始值。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "type": "input-range",
            "label": "滑块",
            "name": "range",
            "value": 20,
            "id": "reset_text"
        },
        {
            "type": "button",
            "label": "重置",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "reset",
                            "componentId": "reset_text"
                        }
                    ]
                }
            }
        }
    ]
}
```

### setValue

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "type": "input-range",
            "label": "滑块",
            "name": "range",
            "value": 20,
            "id": "setvalue_text"
        },
        {
            "type": "button",
            "label": "赋值",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "setValue",
                            "componentId": "setvalue_text",
                            "args": {
                                "value": 30
                            }
                        }
                    ]
                }
            }
        }
    ]
}
```
