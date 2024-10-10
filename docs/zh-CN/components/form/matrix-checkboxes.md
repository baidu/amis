---
title: MatrixCheckboxes 矩阵
description:
type: 0
group: null
menuName: MatrixCheckboxes
icon:
order: 30
---

矩阵类型的输入框。

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "matrix-checkboxes",
      "name": "matrix",
      "label": "Matrix",
      "rowLabel": "行标题说明",
      "columns": [
        {
          "label": "列1"
        },
        {
          "label": "列2"
        }
      ],
      "rows": [
        {
          "label": "行1"
        },
        {
          "label": "行2"
        }
      ]
    }
  ]
}
```

## 全选

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "matrix-checkboxes",
      "name": "matrix",
      "label": "Matrix",
      "rowLabel": "行标题说明",
      "xCheckAll": true,
      "yCheckAll": true,
      "columns": [
        {
          "label": "列1"
        },
        {
          "label": "列2"
        }
      ],
      "rows": [
        {
          "label": "行1"
        },
        {
          "label": "行2"
        }
      ]
    }
  ]
}
```

## 单选模式

配置`"multiple": false`可以设置单选，配置`singleSelectMode`可以设置单选模式

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "matrix-checkboxes",
      "name": "matrix",
      "label": "Matrix",
      "rowLabel": "行标题说明",
      "multiple": false,
      "columns": [
        {
          "label": "列1"
        },
        {
          "label": "列2"
        }
      ],
      "rows": [
        {
          "label": "行1"
        },
        {
          "label": "行2"
        }
      ]
    }
  ]
}
```

## 动态选项

可以配置 source 渲染动态选项

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "name": "matrix",
        "type": "matrix-checkboxes",
        "label": "动态矩阵组件",
        "source": "/api/mock2/options/matrix?waitSeconds=1"
    }
  ]
}
```

以上面为例，source 接口返回格式如下：

```json
{
  "status": 0,
  "msg": "ok",
  "data": {
    "columns": [
      {
        "label": "Col A",
        "col": "a"
      },
      {
        "label": "Col B",
        "col": "b"
      },
      {
        "label": "Col C",
        "col": "c"
      },
      {
        "label": "Col D",
        "col": "d"
      },
      {
        "label": "Col E",
        "col": "e"
      }
    ],
    "rows": [
      {
        "label": "Row 1",
        "rol": 1
      },
      {
        "label": "Row 2",
        "rol": 2
      },
      {
        "label": "Row 3",
        "rol": 3
      },
      {
        "label": "Row 4",
        "rol": 4
      },
      {
        "label": "Row 5",
        "rol": 5
      },
      {
        "label": "Row 6",
        "rol": 6
      }
    ]
  }
}
```

### column 模式

默认为 column 模式，即每列只能单选某个单元格

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "matrix-checkboxes",
      "name": "matrix",
      "label": "Matrix",
      "rowLabel": "行标题说明",
      "multiple": false,
      "columns": [
        {
          "label": "列1"
        },
        {
          "label": "列2"
        }
      ],
      "rows": [
        {
          "label": "行1"
        },
        {
          "label": "行2"
        }
      ]
    }
  ]
}
```

### cell 模式

cell 模式，指全部选项中只能单选某个单元格

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "matrix-checkboxes",
      "name": "matrix",
      "label": "Matrix",
      "rowLabel": "行标题说明",
      "multiple": false,
      "singleSelectMode": "cell",
      "columns": [
        {
          "label": "列1"
        },
        {
          "label": "列2"
        }
      ],
      "rows": [
        {
          "label": "行1"
        },
        {
          "label": "行2"
        }
      ]
    }
  ]
}
```

### row 模式

row 模式，每行只能单选某个单元格

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "matrix-checkboxes",
      "name": "matrix",
      "label": "Matrix",
      "rowLabel": "行标题说明",
      "multiple": false,
      "singleSelectMode": "row",
      "columns": [
        {
          "label": "列1"
        },
        {
          "label": "列2"
        }
      ],
      "rows": [
        {
          "label": "行1"
        },
        {
          "label": "行2"
        }
      ]
    }
  ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名           | 类型                           | 默认值     | 说明                                                                                                                                                        |
