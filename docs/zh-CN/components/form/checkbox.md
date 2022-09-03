---
title: Checkbox 勾选框
description:
type: 0
group: null
menuName: Checkbox
icon:
order: 8
---

用于实现勾选，功能和 [Switch](./switch) 类似，只是展现上不同。

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "name": "checkbox",
            "type": "checkbox",
            "label": "勾选框",
            "option": "选项说明"
        }
    ]
}
```

## 配置真假值

默认情况：

- 勾选框勾选时，表单项值为：true
- 勾选框取消勾选时，表单项值为：false

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "name": "checkbox",
            "type": "checkbox",
            "label": "勾选框",
            "option": "选项说明"
        }
    ]
}
```

如果你想调整这个值，可以配置`trueValue`和`falseValue`

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "name": "checkbox",
            "type": "checkbox",
            "label": "勾选框",
            "option": "选项说明",
            "trueValue": 1,
            "falseValue": 0
        }
    ]
}
```

勾选上例中的勾选框，观察数据域变化，会发现勾选后值为`1`，而取消勾选后为`0`

## 按钮模式

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "name": "checkbox",
            "type": "checkbox",
            "label": "勾选框",
            "trueValue": true,
            "falseValue": false,
            "optionType": "button",
            "option": "选项说明"
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名     | 类型                      | 默认值    | 说明             |
| ---------- | ------------------------- | --------- | ---------------- |
| option     | `string`                  |           | 选项说明         |
| trueValue  | `string｜number｜boolean` | `true`    | 标识真值         |
| falseValue | `string｜number｜boolean` | `false`   | 标识假值         |
| optionType | `default｜button`         | `default` | 设置 option 类型 |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.0 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性。

| 事件名称 | 事件参数                   | 说明               |
| -------- | -------------------------- | ------------------ |
| change   | `[name]: boolean` 组件的值 | 选中状态变化时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                                    | 说明                                                   |
| -------- | ------------------------------------------- | ------------------------------------------------------ |
| clear    | -                                           | 清空                                                   |
| reset    | -                                           | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| setValue | `value: string \|number \|boolean` 更新的值 | 更新数据                                               |
