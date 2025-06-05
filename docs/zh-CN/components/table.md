---
title: Table 表格
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
    "api": "/api/mock2/sample?perPage=5",
    "body": [
        {
            "type": "table",
            "title": "表格1",
            "source": "$rows",
            "columns": [
                {
                    "name": "engine",
                    "label": "Engine"
                },

                {
                    "name": "version",
                    "label": "Version"
                }
            ]
        }
    ]
}
```

## 数据需求

数据是对象数组，比如前面的例子中 `rows` 的值类似：

```
[
    {
        "engine": "webkie",
        "version": 1
    }
]
```

## 空状态展示

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/sample?perPage=5",
    "body": [
        {
            "type": "table",
            "title": "表格1",
            "source": [],
            "columns": [
                {
                    "name": "engine",
                    "label": "Engine"
                },

                {
                    "name": "version",
                    "label": "Version"
                }
            ],
            "placeholder": "您还没有创建任何实例"
        }
    ]
}
```

## 列配置

`columns`内，除了简单的配置`label`和`name`展示数据以外，还支持一些额外的配置项，可以帮助更好的展示数据。

### 列类型

除了简单展示数据源所返回的数据以外，`list`的列支持除表单项以外所有组件类型，例如：

```schema
{
    "type": "table",
    "data": {
        "items": [
            {
                "id": "91264",
                "text": "衡 阎",
                "progress": 22,
                "type": 4,
                "boolean": true,
                "list": [
                    {
                        "title": "Forward Functionality Technician",
                        "description": "nisi ex eum"
                    },
                    {
                        "title": "District Applications Specialist",
                        "description": "ipsam ratione voluptas"
                    },
                    {
                        "title": "Future Operations Manager",
                        "description": "ducimus fugit debitis"
                    },
                    {
                        "title": "Dynamic Solutions Associate",
                        "description": "saepe consequatur aut"
                    }
                ],
                "audio": "https://news-bos.cdn.bcebos.com/mvideo/%E7%9A%87%E5%90%8E%E5%A4%A7%E9%81%93%E4%B8%9C.aac",
                "carousel": [
                    {
                        "image": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg"
                    },
                    {
                        "html": "<div style=\"width: 100%; height: 200px; background: #e3e3e3; text-align: center; line-height: 200px;\">carousel data in crud</div>"
                    },
                    {
                        "image": "https://video-react.js.org/assets/poster.png"
                    }
                ],
                "date": 1591270438,
                "image": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg",
                "json": {
                    "id": 1,
                    "text": "text"
                }
            },
            {
                "id": "34202",
                "text": "吉 卢汉市",
                "progress": 85,
                "type": 1,
                "boolean": true,
                "list": [
                    {
                        "title": "Dynamic Assurance Orchestrator",
                        "description": "ea ullam voluptates"
                    },
                    {
                        "title": "Internal Division Assistant",
                        "description": "illum deleniti qui"
                    },
                    {
                        "title": "International Usability Administrator",
                        "description": "sit voluptatem quia"
                    },
                    {
                        "title": "Lead Optimization Orchestrator",
                        "description": "autem et blanditiis"
                    },
                    {
                        "title": "Future Division Assistant",
                        "description": "dolor cupiditate sint"
                    },
                    {
                        "title": "Forward Program Orchestrator",
                        "description": "quia distinctio voluptas"
                    },
                    {
                        "title": "Human Implementation Technician",
                        "description": "consequatur quaerat ullam"
                    },
                    {
                        "title": "National Identity Administrator",
                        "description": "ipsa et reiciendis"
                    },
                    {
                        "title": "Regional Factors Planner",
                        "description": "sed deserunt natus"
                    },
                    {
                        "title": "Human Data Administrator",
                        "description": "rerum consequatur odit"
                    }
                ],
                "audio": "https://news-bos.cdn.bcebos.com/mvideo/%E7%9A%87%E5%90%8E%E5%A4%A7%E9%81%93%E4%B8%9C.aac",
                "carousel": [
                    {
                        "image": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg"
                    },
                    {
                        "html": "<div style=\"width: 100%; height: 200px; background: #e3e3e3; text-align: center; line-height: 200px;\">carousel data in crud</div>"
                    },
                    {
                        "image": "https://video-react.js.org/assets/poster.png"
                    }
                ],
                "date": 1591270438,
                "image": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg",
                "json": {
                    "id": 1,
                    "text": "text"
                }
            },
            {
                "id": "37701",
                "text": "立辉安市",
                "progress": 72,
                "type": 2,
                "boolean": false,
                "list": [
                    {
                        "title": "Corporate Metrics Liason",
                        "description": "aspernatur natus qui"
                    },
                    {
                        "title": "Central Paradigm Analyst",
                        "description": "sequi numquam ad"
                    },
                    {
                        "title": "International Data Administrator",
                        "description": "sed libero eum"
                    },
                    {
                        "title": "Forward Optimization Assistant",
                        "description": "officiis accusantium dolorem"
                    },
                    {
                        "title": "Senior Metrics Executive",
                        "description": "commodi sint quod"
                    },
                    {
                        "title": "Corporate Quality Facilitator",
                        "description": "aut aperiam est"
                    },
                    {
                        "title": "Forward Operations Producer",
                        "description": "sed corporis eaque"
                    },
                    {
                        "title": "National Integration Analyst",
                        "description": "quasi ab cumque"
                    }
                ],
                "audio": "https://news-bos.cdn.bcebos.com/mvideo/%E7%9A%87%E5%90%8E%E5%A4%A7%E9%81%93%E4%B8%9C.aac",
                "carousel": [
                    {
                        "image": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg"
                    },
                    {
                        "html": "<div style=\"width: 100%; height: 200px; background: #e3e3e3; text-align: center; line-height: 200px;\">carousel data in crud</div>"
                    },
                    {
                        "image": "https://video-react.js.org/assets/poster.png"
                    }
                ],
                "date": 1591270438,
                "image": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg",
                "json": {
                    "id": 1,
                    "text": "text"
                }
            }
        ]
    },
    "affixHeader": false,
    "syncLocation": false,
    "columns": [
        {
            "name": "id",
            "label": "ID",
            "type": "text"
        },
        {
            "name": "text",
            "label": "文本",
            "type": "text"
        },
        {
            "type": "image",
            "label": "图片",
            "name": "image"
        },
        {
            "name": "date",
            "type": "date",
            "label": "日期"
        },
        {
            "name": "progress",
            "label": "进度",
            "type": "progress"
        },
        {
            "name": "boolean",
            "label": "状态",
            "type": "status"
        },
        {
            "name": "boolean",
            "label": "开关",
            "type": "switch"
        },
        {
            "name": "type",
            "label": "映射",
            "type": "mapping",
            "map": {
                "1": "<span class='label label-info'>漂亮</span>",
                "2": "<span class='label label-success'>开心</span>",
                "3": "<span class='label label-danger'>惊吓</span>",
                "4": "<span class='label label-warning'>紧张</span>",
                "*": "其他：${type}"
            }
        },
        {
            "name": "list",
            "type": "list",
            "label": "List",
            "placeholder": "-",
            "listItem": {
                "title": "${title}",
                "subTitle": "${description}"
            }
        }
    ]
}
```

