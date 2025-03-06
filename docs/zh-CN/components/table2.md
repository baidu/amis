---
title: Table2 表格
description:
type: 0
group: ⚙ 组件
menuName: Table 表格
icon:
order: 67
---

表格展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像`Service`这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过`source`属性，获取数据链中的数据，完成数据展示。

## 基本用法

可配置表头（`title`）、表尾(`footer`)，同时支持文本或者 schema 类型。

```schema: scope="body"
{
  "type": "page",
  "id": "page_001",
  "data": {
    "flag": true
  },
  "body": [
    {
      "type": "button",
      "label": "启用行删除",
      "className": "m-r",
      "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "setValue",
              "componentId": "page_001",
              "args": {
                "value": {"flag": false}
              }
            }
          ]
        }
      }
    },
    {
      "type": "button",
      "label": "禁用行删除",
      "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "setValue",
              "componentId": "page_001",
              "args": {
                "value": {"flag": true}
              }
            }
          ]
        }
      }
    },
    {
      "type": "service",
      "api": "/api/sample?perPage=5",
      "body": [
        {
          "type": "table2",
          "title": "表格标题 - ${rows.length}",
          "source": "$rows",
          "canAccessSuperData": true,
          "columns": [
            {
              "title": "Engine",
              "name": "engine",
              "width": 120
            },
            {
              "title": "Version",
              "name": "version",
              "type": "property",
              "items": [
                {
                  "label": "cpu",
                  "content": "1 core"
                },
                {
                  "label": "memory",
                  "content": "4G"
                },
                {
                  "label": "disk",
                  "content": "80G"
                },
                {
                  "label": "network",
                  "content": "4M",
                  "span": 2
                },
                {
                  "label": "IDC",
                  "content": "beijing"
                },
                {
                  "label": "Note",
                  "content": "其它说明",
                  "span": 3
                }
              ]
            },
            {
              "title": "Browser",
              "name": "browser"
            },
            {
              "title": "Operation",
              "name": "operation",
              "type": "button",
              "label": "删除",
              "size": "sm",
              "disabledOn": "${flag}"
            }
          ],
          "footer": {
            "type": "tpl",
            "tpl": "表格Footer"
          }
        }
      ]
    }
  ]
}
```

## 可选择

可以通过配置`rowSelection`来支持单选或者多选，也可以配置`selectable`、`multiple`结合来实现，其中`selectable`、`multiple`的优先级更高。

### 多选

可以简单将`rowSelection`设置为`true`开启多选，也可以给`rowSelection`配置更多属性，不指定`type`则默认为多选。也可以设置`selectable`为`true`，同时`multiple`设置为`true`，同样可以开启多选。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "rowSelection": {
        "type": "checkbox",
        "keyField": "id"
      },
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "删除",
          "size": "sm"
        }
      ]
    }
  ]
}
```

### 点击整行选择

目前仅能通过`rowSelection.rowClick`属性来开启。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "rowSelection": {
        "type": "checkbox",
        "keyField": "id",
        "rowClick": true
      },
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "删除",
          "size": "sm"
        }
      ]
    }
  ]
}
```

### 已选择

通过`rowSelection.selectedRowKeys`属性来设置表格内已选中的项，可以使用`primaryField`、`rowSelection.keyField`或者`keyField`指定数据源中用来做值匹配的字段，优先级依次递减。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "rowSelection": {
        "type": "checkbox",
        "keyField": "id",
        "selectedRowKeys": [1, 2]
      },
      "columns": [
        {
          "title": "ID",
          "name": "id"
        },
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "删除",
          "size": "sm"
        }
      ]
    }
  ]
}
```

### 已选择 - 表达式

还可以使用表达式的方式来匹配已选中的项，`rowSelection.selectedRowKeysExpr`可以配置表达式。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "rowSelection": {
        "type": "checkbox",
        "keyField": "id",
        "selectedRowKeysExpr": "data.record.id === 1"
      },
      "columns": [
        {
          "title": "ID",
          "name": "id"
        },
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "删除",
          "size": "sm"
        }
      ]
    }
  ]
}
```

### 单选

设置`rowSelection.type`为`radio`或者设置`selectable`为`true`、`multiple`为`false`来实现单选，同时可通过`rowSelection.disableOn`来控制哪一行不可选，不可选情况下默认会有禁用样式，但如果行内有除文字外的其他组件，禁用样式需要自行控制。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "rowSelection": {
        "type": "radio",
        "keyField": "id",
        "disableOn": "this.record.id === 1"
      },
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser"
        }
      ]
    }
  ]
}
```

### 自定义选择菜单

内置全选`all`、反选`invert`、清空`none`、选中奇数行`odd`、选中偶数行`even`，可以通过`rowSelection.selections`自行配置，超出内置功能范围的不支持，配置了也无法使用。被禁用的行不参与计算奇偶数。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "rowSelection": {
        "type": "checkbox",
        "keyField": "id",
        "selections": [
          {
            "key": "all",
            "text": "全选所有"
          },
          {
            "key": "invert",
            "text": "反选当页"
          },
          {
            "key": "none",
            "text": "清空所有"
          },
          {
            "key": "odd",
            "text": "选择奇数行"
          },
          {
            "key": "even",
            "text": "选择偶数行"
          }
        ]
      },
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "删除",
          "size": "sm"
        }
      ]
    }
  ]
}
```

### 最大选择个数

可通过设置`maxKeepItemSelectionLength`控制表格可选中的最大个数。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "maxKeepItemSelectionLength": 2,
      "rowSelection": {
        "type": "checkbox",
        "keyField": "id"
      },
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "删除",
          "size": "sm"
        }
      ]
    }
  ]
}
```

## 筛选和排序

通过设置`column.sorter`开启列排序，只能通过`crud2`来看实际效果。通过`column.filters`开启列筛选，支持单选、多选两种模式，同样依赖`crud2`查看实际效果。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "sorter": true,
          "filterMultiple": true,
          "filters": [
            {
              "text": "Joe",
              "value": "Joe"
            },
            {
              "text": "Jim",
              "value": "Jim"
            }
          ]
        },
        {
          "title": "Version",
          "name": "version",
          "sorter": true,
          "width": 100
        },
        {
          "title": "Browser",
          "name": "browser",
          "filters": [
            {
              "text": "Joe",
              "value": "Joe"
            },
            {
              "text": "Jim",
              "value": "Jim"
            }
          ]
        }
      ]
    }
  ]
}
```

## 带边框

可通过`bordered`属性控制表格是否有边框。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "bordered": true,
      "title": "标题",
      "footer": "Footer",
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "删除",
          "size": "sm"
        }
      ]
    }
  ]
}
```

## 可展开

支持点击按钮展开/关闭当前行的自定义内容，展开按钮可放在表格的最左侧、最右侧或通过事件动作来触发展开。

### 默认展开

可简单设置`expandable`为`true`开启行展开功能，也可以在`expandable`属性上配置更多功能，`expandable.expandableOn`控制哪些行可以展开，`expandable.expandedRowKeys`控制哪些行默认展开，默认展开按钮放在表格最左侧。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "删除",
          "size": "sm"
        }
      ],
      "expandable": {
        "expandableOn": "this.record && (this.record.id === 1 || this.record.id === 3)",
        "keyField": "id",
        "expandedRowClassNameExpr": "${ rowIndex === 2 ? 'bg-success' : '' }",
        "expandedRowKeys": ["3"],
        "type": "container",
        "body": [
          {
            "type": "tpl",
            "html": "<div class=\"test\">测试测试</div>"
          }
        ]
      }
    }
  ]
}
```

### 默认展开 - 表达式

也可以通过设置`expandable.expandedRowKeysExpr`使用表达式来控制默认展开项。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "删除",
          "size": "sm"
        }
      ],
      "expandable": {
        "expandableOn": "this.record && (this.record.id === 1 || this.record.id === 3)",
        "keyField": "id",
        "expandedRowClassNameExpr": "${ rowIndex % 2 ? 'bg-success' : '' }",
        "expandedRowKeysExpr": "data.record.id == '3'",
        "type": "container",
        "body": [
          {
            "type": "tpl",
            "html": "<div class=\"test\">测试测试</div>"
          }
        ]
      }
    }
  ]
}
```

### 右侧展开按钮

通过设置`expandable.position`属性为`right`控制，支持不设置（展示在左侧）、`left`、`right`、`none`（无展开按钮）四种情况。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "删除",
          "size": "sm"
        }
      ],
      "expandable": {
        "expandableOn": "this.record && (this.record.id === 1 || this.record.id === 3)",
        "keyField": "id",
        "expandedRowClassNameExpr": "${ rowIndex % 2 ? 'bg-success' : '' }",
        "expandedRowKeys": ["3"],
        "type": "container",
        "position": "right",
        "body": [
          {
            "type": "tpl",
            "html": "<div class=\"test\">测试测试</div>"
          }
        ]
      },
      "footSummary": [
        {
          "type": "text",
          "text": "总计"
        },
        {
          "type": "tpl",
          "tpl": "测试测试",
          "colSpan": 2
        },
        {
          "type": "tpl",
          "tpl": "最后一列"
        }
      ]
    }
  ]
}
```

### 无展开按钮

