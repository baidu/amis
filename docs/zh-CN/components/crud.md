---
title: CRUD 增删改查
description:
type: 0
group: ⚙ 组件
menuName: CRUD 增删改查
icon:
order: 25
---

CRUD，即增删改查组件，主要用来展现数据列表，并支持各类【增】【删】【改】【查】等操作。

注意 CRUD 所需的数据必须放 items 中，因此如果只是想显示表格类型的数据没有分页，请使用 [Table](./table)。

## 基本用法

最基本的用法是配置 **数据源接口(api)** 以及 **展示列(columns)**

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample",
    "syncLocation": false,
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
        },
        {
            "type": "operation",
            "label": "操作",
            "buttons": [
                {
                    "label": "详情",
                    "type": "button",
                    "level": "link",
                    "actionType": "dialog",
                    "dialog": {
                        "title": "查看详情",
                        "body": {
                            "type": "form",
                            "body": [
                                {
                                    "type": "input-text",
                                    "name": "engine",
                                    "label": "Engine"
                                },
                                {
                                    "type": "input-text",
                                    "name": "browser",
                                    "label": "Browser"
                                },
                                {
                                    "type": "input-text",
                                    "name": "platform",
                                    "label": "platform"
                                },
                                {
                                    "type": "input-text",
                                    "name": "version",
                                    "label": "version"
                                },
                                {
                                    "type": "control",
                                    "label": "grade",
                                    "body": {
                                        "type": "tag",
                                        "label": "${grade}",
                                        "displayMode": "normal",
                                        "color": "active"
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    "label": "删除",
                    "type": "button",
                    "level": "link",
                    "className": "text-danger",
                    "disabledOn": "this.grade === 'A'"
                }
            ]
        }
    ]
}
```

## 数据源接口数据结构要求

- `items`或`rows`：用于返回数据源数据，格式是数组
- `total`: 用于返回数据库中一共有多少条数据，用于生成分页

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "items": [
      {
        // 每一行的数据
        "id": 1,
        "xxx": "xxxx"
      }
    ],

    "total": 200 // 注意！！！这里不是当前请求返回的 items 的长度，而是数据库中一共有多少条数据，用于生成分页组件
    // 如果你不想要分页，把这个不返回就可以了。
  }
}
```

如果想要通过接口控制当前所处在第几页，可以返回字段 `page`（或自定义字段 `pageField` 的值）。

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "items": [
      {
        // 每一行的数据
        "id": 1,
        "xxx": "xxxx"
      }
    ],

    "total": 200,
    "page": 20
  }
}
```

如果无法知道数据总数，只能知道是否有下一页，请返回如下格式，amis 会简单生成一个简单版本的分页控件。

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "items": [
      {
        // 每个成员的数据。
        "id": 1,
        "xxx": "xxxx"
      }
    ],

    "hasNext": true // 是否有下一页。
  }
}
```

如果不需要分页，或者配置了 `loadDataOnce` 则可以忽略掉 `total` 和 `hasNext` 参数。

> 如果 api 地址中有变量，比如 `/api/mock2/sample/${id}`，amis 就不会自动加上分页参数，需要自己加上，改成 `/api/mock2/sample/${id}?page=${page}&perPage=${perPage}`

## 分页参数

默认的分页参数是 `page` 和 `perPage`，page 代表页数，比如第一页，perPage 代表每页显示几行。

如果要其它格式，比如转成 `limit` 和 `offset`，可以使用公式来转换，比如

`/api/mock2/sample?limit=${perPage}&offset=${(page - 1) * perPage}`

## 功能

既然这个渲染器叫增删改查，那接下来分开介绍这几个功能吧。

### 增

其实这个渲染器并没有包含新增功能，新增功能其实还是依靠其他位置放个弹框表单完成，弹框完事了会自动让页面里面的 CRUD 刷新如：

```schema: scope="body"
[
    {
        "label": "新增",
        "type": "button",
        "actionType": "dialog",
        "level": "primary",
        "className": "m-b-sm",
        "dialog": {
            "title": "新增表单",
            "body": {
                "type": "form",
                "api": "post:/api/mock2/sample",
                "body": [
                    {
                        "type": "input-text",
                        "name": "engine",
                        "label": "Engine"
                    },
                    {
                        "type": "input-text",
                        "name": "browser",
                        "label": "Browser"
                    }
                ]
            }
        }
    },
    {
        "type": "crud",
        "api": "/api/mock2/sample?orderBy=id&orderDir=desc",
        "syncLocation": false,
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
```

当然如果你不想要自动刷新，那么给按钮配置 reload: "none" 就行了。

### 删

删除功能主要有三种实现：[单条操作](#单条操作)、[批量操作](#批量操作)或者直接添加一个操作栏，在里面放个类型为 ajax 类型的按钮即可。在这个按钮里面能获得对应的行数据，而且完成后也会自动刷新这个 CRUD 列表。

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample?orderBy=id&orderDir=desc",
    "syncLocation": false,
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
            "type": "operation",
            "label": "操作",
            "buttons": [
                {
                    "label": "删除",
                    "type": "button",
                    "actionType": "ajax",
                    "level": "danger",
                    "confirmText": "确认要删除？",
                    "api": "delete:/api/mock2/sample/${id}"
                }
            ]
        }
    ]
}
```

### 改

改和删其实是差不多的，唯一的区别在于，配置不同的 api，按钮类型改成弹框。

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample?orderBy=id&orderDir=desc",
    "syncLocation": false,
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
            "type": "operation",
            "label": "操作",
            "buttons": [
                {
                    "label": "修改",
                    "type": "button",
                    "actionType": "drawer",
                    "drawer": {
                        "title": "新增表单",
                        "body": {
                            "type": "form",
                            "initApi": "/api/mock2/sample/${id}",
                            "api": "post:/api/mock2/sample/${id}",
                            "body": [
                                {
                                    "type": "input-text",
                                    "name": "engine",
                                    "label": "Engine"
                                },
                                {
                                    "type": "input-text",
                                    "name": "browser",
                                    "label": "Browser"
                                }
                            ]
                        }
                    }
                }
            ]
        }
    ]
}
```

弹框里面可用数据自动就是点击的那一行的行数据，如果列表没有返回，可以在 form 里面再配置个 initApi 初始化数据，如果行数据里面有倒是不需要再拉取了。表单项的 name 跟数据 key 对应上便自动回显了。默认发送给表单的保存接口只会包含配置了的表单项，如果不够，请在 api 上配置数据映射，或者直接添加 hidden 类型的表单项（即隐藏域 input[type=hidden]）。

### 查

查，就不单独介绍了，这个文档绝大部分都是关于查的。

## 展示模式

CRUD 支持下面 3 种展示模式，默认为 Table 表格模式。

### Table 表格模式

