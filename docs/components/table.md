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

```schema:height="700" scope="body"
{
    "type": "service",
    "api": "https://houtai.baidu.com/api/sample?perPage=5",
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
        },

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
                    "label": "Version"
                }
            ]
        }
    ]
}
```

## 列配置

`columns`内，除了简单的配置`label`和`name`展示数据以外，还支持一些额外的配置项，可以帮助更好的展示数据。

### 列类型

除了简单展示数据源所返回的数据以外，`list`的列支持除表单项以外所有组件类型，例如：

```schema:height="600"
{
    "$schema": "https://houtai.baidu.com/v2/schemas/table.json#",
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
                        "image": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
                    },
                    {
                        "html": "<div style=\"width: 100%; height: 200px; background: #e3e3e3; text-align: center; line-height: 200px;\">carousel data in crud</div>"
                    },
                    {
                        "image": "https://video-react.js.org/assets/poster.png"
                    }
                ],
                "date": 1591270438,
                "image": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg",
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
                        "image": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
                    },
                    {
                        "html": "<div style=\"width: 100%; height: 200px; background: #e3e3e3; text-align: center; line-height: 200px;\">carousel data in crud</div>"
                    },
                    {
                        "image": "https://video-react.js.org/assets/poster.png"
                    }
                ],
                "date": 1591270438,
                "image": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg",
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
                        "image": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
                    },
                    {
                        "html": "<div style=\"width: 100%; height: 200px; background: #e3e3e3; text-align: center; line-height: 200px;\">carousel data in crud</div>"
                    },
                    {
                        "image": "https://video-react.js.org/assets/poster.png"
                    }
                ],
                "date": 1591270438,
                "image": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg",
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

可以给列配置`width`属性，控制列宽，共有两种方式：

#### 固定像素

可以配置数字，用于设置列宽像素，例如下面例子我们给`Rendering engine`列宽设置为`100px`。

```schema:height="600" scope="body"
{
    "type": "crud",
    "api": "https://houtai.baidu.com/api/sample?waitSeconds=1",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "engine",
            "label": "Rendering engine",
            "width": 100
        }
    ]
}
```

#### 百分比

也可以百分比来指定列宽，例如下面例子我们给`Rendering engine`列宽设置为`50%`。

```schema:height="600" scope="body"
{
    "type": "crud",
    "api": "https://houtai.baidu.com/api/sample?waitSeconds=1",
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

### 默认是否显示

默认 `columnsTogglable` 配置为 `auto`，当列超过 5 列后，就会在工具栏多渲染出来一个列展示与否的开关。你可以设置成 `true` 或者 `false` 来强制开或者关。在列配置中可以通过配置 `toggled` 为 `false` 默认不展示这列，比如下面这个栗子中 ID 这一栏。

```schema:height="600" scope="body"
{
    "type": "service",
    "api": "https://houtai.baidu.com/api/sample?perPage=5",
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

### 可复制

可以在列上配置`"copyable": true`，会在该列的内容区里，渲染一个复制内容的图标，点击可复制该显示内容

```schema:height="600" scope="body"
{
    "type": "crud",
    "api": "https://houtai.baidu.com/api/sample?waitSeconds=1",
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

```schema:height="600" scope="body"
{
    "type": "crud",
    "api": "https://houtai.baidu.com/api/sample?waitSeconds=1",
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

### 弹出框

可以给列上配置`popover`属性，会在该列的内容区里，渲染一个图标，点击会显示弹出框，用于展示内容

```schema:height="600" scope="body"
{
    "type": "crud",
    "api": "https://houtai.baidu.com/api/sample?waitSeconds=1",
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
                    "tpl": "${engine}"
                }
            }
        }
    ]
}
```

### 表头样式

可以配置`"isHead": true`，来让当前列以表头的样式展示。应用场景是：

1. 所有列`label`配置空字符串，不显示表头
2. 配置`combineNum`，合并单元格，实现左侧表头的形式
3. 列上配置`"isHead": true`，调整样式

```schema:height="600" scope="body"
{
  "type": "crud",
  "api": "https://houtai.baidu.com/api/sample?waitSeconds=1",
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

```schema:height="600" scope="body"
{
    "type": "crud",
    "api": "https://houtai.baidu.com/api/sample?waitSeconds=1",
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

```schema:height="400" scope="body"
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

## 底部展示 (Footable)

列太多时，内容没办法全部显示完，可以让部分信息在底部显示，可以让用户展开查看详情。配置很简单，只需要开启 `footable` 属性，同时将想在底部展示的列加个 `breakpoint` 属性为 `*` 即可。

```schema:height="400" scope="body"
{
    "type": "service",
    "api": "https://houtai.baidu.com/api/sample?perPage=5",
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

```schema:height="500" scope="body"
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

## 超级表头

超级表头意思是，表头还可以再一次进行分组。额外添加个 `groupName` 属性即可。

```schema:height="430" scope="body"
{
    "type": "service",
    "api": "https://houtai.baidu.com/api/sample?perPage=5",
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

## 固定列

列太多可以让重要的几列固定，可以配置固定在左侧还是右侧，只需要给需要固定的列上配置 `fixed` 属性，配置 `left` 或者 `right`。

```schema:height="530" scope="body"
{
    "type": "service",
    "api": "https://houtai.baidu.com/api/sample?perPage=5",
    "className": "w-xxl",
    "body": [
        {
            "type": "table",
            "source": "$rows",
            "className": "m-b-none",
            "columnsTogglable": false,
            "columns": [
                {
                    "name": "engine",
                    "label": "Engine",
                    "fixed": "left"
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
                    "label": "Platform",
                    "fixed": "right"
                }
            ]
        }
    ]
}
```

## 属性表

| 属性名           | 类型                                          | 默认值                    | 说明                                                              |
| ---------------- | --------------------------------------------- | ------------------------- | ----------------------------------------------------------------- |
| type             | `string`                                      |                           | `"type"` 指定为 table 渲染器                                      |
| title            | `string`                                      |                           | 标题                                                              |
| source           | `string`                                      | `${items}`                | 数据源, 绑定当前环境变量                                          |
| affixHeader      | `boolean`                                     | `true`                    | 是否固定表头                                                      |
| columnsTogglable | `auto` 或者 `boolean`                         | `auto`                    | 展示列显示开关, 自动即：列数量大于或等于 5 个时自动开启           |
| placeholder      | string                                        | `暂无数据`                | 当没数据的时候的文字提示                                          |
| className        | `string`                                      | `panel-default`           | 外层 CSS 类名                                                     |
| tableClassName   | `string`                                      | `table-db table-striped`  | 表格 CSS 类名                                                     |
| headerClassName  | `string`                                      | `Action.md-table-header`  | 顶部外层 CSS 类名                                                 |
| footerClassName  | `string`                                      | `Action.md-table-footer`  | 底部外层 CSS 类名                                                 |
| toolbarClassName | `string`                                      | `Action.md-table-toolbar` | 工具栏 CSS 类名                                                   |
| columns          | Array<[Column](#%E5%88%97%E9%85%8D%E7%BD%AE)> |                           | 用来设置列信息                                                    |
| combineNum       | `number`                                      |                           | 自动合并单元格                                                    |
| itemActions      | Array<[Action](./action-button)>              |                           | 悬浮行操作按钮组                                                  |
| itemCheckableOn  | [表达式](../concepts/expression)              |                           | 配置当前行是否可勾选的条件，要用 [表达式](../concepts/expression) |
| itemDraggableOn  | [表达式](../concepts/expression)              |                           | 配置当前行是否可拖拽的条件，要用 [表达式](../concepts/expression) |
| checkOnItemClick | `boolean`                                     | `false`                   | 点击数据行是否可以勾选当前行                                      |
