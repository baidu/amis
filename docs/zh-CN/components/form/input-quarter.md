---
title: InputQuarter 季度
description:
type: 0
group: null
menuName: InputQuarter 季度
icon:
order: 62
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "body": [
        {
            "type": "input-quarter",
            "name": "quarter",
            "label": "季度"
        }
    ]
}
```

更多用法和配置可以参考 [InputDate 日期](input-date)，quarter 就是 date 的特定配置，所以 date 的所有配置都能使用。
