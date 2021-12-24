---
title: Table v2 表格
description:
type: 0
group: ⚙ 组件
menuName: Table 表格
icon:
order: 67
---

表格展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像`Service`这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过`source`属性，获取数据链中的数据，完成数据展示。

## 基本用法

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
        {
            "type": "table-v2",
            "title": "表格标题",
            "source": "$rows",
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine"
                },
                {
                    "title": "Version",
                    "key": "version"
                },
                {
                    "title": "Browser",
                    "key": "browser"
                },
                {
                    "title": "Operation",
                    "key": "operation",
                    "type": "button",
                    "label": "删除",
                    "size": "sm"
                }
            ],
            "footer": "表格Footer"
        }
    ]
}
```

## 可选择 - 多选

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "rowSelection": {
                "type": "checkbox",
                "keyField": "id"
            },
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine"
                },
                {
                    "title": "Version",
                    "key": "version"
                },
                {
                    "title": "Browser",
                    "key": "browser"
                },
                {
                    "title": "Operation",
                    "key": "operation",
                    "type": "button",
                    "label": "删除",
                    "size": "sm"
                }
            ]
        }
    ]
}
```

## 可选择 - 单选

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "rowSelection": {
                "type": "radio",
                "keyField": "id",
                "disableOn": "this.record.id === 1"
            },
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine"
                },
                {
                    "title": "Version",
                    "key": "version"
                },
                {
                    "title": "Browser",
                    "key": "browser"
                },
                {
                    "title": "Operation",
                    "key": "operation",
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

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine",
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
                    "key": "version",
                    "sorter": true,
                    "width": 100
                },
                {
                    "title": "Browser",
                    "key": "browser",
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

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "bordered": true,
            "title": "标题",
            "footer": "Footer",
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine"
                },
                {
                    "title": "Version",
                    "key": "version"
                },
                {
                    "title": "Browser",
                    "key": "browser"
                },
                {
                    "title": "Operation",
                    "key": "operation",
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

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine"
                },
                {
                    "title": "Version",
                    "key": "version"
                },
                {
                    "title": "Browser",
                    "key": "browser"
                },
                {
                    "title": "Operation",
                    "key": "operation",
                    "type": "button",
                    "label": "删除",
                    "size": "sm"
                }
            ],
            "expandable": {
                "expandableOn": "this.id === 1 || this.id === 3",
                "keyField": "id",
                "type": "tpl",
                "html": "<div class=\"test\">测试测试</div>",
                "expandedRowClassNameExpr": "<%= data.rowIndex % 2 ? 'bg-success' : '' %>",
                "expandedRowKeys": ["3"]
            }
        }
    ]
}
```

## 表格行/列合并

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=10",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine"
                },
                {
                    "title": "Version",
                    "key": "version",
                    "rowSpanExpr": "<%= data.rowIndex === 2 ? 2 : 0 %>"
                },
                {
                    "title": "Browser",
                    "key": "browser"
                },
                {
                    "title": "Badge",
                    "key": "badgeText",
                    "colSpanExpr": "<%= data.rowIndex === 6 ? 3 : 0 %>"
                },
                {
                    "title": "Grade",
                    "key": "grade"
                },
                {
                    "title": "Platform",
                    "key": "platform"
                }
            ]
        }
    ]
}
```

## 固定表头

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=10",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "scroll": {"y" : 200},
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine"
                },
                {
                    "title": "Grade",
                    "key": "grade"
                },
                {
                    "title": "Platform",
                    "key": "platform"
                }
            ]
        }
    ]
}
```

## 固定列

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=6",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "scroll": {"x": 1000},
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine",
                    "fixed": "left",
                    "width": 100
                },
                {
                    "title": "Version",
                    "key": "version",
                    "fixed": "left",
                    "width": 100
                },
                {
                    "title": "Browser",
                    "key": "browser"
                },
                {
                    "title": "Badge",
                    "key": "badgeText"
                },
                {
                    "title": "Grade",
                    "key": "grade"
                },
                {
                    "title": "Platform",
                    "key": "platform",
                    "fixed": "right"
                }
            ]
        }
    ]
}
```

