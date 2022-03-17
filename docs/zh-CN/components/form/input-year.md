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

| 事件名称           | 事件参数                                        | 说明                  |
|-------------------|------------------------------------------------|----------------------|
| focus             | -                                 |  获得焦点(非内嵌模式)               |
| blur              | -                                 |  失去焦点(非内嵌模式)               |

## 动作表

| 动作名称           | 动作配置                 | 说明                    |
|-------------------|-------------------------|------------------------|
| clear             | -                       | 清空                    |
| reset             | `resetValue: Date`            | 值重置                   |
