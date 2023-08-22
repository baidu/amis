---
title: Transfer 穿梭器
description:
type: 0
group: null
menuName: Transfer 穿梭器
icon:
---

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "默认",
      "type": "transfer",
      "name": "transfer",
      "value": "zhugeliang,libai",
      "options": [
        {
          "label": "诸葛亮",
          "value": "zhugeliang"
        },
        {
          "label": "曹操",
          "value": "caocao"
        },
        {
          "label": "钟无艳",
          "value": "zhongwuyan"
        },
        {
          "label": "李白",
          "value": "libai"
        },
        {
          "label": "韩信",
          "value": "hanxin"
        },
        {
          "label": "云中君",
          "value": "yunzhongjun"
        }
      ]
    }
  ]
}
```

## 展示模式

### 分组

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "分组",
      "type": "transfer",
      "name": "transfer",
      "options": [
        {
          "label": "法师",
          "children": [
            {
              "label": "诸葛亮",
              "value": "zhugeliang"
            }
          ]
        },
        {
          "label": "战士",
          "children": [
            {
              "label": "曹操",
              "value": "caocao"
            },
            {
              "label": "钟无艳",
              "value": "zhongwuyan"
            }
          ]
        },
        {
          "label": "打野",
          "children": [
            {
              "label": "李白",
              "value": "libai"
            },
            {
              "label": "韩信",
              "value": "hanxin"
            },
            {
              "label": "云中君",
              "value": "yunzhongjun"
            }
          ]
        }
      ]
    }
  ]
}
```

### 表格模式

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "表格形式",
      "type": "transfer",
      "name": "transfer",
      "selectMode": "table",
      "columns": [
        {
          "name": "label",
          "label": "英雄"
        },
        {
          "name": "position",
          "label": "位置"
        }
      ],
      "options": [
        {
          "label": "诸葛亮",
          "value": "zhugeliang",
          "position": "中单"
        },
        {
          "label": "曹操",
          "value": "caocao",
          "position": "上单"
        },
        {
          "label": "钟无艳",
          "value": "zhongwuyan",
          "position": "上单"
        },
        {
          "label": "李白",
          "value": "libai",
          "position": "打野"
        },
        {
          "label": "韩信",
          "value": "hanxin",
          "position": "打野"
        },
        {
          "label": "云中君",
          "value": "yunzhongjun",
          "position": "打野"
        }
      ]
    }
  ]
}
```

### 树形模式

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "树型展示",
      "type": "transfer",
      "name": "transfer4",
      "selectMode": "tree",
      "searchable": true,
      "options": [
        {
          "label": "法师",
          "children": [
            {
              "label": "诸葛亮",
              "value": "zhugeliang"
            }
          ]
        },
        {
          "label": "战士",
          "children": [
            {
              "label": "曹操",
              "value": "caocao"
            },
            {
              "label": "钟无艳",
              "value": "zhongwuyan"
            }
          ]
        },
        {
          "label": "打野",
          "children": [
            {
              "label": "李白",
              "value": "libai"
            },
            {
              "label": "韩信",
              "value": "hanxin"
            },
            {
              "label": "云中君",
              "value": "yunzhongjun"
            }
          ]
        }
      ]
    }
  ]
}
```

### 级联选择

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "级联选择",
      "type": "transfer",
      "name": "transfer5",
      "selectMode": "chained",
      "options": [
        {
          "label": "法师",
          "children": [
            {
              "label": "诸葛亮",
              "value": "zhugeliang"
            }
          ]
        },
        {
          "label": "战士",
          "children": [
            {
              "label": "曹操",
              "value": "caocao"
            },
            {
              "label": "钟无艳",
              "value": "zhongwuyan"
            }
          ]
        },
        {
          "label": "打野",
          "children": [
            {
              "label": "李白",
              "value": "libai"
            },
            {
              "label": "韩信",
              "value": "hanxin"
            },
            {
              "label": "云中君",
              "value": "yunzhongjun"
            }
          ]
        }
      ]
    }
  ]
}
```

### 关联选择模式

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "关联选择模式",
      "type": "transfer",
      "name": "b",
      "sortable": true,
      "searchable": true,
      "deferApi": "/api/mock2/form/deferOptions?label=${label}",
      "selectMode": "associated",
      "leftMode": "tree",
      "leftOptions": [
        {
          "label": "法师",
          "children": [
            {
              "label": "诸葛亮",
              "value": "zhugeliang"
            }
          ]
        },
        {
          "label": "战士",
          "children": [
            {
              "label": "曹操",
              "value": "caocao"
            },
            {
              "label": "钟无艳",
              "value": "zhongwuyan"
            }
          ]
        },
        {
          "label": "打野",
          "children": [
            {
              "label": "李白",
              "value": "libai"
            },
            {
              "label": "韩信",
              "value": "hanxin"
            },
            {
              "label": "云中君",
              "value": "yunzhongjun"
            }
          ]
        }
      ],
      "options": [
        {
          "ref": "zhugeliang",
          "children": [
            {
              "label": "A",
              "value": "a"
            }
          ]
        },
        {
          "ref": "caocao",
          "children": [
            {
              "label": "B",
              "value": "b"
            },

            {
              "label": "C",
              "value": "c"
            }
          ]
        },
        {
          "ref": "zhongwuyan",
          "children": [
            {
              "label": "D",
              "value": "d"
            },

            {
              "label": "E",
              "value": "e"
            }
          ]
        },
        {
          "ref": "libai",
          "defer": true,
          "label": "lazy-option-libai"
        },
        {
          "ref": "hanxin",
          "defer": true,
          "label": "lazy-option-hanxin"
        },
        {
          "ref": "yunzhongjun",
          "defer": true,
          "label": "lazy-option-yunzhongjun"
        }
      ]
    }
  ]
}
```

