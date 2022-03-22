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
          "defer": true
        },
        {
          "ref": "hanxin",
          "defer": true
        },
        {
          "ref": "yunzhongjun",
          "defer": true
        }
      ]
    }
  ]
}
```

leftOptions 动态加载，默认 source 接口是返回 options 部分，而 leftOptions 是没有对应的接口可以动态返回了。为了方便，目前如果 source 接口返回的选中中，第一个 option 是以下这种格式则也会把 options[0].leftOptions 当成 leftOptions, options[0].children 当 options。同时 options[0].leftDefaultValue 可以用来配置左侧选项的默认值。

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
通过searchable字段来控制左侧选项栏的搜索功能。

在不设置searchApi情况下，对输入框内容和对应列表项的value、label进行匹配，匹配成功就会左侧面板中显示。 

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

右侧结果搜索是通过resultSearchable字段开启，设置该字段为true时开启。

开启结果搜索后，目前默认通过value、label对输入内容进行模糊匹配。

如需要自定义搜索方式，可以通过设置resultSearchFilter字段来实现。

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
        "isFollowMode": true,
        "resultSearchable": true,
        "resultSearchFilter": "return item.value.indexOf(text) > -1",
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

设置这个api，可以实现左侧选项搜索结果的检索。

##### 发送

默认 GET，携带 term 变量，值为搜索框输入的文字，可从上下文中取数据设置进去。

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
        "value": "值" // ,
        // "children": [] // 可以嵌套
      },

      {
        "label": "描述2",
        "value": "值2"
      }
    ],

    "value": "值" // 默认值，可以获取列表的同时设置默认值。
  }
}
```

适用于需选择的数据/信息源较多时，用户可直观的知道自己所选择的数据/信息的场景，一般左侧框为数据/信息源，右侧为已选数据/信息，被选中信息同时存在于 2 个框内。

### 结果面板跟随模式 	

isFollowMode开启结果面板跟随模式。

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
      "checkboxPosition": "right",
      "isFollowMode": true,
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
        "isFollowMode": true,
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

| 属性名           | 类型                                                  | 默认值       | 说明   |
| ---------------- | ----------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| options          | `Array<object>`或`Array<string>`                      |            | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options) |
| source           | `string`或 [API](../../../docs/types/api)             |            | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source) |
| delimeter        | `string`                                              | `false`      | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)  |
| joinValues       | `boolean`                                             | `true`       | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues) |
| extractValue     | `boolean`                                             | `false`      | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue) |
| searchApi        | [API](../../../docs/types/api)                        |              | 如果想通过接口检索，可以设置这个api。|
| isFollowMode     | `boolean`                                 |    `false`   | 结果面板跟随模式，目前只支持`list`、`table`、`tree` |
| statistics       | `boolean`                                             | `true`       | 是否显示统计数据|
| selectTitle      | `string`                                              | `"请选择"`   | 左侧的标题文字  |
| resultTitle      | `string`                                              | `"当前选择"` | 右侧结果的标题文字|
| sortable         | `boolean`                                             | `false`      | 结果可以进行拖拽排序|
| selectMode       | `string`                                              | `list`       | 可选：`list`、`table`、`tree`、`chained`、`associated`。分别为：列表形式、表格形式、树形选择形式、级联选择形式，关联选择形式（与级联选择的区别在于，级联是无限极，而关联只有一级，关联左边可以是个 tree）。 |
| searchResultMode | `string`                                              |              | 如果不设置将采用 `selectMode` 的值，可以单独配置，参考 `selectMode`，决定搜索结果的展示形式。 |
| searchable     | `boolean`                                 | `false`      | 左侧列表搜索功能，当设置为 true 时表示可以通过输入部分内容检索出选项项。 |
| searchPlaceholder     | `string`                                 |       | 左侧列表搜索框提示 |
| columns          | `Array<Object>`                                       |              | 当展示形式为 `table` 可以用来配置展示哪些列，跟 table 中的 columns 配置相似，只是只有展示功能。 |
| leftOptions      | `Array<Object>`                                       |              | 当展示形式为 `associated` 时用来配置左边的选项集。|
| leftMode         | `string`                                              |              | 当展示形式为 `associated` 时用来配置左边的选择形式，支持 `list` 或者 `tree`。默认为 `list`。|
| rightMode        | `string`                                              |              | 当展示形式为 `associated` 时用来配置右边的选择形式，可选：`list`、`table`、`tree`、`chained`。 |
| resultSearchable       | `boolean`                                             | `false`      | 结果（右则）列表的检索功能，当设置为true时，可以通过输入检索模糊匹配检索内容（目前树的延时加载不支持结果搜索功能）  |
| resultPlaceholder     | `string`                                 |       | 右侧列表搜索框提示 |
| resultSearchFilter       | `string`          | `false`      | 结果（右则）列表的检索功能的检索字符串，这个字符串是一个New Function内部执行的字符串，第一个参数是text（当前输入值），第二个参数是item（这是一个对象，对象对应option项的值），这个字符串需要返回boolean值。设置 "item.value.indexOf(text) > -1"意味着当前项值和输入值一致时，搜索结果显示该项  |
| menuTpl          | `string` \| [SchemaNode](../../docs/types/schemanode) |              | 用来自定义选项展示 |
| valueTpl         | `string` \| [SchemaNode](../../docs/types/schemanode) |              | 用来自定义值的展示  |

## 事件表

| 事件名称 | 事件参数               | 说明   |
| -------- | ---------------------- | ------ |
| change   | `value: string` 时间值 | 值变化 |

## 动作表

| 动作名称  | 动作配置                 | 说明                                                   |
| --------- | ------------------------ | ------------------------------------------------------ |
| clear     | -                        | 清空                                                   |
| reset     | -                        | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| selectAll | -                        | 全选                                                   |
| setValue  | `value: string` 更新的值 | 更新数据，多值用`,`分隔                                |
