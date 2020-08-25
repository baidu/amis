---
title: Date-Range 日期范围
description: 
type: 0
group: null
menuName: Date-Range
icon: 
order: 15
---
## 基本用法

```schema:height="500" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "type": "date-range",
            "name": "select",
            "label": "日期范围"
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名          | 类型      | 默认值             | 说明                                                                         |
| --------------- | --------- | ------------------ | ---------------------------------------------------------------------------- |
| format          | `string`  | `X`                | [日期选择器值格式](./date#%E5%80%BC%E6%A0%BC%E5%BC%8F)                       |
| inputFormat     | `string`  | `YYYY-DD-MM`       | [日期选择器显示格式](./date#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F)            |
| placeholder     | `string`  | `"请选择日期范围"` | 占位文本                                                                     |
| shortcuts       | `string`  |                    | [日期快捷键](./date#%E5%BF%AB%E6%8D%B7%E9%94%AE)                             |
| minDate         | `string`  |                    | 限制最小日期，用法同 [限制范围](./date#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4) |
| maxDate         | `string`  |                    | 限制最大日期，用法同 [限制范围](./date#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4) |
| utc             | `boolean` | `false`            | [保存UTC值](./date#utc)                                                                    |
| clearable       | `boolean` | `true`             | 是否可清除                                                                   |






