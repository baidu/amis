---
title: TreeSelect 树形选择器
description:
type: 0
group: null
menuName: TreeSelect 树形选择器
icon:
order: 60
---

## 基本使用

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "searchable": true,
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        },
        {
          "label": "Folder E",
          "children": [
            {
              "label": "Folder G",
              "children": [
                {
                  "label": "file H",
                  "value": 6
                },
                {
                  "label": "file I",
                  "value": 7
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

## 仅展示选中节点文本信息

设置`hideNodePathLabel: true`，可以隐藏选择框中已选择节点的祖先节点（ancestor）的`labelField`字段值，仅展示当前选中节点的`labelField`字段值。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "tree-select",
      "name": "tree1",
      "label": "展示已选择节点的祖先节点的文本信息",
      "value": "1,6,7",
      "multiple": true,
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        },
        {
          "label": "Folder E",
          "children": [
            {
              "label": "Folder G",
              "children": [
                {
                  "label": "file H",
                  "value": 6
                },
                {
                  "label": "file I",
                  "value": 7
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "tree-select",
      "name": "tree2",
      "label": "仅展示已选择节点的文本信息",
      "value": "1,6,7",
      "multiple": true,
      "hideNodePathLabel": true,
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        },
        {
          "label": "Folder E",
          "children": [
            {
              "label": "Folder G",
              "children": [
                {
                  "label": "file H",
                  "value": 6
                },
                {
                  "label": "file I",
                  "value": 7
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

## 只允许选择叶子节点

> 1.8.0 及以上版本

在单选时，可通过 `onlyLeaf` 可以配置只允许选择叶子节点

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "onlyLeaf": true,
      "searchable": true,
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        },
        {
          "label": "Folder E",
          "value": "61",
          "children": [
            {
              "label": "Folder G",
              "value": "62",
              "children": [
                {
                  "label": "file H",
                  "value": 6
                },
                {
                  "label": "file I",
                  "value": 7
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

## 如何让某些节点无法点？

只需要对应的节点没有 value 就行，比如下面例子的目录节点都无法点，只能点文件节点

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "searchable": true,
      "options": [
        {
          "label": "Folder A",
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "Folder E",
          "children": [
            {
              "label": "Folder G",
              "children": [
                {
                  "label": "file H",
                  "value": 6
                },
                {
                  "label": "file I",
                  "value": 7
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

## 搜索选项

> `2.7.1` 及以上版本

配置`autoComplete`接口可以实现从远程数据搜索目标结果，搜索的关键字段为`term`，注意搜索的逻辑需要在服务端实现。

```schema: scope="body"
{
    "type":"form",
    "api":"/api/mock2/form/saveForm",
    "body":[
        {
            "type":"tree-select",
            "name":"tree",
            "label":"Tree",
            "autoComplete":"/api/mock2/tree/search?term=$term",
            "source":"/api/mock2/tree/search"
        }
    ]
}
```

## 自定义选项渲染

> `2.8.0` 及以上版本

使用`menuTpl`属性，自定义下拉选项的渲染内容。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "menuTpl": "<div class='flex justify-between'><span>${label}</span><span class='bg-gray-200 rounded p-1 text-xs text-center w-24'>${tag}</span></div>",
      "iconField": "icon",
      "searchable": true,
      "options": [
        {
          "label": "采购单",
          "value": "order",
          "tag": "数据模型",
          "icon": "fa fa-database",
          "children": [
            {
              "label": "ID",
              "value": "id",
              "tag": "数字",
              "icon": "fa fa-check",
            },
            {
              "label": "采购人",
              "value": "name",
              "tag": "字符串",
              "icon": "fa fa-check",
            },
            {
              "label": "采购时间",
              "value": "time",
              "tag": "日期时间",
              "icon": "fa fa-check",
            },
            {
              "label": "供应商",
              "value": "vendor",
              "tag": "数据模型(N:1)",
              "icon": "fa fa-database",
              "children": [
                {
                  "label": "供应商ID",
                  "value": "vendor_id",
                  "tag": "数字",
                  "icon": "fa fa-check",
                },
                {
                  "label": "供应商名称",
                  "value": "vendor_name",
                  "tag": "字符串",
                  "icon": "fa fa-check",
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

## 属性表

下列属性为`tree-select`独占属性, 更多属性用法，参考[InputTree 树形选择框](./input-tree)

| 属性名            | 类型      | 默认值  | 说明                                              | 版本 |
| ----------------- | --------- | ------- | ------------------------------------------------- | ---- |
| hideNodePathLabel | `boolean` | `false` | 是否隐藏选择框中已选择节点的路径 label 信息       |      |
| onlyLeaf          | `boolean` | `false` | 只允许选择叶子节点                                |      |
| searchable        | `boolean` | `false` | 是否可检索，仅在 type 为 `tree-select` 的时候生效 |      |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称                             | 事件参数                                                                                                                      | 说明                         |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| change                               | `[name]: string` 组件的值 <br/>`item: object`选中的节点（6.2.0 及以上版本）<br/>`items: object[]`选项集合（3.6.0 及以上版本） | 选中值变化时触发             |
| blur                                 | `[name]: string` 组件的值 <br/>``item: object`选中的节点（6.2.0 及以上版本）<br/>items: object[]`选项集合（3.6.4 及以上版本） | 输入框失去焦点时触发         |
| focus                                | `[name]: string` 组件的值 <br/>`item: object`选中的节点（6.2.0 及以上版本）<br/>`items: object[]`选项集合（3.6.4 及以上版本） | 输入框获取焦点时触发         |
| addConfirm (3.6.4 及以上版本)        | `[name]: string` 组件的值<br/>`item: object` 新增的节点信息<br/>`items: object[]`选项集合                                     | 新增节点提交时触发           |
| editConfirm (3.6.4 及以上版本)       | `[name]: object` 组件的值<br/>`item: object` 编辑的节点信息<br/>`items: object[]`选项集合                                     | 编辑节点提交时触发           |
| deleteConfirm (3.6.4 及以上版本)     | `[name]: string` 组件的值<br/>`item: object` 删除的节点信息<br/>`items: object[]`选项集合                                     | 删除节点提交时触发           |
| deferLoadFinished (3.6.4 及以上版本) | `[name]: object` 组件的值<br/>`result: object` deferApi 懒加载远程请求成功后返回的数据 <br/>`items: object[]`选项集合         | 懒加载接口远程请求成功时触发 |
| itemClick (6.9.0 以上版本)           | `item: Option` 所点击的选项                                                                                                   | 节点点击时触发               |
| staticItemClick (6.13.0 以上版本)    | `item: Option` 所点击的选项                                                                                                   | 静态展示时节点点击时触发     |
| add（不推荐）                        | `[name]: object` 新增的节点信息<br/>`items: object[]`选项集合（< 2.3.2 及以下版本 为`options`）                               | 新增节点提交时触发           |
| edit（不推荐）                       | `[name]: object` 编辑的节点信息<br/>`items: object[]`选项集合（< 2.3.2 及以下版本 为`options`）                               | 编辑节点提交时触发           |
| delete（不推荐）                     | `[name]: object` 删除的节点信息<br/>`items: object[]`选项集合（< 2.3.2 及以下版本 为`options`）                               | 删除节点提交时触发           |
| loadFinished（不推荐）               | `[name]: object` deferApi 懒加载远程请求成功后返回的数据                                                                      | 懒加载接口远程请求成功时触发 |

### change

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "onEvent": {
        "change": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msg": "${event.data.tree|json}"
              }
            }
          ]
        }
      },
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        }
      ]
    }
  ]
}
```

### focus

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "onEvent": {
        "focus": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msg": "${event.data.tree|json}"
              }
            }
          ]
        }
      },
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        }
      ]
    }
  ]
}
```

### blur

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "onEvent": {
        "blur": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msg": "${event.data.tree|json}"
              }
            }
          ]
        }
      },
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        }
      ]
    }
  ]
}
```

### addConfirm

配置 `creatable`后，可监听确认新增操作。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "creatable": true,
      "removable": true,
      "editable": true,
      "onEvent": {
        "addConfirm": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msg": "${event.data.item|json}"
              }
            }
          ]
        }
      },
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        }
      ]
    }
  ]
}
```

### editConfirm

配置 `editable`后，可监听确认编辑操作。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "creatable": true,
      "removable": true,
      "editable": true,
      "onEvent": {
        "editConfirm": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msg": "${event.data.item|json}"
              }
            }
          ]
        }
      },
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        }
      ]
    }
  ]
}
```

### deleteConfirm

配置 `removable`后，可监听确认删除操作。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "creatable": true,
      "removable": true,
      "editable": true,
      "onEvent": {
        "deleteConfirm": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msg": "${event.data.item|json}"
              }
            }
          ]
        }
      },
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        }
      ]
    }
  ]
}
```

### deferLoadFinished

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "deferApi": "/api/mock2/form/deferOptions?label=${label}&waitSeconds=2",
      "onEvent": {
        "deferLoadFinished": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msg": "${event.data.result|json}"
              }
            }
          ]
        }
      },
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "collapsed": true,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "这下面是懒加载的",
          "value": 4,
          "defer": true
        },
        {
          "label": "file D",
          "value": 5
        }
      ]
    }
  ]
}
```

### itemClick

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
      {
        "type": "input-tree",
        "name": "tree",
        "label": "Tree",
        "nodeBehavior": [],
        "onEvent": {
          "itemClick": {
            "actions": [
              {
                "actionType": "toast",
                "args": {
                  "msg": "${event.data.item|json}"
                }
              }
            ]
          }
        },
        "options": [
          {
            "label": "Folder A",
            "value": 1,
            "children": [
              {
                "label": "file A",
                "value": 2
              },
              {
                "label": "file B",
                "value": 3
              }
            ]
          },
          {
            "label": "file C",
            "value": 4
          },
          {
            "label": "file D",
            "value": 5
          }
        ]
      }
    ]
}
```