设置成无展开按钮形式，通过事件动作控制展开关闭，可单独行控制。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "id": "table-select",
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "展开",
          "size": "sm",
          "onEvent": {
            "click": {
              "actions": [
                {
                  "actionType": "expand",
                  "componentId": "table-select",
                  "description": "展开行",
                  "args": {
                    "value": "${id}"
                  }
                }
              ]
            }
          }
        }
      ],
      "expandable": {
        "keyField": "id",
        "expandedRowClassNameExpr": "${ rowIndex % 2 ? 'bg-success' : '' }",
        "type": "container",
        "position": "none",
        "body": [
          {
            "type": "tpl",
            "html": "<div class=\"test\">测试测试</div>"
          }
        ]
      }
    }
  ]
}
```

也可以通过表达式一次控制多行展开关闭。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "container",
      "style": {
        "marginBottom": "5px"
      },
      "body": [
        {
          "type": "button",
          "label": "展开",
          "size": "sm",
          "onEvent": {
            "click": {
              "actions": [
                {
                  "actionType": "expand",
                  "componentId": "table-select2",
                  "description": "展开行",
                  "args": {
                    "expandedRowsExpr": "data.record?.id === 1 || data.record?.id === 3"
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      "type": "table2",
      "source": "$rows",
      "id": "table-select2",
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser"
        }
      ],
      "expandable": {
        "keyField": "id",
        "expandedRowClassNameExpr": "${ rowIndex % 2 ? 'bg-success' : '' }",
        "type": "container",
        "position": "none",
        "body": [
          {
            "type": "tpl",
            "html": "<div class=\"test\">测试测试</div>"
          }
        ]
      }
    }
  ]
}
```

## 表格行/列合并

可以通过设置`column.rowSpanExpr`来实现行合并，`column.colSpanExpr`来实现列合并。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version",
          "rowSpanExpr": "${ rowIndex === 2 ? 2 : 0 }"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Badge",
          "name": "badgeText",
          "colSpanExpr": "${ rowIndex === 6 ? 3 : 0 }"
        },
        {
          "title": "Grade",
          "name": "grade"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ]
    }
  ]
}
```

表头分组的情况下也是合并单元格，但包含分组的表头配置`column.rowSpanExpr`或者`column.colSpanExpr`无效。

```schema: scope="body"
{
  "type": "page",
  "body": [
    {
      "type": "service",
      "body": [
        {
          "type": "table2",
          "source": "$rows",
          "columns": [
            {
              "title": "key",
              "name": "key"
            },
            {
              "title": "name",
              "name": "name",
              "colSpanExpr": "${rowIndex === 1 ? 2 : 1}"
            },
            {
              "title": "age",
              "name": "age",
              "rowSpanExpr": "${rowIndex === 2 ? 1 : 0}"
            },
            {
              "title": "Home Phone",
              "name": "homephone",
              "children": [
                {
                  "title": "tel",
                  "name": "tel"
                },
                {
                  "title": "phone",
                  "name": "phone"
                }
              ]
            },
            {
              "title": "address",
              "name": "address"
            }
          ],
          "bordered": true
        }
      ],
      "data": {
        "rows": [
          {
            "key": "1",
            "name": "John Brown",
            "age": 32,
            "tel": "0571-22098909",
            "phone": 18889898989,
            "address": "New York No. 1 Lake Park"
          },
          {
            "key": "2",
            "name": "Jim Green",
            "tel": "0571-22098333",
            "phone": 18889898888,
            "age": 42,
            "address": "London No. 1 Lake Park"
          },
          {
            "key": "3",
            "name": "Joe Black",
            "age": 32,
            "tel": "0575-22098909",
            "phone": 18900010002,
            "address": "Sydney No. 1 Lake Park"
          },
          {
            "key": "4",
            "name": "Jim Red",
            "age": 18,
            "tel": "0575-22098909",
            "phone": 18900010002,
            "address": "London No. 2 Lake Park"
          },
          {
            "key": "5",
            "name": "Jake White",
            "age": 18,
            "tel": "0575-22098909",
            "phone": 18900010002,
            "address": "Dublin No. 2 Lake Park"
          }
        ]
      }
    }
  ],
  "asideResizor": false,
  "pullRefresh": {
    "disabled": true
  },
  "regions": [
    "body",
    "toolbar",
    "header"
  ]
}
```

## 固定表头

给`scroll.y`设置一个固定高度，当表格行数据超过该高度时，会自动出现滚动条。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "scroll": {"y" : 200},
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Grade",
          "name": "grade"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ]
    }
  ]
}
```

## 固定列

如果列数足够多或者设置`scroll.x`一个超出表格可视范围的宽度，表格会自动出现横向滚动条，此时可以通过`column.fixed`来固定列，保证左右滑动的时候，一些关键列始终可见。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "scroll": {"x": 1000},
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "fixed": "left",
          "width": 100
        },
        {
          "title": "Version",
          "name": "version",
          "fixed": "left",
          "width": 100
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Grade",
          "name": "grade"
        },
        {
          "title": "Platform",
          "name": "platform",
          "fixed": "right"
        }
      ]
    }
  ]
}
```

## 固定头和列

同时设置`scroll.y`和`column.fixed`，内容超过可视范围，表格会自动出现横向、纵向滚动条，实现同时固定表头和指定列。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "scroll": {"x": 1000, "y": 200},
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "fixed": "left",
          "width": 100
        },
        {
          "title": "Version",
          "name": "version",
          "type": "property",
          "width": 400,
          "items": [
            {
              "label": "cpu",
              "content": "1 core"
            },
            {
              "label": "memory",
              "content": "4G"
            },
            {
              "label": "disk",
              "content": "80G"
            },
            {
              "label": "network",
              "content": "4M",
              "span": 2
            },
            {
              "label": "IDC",
              "content": "beijing"
            },
            {
              "label": "Note",
              "content": "其它说明",
              "span": 3
            }
          ]
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Grade",
          "name": "grade"
        },
        {
          "title": "Platform",
          "name": "platform",
          "fixed": "right"
        }
      ]
    }
  ]
}
```

## 表头分组

通过`column.children`可以设置表头分组，实现多级表头，可以任意组合多级嵌套。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "scroll": {"y": 200},
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Grade",
          "name": "grade"
        },
        {
          "title": "Grade1",
          "name": "grade1",
          "children": [
            {
              "title": "Browser",
              "name": "browser"
            },
            {
              "title": "Badge",
              "name": "badgeText",
              "children": [
                {
                  "title": "ID",
                  "name": "id"
                }
              ]
            }
          ]
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ]
    }
  ]
}
```

`children`里的配置同`columns`，可以灵活组合，支持无限层级。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "scroll": {"y": 200},
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Grade",
          "name": "grade",
          "colSpanExpr": "${ rowIndex === 1 ? 3 : 0 }"
        },
        {
          "title": "Grade1",
          "name": "grade1",
          "children": [
            {
              "title": "Browser",
              "name": "browser"
            }
          ]
        },
        {
          "title": "Platform1",
          "name": "platform1",
          "children": [
            {
              "title": "Badge1",
              "name": "badgeText1",
              "children": [
                {
                  "title": "ID",
                  "name": "id"
                },
                {
                  "title": "Platform",
                  "name": "platform"
                },
                {
                  "title": "Badge",
                  "name": "badgeText"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## 拖拽排序

设置`draggable`为`true`，开启手动拖动排序。

### 默认拖拽排序

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "draggable": true,
      "keyField": "id",
      "columns": [
        {
          "title": "ID",
          "name": "id"
        },
        {
          "title": "Grade",
          "name": "grade"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Badge",
          "name": "badgeText",
          "children": [
            {
              "title": "Engine",
              "name": "engine"
            }
          ]
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ]
    }
  ]
}
```

### 嵌套拖拽排序

数据源嵌套情况下，仅允许同层级之间排序。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "service",
    "data": {
      "rows": [
        {
          "engine": "Trident",
          "browser": "Internet Explorer 4.0",
          "platform": "Win 95+",
          "version": "4",
          "grade": "X",
          "id": 1,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 1001,
              "children": [
                {
                  "engine": "Trident",
                  "browser": "Internet Explorer 4.0",
                  "platform": "Win 95+",
                  "version": "4",
                  "grade": "X",
                  "id": 10001
                },
                {
                  "engine": "Trident",
                  "browser": "Internet Explorer 5.0",
                  "platform": "Win 95+",
                  "version": "5",
                  "grade": "C",
                  "id": 10002
                }
              ]
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 1002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 5.0",
          "platform": "Win 95+",
          "version": "5",
          "grade": "C",
          "id": 2,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 2001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 2002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 5.5",
          "platform": "Win 95+",
          "version": "5.5",
          "grade": "A",
          "id": 3,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 3001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 3002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 6",
          "platform": "Win 98+",
          "version": "6",
          "grade": "A",
          "id": 4,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 4001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 4002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 7",
          "platform": "Win XP SP2+",
          "version": "7",
          "grade": "A",
          "id": 5,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 5001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 5002
            }
          ]
        }
      ]
    },
    "body": [
      {
        "type": "table2",
        "source": "$rows",
        "columns": [
          {
            "name": "engine",
            "title": "Engine"
          },
          {
            "name": "grade",
            "title": "Grade"
          },
          {
            "name": "browser",
            "title": "Browser"
          },
          {
            "name": "id",
            "title": "ID"
          },
          {
            "name": "platform",
            "title": "Platform"
          }
        ],
        "keyField": "id",
        "draggable": true
      }
    ]
  }
}
```

## 总结栏

支持在表格的顶部或底部设置总结栏。

### 顶部单行

`headSummary`设置顶部导航栏，一维数组为单行，列数和表格列不一致的情况下，需要手动设置`colSpan`来保证总结栏展示和表格对应。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "scroll": {"y": 200},
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Grade",
          "name": "grade"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ],
      "headSummary": [
        {
          "type": "text",
          "text": "总计"
        },
        {
          "type": "tpl",
          "tpl": "测试测试",
          "colSpan": 5
        }
      ],
      "rowSelection": {
        "type": "checkbox",
        "keyField": "id"
      }
    }
  ]
}
```

### 顶部多行

