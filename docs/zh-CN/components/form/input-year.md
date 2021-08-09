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