## 固定头和列

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=10",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "scroll": {"x": 1000, "y": 200},
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine",
                    "fixed": "left",
                    "width": 100
                },
                {
                    "title": "Version",
                    "key": "version",
                    "fixed": "left",
                    "width": 100
                },
                {
                    "title": "Browser",
                    "key": "browser"
                },
                {
                    "title": "Badge",
                    "key": "badgeText"
                },
                {
                    "title": "Grade",
                    "key": "grade"
                },
                {
                    "title": "Platform",
                    "key": "platform",
                    "fixed": "right"
                }
            ]
        }
    ]
}
```

## 表头分组

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=10",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "scroll": {"y": 200},
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine",
                },
                {
                    "title": "Version",
                    "key": "version",
                    "fixed": "left"
                },
                {
                    "title": "Grade",
                    "key": "grade"
                },
                {
                    "title": "Grade1",
                    "key": "grade1",
                    "children": [
                        {
                            "title": "Browser",
                            "key": "browser"
                        },
                        {
                            "title": "Badge",
                            "key": "badgeText",
                            "children": [
                                {
                                    "title": "ID",
                                    "key": "id"
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Platform",
                    "key": "platform",
                    "fixed": "right"
                }
            ]
        }
    ]
}
```

## 拖拽排序

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "draggable": true,
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine",
                },
                {
                    "title": "Version",
                    "key": "version",
                    "fixed": "left"
                },
                {
                    "title": "Grade",
                    "key": "grade"
                },
                {
                    "title": "Browser",
                    "key": "browser"
                },
                {
                    "title": "Badge",
                    "key": "badgeText",
                    "children": [
                        {
                            "title": "ID",
                            "key": "id"
                        }
                    ]
                },
                {
                    "title": "Platform",
                    "key": "platform",
                    "fixed": "right"
                }
            ]
        }
    ]
}
```

## 顶部总结栏

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=10",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "scroll": {"y": 200},
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine",
                },
                {
                    "title": "Version",
                    "key": "version"
                },
                {
                    "title": "Grade",
                    "key": "grade"
                },
                {
                    "title": "Browser",
                    "key": "browser"
                },
                {
                    "title": "Badge",
                    "key": "badgeText"
                },
                {
                    "title": "Platform",
                    "key": "platform"
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

## 尾部总结栏

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=10",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "bordered": true,
            "scroll": {"y": 200, "x": 1000},
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine",
                    "fixed": "left"
                },
                {
                    "title": "Version",
                    "key": "version"
                },
                {
                    "title": "Grade",
                    "key": "grade"
                },
                {
                    "title": "Browser",
                    "key": "browser"
                },
                {
                    "title": "Badge",
                    "key": "badgeText"
                },
                {
                    "title": "Platform",
                    "key": "platform"
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

## 调整列宽

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=6",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "bordered": true,
            "scroll": {"x": 1000},
            "resizable": true,
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine",
                    "width": 200,
                    "align": "center"
                },
                {
                    "title": "Version",
                    "key": "version",
                    "width": 200,
                    "align": "right"
                },
                {
                    "title": "Grade",
                    "key": "grade",
                    "width": 200
                },
                {
                    "title": "Browser",
                    "key": "browser",
                    "width": 200
                },
                {
                    "title": "Badge",
                    "key": "badgeText"
                },
                {
                    "title": "Platform",
                    "key": "platform"
                }
            ]
        }
    ]
}
```