`headSummary`设置为二维数组实现顶部多行。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "scroll": {"y": 200},
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Grade",
          "name": "grade"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ],
      "headSummary": [
        [
          {
            "type": "text",
            "text": "总计"
          },
          {
            "type": "tpl",
            "tpl": "测试测试",
            "colSpan": 5
          }
        ],
        [
          {
            "type": "text",
            "text": "总结",
            "colSpan": 6
          }
        ]
      ],
      "rowSelection": {
        "type": "checkbox",
        "keyField": "id"
      }
    }
  ]
}
```

### 尾部单行

`footSummary`设置尾部总结行，格式同`headSummary`。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "bordered": true,
      "scroll": {"y": 200, "x": 1000},
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "fixed": "left"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Grade",
          "name": "grade"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ],
      "footSummary": [
        {
          "type": "text",
          "text": "总计",
          "fixed": 'left'
        },
        {
          "type": "tpl",
          "tpl": "测试测试",
          "colSpan": 5
        }
      ]
    }
  ]
}
```

### 尾部多行

如果二维数组中出现了非数组，那么认为是第一行的数据追加进去。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "bordered": true,
      "scroll": {"y": 200, "x": 1000},
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "fixed": "left"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Grade",
          "name": "grade"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ],
      "footSummary": [
        {
          "type": "text",
          "text": "总计",
          "colSpan": 6
        },
        [
          {
            "type": "tpl",
            "tpl": "测试测试",
            "colSpan": 5
          },
          {
            "type": "text",
            "text": "总结",
            "colSpan": 1
          }
        ]
      ]
    }
  ]
}
```

## 调整列宽

通过设置`resizable`为`true`开启列宽调整功能，开启后可以手动拖动来调整某一列的宽度。

> 注意：`resizable`开启后，固定宽度的列无法拖动调整列宽

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "scroll": {"x": 1000},
      "resizable": true,
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "align": "center"
        },
        {
          "title": "Version",
          "name": "version",
          "width": 50,
          "align": "center"
        },
        {
          "title": "Grade",
          "name": "grade"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ]
    }
  ]
}
```

## 自定义列

### 默认

可简单设置`columnsTogglable`为`true`快速开启自定义列功能，适用于列数较多的情况，可以手动控制展示或隐藏一些列。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columnsTogglable": true,
      "title": "表格的标题",
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "width": 200
        },
        {
          "title": "Version",
          "name": "version",
          "width": 200
        },
        {
          "title": "Browser",
          "name": "browser",
          "width": 200,
          "children": [
            {
              "title": "Grade",
              "name": "grade",
              "width": 200
            }
          ]
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ]
    }
  ]
}
```

### 自定义图标

如果默认的自定义列图标不能满足需求，可以通过设置`columnsTogglable.icon`来自定义图标。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columnsTogglable": {
        "icon": "fa fa-user"
      },
      "title": "表格的标题",
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "width": 200
        },
        {
          "title": "Version",
          "name": "version",
          "width": 200
        },
        {
          "title": "Browser",
          "name": "browser",
          "width": 200,
          "children": [
            {
              "title": "Grade",
              "name": "grade",
              "width": 200
            }
          ]
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ]
    }
  ]
}
```

## 数据为空

可以通过`placeholder`自定义数据为空时的展示内容，支持文本或者 schema 类型。

```schema
{
  "type": "table2",
  "data": {
    "items": []
  },
  "columns": [
    {
      "title": "Engine",
      "name": "engine",
      "width": 200
    },
    {
      "title": "Version",
      "name": "version",
      "width": 200
    },
    {
      "title": "Browser",
      "name": "browser",
      "width": 200,
      "children": [
        {
          "title": "Grade",
          "name": "grade",
          "width": 200
        }
      ]
    },
    {
      "title": "Platform",
      "name": "platform",
      "children": [
        {
          "title": "Badge",
          "name": "badgeText"
        }
      ]
    }
  ],
  "placeholder": "暂无数据"
}
```

## 数据加载中

可以通过`loading`自定义数据加载时的展示内容，支持布尔或者 schema 类型。

```schema
{
  "type": "table2",
  "data": {
    "items": []
  },
  "columns": [
    {
      "title": "Engine",
      "name": "engine",
      "width": 200
    },
    {
      "title": "Version",
      "name": "version",
      "width": 200
    },
    {
      "title": "Browser",
      "name": "browser",
      "width": 200,
      "children": [
        {
          "title": "Grade",
          "name": "grade",
          "width": 200
        },
        {
          "title": "Badge",
          "name": "badgeText",
          "children": [
            {
              "title": "Platform",
              "name": "platform"
            }
          ]
        }
      ]
    }
  ],
  "loading": true
}
```

## 树形结构

当行数据中存在 children 属性时，可以自动嵌套显示下去。也可以通过设置 childrenColumnName 进行配置。

### 默认嵌套

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "service",
    "data": {
      "rows": [
        {
          "engine": "Trident1",
          "browser": "Internet Explorer 4.0",
          "platform": "Win 95+",
          "version": "4",
          "grade": "X",
          "id": 1,
          "children": [
            {
              "engine": "Trident1-1",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 1001,
              "children": [
                {
                  "engine": "Trident1-1-1",
                  "browser": "Internet Explorer 4.0",
                  "platform": "Win 95+",
                  "version": "4",
                  "grade": "X",
                  "id": 10001
                },
                {
                  "engine": "Trident1-1-2",
                  "browser": "Internet Explorer 5.0",
                  "platform": "Win 95+",
                  "version": "5",
                  "grade": "C",
                  "id": 10002
                }
              ]
            },
            {
              "engine": "Trident1-2",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 1002
            }
          ]
        },
        {
          "engine": "Trident2",
          "browser": "Internet Explorer 5.0",
          "platform": "Win 95+",
          "version": "5",
          "grade": "C",
          "id": 2,
          "children": [
            {
              "engine": "Trident2-1",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 2001
            },
            {
              "engine": "Trident2-2",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 2002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 5.5",
          "platform": "Win 95+",
          "version": "5.5",
          "grade": "A",
          "id": 3,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 3001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 3002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 6",
          "platform": "Win 98+",
          "version": "6",
          "grade": "A",
          "id": 4,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 4001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 4002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 7",
          "platform": "Win XP SP2+",
          "version": "7",
          "grade": "A",
          "id": 5,
          "children":[
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 5001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 5002
            }
          ]
        }
      ]
    },
    "body": [
      {
        "type": "table2",
        "source": "$rows",
        "columns": [
          {
            "name": "id",
            "title": "ID"
          },
          {
            "name": "engine",
            "title": "Engine"
          },
          {
            "name": "grade",
            "title": "Grade"
          },
          {
            "name": "version",
            "title": "Version"
          },
          {
            "name": "browser",
            "title": "Browser"
          },
          {
            "name": "id",
            "title": "ID"
          },
          {
            "name": "platform",
            "title": "Platform"
          }
        ],
        "keyField": "id"
      }
    ]
  }
}
```

### 多选嵌套

嵌套模式下表格支持多选的同时支持级联选中。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "service",
    "data": {
      "rows": [
        {
          "engine": "Trident",
          "browser": "Internet Explorer 4.0",
          "platform": "Win 95+",
          "version": "4",
          "grade": "X",
          "id": 1,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 1001,
              "children": [
                {
                  "engine": "Trident",
                  "browser": "Internet Explorer 4.0",
                  "platform": "Win 95+",
                  "version": "4",
                  "grade": "X",
                  "id": 10001
                },
                {
                  "engine": "Trident",
                  "browser": "Internet Explorer 5.0",
                  "platform": "Win 95+",
                  "version": "5",
                  "grade": "C",
                  "id": 10002
                }
              ]
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 1002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 5.0",
          "platform": "Win 95+",
          "version": "5",
          "grade": "C",
          "id": 2,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 2001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 2002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 5.5",
          "platform": "Win 95+",
          "version": "5.5",
          "grade": "A",
          "id": 3,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 3001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 3002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 6",
          "platform": "Win 98+",
          "version": "6",
          "grade": "A",
          "id": 4,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 4001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 4002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 7",
          "platform": "Win XP SP2+",
          "version": "7",
          "grade": "A",
          "id": 5,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 5001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 5002
            }
          ]
        }
      ]
    },
    "body": [
      {
        "type": "table2",
        "source": "$rows",
        "columns": [
          {
            "name": "id",
            "title": "ID"
          },
          {
            "name": "engine",
            "title": "Engine"
          },
          {
            "name": "grade",
            "title": "Grade"
          },
          {
            "name": "version",
            "title": "Version"
          },
          {
            "name": "browser",
            "title": "Browser"
          },
          {
            "name": "id",
            "title": "ID"
          },
          {
            "name": "platform",
            "title": "Platform"
          }
        ],
        "keyField": "id",
        "rowSelection": {
          "type": "checkbox",
          "keyField": "id"
        }
      }
    ]
  }
}
```

### 单选嵌套

