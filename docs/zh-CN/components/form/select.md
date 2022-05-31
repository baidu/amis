---
title: Select 选择器
description:
type: 0
group: null
menuName: Select 选择器
icon:
order: 48
---

## 基本用法

参考 [Options](options)

## 自定义菜单

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "menuTpl": "<div>${label} 值：${value}, 当前是否选中: ${checked}</div>",
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

### 分组展示模式

_单选_

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "分组",
      "type": "select",
      "name": "a",
      "selectMode": "group",
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

_多选_

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "分组",
      "type": "select",
      "name": "a",
      "multiple": true,
      "selectMode": "group",
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

需要额外配置 `columns` 配置，参考 Table 中的说明。

_单选_

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "表格形式",
      "type": "select",
      "name": "a",
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

_多选_

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "表格形式",
      "type": "select",
      "name": "a",
      "selectMode": "table",
      "multiple": true,
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

_单选_

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "树型展示",
      "type": "select",
      "name": "a",
      "selectMode": "tree",
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

_多选_

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "树型展示",
      "type": "select",
      "name": "a",
      "multiple": true,
      "selectMode": "tree",
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

按列来点选。

_单选_

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "级联选择",
      "type": "select",
      "name": "a",
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

_多选_

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "级联选择",
      "type": "select",
      "name": "a",
      "selectMode": "chained",
      "multiple": true,
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

### 支持搜索

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "带搜索",
      "type": "select",
      "name": "a",
      "selectMode": "chained",
      "searchable": true,
      "sortable": true,
      "multiple": true,
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

### 延时加载

选型设置 defer: true，结合配置组件层的 `deferApi` 来实现。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "延时加载",
      "type": "select",
      "name": "a",
      "multiple": true,
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

### 关联选择模式

分为左右两部分，左边点选后关联出现右边。左右都可以配置展示模式。

_单选_

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "关联选择模式",
      "type": "select",
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

_多选_

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "关联选择模式",
      "type": "select",
      "name": "b",
      "multiple": true,
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

### 人员点选

> 请通过网络面板查看接口请求返回。

实际上就是采用的[「关联选择模式」](#关联选择模式)的 select，注意要看那一部分文档，需要知道怎么动态加载 leftOptions。左侧部分和人员都是通过 source 接口返回。需要懒加载的项通过设置 `defer` 为 true 来标记。左右两部分都支持懒加载。
都是通过 deferApi 来实现，后端根据传过来的参数决定是懒加载树，还是栏加载人员。

- 有 dep 值则是懒加载部门树
- 有 ref 值则是懒加载人员

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "人员选择",
      "type": "select",
      "name": "b",
      "multiple": true,
      "sortable": true,
      "searchable": true,
      "selectMode": "associated",
      "leftMode": "tree",
      "source": "/api/mock2/form/departUser",
      "deferApi": "/api/mock2/form/departUser?ref=${ref}&dep=${value}"
    }
  ]
}
```

## 限制标签最大展示数量

> 1.10.0 及以上版本

`maxTagCount`可以限制标签的最大展示数量，超出数量的部分会收纳到 Popover 中，可以通过`overflowTagPopover`配置 Popover 相关的[属性](../tooltip#属性表)，注意该属性仅在多选模式开启后生效。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "水果",
      "type": "select",
      "name": "select",
      "multiple": true,
      "maxTagCount": 3,
      "checkAll": true,
      "defaultCheckAll": true,
      "overflowTagPopover": {
        "title": "水果"
      },
      "options": [
        {"label": "苹果", "value": "Apple"},
        {"label": "香蕉", "value": "Banana"},
        {"label": "黑莓", "value": "Blackberry"},
        {"label": "蓝莓", "value": "Blueberry"},
        {"label": "樱桃", "value": "Cherry"},
        {"label": "杨桃", "value": "Carambola"},
        {"label": "椰子", "value": "Coconut"},
        {"label": "猕猴桃", "value": "Kiwifruit"},
        {"label": "柠檬", "value": "Lemon"},
        {"label": "菠萝", "value": "Pineapple"}
      ]
    }
  ]
}
```

