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

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
    "type":"input-table",
    "name":"table",
    "addable": true,
    "copyable": true,
    "editable": true,
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
      "showIndex": true,
      "type":"input-table",
      "perPage": 5,
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
        "rowClassNameExpr": "<%= data.a === 'a' ? 'bg-success' : '' %>",
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

## 属性表

| 属性名                       | 类型                                      | 默认值          | 说明                                                                                                 |
| ---------------------------- | ----------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------- | --- |
| type                         | `string`                                  | `"input-table"` | 指定为 Table 渲染器                                                                                  |
| addable                      | `boolean`                                 | `false`         | 是否可增加一行                                                                                       |
| editable                     | `boolean`                                 | `false`         | 是否可编辑                                                                                           |
| removable                    | `boolean`                                 | `false`         | 是否可删除                                                                                           |
| showTableAddBtn              | `boolean`                                 | `true`          | 是否显示表格操作栏添加按钮，前提是要开启可新增功能                                                   |
| showFooterAddBtn             | `boolean`                                 | `true`          | 是否显示表格下方添加按，前提是要开启可新增功能                                                       | 钮  |
| addApi                       | [API](../../../docs/types/api)            | -               | 新增时提交的 API                                                                                     |
| footerAddBtn                 | [SchemaNode](../../docs/types/schemanode) | -               | 底部新增按钮配置                                                                                     |
| updateApi                    | [API](../../../docs/types/api)            | -               | 修改时提交的 API                                                                                     |
| deleteApi                    | [API](../../../docs/types/api)            | -               | 删除时提交的 API                                                                                     |
| addBtnLabel                  | `string`                                  |                 | 增加按钮名称                                                                                         |
| addBtnIcon                   | `string`                                  | `"plus"`        | 增加按钮图标                                                                                         |
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
| needConfirm                  | `boolean`                                 | `true`          | 是否需要确认操作，，可用来控控制表格的操作交互                                                       |
| canAccessSuperData           | `boolean`                                 | `false`         | 是否可以访问父级数据，也就是表单中的同级数据，通常需要跟 strictMode 搭配使用                         |
| strictMode                   | `boolean`                                 | `true`          | 为了性能，默认其他表单项项值变化不会让当前表格更新，有时候为了同步获取其他表单项字段，需要开启这个。 |
| minLength                    | `number`                                  | `0`             | 最小行数, `2.4.1`版本后支持变量                                                                      |
| maxLength                    | `number`                                  | `Infinity`      | 最大行数, `2.4.1`版本后支持变量                                                                      |
| perPage                      | `number`                                  | -               | 每页展示几行数据，如果不配置则不会显示分页器                                                         |
| columns                      | `array`                                   | []              | 列信息                                                                                               |
| columns[x].quickEdit         | `boolean` 或者 `object`                   | -               | 配合 editable 为 true 一起使用                                                                       |
| columns[x].quickEditOnUpdate | `boolean` 或者 `object`                   | -               | 可以用来区分新建模式和更新模式的编辑配置                                                             |

## 事件表

当前组件会对外派发以下事件，可以通过 onEvent 来监听这些事件，并通过 actions 来配置执行的动作，在 actions 中可以通过${事件参数名}来获取事件产生的数据（< 2.3.2 及以下版本 为 ${event.data.[事件参数名]}），详细请查看事件动作。

[name]表示当前组件绑定的名称，即 name 属性，如果没有配置 name 属性，则通过 value 取值。

| 事件名称      | 事件参数                                                                                                                                                  | 说明                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| add           | `[name]: object[]` 表格数据                                                                                                                               | 点击左下角添加按钮 或 某一行右侧操作栏添加按钮时触发                 |
| addConfirm    | `index: number` 添加项的行索引 <br /> `item: object` 添加项数据 <br/> `[name]: object[]`表格数据                                                          | 开启`needConfirm`，点击添加按钮，填入数据后点击“保存”按钮后触发      |
| addSuccess    | `index: number` 添加项的行索引 <br /> `item: object` 添加项数据 <br/> `[name]: object[]`表格数据                                                          | 开启`needConfirm`并且配置`addApi`，点击“保存”后调用接口成功时触发    |
| addFail       | `index: number` 添加项的行索引 <br /> `item: object` 添加项数据 <br/> `[name]: object[]`表格数据<br />`error: object` `addApi`请求失败后返回的错误信息    | 开启`needConfirm`并且配置`addApi`，点击“保存”后调用接口失败时触发    |
| edit          | `index: number` 编辑项的行索引 <br /> `item: object` 编辑项数据 <br/> `[name]: object[]`表格数据                                                          | 点击某一行右侧操作栏“编辑”按钮时触发                                 |
| editConfirm   | `index: number` 编辑项的行索引 <br /> `item: object` 编辑项数据 <br/> `[name]: object[]`表格数据                                                          | 开启`needConfirm`，点击“编辑”按钮，填入数据后点击“保存”按钮后触发    |
| editSuccess   | `index: number` 编辑项的行索引 <br /> `item: object` 编辑项数据 <br/> `[name]: object[]`表格数据                                                          | 开启`needConfirm`并且配置`updateApi`，点击“保存”后调用接口成功时触发 |
| editFail      | `index: number` 编辑项的行索引 <br /> `item: object` 编辑项数据 <br/> `[name]: object[]`表格数据<br />`error: object` `updateApi`请求失败后返回的错误信息 | 开启`needConfirm`并且配置`updateApi`，点击“保存”后调用接口失败时触发 |
| delete        | `index: number` 删除项的行索引 <br /> `item: object` 删除项数据 <br/> `[name]: object[]`表格数据                                                          | 点击某一行右侧操作栏“删除”按钮时触发                                 |
| deleteSuccess | `index: number` 删除项的行索引 <br /> `item: object` 删除项数据 <br/> `[name]: object[]`表格数据                                                          | 配置了`deleteApi`，调用接口成功时触发                                |
| deleteFail    | `index: number` 删除项的行索引 <br /> `item: object` 删除项数据 <br/> `[name]: object[]`表格数据<br />`error: object` `deleteApi`请求失败后返回的错误信息 | 配置了`deleteApi`，调用接口失败时触发                                |
| change        | `[name]: object[]` 表格数据                                                                                                                               | 组件数据发生改变时触发                                               |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称   | 动作配置                                                                                                                           | 说明                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| addItem    | `item: object\|Array<object>` 添加的数据<br />`index: number` 指定添加的位置，如果未指定则在数据尾端插入                           | 在已有数据的基础上插入数据                                           |
| deleteItem | `condition:` 删除条件[表达式](../../../docs/concepts/expression)，用于支持批量删除的场景<br /> `index: number ` 指定删除哪一行数据 | 删除某一行数据                                                       |
| setValue   | `value: object \| Array<object>` 替换的值<br /> `index?: number` 可选，替换第几行数据，如果没有指定，则替换全部表格数据            | 替换表格数据                                                         |
| clear      | -                                                                                                                                  | 清空表格数据                                                         |
| reset      | -                                                                                                                                  | 将表格数据重置为`resetValue`，若没有配置`resetValue`，则清空表格数据 |