单选情况下，不同层级之间都是互斥选择。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "service",
    "data": {
      "rows": [
        {
          "engine": "Trident",
          "browser": "Internet Explorer 4.0",
          "platform":  "Win 95+",
          "version": "4",
          "grade": "X",
          "id": 1,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 1001,
              "children": [
                {
                  "engine": "Trident",
                  "browser": "Internet Explorer 4.0",
                  "platform": "Win 95+",
                  "version": "4",
                  "grade": "X",
                  "id": 10001
                },
                {
                  "engine": "Trident",
                  "browser": "Internet Explorer 5.0",
                  "platform": "Win 95+",
                  "version": "5",
                  "grade": "C",
                  "id": 10002
                }
              ]
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 1002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 5.0",
          "platform": "Win 95+",
          "version": "5",
          "grade": "C",
          "id": 2,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 2001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 2002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 5.5",
          "platform": "Win 95+",
          "version": "5.5",
          "grade": "A",
          "id": 3,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 3001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 3002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 6",
          "platform": "Win 98+",
          "version": "6",
          "grade": "A",
          "id": 4,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 4001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 4002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 7",
          "platform": "Win XP SP2+",
          "version": "7",
          "grade": "A",
          "id": 5,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 5001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 5002
            }
          ]
        }
      ]
    },
    "body": [
      {
        "type": "table2",
        "source": "$rows",
        "columns": [
          {
            "name": "engine",
            "title": "Engine"
          },
          {
            "name": "grade",
            "title": "Grade"
          },
          {
            "name": "version",
            "title": "Version"
          },
          {
            "name": "browser",
            "title": "Browser"
          },
          {
            "name": "id",
            "title": "ID"
          },
          {
            "name": "platform",
            "title": "Platform"
          }
        ],
        "keyField": "id",
        "rowSelection": {
          "type": "radio",
          "keyField": "id"
        }
      }
    ]
  }
}
```

### 缩进设置

嵌套模式下可以通过`indentSize`来设置每一层级的缩进值。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "service",
    "data":{
      "rows": [
        {
          "engine": "Trident",
          "browser": "Internet Explorer 4.0",
          "platform": "Win 95+",
          "version": "4",
          "grade": "X",
          "id": 1,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 1001,
              "children": [
                {
                  "engine": "Trident",
                  "browser": "Internet Explorer 4.0",
                  "platform": "Win 95+",
                  "version": "4",
                  "grade": "X",
                  "id": 10001
                },
                {
                  "engine": "Trident",
                  "browser": "Internet Explorer 5.0",
                  "platform": "Win 95+",
                  "version": "5",
                  "grade": "C",
                  "id": 10002
                }
              ]
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 1002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 5.0",
          "platform": "Win 95+",
          "version": "5",
          "grade": "C",
          "id": 2,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 2001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 2002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 5.5",
          "platform": "Win 95+",
          "version": "5.5",
          "grade": "A",
          "id": 3,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 3001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 3002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 6",
          "platform": "Win 98+",
          "version": "6",
          "grade": "A",
          "id": 4,
          "children": [
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id": 4001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id": 4002
            }
          ]
        },
        {
          "engine": "Trident",
          "browser": "Internet Explorer 7",
          "platform": "Win XP SP2+",
          "version": "7",
          "grade": "A",
          "id":5,
          "children":[
            {
              "engine": "Trident",
              "browser": "Internet Explorer 4.0",
              "platform": "Win 95+",
              "version": "4",
              "grade": "X",
              "id":5001
            },
            {
              "engine": "Trident",
              "browser": "Internet Explorer 5.0",
              "platform": "Win 95+",
              "version": "5",
              "grade": "C",
              "id":5002
            }
          ]
        }
      ]
    },
    "body":[
      {
        "type": "table2",
        "source": "$rows",
        "columns":[
          {
            "name": "engine",
            "title": "Engine"
          },
          {
            "name": "grade",
            "title": "Grade"
          },
          {
            "name": "version",
            "title": "Version"
          },
          {
            "name": "browser",
            "title": "Browser"
          },
          {
            "name": "id",
            "title": "ID"
          },
          {
            "name": "platform",
            "title": "Platform"
          }
        ],
        "keyField": "id",
        "rowSelection":{
          "type": "checkbox",
          "keyField": "id"
        },
        "indentSize": 20
      }
    ]
  }
}
```

## 列搜索

通过设置`column.searchable`为`true`快速开启列搜索功能。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "width": 200
        },
        {
          "title": "Version",
          "name": "version",
          "width": 200,
          "searchable": true
        },
        {
          "title": "Browser",
          "name": "browser",
          "width": 200,
          "children": [
            {
              "title": "Grade",
              "name": "grade",
              "width": 200
            }
          ]
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ]
    }
  ]
}
```

## 粘性头部

设置`sticky`为`true`开启粘性头部。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "title": "表格的标题",
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "width": 200
        },
        {
          "title": "Version",
          "name": "version",
          "width": 200
        },
        {
          "title": "Browser",
          "name": "browser",
          "width": 200,
          "children": [
            {
              "title": "Grade",
              "name": "grade",
              "width": 200
            }
          ]
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ],
      "sticky": true
    }
  ]
}
```

## 表格尺寸

通过设置`size`属性来控制表格尺寸，支持`large`、`default`、`small`，`default`是中等尺寸。

### 最大尺寸

`large`是最大尺寸。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "size": "large",
      "rowSelection": {
        "type": "checkbox",
        "keyField": "id"
      },
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "sorter": true,
          "tpl": "${engine|truncate:5}"
        },
        {
          "title": "Version",
          "name": "version",
          "sorter": true,
          "filterMultiple": true,
          "filters": [
            {
              "text": "Joe",
              "value": "Joe"
            },
            {
              "text": "Jim",
              "value": "Jim"
            }
          ]
        },
        {
          "type": "tpl",
          "title": "Browser",
          "name": "browser",
          "tpl": "${browser|truncate:5}",
          "searchable": true
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ],
      "footSummary": [
        {
          "type": "text",
          "text": "总计",
          "fixed": "left"
        },
        {
          "type": "tpl",
          "tpl": "测试测试",
          "colSpan": 5
        }
      ]
    }
  ]
}
```

### 默认尺寸

默认尺寸是`default`，即中等尺寸。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "rowSelection": {
        "type": "checkbox",
        "keyField": "id"
      },
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "sorter": true,
          "tpl": "${engine|truncate:5}"
        },
        {
          "title": "Version",
          "name": "version",
          "sorter": true,
          "filterMultiple": true,
          "filters": [
            {
              "text": "Joe",
              "value": "Joe"
            },
            {
              "text": "Jim",
              "value": "Jim"
            }
          ]
        },
        {
          "type": "tpl",
          "title": "Browser",
          "name": "browser",
          "tpl": "${engine|truncate:5}",
          "searchable": true
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ],
      "footSummary": [
        {
          "type": "text",
          "text": "总计",
          "fixed": "left"
        },
        {
          "type": "tpl",
          "tpl": "测试测试",
          "colSpan": 5
        }
      ]
    }
  ]
}
```

### 小尺寸

`size`设置为`small`是最小尺寸。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "size": "small",
      "rowSelection": {
        "type": "checkbox",
        "keyField": "id"
      },
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "sorter": true,
          "tpl": "${engine|truncate:5}"
        },
        {
          "title": "Version",
          "name": "version",
          "sorter": true,
          "filterMultiple": true,
          "filters": [
            {
              "text": "Joe",
              "value": "Joe"
            },
            {
              "text": "Jim",
              "value": "Jim"
            }
          ]
        },
        {
          "type": "tpl",
          "title": "Browser",
          "name": "browser",
          "tpl": "${engine|truncate:5}",
          "searchable": true
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ],
      "footSummary": [
        {
          "type": "text",
          "text": "总计",
          "fixed": "left"
        },
        {
          "type": "tpl",
          "tpl": "测试测试",
          "colSpan": 5
        }
      ]
    }
  ]
}
```

## 可复制

给列配置`copyable`属性即可开启列内容复制功能。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "title": "表格的标题",
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
          "width": 200
        },
        {
          "title": "Version",
          "name": "version",
          "copyable": true
        },
        {
          "title": "Browser",
          "name": "browser",
          "width": 200
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ]
    }
  ]
}
```

## 弹出框

可以给列配置上`popOver`属性，默认会在该列内容区里渲染一个图标，点击会显示弹出框，用于展示全部内容。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser",
          "copyable": true,
          "popOver": {
            "body": {
              "type": "tpl",
              "tpl": "详细信息：${browser}"
            }
          }
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ]
    }
  ]
}
```

也可以设置图标不展示，结合`truncate`实现内容自动省略，其余可点击/悬浮查看更多。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "type": "tpl",
          "title": "Browser",
          "name": "browser",
          "tpl": "${engine|truncate:5}",
          "popOver": {
            "trigger": "hover",
            "position": "left-top",
            "showIcon": false,
            "body": {
              "type": "tpl",
              "tpl": "${browser}"
            }
          }
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ]
    }
  ]
}
```

可以给列配置上`textOverflow`属性，设置为`ellipsis`，可实现内容超出省略，悬浮查看更多。
可搭配`popOver`属性，来控制弹出框的信息，需要设置图标不展示。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columns": [
        {
          "title": "Engine",
          "name": "engine",
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "type": "tpl",
          "title": "Browser",
          "name": "browser",
          "tpl": "${browser+'--'+browser}",
          "textOverflow": "ellipsis",
          "popOver": {
            "trigger": "hover",
            "position": "right-top-center-bottom",
            "showIcon": false,
            "body": {
              "type": "tpl",
              "tpl": "${browser}"
            }
          }
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ]
    }
  ]
}
```

可以给列配置`popOverEnableOn`属性，该属性为表达式，来控制当前行是否启动`popOver`功能。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=6",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columns": [
        {
          "title": "ID",
          "name": "id",
          "popOver": {
            "body": {
              "type": "tpl",
              "tpl": "${id}"
            }
          },
          "popOverEnableOn": "this.id == 1"
        },
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        },
        {
          "title": "Browser",
          "name": "browser",
          "popOver": {
            "body": {
              "type": "tpl",
              "tpl": "${browser}"
            }
          }
        },
        {
          "title": "Badge",
          "name": "badgeText"
        },
        {
          "title": "Platform",
          "name": "platform"
        }
      ]
    }
  ]
}
```

## 行角标

通过属性`itemBadge`，可以为表格行配置[角标](./badge)，可以使用[数据映射](../../../docs/concepts/data-mapping)为每一行添加特定的 Badge 属性。[`visibleOn`](../../../docs/concepts/expression)属性控制显示的条件，表达式中`this`可以取到行所在上下文的数据，比如行数据中有`badgeText`字段才显示角标，可以设置`"visibleOn": "this.badgeText"`。

