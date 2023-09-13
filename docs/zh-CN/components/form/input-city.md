---
title: InputCity 城市选择器
description:
type: 0
group: null
menuName: InputCity
icon:
order: 10
---

城市选择器，方便输入城市，可以理解为自动配置了国内城市选项的 Select，支持到县级别。

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "city",
            "type": "input-city",
            "label": "城市",
            "searchable": true
        }
    ]
}
```

观察数据域中表单项的值，存储的是位置邮编。

## 配置选择级别

可以通过设置 `allowDistrict` 和 `allowCity` 设置用户选择级别，例如只选择省份：

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "city",
            "type": "input-city",
            "label": "城市",
            "allowDistrict": false,
            "allowCity": false
        }
    ]
}
```

## 获取更多选项信息

表单项值默认格式是编码（即 `code`），如果你想要详细点的信息，可以把 `extractValue` 设置成 `false`。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "city",
            "type": "input-city",
            "label": "城市",
            "extractValue": false
        }
    ]
}
```

## 配置下拉框样式

可以通过 `itemClassName` 指定下拉框样式，如配置最小宽度

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "city",
            "type": "input-city",
            "label": "城市",
            "itemClassName": "min-w-xs",
            "searchable": true
        }
    ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名        | 类型      | 默认值  | 说明                                                                                                                  |
| ------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| allowCity     | `boolean` | `true`  | 允许选择城市                                                                                                          |
| allowDistrict | `boolean` | `true`  | 允许选择区域                                                                                                          |
| searchable    | `boolean` | `false` | 是否出搜索框                                                                                                          |
| extractValue  | `boolean` | `true`  | 默认 `true` 是否抽取值，如果设置成 `false` 值格式会变成对象，包含 `code`、`province`、`city` 和 `district` 文字信息。 |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                            | 说明             |
| -------- | ----------------------------------- | ---------------- |
| change   | `[name]: number \| string` 组件的值 | 选中值变化时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                           | 说明                                                   |
| -------- | ---------------------------------- | ------------------------------------------------------ |
| clear    | -                                  | 清空                                                   |
| reset    | -                                  | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| setValue | `value: string \| number` 更新的值 | 更新数据                                               |
