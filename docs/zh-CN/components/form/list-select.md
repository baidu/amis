---
title: ListSelect 列表
description:
type: 0
group: null
menuName: ListSelect
icon:
order: 29
---

ListSelect 一般用来实现选择，可以单选也可以多选，和 Radio/Checkboxs 最大的不同是在展现方面支持带图片。

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "list-select",
      "name": "select",
      "label": "单选",
      "clearable": true,
      "options": [
        {
          "label": "Option A",
          "value": "a"
        },
        {
          "label": "Option B",
          "value": "b"
        }
      ]
    }
  ]
}
```

## 选项带图片

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
      {
        "type": "list-select",
        "name": "select",
        "label": "图片",
        "options": [
          {
            "label": "OptionA",
            "value": "a",
            "image": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
          },
          {
            "label": "OptionB",
            "value": "b",
            "image": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
          },
          {
            "label": "OptionC",
            "value": "c",
            "image": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
          },
          {
            "label": "OptionD",
            "value": "d",
            "image": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
          }
        ]
      }
    ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名        | 类型                                      | 默认值    | 说明                                                                                        |
| ------------- | ----------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| options       | `Array<object>`或`Array<string>`          |           | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| source        | `string`或 [API](../../../docs/types/api) |           | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| multiple      | `boolean`                                 | `false`   | [多选](./options#%E5%A4%9A%E9%80%89-multiple)                                               |
| labelField    | `string`                                  | `"label"` | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField    | `string`                                  | `"value"` | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| joinValues    | `boolean`                                 | `true`    | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                  |
| extractValue  | `boolean`                                 | `false`   | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)              |
| autoFill      | `object`                                  |           | [自动填充](./options#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85-autofill)                         |
| listClassName | `string`                                  |           | 支持配置 list div 的 css 类名。比如: `flex justify-between`                                 |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.2 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                  | 说明             |
| -------- | ------------------------- | ---------------- |
| change   | `[name]: string` 组件的值 | 选中值变化时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                               | 说明                                                                                    |
| -------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| clear    | -                                      | 清空                                                                                    |
| reset    | -                                      | 将值重置为`resetValue`，若没有配置`resetValue`，则清空                                  |
| reload   | -                                      | 重新加载，调用 `source`，刷新数据域数据刷新（重新加载）                                 |
| setValue | `value: string` \| `string[]` 更新的值 | 更新数据，开启`multiple`支持设置多项，开启`joinValues`时，多值用`,`分隔，否则多值用数组 |
