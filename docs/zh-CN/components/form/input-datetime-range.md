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

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名      | 类型                      | 默认值                                                          | 说明                                                                                                                                      |
| ----------- | ------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| format      | `string`                  | `X`                                                             | [日期时间选择器值格式](./datetime#%E5%80%BC%E6%A0%BC%E5%BC%8F)                                                                            |
| inputFormat | `string`                  | `YYYY-DD-MM`                                                    | [日期时间选择器显示格式](./datetime#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F)                                                                 |
| placeholder | `string`                  | `"请选择日期范围"`                                              | 占位文本                                                                                                                                  |
| ranges      | `Array<string> 或 string` | `"yesterday,7daysago,prevweek,thismonth,prevmonth,prevquarter"` | 日期范围快捷键，可选：today, yesterday, 1dayago, 7daysago, 30daysago, 90daysago, prevweek, thismonth, thisquarter, prevmonth, prevquarter |
| minDate     | `string`                  |                                                                 | 限制最小日期时间，用法同 [限制范围](./datetime#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4)                                                      |
| maxDate     | `string`                  |                                                                 | 限制最大日期时间，用法同 [限制范围](./datetime#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4)                                                      |
| utc         | `boolean`                 | `false`                                                         | [保存 UTC 值](./datetime#utc)                                                                                                             |
| clearable   | `boolean`                 | `true`                                                          | 是否可清除                                                                                                                                |