### 列宽

可以给列配置 `width` 属性，控制列宽，共有两种方式：

#### 固定像素

可以配置数字，用于设置列宽像素，例如下面例子我们给`Rendering engine`列宽设置为`100px`。

> - 如果希望精准的控制列宽，请设置表格的 `tableLayout` 为 `fixed` 模式，同时为了让表格标题不换行，标题文字的长短会影响列的最小宽度
> - 注意：`resizable`开启后，固定宽度的列则无法拖动调整列宽

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample?waitSeconds=1",
    "tableLayout": "fixed",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "engine",
            "label": "Rendering engine",
            "width": 150
        },
        {
            "name": "browser",
            "label": "Browser"
        }
    ]
}
```

#### 百分比

也可以百分比来指定列宽，例如下面例子我们给`Rendering engine`列宽设置为`50%`。

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample?waitSeconds=1",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "engine",
            "label": "Rendering engine",
            "width": "50%"
        }
    ]
}
```

### 列对齐方式

> 1.4.0 及以上版本

通过 align 可以控制列文本对齐方式，比如

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/sample?perPage=5",
    "body": [
      {
        "type": "table",
        "title": "表格1",
        "source": "$rows",
        "columns": [
          {
            "name": "engine",
            "label": "Engine"
          },
          {
            "label": "Version",
            "type": "tpl",
            "tpl": "${version | number}",
            "align": "right"
          }
        ]
      }
    ]
}
```

### 列样式

> 1.4.0 及以上版本

除了前面的宽度和对齐方式，还有更灵活的控制方法是通过样式表

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/sample?perPage=5",
    "body": [
      {
        "type": "table",
        "title": "表格1",
        "source": "$rows",
        "columns": [
          {
            "name": "engine",
            "label": "Engine"
          },
          {
            "name": "version",
            "label": "Version",
            "className": "text-primary"
          }
        ]
      }
    ]
}
```

如果要单独设置标题的样式，可以使用 `labelClassName` 属性

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/sample?perPage=5",
    "body": [
      {
        "type": "table",
        "title": "表格1",
        "source": "$rows",
        "columns": [
          {
            "name": "engine",
            "label": "Engine"
          },
          {
            "name": "version",
            "label": "Version",
            "className": "text-primary",
            "labelClassName": "font-bold"
          }
        ]
      }
    ]
}
```

### 单元格样式

> 1.4.0 及以上版本

`classNameExpr` 可以根据数据动态添加 CSS 类，支持 [模板](../../docs/concepts/template) 语法。

例如下例，`"${ version > 5 ? 'text-danger' : '' }"` 表示当行数据的 `version` 数据大于 5 的时候添加 `text-danger` CSS 类名，使得文字颜色变红

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/sample?perPage=5",
    "body": [
        {
            "type": "table",
            "source": "$rows",

            "columns": [
                {
                    "name": "engine",
                    "label": "Engine"
                },
                {
                    "name": "version",
                    "label": "Version",
                    "classNameExpr": "${ version > 5 ? 'text-danger' : '' }",
                },
                {
                    "name": "grade",
                    "label": "Grade"
                }
            ]
        }
    ]
}
```

### 背景色阶

> 1.8.0 及以上版本

`backgroundScale` 可以用来根据数据控制自动分配色阶

