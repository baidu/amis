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
  "type": "form",
  "debug": "true",
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

每一列的都可以通过 type 来将其改造成可编辑的列，比如下面的例子（建议配合 `"needConfirm": false` 来改成非确认模式）

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
      "type": "form",
      "body": [
        {
          "type": "input-table",
          "name": "table",
          "value": [
            {
              "a": 1,
              "b": 2
            },
            {
              "a": 11,
              "b": 22,
              "children": [
                {
                  "a": 111,
                  "b": 222,
                  "children": [
                    {
                      "a": 1111,
                      "b": 2222
                    }
                  ]
                }
              ]
            }
          ],
          "addable": true,
          "editable": true,
          "columns": [
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
  ]
}
```
