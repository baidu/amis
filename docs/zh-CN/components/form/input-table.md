---
title: InputTable 表格
description:
type: 0
group: null
menuName: InputTable 表格
icon:
order: 54
---

## 基本用法

可以用来展示数组类型的数据。配置`columns` 数组，来定义列信息。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "form",
    "debug": "true",
    "data": {
      "table": [
        {
          "a": "a1",
          "b": "b1",
          "c": {
            "c1": "123",
            "c2": "222"
          }
        }
      ]
    },
    "api": "/api/mock2/form/saveForm",
    "body": [
      {
        "type": "input-table",
        "name": "table",
        "columns": [
          {
            "name": "a",
            "label": "A"
          },
          {
            "name": "b",
            "label": "B"
          },
          {
            "type": "combo",
            "name": "c",
            "multiLine": true,
            "multiple": false,
            "items": [
              {
                "type": "input-text",
                "name": "c1"
              },
              {
                "type": "input-text",
                "name": "c2"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

我们为表单数据域设置了`table`变量，配置`table`表单项可以展示该数据

## 显示序号

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
        {
            "a": "a1",
            "b": "b1"
        },
        {
            "a": "a2",
            "b": "b2"
        },
        {
            "a": "a3",
            "b": "b3"
        }
    ]
  },
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "showIndex": true,
      "type":"input-table",
      "name":"table",
      "columns":[
          {
            "name": "a",
            "label": "A"
          },
          {
            "name": "b",
            "label": "B"
          }
      ]
    }
  ]
}
```

## 可新增行

可以配置`addable`和`editable`指定可以新增且编辑行数据

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
    "type":"input-table",
    "name":"table",
    "addable": true,
    "editable": true,
    "columns":[
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
    ]
  }
  ]
}
```

## 可复制新增行

> 1.4.0 及以上版本

还能通过 `copyable` 来增加一个复制按钮来复制当前行

> 6.6.0 起支持配置 `copyData` 属性，来指定复制的数据。默认值为 `{&: "$$"}`

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
    "type":"input-table",
    "name":"table",
    "addable": true,
    "copyable": true,
    "copyData": {"&": "$$$$", "id": "$${'__undefined'}", "copyFrom": "$${id}"},
    "editable": true,
    "value": [
      {
        "a": "a1",
        "b": "b1",
        "id": 1
      }
    ],
    "columns":[
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
    ]
  }
  ]
}
```

## 配置按钮为文字

可以通过对应的 `BtnLabel` 及 `BtnIcon` 来改成显示文字而不是图标

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
    "type":"input-table",
    "name":"table",
    "addable": true,
    "addBtnLabel": "添加",
    "addBtnIcon": false,
    "copyable": true,
    "copyBtnLabel": "复制",
    "copyBtnIcon": false,
    "editable": true,
    "editBtnLabel": "编辑",
    "editBtnIcon": false,
    "value": [
      {
        "a": "a1",
        "b": "b1"
      }
    ],
    "columns":[
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
    ]
  }
  ]
}
```

## 按钮触发新增行

按钮上配置`"actionType": "add"`和`target`指定表格`name`，可以实现点击按钮添加一行的效果。

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      },
      {
        "a": "a2",
        "b": "b2"
      },
      {
        "a": "a3",
        "b": "b3"
      }
    ]
  },
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-table",
      "name": "table",
      "label": "Table",
      "needConfirm": false,
      "columns": [
        {
          "label": "A",
          "name": "a"
        },
        {
          "label": "B",
          "name": "b"
        },
        {
          "type": "operation",
          "label": "操作",
          "buttons": [
            {
              "label": "删除",
              "type": "button",
              "level": "link"
            }
          ]
        }
      ]
    },
    {
      "type": "button",
      "label": "Table新增一行",
      "target": "table",
      "actionType": "add"
    }
  ]
}
```

当表格上配置了`addApi`时，会请求该 `api`，并将返回数据添加到目标表格。

另外还可以配置`payload`，直接将数据添加到目标表格。

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      },
      {
        "a": "a2",
        "b": "b2"
      },
      {
        "a": "a3",
        "b": "b3"
      }
    ]
  },
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-table",
      "name": "table",
      "label": "Table",
      "columns": [
        {
          "label": "A",
          "name": "a"
        },
        {
          "label": "B",
          "name": "b"
        }
      ]
    },
    {
      "type": "button",
      "label": "Table新增一行",
      "target": "table",
      "actionType": "add",
      "payload": {
        "a": "a4",
        "b": "b4"
      }
    }
  ]
}
```

## 可编辑内容

> 这是 1.2.3 新增的合并写法，1.2.2 之前请用后面提到的 quickEdit

