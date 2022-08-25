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

```schema: scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
        {
            "type": "table2",
            "title": "表格标题",
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
            "footer": "表格Footer"
        }
    ]
}
```

## 可选择

支持单选、多选

### 多选

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

### 已选择 - 正则表达式

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

可通过`disableOn`来控制哪一行不可选，不可选情况下会有禁用样式，但如果行内如果有除文字外的其他组件，禁用样式需要自行控制

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

内置全选`all`、反选`invert`、清空`none`、选中奇数行`odd`、选中偶数行`even`，存在禁止选择的行，不参与计算奇偶数

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

## 筛选和排序

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
                "expandableOn": "this.record.id === 1 || this.record.id === 3",
                "keyField": "id",
                "expandedRowClassNameExpr": "<%= data.rowIndex % 2 ? 'bg-success' : '' %>",
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

## 已展开 - 正则表达式

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
                "expandableOn": "this.record.id === 1 || this.record.id === 3",
                "keyField": "id",
                "expandedRowClassNameExpr": "<%= data.rowIndex % 2 ? 'bg-success' : '' %>",
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

## 表格行/列合并

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
                    "rowSpanExpr": "<%= data.rowIndex === 2 ? 2 : 0 %>"
                },
                {
                    "title": "Browser",
                    "name": "browser"
                },
                {
                    "title": "Badge",
                    "name": "badgeText",
                    "colSpanExpr": "<%= data.rowIndex === 6 ? 3 : 0 %>"
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

## 固定表头

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

## 表头分组

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
                    "name": "engine",
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
                    "name": "engine",
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

支持手动拖动排序

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
                            "name": "engine",
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

数据源嵌套情况下，仅允许同层级之间排序

```schema: scope="body"
{
    "type":"page",
    "body":{
        "type":"service",
        "data":{
            "rows":[
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 4.0",
                    "platform":"Win 95+",
                    "version":"4",
                    "grade":"X",
                    "id":1,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":1001,
                            "children":[
                                {
                                    "engine":"Trident",
                                    "browser":"Internet Explorer 4.0",
                                    "platform":"Win 95+",
                                    "version":"4",
                                    "grade":"X",
                                    "id":10001
                                },
                                {
                                    "engine":"Trident",
                                    "browser":"Internet Explorer 5.0",
                                    "platform":"Win 95+",
                                    "version":"5",
                                    "grade":"C",
                                    "id":10002
                                }
                            ]
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":1002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 5.0",
                    "platform":"Win 95+",
                    "version":"5",
                    "grade":"C",
                    "id":2,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":2001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":2002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 5.5",
                    "platform":"Win 95+",
                    "version":"5.5",
                    "grade":"A",
                    "id":3,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":3001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":3002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 6",
                    "platform":"Win 98+",
                    "version":"6",
                    "grade":"A",
                    "id":4,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":4001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":4002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 7",
                    "platform":"Win XP SP2+",
                    "version":"7",
                    "grade":"A",
                    "id":5,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":5001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":5002
                        }
                    ]
                }
            ]
        },
        "body":[
            {
                "type":"table2",
                "source":"$rows",
                "columns":[
                    {
                        "name":"engine",
                        "title":"Engine"
                    },
                    {
                        "name":"grade",
                        "title":"Grade"
                    },
                    {
                        "name":"browser",
                        "title":"Browser"
                    },
                    {
                        "name":"id",
                        "title":"ID"
                    },
                    {
                        "name":"platform",
                        "title":"Platform"
                    }
                ],
                "keyField":"id",
                "draggable": true
            }
        ]
    }
}
```

## 总结栏

### 顶部单行

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
                    "name": "engine",
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
                    "name": "engine",
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
                    "width": 200,
                    "align": "center"
                },
                {
                    "title": "Version",
                    "name": "version",
                    "width": 200,
                    "align": "right"
                },
                {
                    "title": "Grade",
                    "name": "grade",
                    "width": 200
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

## 自定义列

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

## 数据为空

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
    "type":"page",
    "body":{
        "type":"service",
        "data":{
            "rows":[
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 4.0",
                    "platform":"Win 95+",
                    "version":"4",
                    "grade":"X",
                    "id":1,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":1001,
                            "children":[
                                {
                                    "engine":"Trident",
                                    "browser":"Internet Explorer 4.0",
                                    "platform":"Win 95+",
                                    "version":"4",
                                    "grade":"X",
                                    "id":10001
                                },
                                {
                                    "engine":"Trident",
                                    "browser":"Internet Explorer 5.0",
                                    "platform":"Win 95+",
                                    "version":"5",
                                    "grade":"C",
                                    "id":10002
                                }
                            ]
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":1002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 5.0",
                    "platform":"Win 95+",
                    "version":"5",
                    "grade":"C",
                    "id":2,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":2001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":2002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 5.5",
                    "platform":"Win 95+",
                    "version":"5.5",
                    "grade":"A",
                    "id":3,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":3001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":3002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 6",
                    "platform":"Win 98+",
                    "version":"6",
                    "grade":"A",
                    "id":4,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":4001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":4002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 7",
                    "platform":"Win XP SP2+",
                    "version":"7",
                    "grade":"A",
                    "id":5,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":5001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":5002
                        }
                    ]
                }
            ]
        },
        "body":[
            {
                "type":"table2",
                "source":"$rows",
                "columns":[
                    {
                        "name":"engine",
                        "title":"Engine"
                    },
                    {
                        "name":"grade",
                        "title":"Grade"
                    },
                    {
                        "name":"version",
                        "title":"Version"
                    },
                    {
                        "name":"browser",
                        "title":"Browser"
                    },
                    {
                        "name":"id",
                        "title":"ID"
                    },
                    {
                        "name":"platform",
                        "title":"Platform"
                    }
                ],
                "keyField":"id"
            }
        ]
    }
}
```

### 多选嵌套

表格支持多选的同时支持级联选中

```schema: scope="body"
{
    "type":"page",
    "body":{
        "type":"service",
        "data":{
            "rows":[
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 4.0",
                    "platform":"Win 95+",
                    "version":"4",
                    "grade":"X",
                    "id":1,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":1001,
                            "children":[
                                {
                                    "engine":"Trident",
                                    "browser":"Internet Explorer 4.0",
                                    "platform":"Win 95+",
                                    "version":"4",
                                    "grade":"X",
                                    "id":10001
                                },
                                {
                                    "engine":"Trident",
                                    "browser":"Internet Explorer 5.0",
                                    "platform":"Win 95+",
                                    "version":"5",
                                    "grade":"C",
                                    "id":10002
                                }
                            ]
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":1002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 5.0",
                    "platform":"Win 95+",
                    "version":"5",
                    "grade":"C",
                    "id":2,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":2001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":2002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 5.5",
                    "platform":"Win 95+",
                    "version":"5.5",
                    "grade":"A",
                    "id":3,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":3001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":3002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 6",
                    "platform":"Win 98+",
                    "version":"6",
                    "grade":"A",
                    "id":4,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":4001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":4002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 7",
                    "platform":"Win XP SP2+",
                    "version":"7",
                    "grade":"A",
                    "id":5,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":5001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":5002
                        }
                    ]
                }
            ]
        },
        "body":[
            {
                "type":"table2",
                "source":"$rows",
                "columns":[
                    {
                        "name":"engine",
                        "title":"Engine"
                    },
                    {
                        "name":"grade",
                        "title":"Grade"
                    },
                    {
                        "name":"version",
                        "title":"Version"
                    },
                    {
                        "name":"browser",
                        "title":"Browser"
                    },
                    {
                        "name":"id",
                        "title":"ID"
                    },
                    {
                        "name":"platform",
                        "title":"Platform"
                    }
                ],
                "keyField":"id",
                "rowSelection":{
                    "type":"checkbox",
                    "keyField":"id"
                }
            }
        ]
    }
}
```

### 单选嵌套

单选 不同层级之间都是互斥选择

```schema: scope="body"
{
    "type":"page",
    "body":{
        "type":"service",
        "data":{
            "rows":[
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 4.0",
                    "platform":"Win 95+",
                    "version":"4",
                    "grade":"X",
                    "id":1,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":1001,
                            "children":[
                                {
                                    "engine":"Trident",
                                    "browser":"Internet Explorer 4.0",
                                    "platform":"Win 95+",
                                    "version":"4",
                                    "grade":"X",
                                    "id":10001
                                },
                                {
                                    "engine":"Trident",
                                    "browser":"Internet Explorer 5.0",
                                    "platform":"Win 95+",
                                    "version":"5",
                                    "grade":"C",
                                    "id":10002
                                }
                            ]
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":1002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 5.0",
                    "platform":"Win 95+",
                    "version":"5",
                    "grade":"C",
                    "id":2,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":2001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":2002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 5.5",
                    "platform":"Win 95+",
                    "version":"5.5",
                    "grade":"A",
                    "id":3,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":3001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":3002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 6",
                    "platform":"Win 98+",
                    "version":"6",
                    "grade":"A",
                    "id":4,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":4001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":4002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 7",
                    "platform":"Win XP SP2+",
                    "version":"7",
                    "grade":"A",
                    "id":5,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":5001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":5002
                        }
                    ]
                }
            ]
        },
        "body":[
            {
                "type":"table2",
                "source":"$rows",
                "columns":[
                    {
                        "name":"engine",
                        "title":"Engine"
                    },
                    {
                        "name":"grade",
                        "title":"Grade"
                    },
                    {
                        "name":"version",
                        "title":"Version"
                    },
                    {
                        "name":"browser",
                        "title":"Browser"
                    },
                    {
                        "name":"id",
                        "title":"ID"
                    },
                    {
                        "name":"platform",
                        "title":"Platform"
                    }
                ],
                "keyField":"id",
                "rowSelection":{
                    "type":"radio",
                    "keyField":"id"
                }
            }
        ]
    }
}
```

### 缩进设置

```schema: scope="body"
{
    "type":"page",
    "body":{
        "type":"service",
        "data":{
            "rows":[
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 4.0",
                    "platform":"Win 95+",
                    "version":"4",
                    "grade":"X",
                    "id":1,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":1001,
                            "children":[
                                {
                                    "engine":"Trident",
                                    "browser":"Internet Explorer 4.0",
                                    "platform":"Win 95+",
                                    "version":"4",
                                    "grade":"X",
                                    "id":10001
                                },
                                {
                                    "engine":"Trident",
                                    "browser":"Internet Explorer 5.0",
                                    "platform":"Win 95+",
                                    "version":"5",
                                    "grade":"C",
                                    "id":10002
                                }
                            ]
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":1002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 5.0",
                    "platform":"Win 95+",
                    "version":"5",
                    "grade":"C",
                    "id":2,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":2001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":2002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 5.5",
                    "platform":"Win 95+",
                    "version":"5.5",
                    "grade":"A",
                    "id":3,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":3001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":3002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 6",
                    "platform":"Win 98+",
                    "version":"6",
                    "grade":"A",
                    "id":4,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":4001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":4002
                        }
                    ]
                },
                {
                    "engine":"Trident",
                    "browser":"Internet Explorer 7",
                    "platform":"Win XP SP2+",
                    "version":"7",
                    "grade":"A",
                    "id":5,
                    "children":[
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 4.0",
                            "platform":"Win 95+",
                            "version":"4",
                            "grade":"X",
                            "id":5001
                        },
                        {
                            "engine":"Trident",
                            "browser":"Internet Explorer 5.0",
                            "platform":"Win 95+",
                            "version":"5",
                            "grade":"C",
                            "id":5002
                        }
                    ]
                }
            ]
        },
        "body":[
            {
                "type":"table2",
                "source":"$rows",
                "columns":[
                    {
                        "name":"engine",
                        "title":"Engine"
                    },
                    {
                        "name":"grade",
                        "title":"Grade"
                    },
                    {
                        "name":"version",
                        "title":"Version"
                    },
                    {
                        "name":"browser",
                        "title":"Browser"
                    },
                    {
                        "name":"id",
                        "title":"ID"
                    },
                    {
                        "name":"platform",
                        "title":"Platform"
                    }
                ],
                "keyField":"id",
                "rowSelection":{
                    "type":"checkbox",
                    "keyField":"id"
                },
                "indentSize": 20
            }
        ]
    }
}
```

## 列搜索

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

通过设置 size 属性来控制表格尺寸，支持`large`、`default`、`small`，`default`是中等尺寸

### 最大尺寸

`large`是最大尺寸

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

默认尺寸是`default`，即中等尺寸

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

最小尺寸

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

可以给列配置上`popOver`属性，默认会在该列内容区里渲染一个图标，点击会显示弹出框，用于展示内容

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

也可以设置图标不展示，结合 truncate 实现内容自动省略，其余可点击/悬浮查看更多

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

可以给列配置`popOverEnableOn`属性，该属性为表达式，来控制当前行是否启动`popOver`功能

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

通过属性`itemBadge`，可以为表格行配置[角标](./badge)，可以使用[数据映射](../../../docs/concepts/data-mapping)为每一行添加特定的 Badge 属性。[`visibleOn`](../../../docs/concepts/expression)属性控制显示的条件，表达式中`this`可以取到行所在上下文的数据，比如行数据中有`badgeText`字段才显示角标，可以设置`"visibleOn": "this.badgeText"`

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

`quickEdit`也可以配置对象形式，可以指定编辑表单项的类型，例如`"type": "select"`：

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

你也可以在`saveImmediately`中配置 api，实现即时保存

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
                        "name": "grade",
                        "title": "CSS grade",
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

可以通过设置`columns`中的`className`控制整列样式

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

也可以通过`titleClassName`单独控制表头对应单元格的样式

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

可以通过设置`columns`的`classNameExpr`，根据数据动态添加单元格 CSS 类，支持模版语法

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
                    "classNameExpr": "<%= data.version > 5 ? 'text-danger' : '' %>"
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

通过设置`itemActions`可以设置鼠标移动到行上出现操作按钮

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

固定表头情况下，展示行操作按钮

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

| 属性名           | 类型                                     | 默认值                    | 说明                                                                      |
| ---------------- | ---------------------------------------- | ------------------------- | ------------------------------------------------------------------------- |
| type             | `string`                                 |                           | `"type"` 指定为 table 渲染器                                              |
| title            | `string`                                 |                           | 标题                                                                      |
| source           | `string`                                 | `${items}`                | 数据源, 绑定当前环境变量                                                  |
| sticky           | `boolean`                                | `false`                   | 是否粘性头部                                                              |
| footer           | `string` \| `Schema`                     |                           | 表格尾部                                                                  |
| loading          | `boolean`                                |                           | 表格是否加载中                                                            |
| columnsTogglable | `auto` 或者 `boolean`                    | `auto`                    | 展示列显示开关, 自动即：列数量大于或等于 5 个时自动开启                   |
| placeholder      | `string` \| `Schema`                     | `暂无数据`                | 当没数据的时候的文字提示                                                  |
| rowSelection     | `rowSelection`                           |                           | 行相关配置                                                                |
| rowClassNameExpr | `string`                                 |                           | 行 CSS 类名，支持模版语法                                                 |
| expandable       | `Expandable`                             |                           | 展开行配置                                                                |
| lineHeight       | `large` \| `middle`                      |                           | 行高设置                                                                  |
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

## 行配置属性表

| 属性名              | 类型                               | 默认值     | 说明                                                                                                               |
| ------------------- | ---------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| type                | `checkbox` \| `radio`              | `checkbox` | 指定单选还是多选                                                                                                   |
| fixed               | `boolean`                          |            | 选择列是否固定，只能左侧固定                                                                                       |
| keyField            | `string`                           | `key`      | 对应数据源的 key 值，默认是`key`，可指定为`id`、`shortId`等                                                        |
| disableOn           | `string`                           |            | 当前行是否可选择条件，要用 [表达式](../../docs/concepts/expression)                                                |
| selections          | `selections`                       |            | 自定义筛选菜单，内置`all`（全选）、`invert`（反选）、`none`（取消选择）、`odd`（选择奇数项）、`even`（选择偶数项） |
| selectedRowKeys     | `Array<string>` \| `Array<number>` |            | 已选择项                                                                                                           |
| selectedRowKeysExpr | `string`                           |            | 已选择项正则表达式                                                                                                 |
| columnWidth         | `number`                           |            | 自定义选择列列宽                                                                                                   |
| rowClick            | `boolean`                          |            | 单条任意区域选中                                                                                                   |

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
| selectedRowKeysExpr | `string`                           |        | 已选择项正则表达式                                                                                                 |
| columnWidth         | `number`                           |        | 自定义选择列列宽                                                                                                   |

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
