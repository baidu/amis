---
title: InputRange 滑块
description:
type: 0
group: null
menuName: InputRange 范围
icon:
order: 38
---

可以用于选择单个数值或数值范围。

## 基本用法

默认是单个数值，结果是个整数。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "name": "range",
            "label": "range"
        }
    ]
}
```

## 选择范围

对于范围的渲染，结果将是个字符串，两个数值通过分隔符来隔开。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "name": "range",
            "label": "range",
            "multiple": true
        }
    ]
}
```

## 控制调整的粒度

使用 `step` 可以控制调整粒度，默认是 1。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-range",
            "name": "range",
            "min": 0,
            "max": 1,
            "step": 0.01,
            "label": "range"
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
| delimiter  | `string`  | `,`     | 分隔符                                                                                                                      |
| unit       | `string`  |         | 单位                                                                                                                        |
| clearable  | `boolean` |         | 是否可清除                                                                                                                  |
| showInput  | `boolean` |         | 是否显示输入框                                                                                                              |