每一列的都可以通过 type 来将其改造成可编辑的列，比如下面的例子（建议配合 `"needConfirm": false` 来改成[非确认模式](#非确认模式)）

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      },
      {
        "a": "a2",
        "b": "b2"
      },
      {
        "a": "a3",
        "b": "b3"
      }
    ]
  },
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-table",
      "name": "table",
      "label": "Table",
      "addable": true,
      "needConfirm": false,
      "columns": [
        {
          "label": "A",
          "name": "a",
          "type": "input-text"
        },
        {
          "label": "B",
          "name": "b",
          "type": "select",
          "options": [
            "b1", "b2", "b3"
          ]
        }
      ]
    }
  ]
}
```

除了上面的例子，还可以在列上配置`quickEdit`实现编辑配置，实现展现和编辑分离，更多配置参考 [快速编辑](../crud#%E5%BF%AB%E9%80%9F%E7%BC%96%E8%BE%91)

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      },
      {
        "a": "a2",
        "b": "b2"
      },
      {
        "a": "a3",
        "b": "b3"
      }
    ]
  },
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-table",
      "name": "table",
      "label": "Table",
      "columns": [
        {
          "label": "A",
          "name": "a",
          "quickEdit": {
            "type": "select",
            "options": ["a1", "a2", "a3"]
          }
        },
        {
          "label": "B",
          "name": "b",
          "quickEdit": true
        }
      ]
    }
  ]
}
```

## 显示分页

可以配置`perPage`属性设置一页显示多少条数据。如果不配置此属性，则不会显示分页器

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
        {
            "a": "a1",
            "b": "b1"
        },
        {
            "a": "a2",
            "b": "b2"
        },
        {
            "a": "a3",
            "b": "b3"
        },
        {
            "a": "a4",
            "b": "b4"
        },
        {
            "a": "a5",
            "b": "b5"
        },
        {
            "a": "a6",
            "b": "b6"
        }
    ]
  },
  "body": [
    {
      "type":"input-table",
      "perPage": 5,
      "name":"table",
      "addable": true,
      "showIndex": true,
      "columns":[
          {
            "name": "a",
            "label": "A",
            "searchable": true
          },
          {
            "name": "b",
            "label": "B",
            "sortable": true
          }
      ]
    }
  ]
}
```

## 前端过滤与排序

> 6.10.0 及以上版本

在列上配置 `searchable`、`sortable` 或者 `filterable` 来开启对应功能，用法与 [CRUD](../crud#快速搜索) 一致。

```schema: scope="body"
{
  "type": "form",
  "initApi": "/api/mock2/sample",
  "body": [
    {
      "type":"input-table",
      "perPage": 10,
      "name":"rows",
      "addable": true,
      "copyable": true,
      "editable": true,
      "removable": true,
      "showIndex": true,
      "columns":[
        {
          "name": "grade",
          "label": "CSS grade",
          "filterable": {
            "options": [
              "A",
              "B",
              "C",
              "D",
              "X"
            ]
          }
        },
        {
          "name": "version",
          "label": "Version",
          "searchable": true
        }
      ]
    }
  ]
}
```

默认前端只是简单的过滤，如果要有复杂过滤，请通过 `matchFunc` 来实现，函数签名 `(items: Record<string, any>[], itemsRaw: Record<string, any>[], options: {query: string, columns: Column[], matchSorter: (a: any, b: any) => number}) => Record<string, any>[]`

- `items` 当前表格数据
- `itemsRaw` 与 items 一样，（历史用法，保持不变）
- `options` 配置
- `options.query` 查询条件
- `options.columns` 列配置
- `options.matchSorter` 系统默认的排序方法

```schema: scope="body"
{
  "type": "form",
  "initApi": "/api/mock2/sample",
  "body": [
    {
      "type":"input-table",
      "perPage": 10,
      "name":"rows",
      "addable": true,
      "matchFunc": "const query = options.query;if (query.version === '>=20') {items = items.filter(item => parseFloat(item.version) >= 20);} else if (query.version ==='<20') {items = items.filter(item => parseFloat(item.version) < 20);}return items;",
      "columns":[
        {
          "name": "id",
          "label": "ID"
        },
        {
          "name": "grade",
          "label": "CSS grade"
        },
        {
          "name": "version",
          "label": "Version",
          "filterable": {
            "options": [
              ">=20",
              "<20"
            ]
          }
        }
      ]
    }
  ]
}
```

## 可拖拽

配置`"draggable": true`，实现可拖拽调整顺序

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      },
      {
        "a": "a2",
        "b": "b2"
      },
      {
        "a": "a3",
        "b": "b3"
      }
    ]
  },
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-table",
      "name": "table",
      "label": "Table",
      "draggable": true,
      "columns": [
        {
          "label": "A",
          "name": "a"
        },
        {
          "label": "B",
          "name": "b"
        }
      ]
    }
  ]
}
```

## 限制个数

可以配置`minLength`和`maxLength`配置 InputTable 可添加的条数

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      },
      {
        "a": "a2",
        "b": "b2"
      },
      {
        "a": "a3",
        "b": "b3"
      }
    ]
  },
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-table",
      "name": "table",
      "label": "Table",
      "minLength": 1,
      "maxLength": 5,
      "needConfirm": false,
      "addable": true,
      "removable": true,
      "columns": [
        {
          "label": "A",
          "name": "a",
          "quickEdit": false
        },
        {
          "label": "B",
          "name": "b"
        }
      ]
    }
  ]
}
```

也可以使用变量配置`minLength`和`maxLength`

> 2.4.1 及以上版本

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      },
      {
        "a": "a2",
        "b": "b2"
      },
      {
        "a": "a3",
        "b": "b3"
      }
    ],
    "minLength": 2,
    "maxLength": 4
  },
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-table",
      "name": "table",
      "label": "Table",
      "minLength": "${minLength}",
      "maxLength": "${maxLength}",
      "needConfirm": false,
      "addable": true,
      "removable": true,
      "columns": [
        {
          "label": "A",
          "name": "a",
          "quickEdit": false
        },
        {
          "label": "B",
          "name": "b"
        }
      ]
    }
  ]
}
```