```schema: scope="body"
{
    "type": "service",
    "data": {
        "rows": [
            {
                "engine": "Trident",
                "version": "1",
                "grade": "A"
            },
            {
                "engine": "Trident",
                "version": "7",
                "grade": "B"
            },
            {
                "engine": "Trident",
                "version": "4",
                "grade": "C"
            },
            {
                "engine": "Trident",
                "version": "3",
                "grade": "A"
            },
            {
                "engine": "Trident",
                "version": "4",
                "grade": "A"
            },
            {
                "engine": "Gecko",
                "version": "6",
                "grade": "A"
            },
            {
                "engine": "Gecko",
                "version": "2",
                "grade": "A"
            },
            {
                "engine": "Gecko",
                "version": "5",
                "grade": "B"
            },
            {
                "engine": "Gecko",
                "version": "10",
                "grade": "D"
            }
        ]
    },
    "body": [
        {
            "type": "table",
            "source": "$rows",
            "columns": [
                {
                    "name": "engine",
                    "label": "Engine"
                },
                {
                    "name": "version",
                    "label": "Version",
                    backgroundScale: {
                        min: 0,
                        max: 10,
                        colors: ['#FFEF9C', '#FF7127']
                    }
                },
                {
                    "name": "grade",
                    "label": "Grade"
                }
            ]
        }
    ]
}
```

`min` 和 `max` 都支持变量，如果为设置会自动计算当前列的最大和最小值。

默认会从当前列的 `name` 属性来获取数据，也可以通过 `backgroundScale.source` 使用变量及公式来获取数据。

### 默认是否显示

默认 `columnsTogglable` 配置为 `auto`，当列超过 5 列后，就会在工具栏多渲染出来一个列展示与否的开关。你可以设置成 `true` 或者 `false` 来强制开或者关。在列配置中可以通过配置 `toggled` 为 `false` 默认不展示这列，比如下面这个例子中 ID 这一栏。

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/sample?perPage=5",
    "body": [
        {
            "type": "table",
            "source": "$rows",
            "className": "m-b-none",
            "columns": [
                {
                    "name": "engine",
                    "label": "Engine"
                },

                {
                    "name": "grade",
                    "label": "Grade"
                },

                {
                    "name": "version",
                    "label": "Version"
                },

                {
                    "name": "browser",
                    "label": "Browser"
                },

                {
                    "name": "id",
                    "label": "ID",
                    "toggled": false
                },

                {
                    "name": "platform",
                    "label": "Platform"
                }
            ]
        }
    ]
}
```

### 固定列

列太多可以让重要的几列固定，可以配置固定在左侧还是右侧，只需要给需要固定的列上配置 `fixed` 属性，配置 `left` 或者 `right`。

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/sample?perPage=5",
    "className": "flex justify-center",
    "body": [
        {
            "type": "wrapper",
            "className": "w-xxl border-2 border-solid border-indigo-400",
            "body": [
                {
                    "type": "table",
                    "source": "$rows",
                    "className": "m-b-none",
                    "columnsTogglable": false,
                    "columns": [
                        {
                            "name": "id",
                            "label": "ID",
                            "fixed": "left"
                        },
                        {
                            "name": "engine",
                            "label": "Engine",
                            "groupName": 'Group-1',
                            "fixed": "left"
                        },
                        {
                            "name": "grade",
                            "label": "Grade",
                        },
                        {
                            "name": "version",
                            "label": "Version"
                        },
                        {
                            "name": "browser",
                            "label": "Browser",
                            "groupName": 'Group-2',
                            "fixed": "right"
                        },
                        {
                            "name": "platform",
                            "label": "Platform",
                            "groupName": 'Group-2',
                            "fixed": "right"
                        }
                    ]
                }
            ]
        }
    ]
}
```

### 可复制

可以在列上配置`"copyable": true`，会在该列的内容区里，渲染一个复制内容的图标，点击可复制该显示内容

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample?waitSeconds=1",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "engine",
            "label": "Rendering engine",
            "copyable": true
        }
    ]
}
```

你也可以配置对象形式，可以自定义显示内容

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample?waitSeconds=1",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "engine",
            "label": "Rendering engine",
            "copyable": {
                "content": "复制的内容是：${engine}"
            }
        }
    ]
}
```

### 弹出框（popOver）

可以给列上配置 `popOver` 属性，会在该列的内容区里，渲染一个图标，点击会显示弹出框，用于展示内容

```schema
{
    "type": "page",
    "data": {
        "table": [
            {
                "id": 1,
                "text": "The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis."
            },
            {
                "id": 2,
                "text": "The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis."
            }
        ]
    },
    "body": [
        {
            "type": "crud",
            "source": "${table}",
            "columns": [
                {
                    "name": "id",
                    "label": "ID"
                },
                {
                    "type": "container",
                    "style": {
                        "display": "inline-block"
                    },
                    "body": {
                        "type": "tpl",
                        "name": "text",
                        "label": "long text",
                        "className": "text-ellipsis",
                        "style": {
                            "max-width": "300px"
                        },
                    },
                    "popOver": {
                        "body": {
                            "type": "tpl",
                            "tpl": "${text}"
                        }
                    }
                }
            ]
        }
    ]
}
```

popOver 的其它配置请参考 [popover](./popover)

### 表头样式

可以配置`"isHead": true`，来让当前列以表头的样式展示。应用场景是：

1. 所有列`label`配置空字符串，不显示表头
2. 配置`combineNum`，合并单元格，实现左侧表头的形式
3. 列上配置`"isHead": true`，调整样式

```schema: scope="body"
{
  "type": "crud",
  "api": "/api/mock2/sample?waitSeconds=1",
  "affixHeader": false,
  "combineNum": 1,
  "columns": [
    {
      "name": "engine",
      "label": "",
      "isHead": true
    },
    {
      "name": "browser",
      "label": ""
    },
    {
      "name": "platform",
      "label": ""
    },
    {
      "name": "version",
      "label": ""
    },
    {
      "name": "grade",
      "label": ""
    }
  ]
}
```

