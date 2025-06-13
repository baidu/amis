---
title: InputTag 标签选择器
description:
type: 0
group: null
menuName: InputTag 标签选择器
icon:
order: 55
---

## 基本使用

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "type": "input-tag",
            "name": "tag",
            "label": "标签",
            "placeholder": "请选择标签",
            "options": [
                "Aaron Rodgers",
                "Tom Brady",
                "Charlse Woodson",
                "Aaron Jones"
            ]
        }
    ]
}
```

## 限制标签最大展示数量

> 1.10.0 及以上版本

`maxTagCount`可以限制标签的最大展示数量，超出数量的部分会收纳到 Popover 中，可以通过`overflowTagPopover`配置 Popover 相关的[属性](../tooltip#属性表)，注意该属性仅在多选模式开启后生效。

> 6.13.0 版本开始，可摆放个数会根据所剩空间尽可能多的摆放，但是摆放个数不会超出设定的值，所以可以将这个值稍微设置大点。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "type": "input-tag",
            "name": "tag",
            "label": "标签",
            "maxTagCount": 100,
            "overflowTagPopover": {
                "title": "水果"
            },
            "value": "Pineapple,Kiwifruit,Banana,Blueberry,Carambola,Coconut,Lemon,Grape,Pomegranate,Mango,Papaya,Mangosteen,Durian,Longan,Litchi,Loquat,Persimmon,Pomelo,Orange,Tangerine,Kumquat,Plum,Apricot,Peach,Pear,Apple,Strawberry",
            "options": [
                {"label": "苹果", "value": "Apple"},
                {"label": "香蕉", "value": "Banana"},
                {"label": "黑莓", "value": "Blackberry"},
                {"label": "蓝莓", "value": "Blueberry"},
                {"label": "樱桃", "value": "Cherry"},
                {"label": "杨桃", "value": "Carambola"},
                {"label": "椰子", "value": "Coconut"},
                {"label": "猕猴桃", "value": "Kiwifruit"},
                {"label": "柠檬", "value": "Lemon"},
                {"label": "菠萝", "value": "Pineapple"},
                {"label": "葡萄", "value": "Grape"},
                {"label": "石榴", "value": "Pomegranate"},
                {"label": "芒果", "value": "Mango"},
                {"label": "木瓜", "value": "Papaya"},
                {"label": "山竹", "value": "Mangosteen"},
                {"label": "榴莲", "value": "Durian"},
                {"label": "龙眼", "value": "Longan"},
                {"label": "荔枝", "value": "Litchi"},
                {"label": "枇杷", "value": "Loquat"},
                {"label": "柿子", "value": "Persimmon"},
                {"label": "柚子", "value": "Pomelo"},
                {"label": "橙子", "value": "Orange"},
                {"label": "橘子", "value": "Tangerine"},
                {"label": "金桔", "value": "Kumquat"},
                {"label": "李子", "value": "Plum"},
                {"label": "杏子", "value": "Apricot"},
                {"label": "桃子", "value": "Peach"},
                {"label": "梨子", "value": "Pear"},
                {"label": "草莓", "value": "Strawberry"}

            ]
        }
    ]
}
```

## 批量输入

> 2.0.0 及以上版本

可以设置`"enableBatchAdd": true`开启批量输入模式，默认的分隔符为`"-"`，可以使用`"separator"`属性自定义分隔符，注意避免和`"delimiter"`属性冲突。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "type": "input-tag",
            "name": "tag",
            "label": "标签",
            "enableBatchAdd": true
        }
    ]
}
```

## 数量&文本长度限制

> 2.0.0 及以上版本

可以设置`max`限制输入的标签数量，设置`maxTagLength`限制单个标签的最大文本长度。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "type": "input-tag",
            "name": "tag",
            "label": "标签",
            "options": ["abc", "def", "xyz"],
            "enableBatchAdd": true,
            "max": 5,
            "maxTagLength": 3
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名             | 类型                                      | 默认值                                                                             | 说明                                                                                        |
| ------------------ | ----------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| options            | `Array<object>`或`Array<string>`          |                                                                                    | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| optionsTip         | `Array<object>`或`Array<string>`          | `"最近您使用的标签"`                                                               | 选项提示                                                                                    |
| source             | `string`或 [API](../../../docs/types/api) |                                                                                    | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| delimiter          | `string`                                  | `false`                                                                            | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                   |
| labelField         | `string`                                  | `"label"`                                                                          | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField         | `string`                                  | `"value"`                                                                          | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| joinValues         | `boolean`                                 | `true`                                                                             | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                  |
| extractValue       | `boolean`                                 | `false`                                                                            | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)              |
| clearable          | `boolean`                                 | `false`                                                                            | 在有值的时候是否显示一个删除图标在右侧。                                                    |
| resetValue         | `string`                                  | `""`                                                                               | 删除后设置此配置项给定的值。                                                                |
| max                | `number`                                  |                                                                                    | 允许添加的标签的最大数量                                                                    |
| maxTagLength       | `number`                                  |                                                                                    | 单个标签的最大文本长度                                                                      |
| maxTagCount        | `number`                                  |                                                                                    | 标签的最大展示数量，超出数量后以收纳浮层的方式展示，仅在多选模式开启后生效                  |
| overflowTagPopover | `TooltipObject`                           | `{"placement": "top", "trigger": "hover", "showArrow": false, "offset": [0, -10]}` | 收纳浮层的配置属性，详细配置参考[Tooltip](../tooltip#属性表)                                |
| enableBatchAdd     | `boolean`                                 | `false`                                                                            | 是否开启批量添加模式                                                                        |
| separator          | `string`                                  | `"-"`                                                                              | 开启批量添加后，输入多个标签的分隔符，支持传入多个符号，默认为"-"                           |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                                                                                                          | 说明                 |
| -------- | ----------------------------------------------------------------------------------------------------------------- | -------------------- |
| change   | `[name]: string` 组件的值（多个以逗号分割）<br/>`selectedItems: Option[]` 选中的项<br/>`items: Option[]` 所有选项 | 选中值变化时触发     |
| blur     | `[name]: string` 组件的值<br/>`selectedItems: Option[]` 选中的项<br/>`items: Option[]` 所有选项                   | 输入框失去焦点时触发 |
| focus    | `[name]: string` 组件的值<br/>`selectedItems: Option[]` 选中的项<br/>`items: Option[]` 所有选项                   | 输入框获取焦点时触发 |

### change

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
      {
        "type": "input-tag",
        "name": "tag",
        "label": "标签",
        "placeholder": "请选择标签",
        "options": [
          "Aaron Rodgers",
          "Tom Brady",
          "Charlse Woodson",
          "Aaron Jones"
        ],
        "onEvent": {
            "change": {
                "actions": [
                    {
                      "actionType": "toast",
                      "args": {
                          "msg": "${event.data.value|json}"
                      }
                    }
                ]
            }
        }
      }
    ]
  }
```