## 非确认模式

配置`"needConfirm": false`，以实现新增**单行数据**时不需要确认即可提交到数据域。

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      },
      {
        "a": "a2",
        "b": "b2"
      },
      {
        "a": "a3",
        "b": "b3"
      }
    ]
  },
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-table",
      "name": "table",
      "label": "Table",
      "needConfirm": false,
      "addable": true,
      "removable": true,
      "columns": [
        {
          "label": "A",
          "name": "a",
          "quickEdit": false
        },
        {
          "label": "B",
          "name": "b"
        }
      ]
    }
  ]
}
```

## 树形模式

配置 `childrenAddable` 为 true，可以开启新增子节点功能。

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      },
      {
        "a": "a2",
        "b": "b2"
      },
      {
        "a": "a3",
        "b": "b3"
      }
    ]
  },
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-table",
      "name": "table",
      "label": "Table",
      "addable": true,
      "childrenAddable": true,
      "editable": true,
      "removable": true,
      "columns": [
        {
          "label": "A",
          "name": "a"
        },
        {
          "label": "B",
          "name": "b"
        }
      ]
    }
  ]
}
```

## 获取父级数据

默认情况下，Table 内表达项无法获取父级数据域的数据，如下，我们添加 Table 表单项时，尽管 Table 内的文本框的`name`与父级数据域中的`super_text`变量同名，但是没有自动映射值。

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "type": "input-text",
        "label": "父级文本框",
        "name": "super_text",
        "value": "123"
    },
    {
        "type": "input-table",
        "name": "list",
        "label": "不可获取父级数据",
        "addable": true,
        "needConfirm": false,
        "columns": [
            {
                "name": "super_text",
                "type": "text",
                "label": "A"
            }
        ]
    }
  ]
}
```

可以配置`"canAccessSuperData": true` 同时配置 `"strictMode": false` 开启此特性，如下，配置了该配置项后，添加 Table 的`text`表单项会初始会自动映射父级数据域的同名变量。需要注意的是，这里只会初始会映射，一旦修改过就是当前行数据为主了。也就是说，表单项类型的，只会起到初始值的作用。如果为非表单项则会同步更新，比如这个例子的第二列。同时非表单项字段可以用在表单项字段中做联动。

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "type": "input-text",
        "label": "父级文本框",
        "name": "super_text",
        "value": "123"
    },
    {
        "type": "switch",
        "label": "父级勾选框",
        "name": "super_switch",
        "value": false
    },
    {
        "type": "input-table",
        "name": "list",
        "label": "可获取父级数据",
        "addable": true,
        "needConfirm": false,
        "canAccessSuperData": true,
        "strictMode": false,
        "value": [{}],
        "columns": [
            {
                "name": "super_text",
                "type": "text",
                "label": "表单项",
                "quickEdit": {
                  "disabledOn": "this.super_switch"
                }
            },

            {
                "name": "super_switch",
                "type": "status",
                "quickEdit": false,
                "label": "非表单项"
            }
        ]
    }
  ]
}
```

## 高亮行

> 1.8.0 及以上版本

通过 `rowClassNameExpr` 来添加类，比如下面的例子中，如果输入的内容是 `a` 则背景色为绿色`

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
      {
        "type": "input-table",
        "name": "table",
        "addable": true,
        "editable": true,
        "rowClassNameExpr": "${ a === 'a' ? 'bg-success' : '' }",
        "columns": [
          {
            "name": "a",
            "label": "A"
          }
        ]
      }
    ]
  }
```

## 表单项校验

> 2.8.1 及以上版本

列信息 `columns` 的对应项为表单项时，可以设置表单项的校验规则，来实现对该项的校验，校验配置可以查看 [格式校验](../formitem#格式校验)

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "data": {
    "table": [
      {
        "input": 111,
        "select": "s1",
        "text": "text"
      },
      {}
    ]
  },
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "body": [
    {
      "type": "input-table",
      "name": "table",
      "label": "Table",
      "columns": [
        {
          "label": "数字输入",
          "name": "input",
          "type": "input-text",
          "placeholder": "请输入数字",
          "required": true,
          "validations": {
            "isNumeric": true
          },
          "validationErrors": {
            "isNumeric": "请输入数字"
          }
        },
        {
          "label": "选项",
          "name": "select",
          "type": "select",
          "required": true,
          "options": [
            "s1",
            "s2",
            "s3"
          ]
        },
        {
          "label": "普通文本",
          "name": "text"
        }
      ]
    }
  ]
}
```

## 支持 Range extraName 属性

> 6.10.0 以上版本

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "form",
    "debug": true,
    "data": {
      "table": [
        {
          "a": "1212",
          "begin": "06:00",
          "end": "07:00"
        }
      ]
    },
    "api": "/api/mock2/form/saveForm",
    "body": [
      {
        "type": "input-table",
        "name": "table",
        "label": "Table",
        "needConfirm": false,
        "columns": [
          {
            "label": "A",
            "name": "a"
          },
          {
            "type": "input-time-range",
            "name": "begin",
            "extraName": "end"
          },
          {
            "type": "operation",
            "label": "操作",
            "buttons": [
              {
                "label": "删除",
                "type": "button",
                "level": "link"
              }
            ]
          }
        ]
      },
      {
        "type": "button",
        "label": "Table新增一行",
        "target": "table",
        "actionType": "add"
      }
    ]
  }
}
```

