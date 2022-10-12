---
title: InputTag 标签选择器
description:
type: 0
group: null
menuName: InputTag 标签选择器
icon:
order: 55
---

## 基本使用

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "type": "input-tag",
            "name": "tag",
            "label": "标签",
            "placeholder": "请选择标签",
            "options": [
                "Aaron Rodgers",
                "Tom Brady",
                "Charlse Woodson",
                "Aaron Jones"
            ]
        }
    ]
}
```

## 限制标签最大展示数量

> 1.10.0 及以上版本

`maxTagCount`可以限制标签的最大展示数量，超出数量的部分会收纳到 Popover 中，可以通过`overflowTagPopover`配置 Popover 相关的[属性](../tooltip#属性表)，注意该属性仅在多选模式开启后生效。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "type": "input-tag",
            "name": "tag",
            "label": "标签",
            "maxTagCount": 3,
            "overflowTagPopover": {
                "title": "水果"
            },
            "value": "Pineapple,Kiwifruit,Banana,Blueberry,Carambola",
            "options": [
                {"label": "苹果", "value": "Apple"},
                {"label": "香蕉", "value": "Banana"},
                {"label": "黑莓", "value": "Blackberry"},
                {"label": "蓝莓", "value": "Blueberry"},
                {"label": "樱桃", "value": "Cherry"},
                {"label": "杨桃", "value": "Carambola"},
                {"label": "椰子", "value": "Coconut"},
                {"label": "猕猴桃", "value": "Kiwifruit"},
                {"label": "柠檬", "value": "Lemon"},
                {"label": "菠萝", "value": "Pineapple"}
            ]
        }
    ]
}
```

## 批量输入

> 2.0.0 及以上版本

可以设置`"enableBatchAdd": true`开启批量输入模式，默认的分隔符为`"-"`，可以使用`"separator"`属性自定义分隔符，注意避免和`"delimiter"`属性冲突。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "type": "input-tag",
            "name": "tag",
            "label": "标签",
            "enableBatchAdd": true
        }
    ]
}
```

## 数量&文本长度限制

> 2.0.0 及以上版本

可以设置`max`限制输入的标签数量，设置`maxTagLength`限制单个标签的最大文本长度。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "type": "input-tag",
            "name": "tag",
            "label": "标签",
            "options": ["abc", "def", "xyz"],
            "enableBatchAdd": true,
            "max": 5,
            "maxTagLength": 3
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名             | 类型                                      | 默认值                                                                             | 说明                                                                                        |
| ------------------ | ----------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| options            | `Array<object>`或`Array<string>`          |                                                                                    | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| optionsTip         | `Array<object>`或`Array<string>`          | `"最近您使用的标签"`                                                               | 选项提示                                                                                    |
| source             | `string`或 [API](../../../docs/types/api) |                                                                                    | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| delimiter          | `string`                                  | `false`                                                                            | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                   |
| labelField         | `string`                                  | `"label"`                                                                          | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField         | `string`                                  | `"value"`                                                                          | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| joinValues         | `boolean`                                 | `true`                                                                             | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                  |
| extractValue       | `boolean`                                 | `false`                                                                            | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)              |
| clearable          | `boolean`                                 | `false`                                                                            | 在有值的时候是否显示一个删除图标在右侧。                                                    |
| resetValue         | `string`                                  | `""`                                                                               | 删除后设置此配置项给定的值。                                                                |
| max                | `number`                                  |                                                                                    | 允许添加的标签的最大数量                                                                    |
| maxTagLength       | `number`                                  |                                                                                    | 单个标签的最大文本长度                                                                      |
| maxTagCount        | `number`                                  |                                                                                    | 标签的最大展示数量，超出数量后以收纳浮层的方式展示，仅在多选模式开启后生效                  |
| overflowTagPopover | `TooltipObject`                           | `{"placement": "top", "trigger": "hover", "showArrow": false, "offset": [0, -10]}` | 收纳浮层的配置属性，详细配置参考[Tooltip](../tooltip#属性表)                                |
| enableBatchAdd     | `boolean`                                 | `false`                                                                            | 是否开启批量添加模式                                                                        |
| separator          | `string`                                  | `"-"`                                                                              | 开启批量添加后，输入多个标签的分隔符，支持传入多个符号，默认为"-"                           |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.2 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                                                             | 说明                 |
| -------- | -------------------------------------------------------------------- | -------------------- |
| change   | `[name]: string` 组件的值                                            | 选中值变化时触发     |
| blur     | `[name]: string` 组件的值<br/>`items: object` \| `object[]` 所有选项 | 输入框失去焦点时触发 |
| focus    | `[name]: string` 组件的值<br/>`items: object` \| `object[]` 所有选项 | 输入框获取焦点时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                 | 说明                                                    |
| -------- | ------------------------ | ------------------------------------------------------- |
| clear    | -                        | 清空                                                    |
| reset    | -                        | 将值重置为`resetValue`，若没有配置`resetValue`，则清空  |
| reload   | -                        | 重新加载，调用 `source`，刷新数据域数据刷新（重新加载） |
| setValue | `value: string` 更新的值 | 更新数据，多个值用`,`分隔                               |