```schema: scope="body"
{
  "type": "service",
  "body": {
    "type": "table2",
    "source": "${table}",
    "syncLocation": false,
    "showBadge": true,
    "itemBadge": {
      "text": "${badgeText}",
      "mode": "ribbon",
      "position": "top-left",
      "level": "${badgeLevel}",
      "visibleOn": "this.badgeText"
    },
    "columns": [
      {
        "name": "id",
        "title": "ID",
        "searchable": {
          "type": "input-text",
          "name": "id",
          "label": "主键",
          "placeholder": "输入id",
          "size": "sm",
        }
      },
      {
        "name": "engine",
        "title": "Rendering engine"
      },
      {
        "name": "browser",
        "title": "Browser",
        "searchable": {
          "type": "select",
          "name": "browser",
          "label": "浏览器",
          "placeholder": "选择浏览器",
          "size": "sm",
          "options": [
            {
              "label": "Internet Explorer ",
              "value": "ie"
            },
            {
              "label": "AOL browser",
              "value": "aol"
            },
            {
              "label": "Firefox",
              "value": "firefox"
            }
          ]
        }
      },
      {
        "name": "platform",
        "title": "Platform(s)"
      },
      {
        "name": "version",
        "title": "Engine version",
        "searchable": {
          "type": "input-number",
          "name": "version",
          "label": "版本号",
          "placeholder": "输入版本号",
          "size": "sm",
          "mode": "horizontal"
        }
      },
      {
        "name": "grade",
        "title": "CSS grade"
      }
    ]
  },
  data: {
    table: [
      {
        "id": 1,
        "engine": "Trident",
        "browser": "Internet Explorer 4.0",
        "platform": "Win 95+",
        "version": "4",
        "grade": "X",
        "badgeText": "默认",
        "badgeLevel": "info"
      },
      {
        "id": 2,
        "engine": "Trident",
        "browser": "Internet Explorer 5.0",
        "platform": "Win 95+",
        "version": "5",
        "grade": "C",
        "badgeText": "危险",
        "badgeLevel": "danger"
      },
      {
        "id": 3,
        "engine": "Trident",
        "browser": "Internet Explorer 5.5",
        "platform": "Win 95+",
        "version": "5.5",
        "grade": "A"
      },
      {
        "id": 4,
        "engine": "Trident",
        "browser": "Internet Explorer 6",
        "platform": "Win 98+",
        "version": "6",
        "grade": "A"
      },
      {
        "id": 5,
        "engine": "Trident",
        "browser": "Internet Explorer 7",
        "platform": "Win XP SP2+",
        "version": "7",
        "grade": "A"
      }
    ]
  }
}
```

## 表头提示

通过设置列属性`remark`，可为每一列的表头增加提示信息。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
      {
        "type": "table2",
        "source": "$rows",
        "columns": [
          {
            "title": "Engine",
            "name": "engine",
            "remark": "表头提示"
          },
          {
            "title": "Version",
            "name": "version"
          },
          {
            "title": "Browser",
            "name": "browser"
          },
          {
            "title": "Badge",
            "name": "badgeText"
          },
          {
            "title": "Grade",
            "name": "grade"
          },
          {
            "title": "Platform",
            "name": "platform"
          }
        ]
      }
    ]
  }
}
```

## 快速编辑

可以通过给列配置：`"quickEdit": true`，Table 配置：`quickSaveApi`，可以实现表格内快速编辑并批量保存的功能。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "service",
    "api": "/api/sample?perPage=5",
    "id": "service-container",
    "body": [
      {
        "type": "table2",
        "source": "$rows",
        "quickSaveApi": {
          "url": "/api/mock2/sample/bulkUpdate",
          "method": "put"
        },
        "draggable": true,
        "onEvent": {
          "quickSaveSubmitted": {
            "actions": [
              {
                "actionType": "reload",
                "componentId": "service-container"
              }
            ]
          },
          "orderChange": {
            "actions": [
              {
                "actionType": "reload",
                "componentId": "service-container"
              }
            ]
          }
        },
        "columns": [
          {
            "title": "Engine",
            "name": "engine",
            "quickEdit": true
          },
          {
            "title": "Version",
            "name": "version"
          },
          {
            "title": "Browser",
            "name": "browser"
          },
          {
            "title": "Badge",
            "name": "badgeText"
          }
        ]
      }
    ]
  }
}
```

#### 指定编辑表单项类型

`quickEdit`也可以配置对象形式，可以指定编辑表单项的类型，例如`"type": "select"`。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
      {
        "type": "table2",
        "source": "$rows",
        "quickSaveApi": {
          "url": "/api/mock2/sample/bulkUpdate",
          "method": "put"
        },
        "columns": [
          {
            "name": "id",
            "title": "ID"
          },
          {
            "name": "grade",
            "title": "CSS grade",
            "quickEdit": {
              "type": "select",
              "options": [
                "A",
                "B",
                "C",
                "D",
                "X"
              ]
            }
          }
        ]
      }
    ]
  }
}
```

#### 快速编辑多个表单项

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
      {
        "type": "table2",
        "source": "$rows",
        "quickSaveApi": {
          "url": "/api/mock2/sample/bulkUpdate",
          "method": "put"
        },
        "columns": [
          {
            "name": "id",
            "title": "ID"
          },
          {
            "name": "grade",
            "title": "CSS grade",
            "quickEdit": {
              "body": [
                {
                  "type": "select",
                  "name": "grade",
                  "options": [
                    "A",
                    "B",
                    "C",
                    "D",
                    "X"
                  ]
                },
                {
                  "label": "id",
                  "type": "input-text",
                  "name": "id"
                }
              ]
            }
          }
        ]
      }
    ]
  }
}
```

#### 内联模式

配置`quickEdit`的`mode`为`inline`。可以直接将编辑表单项渲染至表格内，可以直接操作编辑。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
      {
        "type": "table2",
        "source": "$rows",
        "quickSaveApi": {
          "url": "/api/mock2/sample/bulkUpdate",
          "method": "put"
        },
        "columns": [
          {
            "name": "id",
            "title": "ID"
          },
          {
            "name": "grade",
            "title": "CSS grade",
            "quickEdit": {
              "mode": "inline",
              "type": "select",
              "size": "xs",
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
            "name": "switch",
            "title": "switch",
            "quickEdit": {
              "mode": "inline",
              "type": "switch",
              "onText": "开启",
              "offText": "关闭"
            }
          }
        ]
      }
    ]
  }
}
```

#### 即时保存

如果想编辑完表单项之后，不想点击顶部确认按钮来进行保存，而是即时保存当前标记的数据，则需要配置 `quickEdit` 中的 `"saveImmediately": true`，然后配置接口`quickSaveItemApi`，可以直接将编辑表单项渲染至表格内操作。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
      {
        "type": "table2",
        "source": "$rows",
        "quickSaveItemApi": {
          "url": "/api/mock2/sample/$id",
          "method": "put"
        },
        "columns": [
          {
            "name": "id",
            "title": "ID"
          },
          {
            "name": "grade",
            "title": "CSS grade",
            "quickEdit": {
              "mode": "inline",
              "type": "select",
              "size": "xs",
              "options": [
                "A",
                "B",
                "C",
                "D",
                "X"
              ],
              "saveImmediately": true
            }
          },
          {
            "name": "switch",
            "title": "switch",
            "quickEdit": {
              "mode": "inline",
              "type": "switch",
              "onText": "开启",
              "offText": "关闭",
              "saveImmediately": true
            }
          }
        ]
      }
    ]
  }
}
```

你也可以在`saveImmediately`中配置 api，实现即时保存。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
      {
        "type": "table2",
        "source": "$rows",
        "columns": [
          {
            "name": "id",
            "title": "ID"
          },
          {
            "name": "grade",
            "title": "CSS grade",
            "quickEdit": {
              "mode": "inline",
              "type": "select",
              "size": "xs",
              "options": [
                "A",
                "B",
                "C",
                "D",
                "X"
              ],
              "saveImmediately": {
                "api": "/api/mock2/sample/$id"
              }
            }
          },
          {
            "name": "switch",
            "title": "switch",
            "quickEdit": {
              "mode": "inline",
              "type": "switch",
              "onText": "开启",
              "offText": "关闭",
              "saveImmediately": {
                "api": "/api/mock2/sample/$id"
              }
            }
          }
        ]
      }
    ]
  }
}
```

## 列样式

可以通过设置`columns`中的`className`控制整列样式。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version",
          "className": "text-primary"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "删除",
          "size": "sm"
        }
      ]
    }
  ]
}
```

也可以通过`titleClassName`单独控制表头对应单元格的样式。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version",
          "className": "text-primary",
          "titleClassName": "font-bold"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "删除",
          "size": "sm"
        }
      ]
    }
  ]
}
```

## 单元格样式

可以通过设置`columns`的`classNameExpr`，根据数据动态添加单元格 CSS 类，支持模版语法。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version",
          "classNameExpr": "${ version > 5 ? 'text-danger' : '' }"
        },
        {
          "title": "Browser",
          "name": "browser"
        },
        {
          "title": "Operation",
          "name": "operation",
          "type": "button",
          "label": "删除",
          "size": "sm"
        }
      ]
    }
  ]
}
```

## 行操作按钮

通过设置`itemActions`可以设置鼠标移动到行上出现操作按钮。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=5",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "itemActions": [
        {
          "label": "编辑",
          "type": "button",
          "actionType": "dialog",
          "dialog": {
            "title": "编辑",
            "body": "这是个简单的编辑弹框"
          }
        },
        {
          "label": "删除",
          "type": "button",
          "actionType": "ajax",
          "confirmText": "确认要删除？",
          "api": "/api/mock2/form/saveForm"
        }
      ],
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        }
      ]
    }
  ]
}
```

固定表头情况下，展示行操作按钮。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/sample?perPage=20",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "itemActions": [
        {
          "label": "编辑",
          "type": "button",
          "actionType": "dialog",
          "dialog": {
            "title": "编辑",
            "body": "这是个简单的编辑弹框"
          }
        },
        {
          "label": "删除",
          "type": "button",
          "actionType": "ajax",
          "confirmText": "确认要删除？",
          "api": "/api/mock2/form/saveForm"
        }
      ],
      "scroll": {
        "y": 100
      },
      "columns": [
        {
          "title": "Engine",
          "name": "engine"
        },
        {
          "title": "Version",
          "name": "version"
        }
      ]
    }
  ]
}
```