## 自定义列

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=6",
    "body": [
        {
            "type": "table-v2",
            "source": "$rows",
            "columnsToggable": true,
            "title": "表格的标题",
            "bordered": true,
            "columns": [
                {
                    "title": "Engine",
                    "key": "engine",
                    "width": 200
                },
                {
                    "title": "Version",
                    "key": "version",
                    "width": 200
                },
                {
                    "title": "Browser",
                    "key": "browser",
                    "width": 200,
                    "children": [
                        {
                            "title": "Grade",
                            "key": "grade",
                            "width": 200
                        }
                    ]
                },
                {
                    "title": "Badge",
                    "key": "badgeText"
                },
                {
                    "title": "Platform",
                    "key": "platform"
                }
            ]
        }
    ]
}
```

## 数据为空

```schema
{
    "type": "table-v2",
    "data": {
        "items": []
    },
    "columns": [
        {
            "title": "Engine",
            "key": "engine",
            "width": 200
        },
        {
            "title": "Version",
            "key": "version",
            "width": 200
        },
        {
            "title": "Browser",
            "key": "browser",
            "width": 200,
            "children": [
                {
                    "title": "Grade",
                    "key": "grade",
                    "width": 200
                }
            ]
        },
        {
            "title": "Platform",
            "key": "platform",
            "children": [
                {
                    "title": "Badge",
                    "key": "badgeText"
                }
            ]
        }
    ],
    "placeholder": "暂无数据"
}
```

## 数据为空

```schema
{
    "type": "table-v2",
    "data": {
        "items": []
    },
    "columns": [
        {
            "title": "Engine",
            "key": "engine",
            "width": 200
        },
        {
            "title": "Version",
            "key": "version",
            "width": 200
        },
        {
            "title": "Browser",
            "key": "browser",
            "width": 200,
            "children": [
                {
                    "title": "Grade",
                    "key": "grade",
                    "width": 200
                },
                {
                    "title": "Badge",
                    "key": "badgeText",
                    "children": [
                        {
                            "title": "Platform",
                            "key": "platform"
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

## 列搜索

## 粘性头部

## 表格尺寸

## 单元格自动省略

## 响应式列

## Footable

## 属性表

| 属性名           | 类型                                     | 默认值                    | 说明                                                                      |
| ---------------- | ---------------------------------------- | ------------------------- | ------------------------------------------------------------------------- |
| type             | `string`                                 |                           | `"type"` 指定为 table 渲染器                                              |
| title            | `string`                                 |                           | 标题                                                                      |
| source           | `string`                                 | `${items}`                | 数据源, 绑定当前环境变量                                                  |
| affixHeader      | `boolean`                                | `true`                    | 是否固定表头                                                              |
| columnsTogglable | `auto` 或者 `boolean`                    | `auto`                    | 展示列显示开关, 自动即：列数量大于或等于 5 个时自动开启                   |
| placeholder      | string                                   | `暂无数据`                | 当没数据的时候的文字提示                                                  |
| className        | `string`                                 | `panel-default`           | 外层 CSS 类名                                                             |
| tableClassName   | `string`                                 | `table-db table-striped`  | 表格 CSS 类名                                                             |
| headerClassName  | `string`                                 | `Action.md-table-header`  | 顶部外层 CSS 类名                                                         |
| footerClassName  | `string`                                 | `Action.md-table-footer`  | 底部外层 CSS 类名                                                         |
| toolbarClassName | `string`                                 | `Action.md-table-toolbar` | 工具栏 CSS 类名                                                           |
| columns          | `Array<Column>`                          |                           | 用来设置列信息                                                            |
| combineNum       | `number`                                 |                           | 自动合并单元格                                                            |
| itemActions      | Array<[Action](./action-button)>         |                           | 悬浮行操作按钮组                                                          |
| itemCheckableOn  | [表达式](../../docs/concepts/expression) |                           | 配置当前行是否可勾选的条件，要用 [表达式](../../docs/concepts/expression) |
| itemDraggableOn  | [表达式](../../docs/concepts/expression) |                           | 配置当前行是否可拖拽的条件，要用 [表达式](../../docs/concepts/expression) |
| checkOnItemClick | `boolean`                                | `false`                   | 点击数据行是否可以勾选当前行                                              |
| rowClassName     | `string`                                 |                           | 给行添加 CSS 类名                                                         |
| rowClassNameExpr | [模板](../../docs/concepts/template)     |                           | 通过模板给行添加 CSS 类名                                                 |
| prefixRow        | `Array`                                  |                           | 顶部总结行                                                                |
| affixRow         | `Array`                                  |                           | 底部总结行                                                                |
| itemBadge        | [`BadgeSchema`](./badge)                 |                           | 行角标配置                                                                |
| autoFillHeight   | `boolean`                                |                           | 内容区域自适应高度                                                        |

## 列配置属性表

| 属性名     | 类型                                          | 默认值  | 说明             |
| ---------- | --------------------------------------------- | ------- | ---------------- |
| label      | [模板](../../docs/concepts/template)          |         | 表头文本内容     |
| name       | `string`                                      |         | 通过名称关联数据 |
| fixed      | `left` \| `right` \| `none`                   |         | 是否固定当前列   |
| popOver    |                                               |         | 弹出框           |
| quickEdit  |                                               |         | 快速编辑         |
| copyable   | `boolean` 或 `{icon: string, content:string}` |         | 是否可复制       |
| sortable   | `boolean`                                     | `false` | 是否可排序       |
| searchable | `boolean` \| `Schema`                         | `false` | 是否可快速搜索   |
| width      | `number` \| `string`                          | 列宽    |
| remark     |                                               |         | 提示信息         |
