---
title: Cards 卡片组
description:
type: 0
group: ⚙ 组件
menuName: Cards 卡片组
icon:
order: 32
---

卡片展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像`Service`这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过`source`属性，获取数据链中的数据，完成数据展示。

## 基本用法

这里我们使用手动初始数据域的方式，即配置`data`属性，进行数据域的初始化。

```schema
{
  "type": "page",
  "data": {
    "items": [
      {
        "engine": "Trident",
        "browser": "Internet Explorer 4.0",
        "platform": "Win 95+",
        "version": "4",
        "grade": "X"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 5.0",
        "platform": "Win 95+",
        "version": "5",
        "grade": "C"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 5.5",
        "platform": "Win 95+",
        "version": "5.5",
        "grade": "A"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 6",
        "platform": "Win 98+",
        "version": "6",
        "grade": "A"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 7",
        "platform": "Win XP SP2+",
        "version": "7",
        "grade": "A"
      }
    ]
  },
  "body": {
    "type": "cards",
    "source": "$items",
    "card": {
      "body": [
        {
          "label": "Engine",
          "name": "engine"
        },
        {
          "label": "Browser",
          "name": "browser"
        },
        {
          "name": "version",
          "label": "Version"
        }
      ],
      "actions": [
        {
          "type": "button",
          "level": "link",
          "icon": "fa fa-eye",
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
                  "name": "browser",
                  "label": "Browser",
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
}
```