`leftOptions` 动态加载，默认 `source` 接口是返回 options 部分，而 `leftOptions` 是没有对应的接口可以动态返回了。为了方便，目前如果 `source` 接口返回的选中中，第一个 option 是以下这种格式则也会把 options[0].leftOptions 当成 `leftOptions`, options[0].children 当 options。同时 options[0].leftDefaultValue 可以用来配置左侧选项的默认值。

```
{
    status: 0,
    msg: '',
    data: {
        options: [
            {
                leftOptions: [],
                children: [],
                leftDefaultValue: ''
            }
        ]
    }
}
```

### 延时加载

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "延时加载",
      "type": "transfer",
      "name": "transfer7",
      "selectMode": "tree",
      "deferApi": "/api/mock2/form/deferOptions?label=${label}&waitSeconds=2",
      "options": [
        {
          "label": "法师",
          "children": [
            {
              "label": "诸葛亮",
              "value": "zhugeliang"
            }
          ]
        },
        {
          "label": "战士",
          "defer": true
        },
        {
          "label": "打野",
          "children": [
            {
              "label": "李白",
              "value": "libai"
            },
            {
              "label": "韩信",
              "value": "hanxin"
            },
            {
              "label": "云中君",
              "value": "yunzhongjun"
            }
          ]
        }
      ]
    }
  ]
}
```

### 支持搜索

#### 左侧搜索功能

通过 `searchable` 字段来控制左侧选项栏的搜索功能。

在不设置 `searchApi` 情况下，对输入框内容和对应列表项的 value、label 进行匹配，匹配成功就会左侧面板中显示。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "带搜索",
      "type": "transfer",
      "name": "transfer6",
      "selectMode": "chained",
      "searchable": true,
      "sortable": true,
      "options": [
        {
          "label": "法师",
          "children": [
            {
              "label": "诸葛亮",
              "value": "zhugeliang"
            }
          ]
        },
        {
          "label": "战士",
          "children": [
            {
              "label": "曹操",
              "value": "caocao"
            },
            {
              "label": "钟无艳",
              "value": "zhongwuyan"
            }
          ]
        },
        {
          "label": "打野",
          "children": [
            {
              "label": "李白",
              "value": "libai"
            },
            {
              "label": "韩信",
              "value": "hanxin"
            },
            {
              "label": "云中君",
              "value": "yunzhongjun"
            }
          ]
        }
      ]
    }
  ]
}
```

#### 右侧结果搜索功能

右侧结果搜索是通过`resultSearchable`字段开启，设置该字段为 true 时开启。

开启结果搜索后，目前默认通过 value、label 对输入内容进行模糊匹配。