## 属性表

| 属性名                       | 类型                                      | 默认值          | 说明                                                                                                 |
| ---------------------------- | ----------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------- |
| type                         | `string`                                  | `"input-table"` | 指定为 Table 渲染器                                                                                  |
| addable                      | `boolean`                                 | `false`         | 是否可增加一行                                                                                       |
| copyable                     | `boolean`                                 | `false`         | 是否可复制一行                                                                                       |
| copyData                     | `PlainObject`                             |                 | 控制复制时的数据映射，不配置时复制整行数据                                                           |
| childrenAddable              | `boolean`                                 | `false`         | 是否可增加子级节点                                                                                   |
| editable                     | `boolean`                                 | `false`         | 是否可编辑                                                                                           |
| removable                    | `boolean`                                 | `false`         | 是否可删除                                                                                           |
| showTableAddBtn              | `boolean`                                 | `true`          | 是否显示表格操作栏添加按钮，前提是要开启可新增功能                                                   |
| showFooterAddBtn             | `boolean`                                 | `true`          | 是否显示表格下方添加按，前提是要开启可新增功能                                                       |
| addApi                       | [API](../../../docs/types/api)            | -               | 新增时提交的 API                                                                                     |
| footerAddBtn                 | [SchemaNode](../../docs/types/schemanode) | -               | 底部新增按钮配置                                                                                     |
| updateApi                    | [API](../../../docs/types/api)            | -               | 修改时提交的 API                                                                                     |
| deleteApi                    | [API](../../../docs/types/api)            | -               | 删除时提交的 API                                                                                     |
| addBtnLabel                  | `string`                                  |                 | 增加按钮名称                                                                                         |
| addBtnIcon                   | `string`                                  | `"plus"`        | 增加按钮图标                                                                                         |
| subAddBtnLabel               | `string`                                  |                 | 子级增加按钮名称                                                                                     |
| subAddBtnIcon                | `string`                                  | `"sub-plus"`    | 子级增加按钮图标                                                                                     |
| copyBtnLabel                 | `string`                                  |                 | 复制按钮文字                                                                                         |
| copyBtnIcon                  | `string`                                  | `"copy"`        | 复制按钮图标                                                                                         |
| editBtnLabel                 | `string`                                  | `""`            | 编辑按钮名称                                                                                         |
| editBtnIcon                  | `string`                                  | `"pencil"`      | 编辑按钮图标                                                                                         |
| deleteBtnLabel               | `string`                                  | `""`            | 删除按钮名称                                                                                         |
| deleteBtnIcon                | `string`                                  | `"minus"`       | 删除按钮图标                                                                                         |
| confirmBtnLabel              | `string`                                  | `""`            | 确认编辑按钮名称                                                                                     |
| confirmBtnIcon               | `string`                                  | `"check"`       | 确认编辑按钮图标                                                                                     |
| cancelBtnLabel               | `string`                                  | `""`            | 取消编辑按钮名称                                                                                     |
| cancelBtnIcon                | `string`                                  | `"times"`       | 取消编辑按钮图标                                                                                     |
| needConfirm                  | `boolean`                                 | `true`          | 是否需要确认操作，可用来控制表格的操作交互                                                       |
| canAccessSuperData           | `boolean`                                 | `false`         | 是否可以访问父级数据，也就是表单中的同级数据，通常需要跟 strictMode 搭配使用                         |
| strictMode                   | `boolean`                                 | `true`          | 为了性能，默认其他表单项项值变化不会让当前表格更新，有时候为了同步获取其他表单项字段，需要开启这个。 |
| minLength                    | `number`                                  | `0`             | 最小行数, `2.4.1`版本后支持变量                                                                      |
| maxLength                    | `number`                                  | `Infinity`      | 最大行数, `2.4.1`版本后支持变量                                                                      |
| perPage                      | `number`                                  | -               | 每页展示几行数据，如果不配置则不会显示分页器                                                         |
| columns                      | `array`                                   | []              | 列信息                                                                                               |
| columns[x].quickEdit         | `boolean` 或者 `object`                   | -               | 配合 editable 为 true 一起使用                                                                       |
| columns[x].quickEditOnUpdate | `boolean` 或者 `object`                   | -               | 可以用来区分新建模式和更新模式的编辑配置                                                             |

## 事件表

