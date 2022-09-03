---
title: InputText 输入框
description:
type: 0
group: null
menuName: InputText 输入框
icon:
order: 56
---

## 基本使用

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "text",
            "type": "input-text",
            "label": "text"
        }
    ]
}
```

## 不同边框风格

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "text-half-border",
            "type": "input-text",
            "label": "半边框",
            "borderMode": "half",
            "inputControlClassName": "bg-gray-100"
        },
        {
            "name": "text-no-border",
            "type": "input-text",
            "label": "无边框",
            "borderMode": "none",
            "nativeInputClassName": "focus:text-indigo-700"
        }
    ]
}
```

## 不同类型

配置`type`可以支持不同格式的文本输入框

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "text",
            "type": "input-text",
            "label": "text"
        },
        {
            "type": "divider"
        },
        {
            "type": "input-url",
            "name": "url",
            "label": "链接"
        },
        {
            "type": "divider"
        },
        {
            "type": "input-email",
            "name": "email",
            "label": "邮箱"
        },
        {
            "type": "divider"
        },
        {
            "type": "input-password",
            "name": "password",
            "label": "密码"
        }
    ]
}
```

## 附加组件

可以配置`addOn`，附带附加组件，比如 button，还能设置 icon。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "text",
            "type": "input-text",
            "label": "text",
            "addOn": {
                "type": "button",
                "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fsearch.svg",
                "label": "搜索"
            }
        }
    ]
}
```

## 可清除

通过 `"clearable": true` 可以设置文本可清除

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "text",
            "type": "input-text",
            "label": "text",
            "clearable": true
        }
    ]
}
```

## 选择器模式

配置`options`即可支持选择器模式。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "text",
            "type": "input-text",
            "label": "text",
            "options": [
                {
                    "label": "aa",
                    "value": "aa"
                },
                {
                    "label": "bb",
                    "value": "bb"
                },
                {
                    "label": "cc",
                    "value": "cc"
                },
                {
                    "label": "dd",
                    "value": "dd"
                }
            ]
        }
    ]
}
```

选择器模式下，支持部分选择器组件支持的配置项，具体请查看下面的属性表。如：source 和 autoComplete 都支持

## 限制只能选择预设

配置 options 并且配置 creatable: false

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "text",
            "type": "input-text",
            "label": "text",
            "creatable": false,
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

## 多选模式

配置 multiple: true

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "name": "text",
            "type": "input-text",
            "label": "text",
            "multiple": true,
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

## 前缀和后缀

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "data": {
        "unit": "MB"
    },
    "body": [
        {
            "name": "text",
            "type": "input-text",
            "label": "text",
            "prefix": "￥",
            "suffix": "RMB"
        },
        {
            "name": "prefix",
            "type": "input-text",
            "label": "text",
            "prefix": "￥"
        },
        {
            "name": "suffix",
            "type": "input-text",
            "label": "text",
            "suffix": "${unit}"
        }
    ]
}
```

支持数据映射

## 显示计数器

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "name": "a",
            "type": "input-text",
            "label": "A",
            "showCounter": true,
            "placeholder": "请输入"
        },
        {
            "name": "b",
            "type": "input-text",
            "label": "B",
            "showCounter": true,
            "maxLength": 100,
            "placeholder": "请输入"
        }
    ]
}
```

## 自动转换值

可以配置 transform，来自动转换值，支持转小写或大写。

> 注意下面第一个示例，只有输入的内容才会触发 transform，下拉框选中的值是不会处理的。

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "body": [
    {
      "name": "lower",
      "type": "input-text",
      "label": "转换小写",
      "placeholder": "输入的英文自动转为小写",
      "transform": {
        "lowerCase": true
      },
      "multiple": true,
      "options": ["APPLE", "ORANGE", "WATERMELON"],
    },
    {
      "name": "upper",
      "type": "input-text",
      "label": "转换大写",
      "placeholder": "输入的英文自动转为大写",
      "transform": {
        "upperCase": true
      }
    }
  ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名                | 类型                                      | 默认值    | 说明                                                                                        |
| --------------------- | ----------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| options               | `Array<object>`或`Array<string>`          |           | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| source                | `string`或 [API](../../../docs/types/api) |           | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| autoComplete          | `string`或 [API](../../../docs/types/api) |           | [自动补全](./options#%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8-autocomplete)                     |
| multiple              | `boolean`                                 |           | [是否多选](./options#%E5%A4%9A%E9%80%89-multiple)                                           |
| delimiter             | `string`                                  | `,`       | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                   |
| labelField            | `string`                                  | `"label"` | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField            | `string`                                  | `"value"` | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| joinValues            | `boolean`                                 | `true`    | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                  |
| extractValue          | `boolean`                                 | `false`   | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)              |
| addOn                 | `addOn`                                   |           | 输入框附加组件，比如附带一个提示文字，或者附带一个提交按钮。                                |
| addOn.type            | `string`                                  |           | 请选择 `text` 、`button` 或者 `submit`。                                                    |
| addOn.label           | `string`                                  |           | 文字说明                                                                                    |
| addOn.position        | `'left' \| 'right'`                       | `'right'` | addOn 位置                                                                                  |
| addOn.xxx             | `string`                                  |           | 其他参数请参考按钮文档                                                                      |
| trimContents          | `boolean`                                 |           | 是否去除首尾空白文本。                                                                      |
| creatable             | `boolean`                                 |           | 是否可以创建，默认为可以，除非设置为 false 即只能选择选项中的值                             |
| clearable             | `boolean`                                 |           | 是否可清除                                                                                  |
| resetValue            | `string`                                  | `""`      | 清除后设置此配置项给定的值。                                                                |
| prefix                | `string`                                  | `""`      | 前缀                                                                                        |
| suffix                | `string`                                  | `""`      | 后缀                                                                                        |
| showCounter           | `boolean`                                 |           | 是否显示计数器                                                                              |
| minLength             | `number`                                  |           | 限制最小字数                                                                                |
| maxLength             | `number`                                  |           | 限制最大字数                                                                                |
| transform             | `object`                                  |           | 自动转换值，可选 `transform: { lowerCase: true, upperCase: true }`                          |
| borderMode            | `"full"\| "half" \| "none"`               | `"full"`  | 输入框边框模式，全边框，还是半边框，或者没边框。                                            |
| inputControlClassName | `string`                                  |           | control 节点的 CSS 类名                                                                     |
| nativeInputClassName  | `string`                                  |           | 原生 input 标签的 CSS 类名                                                                  |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.0 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性。

| 事件名称 | 事件参数                  | 说明                                           |
| -------- | ------------------------- | ---------------------------------------------- |
| click    | `[name]: string` 组件的值 | 点击输入框时触发，只针对选择器模式的输入框有效 |
| enter    | `[name]: string` 组件的值 | 回车时触发，只针对选择器模式的输入框有效       |
| focus    | `[name]: string` 组件的值 | 输入框获取焦点时触发                           |
| blur     | `[name]: string` 组件的值 | 输入框失去焦点时触发                           |
| change   | `[name]: string` 组件的值 | 值变化时触发                                   |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                 | 说明                                               |
| -------- | ------------------------ | -------------------------------------------------- |
| clear    | -                        | 清空                                               |
| reset    | -                        | 重置                                               |
| focus    | -                        | 获取焦点                                           |
| reload   | -                        | 刷新（重新加载），只针对配置了`source`的输入框有效 |
| setValue | `value: string` 更新的值 | 更新数据，开启`multiple`多选时用`,`分隔            |
