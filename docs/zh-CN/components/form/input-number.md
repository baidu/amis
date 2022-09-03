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

`precision` 设置数字的显示精度，一般需要配合`step`属性使用，以实现细粒度调整。注意带有单位的输入不支持配置精度属性。

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

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.0 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性。

| 事件名称 | 事件参数                  | 说明             |
| -------- | ------------------------- | ---------------- |
| change   | `[name]: number` 组件的值 | 输入值变化时触发 |
| blur     | `[name]: number` 组件的值 | -                |
| focus    | `[name]: number` 组件的值 | -                |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                   | 说明                                                   |
| -------- | -------------------------- | ------------------------------------------------------ |
| clear    | -                          | 清空                                                   |
| reset    | -                          | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| setValue | `value: number` 更新的数值 | 更新数据                                               |
