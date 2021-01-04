---
title: Text 输入框
description:
type: 0
group: null
menuName: Text 输入框
icon:
order: 56
---

## 基本使用

```schema:height="400" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "name": "text",
            "type": "text",
            "label": "text"
        }
    ]
}
```

## 不同类型

配置`type`可以支持不同格式的文本输入框

```schema:height="550" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "name": "text",
            "type": "text",
            "label": "text"
        },
        {
            "type": "divider"
        },
        {
            "type": "url",
            "name": "url",
            "label": "链接"
        },
        {
            "type": "divider"
        },
        {
            "type": "email",
            "name": "email",
            "label": "邮箱"
        },
        {
            "type": "divider"
        },
        {
            "type": "password",
            "name": "password",
            "label": "密码"
        }
    ]
}
```

## 附加组件

可以配置`addOn`，附带附加组件

```schema:height="400" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "name": "text",
            "type": "text",
            "label": "text",
            "addOn": {
                "type": "button",
                "label": "搜索"
            }
        }
    ]
}
```

## 选择器模式

配置`options`即可支持选择器模式。

```schema:height="400" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "name": "text",
            "type": "text",
            "label": "text",
            "options": [
                {
                    "label": "OptionA",
                    "value": "a"
                },
                {
                    "label": "OptionB",
                    "value": "b"
                },
                {
                    "label": "OptionC",
                    "value": "c"
                },
                {
                    "label": "OptionD",
                    "value": "d"
                }
            ]

        }
    ]
}
```

选择器模式下，支持部分选择器组件支持的配置项，具体请查看下面的属性表

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名       | 类型                              | 默认值    | 说明                                                                                        |
| ------------ | --------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| options      | `Array<object>`或`Array<string>`  |           | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| source       | `string`或 [API](../../types/api) |           | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| autoComplete | `string`或 [API](../../types/api) |           | [自动补全](./options#%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8-autocomplete)                     |
| multiple     | `boolean`                         |           | [是否多选](./options#%E5%A4%9A%E9%80%89-multiple)                                           |
| delimeter    | `string`                          | `,`       | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                   |
| labelField   | `string`                          | `"label"` | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField   | `string`                          | `"value"` | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| joinValues   | `boolean`                         | `true`    | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                  |
| extractValue | `boolean`                         | `false`   | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)              |
| addOn        | `addOn`                           |           | 输入框附加组件，比如附带一个提示文字，或者附带一个提交按钮。                                |
| addOn.type   | `string`                          |           | 请选择 `text` 、`button` 或者 `submit`。                                                    |
| addOn.label  | `string`                          |           | 文字说明                                                                                    |
| addOn.xxx    | `string`                          |           | 其他参数请参考按钮文档                                                                      |
| trimContents | `boolean`                         |           | 是否去除首尾空白文本。                                                                      |
| clearable    | `boolean`                         |           | 是否可清除                                                                                  |
| resetValue   | `string`                          | `""`      | 清除后设置此配置项给定的值。                                                                |