当前组件会对外派发以下事件，可以通过 onEvent 来监听这些事件，并通过 actions 来配置执行的动作，在 actions 中可以通过${事件参数名}或${event.data.[事件参数名]}来获取事件产生的数据，详细查看事件动作。

| 事件名称      | 事件参数                                                                                                                                                                                              | 说明                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| add           | `index: number` 新增行记录索引 <br />`indexPath: string` 新增行记录索引路径 <br /> `item: object` 新增行记录 <br/> `value: object[]` 列表记录                                                         | 点击左下角添加按钮 或 某一行右侧操作栏添加按钮时触发                 |
| addConfirm    | `index: number` 新增行记录索引 <br /> `item: object` 新增行记录 <br/>`indexPath: string` 新增行记录索引路径 <br /> `value: object[]`列表记录                                                          | 开启`needConfirm`，点击添加按钮，填入数据后点击“保存”按钮后触发      |
| addSuccess    | `index: number` 新增行记录索引 <br /> `item: object` 新增行记录 <br/>`indexPath: string` 新增行记录索引路径 <br /> `value: object[]`列表记录                                                          | 开启`needConfirm`并且配置`addApi`，点击“保存”后调用接口成功时触发    |
| addFail       | `index: number` 新增行记录索引 <br /> `item: object` 新增行记录 <br/>`indexPath: string` 新增行记录索引路径 <br /> `value: object[]`列表记录<br />`error: object` `addApi`请求失败后返回的错误信息    | 开启`needConfirm`并且配置`addApi`，点击“保存”后调用接口失败时触发    |
| edit          | `index: number` 所在行记录索引 <br /> `item: object` 所在行记录 <br/>`indexPath: string` 所在行记录索引路径 <br /> `value: object[]`列表记录                                                          | 点击某一行右侧操作栏“编辑”按钮时触发                                 |
| editConfirm   | `index: number` 所在行记录索引 <br /> `item: object` 所在行记录 <br/>`indexPath: string` 所在行记录索引路径 <br /> `value: object[]`列表记录                                                          | 开启`needConfirm`，点击“编辑”按钮，填入数据后点击“保存”按钮后触发    |
| editSuccess   | `index: number` 所在行记录索引 <br /> `item: object` 所在行记录 <br/>`indexPath: string` 所在行记录索引路径 <br /> `value: object[]`列表记录                                                          | 开启`needConfirm`并且配置`updateApi`，点击“保存”后调用接口成功时触发 |
| editFail      | `index: number` 所在行记录索引 <br /> `item: object` 所在行记录 <br/>`indexPath: string` 所在行记录索引路径 <br /> `value: object[]`列表记录<br />`error: object` `updateApi`请求失败后返回的错误信息 | 开启`needConfirm`并且配置`updateApi`，点击“保存”后调用接口失败时触发 |
| delete        | `index: number` 所在行记录索引 <br /> `item: object` 所在行记录 <br/>`indexPath: string` 所在行记录索引路径 <br /> `value: object[]`列表记录                                                          | 点击某一行右侧操作栏“删除”按钮时触发                                 |
| deleteSuccess | `index: number` 所在行记录索引 <br /> `item: object` 所在行记录 <br/>`indexPath: string` 所在行记录索引路径 <br /> `value: object[]`列表记录                                                          | 配置了`deleteApi`，调用接口成功时触发                                |
| deleteFail    | `index: number` 所在行记录索引 <br /> `item: object` 所在行记录 <br/>`indexPath: string` 所在行记录索引路径 <br /> `value: object[]`列表记录<br />`error: object` `deleteApi`请求失败后返回的错误信息 | 配置了`deleteApi`，调用接口失败时触发                                |
| change        | `value: object[]` 列表记录                                                                                                                                                                            | 组件数据发生改变时触发                                               |
| orderChange   | `movedItems: item[]` 已排序数据                                                                                                                                                                       | 手动拖拽行排序时触发                                                 |
| rowClick      | `item: object` 行点击数据<br/>`index: number` 行索引 <br/>`indexPath: string` 行索引路径                                                                                                              | 单击整行时触发                                                       |
| rowDbClick    | `item: object` 行点击数据<br/>`index: number` 行索引 <br/>`indexPath: string` 行索引路径                                                                                                              | 双击整行时触发                                                       |
| rowMouseEnter | `item: object` 行移入数据<br/>`index: number` 行索引 <br/>`indexPath: string` 行索引路径                                                                                                              | 移入整行时触发                                                       |
| rowMouseLeave | `item: object` 行移出数据<br/>`index: number` 行索引 <br/>`indexPath: string` 行索引路径                                                                                                              | 移出整行时触发                                                       |

### add