还可以配置"offset"，实现弹出框位置调整自定义

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample?waitSeconds=1",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "engine",
            "label": "Rendering engine",
            "popOver": {
                "body": {
                    "type": "tpl",
                    "tpl": "偏了一点的popover"
                },
                "offset": {
                    "y": 100
                }
            }
        }
    ]
}
```

## 嵌套

当行数据中存在 children 属性时，可以自动嵌套显示下去。

```schema: scope="body"
{
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
                    "id": 1001
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
            "type": "table",
            "source": "$rows",
            "className": "m-b-none",
            "columnsTogglable": false,
            "columns": [
                {
                    "name": "engine",
                    "label": "Engine"
                },

                {
                    "name": "grade",
                    "label": "Grade"
                },

                {
                    "name": "version",
                    "label": "Version"
                },

                {
                    "name": "browser",
                    "label": "Browser"
                },

                {
                    "name": "id",
                    "label": "ID"
                },

                {
                    "name": "platform",
                    "label": "Platform"
                }
            ]
        }
    ]
}
```

## 显示序号

通过配置 `showIndex` 为 true，开启展示序号。

```schema: scope="body"
{
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
                    "id": 1001
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
            "type": "table",
            "source": "$rows",
            "className": "m-b-none",
            "columnsTogglable": false,
            "showIndex": true,
            "columns": [
                {
                    "name": "engine",
                    "label": "Engine"
                },

                {
                    "name": "grade",
                    "label": "Grade"
                },

                {
                    "name": "version",
                    "label": "Version"
                },

                {
                    "name": "browser",
                    "label": "Browser"
                },

                {
                    "name": "id",
                    "label": "ID"
                },

                {
                    "name": "platform",
                    "label": "Platform"
                }
            ]
        }
    ]
}
```

## 底部展示 (Footable)

列太多时，内容没办法全部显示完，可以让部分信息在底部显示，可以让用户展开查看详情。配置很简单，只需要开启 `footable` 属性，同时将想在底部展示的列加个 `breakpoint` 属性为 `*` 即可。

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/sample?perPage=5",
    "body": [
        {
            "type": "table",
            "source": "$rows",
            "className": "m-b-none",
            "columnsTogglable": false,
            "footable": true,
            "columns": [
                {
                    "name": "engine",
                    "label": "Engine"
                },

                {
                    "name": "grade",
                    "label": "Grade"
                },

                {
                    "name": "version",
                    "label": "Version",
                    "breakpoint": "*"
                },

                {
                    "name": "browser",
                    "label": "Browser",
                    "breakpoint": "*"
                },

                {
                    "name": "id",
                    "label": "ID",
                    "breakpoint": "*"
                },

                {
                    "name": "platform",
                    "label": "Platform",
                    "breakpoint": "*"
                }
            ]
        }
    ]
}
```

默认都不会展开，如果你想默认展开第一个就把 footable 配置成这样。

```json
{
  "footable": {
    "expand": "first"
  }
}
```

当配置成 `all` 时表示全部展开。

## 合并单元格

只需要配置 `combineNum` 属性即可，他表示从左到右多少列内启动自动合并单元格，只要多行的同一个属性值是一样的，就会自动合并。

如果你不想从第一列开始合并单元格，可以配置 `combineFromIndex`，如果配置为 1，则会跳过第一列的合并。如果配置为 2，则会跳过第一列和第二列的合并，从第三行开始向右合并 `combineNum` 列。