Table 模式支持 [Table](./table) 中的所有功能。

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample",
    "syncLocation": false,
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
        }
    ]
}
```

这个模式下会默认开启固定表头功能，如果不需要可以使用 `"affixHeader": false` 关闭。

### List 列表模式

List 模式支持 [List](./list) 中的所有功能。

```schema: scope="body"
{
"type": "crud",
"api": "/api/mock2/crud/permissions",
"mode": "list",
"placeholder": "当前组内, 还没有配置任何权限.",
"syncLocation": false,
"title": null,
"listItem": {
  "title": "$name",
  "subTitle": "$description",
  "actions": [
    {
      "icon": "fa fa-edit",
      "className": "mr-4",
      "tooltip": "编辑",
      "actionType": "dialog",
      "dialog": {
        "title": "编辑能力（权限）",
        "body": {
          "type": "form",
          "body": [
          {
            "type": "hidden",
            "name": "id"
          },
          {
            "name": "name",
            "label": "权限名称",
            "type": "input-text",
            "disabled": true
          },
          {
            "type": "divider"
          },
          {
            "name": "description",
            "label": "描述",
            "type": "textarea"
          }
        ]
        }
      }
    },
    {
      "tooltip": "删除",
      "disabledOn": "~[\"admin:permission\", \"admin:user\", \"admin:role\", \"admin:acl\", \"admin:page\", \"page:readAll\", \"admin:settings\"].indexOf(name)",
      "icon": "fa fa-times",
      "confirmText": "您确定要移除该权限?",
      "actionType": "ajax",
      "api": "delete:/api/mock2/notFound"
    }
  ]
}
}
```

### Cards 卡片模式

Cards 模式支持 [Cards](./cards) 中的所有功能。

```schema: scope="body"
{
  "type": "crud",
  "api": "/api/mock2/crud/users",
  "syncLocation": false,
  "mode": "cards",
  "defaultParams": {
    "perPage": 6
  },
  "switchPerPage": false,
  "placeholder": "没有用户信息",
  "columnsCount": 2,
  "card": {
    "header": {
      "className": "bg-white",
      "title": "$name",
      "subTitle": "$realName",
      "description": "$email",
      "avatar": "${avatar | raw}",
      "highlight": "$isSuperAdmin",
      "avatarClassName": "pull-left thumb-md avatar b-3x m-r"
    },
    "bodyClassName": "padder",
    "body": "\n      <% if (this.roles && this.roles.length) { %>\n        <% this.roles.map(function(role) { %>\n          <span class=\"label label-default\"><%- role.name %></span>\n        <% }) %>\n      <% } else { %>\n        <p class=\"text-muted\">没有分配角色</p>\n      <% } %>\n      ",
    "actions": [
      {
        "label": "编辑",
        "actionType": "dialog",
        "dialog": {
          "title": null,
          "body": {
            "api": "",
            "type": "form",
            "tabs": [
              {
                "title": "基本信息",
                "body": [
                  {
                    "type": "hidden",
                    "name": "id"
                  },
                  {
                    "name": "name",
                    "label": "帐号",
                    "disabled": true,
                    "type": "input-text"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "name": "email",
                    "label": "邮箱",
                    "type": "input-text",
                    "disabled": true
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "name": "isAmisOwner",
                    "label": "管理员",
                    "description": "设置是否为超级管理",
                    "type": "switch"
                  }
                ]
              },
              {
                "title": "角色信息",
                "body": []
              },
              {
                "title": "设置权限",
                "body": []
              }
            ]
          }
        }
      },
      {
        "label": "移除",
        "confirmText": "您确定要移除该用户?",
        "actionType": "ajax",
        "api": "delete:/api/mock2/notFound"
      }
    ]
  }
}
```

## 查询条件表单

大部分表格展示有对数据进行检索的需求，CRUD 自身支持通过配置`filter`，实现查询条件过滤表单。`filter` 配置实际上同 [Form](./form/index) 组件，因此支持绝大部分`form`的功能。

在条件搜索区的 `Engine` 输入框中输入任意值查询会发现结果中 `ID` 为 1 - 3 的 `Rendering engine` 列因为返回值中没有对应字段值，被错误填入了与 `filter` 中相同 `name` 的字段值，这是因为表格 Cell 通过[数据链](../../docs/concepts/datascope-and-datachain)获取到了上层数据域 `filter` 中相同字段的数据值。这种情况可以在 CRUD `columns` 对应列配置`"canAccessSuperData": false`禁止访问父级数据域（比如: `Platform`列）。

```schema: scope="body"
{
    "type": "crud",
    "name": "crud",
    "syncLocation": false,
    "api": "/api/mock2/crud/table4",
    "filter": {
        "debug": true,
        "title": "条件搜索",
        "body": [
            {
                "type": "group",
                "body": [
                    {
                        "type": "input-text",
                        "name": "keywords",
                        "label": "关键字",
                        "clearable": true,
                        "placeholder": "通过关键字搜索",
                        "size": "sm"
                    },
                    {
                        "type": "input-text",
                        "name": "engine",
                        "label": "Engine",
                        "clearable": true,
                        "size": "sm"
                    },
                    {
                        "type": "input-text",
                        "name": "platform",
                        "label": "Platform",
                        "clearable": true,
                        "size": "sm"
                    }
                ]
            }
        ],
        actions: [
            {
                "type": "button",
                "actionType": "drawer",
                "icon": "fa fa-plus",
                "label": "创建记录",
                "target": "crud",
                "closeOnOutside": true,
                "drawer": {
                    "title": "创建记录",
                    "body": {
                        "type": "form",
                        "api": "post:/api/mock2/sample",
                        "body": [
                            {
                                "type": "input-text",
                                "name": "engine",
                                "label": "Engine"
                            },
                            {
                                "type": "input-text",
                                "name": "browser",
                                "label": "Browser"
                            }
                        ]
                    }
                }
            },
            {
                "type": "reset",
                "label": "重置"
            },
            {
                "type": "submit",
                "level": "primary",
                "label": "查询"
            }
        ]
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
            "label": "Platform(s)",
            "canAccessSuperData": false
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
```

**请注意**：在默认没有自定义配置 api 数据映射时，提交查询条件表单，会自动将表单中的表单项值，发送给`crud`所配置的接口，然后通过后端接口，实现对数据的过滤操作，前端默认是不会进行任何的数据过滤操作

如果想前端实现过滤功能，请看[前端一次性加载](#前端一次性加载)部分。

### 自动生成查询区域

通过设置`"autoGenerateFilter": true`开启查询区域，会根据列元素的 `searchable` 属性值，自动生成查询条件表单，只有 `searchable` 属性值为合法的组件 Schema 时才会生成查询条件。注意这个属性和 `filter` 冲突，开启 `filter` 后 `autoGenerateFilter` 将会失效。

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample",
    "syncLocation": false,
    "autoGenerateFilter": true,
    "headerToolbar": [
        {
            "type": "columns-toggler",
            "align": "right",
            "draggable": true,
            "icon": "fas fa-cog",
            "overlay": true,
            "footerBtnSize": "sm"
        }
    ],
    "columns": [
        {
            "name": "id",
            "label": "ID",
            "searchable": {
              "type": "input-text",
              "name": "id",
              "label": "主键",
              "placeholder": "输入id"
            }
        },
        {
            "name": "engine",
            "label": "Rendering engine"
        },
        {
            "name": "browser",
            "label": "Browser",
            "searchable": {
              "type": "select",
              "name": "browser",
              "label": "浏览器",
              "placeholder": "选择浏览器",
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
            "label": "Platform(s)"
        },
        {
            "name": "version",
            "label": "Engine version",
            "searchable": {
              "type": "input-number",
              "name": "version",
              "label": "版本号",
              "placeholder": "输入版本号",
              "mode": "horizontal"
            }
        },
        {
            "name": "grade",
            "label": "CSS grade"
        }
    ]
}
```

## 配置默认请求参数

可以配置`defaultParams`，来指定拉取接口时的默认参数：

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "defaultParams": {
        "perPage": 50
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
```

例如上例中，配置`{ perPage: 50 }`，指定分页的默认每页数据条数为 50 条。

## 数据源接口轮询

可以配置`interval`来实现数据接口轮询功能，最低为`1000`毫秒：

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "interval": 3000,
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
```

配置`stopAutoRefreshWhen`表达式，来实现满足条件，停止轮询

## 列配置

除了支持 [Table 中的列配置](./table#%E5%88%97%E9%85%8D%E7%BD%AE) 以外，crud 还支持下面这些配置，帮助更好的操作数据

### 排序检索

可以在列上配置`"sortable": true`，该列表头右侧会渲染一个可点击的排序图标，可以切换`正序`和`倒序`。

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "engine",
            "label": "Rendering engine",
            "sortable": true
        }
    ]
}
```

amis 只负责生成排序组件，并将排序参数传递给接口，而不会在前端对数据进行排序处理。参数格式如下：

```json
{
  "orderBy": "engine", // 这里为所配置列的 name
  "orderDir": "asc" // asc 为升序，desc 为降序
}
```

你可以通过[数据映射](../../docs/concepts/data-mapping)，在`api`中获取这些参数。

### 快速搜索

可以在列上配置`"searchable": true`，该列表头右侧会渲染一个可点击的搜索图标，点击可以输入关键字进行该列的搜索：

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "engine",
            "label": "Rendering engine",
            "searchable": true
        }
    ]
}
```

amis 只负责生成搜索组件，并将搜索参数传递给接口，而不会在前端对数据进行搜索处理。参数格式如下：

```json
{
  "engine": "xxx" // 这里的key是列的 name，value是输入的关键字
}
```

你可以通过[数据映射](../../docs/concepts/data-mapping)，在`api`中获取这些参数。

### 快速过滤

可以在列上配置`filterable`属性，该列表头右侧会渲染一个可点击的过滤图标，点击显示下拉框，选中进行过滤：

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
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
            "filterable": {
                "options": [
                    {"label": "0", "value": 0},
                    {"label": "1", "value": 1}
                ]
            }
        }
    ]
}
```

amis 只负责生成下拉选择器组件，并将搜索参数传递给接口，而不会在前端对数据进行搜索处理。参数格式如下：

```json
{
  "grade": "xxx" // 这里的key是列的 name，value是选中项的value值
}
```

你可以通过[数据映射](../../docs/concepts/data-mapping)，在`api`中获取这些参数。

### 快速编辑

可以通过给列配置：`"quickEdit":true`和`quickSaveApi` 可以实现表格内快速编辑并批量保存的功能。

如下`Rendering engine`列的每一行中，会生成可编辑图标，点击后会显示弹框，用于编辑该列的值，

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "quickSaveApi": "/api/mock2/sample/bulkUpdate",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "engine",
            "label": "Rendering engine",
            "quickEdit":true
        }
    ]
}
```