或者你也可以使用 CRUD 的 [card 模式](./crud#cards-%E5%8D%A1%E7%89%87%E6%A8%A1%E5%BC%8F)

<!-- ## 选择模式

设置`"selectable": true`, 卡片组开启多选模式

```schema
{
  "type": "page",
  "data": {
    "items": [
      {
        "engine": "Trident",
        "browser": "Internet Explorer 4.0",
        "platform": "Win 95+",
        "version": "4",
        "grade": "X"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 5.0",
        "platform": "Win 95+",
        "version": "5",
        "grade": "C"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 5.5",
        "platform": "Win 95+",
        "version": "5.5",
        "grade": "A"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 6",
        "platform": "Win 98+",
        "version": "6",
        "grade": "A"
      }
    ]
  },
  "body": {
    "type": "cards",
    "selectable": true,
    "source": "$items",
    "card": {
      "body": [
        {
          "label": "Engine",
          "name": "engine"
        },
        {
          "label": "Browser",
          "name": "browser"
        },
        {
          "name": "version",
          "label": "Version"
        }
      ],
      "actions": [
        {
          "type": "button",
          "level": "link",
          "icon": "fa fa-eye",
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
                  "name": "browser",
                  "label": "Browser",
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
}
```

卡片组默认支持多选，设置`"multiple": false`开启单选模式

```schema
{
  "type": "page",
  "data": {
    "items": [
      {
        "engine": "Trident",
        "browser": "Internet Explorer 4.0",
        "platform": "Win 95+",
        "version": "4",
        "grade": "X"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 5.0",
        "platform": "Win 95+",
        "version": "5",
        "grade": "C"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 5.5",
        "platform": "Win 95+",
        "version": "5.5",
        "grade": "A"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 6",
        "platform": "Win 98+",
        "version": "6",
        "grade": "A"
      }
    ]
  },
  "body": {
    "type": "cards",
    "selectable": true,
    "multiple": false,
    "source": "$items",
    "card": {
      "body": [
        {
          "label": "Engine",
          "name": "engine"
        },
        {
          "label": "Browser",
          "name": "browser"
        },
        {
          "name": "version",
          "label": "Version"
        }
      ],
      "actions": [
        {
          "type": "button",
          "level": "link",
          "icon": "fa fa-eye",
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
                  "name": "browser",
                  "label": "Browser",
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
}
``` -->

## 当 cards 在 crud 中且配置了批量操作按钮时可点选

如果配置了 `checkOnItemClick`，当用户点击卡片时就能选中这个卡片，而不是只能点击勾选框才能选中

```schema
{
  "type": "page",
  "data": {
    "items": [
      {
        "engine": "Trident",
        "browser": "Internet Explorer 4.0",
        "platform": "Win 95+",
        "version": "4",
        "grade": "X"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 5.0",
        "platform": "Win 95+",
        "version": "5",
        "grade": "C"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 5.5",
        "platform": "Win 95+",
        "version": "5.5",
        "grade": "A"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 6",
        "platform": "Win 98+",
        "version": "6",
        "grade": "A"
      }
    ]
  },
  "body": {
    "type": "crud",
    "mode": "cards",
    "checkOnItemClick": true,
    "source": "$items",
    "bulkActions": [
      {
        "type": "button",
        "label": "查看选中",
        "actionType": "dialog",
        "dialog": {
          "body": "${items|json}"
        }
      }
    ],
    "card": {
      "body": [
        {
          "label": "Engine",
          "name": "engine"
        },
        {
          "label": "Browser",
          "name": "browser"
        },
        {
          "name": "version",
          "label": "Version"
        }
      ],
      "actions": [
        {
          "type": "button",
          "level": "link",
          "icon": "fa fa-eye",
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
                  "name": "browser",
                  "label": "Browser",
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
}
```

## 属性表

| 属性名           | 类型                                         | 默认值              | 说明                           |
| ---------------- | -------------------------------------------- | ------------------- | ------------------------------ |
| type             | `string`                                     |                     | `"cards"` 指定为卡片组。       |
| title            | [模板](../../docs/concepts/template)         |                     | 标题                           |
| source           | [数据映射](../../docs/concepts/data-mapping) | `${items}`          | 数据源, 获取当前数据域中的变量 |
| placeholder      | [模板](../../docs/concepts/template)         | ‘暂无数据’          | 当没数据的时候的文字提示       |
| className        | `string`                                     |                     | 外层 CSS 类名                  |
| headerClassName  | `string`                                     | `amis-grid-header`  | 顶部外层 CSS 类名              |
| footerClassName  | `string`                                     | `amis-grid-footer`  | 底部外层 CSS 类名              |
| itemClassName    | `string`                                     | `col-sm-4 col-md-3` | 卡片 CSS 类名                  |
| card             | [Card](./card)                               |                     | 配置卡片信息                   |
| selectable       | `boolean`                                    | `false`             | 卡片组是否可选                 |
| multiple         | `boolean`                                    | `true`              | 卡片组是否为多选               |
| checkOnItemClick | `boolean`                                    |                     | 点选卡片内容是否选中卡片       |

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
                "componentId": "cards-select",
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
      "id": "cards-select",
      "type": "cards",
      "source": "$rows",
      "selectable": true,
      "multiple": true,
      "card": {
        "body": [
          {
            "label": "Engine",
            "name": "engine"
          },
          {
            "label": "Browser",
            "name": "browser"
          },
          {
            "name": "version",
            "label": "Version"
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
                "componentId": "cards-select",
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
        "id": "cards-select",
        "type": "cards",
        "source": "$rows",
        "selectable": true,
        "multiple": true,
        "card": {
          "body": [
            {
              "label": "Engine",
              "name": "engine"
            },
            {
              "label": "Browser",
              "name": "browser"
            },
            {
              "name": "version",
              "label": "Version"
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
                "componentId": "cards-select",
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
        "id": "cards-select",
        "type": "cards",
        "source": "$rows",
        "selectable": true,
        "multiple": true,
        "card": {
          "body": [
            {
              "label": "Engine",
              "name": "engine"
            },
            {
              "label": "Browser",
              "name": "browser"
            },
            {
              "name": "version",
              "label": "Version"
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
                "componentId": "cards-select",
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
                "componentId": "cards-select",
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
        "id": "cards-select",
        "type": "cards",
        "source": "$rows",
        "card": {
          "body": [
            {
              "label": "Engine",
              "name": "engine"
            },
            {
              "label": "Browser",
              "name": "browser"
            },
            {
              "name": "version",
              "label": "Version"
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
              "componentId": "cards_setvalue",
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
              "componentId": "cards_setvalue",
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
          "type": "cards",
          "id": "cards_setvalue",
          "title": "引擎列表",
          "source": "$rows",
          "card": {
          "body": [
            {
              "label": "Engine",
              "name": "engine"
            },
            {
              "label": "Browser",
              "name": "browser"
            },
            {
              "name": "version",
              "label": "Version"
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
                "componentId": "cards_setvalue_item",
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
                "componentId": "cards_setvalue_item",
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
                "componentId": "cards_setvalue_item",
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
                "componentId": "cards_setvalue_item",
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
          "type": "cards",
          "id": "cards_setvalue_item",
          "title": "引擎列表",
          "source": "$rows",
          "card": {
          "body": [
            {
              "label": "Engine",
              "name": "engine"
            },
            {
              "label": "Browser",
              "name": "browser"
            },
            {
              "name": "version",
              "label": "Version"
            }
          ]
        }
        }
      ]
    }
    ]
}
```