```schema: scope="body"
{
    "type": "service",
    "data": {
        "rows": [
            {
                "engine": "Trident",
                "browser": "Internet Explorer 4.2",
                "platform": "Win 95+",
                "version": "4",
                "grade": "A"
            },
            {
                "engine": "Trident",
                "browser": "Internet Explorer 4.2",
                "platform": "Win 95+",
                "version": "4",
                "grade": "B"
            },
            {
                "engine": "Trident",
                "browser": "AOL browser (AOL desktop)",
                "platform": "Win 95+",
                "version": "4",
                "grade": "C"
            },
            {
                "engine": "Trident",
                "browser": "AOL browser (AOL desktop)",
                "platform": "Win 98",
                "version": "3",
                "grade": "A"
            },
            {
                "engine": "Trident",
                "browser": "AOL browser (AOL desktop)",
                "platform": "Win 98",
                "version": "4",
                "grade": "A"
            },
            {
                "engine": "Gecko",
                "browser": "Firefox 1.0",
                "platform": "Win 98+ / OSX.2+",
                "version": "4",
                "grade": "A"
            },
            {
                "engine": "Gecko",
                "browser": "Firefox 1.0",
                "platform": "Win 98+ / OSX.2+",
                "version": "5",
                "grade": "A"
            },
            {
                "engine": "Gecko",
                "browser": "Firefox 2.0",
                "platform": "Win 98+ / OSX.2+",
                "version": "5",
                "grade": "B"
            },
            {
                "engine": "Gecko",
                "browser": "Firefox 2.0",
                "platform": "Win 98+ / OSX.2+",
                "version": "5",
                "grade": "C"
            },
            {
                "engine": "Gecko",
                "browser": "Firefox 2.0",
                "platform": "Win 98+ / OSX.2+",
                "version": "5",
                "grade": "D"
            }
        ]
    },
    "body": [
        {
            "type": "table",
            "source": "$rows",
            "className": "m-b-none",
            "combineNum": 3,
            "columnsTogglable": false,
            "columns": [
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

> 1.3.0 版本开始 combineNum 支持使用变量，如下所示

```schema: scope="body"
{
    "type": "service",
    "data": {
        "rows": [
            {
                "engine": "Trident",
                "browser": "Internet Explorer 4.2",
                "platform": "Win 95+",
                "version": "4",
                "grade": "A"
            },
            {
                "engine": "Trident",
                "browser": "Internet Explorer 4.2",
                "platform": "Win 95+",
                "version": "4",
                "grade": "B"
            },
            {
                "engine": "Trident",
                "browser": "AOL browser (AOL desktop)",
                "platform": "Win 95+",
                "version": "4",
                "grade": "C"
            },
            {
                "engine": "Trident",
                "browser": "AOL browser (AOL desktop)",
                "platform": "Win 98",
                "version": "3",
                "grade": "A"
            },
            {
                "engine": "Trident",
                "browser": "AOL browser (AOL desktop)",
                "platform": "Win 98",
                "version": "4",
                "grade": "A"
            },
            {
                "engine": "Gecko",
                "browser": "Firefox 1.0",
                "platform": "Win 98+ / OSX.2+",
                "version": "4",
                "grade": "A"
            },
            {
                "engine": "Gecko",
                "browser": "Firefox 1.0",
                "platform": "Win 98+ / OSX.2+",
                "version": "5",
                "grade": "A"
            },
            {
                "engine": "Gecko",
                "browser": "Firefox 2.0",
                "platform": "Win 98+ / OSX.2+",
                "version": "5",
                "grade": "B"
            },
            {
                "engine": "Gecko",
                "browser": "Firefox 2.0",
                "platform": "Win 98+ / OSX.2+",
                "version": "5",
                "grade": "C"
            },
            {
                "engine": "Gecko",
                "browser": "Firefox 2.0",
                "platform": "Win 98+ / OSX.2+",
                "version": "5",
                "grade": "D"
            }
        ],
        combineNum: 3
    },
    "body": [
        {
            "type": "table",
            "source": "$rows",
            "className": "m-b-none",
            "combineNum": "$combineNum",
            "columnsTogglable": false,
            "columns": [
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

## 超级表头

超级表头意思是，表头还可以再一次进行分组。额外添加个 `groupName` 属性即可。

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/sample?perPage=5",
    "body": [
        {
            "type": "table",
            "source": "$rows",
            "className": "m-b-none",
            "columns": [
                {
                    "name": "engine",
                    "label": "Engine",
                    "groupName": "分组1"
                },

                {
                    "name": "grade",
                    "label": "Grade",
                    "groupName": "分组1"
                },

                {
                    "name": "version",
                    "label": "Version",
                    "groupName": "分组2"
                },

                {
                    "name": "browser",
                    "label": "Browser",
                    "groupName": "分组2"
                },

                {
                    "name": "id",
                    "label": "ID",
                    "toggled": false,
                    "groupName": "分组2"
                },

                {
                    "name": "platform",
                    "label": "Platform",
                    "groupName": "分组2"
                }
            ]
        }
    ]
}
```

## 高亮行

可以通过配置`rowClassNameExpr`来为行添加 CSS 类，支持 [模板](../../docs/concepts/template) 语法。

例如下例，`"${id % 2 ? "bg-success" : ""}"` 表示当行数据的 `id` 变量为 不能被 `2` 整除时，给当前行添加`bg-success` CSS 类名，即绿色背景色

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/sample?perPage=10",
    "body": [
        {
            "type": "table",
            "source": "$rows",
            "rowClassNameExpr": "${id % 2 ? 'bg-success' : 'bg-blue-50'}",
            "columns": [
                {
                    "name": "engine",
                    "label": "Engine"
                },

                {
                    "name": "grade",
                    "label": "Grade"
                },

                {
                    "name": "version",
                    "label": "Version"
                },

                {
                    "name": "browser",
                    "label": "Browser"
                },

                {
                    "name": "id",
                    "label": "ID"
                },

                {
                    "name": "platform",
                    "label": "Platform"
                }
            ]
        }
    ]
}
```

## 总结行

可以通过配置 `prefixRow` 或 `affixRow` 来为表格顶部或底部添加总结行，

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
                    "name": "browser",
                    "label": "Browser"
                },

                {
                    "name": "version",
                    "label": "Version"
                }
            ],
            "affixRow":[
                {
                    "type": "text",
                    "text": "总计"
                },
                {
                    "type": "tpl",
                    "tpl": "${rows|pick:version|sum}"
                }
            ]
        }
    ]
}
```

> 1.8.1 及以上版本

新增 `affixRowClassNameExpr`、`affixRowClassName`、`prefixRowClassNameExpr`、`prefixRowClassName` 来控制总结行样式，比如下面的例子

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
                    "name": "browser",
                    "label": "Browser"
                },

                {
                    "name": "version",
                    "label": "Version"
                }
            ],
            "affixRowClassNameExpr": "${SUM(ARRAYMAP(rows, item => item.version)) > 30 ? 'text-success' : ''}",
            "affixRow":[
                {
                    "type": "text",
                    "text": "总计"
                },
                {
                    "type": "tpl",
                    "tpl": "${rows|pick:version|sum}"
                }
            ]
        }
    ]
}
```

### 配置合并单元格

