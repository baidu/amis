---
title: Quarter 季度
description:
type: 0
group: null
menuName: Quarter 季度
icon:
order: 62
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "type": "quarter",
            "name": "quarter",
            "label": "季度"
        }
    ]
}
```

更多用法和配置可以参考 [Date 日期](date)，quarter 就是 data 的特定配置，所以 data 的所有配置都能使用。
