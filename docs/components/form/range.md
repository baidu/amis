---
title: Range 滑块
description: 
type: 0
group: null
menuName: Range 范围
icon: 
order: 38
---
## 基本用法

```schema:height="400" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "type": "range",
            "name": "range",
            "label": "range"
        }
    ]
}
```

## 选择范围

```schema:height="400" scope="body"
{
    "type": "form",
    "debug": true,
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "type": "range",
            "name": "range",
            "label": "range",
            "multiple": true
        }
    ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名     | 类型      | 默认值  | 说明                                                                                                                        |
| ---------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------- |
| className  | `string`  |         | css 类名                                                                                                                    |
| min        | `number`  |         | 最小值                                                                                                                      |
| max        | `number`  |         | 最大值                                                                                                                      |
| step       | `number`  |         | 步长                                                                                                                        |
| multiple   | `boolean` | `false` | 支持选择范围                                                                                                                |
| joinValuse | `boolean` | `true`  | 默认为 `true`，选择的 `value` 会通过 `delimiter` 连接起来，否则直接将以`{min: 1, max: 100}`的形式提交，开启`multiple`时有效 |
| delimiter  | `string`  | `,`     | 分隔符                                                                                                                |
| unit       | `string`  |         | 单位                                                                                                                        |
| clearable  | `boolean` |         | 是否可清除                                                                                                                  |
| showInput  | `string`  |         | 是否显示输入框                                                                                                              |