点击左下角添加按钮 或 某一行右侧操作栏添加按钮时触发。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "perPage": 5,
      "childrenAddable": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "needConfirm": false,
      "onEvent": {
        "add": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "position": "top-right",
                "title": "add事件",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### addConfirm

开启`needConfirm`，点击添加按钮，填入数据后点击“保存”按钮后触发。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "needConfirm": true,
      "onEvent": {
        "addConfirm": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "position": "top-right",
                "title": "addConfirm事件",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### addSuccess

开启`needConfirm`并且配置`addApi`，点击“保存”后调用接口成功时触发。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "needConfirm": true,
      "addApi": "/api/mock2/table/addSuccess",
      "onEvent": {
        "addSuccess": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "position": "top-right",
                "title": "addSuccess事件",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### addFail

开启`needConfirm`并且配置`addApi`，点击“保存”后调用接口失败时触发。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "needConfirm": true,
      "addApi": "/api/mock2/table/addFail",
      "onEvent": {
        "addFail": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "position": "top-right",
                "title": "addFail事件",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### edit

点击某一行右侧操作栏“编辑”按钮时触发

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "needConfirm": true,
      "editable": true,
      "onEvent": {
        "edit": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "position": "top-right",
                "title": "edit事件",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### editConfirm

开启`needConfirm`，点击“编辑”按钮，填入数据后点击“保存”按钮后触发.

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "editable": true,
      "onEvent": {
        "editConfirm": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "position": "top-right",
                "title": "editConfirm事件",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### editSuccess

开启`needConfirm`并且配置`updateApi`，点击“保存”后调用接口成功时触发。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "editable": true,
      "needConfirm": true,
      "updateApi": "/api/mock2/table/editSuccess",
      "onEvent": {
        "editSuccess": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "position": "top-right",
                "title": "editSuccess事件",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### editFail

开启`needConfirm`并且配置`updateApi`，点击“保存”后调用接口失败时触发。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "editable": true,
      "needConfirm": true,
      "updateApi": "/api/mock2/table/editFail",
      "onEvent": {
        "editFail": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "position": "top-right",
                "title": "editFail事件",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### delete

点击某一行右侧操作栏“删除”按钮时触发。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "removable": true,
      "needConfirm": false,
      "onEvent": {
        "delete": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "position": "top-right",
                "title": "delete事件",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### deleteSuccess

开启`needConfirm`并且配置`deleteApi`，点击“保存”后调用接口成功时触发。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "removable": true,
      "needConfirm": false,
      "deleteApi": "/api/mock2/table/deleteSuccess",
      "onEvent": {
        "deleteSuccess": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "position": "top-right",
                "title": "deleteSuccess事件",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### deleteFail

配置了`deleteApi`，调用接口失败时触发。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "removable": true,
      "needConfirm": false,
      "deleteApi": "/api/mock2/table/deleteFail",
      "onEvent": {
        "deleteFail": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "position": "top-right",
                "title": "deleteFail事件",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### change

组件数据发生改变时触发。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "onEvent": {
        "change": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "position": "top-right",
                "title": "change事件",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### orderChange

在开启拖拽排序行记录后才会用到，排序确认后触发。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      },
      {
        "id": 2,
        "a": "a2",
        "b": "b2"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "draggable": true,
      "onEvent": {
          "orderChange": {
              "actions": [
                  {
                      "actionType": "toast",
                      "args": {
                          "msgType": "info",
                          "msg": "上下文 ${event.data | json:0}"
                      }
                  }
              ]
          }
      }
    }
  ]
}
```

### rowClick

点击行记录。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      },
      {
        "id": 2,
        "a": "a2",
        "b": "b2"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "onEvent": {
        "rowClick": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### rowDbClick

双击行记录。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      },
      {
        "id": 2,
        "a": "a2",
        "b": "b2"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "onEvent": {
        "rowDbClick": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### rowMouseEnter

鼠标移入行记录。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      },
      {
        "id": 2,
        "a": "a2",
        "b": "b2"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "onEvent": {
        "rowMouseEnter": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "上下文 ${event.data | json:0}"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### rowMouseLeave

鼠标移出行记录。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      },
      {
        "id": 2,
        "a": "a2",
        "b": "b2"
      }
    ]
  },
  "body": [
    {
      "showIndex": true,
      "type": "input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "onEvent": {
        "rowMouseLeave": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "上下文 ${event.data | json:0}"
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

当前组件对外暴露以下特性动作，其他组件可以通过指定 actionType: 动作名称、componentId: 该组件 id 来触发这些动作，动作配置可以通过 args: {动作配置项名称: xxx}来配置具体的参数，详细请查看事件动作。

| 动作名称   | 动作配置                                                                                                                           | 说明                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| addItem    | `item: object\|Array<object>` 添加的数据<br />`index: number` 指定添加的位置，如果未指定则在数据尾端插入                           | 在已有数据的基础上插入数据                                           |
| deleteItem | `condition:` 删除条件[表达式](../../../docs/concepts/expression)，用于支持批量删除的场景<br /> `index: number ` 指定删除哪一行数据 | 删除某一行数据                                                       |
| setValue   | `value: object \| Array<object>` 替换的值<br /> `index?: number` 可选，替换第几行数据，如果没有指定，则替换全部表格数据            | 替换表格数据                                                         |
| clear      | -                                                                                                                                  | 清空表格数据                                                         |
| reset      | -                                                                                                                                  | 将表格数据重置为`resetValue`，若没有配置`resetValue`，则清空表格数据 |
| initDrag   | -                                                                                                                                  | 开启表格拖拽排序功能                                                 |
| cancelDrag | -                                                                                                                                  | 取消表格拖拽排序功能                                                 |

### addItem

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      },
      {
        "id": 2,
        "a": "a2",
        "b": "b2"
      },
      {
        "id": 3,
        "a": "a3",
        "b": "b3"
      },
      {
        "id": 4,
        "a": "a4",
        "b": "b4"
      },
      {
        "id": 5,
        "a": "a5",
        "b": "b5"
      }
    ]
  },
  "body": [
    {
      "type": "button",
      "label": "新增一行（未指定添加位置）",
      "className": "mr-2",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "addItem-input-table",
              "groupType": "component",
              "actionType": "addItem",
              "args": {
                "item": [
                  {
                    "a": "a-noIndex",
                    "b": "b-noIndex"
                  }
                ]
              }
            }
          ]
        }
      }
    },
    {
      "type": "button",
      "label": "新增一行（指定添加位置）",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "addItem-input-table",
              "groupType": "component",
              "actionType": "addItem",
              "args": {
                "index": 3,
                "item": [
                  {
                    "a": "a-index",
                    "b": "b-index"
                  }
                ]
              }
            }
          ]
        }
      }
    },
    {
      "type": "input-table",
      "name": "table",
      "label": "表格表单",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "footerAddBtn": {
        "label": "新增",
        "icon": "fa fa-plus",
        "hidden": true
      },
      "strictMode": true,
      "id": "addItem-input-table",
      "minLength": 0,
      "needConfirm": false,
      "showTableAddBtn": false
    }
  ]
}
```

### deleteItem

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "button",
      "label": "删除行（指定行号）",
      "className": "mr-2",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "deleteItem-input-table",
              "groupType": "component",
              "actionType": "deleteItem",
              "args": {
                "index": "1,2,3"
              }
            }
          ]
        }
      }
    },
    {
      "type": "button",
      "label": "删除行（指定条件表达式）",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "deleteItem-input-table",
              "groupType": "component",
              "actionType": "deleteItem",
              "args": {
                "condition": "${a === 'a3' || b === 'b4'}"
              }
            }
          ]
        }
      }
    },
    {
      "type": "input-table",
      "label": "表格表单",
      "id": "deleteItem-input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "footerAddBtn": {
        "label": "新增",
        "icon": "fa fa-plus",
        "hidden": true
      },
      "strictMode": true,
      "minLength": 0,
      "needConfirm": false,
      "showTableAddBtn": false
    }
  ],
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      },
      {
        "id": 2,
        "a": "a2",
        "b": "b2"
      },
      {
        "id": 3,
        "a": "a3",
        "b": "b3"
      },
      {
        "id": 4,
        "a": "a4",
        "b": "b4"
      },
      {
        "id": 5,
        "a": "a5",
        "b": "b5"
      }
    ]
  }
}
```

### setValue

#### 更新列表记录

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "button",
      "label": "更新列表记录",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "setValue-input-table",
              "groupType": "component",
              "actionType": "setValue",
              "args": {
                "value": [
                  {
                    "a": "a-setValue1",
                    "b": "b-setValue1"
                  },
                  {
                    "a": "a-setValue2",
                    "b": "b-setValue2"
                  }
                ]
              }
            }
          ]
        }
      }
    },
    {
      "type": "input-table",
      "label": "表格表单",
      "id": "setValue-input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "footerAddBtn": {
        "label": "新增",
        "icon": "fa fa-plus",
        "hidden": true
      },
      "strictMode": true,
      "minLength": 0,
      "needConfirm": false,
      "showTableAddBtn": false
    }
  ],
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      },
      {
        "id": 2,
        "a": "a2",
        "b": "b2"
      },
      {
        "id": 3,
        "a": "a3",
        "b": "b3"
      },
      {
        "id": 4,
        "a": "a4",
        "b": "b4"
      },
      {
        "id": 5,
        "a": "a5",
        "b": "b5"
      }
    ]
  }
}
```