## searchApi

**发送**

默认 GET，携带 term 变量，值为搜索框输入的文字，可从上下文中取数据设置进去。

**响应**

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

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名             | 类型                                                                              | 默认值                                                                             | 说明                                                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| options            | `Array<object>`或`Array<string>`                                                  |                                                                                    | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                                                                                                                                    |
| source             | [API](../../../docs/types/api) 或 [数据映射](../../../docs/concepts/data-mapping) |                                                                                    | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                                                                                                                                 |
| autoComplete       | [API](../../../docs/types/api)                                                    |                                                                                    | [自动提示补全](./options#%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8-autocomplete)                                                                                                                                  |
| delimiter          | `string`                                                                          | `false`                                                                            | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                                                                                                                                    |
| labelField         | `string`                                                                          | `"label"`                                                                          | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield)                                                                                                                  |
| valueField         | `string`                                                                          | `"value"`                                                                          | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)                                                                                                                             |
| joinValues         | `boolean`                                                                         | `true`                                                                             | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                                                                                                                                   |
| extractValue       | `boolean`                                                                         | `false`                                                                            | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)                                                                                                                               |
| checkAll           | `boolean`                                                                         | `false`                                                                            | 是否支持全选                                                                                                                                                                                                 |
| checkAllLabel      | `string`                                                                          | `全选`                                                                             | 全选的文字                                                                                                                                                                                                   |
| checkAllBySearch   | `boolean`                                                                         | `false`                                                                            | 有检索时只全选检索命中的项                                                                                                                                                                                   |
| defaultCheckAll    | `boolean`                                                                         | `false`                                                                            | 默认是否全选                                                                                                                                                                                                 |
| creatable          | `boolean`                                                                         | `false`                                                                            | [新增选项](./options#%E5%89%8D%E7%AB%AF%E6%96%B0%E5%A2%9E-creatable)                                                                                                                                         |
| multiple           | `boolean`                                                                         | `false`                                                                            | [多选](./options#多选-multiple)                                                                                                                                                                              |
| searchable         | `boolean`                                                                         | `false`                                                                            | [检索](./options#检索-searchable)                                                                                                                                                                            |
| createBtnLabel     | `string`                                                                          | `"新增选项"`                                                                       | [新增选项](./options#%E6%96%B0%E5%A2%9E%E9%80%89%E9%A1%B9)                                                                                                                                                   |
| addControls        | Array<[表单项](./formitem)>                                                       |                                                                                    | [自定义新增表单项](./options#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%B0%E5%A2%9E%E8%A1%A8%E5%8D%95%E9%A1%B9-addcontrols)                                                                                           |
| addApi             | [API](../../docs/types/api)                                                       |                                                                                    | [配置新增选项接口](./options#%E9%85%8D%E7%BD%AE%E6%96%B0%E5%A2%9E%E6%8E%A5%E5%8F%A3-addapi)                                                                                                                  |
| editable           | `boolean`                                                                         | `false`                                                                            | [编辑选项](./options#%E5%89%8D%E7%AB%AF%E7%BC%96%E8%BE%91-editable)                                                                                                                                          |
| editControls       | Array<[表单项](./formitem)>                                                       |                                                                                    | [自定义编辑表单项](./options#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BC%96%E8%BE%91%E8%A1%A8%E5%8D%95%E9%A1%B9-editcontrols)                                                                                          |
| editApi            | [API](../../docs/types/api)                                                       |                                                                                    | [配置编辑选项接口](./options#%E9%85%8D%E7%BD%AE%E7%BC%96%E8%BE%91%E6%8E%A5%E5%8F%A3-editapi)                                                                                                                 |
| removable          | `boolean`                                                                         | `false`                                                                            | [删除选项](./options#%E5%88%A0%E9%99%A4%E9%80%89%E9%A1%B9)                                                                                                                                                   |
| deleteApi          | [API](../../docs/types/api)                                                       |                                                                                    | [配置删除选项接口](./options#%E9%85%8D%E7%BD%AE%E5%88%A0%E9%99%A4%E6%8E%A5%E5%8F%A3-deleteapi)                                                                                                               |
| autoFill           | `object`                                                                          |                                                                                    | [自动填充](./options#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85-autofill)                                                                                                                                          |
| menuTpl            | `string`                                                                          |                                                                                    | 支持配置自定义菜单                                                                                                                                                                                           |
| clearable          | `boolean`                                                                         |                                                                                    | 单选模式下是否支持清空                                                                                                                                                                                       |
| hideSelected       | `boolean`                                                                         | `false`                                                                            | 隐藏已选选项                                                                                                                                                                                                 |
| mobileClassName    | `string`                                                                          |                                                                                    | 移动端浮层类名                                                                                                                                                                                               |
| selectMode         | `string`                                                                          | ``                                                                                 | 可选：`group`、`table`、`tree`、`chained`、`associated`。分别为：列表形式、表格形式、树形选择形式、级联选择形式，关联选择形式（与级联选择的区别在于，级联是无限极，而关联只有一级，关联左边可以是个 tree）。 |
| searchResultMode   | `string`                                                                          |                                                                                    | 如果不设置将采用 `selectMode` 的值，可以单独配置，参考 `selectMode`，决定搜索结果的展示形式。                                                                                                                |
| columns            | `Array<Object>`                                                                   |                                                                                    | 当展示形式为 `table` 可以用来配置展示哪些列，跟 table 中的 columns 配置相似，只是只有展示功能。                                                                                                              |
| leftOptions        | `Array<Object>`                                                                   |                                                                                    | 当展示形式为 `associated` 时用来配置左边的选项集。                                                                                                                                                           |
| leftMode           | `string`                                                                          |                                                                                    | 当展示形式为 `associated` 时用来配置左边的选择形式，支持 `list` 或者 `tree`。默认为 `list`。                                                                                                                 |
| rightMode          | `string`                                                                          |                                                                                    | 当展示形式为 `associated` 时用来配置右边的选择形式，可选：`list`、`table`、`tree`、`chained`。                                                                                                               |
| maxTagCount        | `number`                                                                          |                                                                                    | 标签的最大展示数量，超出数量后以收纳浮层的方式展示，仅在多选模式开启后生效                                                                                                                                   |
| overflowTagPopover | `TooltipObject`                                                                   | `{"placement": "top", "trigger": "hover", "showArrow": false, "offset": [0, -10]}` | 收纳浮层的配置属性，详细配置参考[Tooltip](../tooltip#属性表)                                                                                                                                                 |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`event.data.xxx`事件参数变量来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数                                                                          | 说明                 |
| -------- | --------------------------------------------------------------------------------- | -------------------- |
| change   | `event.data.value: string` 选中值                                                 | 选中值变化时触发     |
| blur     | `event.data.value: string` 选中值                                                 | 输入框失去焦点时触发 |
| focus    | `event.data.value: string` 选中值                                                 | 输入框获取焦点时触发 |
| add      | `event.data.options: Option[]` 选项集合<br/>`event.data.value: Option` 新增的选项 | 新增选项提交时触发   |
| edit     | `event.data.options: Option[]` 选项集合<br/>`event.data.value: Option` 编辑的选项 | 编辑选项提交时触发   |
| delete   | `event.data.options: Option[]` 选项集合<br/>`event.data.value: Option` 删除的选项 | 删除选项提交时触发   |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                 | 说明                                                    |
| -------- | ------------------------ | ------------------------------------------------------- |
| clear    | -                        | 清空                                                    |
| reset    | -                        | 将值重置为`resetValue`，若没有配置`resetValue`，则清空  |
| reload   | -                        | 重新加载，调用 `source`，刷新数据域数据刷新（重新加载） |
| setValue | `value: string` 更新的值 | 更新数据，开启`multiple`，多值用`,`分隔                 |