目前树的延时加载不支持结果搜索功能。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
      {
        "label": "树型展示",
        "type": "transfer",
        "name": "transfer4",
        "selectMode": "tree",
        "searchable": true,
        "resultListModeFollowSelect": true,
        "resultSearchable": true,
        "options": [
          {
            "label": "法师",
            "children": [
              {
                "label": "诸葛亮",
                "value": "zhugeliang"
              }
            ]
          },
          {
            "label": "战士",
            "children": [
              {
                "label": "曹操",
                "value": "caocao"
              },
              {
                "label": "钟无艳",
                "value": "zhongwuyan"
              }
            ]
          },
          {
            "label": "打野",
            "children": [
              {
                "label": "李白",
                "value": "libai"
              },
              {
                "label": "韩信",
                "value": "hanxin"
              },
              {
                "label": "云中君",
                "value": "yunzhongjun"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

#### searchApi

设置这个 api，可以实现左侧选项搜索结果的检索。

默认 GET，携带 term 变量，值为搜索框输入的文字，可从上下文中取数据设置进去。


```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
      {
        "label": "searchApi",
        "type": "transfer",
        "name": "transfer",
        "searchable": true,
        "selectMode": "tree",
        "searchApi": "/api/transfer/search?name=${term}",
        "options": [
          {
            "label": "法师",
            "children": [
              {
                "label": "诸葛亮",
                "value": "zhugeliang"
              }
            ]
          },
          {
            "label": "战士",
            "value": "zhanshi",
            "children": [
              {
                "label": "曹操",
                "value": "caocao"
              },
              {
                "label": "钟无艳",
                "value": "zhongwuyan"
              }
            ]
          },
          {
            "label": "打野",
            "children": [
              {
                "label": "李白",
                "value": "libai"
              },
              {
                "label": "韩信",
                "value": "hanxin"
              },
              {
                "label": "云中君",
                "value": "yunzhongjun"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

##### 响应

格式要求如下：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "options": [
      {
        "label": "描述",
        "value": "值"
        // "children": [] // 可以嵌套
      },

      {
        "label": "描述2",
        "value": "值2"
      }
    ],
  }
}
```

适用于需选择的数据/信息源较多时，用户可直观的知道自己所选择的数据/信息的场景，一般左侧框为数据/信息源，右侧为已选数据/信息，被选中信息同时存在于 2 个框内。


### 结果面板跟随模式

`resultListModeFollowSelect` 开启结果面板跟随模式。

#### 表格跟随模式

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "表格形式",
      "type": "transfer",
      "name": "transfer",
      "selectMode": "table",
      "resultListModeFollowSelect": true,
      "columns": [
        {
          "name": "label",
          "label": "英雄"
        },
        {
          "name": "position",
          "label": "位置"
        }
      ],
      "options": [
        {
          "label": "诸葛亮",
          "value": "zhugeliang",
          "position": "中单"
        },
        {
          "label": "曹操",
          "value": "caocao",
          "position": "上单"
        },
        {
          "label": "钟无艳",
          "value": "zhongwuyan",
          "position": "上单"
        },
        {
          "label": "李白",
          "value": "libai",
          "position": "打野"
        },
        {
          "label": "韩信",
          "value": "hanxin",
          "position": "打野"
        },
        {
          "label": "云中君",
          "value": "yunzhongjun",
          "position": "打野"
        }
      ]
    }
  ]
}
```

#### 树形跟随模式

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
      {
        "label": "树型展示",
        "type": "transfer",
        "name": "transfer4",
        "selectMode": "tree",
        "searchable": true,
        "resultListModeFollowSelect": true,
        "options": [
          {
            "label": "法师",
            "children": [
              {
                "label": "诸葛亮",
                "value": "zhugeliang"
              }
            ]
          },
          {
            "label": "战士",
            "children": [
              {
                "label": "曹操",
                "value": "caocao"
              },
              {
                "label": "钟无艳",
                "value": "zhongwuyan"
              }
            ]
          },
          {
            "label": "打野",
            "children": [
              {
                "label": "李白",
                "value": "libai"
              },
              {
                "label": "韩信",
                "value": "hanxin"
              },
              {
                "label": "云中君",
                "value": "yunzhongjun"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### 自定义选项展示

```schema: scope="body"
{
    "type": "form",
    "body": [
      {
        "label": "默认",
        "type": "transfer",
        "name": "transfer",
        "menuTpl": "<div class='flex justify-between'><span>${label}</span><span class='text-muted m-r text-sm'>${tag}</span></div>",
        "valueTpl": "${label}(${value})",
        "options": [
          {
            "label": "诸葛亮",
            "value": "zhugeliang",
            "tag": "法师",
          },
          {
            "label": "曹操",
            "value": "caocao",
            "tag": "战士",
          },
          {
            "label": "钟无艳",
            "value": "zhongwuyan",
            "tag": "战士",
          },
          {
            "label": "李白",
            "value": "libai",
            "tag": "打野"
          },
          {
            "label": "韩信",
            "value": "hanxin",
            "tag": "打野"
          },
          {
            "label": "云中君",
            "value": "yunzhongjun",
            "tag": "打野"
          }
        ]
      }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名                     | 类型                                                  | 默认值       | 说明                                                                                                                                                                                                        |
| -------------------------- | ----------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| options                    | `Array<object>`或`Array<string>`                      |              | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                                                                                                                                   |
| source                     | `string`或 [API](../../../docs/types/api)             |              | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                                                                                                                                |
| delimeter                  | `string`                                              | `false`      | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                                                                                                                                   |
| joinValues                 | `boolean`                                             | `true`       | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                                                                                                                                  |
| extractValue               | `boolean`                                             | `false`      | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)                                                                                                                              |
| searchApi                  | [API](../../../docs/types/api)                        |              | 如果想通过接口检索，可以设置这个 api。                                                                                                                                                                      |
| resultListModeFollowSelect | `boolean`                                             | `false`      | 结果面板跟随模式，目前只支持`list`、`table`、`tree`（tree 目前只支持非延时加载的`tree`）                                                                                                                    |
| statistics                 | `boolean`                                             | `true`       | 是否显示统计数据                                                                                                                                                                                            |
| selectTitle                | `string`                                              | `"请选择"`   | 左侧的标题文字                                                                                                                                                                                              |
| resultTitle                | `string`                                              | `"当前选择"` | 右侧结果的标题文字                                                                                                                                                                                          |
| sortable                   | `boolean`                                             | `false`      | 结果可以进行拖拽排序（结果列表为树时，不支持排序）                                                                                                                                                          |
| selectMode                 | `string`                                              | `list`       | 可选：`list`、`table`、`tree`、`chained`、`associated`。分别为：列表形式、表格形式、树形选择形式、级联选择形式，关联选择形式（与级联选择的区别在于，级联是无限极，而关联只有一级，关联左边可以是个 tree）。 |
| searchResultMode           | `string`                                              |              | 如果不设置将采用 `selectMode` 的值，可以单独配置，参考 `selectMode`，决定搜索结果的展示形式。                                                                                                               |
| searchable                 | `boolean`                                             | `false`      | 左侧列表搜索功能，当设置为  true  时表示可以通过输入部分内容检索出选项项。                                                                                                                                  |
| searchPlaceholder          | `string`                                              |              | 左侧列表搜索框提示                                                                                                                                                                                          |
| columns                    | `Array<Object>`                                       |              | 当展示形式为 `table` 可以用来配置展示哪些列，跟 table 中的 columns 配置相似，只是只有展示功能。                                                                                                             |
| leftOptions                | `Array<Object>`                                       |              | 当展示形式为 `associated` 时用来配置左边的选项集。                                                                                                                                                          |
| leftMode                   | `string`                                              |              | 当展示形式为 `associated` 时用来配置左边的选择形式，支持 `list` 或者 `tree`。默认为 `list`。                                                                                                                |
| rightMode                  | `string`                                              |              | 当展示形式为 `associated` 时用来配置右边的选择形式，可选：`list`、`table`、`tree`、`chained`。                                                                                                              |
| resultSearchable           | `boolean`                                             | `false`      | 结果（右则）列表的检索功能，当设置为 true 时，可以通过输入检索模糊匹配检索内容（目前树的延时加载不支持结果搜索功能）                                                                                        |
| resultSearchPlaceholder    | `string`                                              |              | 右侧列表搜索框提示                                                                                                                                                                                          |
| menuTpl                    | `string` \| [SchemaNode](../../docs/types/schemanode) |              | 用来自定义选项展示                                                                                                                                                                                          |
| valueTpl                   | `string` \| [SchemaNode](../../docs/types/schemanode) |              | 用来自定义值的展示                                                                                                                                                                                          |
| itemHeight                 | `number`                                              | `32`         | 每个选项的高度，用于虚拟渲染                                                                                                                                                                                |
| virtualThreshold           | `number`                                              | `100`        | 在选项数量超过多少时开启虚拟渲染                                                                                                                                                                            |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称  | 事件参数                                                                                  | 说明             |
| --------- | ----------------------------------------------------------------------------------------- | ---------------- |
| change    | `[name]: string` 组件的值<br/>`items: object[]`选项集合（< 2.3.2 及以下版本 为`options`） | 选中值变化时触发 |
| selectAll | `items: object[]`选项集合（< 2.3.2 及以下版本 为`options`）                               | 全选时触发       |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称  | 动作配置                               | 说明                                                                                    |
| --------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| clear     | -                                      | 清空                                                                                    |
| reset     | -                                      | 将值重置为`resetValue`，若没有配置`resetValue`，则清空                                  |
| clearSearch | `left: boolean` 左侧搜索、`right:boolean`右侧搜索                                     | 默认清除所有搜索态，可以单独配置`left`、`right`为`true`来清空对应左侧或者右侧面板(`3.4.0`及以上版本支持）                                                    |
| selectAll | -                                      | 全选                                                                                    |
| setValue  | `value: string` \| `string[]` 更新的值 | 更新数据，开启`multiple`支持设置多项，开启`joinValues`时，多值用`,`分隔，否则多值用数组 |
