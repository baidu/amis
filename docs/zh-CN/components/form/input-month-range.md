---
title: InputMonthRange 月份范围
description:
type: 0
group: null
menuName: InputMonthRange
icon:
order: 15
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-month-range",
            "name": "a",
            "label": "月份范围"
        }
    ]
}
```

## 内嵌模式

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-month-range",
            "name": "a",
            "label": "月份范围",
            "embed": true
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名      | 类型      | 默认值             | 说明                                                                         |
| ----------- | --------- | ------------------ | ---------------------------------------------------------------------------- |
| format      | `string`  | `X`                | [日期选择器值格式](./date#%E5%80%BC%E6%A0%BC%E5%BC%8F)                       |
| inputFormat | `string`  | `YYYY-DD`          | [日期选择器显示格式](./date#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F)            |
| placeholder | `string`  | `"请选择月份范围"` | 占位文本                                                                     |
| minDate     | `string`  |                    | 限制最小日期，用法同 [限制范围](./date#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4) |
| maxDate     | `string`  |                    | 限制最大日期，用法同 [限制范围](./date#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4) |
| minDuration | `string`  |                    | 限制最小跨度，如： 2days                                                     |
| maxDuration | `string`  |                    | 限制最大跨度，如：1year                                                      |
| utc         | `boolean` | `false`            | [保存 UTC 值](./date#utc)                                                    |
| clearable   | `boolean` | `true`             | 是否可清除                                                                   |
| embed       | `boolean` | `false`            | 是否内联模式                                                                 |

## 事件表

| 事件名称 | 事件参数               | 说明                 |
| -------- | ---------------------- | -------------------- |
| change   | `value: string` 时间值 | 值变化               |
| focus    | -                      | 获得焦点(非内嵌模式) |
| blur     | -                      | 失去焦点(非内嵌模式) |

## 动作表

| 动作名称 | 动作配置                                    | 说明                                                     |
| -------- | ------------------------------------------- | -------------------------------------------------------- |
| clear    | -                                           | 清空                                                     |
| reset    | -                                           | 将值重置为`resetValue`，若没有配置`resetValue`，则清空   |
| setValue | `value: string` 更新的时间区间值，用`,`隔开 | 更新数据，依赖格式`format`，例如 '1646064000,1651334399' |
