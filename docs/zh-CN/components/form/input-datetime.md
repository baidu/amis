---
title: InputDatetime 日期时间
description:
type: 0
group: null
menuName: InputDatetime
icon:
order: 14
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime",
            "name": "datetime",
            "label": "日期时间"
        }
    ]
}
```

## 显示格式

选中任意日期时间，可以看到默认显示日期的格式是像`2020-04-14 12:20:10`这样的格式，如果你想要自定义显示格式，那么可以配置`inputFormat`。

例如你想显示`2020年04月14日 12时20分10秒`这样的格式，查找 [moment 文档](https://momentjs.com/docs/#/displaying/format/) 可知配置格式应为 `YYYY年MM月DD日 HH时mm分ss秒`，即：

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime",
            "name": "datetime",
            "label": "日期时间",
            "inputFormat": "YYYY年MM月DD日 HH时mm分ss秒"
        }
    ]
}
```

选中任意日期时间，观察显示格式

## 值格式

选中任意日期时间，可以看到默认表单项的值格式是像`1591862818`这样的时间戳格式。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime",
            "name": "datetime",
            "label": "日期时间"
        }
    ]
}
```

如果你想要其他格式的日期值，那么可以配置`format`参数用于调整表单项的值格式。

例如你调整值为`2020-04-14 12:20:10`这样的格式，查找 [moment 文档](https://momentjs.com/docs/#/displaying/format/) 可知配置格式应为 `YYYY-MM-DD HH:mm:ss`，即：

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime",
            "name": "datetime",
            "label": "日期时间",
            "format": "YYYY-MM-DD HH:mm:ss"
        }
    ]
}
```

选中任意日期时间，观察数据域中表单项值的变化

## 默认值

可以设置`value`属性，设置日期选择器的默认值

### 基本配置

配置符合当前 [值格式](./datetime#%E5%80%BC%E6%A0%BC%E5%BC%8F) 的默认值。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime",
            "name": "datetime",
            "label": "日期时间",
            "value": "1591862818"
        }
    ]
}
```

### 相对值

`value` 还支持类似像`"+1hours"`这样的相对值，更加便捷的配置默认值

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime",
            "name": "datetime",
            "label": "日期",
            "value": "+1hours"
        }
    ]
}
```

上例中配置了`"value": "+1hours"`，默认就会选中一小时后的时间。

支持的相对值关键字除了 [Date](./date#%E7%9B%B8%E5%AF%B9%E5%80%BC) 中的以外，还支持：

- `now`: 当前时间
- `minute`或`minutes`或`min`或`mins`: 分钟
- `hour`或`hours`: 小时

## 限制范围

### 控制时间范围

通过 `timeConstraints` 属性可以控制时间输入范围

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime",
            "name": "datetime",
            "label": "日期时间",
            "timeConstraints": {
                "hours": {
                    "min": 12,
                    "max": 18
                },
                "minutes": {
                    "step": 15
                }
            }
        }
    ]
}
```

可以通过配置`maxDate`和`minDate`显示可选范围

### 固定时间值

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime",
            "name": "start",
            "label": "开始时间",
            "minDate": "1591862818",
            "description": "限制可选最小日期是 <code>2020-06-11 16:06:58</code>"
        },
        {
            "type": "input-datetime",
            "name": "end",
            "label": "结束时间",
            "maxDate": "1591862818",
            "description": "限制可选最大日期是 <code>2020-06-11 16:06:58</code>"
        }
    ]
}
```

### 支持相对值

范围限制也支持设置 [相对值](./date#%E7%9B%B8%E5%AF%B9%E5%80%BC)。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime",
            "name": "start",
            "label": "开始时间",
            "minDate": "-1days",
            "description": "限制可选最小日期是昨天"
        }
    ]
}
```

### 支持模板

也支持通过[模板](./template)，设置自定义值。

来一个常见例子，配置两个选择`开始时间`和`结束时间`的时间选择器，需要满足：`开始时间`不能小于`结束时间`，`结束时间`也不能大于`开始时间`。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime",
            "name": "start",
            "label": "开始时间",
            "maxDate": "$end"
        },
        {
            "type": "input-datetime",
            "name": "end",
            "label": "结束时间",
            "minDate": "$start"
        }
    ]
}
```

## 快捷键

你也可以配置`shortcuts`属性支持快捷选择日期

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime",
            "name": "datetime",
            "label": "日期",
            "shortcuts": ["yesterday" ,"today", "tomorrow"]
        }
    ]
}
```

上例中我们配置了`"shortcuts": ["yesterday" ,"today", "tomorrow"]`，选择器顶部有将会显示快捷键`昨天`，`今天`和`明天`

除了支持 的快捷键有

支持的快捷键除了 [Date](./date#%E5%BF%AB%E6%8D%B7%E9%94%AE) 中的以外，还支持：

- `now`: 现在
- `{n}hoursago` : n 小时前，例如：`2hoursago`，下面用法相同
- `{n}hourslater` : n 小时前，例如：`2hourslater`，下面用法相同

## UTC

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime",
            "name": "datetime",
            "label": "普通日期时间",
            "format": "YYYY-MM-DD"
        },
        {
            "type": "input-datetime",
            "name": "datetime-utc",
            "label": "UTC日期时间",
            "utc": true,
            "format": "YYYY-MM-DD"
        }
    ]
}
```

## 内嵌模式

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "static-date",
            "name": "date",
            "format": "LLL",
            "label": "当前值"
        },
        {
            "type": "input-datetime",
            "name": "date",
            "label": "日期时间",
            "embed": true
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名          | 类型      | 默认值                 | 说明                                                                                                            |
| --------------- | --------- | ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| value           | `string`  |                        | [默认值](./datetime#%E9%BB%98%E8%AE%A4%E5%80%BC)                                                                |
| format          | `string`  | `X`                    | 日期时间选择器值格式，更多格式类型请参考 [文档](https://momentjs.com/docs/#/displaying/format/)                 |
| inputFormat     | `string`  | `YYYY-MM-DD HH:mm:ss`  | 日期时间选择器显示格式，即时间戳格式，更多格式类型请参考 [文档](https://momentjs.com/docs/#/displaying/format/) |
| placeholder     | `string`  | `"请选择日期以及时间"` | 占位文本                                                                                                        |
| shortcuts       | `string`  |                        | 日期时间快捷键                                                                                                  |
| minDate         | `string`  |                        | 限制最小日期时间                                                                                                |
| maxDate         | `string`  |                        | 限制最大日期时间                                                                                                |
| utc             | `boolean` | `false`                | 保存 utc 值                                                                                                     |
| clearable       | `boolean` | `true`                 | 是否可清除                                                                                                      |
| embed           | `boolean` | `false`                | 是否内联                                                                                                        |
| timeConstraints | `object`  | `true`                 | 请参考 [input-time](./input-time#控制输入范围) 里的说明                                                         |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`event.data.xxx`事件参数变量来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数                          | 说明                             |
| -------- | --------------------------------- | -------------------------------- |
| change   | `event.data.value: string` 时间值 | 时间值变化时触发                 |
| focus    | `event.data.value: string` 时间值 | 输入框获取焦点(非内嵌模式)时触发 |
| blur     | `event.data.value: string` 时间值 | 输入框失去焦点(非内嵌模式)时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                     | 说明                                                   |
| -------- | ---------------------------- | ------------------------------------------------------ |
| clear    | -                            | 清空                                                   |
| reset    | -                            | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| setValue | `value: string` 更新的时间值 | 更新数据，依赖格式`format`，例如：'1650556800'         |
