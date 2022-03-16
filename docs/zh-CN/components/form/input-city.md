---
title: InputCity 城市选择器
description:
type: 0
group: null
menuName: InputCity
icon:
order: 10
---

城市选择器，方便输入城市，可以理解为自动配置了国内城市选项的 Select，支持到县级别。

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "city",
            "type": "input-city",
            "label": "城市",
            "searchable": true
        }
    ]
}
```

观察数据域中表单项的值，存储的是位置邮编。

## 配置选择级别

可以通过设置 `allowDistrict` 和 `allowCity` 设置用户选择级别，例如只选择省份：

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "city",
            "type": "input-city",
            "label": "城市",
            "allowDistrict": false,
            "allowCity": false
        }
    ]
}
```

## 获取更多选项信息

表单项值默认格式是编码（即 `code`），如果你想要详细点的信息，可以把 `extractValue` 设置成 `false`。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "city",
            "type": "input-city",
            "label": "城市",
            "extractValue": false
        }
    ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名        | 类型      | 默认值  | 说明                                                                                                                  |
| ------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| allowCity     | `boolean` | `true`  | 允许选择城市                                                                                                          |
| allowDistrict | `boolean` | `true`  | 允许选择区域                                                                                                          |
| searchable    | `boolean` | `false` | 是否出搜索框                                                                                                          |
| extractValue  | `boolean` | `true`  | 默认 `true` 是否抽取值，如果设置成 `false` 值格式会变成对象，包含 `code`、`province`、`city` 和 `district` 文字信息。 |

## 事件表

| 事件名称 | 事件参数                                                                                           | 说明 |
| -------- | -------------------------------------------------------------------------------------------------- | ---- |
| change    |  value: number \| string 选中值 | 选中值发生变化时触发 |

## 动作表

| 动作名称 | 动作配置                                                                                           | 说明 |
| -------- | -------------------------------------------------------------------------------------------------- | ---- |
| clear    |  - | 清空 |
| reset    |  resetValue: boolean 重置值 | 重置 |
