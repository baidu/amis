## Table

表格展示，不负责拉取数据，所以你需要配置 source 用来关联数据，一般需要搭配其他具备获取接口数据能力的渲染器一起使用，比如: Page 的 initApi 或者 Service 的 api。有了数据后，配置  columns 就能完成渲染了。

| 属性名           | 类型                          | 默认值                    | 说明                                                    |
| ---------------- | ----------------------------- | ------------------------- | ------------------------------------------------------- |
| type             | `string`                      |                           | `"type"` 指定为 table 渲染器                           |
| title            | `string`                      |                           | 标题                                                    |
| source           | `string`                      | `${items}`                | 数据源, 绑定当前环境变量                                |
| affixHeader      | `boolean`                     | `true`                    | 是否固定表头                                            |
| columnsTogglable | `auto` 或者 `boolean`         | `auto`                    | 展示列显示开关, 自动即：列数量大于或等于 5 个时自动开启 |
| placeholder      | string                        | `暂无数据`                | 当没数据的时候的文字提示                                |
| className        | `string`                      | `panel-default`           | 外层 CSS 类名                                           |
| tableClassName   | `string`                      | `table-db table-striped`  | 表格 CSS 类名                                           |
| headerClassName  | `string`                      | `Action.md-table-header`  | 顶部外层 CSS 类名                                       |
| footerClassName  | `string`                      | `Action.md-table-footer`  | 底部外层 CSS 类名                                       |
| toolbarClassName | `string`                      | `Action.md-table-toolbar` | 工具栏 CSS 类名                                         |
| columns          | Array of [Column](./Column.md)|                           | 用来设置列信息                                          |
| combineNum       | `number`                      |                           | 自动合并单元格                                      |

```schema:height="700" scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
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

### 列开关

默认 `columnsTogglable` 配置为 `auto`，当列超过 5 列后，就会在工具栏多渲染出来一个列展示与否的开关。你可以设置成 `true` 或者 `false` 来强制开或者关。在列配置中可以通过配置 `toggled` 为 `false` 默认不展示这列，比如下面这个栗子中 ID 这一栏。

```schema:height="330" scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
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

### 嵌套

当行数据中存在 children 属性时，可以自动嵌套显示下去。示例：https://baidu.github.io/amis/crud/nested?page=1

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

### 底部展示 (Footable)

列太多时，内容没办法全部显示完，可以让部分信息在底部显示，可以让用户展开查看详情。配置很简单，只需要开启 `footable` 属性，同时将想在底部展示的列加个 `breakpoint` 属性为 `*` 即可。

示例：https://baidu.github.io/amis/crud/footable?page=1

```schema:height="400" scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
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


### 合并单元格

只需要配置 `combineNum` 属性即可，他表示从左到右多少列内启动自动合并单元格，只要多行的同一个属性值是一样的，就会自动合并。

示例：https://baidu.github.io/amis/crud/merge-cell

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

### 超级表头

超级表头意思是，表头还可以再一次进行分组。额外添加个 `groupName` 属性即可。

示例：https://baidu.github.io/amis/crud/header-group

```schema:height="430" scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
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

### 固定列

列太多可以让重要的几列固定，可以配置固定在左侧还是右侧，只需要给需要固定的列上配置 `fixed` 属性，配置 `left` 或者 `right`。

示例：https://baidu.github.io/amis/crud/fixed

```schema:height="530" scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
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