#### 指定编辑表单项类型

`quickEdit`也可以配置对象形式，可以指定编辑表单项的类型，例如`"type": "select"`：

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "quickSaveApi": "/api/mock2/sample/bulkUpdate",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "grade",
            "label": "CSS grade",
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
```

#### 快速编辑多个表单项

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "quickSaveApi": "/api/mock2/sample/bulkUpdate",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "grade",
            "label": "CSS grade",
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
```

#### 内联模式

配置`quickEdit`的`mode`为`inline`。可以直接将编辑表单项渲染至表格内，可以直接操作编辑。

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "quickSaveApi": "/api/mock2/sample/bulkUpdate",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "grade",
            "label": "CSS grade",
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
            "label": "switch",
            "quickEdit": {
                "mode": "inline",
                "type": "switch",
                "onText": "开启",
                "offText": "关闭"
            }
        }
    ]
}
```

#### 即时保存

如果想编辑完表单项之后，不想点击顶部确认按钮来进行保存，而是即时保存当前标记的数据，则需要配置 `quickEdit` 中的 `"saveImmediately": true`，然后配置接口`quickSaveItemApi`，可以直接将编辑表单项渲染至表格内操作。

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "quickSaveItemApi": "/api/mock2/sample/$id",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "grade",
            "label": "CSS grade",
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
            "label": "switch",
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
```

你也可以在`saveImmediately`中配置 api，实现即时保存

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "grade",
            "label": "CSS grade",
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
            "label": "CSS grade",
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
```

#### 配置快速编辑启动条件

通过 `quickEditEnabledOn` 配置表达式来实现，如下，只有 id 小于 5 的数据可以编辑 engine。

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "quickSaveApi": "/api/mock2/sample/bulkUpdate",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "engine",
            "label": "Rendering engine",
            "quickEdit":true,
            "quickEditEnabledOn": "this.id < 5"
        }
    ]
}
```

## 顶部和底部工具栏

