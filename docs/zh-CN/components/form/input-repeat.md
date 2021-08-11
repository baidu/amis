---
title: InputRepeat 重复频率选择器
description:
type: 0
group: null
menuName: InputRepeat 重复频率
icon:
order: 39
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-repeat",
            "name": "repeat",
            "label": "重复频率"
        }
    ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名      | 类型     | 默认值                        | 说明                                                                     |
| ----------- | -------- | ----------------------------- | ------------------------------------------------------------------------ |
| options     | `string` | `hourly,daily,weekly,monthly` | 可用配置 `secondly,minutely,hourly,daily,weekdays,weekly,monthly,yearly` |
| placeholder | `string` | `不重复`                      | 当不指定值时的说明。                                                     |