## 属性表

| 属性名           | 类型                                                     | 默认值                    | 说明                                                                      |
| ---------------- | -------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------- |
| type             | `string`                                                 |                           | `"type"` 指定为 table 渲染器                                              |
| title            | `string`                                                 |                           | 标题                                                                      |
| source           | `string`                                                 | `${items}`                | 数据源, 绑定当前环境变量                                                  |
| sticky           | `boolean`                                                | `false`                   | 是否粘性头部                                                              |
| footer           | `string` \| `Schema`                                     |                           | 表格尾部                                                                  |
| loading          | `boolean`                                                |                           | 表格是否加载中                                                            |
| columnsTogglable | `auto` 或者 `boolean`                                    | `auto`                    | 展示列显示开关, 自动即：列数量大于或等于 5 个时自动开启                   |
| placeholder      | `string` \| `Schema`                                     | `暂无数据`                | 当没数据的时候的文字提示                                                  |
| rowSelection     | `rowSelection`                                           |                           | 行相关配置                                                                |
| rowClassNameExpr | `string`                                                 |                           | 行 CSS 类名，支持模版语法                                                 |
| expandable       | `Expandable`                                             |                           | 展开行配置                                                                |
| lineHeight       | `large` \| `middle`                                      |                           | 行高设置                                                                  |
| footerClassName  | `string`                                                 | `Action.md-table-footer`  | 底部外层 CSS 类名                                                         |
| toolbarClassName | `string`                                                 | `Action.md-table-toolbar` | 工具栏 CSS 类名                                                           |
| columns          | `Array<Column>`                                          |                           | 用来设置列信息                                                            |
| combineNum       | `number`                                                 |                           | 自动合并单元格                                                            |
| itemActions      | Array<[Action](./action-button)>                         |                           | 悬浮行操作按钮组                                                          |
| itemCheckableOn  | [表达式](../../docs/concepts/expression)                 |                           | 配置当前行是否可勾选的条件，要用 [表达式](../../docs/concepts/expression) |
| itemDraggableOn  | [表达式](../../docs/concepts/expression)                 |                           | 配置当前行是否可拖拽的条件，要用 [表达式](../../docs/concepts/expression) |
| checkOnItemClick | `boolean`                                                | `false`                   | 点击数据行是否可以勾选当前行                                              |
| rowClassName     | `string`                                                 |                           | 给行添加 CSS 类名                                                         |
| rowClassNameExpr | [模板](../../docs/concepts/template)                     |                           | 通过模板给行添加 CSS 类名                                                 |
| prefixRow        | `Array`                                                  |                           | 顶部总结行                                                                |
| affixRow         | `Array`                                                  |                           | 底部总结行                                                                |
| itemBadge        | [`BadgeSchema`](./badge)                                 |                           | 行角标配置                                                                |
| autoFillHeight   | `boolean` 丨 `{height: number}` 丨 `{maxHeight: number}` |                           | 内容区域自适应高度，可选择自适应、固定高度和最大高度                      |
| lazyRenderAfter  | `number`                                                 | 100                       | 默认数据超过 100 条启动懒加载提升渲染性能，也可通过自定义该属性调整数值   |

## 行配置属性表

| 属性名              | 类型                               | 默认值     | 说明                                                                                                               |
| ------------------- | ---------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| type                | `checkbox` \| `radio`              | `checkbox` | 指定单选还是多选                                                                                                   |
| fixed               | `boolean`                          |            | 选择列是否固定，只能左侧固定                                                                                       |
| keyField            | `string`                           | `key`      | 对应数据源的 key 值，默认是`key`，可指定为`id`、`shortId`等                                                        |
| disableOn           | `string`                           |            | 当前行是否可选择条件，要用 [表达式](../../docs/concepts/expression)                                                |
| selections          | `selections`                       |            | 自定义筛选菜单，内置`all`（全选）、`invert`（反选）、`none`（取消选择）、`odd`（选择奇数项）、`even`（选择偶数项） |
| selectedRowKeys     | `Array<string>` \| `Array<number>` |            | 已选择项                                                                                                           |
| selectedRowKeysExpr | `string`                           |            | 已选择项表达式                                                                                                     |
| columnWidth         | `number`                           |            | 自定义选择列列宽                                                                                                   |
| rowClick            | `boolean`                          |            | 单条任意区域选中                                                                                                   |
| rowClickIgControl   | `boolean`                          |            | 点击控件时也会触发 rowClick 事件                                                                                   |

### 选择菜单配置属性表

| 属性名 | 类型                                           | 默认值 | 说明                                                       |
| ------ | ---------------------------------------------- | ------ | ---------------------------------------------------------- |
| key    | `all` \| `invert` \| `none` \| `odd` \| `even` | `all`  | 菜单类型，内置全选、反选、取消选择、选择奇数项、选择偶数项 |
| text   | `string`                                       |        | 自定义菜单项文本                                           |

## 展开行配置属性表

| 属性名              | 类型                               | 默认值 | 说明                                                                                                               |
| ------------------- | ---------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| expandableOn        | `string`                           |        | 指定可展开的行，要用 [表达式](../../docs/concepts/expression)                                                      |
| keyField            | `string`                           | `key`  | 对应数据源的 key 值，默认是`key`，可指定为`id`、`shortId`等                                                        |
| disableOn           | `string`                           |        | 当前行是否可选择条件，要用 [表达式](../../docs/concepts/expression)                                                |
| selections          | `selections`                       |        | 自定义筛选菜单，内置`all`（全选）、`invert`（反选）、`none`（取消选择）、`odd`（选择奇数项）、`even`（选择偶数项） |
| selectedRowKeys     | `Array<string>` \| `Array<number>` |        | 已选择项                                                                                                           |
| selectedRowKeysExpr | `string`                           |        | 已选择项表达式                                                                                                     |
| columnWidth         | `number`                           |        | 自定义选择列列宽                                                                                                   |

## 列配置属性表

| 属性名       | 类型                                          | 默认值    | 说明                                                                                                           |
| ------------ | --------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------- |
| label        | [模板](../../docs/concepts/template)          |           | 表头文本内容                                                                                                   |
| name         | `string`                                      |           | 通过名称关联数据                                                                                               |
| fixed        | `left` \| `right` \| `none`                   |           | 是否固定当前列                                                                                                 |
| popOver      |                                               |           | 弹出框                                                                                                         |
| quickEdit    |                                               |           | 快速编辑                                                                                                       |
| copyable     | `boolean` 或 `{icon: string, content:string}` |           | 是否可复制                                                                                                     |
| sortable     | `boolean`                                     | `false`   | 是否可排序                                                                                                     |
| searchable   | `boolean` \| `Schema`                         | `false`   | 是否可快速搜索                                                                                                 |
| width        | `number` \| `string`                          | 列宽      |
| remark       |                                               |           | 提示信息                                                                                                       |
| textOverflow | `string`                                      | `default` | 文本溢出后展示形式，默认换行处理。可选值 `ellipsis` 溢出隐藏展示， `noWrap` 不换行展示(仅在列为静态文本时生效) |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细查看[事件动作](../../docs/concepts/event-action)。

| 事件名称           | 事件参数                                                                                  | 说明                             |
| ------------------ | ----------------------------------------------------------------------------------------- | -------------------------------- |
| selectedChange     | `selectedItems: item[]` 已选择行<br/>`unSelectedItems: item[]` 未选择行                   | 手动选择表格项时触发             |
| columnSort         | `orderBy: string` 列排序列名<br/>`orderDir: string` 列排序值                              | 点击列排序时触发                 |
| columnFilter       | `filterName: string` 列筛选列名<br/>`filterValue: string` 列筛选值                        | 点击列筛选时触发                 |
| columnSearch       | `searchName: string` 列搜索列名<br/>`searchValue: string` 列搜索数据                      | 点击列搜索时触发                 |
| orderChange        | `movedItems: item[]` 已排序数据                                                           | 手动拖拽行排序时触发             |
| columnToggled      | `columns: item[]` 当前显示的列配置数据                                                    | 点击自定义列时触发               |
| rowClick           | `item: object` 行点击数据<br/>`index: number` 行索引                                      | 单击整行时触发                   |
| rowDbClick         | `item: object` 行点击数据<br/>`index: number` 行索引                                      | 双击整行时触发                   |
| rowMouseEnter      | `item: object` 行移入数据<br/>`index: number` 行索引                                      | 移入整行时触发                   |
| rowMouseLeave      | `item: object` 行移出数据<br/>`index: number` 行索引                                      | 移出整行时触发                   |
| quickSaveSubmitted | `item: object` 快速编辑相关数据，包括源数据、修改后的数据、修改的行数索引、没有变动的数据 | 成功调用 `quickSaveApi` 之后触发 |

### selectedChange

在开启批量操作后才会用到，可以尝试勾选列表的行记录。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "selectable": true,
      "onEvent": {
        "selectedChange": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msg": "已选择${event.data.selectedItems.length}条记录"
              }
            }
          ]
        }
      },
      "columns": [
        {
          "name": "id",
          "label": "ID"
        },
        {
          "name": "engine",
          "label": "Rendering engine"
        },
        {
          "name": "browser",
          "label": "Browser"
        },
        {
          "name": "platform",
          "label": "Platform(s)"
        },
        {
          "name": "version",
          "label": "Engine version"
        },
        {
          "name": "grade",
          "label": "CSS grade"
        }
      ]
    }
  ]
}
```

### columnSort

列排序，可以尝试点击`Browser`列右侧的排序图标。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "onEvent": {
        "columnSort": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "orderBy：${event.data.orderBy},orderDir：${event.data.orderDir}"
              }
            }
          ]
        }
      },
      "columns": [
        {
          "name": "id",
          "label": "ID",
          "searchable": true
        },
        {
          "name": "engine",
          "label": "Rendering engine",
          "filterable": {
            "options": [
              "Internet Explorer 4.0",
              "Internet Explorer 5.0"
            ]
          }
        },
        {
          "name": "browser",
          "label": "Browser",
          "sortable": true
        },
        {
          "name": "platform",
          "label": "Platform(s)"
        },
        {
          "name": "version",
          "label": "Engine version"
        },
        {
          "name": "grade",
          "label": "CSS grade"
        }
      ]
    }
  ]
}
```