### staticItemClick

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
      {
        "type": "input-tree",
        "name": "tree",
        "label": "Tree",
        "nodeBehavior": [],
        "multiple": true,
        "value": "4,5",
        "inTag": true,
        "static": true,
        "onEvent": {
          "staticItemClick": {
            "actions": [
              {
                "actionType": "toast",
                "args": {
                  "msg": "${event.data.item|json}"
                }
              }
            ]
          }
        },
        "options": [
          {
            "label": "Folder A",
            "value": 1,
            "children": [
              {
                "label": "file A",
                "value": 2
              },
              {
                "label": "file B",
                "value": 3
              }
            ]
          },
          {
            "label": "file C",
            "value": 4
          },
          {
            "label": "file D",
            "value": 5
          }
        ]
      }
    ]
}
```

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                               | 说明                                                                                                       |
| -------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| add      | `item: Option, parentValue?: any`      | item 新增的数据项；parentValue 父级数据项的 value（如果配置了 valueField，以 valueField 的字段值为准）     |
| edit     | `item: Option, originValue: any`       | item 编辑后的数据项；originValue 编辑前数据项的 value（如果配置了 valueField，以 valueField 的字段值为准） |
| delete   | value: ` any`                          | 删除数据项的 value，（如果配置了 valueField，以 valueField 的字段值为准）                                  |
| reload   | -                                      | 刷新                                                                                                       |
| clear    | -                                      | 清空                                                                                                       |
| reset    | -                                      | 将值重置为初始值。6.3.0 及以下版本为`resetValue`                                                           |
| setValue | `value: string` \| `string[]` 更新的值 | 更新数据，开启`multiple`支持设置多项，开启`joinValues`时，多值用`,`分隔，否则多值用数组                    |

### clear

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
          "type": "tree-select",
        "name": "tree",
        "label": "Tree",
        "options": [
          {
            "label": "Folder A",
            "value": 1,
            "children": [
              {
                "label": "file A",
                "value": 2
              },
              {
                "label": "Folder B",
                "value": 3,
                "children": [
                  {
                    "label": "file b1",
                    "value": 3.1
                  },
                  {
                    "label": "file b2",
                    "value": 3.2
                  }
                ]
              }
            ]
          },
          {
            "label": "file C",
            "value": 4
          },
          {
            "label": "file D",
            "value": 5
          }
        ],
          "value": 5,
          "id": "clear_text"
        },
        {
            "type": "button",
            "label": "清空",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "clear",
                            "componentId": "clear_text"
                        }
                    ]
                }
            }
        }
    ]
}
```

### reset

如果配置了`resetValue`，则重置时使用`resetValue`的值，否则使用初始值。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
          "type": "tree-select",
        "name": "tree",
        "label": "Tree",
        "options": [
          {
            "label": "Folder A",
            "value": 1,
            "children": [
              {
                "label": "file A",
                "value": 2
              },
              {
                "label": "Folder B",
                "value": 3,
                "children": [
                  {
                    "label": "file b1",
                    "value": 3.1
                  },
                  {
                    "label": "file b2",
                    "value": 3.2
                  }
                ]
              }
            ]
          },
          {
            "label": "file C",
            "value": 4
          },
          {
            "label": "file D",
            "value": 5
          }
        ],
          "value": 5,
          "id": "reset_text"
        },
        {
            "type": "button",
            "label": "重置",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "reset",
                            "componentId": "reset_text"
                        }
                    ]
                }
            }
        }
    ]
}
```