可以配置 `colSpan` 来设置一列所合并的列数，例如

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
            ],
            "affixRow":[
                {
                    "type": "text",
                    "text": "总计",
                    "colSpan": 2
                },
                {
                    "type": "tpl",
                    "tpl": "${rows|pick:version|sum}"
                }
            ]
        }
    ]
}
```

上例中我们给 `总计` 列配置了 `"colSpan": 2`，它会合并两个单元格

### 配置多行

可以配置二维数组来配置多行总结行

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
                    "name": "browser",
                    "label": "Browser"
                },

                {
                    "name": "version",
                    "label": "Version"
                }
            ],
            "affixRow":[
                [
                    {
                        "type": "text",
                        "text": "总计1"
                    },
                    {
                        "type": "tpl",
                        "tpl": "${rows|pick:version|sum}"
                    }
                ],
                [
                    {
                        "type": "text",
                        "text": "总计2"
                    },
                    {
                        "type": "tpl",
                        "tpl": "${rows|pick:version|sum}"
                    }
                ]
            ]
        }
    ]
}
```

## 行操作按钮

通过 itemActions 可以设置鼠标移动到行上出现操作按钮

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=10",
  "body": [{
    "type": "table",
    "source": "$rows",
    "itemActions": [{
      "label": "编辑",
      "type": "button",
      "actionType": "dialog",
      "dialog": {
        "title": "编辑",
        "body": "这是个简单的编辑弹框"
      }
    }, {
      "label": "删除",
      "type": "button",
      "actionType": "ajax",
      "confirmText": "确认要删除？",
      "api": "/api/mock2/form/saveForm"
    }],
    "columns": [{
        "name": "browser",
        "label": "Browser"
      },

      {
        "name": "version",
        "label": "Version"
      }
    ]
  }]
}
```

## 单行点击操作

> 1.4.0 及以上版本

处理前面的 itemActions，还可以配置 itemAction 来实现点击某一行后进行操作，支持 [action](./action) 里的所有配置，比如弹框、刷新其它组件等。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=10",
  "body": [{
    "type": "table",
    "source": "$rows",
    "itemAction": {
      "type": "button",
      "actionType": "dialog",
      "dialog": {
        "title": "详情",
        "body": "当前行的数据 browser: ${browser}, version: ${version}"
      }
    },
    "columns": [{
        "name": "browser",
        "label": "Browser"
      },
      {
        "name": "version",
        "label": "Version"
      }
    ]
  }]
}
```

注意这个属性和 `checkOnItemClick` 冲突，因为都是定义行的点击行为，开启 `itemAction` 后 `checkOnItemClick` 将会失效。

## 行角标

> 1.5.0 及以上版本

通过属性`itemBadge`，可以为表格行配置[角标](./badge)，可以使用[数据映射](../../../docs/concepts/data-mapping)为每一行添加特定的 Badge 属性。[`visibleOn`](../../../docs/concepts/expression)属性控制显示的条件，表达式中`this`可以取到行所在上下文的数据，比如行数据中有`badgeText`字段才显示角标，可以设置`"visibleOn": "this.badgeText"`