### blur

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
      {
        "type": "input-tag",
        "name": "tag",
        "label": "标签",
        "placeholder": "请选择标签",
        "options": [
          "Aaron Rodgers",
          "Tom Brady",
          "Charlse Woodson",
          "Aaron Jones"
        ],
        "onEvent": {
            "blur": {
                "actions": [
                    {
                      "actionType": "toast",
                      "args": {
                          "msg": "${event.data.value|json}"
                      }
                    }
                ]
            }
        }
      }
    ]
  }
```

### focus

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
      {
        "type": "input-tag",
        "name": "tag",
        "label": "标签",
        "placeholder": "请选择标签",
        "options": [
          "Aaron Rodgers",
          "Tom Brady",
          "Charlse Woodson",
          "Aaron Jones"
        ],
        "onEvent": {
            "focus": {
                "actions": [
                    {
                      "actionType": "toast",
                      "args": {
                          "msg": "${event.data.value|json}"
                      }
                    }
                ]
            }
        }
      }
    ]
  }
```

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                 | 说明                                                    |
| -------- | ------------------------ | ------------------------------------------------------- |
| clear    | -                        | 清空                                                    |
| reset    | -                        | 将值重置为初始值。6.3.0 及以下版本为`resetValue`        |
| reload   | -                        | 重新加载，调用 `source`，刷新数据域数据刷新（重新加载） |
| setValue | `value: string` 更新的值 | 更新数据，多个值用`,`分隔                               |

### clear

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
          "type": "input-tag",
          "name": "tag",
          "label": "标签",
          "placeholder": "请选择标签",
          "options": [
            "Aaron Rodgers",
            "Tom Brady",
            "Charlse Woodson",
            "Aaron Jones"
          ],
          "value": "Charlse Woodson",
          "id": "clear_text"
        },
        {
            "type": "button",
            "label": "清空",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "clear",
                            "componentId": "clear_text"
                        }
                    ]
                }
            }
        }
    ]
}
```

### reset

如果配置了`resetValue`，则重置时使用`resetValue`的值，否则使用初始值。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
          "type": "input-tag",
          "name": "tag",
          "label": "标签",
          "placeholder": "请选择标签",
          "options": [
            "Aaron Rodgers",
            "Tom Brady",
            "Charlse Woodson",
            "Aaron Jones"
          ],
          "value": "Charlse Woodson",
          "id": "reset_text"
        },
        {
            "type": "button",
            "label": "重置",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "reset",
                            "componentId": "reset_text"
                        }
                    ]
                }
            }
        }
    ]
}
```

### reload

只有选择器模式支持，即配置`source`，用于重新加载选择器的数据源。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
          "type": "input-tag",
          "name": "tag",
          "label": "标签",
          "placeholder": "请选择标签",
          "id": "reload_type",
          "source": "/api/mock2/form/getOptions?waitSeconds=1",
          "value": "a"
        },
        {
            "type": "button",
            "label": "重新加载",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "reload",
                            "componentId": "reload_type"
                        }
                    ]
                }
            }
        }
    ]
}
```

### setValue

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
          "type": "input-tag",
          "name": "tag",
          "label": "标签",
          "placeholder": "请选择标签",
          "options": [
            "Aaron Rodgers",
            "Tom Brady",
            "Charlse Woodson",
            "Aaron Jones"
          ],
          "value": "Charlse Woodson",
          "id": "setvalue_text"
        },
        {
            "type": "button",
            "label": "赋值",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "setValue",
                            "componentId": "setvalue_text",
                            "args": {
                                "value": "Tom Brady"
                            }
                        }
                    ]
                }
            }
        }
    ]
}
```