crud 组件支持通过配置`headerToolbar`和`footerToolbar`属性，实现在表格顶部和底部渲染组件，

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": [
        {
            "type": "tpl",
            "tpl": "一共有${count}条数据"
        }
    ],
    "footerToolbar": [
        {
            "type": "action",
            "actionType": "dialog",
            "label": "底部工具栏按钮",
            "dialog": {
                "title": "一个弹框",
                "body": {
                    "type": "tpl",
                    "tpl": "一个简单的弹框"
                }
            }
        }
    ],
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
```

上例中我们在顶部渲染了一段模板，通过`${count}`取到数据域中，CRUD 返回的`count`变量值；然后我们在底部渲染了一个按钮。

从上面一些例子中你可能已经发现，当我们不配置该属性时，crud 默认会在顶部和底部渲染一些组件，实际上，`headerToolbar`和`footerToolbar`默认会有下面这些配置：

```json
{
  "headerToolbar": ["bulkActions", "pagination"],
  "footerToolbar": ["statistics", "pagination"]
}
```

- 在顶部工具栏中：渲染批量操作按钮（如果在 crud 中，配置了 bulkActions 的话）和 分页组件
- 在底部工具栏中：渲染数据统计组件 和 分页组件

> 如果你不希望在顶部或者底部渲染默认组件，你可以设置`headerToolbar`和`footerToolbar`为空数组`[]`

这些组件还能设置 `align` 来控制位置，有 `left` 和 `right` 两种，比如

```json
{
  "headerToolbar": [
    {
      "type": "bulkActions",
      "align": "right"
    }
  ]
}
```

### 其它 amis 组件

在 `headerToolbar` 和 `footerToolbar` 中可以配置各种 amis 其它组件，比如按钮和 tpl：

```schema: scope="body"
{
    "type": "crud",
    "name": "myCRUD",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": [
        {
            "label": "点击弹框",
            "type": "button",
            "actionType": "dialog",
            "icon": "fa fa-plus",
            "level": "primary",
            "dialog": {
                "title": "弹框标题",
                "body": "这是一个弹框"
            }
        },
        {
            "type": "tpl",
            "tpl": "自定义模板"
        },
        {
            "label": "",
            "icon": "fa fa-repeat",
            "type": "button",
            "actionType": "reload",
            "target": "myCRUD",
            "align": "right"
        }
    ],
    "footerToolbar": [],
    "columns": [
        {
            "name": "id",
            "label": "ID"
        }
    ]
}
```

### 分页

在`headerToolbar`或者`footerToolbar`数组中添加`pagination`字符串，并且在数据源接口中返回了数据总数`count`，即可以渲染分页组件；添加`switch-per-page`字符串，可以渲染切换每页条数组件

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": [],
    "footerToolbar": ["switch-per-page", "pagination"],
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "name": "grade",
            "label": "CSS grade",
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
        }
    ]
}
```

`crud`默认不会处理数据分页，只是会把分页参数传给后端，由后端实现分页，并返回需要展示的数据 和 总数据数`total`变量：

默认传给后端的分页参数格式为：

```json
{
  "page": 1,
  "perPage": 10
}
```

你可以通过配置`pageField`和`perPageField`来修改传给后端的分页数据格式，如：

```json
{
  "pageField": "pageNo",
  "perPageField": "pageSize"
}
```

这样传给后端的参数格式将为：

```json
{
  "pageNo": 1,
  "pageSize": 10
}
```

你可以通过[数据映射](../../docs/concepts/data-mapping)，在`api`中获取这些参数。

```json
{
    "type": "crud",
    "api": {
        "method": "get",
        "url": "xxxxxx",
        "data": {
            "pageNo": "${page}",
            "pageSize": "${perPage}",
            ... // 一些其他参数
        }
    }
}
```

分页有两种模式：

##### 1. 知道数据总数

如果后端可以知道数据总数时，接口返回格式如下：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "items": [
      {
        // 每一行的数据。
        "id": 1,
        "xxx": "xxxx"
      }
    ],

    "total": 200 // 注意这里不是当前请求返回的 items 的长度，而是数据库一共有多少条数据，用于生成分页，
  }
}
```

该模式下，会自动计算总页码数，渲染出有页码的分页组件

##### 2. 不知道数据总数

如果后端无法知道数据总数，那么可以返回`hasNext`字段，来标识是否有下一页。

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "items": [
      {
        // 每个成员的数据。
        "id": 1,
        "xxx": "xxxx"
      }
    ],

    "hasNext": true // 标识是否有下一页。
  }
}
```

这样 amis 会在配置分页组件的地方，渲染出一个简单的页面跳转控件。

> 如果总数据只够展示一页，则默认不显示该分页组件

### 批量操作

在`headerToolbar`或者`footerToolbar`数组中添加`bulkActions`字符串，并且在 crud 上配置`bulkActions`行为按钮数组，可以实现选中表格项并批量操作的功能。

> 需要设置`primaryField`用于标识选中状态，配置当前行数据中的某一**唯一标识字段**，例如`id`，否则可能会出现无法选中的问题

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": [
        "bulkActions"
    ],
    "bulkActions": [
        {
            "label": "批量删除",
            "actionType": "ajax",
            "api": "delete:/api/mock2/sample/${ids|raw}",
            "confirmText": "确定要批量删除?"
        },
        {
            "label": "批量修改",
            "actionType": "dialog",
            "dialog": {
                "title": "批量编辑",
                "body": {
                    "type": "form",
                    "api": "/api/mock2/sample/bulkUpdate2",
                    "body": [
                        {
                            "type": "hidden",
                            "name": "ids"
                        },
                        {
                            "type": "input-text",
                            "name": "engine",
                            "label": "Engine"
                        }
                    ]
                }
            }
        }
    ],
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
```

#### 批量操作数据域

批量操作会默认将下面数据添加到数据域中以供**按钮行为**使用，需要注意的是**静态**和**批量操作**时的数据域是不同的。**静态数据域**是指渲染批量操作区域时能够获取到的数据，**批量操作数据域**是指触发按钮动作时能够获取到的数据，具体区别参考下表：

| 属性名            | 类型                  | 所属数据域     | 说明                                                                                 | 版本    |
| ----------------- | --------------------- | -------------- | ------------------------------------------------------------------------------------ | ------- |
| `currentPageData` | `Array<Column>`       | 静态, 批量操作 | 当前分页数据集合，`Column`为当前 Table 数据结构定义                                  | `2.4.0` |
| `selectedItems`   | `Array<Column>`       | 静态, 批量操作 | 选中的行数据集合                                                                     |
| `unSelectedItems` | `Array<Column>`       | 静态, 批量操作 | 未选中的行数据集合                                                                   |
| `items`           | `Array<Column>`       | 批量操作       | `selectedItems` 的别名                                                               |
| `rows`            | `Array<Column>`       | 批量操作       | `selectedItems` 的别名，推荐用 `items`                                               |
| `ids`             | `string`              | 批量操作       | 多个 id 值用英文逗号隔开，前提是行数据中有 id 字段，或者有指定的 `primaryField` 字段 |
| `...rest`         | `Record<string, any>` | 批量操作       | 选中的行数据集合的首个元素的字段，注意列字段如果和以上字段重名时，会被上述字段值覆盖 |

你可以通过[数据映射](../../docs/concepts/data-mapping)，在`api`中获取这些参数。

**约束批量操作**

有时候并不是勾选了就能支持批量操作的，比如想约束如果勾选了某条数据 owner 值不是当前用户的就不可以操作。

有两种方式来约束。

1. 批量操作按钮上配置 `disabledOn` 值为 `this.selectedItems.some(item => item.owner === this.amisUser.name)`
2. 给表格加上 `itemCheckableOn` 值为 `this.owner === this.amisUser.name` 表示只有 owner 是自己的才可以打勾。

**保留条目选择**

默认分页、搜素后，用户选择条目会被清空，配置`keepItemSelectionOnPageChange`属性后会保留用户选择，可以实现跨页面批量操作。
同时可以通过配置`maxKeepItemSelectionLength`属性限制最大勾选数

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": [
        "bulkActions"
    ],
    "keepItemSelectionOnPageChange": true,
    "maxKeepItemSelectionLength": 4,
    "bulkActions": [
        {
            "label": "批量删除",
            "actionType": "ajax",
            "api": "delete:/api/mock2/sample/${ids|raw}",
            "confirmText": "确定要批量删除?"
        },
        {
            "label": "批量修改",
            "actionType": "dialog",
            "dialog": {
                "title": "批量编辑",
                "body": {
                    "type": "form",
                    "api": "/api/mock2/sample/bulkUpdate2",
                    "body": [
                        {
                            "type": "hidden",
                            "name": "ids"
                        },
                        {
                            "type": "input-text",
                            "name": "engine",
                            "label": "Engine"
                        }
                    ]
                }
            }
        }
    ],
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
```

