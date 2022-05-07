---
title: Year 年份选择
description:
type: 0
group: null
menuName: Year 年份选择
icon:
order: 61
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-year",
            "name": "year",
            "label": "年份选择"
        }
    ]
}
```

更多用法和配置可以参考 [InputDate 日期](input-date)，year 就是 data 的特定配置，所以 data 的所有配置都能使用。

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
| setValue | `value: string` 更新的时间值 | 更新数据，依赖格式`format`，例如：'1617206400'         |
