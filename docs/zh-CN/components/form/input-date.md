---
title: InputDate 日期
description:
type: 0
group: null
menuName: Date
icon:
order: 13
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date",
            "name": "date",
            "label": "日期"
        }
    ]
}
```

## 显示格式

选中任意日期，可以看到默认显示日期的格式是像`2020-04-14`这样的格式，如果你想要自定义显示格式，那么可以配置`inputFormat`。

例如你想显示`2020年04月14日`这样的格式，查找 [moment 文档](https://momentjs.com/docs/#/displaying/format/) 可知配置格式应为 `YYYY年MM月DD日`，即：

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date",
            "name": "date",
            "label": "日期",
            "inputFormat": "YYYY年MM月DD日"
        }
    ]
}
```

选中任意日期，观察显示格式

## 值格式

选中任意日期，可以看到默认表单项的值格式是像`1591862818`这样的时间戳格式。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date",
            "name": "date",
            "label": "日期"
        }
    ]
}
```

如果你想要其他格式的日期值，那么可以配置`format`参数用于调整表单项的值格式。

例如你调整值为`2020-04-14`这样的格式，查找 [moment 文档](https://momentjs.com/docs/#/displaying/format/) 可知配置格式应为 `YYYY-MM-DD`，即：

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date",
            "name": "date",
            "label": "日期",
            "format": "YYYY-MM-DD"
        }
    ]
}
```

选中任意日期，观察数据域中表单项值的变化

## 默认值

可以设置`value`属性，设置日期选择器的默认值

### 基本配置

配置符合当前 [值格式](./date#%E5%80%BC%E6%A0%BC%E5%BC%8F) 的默认值。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date",
            "name": "date",
            "label": "日期",
            "value": "1591862818"
        }
    ]
}
```

### 相对值

`value` 还支持类似像`"+1days"`这样的相对值，更加便捷的配置默认值

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date",
            "name": "date",
            "label": "日期",
            "value": "+1days"
        }
    ]
}
```

上例中配置了`"value": "+1days"`，默认就会选中明天。

支持的相对值关键字有：

- `today`: 当前日期
- `day`或`days`: 天
- `week`或`weeks`: 周
- `month`或`months`: 月
- `year`或`years`: 年

### 通过公式配置默认值

> 1.7.0 及以上版本

可以通过日期公式来动态计算。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date",
            "name": "date",
            "label": "日期",
            "value": "${DATEMODIFY(NOW(), 2, 'days')}"
        }
    ]
}
```

## 限制范围

可以通过配置`maxDate`和`minDate`显示可选范围

### 固定时间值

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date",
            "name": "start",
            "label": "开始时间",
            "minDate": "1591862818",
            "description": "限制可选最小日期是 <code>2020-06-11 16:06:58</code>"
        },
        {
            "type": "input-date",
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
            "type": "input-date",
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

来一个常见例子，配置两个选择`开始时间`和`结束时间`的时间选择器，需要满足：`开始时间`不能大于`结束时间`，`结束时间`也不能小于`开始时间`。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date",
            "name": "start",
            "label": "开始日期",
            "maxDate": "$end"
        },
        {
            "type": "input-date",
            "name": "end",
            "label": "结束日期",
            "minDate": "$start"
        }
    ]
}
```

## 快捷键

你也可以配置`shortcuts`属性支持快捷选择日期
注：移动端 picker 的形式不支持快捷键

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date",
            "name": "date",
            "label": "日期",
            "shortcuts": ["yesterday" ,"today", "tomorrow"]
        }
    ]
}
```

上例中我们配置了`"shortcuts": ["yesterday" ,"today", "tomorrow"]`，选择器顶部有将会显示快捷键`昨天`，`今天`和`明天`

支持的快捷键有

- `today`: 今天
- `yesterday`: 昨天
- `thisweek`: 本周一
- `thismonth`: 本月初
- `prevmonth`: 上个月初
- `prevquarter`: 上个季节初
- `thisquarter`: 本季度初
- `tomorrow`: 明天
- `endofthisweek`: 本周日
- `endofthismonth`:本月底
- `endoflastmonth`:上月底
- `{n}daysago` : n 天前，例如：`2daysago`，下面用法相同
- `{n}dayslater`: n 天后
- `{n}weeksago`: n 周前
- `{n}weekslater`: n 周后
- `{n}monthsago`: n 月前
- `{n}monthslater`: n 月后
- `{n}quartersago`: n 季度前
- `{n}quarterslater`: n 季度后

## UTC

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-date",
            "name": "date",
            "label": "普通日期",
            "format": "YYYY-MM-DD"
        },
        {
            "type": "input-date",
            "name": "date-utc",
            "label": "UTC日期",
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
            "label": "当前值"
        },
        {
            "type": "input-date",
            "name": "date",
            "label": "日期",
            "embed": true
        }
    ]
}
```

## 原生日期组件

原生数字日期将直接使用浏览器的实现，最终展现效果和浏览器有关，而且只支持 `min`、`max`、`step` 这几个属性设置。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "native-date",
            "name": "date",
            "label": "日期"
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名        | 类型      | 默认值         | 说明                                                                                                        |
| ------------- | --------- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| value         | `string`  |                | [默认值](./date#%E9%BB%98%E8%AE%A4%E5%80%BC)                                                                |
| format        | `string`  | `X`            | 日期选择器值格式，更多格式类型请参考 [文档](https://momentjs.com/docs/#/displaying/format/)                 |
| inputFormat   | `string`  | `YYYY-DD-MM`   | 日期选择器显示格式，即时间戳格式，更多格式类型请参考 [文档](https://momentjs.com/docs/#/displaying/format/) |
| closeOnSelect | `boolean` | `false`        | 点选日期后，是否马上关闭选择框                                                                              |
| placeholder   | `string`  | `"请选择日期"` | 占位文本                                                                                                    |
| shortcuts     | `string`  |                | 日期快捷键                                                                                                  |
| minDate       | `string`  |                | 限制最小日期                                                                                                |
| maxDate       | `string`  |                | 限制最大日期                                                                                                |
| utc           | `boolean` | `false`        | 保存 utc 值                                                                                                 |
| clearable     | `boolean` | `true`         | 是否可清除                                                                                                  |
| embed         | `boolean` | `false`        | 是否内联模式                                                                                                |

## 事件表

| 事件名称 | 事件参数               | 说明                 |
| -------- | ---------------------- | -------------------- |
| change   | `value: string` 时间值 | 值变化               |
| focus    | `value: string` 时间值  | 获得焦点(非内嵌模式) |
| blur     | `value: string` 时间值  | 失去焦点(非内嵌模式) |

## 动作表

| 动作名称 | 动作配置                     | 说明                                                   |
| -------- | ---------------------------- | ------------------------------------------------------ |
| clear    | -                            | 清空                                                   |
| reset    | -                            | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| setValue | `value: string` 更新的时间值 | 更新数据，依赖格式`format`，例如：'1650556800'         |
