---
title: List 列表
description:
type: 0
group: ⚙ 组件
menuName: List
icon:
order: 56
---

列表展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像`Service`这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过`source`属性，获取数据链中的数据，完成数据展示。

## 基本用法

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=5",
  "body": [
    {
      "type": "list",
      "source": "$rows",
      "listItem": {
        "body": [
          {
            "type": "hbox",
            "columns": [
              {
                "label": "Engine",
                "name": "engine"
              },

              {
                "name": "version",
                "label": "Version"
              }
            ]
          }
        ],
        "actions": [
          {
            "type": "button",
            "level": "link",
            "label": "查看详情",
            "actionType": "dialog",
            "dialog": {
              "title": "查看详情",
              "body": {
                "type": "form",
                "body": [
                  {
                    "label": "Engine",
                    "name": "engine",
                    "type": "static"
                  },
                  {
                    "name": "version",
                    "label": "Version",
                    "type": "static"
                  }
                ]
              }
            }
          }
        ]
      }
    }
  ]
}
```

## 选择模式

设置`"selectable": true`, 列表开启多选模式

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=5",
  "body": [
    {
      "type": "list",
      "selectable": true,
      "source": "$rows",
      "listItem": {
        "body": [
          {
            "type": "hbox",
            "columns": [
              {
                "label": "Engine",
                "name": "engine"
              },

              {
                "name": "version",
                "label": "Version"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

列表默认支持多选，设置`"multiple": false`开启单选模式

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=5",
  "body": [
    {
      "type": "list",
      "selectable": true,
      "multiple": false,
      "source": "$rows",
      "listItem": {
        "body": [
          {
            "type": "hbox",
            "columns": [
              {
                "label": "Engine",
                "name": "engine"
              },

              {
                "name": "version",
                "label": "Version"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

或者你也可以使用 CRUD 的 [list 模式](./crud#list-%E5%88%97%E8%A1%A8%E6%A8%A1%E5%BC%8F)

## 单行点击操作

> 1.4.0 及以上版本

配置 itemAction 可以实现点击某一行后进行操作，支持 [action](./action) 里的所有配置，比如弹框、刷新其它组件等。

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=5",
  "body": [
    {
      "type": "list",
      "source": "$rows",
      "itemAction": {
        "type": "button",
        "actionType": "dialog",
        "dialog": {
          "title": "详情",
          "body": "当前行的数据 browser: ${browser}, version: ${version}"
        }
      },
      "listItem": {
        "body": [
          {
            "type": "hbox",
            "columns": [
              {
                "label": "Engine",
                "name": "engine"
              },

              {
                "name": "version",
                "label": "Version"
              }
            ]
          }
        ],
        "actions": [
          {
            "type": "button",
            "level": "link",
            "label": "查看详情",
            "actionType": "dialog",
            "dialog": {
              "title": "查看详情",
              "body": {
                "type": "form",
                "body": [
                  {
                    "label": "Engine",
                    "name": "engine",
                    "type": "static"
                  },
                  {
                    "name": "version",
                    "label": "Version",
                    "type": "static"
                  }
                ]
              }
            }
          }
        ]
      }
    }
  ]
}
```

## 设置组件的 CSS 类

