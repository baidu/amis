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
            "value": {
                "min": 10,
                "max": 50
            }
        }
    ]
}
```

## 控制调整的粒度

使用 `step` 可以控制调整粒度，默认是 1。

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

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名           | 类型                                                                                                                                      | 默认值  | 说明                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| className        | `string`                                                                                                                                  |         | css 类名                                                                                                                                 |
| value            | `number` or `string` or `{min: number, max: number}` or `[number, number]`                                                                |         |                                                                                                                                          |
| min              | `number`                                                                                                                                  | `0`     | 最小值                                                                                                                                   |
| max              | `number`                                                                                                                                  | `100`   | 最大值                                                                                                                                   |
| disabled         | `boolean`                                                                                                                                 | `false` | 是否禁用                                                                                                                                 |
| step             | `number`                                                                                                                                  | `1`     | 步长                                                                                                                                     |
| showSteps        | `boolean`                                                                                                                                 | `false` | 是否显示步长                                                                                                                             |
| parts            | `number` or `number[]`                                                                                                                    | `1`     | 分割的块数<br/>主持数组传入分块的节点                                                                                                    |
| marks            | <code>{ [number &#124; string]: ReactNode }</code> or <code>{ [number &#124; string]: { style: CSSProperties, label: ReactNode } }</code> |         | 刻度标记<br/>- 支持自定义样式<br/>- 设置百分比                                                                                           |
| tooltipVisible   | `boolean`                                                                                                                                 | `false` | 是否显示滑块标签                                                                                                                         |
| tooltipPlacement | `auto` or `bottom` or `left` or `right`                                                                                                   | `top`   | 滑块标签的位置，默认`auto`，方向自适应<br/>前置条件：tooltipVisible 不为 false 时有效                                                    |
| tipFormatter     | `function`                                                                                                                                |         | 控制滑块标签显隐函数<br/>前置条件：tooltipVisible 不为 false 时有效                                                                      |
| multiple         | `boolean`                                                                                                                                 | `false` | 支持选择范围                                                                                                                             |
| joinValues       | `boolean`                                                                                                                                 | `true`  | 默认为 `true`，选择的 `value` 会通过 `delimiter` 连接起来，否则直接将以`{min: 1, max: 100}`的形式提交<br/>前置条件：开启`multiple`时有效 |
| delimiter        | `string`                                                                                                                                  | `,`     | 分隔符                                                                                                                                   |
| unit             | `string`                                                                                                                                  |         | 单位                                                                                                                                     |
| clearable        | `boolean`                                                                                                                                 | `false` | 是否可清除<br/>前置条件：开启`showInput`时有效                                                                                           |
| showInput        | `boolean`                                                                                                                                 | `false` | 是否显示输入框                                                                                                                           |
| onChange         | `function`                                                                                                                                |         | 当 组件 的值发生改变时，会触发 onChange 事件，并把改变后的值作为参数传入                                                                 |
| onAfterChange    | `function`                                                                                                                                |         | 与 `onmouseup` 触发时机一致，把当前值作为参数传入                                                                                        |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.1 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                                                         | 说明                                              |
| -------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| change   | `[name]: number \| string \|{min: number, max: number}` 组件的值 | 当值变化时触发的事件                              |
| blur     | `[name]: number \| string \|{min: number, max: number}` 组件的值 | 当设置 showInput 为 true 时，输入框失去焦点时触发 |
| focus    | `[name]: number \| string \|{min: number, max: number}` 组件的值 | 当设置 showInput 为 true 时，输入框获取焦点时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                                                         | 说明                                                       |
| -------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| clear    | -                                                                | 清除输入框<br />前置条件：showInput 和 clearable 都为 true |
| reset    | -                                                                | 将值重置为`resetValue`，若没有配置`resetValue`，则清空     |
| setValue | `value: number \| string \| {min: number, max: number}` 更新的值 | 更新数据                                                   |