还可以设置 `"checkOnItemClick": true` 属性来支持点击一行的触发选中状态切换

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "checkOnItemClick": true,
    "headerToolbar": [
        "bulkActions"
    ],
    "bulkActions": [
        {
            "label": "批量删除",
            "actionType": "ajax",
            "api": "delete:/api/mock2/sample/${ids|raw}",
            "confirmText": "确定要批量删除?"
        },
        {
            "label": "批量修改",
            "actionType": "dialog",
            "dialog": {
                "title": "批量编辑",
                "body": {
                    "type": "form",
                    "api": "/api/mock2/sample/bulkUpdate2",
                    "body": [
                        {
                            "type": "hidden",
                            "name": "ids"
                        },
                        {
                            "type": "input-text",
                            "name": "engine",
                            "label": "Engine"
                        }
                    ]
                }
            }
        }
    ],
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
```

### 数据统计

在`headerToolbar`或者`footerToolbar`数组中添加`statistics`字符串，可以实现简单的数据统计功能

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": ["statistics"],
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
```

### 加载更多

在`headerToolbar`或者`footerToolbar`数组中添加`load-more`字符串，可以实现点击加载更多功能。

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": ["load-more"],
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
```

### 导出 CSV

在`headerToolbar`或者`footerToolbar`数组中添加`export-csv`字符串，可以实现点击下载 CSV 的功能，注意这里只包括当前分页的数据，要下载全部数据需要通过后端 API 实现。

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": ["export-csv"],
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
```

### 通过 api 导出 CSV

> 1.4.0 及以上版本

`export-csv` 可以单独配置 `api` 实现导出全量功能，这个 api 的返回结果和 CRUD 类似

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": [{
        "type": "export-csv",
        "label": "全量导出 CSV",
        "api": "/api/mock2/sample"
    }],
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
```

### 导出 Excel

在`headerToolbar`或者`footerToolbar`数组中添加`export-excel`字符串，可以实现点击下载 Excel 的功能，和导出 CSV 一样只包括当前分页的数据，但它们有明显区别：

1. 导出 CSV 是将 api 返回数据导出，表头是数据里的 key，而 Excel 的表头使用的是 label。
2. 导出 Excel 更重视展现一致，支持合并单元格、链接、mapping 映射、图片（需要加[跨域 Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)）。
3. 导出 Excel 只在 `mode` 为 `table` 时能用。

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": ["export-excel"],
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
```

#### 只导出部分列

> 1.4.0 及以上版本