#### 更新指定行记录

可以通过指定`index`或者`condition`来分别更新指定索引的行记录和指定满足条件（条件表达式或者 ConditionBuilder）的行记录。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "button",
      "label": "更新index为1和3的行记录",
      "className": "mr-2",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "setValue-input-table",
              "actionType": "setValue",
              "args": {
                "value": {
                    "a": "a-setValue1",
                    "b": "b-setValue1"
                },
                "index": '1,3'
              }
            }
          ]
        }
      }
    },
    {
      "type": "button",
      "label": "更新a=a3的行记录",
      "className": "mr-2",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "setValue-input-table",
              "actionType": "setValue",
              "args": {
                "value": {
                    "a": "a-setValue1",
                    "b": "b-setValue1"
                },
                "condition": "${a === 'a3'}"
              }
            }
          ]
        }
      }
    },
    {
      "type": "button",
      "label": "更新a=a5的行记录",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "setValue-input-table",
              "actionType": "setValue",
              "args": {
                "value": {
                    "a": "a-setValue1",
                    "b": "b-setValue1"
                },
                "condition": {
                  conjunction: 'and',
                  children: [
                    {
                      left: {
                        type: 'field',
                        field: 'a'
                      },
                      op: 'equal',
                      right: "a5"
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    },
    {
      "type": "input-table",
      "label": "表格表单",
      "id": "setValue-input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "footerAddBtn": {
        "label": "新增",
        "icon": "fa fa-plus",
        "hidden": true
      },
      "strictMode": true,
      "minLength": 0,
      "needConfirm": false,
      "showTableAddBtn": false
    }
  ],
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      },
      {
        "id": 2,
        "a": "a2",
        "b": "b2"
      },
      {
        "id": 3,
        "a": "a3",
        "b": "b3"
      },
      {
        "id": 4,
        "a": "a4",
        "b": "b4"
      },
      {
        "id": 5,
        "a": "a5",
        "b": "b5"
      }
    ]
  }
}
```

#### 行记录内表单项联动

需要通过表达式配置动态 `id` 和 `componentId`。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-table",
      "label": "表格表单",
      "id": "setValue-input-table",
      "name": "table",
      "columns": [
        {
          "type": "input-number",
          "name": "num1",
          "label": "数量",
          "onEvent": {
            "change": {
              "actions": [
                {
                  "actionType": "setValue",
                  "componentId": "num2_${index}",
                  "args": {
                    "value": "${num1 * 10}"
                  }
                }
              ]
            }
          }
        },
        {
          "name": "num2",
          "id": "num2_${index}",
          "label": "金额"
        }
      ],
      "addable": true,
      "footerAddBtn": {
        "label": "新增",
        "icon": "fa fa-plus",
        "hidden": true
      },
      "strictMode": true,
      "minLength": 0,
      "needConfirm": false,
      "showTableAddBtn": false
    }
  ],
  "data": {
    "table": [
      {
        "id": 1,
        "num1": 1,
        "num2": "10"
      },
      {
        "id": 2,
        "num1": "2",
        "num2": 20
      }
    ]
  }
}
```

