---
title: Textarea 多行文本输入框
description:
type: 0
group: null
menuName: Textarea 多行文本输入框
icon:
order: 57
---

## 基本使用

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "textarea",
            "type": "textarea",
            "label": "多行文本"
        }
    ]
}
```

## 清空输入框

带移除图标的输入框，点击图标删除所有内容。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "textarea",
            "type": "textarea",
            "label": "多行文本",
            "clearable": true
        }
    ]
}
```

设置`resetValue`，清空输入框后重置为指定值

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "textarea",
            "type": "textarea",
            "label": "多行文本",
            "clearable": true,
            "resetValue": "reset"
        }
    ]
}
```

## 显示计数器

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "name": "a",
            "type": "textarea",
            "label": "A",
            "showCounter": true,
            "placeholder": "请输入",
            "clearable": true
        },
        {
            "name": "b",
            "type": "textarea",
            "label": "B",
            "showCounter": true,
            "maxLength": 100,
            "placeholder": "请输入"
        }
    ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名       | 类型      | 默认值  | 说明                         |
| ------------ | --------- | ------- | ---------------------------- |
| minRows      | `number`  | `3`     | 最小行数                     |
| maxRows      | `number`  | `20`    | 最大行数                     |
| trimContents | `boolean` | `true`  | 是否去除首尾空白文本         |
| readOnly     | `boolean` | `false` | 是否只读                     |
| showCounter  | `boolean` | `false` | 是否显示计数器               |
| maxLength    | `number`  | -       | 限制最大字数                 |
| clearable    | `boolean` | `false` | 是否可清除                   |
| resetValue   | `string`  | `""`    | 清除后设置此配置项给定的值。 |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.2.1 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                   | 说明                 |
| -------- | -------------------------- | -------------------- |
| change   | `[name]: string` 组件的值  | 值变化时触发         |
| focus    | `[name]: string` 组件的值  | 输入框获取焦点时触发 |
| blur     | `[name]: string ` 组件的值 | 输入框失去焦点时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                 | 说明                                                   |
| -------- | ------------------------ | ------------------------------------------------------ |
| clear    | -                        | 清空                                                   |
| reset    | -                        | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| focus    | -                        | 获取焦点                                               |
| setValue | `value: string` 更新的值 | 更新数据                                               |