```schema: scope="body"
{
  "type": "service",
  "body": {
    "type": "table",
    "source": "${table}",
    "syncLocation": false,
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

## 表格内容高度自适应

> 1.5.0 及以上版本

通过 `autoFillHeight` 可以让表格内容区自适应高度，具体效果请看这个[示例](../../examples/crud/auto-fill)。

它的展现效果是整个内容区域高度自适应，表格内容较多时在内容区域内出滚动条，这样顶部筛选和底部翻页的位置都是固定的。

开启这个配置后会自动关闭 `affixHeader` 功能避免冲突。

## 属性表

| 属性名           | 类型                                                     | 默认值                    | 说明                                                                                                                                                                                                   | 版本                              |
| ---------------- | -------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| type             | `string`                                                 |                           | `"type"` 指定为 table 渲染器                                                                                                                                                                           |                                   |
| title            | `string`                                                 |                           | 标题                                                                                                                                                                                                   |                                   |
| source           | `string`                                                 | `${items}`                | 数据源, 绑定当前环境变量                                                                                                                                                                               |                                   |
| deferApi         | [API](../../docs/types/api)                              |                           | 当行数据中有 defer 属性时，用此接口进一步加载内容                                                                                                                                                      |
| affixHeader      | `boolean`                                                | `true`                    | 是否固定表头                                                                                                                                                                                           |                                   |
| affixFooter      | `boolean`                                                | `false`                   | 是否固定表格底部工具栏                                                                                                                                                                                 |                                   |
| columnsTogglable | `auto` 或者 `boolean`                                    | `auto`                    | 展示列显示开关, 自动即：列数量大于或等于 5 个时自动开启                                                                                                                                                |                                   |
| placeholder      | `string` 或者 `SchemaTpl`                                | `暂无数据`                | 当没数据的时候的文字提示                                                                                                                                                                               |                                   |
| className        | `string`                                                 | `panel-default`           | 外层 CSS 类名                                                                                                                                                                                          |                                   |
| showIndex        | `boolean`                                                |                           | 是否展示序号                                                                                                                                                                                           | 6.11.0                            |
| tableClassName   | `string`                                                 | `table-db table-striped`  | 表格 CSS 类名                                                                                                                                                                                          |                                   |
| headerClassName  | `string`                                                 | `Action.md-table-header`  | 顶部外层 CSS 类名                                                                                                                                                                                      |                                   |
| footerClassName  | `string`                                                 | `Action.md-table-footer`  | 底部外层 CSS 类名                                                                                                                                                                                      |                                   |
| toolbarClassName | `string`                                                 | `Action.md-table-toolbar` | 工具栏 CSS 类名                                                                                                                                                                                        |                                   |
| columns          | `Array<Column>`                                          |                           | 用来设置列信息                                                                                                                                                                                         |                                   |
| combineNum       | `number`                                                 |                           | 自动合并单元格                                                                                                                                                                                         |                                   |
| itemActions      | Array<[Action](./action-button)>                         |                           | 悬浮行操作按钮组                                                                                                                                                                                       |                                   |
| itemCheckableOn  | [表达式](../../docs/concepts/expression)                 |                           | 配置当前行是否可勾选的条件，要用 [表达式](../../docs/concepts/expression)                                                                                                                              |                                   |
| itemDraggableOn  | [表达式](../../docs/concepts/expression)                 |                           | 配置当前行是否可拖拽的条件，要用 [表达式](../../docs/concepts/expression)                                                                                                                              |                                   |
| checkOnItemClick | `boolean`                                                | `false`                   | 点击数据行是否可以勾选当前行                                                                                                                                                                           |                                   |
| rowClassName     | `string`                                                 |                           | 给行添加 CSS 类名                                                                                                                                                                                      |                                   |
| rowClassNameExpr | [模板](../../docs/concepts/template)                     |                           | 通过模板给行添加 CSS 类名                                                                                                                                                                              |                                   |
| prefixRow        | `Array`                                                  |                           | 顶部总结行                                                                                                                                                                                             |                                   |
| affixRow         | `Array`                                                  |                           | 底部总结行                                                                                                                                                                                             |                                   |
| itemBadge        | [`BadgeSchema`](./badge)                                 |                           | 行角标配置                                                                                                                                                                                             |                                   |
| autoFillHeight   | `boolean` 丨 `{height: number}` 丨 `{maxHeight: number}` |                           | 内容区域自适应高度，可选择自适应、固定高度和最大高度                                                                                                                                                   | `maxHeight` 需要 `2.8.0` 以上版本 |
| resizable        | `boolean`                                                | `true`                    | 列宽度是否支持调整                                                                                                                                                                                     |                                   |
| selectable       | `boolean`                                                | `false`                   | 支持勾选                                                                                                                                                                                               |                                   |
| multiple         | `boolean`                                                | `false`                   | 勾选 icon 是否为多选样式`checkbox`， 默认为`radio`                                                                                                                                                     |                                   |
| lazyRenderAfter  | `number`                                                 | `100`                     | 用来控制从第几行开始懒渲染行，用来渲染大表格时有用                                                                                                                                                     |                                   |
| tableLayout      | `auto` \| `fixed`                                        | `auto`                    | 当配置为 fixed 时，内容将不会撑开表格，自动换行                                                                                                                                                        |                                   |
| reUseRow         | `false` \| `match`                                       |                           | 默认，当 API 返回数据与当前一致时，不会触发表格行重渲染（省性能但可能导致数据渲染不同步）；为 false，则总会触发重渲染；为 match，尽量复用返回数据中 id 一致的对象，性能可认为是默认和 false 两者的折中 |                                   |
| persistKey       | `string`                                                 |                           | 用于配置列排序、列显示的本地缓存所使用的 key                                                                                                                                                           |                                   |

### 列配置属性表

| 属性名       | 类型                                          | 默认值    | 说明                                                                                                           | 版本     |
| ------------ | --------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| label        | [模板](../../docs/concepts/template)          |           | 表头文本内容                                                                                                   |          |
| name         | `string`                                      |           | 通过名称关联数据                                                                                               |          |
| width        | `number` \| `string`                          |           | 列宽                                                                                                           |          |
| remark       |                                               |           | 提示信息                                                                                                       |          |
| fixed        | `left` \| `right` \| `none`                   |           | 是否固定当前列                                                                                                 |          |
| popOver      |                                               |           | 弹出框                                                                                                         |          |
| copyable     | `boolean` 或 `{icon: string, content:string}` |           | 是否可复制                                                                                                     |          |
| style        | `object`                                      |           | 单元格自定义样式                                                                                               |          |
| innerStyle   | `object`                                      |           | 单元格内部组件自定义样式                                                                                       | `2.8.1`  |
| align        | `left` \| `right` \| `center` \| `justify`    |           | 单元格对齐方式                                                                                                 | ` 1.4.0` |
| headerAlign  | `left` \| `right` \| `center` \| `justify`    |           | 表头单元格对齐方式                                                                                             | `6.7.0`  |
| vAlign       | `top` \| `middle` \| `bottom`                 |           | 单元格垂直对齐方式                                                                                             | `6.7.0`  |
| textOverflow | `string`                                      | `default` | 文本溢出后展示形式，默认换行处理。可选值 `ellipsis` 溢出隐藏展示， `noWrap` 不换行展示(仅在列为静态文本时生效) | `6.10.0` |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细查看[事件动作](../../docs/concepts/event-action)。

| 事件名称       | 事件参数                                                                                                             | 说明                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------- |
| selectedChange | `selectedItems: item[]` 已选择行<br/>`selectedIndexes: string[]` 已选择行索引<br/>`unSelectedItems: item[]` 未选择行 | 手动选择表格项时触发 |
| columnSort     | `orderBy: string` 列排序列名<br/>`orderDir: string` 列排序值                                                         | 点击列排序时触发     |
| columnFilter   | `filterName: string` 列筛选列名<br/>`filterValue: string` 列筛选值                                                   | 点击列筛选时触发     |
| columnSearch   | `searchName: string` 列搜索列名<br/>`searchValue: string` 列搜索数据                                                 | 点击列搜索时触发     |
| orderChange    | `movedItems: item[]` 已排序数据                                                                                      | 手动拖拽行排序时触发 |
| columnToggled  | `columns: item[]` 当前显示的列配置数据                                                                               | 点击自定义列时触发   |
| rowClick       | `item: object` 行点击数据<br/>`index: number` 行索引 <br />`indexPath: string` 行索引路径                            | 单击整行时触发       |
| rowDbClick     | `item: object` 行点击数据<br/>`index: number` 行索引 <br />`indexPath: string` 行索引路径                            | 双击整行时触发       |
| rowMouseEnter  | `item: object` 行移入数据<br/>`index: number` 行索引 <br />`indexPath: string` 行索引路径                            | 移入整行时触发       |
| rowMouseLeave  | `item: object` 行移出数据<br/>`index: number` 行索引 <br />`indexPath: string` 行索引路径                            | 移出整行时触发       |

### selectedChange

在开启批量操作后才会用到，可以尝试勾选列表的行记录。

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/sample?perPage=10",
    "body": [
        {
            "type": "table",
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
            "type": "table",
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
            "type": "table",
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
            "type": "table",
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
            "type": "table",
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
            "type": "table",
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
            "type": "table",
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
            "type": "table",
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
            "type": "table",
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
            "type": "table",
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

| 动作名称        | 动作配置                                                                                                                                                                                                                                                                                                                                                                                                | 说明                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| select          | `args.selected`: string 条件表达式，**不推荐，建议用 `args.index` 或者 `args.condition`** 表达式中可以访问变量`record:行数据`和`rowIndex:行索引`，例如: data.rowIndex === 1 <br /> `args.index` 可选，指定行数，支持表达式，支持树形路径（当为树形表格的时候使用）表达式上下文为对应行数据，跟 `args.select` 的上下文不同。 <br /> `args.condition` 可选，通过表达式指定更新哪些行，支持条件组合 index` | 设置表格的选中项           |
| selectAll       | -                                                                                                                                                                                                                                                                                                                                                                                                       | 设置表格全部项选中         |
| clearAll        | -                                                                                                                                                                                                                                                                                                                                                                                                       | 清空表格所有选中项         |
| initDrag        | -                                                                                                                                                                                                                                                                                                                                                                                                       | 开启表格拖拽排序功能       |
| cancelDrag      | -                                                                                                                                                                                                                                                                                                                                                                                                       | 放弃表格拖拽排序功能       |
| setValue        | `args.value`: object <br />`args.index` 可选，指定行数，支持表达式，支持树形路径（当为树形表格的时候使用） <br /> `args.condition` 可选，通过表达式指定更新哪些行，支持条件组合                                                                                                                                                                                                                         | 更新列表记录               |
| submitQuickEdit |                                                                                                                                                                                                                                                                                                                                                                                                         | 快速编辑数据提交           |
| toggleExpanded  | `args.index` 可选，指定行数，支持表达式，支持树形路径（当为树形表格的时候使用） <br /> `args.condition` 可选，通过表达式指定更新哪些行，支持条件组合                                                                                                                                                                                                                                                    | 切换某行数据是展开还是收起 |
| setExpanded     | `args.index` 可选，指定行数，支持表达式，支持树形路径（当为树形表格的时候使用） <br /> `args.condition` 可选，通过表达式指定更新哪些行，支持条件组合 <br /> `args.value` 展开还是收起                                                                                                                                                                                                                   | 设置某行数据展开还是收起   |