### clear

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "button",
      "label": "清空",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "clear-input-table",
              "groupType": "component",
              "actionType": "clear"
            }
          ]
        }
      }
    },
    {
      "type": "input-table",
      "label": "表格表单",
      "id": "clear-input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "footerAddBtn": {
        "label": "新增",
        "icon": "fa fa-plus",
        "hidden": true
      },
      "strictMode": true,
      "minLength": 0,
      "needConfirm": false,
      "showTableAddBtn": false
    }
  ],
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      },
      {
        "id": 2,
        "a": "a2",
        "b": "b2"
      },
      {
        "id": 3,
        "a": "a3",
        "b": "b3"
      },
      {
        "id": 4,
        "a": "a4",
        "b": "b4"
      },
      {
        "id": 5,
        "a": "a5",
        "b": "b5"
      }
    ]
  }
}
```

### reset

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "button",
      "label": "重置",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "reset-input-table",
              "groupType": "component",
              "actionType": "reset"
            }
          ]
        }
      }
    },
    {
      "type": "input-table",
      "label": "表格表单",
      "id": "reset-input-table",
      "name": "table",
      "value": [
        {
          "a": "a-resetValue1",
          "b": "b-resetValue1"
        },
        {
          "a": "a-resetValue2",
          "b": "b-resetValue2"
        }
      ],
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "footerAddBtn": {
        "label": "新增",
        "icon": "fa fa-plus",
        "hidden": true
      },
      "strictMode": true,
      "minLength": 0,
      "needConfirm": false,
      "showTableAddBtn": false
    }
  ],
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      },
      {
        "id": 2,
        "a": "a2",
        "b": "b2"
      },
      {
        "id": 3,
        "a": "a3",
        "b": "b3"
      },
      {
        "id": 4,
        "a": "a4",
        "b": "b4"
      },
      {
        "id": 5,
        "a": "a5",
        "b": "b5"
      }
    ]
  }
}
```

### initDrag & cancelDrag

> 6.4.0 版本开始支持

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "button",
      "label": "开始表格排序",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "drag-input-table",
              "actionType": "initDrag"
            }
          ]
        }
      }
    },
    {
      "type": "button",
      "label": "放弃表格排序",
      "className": "ml-1",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "drag-input-table",
              "actionType": "cancelDrag"
            }
          ]
        }
      }
    },
    {
      "type": "input-table",
      "label": "表格表单",
      "id": "drag-input-table",
      "name": "table",
      "columns": [
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
      ],
      "addable": true,
      "footerAddBtn": {
        "label": "新增",
        "icon": "fa fa-plus",
        "hidden": true
      },
      "strictMode": true,
      "minLength": 0,
      "needConfirm": false,
      "showTableAddBtn": false
    }
  ],
  "data": {
    "table": [
      {
        "id": 1,
        "a": "a1",
        "b": "b1"
      },
      {
        "id": 2,
        "a": "a2",
        "b": "b2"
      },
      {
        "id": 3,
        "a": "a3",
        "b": "b3"
      },
      {
        "id": 4,
        "a": "a4",
        "b": "b4"
      },
      {
        "id": 5,
        "a": "a5",
        "b": "b5"
      }
    ]
  }
}
```