`className`属性会添加到组件外层 DOM 节点上，如果要在组件当前层级添加 CSS 类，请设置`innerClassName`属性

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=5",
  "body": [
    {
      "type": "list",
      "source": "$rows",
      "listItem": {
        "body": {
          "type": "wrapper",
          "className": "border-4 border-solid border-primary",
          "innerClassName": "border-4 border-solid border-success",
          "body": [
            {
              "type": "tpl",
              "tpl": "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            }
          ]
        }
      }
    }
  ]
}
```

## 字母索引条

设置 `showIndexBar: true` 可以在列表右侧显示字母索引条，点击字母可以快速定位到以该字母开头的列表项。默认使用 `title` 字段作为索引依据，也可以通过 `indexField` 指定其他字段。

设置 `indexBarOffset` 可以设置字母索引条偏移量，用于设置点击索引条跳转时的滚动位置偏移。

```schema: scope="body"
{
  "type": "service",
  "data": {
    "rows": [
      {
        "id": 1,
        "name": "Alice Smith",
        "title": "软件工程师",
        "desc": "alice@example.com"
      },
      {
        "id": 2,
        "name": "Bob Johnson",
        "title": "产品经理",
        "desc": "bob@example.com"
      },
      {
        "id": 3,
        "name": "Charlie Brown",
        "title": "设计师",
        "desc": "charlie@example.com"
      },
      {
        "id": 4,
        "name": "David Wang",
        "title": "开发工程师",
        "desc": "david@example.com"
      },
      {
        "id": 5,
        "name": "Eve Johnson",
        "title": "产品经理",
        "desc": "eve@example.com"
      },
      {
        "id": 6,
        "name": "Frank Smith",
        "title": "设计师",
        "desc": "frank@example.com"
      },
      {
        "id": 7,
        "name": "Grace Brown",
        "title": "产品经理",
        "desc": "grace@example.com"
      },
      {
        "id": 8,
        "name": "Henry Davis",
        "title": "开发工程师",
        "desc": "henry@example.com"
      },
      {
        "id": 9,
        "name": "Ivy Evans",
        "title": "产品经理",
        "desc": "ivy@example.com"
      },
      {
        "id": 10,
        "name": "Jack White",
        "title": "设计师",
        "desc": "jack@example.com"
      },
      {
        "id": 11,
        "name": "Kate Green",
        "title": "产品经理",
        "desc": "kate@example.com"
      },
      {
        "id": 12,
        "name": "Leo Brown",
        "title": "开发工程师",
        "desc": "leo@example.com"
      },
      {
        "id": 13,
        "name": "Mia Davis",
        "title": "产品经理",
        "desc": "mia@example.com"
      },
      {
        "id": 14,
        "name": "Noah White",
        "title": "设计师",
        "desc": "noah@example.com"
      },
      {
        "id": 15,
        "name": "Olivia Green",
        "title": "产品经理",
        "desc": "olivia@example.com"
      },
      {
        "id": 16,
        "name": "Paul Brown",
        "title": "开发工程师",
        "desc": "paul@example.com"
      },
      {
        "id": 17,
        "name": "Quinn Davis",
        "title": "产品经理",
        "desc": "quinn@example.com"
      },
      {
        "id": 18,
        "name": "Ryan Evans",
        "title": "设计师",
        "desc": "ryan@example.com"
      },
      {
        "id": 19,
        "name": "Samuel White",
        "title": "开发工程师",
        "desc": "samuel@example.com"
      },
      {
        "id": 20,
        "name": "Thomas Green",
        "title": "产品经理",
        "desc": "thomas@example.com"
      },
      {
        "id": 21,
        "name": "Uma Davis",
        "title": "设计师",
        "desc": "uma@example.com"
      },
      {
        "id": 22,
        "name": "Vincent Brown",
        "title": "开发工程师",
        "desc": "vincent@example.com"
      },
      {
        "id": 23,
        "name": "Wendy Evans",
        "title": "产品经理",
        "desc": "wendy@example.com"
      },
      {
        "id": 24,
        "name": "Xavier Davis",
        "title": "设计师",
        "desc": "xavier@example.com"
      },
      {
        "id": 25,
        "name": "Yvonne White",
        "title": "开发工程师",
        "desc": "yvonne@example.com"
      },
      {
        "id": 26,
        "name": "Zachary Brown",
        "title": "产品经理",
        "desc": "zachary@example.com"
      }
    ]
  },
  "body": {
    "type": "list",
    "source": "$rows",
    "showIndexBar": true,
    "listItem": {
      "title": "${name}",
      "subTitle": "${title}",
      "desc": "${desc}"
    }
  }
}
```

## 属性表

| 属性名                   | 类型                                 | 默认值                | 说明                                                                         |
| ------------------------ | ------------------------------------ | --------------------- | ---------------------------------------------------------------------------- |
| type                     | `string`                             |                       | `"list"` 指定为列表展示。                                                    |
| title                    | `string`                             |                       | 标题                                                                         |
| source                   | `string`                             | `${items}`            | 数据源, 获取当前数据域变量，支持[数据映射](../../docs/concepts/data-mapping) |
| placeholder              | `string`                             | ‘暂无数据’            | 当没数据的时候的文字提示                                                     |
| selectable               | `boolean`                            | `false`               | 列表是否可选                                                                 |
| multiple                 | `boolean`                            | `true`                | 列表是否为多选                                                               |
| className                | `string`                             |                       | 外层 CSS 类名                                                                |
| headerClassName          | `string`                             | `amis-list-header`    | 顶部外层 CSS 类名                                                            |
| footerClassName          | `string`                             | `amis-list-footer`    | 底部外层 CSS 类名                                                            |
| listItem                 | `Array`                              |                       | 配置单条信息                                                                 |
| listItem.title           | [模板](../../docs/concepts/template) |                       | 标题                                                                         |
| listItem.titleClassName  | `string`                             | `h5`                  | 标题 CSS 类名                                                                |
| listItem.subTitle        | [模板](../../docs/concepts/template) |                       | 副标题                                                                       |
| listItem.avatar          | [模板](../../docs/concepts/template) |                       | 图片地址                                                                     |
| listItem.avatarClassName | `string`                             | `thumb-sm avatar m-r` | 图片 CSS 类名                                                                |
| listItem.desc            | [模板](../../docs/concepts/template) |                       | 描述                                                                         |
| listItem.body            | `ListBodyField[]`                    |                       | 内容容器，主要用来放置非表单项组件                                           |
| listItem.actions         | Array<[Action](./action)>            |                       | 按钮区域                                                                     |
| listItem.actionsPosition | 'left' or 'right'                    | 默认在右侧            | 按钮位置                                                                     |
| showIndexBar             | `boolean`                            | `false`               | 是否显示右侧字母索引条                                                       |
| indexField               | `string`                             | `'title'`             | 索引依据字段，默认使用 `title` 字段或列表项标题                              |
| indexBarOffset           | `number`                             | `0`                   | 索引条偏移量，用于设置点击索引条跳转时的滚动位置偏移                         |

### ListBodyField

```typescript
interface ListBodyField {
  /* 列标题 */
  label?: string;
  /* 外层DOM的CSS类名 */
  className?: string;
  /* label的CSS类名 */
  labelClassName?: string;
  /* 内层组件的CSS类名，className属性会添加到外层DOM，如果要在组件层级添加CSS类，请设置当前属性 */
  innerClassName?: string;
  /* 绑定字段名 */
  name?: string;
  /* 配置查看详情功能 */
  popOver?: SchemaPopOver;
  /* 配置快速编辑功能 */
  quickEdit?: SchemaQuickEdit;
  /* 配置点击复制功能 */
  copyable?: SchemaCopyable;
}
```

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称  | 事件参数      | 说明                                                                                                                         | 版本    |
| --------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------- |
| itemClick | `item: IItem` | 单行被点击时触发，`IItem`为点击行的信息。注意`itemAction`和`onEvent`是互斥的，List 组件中的`onEvent`会覆盖`itemAction`的行为 | `2.4.0` |

**IItem**

| 属性名 | 类型                  | 默认值 | 说明                |
| ------ | --------------------- | ------ | ------------------- |
| data   | `Record<string, any>` |        | 当前行所在数据域    |
| index  | `number`              |        | 行索引值，从 0 开始 |

### itemClick

```schema: scope="body"
{
  "type": "service",
  "api": "/api/mock2/sample?perPage=5",
  "body": [
    {
      "type": "list",
      "source": "$rows",
      "listItem": {
        "body": [
          {
            "type": "hbox",
            "columns": [
              {
                "label": "Engine",
                "name": "engine"
              },
              {
                "name": "version",
                "label": "Version"
              }
            ]
          }
        ]
      },
      "onEvent": {
        "itemClick": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msgType": "info",
                "msg": "${event.data.item.index} ${event.data.item.data.engine}"
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

> 6.4.0 或更高版本

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称        | 动作配置                                                                                                                                | 说明                 |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| select          | `args.index` 可选，指定行数，支持表达式 <br /> `args.condition` 可选，通过表达式指定更新哪些行，支持条件组合 index`                     | 设置列表的选中项     |
| selectAll       | -                                                                                                                                       | 设置列表全部项选中   |
| clearAll        | -                                                                                                                                       | 清空列表所有选中项   |
| initDrag        | -                                                                                                                                       | 开启列表拖拽排序功能 |
| cancelDrag      | -                                                                                                                                       | 放弃列表拖拽排序功能 |
| setValue        | `args.value`: object <br />`args.index` 可选，指定行数，支持表达式 <br /> `args.condition` 可选，通过表达式指定更新哪些行，支持条件组合 | 更新列表记录         |
| submitQuickEdit |                                                                                                                                         | 快速编辑数据提交     |

### select

- `args.index` 可选，指定行数，支持表达式
- `args.condition` 可选，通过表达式指定更新哪些行，支持条件组合

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
                "componentId": "list-select",
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
    "api": "/api/mock2/sample?perPage=5",
    "body": [
    {
      "id": "list-select",
      "type": "list",
      "source": "$rows",
      "selectable": true,
      "multiple": true,
      "listItem": {
        "body": [
          {
            "type": "hbox",
            "columns": [
              {
                "label": "Engine",
                "name": "engine"
              },

              {
                "name": "version",
                "label": "Version"
              }
            ]
          }
        ]
      }
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
        "label": "设置列表全部项选中",
        "onEvent": {
        "click": {
            "actions": [
            {
                "actionType": "selectAll",
                "componentId": "list-select",
                "description": "点击设置指定列表全部内容选中"
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
        "id": "list-select",
        "type": "list",
        "source": "$rows",
        "selectable": true,
        "multiple": true,
        "listItem": {
        "body": [
          {
            "type": "hbox",
            "columns": [
              {
                "label": "Engine",
                "name": "engine"
              },

              {
                "name": "version",
                "label": "Version"
              }
            ]
          }
        ]
      }
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
        "label": "清空列表全部选中项",
        "onEvent": {
        "click": {
            "actions": [
            {
                "actionType": "clearAll",
                "componentId": "list-select",
                "description": "点击设置指定列表全部选中项清空"
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
        "id": "list-select",
        "type": "list",
        "source": "$rows",
        "selectable": true,
        "multiple": true,
        "listItem": {
        "body": [
          {
            "type": "hbox",
            "columns": [
              {
                "label": "Engine",
                "name": "engine"
              },

              {
                "name": "version",
                "label": "Version"
              }
            ]
          }
        ]
      }
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
        "label": "开启列表行排序",
        "onEvent": {
        "click": {
            "actions": [
            {
                "actionType": "initDrag",
                "componentId": "list-select",
                "description": "点击开启列表行排序功能"
            }
            ]
        }
        }
    },
    {
        "name": "trigger5",
        "id": "trigger5",
        "type": "action",
        "label": "取消列表行排序",
        "onEvent": {
        "click": {
            "actions": [
            {
                "actionType": "cancelDrag",
                "componentId": "list-select",
                "description": "点击取消列表行排序功能"
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
        "id": "list-select",
        "type": "list",
        "source": "$rows",
        "listItem": {
        "body": [
          {
            "type": "hbox",
            "columns": [
              {
                "label": "Engine",
                "name": "engine"
              },

              {
                "name": "version",
                "label": "Version"
              }
            ]
          }
        ]
      }
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
              "componentId": "list_setvalue",
              "args": {
                "value": {
                  "rows": [
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
              "componentId": "list_setvalue",
              "args": {
                "value": {
                  "rows": []
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
          "type": "list",
          "id": "list_setvalue",
          "title": "引擎列表",
          "source": "$rows",
          "listItem": {
            "body": [
              {
                "type": "hbox",
                "columns": [
                  {
                    "label": "Engine",
                    "name": "engine"
                  },

                  {
                    "name": "version",
                    "label": "Version"
                  }
                ]
              }
            ]
          }
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
                "componentId": "list_setvalue_item",
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
                "componentId": "list_setvalue_item",
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
                "componentId": "list_setvalue_item",
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
                "componentId": "list_setvalue_item",
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
          "type": "list",
          "id": "list_setvalue_item",
          "title": "引擎列表",
          "source": "$rows",
          "listItem": {
            "body": [
              {
                "type": "hbox",
                "columns": [
                  {
                    "label": "Engine",
                    "name": "engine"
                  },

                  {
                    "name": "version",
                    "label": "Version"
                  }
                ]
              }
            ]
          }
        }
      ]
    }
    ]
}
```