value 结构说明：

| 属性名        | 类型     | 默认值 | 说明     |
| ------------- | -------- | ------ | -------- |
| items 或 rows | `item[]` |        | 列表记录 |

### select

> 6.3.0 或更高版本

- `args.index` 可选，指定行数，支持表达式，支持树形路径（当为树形表格的时候使用）
- `args.condition` 可选，通过表达式指定更新哪些行，支持条件组合
- `args.selected` 不推荐使用，请使用以上两者替代

> 注意 6.3.0 版本开始用法变动，通过 `args.index` 和 `args.condition` 来代替 `args.selected`, 同时表达式上下文为对应行数据，跟 `args.select` 的上下文不同。

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
        "label": "选中前两个",
        "onEvent": {
        "click": {
            "actions": [
            {
                "actionType": "select",
                "componentId": "table-select",
                "args": {
                    "index": "0,1"
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
    "api": "/api/mock2/sample?perPage=10",
    "body": [
    {
        "id": "table-select",
        "type": "table",
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
        "type": "table",
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
        "type": "table",
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

### initDrag & cancelDrag

```schema: scope="body"
[
    {
    "type": "button-toolbar",
    "className": "m-b",
    "buttons": [
    {
        "name": "trigger4",
        "id": "trigger4",
        "type": "action",
        "label": "开启表格行排序",
        "onEvent": {
        "click": {
            "actions": [
            {
                "actionType": "initDrag",
                "componentId": "table-select",
                "description": "点击开启表格行排序功能"
            }
            ]
        }
        }
    },
    {
        "name": "trigger5",
        "id": "trigger5",
        "type": "action",
        "label": "取消表格行排序",
        "onEvent": {
        "click": {
            "actions": [
            {
                "actionType": "cancelDrag",
                "componentId": "table-select",
                "description": "点击取消表格行排序功能"
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
        "type": "table",
        "source": "$rows",
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
      "type": "service",
      "id": "u:b25a8ef0050b",
      "api": {
        "method": "get",
        "url": "/api/mock2/sample?perPage=5"
      },
      "body": [
        {
          "type": "table",
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
          ]
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
    },
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
          "type": "table",
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
          ]
        }
      ]
    }
    ]
}
```
