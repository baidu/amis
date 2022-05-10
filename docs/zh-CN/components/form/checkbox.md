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
            "label": "勾选框"
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
            "option": "选项说明",
            "value": true
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

| 事件名称 | 事件参数                  | 说明                   |
| -------- | ------------------------- | ---------------------- |
| change   | `value: boolean` 选中状态 | 选中状态发生变化时触发 |

## 动作表

| 动作名称 | 动作配置                                    | 说明                                                   |
| -------- | ------------------------------------------- | ------------------------------------------------------ |
| clear    | -                                           | 清空                                                   |
| reset    | -                                           | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| setValue | `value: string \|number \|boolean` 更新的值 | 更新数据                                               |
