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
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
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
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
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
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
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
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "label": "树型展示",
      "type": "transfer",
      "name": "transfer4",
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

```schema: scope="body"
{
  "type": "form",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
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

### 支持搜索

```schema: scope="body"
{
  "type": "form",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
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

### 延时加载

```schema: scope="body"
{
  "type": "form",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "label": "延时加载",
      "type": "transfer",
      "name": "transfer7",
      "selectMode": "tree",
      "deferApi": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/deferOptions?label=${label}",
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

```schema: scope="body"
{
  "type": "form",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "label": "关联选择模式",
      "type": "transfer",
      "name": "b",
      "sortable": true,
      "searchable": true,
      "deferApi": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock/form/deferOptions?label=${label}",
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

| 属性名           | 类型                                      | 默认值       | 说明                                                                                                                                                                                                        |
| ---------------- | ----------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| options          | `Array<object>`或`Array<string>`          |              | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                                                                                                                                   |
| source           | `string`或 [API](../../../docs/types/api) |              | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                                                                                                                                |
| delimeter        | `string`                                  | `false`      | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                                                                                                                                   |
| joinValues       | `boolean`                                 | `true`       | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                                                                                                                                  |
| extractValue     | `boolean`                                 | `false`      | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)                                                                                                                              |
| searchable       | `boolean`                                 | `false`      | 当设置为 `true` 时表示可以通过输入部分内容检索出选项。                                                                                                                                                      |
| searchApi        | [API](../../../docs/types/api)            |              | 如果想通过接口检索，可以设置个 api。                                                                                                                                                                        |
| statistics       | `boolean`                                 | `true`       | 是否显示统计数据                                                                                                                                                                                            |
| selectTitle      | `string`                                  | `"请选择"`   | 左侧的标题文字                                                                                                                                                                                              |
| resultTitle      | `string`                                  | `"当前选择"` | 右侧结果的标题文字                                                                                                                                                                                          |
| sortable         | `boolean`                                 | `false`      | 结果可以进行拖拽排序                                                                                                                                                                                        |
| selectMode       | `string`                                  | `list`       | 可选：`list`、`table`、`tree`、`chained`、`associated`。分别为：列表形式、表格形式、树形选择形式、级联选择形式，关联选择形式（与级联选择的区别在于，级联是无限极，而关联只有一级，关联左边可以是个 tree）。 |
| searchResultMode | `string`                                  |              | 如果不设置将采用 `selectMode` 的值，可以单独配置，参考 `selectMode`，决定搜索结果的展示形式。                                                                                                               |
| columns          | `Array<Object>`                           |              | 当展示形式为 `table` 可以用来配置展示哪些列，跟 table 中的 columns 配置相似，只是只有展示功能。                                                                                                             |
| leftOptions      | `Array<Object>`                           |              | 当展示形式为 `associated` 时用来配置左边的选项集。                                                                                                                                                          |
| leftMode         | `string`                                  |              | 当展示形式为 `associated` 时用来配置左边的选择形式，支持 `list` 或者 `tree`。默认为 `list`。                                                                                                                |
| rightMode        | `string`                                  |              | 当展示形式为 `associated` 时用来配置右边的选择形式，可选：`list`、`table`、`tree`、`chained`。                                                                                                              |
