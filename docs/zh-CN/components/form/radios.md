---
title: Radios 单选框
description:
type: 0
group: null
menuName: Radios 单选框
icon:
order: 36
---

用于实现单选。

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "name": "radios",
      "type": "radios",
      "label": "radios",
      "options": [
        {
          "label": "OptionA",
          "value": "a"
        },
        {
          "label": "OptionB",
          "value": "b"
        },
        {
          "label": "OptionC",
          "value": "c"
        },
        {
          "label": "OptionD",
          "value": "d"
        }
      ]
    }
  ]
}
```

## 列显示

设置 `inline` 可以纵向显示，用于显示列很多的情况

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "name": "radios",
      "type": "radios",
      "label": "radios",
      "inline": false,
      "options": [
        {
          "label": "OptionA",
          "value": "a"
        },
        {
          "label": "OptionB",
          "value": "b"
        },
        {
          "label": "OptionC",
          "value": "c"
        },
        {
          "label": "OptionD",
          "value": "d"
        }
      ]
    }
  ]
}
```

## 控制列显示的分裂

通过 columnsCount 来设置列显示的列数，比如下面例子是两列。

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "name": "radios",
      "type": "radios",
      "label": "radios",
      "inline": false,
      "columnsCount": 2,
      "options": [
        {
          "label": "OptionA",
          "value": "a"
        },
        {
          "label": "OptionB",
          "value": "b"
        },
        {
          "label": "OptionC",
          "value": "c"
        },
        {
          "label": "OptionD",
          "value": "d"
        }
      ]
    }
  ]
}
```

## 默认选择第一个

通过 `selectFirst` 属性配置

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "name": "radios",
      "type": "radios",
      "label": "radios",
      "selectFirst": true,
      "options": [
        {
          "label": "OptionA",
          "value": "a"
        },
        {
          "label": "OptionB",
          "value": "b"
        },
        {
          "label": "OptionC",
          "value": "c"
        },
        {
          "label": "OptionD",
          "value": "d"
        }
      ]
    }
  ]
}
```

## 动态选项

可以配置 `source` 来从上下文或远程 api 拉取选项数据

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "form",
    "data": {
      "items": [
        {
          "label": "A",
          "value": "a"
        },
        {
          "label": "B",
          "value": "b"
        },
        {
          "label": "C",
          "value": "c"
        }
      ]
    },
    "body": [
      {
        "label": "选项",
        "type": "radios",
        "name": "radios",
        "source": "${items}"
      }
    ]
  }
}
```

远程 api

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "form",
    "body": [
      {
        "label": "选项",
        "type": "radios",
        "name": "radios",
        "source": "/api/mock2/form/getOptions?waitSeconds=1"
      }
    ]
  }
}
```

api 返回内容需要包含 options 字段

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "value": "b", // 可选，如果返回就会自动选中 b 选项
    // 必须用 options 作为选项组的 key 值
    "options": [
      {
        "label": "A",
        "value": "a"
      },
      {
        "label": "B",
        "value": "b"
      },
      {
        "label": "C",
        "value": "c"
      }
    ]
  }
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名       | 类型                                      | 默认值    | 说明                                                                                        |
| ------------ | ----------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| options      | `Array<object>`或`Array<string>`          |           | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| source       | `string`或 [API](../../../docs/types/api) |           | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| labelField   | `string`                                  | `"label"` | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField   | `string`                                  | `"value"` | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| columnsCount | `number`                                  | `1`       | 选项按几列显示，默认为一列                                                                  |
| inline       | `boolean`                                 | `true`    | 是否显示为一行                                                                              |
| selectFirst  | `boolean`                                 | `false`   | 是否默认选中第一个                                                                          |
| autoFill     | `object`                                  |           | [自动填充](./options#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85-autofill)                         |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.2 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                                                             | 说明             |
| -------- | -------------------------------------------------------------------- | ---------------- |
| change   | `[name]: string` 组件的值<br/>`items: object` \| `object[]` 选项集合 | 选中值变化时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                 | 说明                                                    |
| -------- | ------------------------ | ------------------------------------------------------- |
| clear    | -                        | 清空                                                    |
| reset    | -                        | 将值重置为`resetValue`，若没有配置`resetValue`，则清空  |
| reload   | -                        | 重新加载，调用 `source`，刷新数据域数据刷新（重新加载） |
| setValue | `value: string` 更新的值 | 更新数据                                                |