| ---------------- | ------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| columns          | `Array<column>`                |            | 列信息，数组中 `label` 字段是必须给出的                                                                                                                     |
| rows             | `Array<row>`                   |            | 行信息， 数组中 `label` 字段是必须给出的                                                                                                                    |
| rowLabel         | `string`                       |            | 行标题说明                                                                                                                                                  |
| source           | [API](../../../docs/types/api) |            | Api 地址，如果选项组不固定，可以通过配置 `source` 动态拉取。                                                                                                |
| multiple         | `boolean`                      | `true`     | 是否多选                                                                                                                                                    |
| singleSelectMode | `string`                       | `"column"` | 设置单选模式，`multiple`为`false`时有效，可设置为`cell`, `row`, `column` 分别为全部选项中只能单选某个单元格、每行只能单选某个单元格，每列只能单选某个单元格 |
| textAlign        | `string`                       | `"center"` | 当开启多选+全选时，默认为'left'                                                                                                                             |
| yCheckAll        | `boolean`                      | `false`    | 列上的全选                                                                                                                                                  |
| xCheckAll        | `boolean`                      | `false`    | 行上的全选                                                                                                                                                  |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                 | 说明             |
| -------- | ------------------------ | ---------------- |
| change   | `[name]: Array` 组件的值 | 选中值变化时触发 |

### change

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
      {
        "type": "matrix-checkboxes",
        "name": "matrix",
        "label": "Matrix",
        "rowLabel": "行标题说明",
        "columns": [
          {
            "label": "列1"
          },
          {
            "label": "列2"
          }
        ],
        "rows": [
          {
            "label": "行1"
          },
          {
            "label": "行2"
          }
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

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                | 说明                                                    |
| -------- | ----------------------- | ------------------------------------------------------- |
| clear    | -                       | 清空                                                    |
| reset    | -                       | 将值重置为初始值。6.3.0 及以下版本为`resetValue`        |
| reload   | -                       | 重新加载，调用 `source`，刷新数据域数据刷新（重新加载） |
| setValue | `value: Array` 更新的值 | 更新数据                                                |

### clear

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
          "type": "matrix-checkboxes",
          "name": "matrix",
          "label": "Matrix",
          "rowLabel": "行标题说明",
          "columns": [
            {
              "label": "列1"
            },
            {
              "label": "列2"
            }
          ],
          "rows": [
            {
              "label": "行1"
            },
            {
              "label": "行2"
            }
          ],
          "value": [
            [
              {
                "label": "列1",
                "checked": true
              },
              {
                "label": "列1",
                "checked": false
              }
            ],
            [
              {
                "label": "列2",
                "checked": false
              },
              {
                "label": "列2",
                "checked": true
              }
            ]
          ],
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
          "type": "matrix-checkboxes",
          "name": "matrix",
          "label": "Matrix",
          "rowLabel": "行标题说明",
          "columns": [
            {
              "label": "列1"
            },
            {
              "label": "列2"
            }
          ],
          "rows": [
            {
              "label": "行1"
            },
            {
              "label": "行2"
            }
          ],
          "value": [
            [
              {
                "label": "列1",
                "checked": true
              },
              {
                "label": "列1",
                "checked": false
              }
            ],
            [
              {
                "label": "列2",
                "checked": false
              },
              {
                "label": "列2",
                "checked": true
              }
            ]
          ],
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
          "type": "list-select",
          "name": "select",
          "label": "单选",
          "clearable": true,
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
          "type": "matrix-checkboxes",
          "name": "matrix",
          "label": "Matrix",
          "rowLabel": "行标题说明",
          "columns": [
            {
              "label": "列1"
            },
            {
              "label": "列2"
            }
          ],
          "rows": [
            {
              "label": "行1"
            },
            {
              "label": "行2"
            }
          ],
          "value": "a",
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
                                "value": [
                                  [
                                    {
                                      "label": "列1",
                                      "checked": true
                                    },
                                    {
                                      "label": "列1",
                                      "checked": true
                                    }
                                  ],
                                  [
                                    {
                                      "label": "列2",
                                      "checked": false
                                    },
                                    {
                                      "label": "列2",
                                      "checked": true
                                    }
                                  ]
                                ]
                            }
                        }
                    ]
                }
            }
        }
    ]
}
```
