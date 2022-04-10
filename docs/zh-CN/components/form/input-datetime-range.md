---
title: InputDatetimeRange 日期时间范围
description:
type: 0
group: null
menuName: InputDatetimeRange
icon:
order: 16
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime-range",
            "name": "select",
            "label": "日期时间范围"
        }
    ]
}
```

## 时间显示到秒

通过 `"timeFormat": "HH:mm:ss"` 设置时间输入框显示秒

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime-range",
            "name": "select",
            "timeFormat": "HH:mm:ss",
            "label": "日期时间范围"
        }
    ]
}
```

## 快捷键

`ranges`属性支持自定义日期时间范围快捷键

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-datetime-range",
            "name": "select",
            "label": "日期范围",
            "ranges": "today,yesterday,1dayago,7daysago"
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名      | 类型                      | 默认值                                                          | 说明                                                                                 |
| ----------- | ------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| format      | `string`                  | `X`                                                             | [日期时间选择器值格式](./datetime#%E5%80%BC%E6%A0%BC%E5%BC%8F)                       |
| inputFormat | `string`                  | `YYYY-DD-MM`                                                    | [日期时间选择器显示格式](./datetime#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F)            |
| placeholder | `string`                  | `"请选择日期范围"`                                              | 占位文本                                                                             |
| ranges      | `Array<string> 或 string` | `"yesterday,7daysago,prevweek,thismonth,prevmonth,prevquarter"` | 日期范围快捷键                                                                       |
| minDate     | `string`                  |                                                                 | 限制最小日期时间，用法同 [限制范围](./datetime#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4) |
| maxDate     | `string`                  |                                                                 | 限制最大日期时间，用法同 [限制范围](./datetime#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4) |
| utc         | `boolean`                 | `false`                                                         | [保存 UTC 值](./datetime#utc)                                                        |
| clearable   | `boolean`                 | `true`                                                          | 是否可清除                                                                           |

## 事件表

| 事件名称           | 事件参数                                        | 说明                  |
|-------------------|------------------------------------------------|----------------------|
| change            |  `value: string` 时间值            |  值变化                           |
| focus             | -                                 |  获得焦点(非内嵌模式)               |
| blur              | -                                 |  失去焦点(非内嵌模式)               |

## 动作表

| 动作名称           | 动作配置                 | 说明                    |
|-------------------|-------------------------|------------------------|
| clear             | -                       | 清空                    |
| reset             | -                       | 值重置                   |