通过配置 `columns` 来支持只导出部分列，其中是需要导出的列 `name` 数组

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": [{
        "type": "export-excel",
        "label": "只导出 engine 和  browser 列",
        "columns": ["engine", "browser"]
    }],
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
```

> 1.8.0 及以上版本

`columns` 支持变量，可以从上下文取数组

```schema
{
    "type": "page",
    "data": {
        "columns": ["engine", "browser"]
    },
    "body": {
        "type": "crud",
        "syncLocation": false,
        "api": "/api/mock2/sample",
        "headerToolbar": [{
            "type": "export-excel",
            "label": "只导出 engine 和  browser 列",
            "columns": "${columns}"
        }],
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
}
```

#### 自定义导出列

> 1.8.0 及以上版本

除了简单隐藏某些列，还可以通过 `exportColumns` 完全控制导出列，比如新增某些列，它的配置项和 `columns` 一致

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": [{
        "type": "export-excel",
        "label": "导出 Excel",
        "exportColumns": [
            {
                "name": "engine",
                "label": "Engine"
            },
            {
                "type": "tpl",
                "label": "tpl",
                "tpl": "${browser}"
            }
        ]
    }],
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
```

#### 通过 api 导出 Excel

> 1.1.6 以上版本支持

除了前面的用法，还可以配置 api 来通过数据请求来导出 Excel，实现类似全量导出的功能

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "headerToolbar": [{
        "type": "export-excel",
        "label": "全量导出 Excel",
        "api": "/api/mock2/sample"
    }],
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
```

#### 自定义导出 Excel 的文件名

> 1.1.7 以上版本支持

通过 filename 自定义导出文件名（支持模板变量）

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "headerToolbar": [{
        "type": "export-excel",
        "label": "自定义导出 Excel",
        "filename": "自定义文件名${test}",
        "api": "/api/mock2/sample"
    }],
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
```

### 显隐显示查询条件表单

在`headerToolbar`或者`footerToolbar`数组中添加`filter-toggler`字符串，并且在 crud 中配置`"filterTogglable": true`后，可以渲染一个可以切换显示查询表单的功能按钮

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
     "filter": {
        "title": "条件搜索",
        "body": [
            {
                "type": "input-text",
                "name": "keywords",
                "placeholder": "通过关键字搜索"
            }
        ]
    },
    "filterTogglable": true,
    "headerToolbar": [
        "filter-toggler"
    ],
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
```

### 刷新按钮

> 1.5.0 及以上版本

可以通过 `reload` 来展现刷新按钮

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": [
        "reload"
    ],
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
```

它其实是个简化的 `button` 组件，可以参考 `button` 组件的文档做调整。`reload`支持两种触发方式：

- `"type": "reload"`，CRUD 内置的方法
- `{"actionType": "reload", "target": "targetName"}`，动作触发

```schema: scope="body"
{
    "type": "crud",
    "name": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "headerToolbar": [
        {
            "type": "action",
            "align": "right",
            "icon": "iconfont icon-refresh",
            "label": "刷新(actionType)",
            "tooltip": "",
            "level": "primary",
            "actionType": 'reload',
            "target": 'crud'
        },
        {
            "type": "reload",
            "align": "right",
            "icon": "iconfont icon-refresh",
            "label": "刷新(type)",
            "tooltip": "",
            "level": "primary"
        }
    ],
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
```

## 总结行

如果是默认的表格模式，还支持增加总结行，具体请参考 [table](./table#总结行) 的文档。

## 弹框与数据链

一般 CRUD 中会有弹框，然后进行数据展示或进行二次编辑的需求，通过在列中配置按钮，然后配置弹框，弹框内配置相应的组件即可。

现在问题是，如何获取到当前操作行的数据呢？

实际上，你操作当前行数据，会成为弹框这层节点的父级节点，因此你可以通过 [数据链](../../docs/concepts/datascope-and-datachain)，获取到上层，也就是点击的行的数据，具体获取方法和普通组件获取数据域中数据的方法相同，

```schema: scope="body"
{
  "type": "crud",
  "syncLocation": false,
  "api": "/api/mock2/sample",
  "draggable": true,
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
    },
    {
      "type": "button",
      "label": "一个弹框",
      "actionType": "dialog",
      "dialog": {
        "title": "一个弹框",
        "body": [
          {
            "type": "tpl",
            "tpl": "行数据中 Browser 值为：${browser}"
          },
          {
            "type": "divider"
          },
          {
            "type": "form",
            "api": "/api/mock2/sample/$id",
            "body": [
              {
                "type": "input-text",
                "name": "engine",
                "label": "Engine"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

例如上例中 Tpl 用 `${browser}` 获取 `browser` 变量，Form 中配置`"name": "engine"` 映射 `engine` 变量。

> 遇到数据字段冲突时，可以在 [弹框上通过配置数据映射](./dialog#%E5%BC%B9%E6%A1%86%E4%B8%8E%E6%95%B0%E6%8D%AE%E6%98%A0%E5%B0%84) 解决。

## 拖拽排序

通过配置`"draggable": true`和保存排序接口`saveOrderApi`，可以实现拖拽排序功能，

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "draggable": true,
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
```

同样的，前端是不会处理排序结果，需要后端调用接口`saveOrderApi`来保存新的顺序

发送方式默认为`POST`，会包含以下信息。

- `ids` 字符串如： `2,3,1,4,5,6` 用 id 来记录新的顺序。 前提是你的列表接口返回了 id 字段。另外如果你的 primaryField 不是 `id`，则需要配置如： `primaryField: "order_id"`。注意：无论你配置成什么 primayField，这个字段名始终是 ids。
- `rows` `Array<Item>` 数组格式，新的顺序，数组里面包含所有原始信息。
- `insertAfter` 或者 `insertBefore` 这是 amis 生成的 diff 信息，对象格式，key 为目标成员的 primaryField 值，即 id，value 为数组，数组中存放成员 primaryField 值。如：

  ```json
  {
    "insertAfter": {
      "2": ["1", "3"],
      "6": ["4", "5"]
    }
  }
  ```

  表示：成员 1 和成员 3 插入到了成员 2 的后面。成员 4 和 成员 5 插入到了 成员 6 的后面。

你可以通过[数据映射](../../docs/concepts/data-mapping)，在`api`中获取这些参数。

如下:

```json
{
  "saveOrderApi": {
    "url": "/api/xxxx",
    "data": {
      "ids": "${ids}"
    }
  }
}
```

这样就只会发送 ids 了。

### 列排序

通过配置`headerToolbar` 中 `columns-toggler` 的 `"draggable": true`可以实现设置显示列和列排序功能。

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample",
    "syncLocation": false,
    "headerToolbar": [
        {
            "type": "columns-toggler",
            "align": "right",
            "draggable": true,
            "icon": "fas fa-cog",
            "overlay": true,
            "footerBtnSize": "sm"
        }
    ],
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
```

## 单条操作

当操作对象是单条数据时这类操作叫单条操作，比如：编辑、删除、通过、拒绝等等。CRUD 的 table 模式可以在 column 通过放置按钮来完成（其他模式参考 table 模式）。比如编辑就是添加个按钮行为是弹框类型的按钮或者添加一个页面跳转类型的按钮把当前行数据的 id 放在 query 中传过去、删除操作就是配置一个按钮行为是 AJAX 类型的按钮，将数据通过 api 发送给后端完成。

CRUD 中不限制有多少个单条操作、添加一个操作对应的添加一个按钮就行了。CRUD 在处理按钮行为的时候会把当前行的完整数据传递过去，如果你的按钮行为是弹出时，还会包含一下信息：

- `hasNext` `boolean` 当按钮行为是弹框时，还会携带这个数据可以用来判断当前页中是否有下一条数据。
- `hasPrev` `boolean` 当按钮行为是弹框时，还会携带这个数据可以判断用来当前页中是否有上一条数据。
- `index` `number` 当按钮行为是弹框时，还会携带这个数据可以用来获取当前行数据在这一页中的位置。
- `prevIndex` `number`
- `nextIndex` `number`

你可以通过[数据映射](../../docs/concepts/data-mapping)，在`api`中获取这些参数。

如果你的按钮类型是 ajax，你也可以限定只发送部分数据比如。

```json
{
  "type": "button",
  "label": "删除",
  "actionType": "ajax",
  "api": "delete:/api/xxxx/$id",
  "confirmText": "确定要删除？"
}
```

上面这个例子就会发送 id 字段了，如果想要全部发送过去同时还想添加点别的字段就这样：

```json
{
  "type": "button",
  "label": "删除",
  "actionType": "ajax",
  "api": {
    "method": "post",
    "url": "/api/xxxx/$id",
    "data": {
      "&": "$$",
      "op": "delete"
    }
  },
  "confirmText": "确定要删除？"
}
```

> **注意：** 如果使用`feedback`弹窗，如果不想关闭弹窗时触发`crud`再次拉取数据，需要设置`button`的`"reload":"none"`

## 过滤条件参数同步地址栏

默认 CRUD 会将过滤条件参数同步至浏览器地址栏中，比如搜索条件、当前页数，这也做的目的是刷新页面的时候还能进入之前的分页。

但也会导致地址栏中的参数数据合并到顶层的数据链中，例如：自动给同名的表单项设置默认值。如果不希望这个功能，可以设置 `syncLocation: false` 来关闭。

> 本文中的例子为了不相互影响都关闭了这个功能。
> 另外如果需要使用接口联动，需要设置`syncLocation: false`

## 前端一次性加载

如果你的数据并不是很大，而且后端不方便做分页和条件过滤操作，那么通过配置`loadDataOnce`实现前端一次性加载并支持分页和条件过滤操作

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "loadDataOnce": true,
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
            "label": "CSS grade",
            "sortable": true
        }
    ]
}
```

配置一次性加载后，基本的分页、快速排序操作将会在前端进行完成。如果想实现前端检索，需要用到[数据映射](../../docs/concepts/data-mapping)功能：

```schema: scope="body"
{
    "type": "crud",
    "syncLocation": false,
    "api": "/api/mock2/sample",
    "loadDataOnce": true,
    "source": "${rows | filter:engine:match:keywords}",
    "filter":{
        "body": [
            {
                "type": "input-text",
                "name": "keywords",
                "label": "引擎"
            }
        ]
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
```

上例使用了数据映射中的`filter`过滤器，在前端实现了`engine`列的搜索功能。

> **注意：**如果你的数据量较大，请务必使用服务端分页的方案，过多的前端数据展示，会显著影响前端页面的性能

## 动态列

> since 1.1.6

在 1.1.6 之前的版本，只能通过 service + schemaApi 让后端返回 schema 配置来实现，1.1.6 版本之后可以直接通过 crud 的数据接口返回了。
用这种方式可以简化动态列的实现，与 items 并列返回 columns 数组即即可。

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/crud/dynamic?waitSeconds=1"
}
```

## 使用数据链中的数据

可以通过 `source` 属性来自定义去返回数据的字段，或者取数据域中的数据，比如

```schema
{
  "type": "page",
  "data": {
    "myItems": [
      {
        "id": 1
      }
    ]
  },
  "body": {
    "type": "crud",
    "source": "${myItems}",
    "columns": [
      {
        "name": "id",
        "label": "ID"
      }
    ]
  }
}
```

## 自定义点击行的行为

> 1.4.0 及以上版本

配置 `itemAction` 可以实现点击某一行后进行自定义操作，支持 [action](./action) 里的所有配置，比如弹框、刷新其它组件等。

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample",
    "syncLocation": false,
    "itemAction": {
      "type": "button",
      "actionType": "dialog",
      "dialog": {
        "title": "详情",
        "body": "当前行的数据 browser: ${browser}, version: ${version}"
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
```

注意这个属性和 `checkOnItemClick` 冲突，因为都是定义行的点击行为，开启 `itemAction` 后 `checkOnItemClick` 将会失效。

> 1.4.2 及以上版本

itemAction 里的 onClick 还能通过 `data` 参数拿到当前行的数据，方便进行下一步操作

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample",
    "syncLocation": false,
    "itemAction": {
      "type": "button",
      "onClick": "console.log(data); alert(data.engine)"
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
```

## 属性表

| 属性名                                | 类型                            | 默认值                          | 说明                                                                                                                  |
| ------------------------------------- | ------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| type                                  | `string`                        |                                 | `type` 指定为 CRUD 渲染器                                                                                             |
| mode                                  | `string`                        | `"table"`                       | `"table" 、 "cards" 或者 "list"`                                                                                      |
| title                                 | `string`                        | `""`                            | 可设置成空，当设置成空时，没有标题栏                                                                                  |
| className                             | `string`                        |                                 | 表格外层 Dom 的类名                                                                                                   |
| api                                   | [API](../../docs/types/api)     |                                 | CRUD 用来获取列表数据的 api。                                                                                         |
| loadDataOnce                          | `boolean`                       |                                 | 是否一次性加载所有数据（前端分页）                                                                                    |
| loadDataOnceFetchOnFilter             | `boolean`                       | `true`                          | 在开启 loadDataOnce 时，filter 时是否去重新请求 api                                                                   |
| source                                | `string`                        |                                 | 数据映射接口返回某字段的值，不设置会默认使用接口返回的`${items}`或者`${rows}`，也可以设置成上层数据源的内容           |
| filter                                | [Form](./form/index)            |                                 | 设置过滤器，当该表单提交后，会把数据带给当前 `mode` 刷新列表。                                                        |
| filterTogglable                       | `boolean`                       | `false`                         | 是否可显隐过滤器                                                                                                      |
| filterDefaultVisible                  | `boolean`                       | `true`                          | 设置过滤器默认是否可见。                                                                                              |
| initFetch                             | `boolean`                       | `true`                          | 是否初始化的时候拉取数据, 只针对有 filter 的情况, 没有 filter 初始都会拉取数据                                        |
| interval                              | `number`                        | `3000`                          | 刷新时间(最低 1000)                                                                                                   |
| silentPolling                         | `boolean`                       | `false`                         | 配置刷新时是否隐藏加载动画                                                                                            |
| stopAutoRefreshWhen                   | `string`                        | `""`                            | 通过[表达式](../../docs/concepts/expression)来配置停止刷新的条件                                                      |
| stopAutoRefreshWhenModalIsOpen        | `boolean`                       | `false`                         | 当有弹框时关闭自动刷新，关闭弹框又恢复                                                                                |
| syncLocation                          | `boolean`                       | `true`                          | 是否将过滤条件的参数同步到地址栏                                                                                      |
| draggable                             | `boolean`                       | `false`                         | 是否可通过拖拽排序                                                                                                    |
| resizable                             | `boolean`                       | `true`                          | 是否可以调整列宽度                                                                                                    |
| itemDraggableOn                       | `boolean`                       |                                 | 用[表达式](../../docs/concepts/expression)来配置是否可拖拽排序                                                        |
| [saveOrderApi](#saveOrderApi)         | [API](../../docs/types/api)     |                                 | 保存排序的 api。                                                                                                      |
| [quickSaveApi](#quickSaveApi)         | [API](../../docs/types/api)     |                                 | 快速编辑后用来批量保存的 API。                                                                                        |
| [quickSaveItemApi](#quickSaveItemApi) | [API](../../docs/types/api)     |                                 | 快速编辑配置成及时保存时使用的 API。                                                                                  |
| bulkActions                           | Array<[Action](./action)>       |                                 | 批量操作列表，配置后，表格可进行选中操作。                                                                            |
| messages                              | `Object`                        |                                 | 覆盖消息提示，如果不指定，将采用 api 返回的 message                                                                   |
| messages.fetchFailed                  | `string`                        |                                 | 获取失败时提示                                                                                                        |
| messages.saveOrderFailed              | `string`                        |                                 | 保存顺序失败提示                                                                                                      |
| messages.saveOrderSuccess             | `string`                        |                                 | 保存顺序成功提示                                                                                                      |
| messages.quickSaveFailed              | `string`                        |                                 | 快速保存失败提示                                                                                                      |
| messages.quickSaveSuccess             | `string`                        |                                 | 快速保存成功提示                                                                                                      |
| primaryField                          | `string`                        | `"id"`                          | 设置 ID 字段名。                                                                                                      |
| perPage                               | `number`                        | 10                              | 设置一页显示多少条数据。                                                                                              |
| orderBy                               | `string`                        |                                 | 默认排序字段，这个是传给后端，需要后端接口实现                                                                        |
| orderDir                              | `asc` \| `desc`                 |                                 | 排序方向                                                                                                              |
| defaultParams                         | `Object`                        |                                 | 设置默认 filter 默认参数，会在查询的时候一起发给后端                                                                  |
| pageField                             | `string`                        | `"page"`                        | 设置分页页码字段名。                                                                                                  |
| perPageField                          | `string`                        | `"perPage"`                     | 设置分页一页显示的多少条数据的字段名。注意：最好与 defaultParams 一起使用，请看下面例子。                             |
| perPageAvailable                      | `Array<number>`                 | `[5, 10, 20, 50, 100]`          | 设置一页显示多少条数据下拉框可选条数。                                                                                |
| orderField                            | `string`                        |                                 | 设置用来确定位置的字段名，设置后新的顺序将被赋值到该字段中。                                                          |
| hideQuickSaveBtn                      | `boolean`                       | `false`                         | 隐藏顶部快速保存提示                                                                                                  |
| autoJumpToTopOnPagerChange            | `boolean`                       | `false`                         | 当切分页的时候，是否自动跳顶部。                                                                                      |
| syncResponse2Query                    | `boolean`                       | `true`                          | 将返回数据同步到过滤器上。                                                                                            |
| keepItemSelectionOnPageChange         | `boolean`                       | `true`                          | 保留条目选择，默认分页、搜素后，用户选择条目会被清空，开启此选项后会保留用户选择，可以实现跨页面批量操作。            |
| labelTpl                              | `string`                        |                                 | 单条描述模板，`keepItemSelectionOnPageChange`设置为`true`后会把所有已选择条目列出来，此选项可以用来定制条目展示文案。 |
| headerToolbar                         | Array                           | `['bulkActions', 'pagination']` | 顶部工具栏配置                                                                                                        |
| footerToolbar                         | Array                           | `['statistics', 'pagination']`  | 底部工具栏配置                                                                                                        |
| alwaysShowPagination                  | `boolean`                       | `false`                         | 是否总是显示分页                                                                                                      |
| affixHeader                           | `boolean`                       | `true`                          | 是否固定表头(table 下)                                                                                                |
| autoGenerateFilter                    | `boolean`                       | `false`                         | 是否开启查询区域，开启后会根据列元素的 `searchable` 属性值，自动生成查询条件表单                                      |
| resetPageAfterAjaxItemAction          | `boolean`                       | `false`                         | 单条数据 ajax 操作后是否重置页码为第一页                                                                              |
| autoFillHeight                        | `boolean` 丨 `{height: number}` |                                 | 内容区域自适应高度                                                                                                    |

注意除了上面这些属性，CRUD 在不同模式下的属性需要参考各自的文档，比如

- 默认[Table](./table)模式里的[列配置](./table#列配置属表)。
- [Cards](./cards) 模式。
- [List](./list) 模式。

### 列配置属性表

除了 Table 组件默认支持的列配置，CRUD 的列配置还额外支持以下属性：

| 属性名     | 类型                                                            | 默认值  | 说明                                                                        |
| ---------- | --------------------------------------------------------------- | ------- | --------------------------------------------------------------------------- |
| sortable   | `boolean`                                                       | `false` | 是否可排序                                                                  |
| searchable | `boolean` \| `Schema`                                           | `false` | 是否可快速搜索，开启`autoGenerateFilter`后，`searchable`支持配置`Schema`    |
| filterable | `boolean` \| [`QuickFilterConfig`](./crud.md#quickfilterconfig) | `false` | 是否可快速搜索，`options`属性为静态选项，支持设置`source`属性从接口获取选项 |
| quickEdit  | `boolean` \| [`QuickEditConfig`](./crud.md#quickeditconfig)     | -       | 快速编辑，一般需要配合`quickSaveApi`接口使用                                |

#### QuickFilterConfig

| 属性名     | 类型                          | 默认值  | 说明                                                     | 版本    |
| ---------- | ----------------------------- | ------- | -------------------------------------------------------- | ------- |
| options    | `Array<any>`                  | -       | 静态选项                                                 |         |
| multiple   | `boolean`                     | `false` | 是否支持多选                                             |         |
| source     | [`Api`](../../docs/types/api) | -       | 选项 API 接口                                            |         |
| strictMode | `string`                      | `false` | 严格模式，开启严格模式后，会采用 JavaScript 严格想等比较 | `2.3.0` |

#### QuickEditConfig

| 属性名             | 类型                      | 默认值      | 说明                                                                                                    | 版本 |
| ------------------ | ------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- | ---- |
| type               | `SchemaType`              | -           | 表单项组件类型                                                                                          |      |
| body               | `SchemaCollection`        | -           | 组件容器，支持多个表单项组件                                                                            |      |
| mode               | `'inline' \| 'popOver'`   | `'popOver'` | 编辑模式，inline 为行内编辑，popOver 为浮层编辑                                                         |      |
| saveImmediately    | `boolean` 或 `{api: Api}` | `false`     | 是否修改后即时保存，一般需要配合`quickSaveItemApi`接口使用，也可以直接配置[`Api`](../../docs/types/api) |      |
| quickEditEnabledOn | `SchemaExpression`        | -           | 开启快速编辑条件[表达式](../../docs/concepts/expression)                                                |      |

### columns-toggler 属性表

| 属性名          | 类型                           | 默认值    | 说明                                   |
| --------------- | ------------------------------ | --------- | -------------------------------------- |
| label           | `string`                       |           | 按钮文字                               |
| tooltip         | `string`                       |           | 按钮提示文字                           |
| disabledTip     | `string`                       |           | 按钮禁用状态下的提示                   |
| align           | `"left" \| "right"`            | `"left"`  | 点击内容是否关闭                       |
| size            | `"xs" \| "sm" \| "md" \| "lg"` |           | 按钮大小，参考[按钮](./action)         |
| footerBtnSize   | `"xs" \| "sm" \| "md" \| "lg"` |           | 弹窗底部按钮大小，参考[按钮](./action) |
| level           | `string`                       | `default` | 按钮样式，参考[按钮](./action)         |
| draggable       | `boolean`                      | `false`   | 是否可通过拖拽排序                     |
| defaultIsOpened | `boolean`                      | `false`   | 默认是否展开                           |
| hideExpandIcon  | `boolean`                      | `true`    | 是否隐藏展开的图标                     |
| overlay         | `boolean`                      | `false`   | 是否显示遮罩层                         |
| closeOnOutside  | `boolean`                      |           | 点击外部是否关闭                       |
| closeOnClick    | `boolean`                      |           | 点击内容是否关闭                       |
| iconOnly        | `boolean`                      | `false`   | 是否只显示图标。                       |
| icon            | `string`                       |           | 按钮的图标                             |
| className       | `string`                       |           | 外层 CSS 类名                          |
| btnClassName    | `string`                       |           | 按钮的 CSS 类名                        |