### columnFilter

列过滤，可以尝试点击`Rendering engine`列右侧的筛选图标。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "onEvent": {
        "columnFilter": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "filterName：${event.data.filterName},filterValue：${event.data.filterValue}"
              }
            }
          ]
        }
      },
      "columns": [
        {
          "name": "id",
          "label": "ID",
          "searchable": true
        },
        {
          "name": "engine",
          "label": "Rendering engine",
          "filterable": {
            "options": [
              "Internet Explorer 4.0",
              "Internet Explorer 5.0"
            ]
          }
        },
        {
          "name": "browser",
          "label": "Browser",
          "sortable": true
        },
        {
          "name": "platform",
          "label": "Platform(s)"
        },
        {
          "name": "version",
          "label": "Engine version"
        },
        {
          "name": "grade",
          "label": "CSS grade"
        }
      ]
    }
  ]
}
```

### columnSearch

列检索，，可以尝试点击`ID`列右侧的检索图标。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "onEvent": {
        "columnSearch": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "searchName：${event.data.searchName},searchValue：${event.data.searchValue|json}"
              }
            }
          ]
        }
      },
      "columns": [
        {
          "name": "id",
          "label": "ID",
          "searchable": true
        },
        {
          "name": "engine",
          "label": "Rendering engine",
          "filterable": {
            "options": [
              "Internet Explorer 4.0",
              "Internet Explorer 5.0"
            ]
          }
        },
        {
          "name": "browser",
          "label": "Browser",
          "sortable": true
        },
        {
          "name": "platform",
          "label": "Platform(s)"
        },
        {
            "name": "version",
            "label": "Engine version"
        },
        {
          "name": "grade",
          "label": "CSS grade"
        }
      ]
    }
  ]
}
```

### columnToggled

点击自定义列，可以尝试修改`自定义列`的配置。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "onEvent": {
        "columnToggled": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "当前显示${event.data.columns.length}列"
              }
            }
          ]
        }
      },
      "columns": [
        {
          "name": "id",
          "label": "ID",
          "searchable": true
        },
        {
          "name": "engine",
          "label": "Rendering engine",
          "filterable": {
            "options": [
              "Internet Explorer 4.0",
              "Internet Explorer 5.0"
            ]
          }
        },
        {
          "name": "browser",
          "label": "Browser",
          "sortable": true
        },
        {
          "name": "platform",
          "label": "Platform(s)"
        },
        {
          "name": "version",
          "label": "Engine version"
        },
        {
          "name": "grade",
          "label": "CSS grade"
        }
      ]
    }
  ]
}
```

### orderChange

在开启拖拽排序行记录后才会用到，排序确认后触发。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "draggable": true,
      "onEvent": {
        "orderChange": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "${event.data.movedItems.length}行发生移动"
              }
            }
          ]
        }
      },
      "columns": [
        {
          "name": "id",
          "label": "ID",
          "searchable": true
        },
        {
          "name": "engine",
          "label": "Rendering engine",
          "filterable": {
            "options": [
              "Internet Explorer 4.0",
              "Internet Explorer 5.0"
            ]
          }
        },
        {
          "name": "browser",
          "label": "Browser",
          "sortable": true
        },
        {
          "name": "platform",
          "label": "Platform(s)"
        },
        {
          "name": "version",
          "label": "Engine version"
        },
        {
          "name": "grade",
          "label": "CSS grade"
        }
      ]
    }
  ]
}
```

### rowClick

点击行记录。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "selectable": true,
      "onEvent": {
        "rowClick": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "行单击数据：${event.data.item|json}；行索引：${event.data.index}"
              }
            }
          ]
        }
      },
      "columns": [
        {
          "name": "id",
          "label": "ID",
          "searchable": true
        },
        {
          "name": "engine",
          "label": "Rendering engine",
          "filterable": {
            "options": [
              "Internet Explorer 4.0",
              "Internet Explorer 5.0"
            ]
          }
        },
        {
          "name": "browser",
          "label": "Browser",
          "sortable": true
        },
        {
          "name": "platform",
          "label": "Platform(s)"
        },
        {
          "name": "version",
          "label": "Engine version"
        },
        {
          "name": "grade",
          "label": "CSS grade"
        }
      ]
    }
  ]
}
```

### rowDbClick

双击整行时触发。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "onEvent": {
        "rowDbClick": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "行双击数据：${event.data.item|json}；行索引：${event.data.index}"
              }
            }
          ]
        }
      },
      "columns": [
        {
          "name": "id",
          "label": "ID",
          "searchable": true
        },
        {
          "name": "engine",
          "label": "Rendering engine",
          "filterable": {
            "options": [
              "Internet Explorer 4.0",
              "Internet Explorer 5.0"
            ]
          }
        },
        {
          "name": "browser",
          "label": "Browser",
          "sortable": true
        },
        {
          "name": "platform",
          "label": "Platform(s)"
        },
        {
          "name": "version",
          "label": "Engine version"
        },
        {
          "name": "grade",
          "label": "CSS grade"
        }
      ]
    }
  ]
}
```

### rowMouseEnter

鼠标移入行记录。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "onEvent": {
        "rowMouseEnter": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "行索引：${event.data.index}"
              }
            }
          ]
        }
      },
      "columns": [
        {
          "name": "id",
          "label": "ID",
          "searchable": true
        },
        {
          "name": "engine",
          "label": "Rendering engine",
          "filterable": {
            "options": [
              "Internet Explorer 4.0",
              "Internet Explorer 5.0"
            ]
          }
        },
        {
          "name": "browser",
          "label": "Browser",
          "sortable": true
        },
        {
          "name": "platform",
          "label": "Platform(s)"
        },
        {
          "name": "version",
          "label": "Engine version"
        },
        {
          "name": "grade",
          "label": "CSS grade"
        }
      ]
    }
  ]
}
```

### rowMouseLeave

鼠标移出行记录。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=10",
  "body": [
    {
      "type": "table2",
      "source": "$rows",
      "onEvent": {
        "rowMouseLeave": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "行索引：${event.data.index}"
              }
            }
          ]
        }
      },
      "columns": [
        {
          "name": "id",
          "label": "ID",
          "searchable": true
        },
        {
          "name": "engine",
          "label": "Rendering engine",
          "filterable": {
            "options": [
              "Internet Explorer 4.0",
              "Internet Explorer 5.0"
            ]
          }
        },
        {
          "name": "browser",
          "label": "Browser",
          "sortable": true
        },
        {
          "name": "platform",
          "label": "Platform(s)"
        },
        {
          "name": "version",
          "label": "Engine version"
        },
        {
          "name": "grade",
          "label": "CSS grade"
        }
      ]
    }
  ]
}
```

### quickSaveSubmitted

快速编辑点击 `submit` , 成功调用 `quickSaveSubmitted`之后触发

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "page",
    "body": {
      "type": "service",
      "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample?perPage=5",
      "id": "service-container",
      "body": [
        {
          "type": "table2",
          "source": "$rows",
          "quickSaveApi": {
            "url": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/sample/bulkUpdate",
            "method": "put"
          },
          "onEvent": {
            "quickSaveSubmitted": {
              "actions": [
                {
                  "actionType": "reload",
                  "componentId": "service-container"
                }
              ]
            },
          },
          "columns": [
            {
              "title": "Engine",
              "name": "engine",
              "quickEdit": true
            },
            {
              "title": "Version",
              "name": "version"
            },
            {
              "title": "Browser",
              "name": "browser"
            },
            {
              "title": "Badge",
              "name": "badgeText"
            }
          ]
        }
      ]
    }
  }
}
```

### 列的事件表

表格的默认列定义的事件如下，即 click、mouseenter、mouseleave。如果列定义是其他组件，则事件表就是这个组件对应的事件表，例如列定义是 Switch 组件，则可以监听 [Switch 的 change 事件](./form/switch#%E4%BA%8B%E4%BB%B6%E8%A1%A8)。

| 事件名称   | 事件参数                            | 说明                                           |
| ---------- | ----------------------------------- | ---------------------------------------------- |
| click      | `[columnName]: string` 对应列名的值 | 监听表格列点击事件，表格数据点击时触发         |
| mouseenter | `[columnName]: string` 对应列名的值 | 监听表格列鼠标移入事件，表格数据鼠标移入时触发 |
| mouseleave | `[columnName]: string` 对应列名的值 | 监听表格列鼠标移出事件，表格数据鼠标移出时触发 |

可以尝试点击某行的`Rendering engine`列数据、鼠标移入某行的`Browser`列数据。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=10",
  "body": [
    {
      "type": "table",
      "source": "$rows",
      "columns": [
        {
          "name": "id",
          "label": "ID",
          "searchable": true
        },
        {
          "name": "engine",
          "label": "Rendering engine",
          "filterable": {
            "options": [
              "Internet Explorer 4.0",
              "Internet Explorer 5.0"
            ]
          },
          "onEvent": {
            "click": {
              "actions": [
                {
                  "actionType": "toast",
                  "args": {
                    "msgType": "info",
                    "msg": "第${event.data.index}行的${event.data.engine}"
                  }
                }
              ]
            }
          }
        },
        {
          "name": "browser",
          "label": "Browser",
          "sortable": true,
          "onEvent": {
            "mouseenter": {
              "actions": [
                {
                  "actionType": "toast",
                  "args": {
                    "msgType": "info",
                    "msg": "第${event.data.index}行的${event.data.browser}"
                  }
                }
              ]
            },
            "mouseleave": {
              "actions": [
                {
                  "actionType": "toast",
                  "args": {
                    "msgType": "info",
                    "msg": "第${event.data.index}行的${event.data.browser}"
                  }
                }
              ]
            }
          }
        },
        {
          "name": "platform",
          "label": "Platform(s)"
        },
        {
          "name": "version",
          "label": "Engine version"
        },
        {
          "name": "grade",
          "label": "CSS grade"
        }
      ]
    }
  ]
}
```

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称  | 动作配置                                                                                                         | 说明               |
| --------- | ---------------------------------------------------------------------------------------------------------------- | ------------------ |
| select    | `selected: string` 条件表达式，表达式中可以访问变量`record:行数据`和`rowIndex:行索引`，例如: data.rowIndex === 1 | 设置表格的选中项   |
| selectAll | -                                                                                                                | 设置表格全部项选中 |
| clearAll  | -                                                                                                                | 清空表格所有选中项 |
| setValue  | `value: object`                                                                                                  | 更新列表记录       |

value 结构说明：

| 属性名        | 类型     | 默认值 | 说明     |
| ------------- | -------- | ------ | -------- |
| items 或 rows | `item[]` |        | 列表记录 |

### select

```schema: scope="body"
[
  {
    "type": "button-toolbar",
    "className": "m-b",
    "buttons": [
      {
        "name": "trigger1",
        "id": "trigger1",
        "type": "action",
        "label": "设置表格第一项选中",
        "className": "ml-2",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "select",
                "componentId": "table-select",
                "description": "点击设置指定表格第一项内容选中",
                "args": {
                  "selected": "data.rowIndex === 0"
                }
              }
            ]
          }
        }
      },
      {
        "name": "trigger2",
        "id": "trigger2",
        "type": "action",
        "label": "设置表格第三项选中",
        "className": "ml-2",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "select",
                "componentId": "table-select",
                "description": "点击设置指定表格第三项内容选中",
                "args": {
                  "selectedRowKeysExpr": "data.rowIndex === 2"
                }
              }
            ]
          }
        }
      },
      {
        "name": "trigger3",
        "id": "trigger3",
        "type": "action",
        "label": "清空选中项",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "clearAll",
                "componentId": "table-select",
                "description": "清空选中项"
              }
            ]
          }
        }
      }
    ]
  },
  {
    "type": "service",
    "api": "/api/mock2/sample?perPage=10",
    "body": [
      {
        "id": "table-select",
        "type": "table2",
        "source": "$rows",
        "selectable": true,
        "multiple": true,
        "columns": [
          {
            "name": "id",
            "label": "ID"
          },
          {
            "name": "browser",
            "label": "Browser"
          },
          {
            "name": "version",
            "label": "Version"
          }
        ]
      }
    ]
  }
]
```

### selectAll

```schema: scope="body"
[
  {
    "type": "button-toolbar",
    "className": "m-b",
    "buttons": [
      {
        "name": "trigger2",
        "id": "trigger2",
        "type": "action",
        "label": "设置表格全部项选中",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "selectAll",
                "componentId": "table-select",
                "description": "点击设置指定表格全部内容选中"
              }
            ]
          }
        }
      }
    ]
  },
  {
    "type": "service",
    "api": "/api/mock2/sample?perPage=10",
    "body": [
      {
        "id": "table-select",
        "type": "table2",
        "source": "$rows",
        "selectable": true,
        "multiple": true,
        "columns": [
          {
            "name": "id",
            "label": "ID"
          },
          {
            "name": "browser",
            "label": "Browser"
          },
          {
            "name": "version",
            "label": "Version"
          }
        ]
      }
    ]
  }
]
```

### clearAll

```schema: scope="body"
[
  {
    "type": "button-toolbar",
    "className": "m-b",
    "buttons": [
      {
        "name": "trigger3",
        "id": "trigger3",
        "type": "action",
        "label": "清空表格全部选中项",
        "onEvent": {
        "click": {
            "actions": [
              {
                "actionType": "clearAll",
                "componentId": "table-select",
                "description": "点击设置指定表格全部选中项清空"
              }
            ]
          }
        }
      }
    ]
  },
  {
    "type": "service",
    "api": "/api/mock2/sample?perPage=10",
    "body": [
      {
        "id": "table-select",
        "type": "table2",
        "source": "$rows",
        "selectable": true,
        "multiple": true,
        "columns": [
          {
            "name": "id",
            "label": "ID"
          },
          {
            "name": "browser",
            "label": "Browser"
          },
          {
            "name": "version",
            "label": "Version"
          }
        ]
      }
    ]
  }
]
```

### setValue

#### 更新列表记录

```schema: scope="body"
[
  {
    "type": "button",
    "label": "更新列表记录",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "setValue",
            "componentId": "table_setvalue",
            "args": {
              "value": {
                "items": [
                  {
                    "engine": "Trident - f12fj",
                    "browser": "Internet Explorer 4.0",
                    "platform": "Win 95+",
                    "version": "4",
                    "grade": "X",
                    "badgeText": "默认",
                    "id": 1
                  },
                  {
                    "engine": "Trident - oqvc0e",
                    "browser": "Internet Explorer 5.0",
                    "platform": "Win 95+",
                    "version": "5",
                    "grade": "C",
                    "badgeText": "危险",
                    "id": 2
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
    "type": "button",
    "label": "清空列表",
    "className": "ml-2",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "setValue",
            "componentId": "table_setvalue",
            "args": {
              "value": {
                "items": []
              }
            }
          }
        ]
      }
    }
  },
  {
    "type": "button",
    "label": "清空选中项",
    "className": "ml-2",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "clearAll",
            "componentId": "table_setvalue"
          }
        ]
      }
    }
  },
  {
    "type": "service",
    "id": "u:b25a8ef0050b",
    "api": {
      "method": "get",
      "url": "/api/mock2/sample?perPage=5"
    },
    "body": [
      {
        "type": "table2",
        "id": "table_setvalue",
        "title": "引擎列表",
        "source": "$rows",
        "columns": [
          {
            "name": "engine",
            "label": "Engine",
            "id": "u:4aa2e9034698",
            "inline": true
          },
          {
            "name": "version",
            "label": "Version",
            "id": "u:8b4cb96ca2bf",
            "inline": true,
            "tpl": "v${version}"
          }
        ],
        "selectable": true,
        "multiple": true
      }
    ]
  }
]
```

#### 更新指定行记录

可以通过指定`index`或者`condition`来分别更新指定索引的行记录和指定满足条件（条件表达式或者 ConditionBuilder）的行记录，另外`replace`同样生效，即可以完全替换指定行记录，也可以对指定行记录做合并。

```schema
{
  "type": "page",
  "data": {
    i: '1,3'
  },
  body: [
    {
      "type": "container",
      "className": "mb-2",
      "body": [
        {
          "type": "button",
          "label": "更新index为1和3的行记录",
          "onEvent": {
            "click": {
              "actions": [
                {
                  "actionType": "setValue",
                  "componentId": "table_setvalue_item",
                  "args": {
                    "value": {
                      "engine": "amis",
                      "browser": "Chrome",
                      "platform": "Mac Pro",
                      "version": "8",
                      "grade": "Y",
                      "badgeText": "你好！",
                      "id": 1234
                    },
                    "index": "${i}"
                  }
                }
              ]
            }
          }
        },
        {
          "type": "button",
          "label": "更新index为1和3的行记录(替换)",
          "className": "ml-2",
          "onEvent": {
            "click": {
              "actions": [
                {
                  "actionType": "setValue",
                  "componentId": "table_setvalue_item",
                  "args": {
                    "value": {
                      "engine": "amis",
                      "id": 1234
                    },
                    "index": "${i}",
                    "replace": true
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      "type": "container",
      "body": [
        {
          "type": "button",
          "label": "更新version=7的行记录",
          "onEvent": {
            "click": {
              "actions": [
                {
                  "actionType": "setValue",
                  "componentId": "table_setvalue_item",
                  "args": {
                    "value": {
                      "engine": "amis",
                      "browser": "Chrome",
                      "platform": "Mac Pro",
                      "version": "4",
                      "grade": "Y",
                      "badgeText": "你好！",
                      "id": 1234
                    },
                    "condition": "${version === '7'}"
                  }
                }
              ]
            }
          }
        },
        {
          "type": "button",
          "label": "更新version=4的行记录",
          "className": "ml-2",
          "onEvent": {
            "click": {
              "actions": [
                {
                  "actionType": "setValue",
                  "componentId": "table_setvalue_item",
                  "args": {
                    "value": {
                      "engine": "amis",
                      "browser": "Chrome",
                      "platform": "Mac Pro",
                      "version": "4",
                      "grade": "Y",
                      "badgeText": "你好！",
                      "id": 1234
                    },
                    "condition": {
                      conjunction: 'and',
                      children: [
                        {
                          left: {
                            type: 'field',
                            field: 'version'
                          },
                          op: 'equal',
                          right: "4"
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      "type": "service",
      "id": "u:b25a8ef0050b",
      "api": {
        "method": "get",
        "url": "/api/mock2/sample?perPage=5"
      },
      "body": [
        {
          "type": "table2",
          "id": "table_setvalue_item",
          "title": "引擎列表",
          "source": "$rows",
          "columns": [
            {
              "name": "engine",
              "label": "Engine",
              "id": "u:4aa2e9034698",
              "inline": true
            },
            {
              "name": "version",
              "label": "Version",
              "id": "u:8b4cb96ca2bf",
              "inline": true,
              "tpl": "${version}"
            }
          ],
          "selectable": true,
          "multiple": true
        }
      ]
    }
  ]
}
```
