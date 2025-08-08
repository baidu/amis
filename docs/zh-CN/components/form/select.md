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

参考 [Options 选择器表单项](options)

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

## 展示模式

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
      "searchable": true,
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
      "searchable": true,
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
      "searchable": true,
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
      "searchable": true,
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
      "searchable": true,
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
      "searchable": true,
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
      "searchable": true,
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
      "searchable": true,
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

## 支持搜索

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

### 自定义搜索函数

默认通过[match-sorter](https://github.com/kentcdodds/match-sorter)搜索过滤 value,label 中的值

可通过`filterOption`自定义搜索过滤函数

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
      "filterOption": "return options.filter(({value, label, weapon}) => value?.includes(inputValue) || label?.includes(inputValue) || weapon?.includes(inputValue));",
      "sortable": true,
      "multiple": true,
      "options": [
        {
          "label": "诸葛亮",
          "value": "zhugeliang",
          "weapon": "翡翠仙扇"
        },
        {
          "label": "曹操",
          "value": "caocao",
          "weapon": "幻影双刃"
        },
        {
          "label": "钟无艳",
          "value": "zhongwuyan",
          "weapon": "破岳震天锤"
        },

        {
          "label": "李白",
          "value": "libai",
          "weapon": "青丝缠月剑"
        },
        {
          "label": "韩信",
          "value": "hanxin",
          "weapon": "龙吟穿云枪"
        },
        {
          "label": "云中君",
          "value": "yunzhongjun",
          "weapon": "飘渺云影剑"
        }
      ]
    }
  ]
}
```

### searchApi

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

## 延时加载

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

## 关联选择模式

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
      "searchApi": '/api/mock2/form/departUserSearch?term=${term}',
      "deferApi": "/api/mock2/form/departUser?ref=${ref}&dep=${value}"
    }
  ]
}
```

## 限制标签最大展示数量

> 1.10.0 及以上版本

`maxTagCount`可以限制标签的最大展示数量，超出数量的部分会收纳到 Popover 中，可以通过`overflowTagPopover`配置 Popover 相关的[属性](../tooltip#属性表)，注意该属性仅在多选模式开启后生效。

> 6.13.0 版本开始，可摆放个数会根据所剩空间尽可能多的摆放，但是摆放个数不会超出设定的值，所以可以将这个值稍微设置大点。

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
      "maxTagCount": 100,
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
        {"label": "菠萝", "value": "Pineapple"},
        {"label": "葡萄", "value": "Grape"},
        {"label": "石榴", "value": "Pomegranate"},
        {"label": "芒果", "value": "Mango"},
        {"label": "木瓜", "value": "Papaya"},
        {"label": "山竹", "value": "Mangosteen"},
        {"label": "榴莲", "value": "Durian"},
        {"label": "龙眼", "value": "Longan"},
        {"label": "荔枝", "value": "Litchi"},
        {"label": "枇杷", "value": "Loquat"},
        {"label": "柿子", "value": "Persimmon"},
        {"label": "柚子", "value": "Pomelo"},
        {"label": "橙子", "value": "Orange"},
        {"label": "橘子", "value": "Tangerine"},
        {"label": "金桔", "value": "Kumquat"},
        {"label": "李子", "value": "Plum"},
        {"label": "杏子", "value": "Apricot"},
        {"label": "桃子", "value": "Peach"},
        {"label": "梨子", "value": "Pear"},
        {"label": "草莓", "value": "Strawberry"}
      ]
    }
  ]
}
```

## 自定义下拉区域宽度与对齐方式

> 2.8.0 以上版本

使用字符串或数字，使用数字时单位为`px`；支持单位: `%`、`px`、`rem`、`em`、`vw`。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "form",
    "body": [
      {
        "label": "80% 宽度靠右对齐",
        "type": "select",
        "name": "select",
        "menuTpl": "<div>${label} 值：${value}, 当前是否选中: ${checked}</div>",
        "overlay": {
          "width": "80%",
          "align": "right"
        },
        "options": [
          {
            "label": "A",
            "value": "a"
          },
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
        "label": "300px 宽度中间对齐",
        "type": "select",
        "name": "select",
        "menuTpl": "<div>${label} 值：${value}, 当前是否选中: ${checked}</div>",
        "overlay": {
          "width": 300,
          "align": "center"
        },
        "options": [
          {
            "label": "A",
            "value": "a"
          },
          {
            "label": "B",
            "value": "b"
          },
          {
            "label": "C",
            "value": "c"
          }
        ]
      }
    ]
  }
}
```

使用相对数值，如：`-20px` 相当于 `100% - 20px`；`+10vw` 相当于 `100% + 10vw`。支持如上相同单位。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "form",
    "body": [
      {
        "label": "相对窄 100px 向左对齐",
        "type": "select",
        "name": "select",
        "overlay": {
          "width": "-100px",
          "align": "left"
        },
        "popOverContainerSelector": "body",
        "options": [
          {
            "label": "A",
            "value": "a"
          },
          {
            "label": "B",
            "value": "b"
          },
          {
            "label": "C",
            "value": "c"
          }
        ]
      }
    ]
  }
}
```

## 多选全选

开启全选后，默认开启`"checkAllBySearch": true`，检索状态下全选内容为当前过滤项。如果设置了`"checkAllBySearch": false`，则无论是否在检索状态下，全选都会选择全部数据源。

> 2.8.1 及以上版本`checkAllBySearch`默认开启

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "多选",
            "type": "select",
            "name": "select2",
            "searchable": true,
            "checkAll": true,
            "multiple": true,
            "clearable": true,
            "source": "/api/mock2/form/getOptions"
        }
    ]
}
```

## 自动补全 autoComplete

可以在`autoComplete`配置中，用数据映射，获取变量`term`，为当前输入的关键字。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "name": "select1",
            "type": "select",
            "label": "选项自动补全（单选）",
            "autoComplete": "/api/mock2/options/autoComplete3?delay=true&term=${term}&waitSeconds=2",
            "placeholder": "请输入",
            "clearable": true
        },
        {
            "name": "select2",
            "type": "select",
            "label": "选项自动补全（多选）",
            "autoComplete": "/api/mock2/options/autoComplete?labelField=name&valueField=id&term=${term}",
            "placeholder": "请输入",
            "labelField": "name",
            "valueField": "id",
            "clearable": true,
            "multiple": true,
            "maxTagCount": 2
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名                   | 类型                                                                              | 默认值                                                                             | 说明                                                                                                                                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| options                  | `Array<object>`或`Array<string>`                                                  |                                                                                    | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                                                                                                                                    |
| source                   | [API](../../../docs/types/api) 或 [数据映射](../../../docs/concepts/data-mapping) |                                                                                    | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                                                                                                                                 |
| autoComplete             | [API](../../../docs/types/api)                                                    |                                                                                    | [自动提示补全](./options#%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8-autocomplete)                                                                                                                                  |
| delimiter                | `string`                                                                          | `false`                                                                            | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                                                                                                                                    |
| labelField               | `string`                                                                          | `"label"`                                                                          | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield)                                                                                                                  |
| valueField               | `string`                                                                          | `"value"`                                                                          | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)                                                                                                                             |
| joinValues               | `boolean`                                                                         | `true`                                                                             | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                                                                                                                                   |
| extractValue             | `boolean`                                                                         | `false`                                                                            | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)                                                                                                                               |
| checkAll                 | `boolean`                                                                         | `false`                                                                            | 是否支持全选                                                                                                                                                                                                 |
| checkAllLabel            | `string`                                                                          | `全选`                                                                             | 全选的文字                                                                                                                                                                                                   |
| checkAllBySearch         | `boolean`                                                                         | `true`                                                                             | 有检索时只全选检索命中的项                                                                                                                                                                                   |
| defaultCheckAll          | `boolean`                                                                         | `false`                                                                            | 默认是否全选                                                                                                                                                                                                 |
| creatable                | `boolean`                                                                         | `false`                                                                            | [新增选项](./options#%E5%89%8D%E7%AB%AF%E6%96%B0%E5%A2%9E-creatable)                                                                                                                                         |
| multiple                 | `boolean`                                                                         | `false`                                                                            | [多选](./options#多选-multiple)                                                                                                                                                                              |
| searchable               | `boolean`                                                                         | `false`                                                                            | [检索](./options#检索-searchable)                                                                                                                                                                            |
| filterOption             | `string`                                                                          | `(options: Option[], inputValue: string, option: {keys: string[]}) => Option[]`    |                                                                                                                                                                                                              |
| createBtnLabel           | `string`                                                                          | `"新增选项"`                                                                       | [新增选项](./options#%E6%96%B0%E5%A2%9E%E9%80%89%E9%A1%B9)                                                                                                                                                   |
| addControls              | Array<[表单项](./formitem)>                                                       |                                                                                    | [自定义新增表单项](./options#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%B0%E5%A2%9E%E8%A1%A8%E5%8D%95%E9%A1%B9-addcontrols)                                                                                           |
| addApi                   | [API](../../docs/types/api)                                                       |                                                                                    | [配置新增选项接口](./options#%E9%85%8D%E7%BD%AE%E6%96%B0%E5%A2%9E%E6%8E%A5%E5%8F%A3-addapi)                                                                                                                  |
| editable                 | `boolean`                                                                         | `false`                                                                            | [编辑选项](./options#%E5%89%8D%E7%AB%AF%E7%BC%96%E8%BE%91-editable)                                                                                                                                          |
| editControls             | Array<[表单项](./formitem)>                                                       |                                                                                    | [自定义编辑表单项](./options#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BC%96%E8%BE%91%E8%A1%A8%E5%8D%95%E9%A1%B9-editcontrols)                                                                                          |
| editApi                  | [API](../../docs/types/api)                                                       |                                                                                    | [配置编辑选项接口](./options#%E9%85%8D%E7%BD%AE%E7%BC%96%E8%BE%91%E6%8E%A5%E5%8F%A3-editapi)                                                                                                                 |
| removable                | `boolean`                                                                         | `false`                                                                            | [删除选项](./options#%E5%88%A0%E9%99%A4%E9%80%89%E9%A1%B9)                                                                                                                                                   |
| deleteApi                | [API](../../docs/types/api)                                                       |                                                                                    | [配置删除选项接口](./options#%E9%85%8D%E7%BD%AE%E5%88%A0%E9%99%A4%E6%8E%A5%E5%8F%A3-deleteapi)                                                                                                               |
| autoFill                 | `object`                                                                          |                                                                                    | [自动填充](./options#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85-autofill)                                                                                                                                          |
| menuTpl                  | `string`                                                                          |                                                                                    | 支持配置自定义菜单                                                                                                                                                                                           |
| clearable                | `boolean`                                                                         |                                                                                    | 单选模式下是否支持清空                                                                                                                                                                                       |
| hideSelected             | `boolean`                                                                         | `false`                                                                            | 隐藏已选选项                                                                                                                                                                                                 |
| mobileClassName          | `string`                                                                          |                                                                                    | 移动端浮层类名                                                                                                                                                                                               |
| selectMode               | `string`                                                                          | ``                                                                                 | 可选：`group`、`table`、`tree`、`chained`、`associated`。分别为：列表形式、表格形式、树形选择形式、级联选择形式，关联选择形式（与级联选择的区别在于，级联是无限极，而关联只有一级，关联左边可以是个 tree）。 |
| searchResultMode         | `string`                                                                          |                                                                                    | 如果不设置将采用 `selectMode` 的值，可以单独配置，参考 `selectMode`，决定搜索结果的展示形式。                                                                                                                |
| columns                  | `Array<Object>`                                                                   |                                                                                    | 当展示形式为 `table` 可以用来配置展示哪些列，跟 table 中的 columns 配置相似，只是只有展示功能。                                                                                                              |
| leftOptions              | `Array<Object>`                                                                   |                                                                                    | 当展示形式为 `associated` 时用来配置左边的选项集。                                                                                                                                                           |
| leftMode                 | `string`                                                                          |                                                                                    | 当展示形式为 `associated` 时用来配置左边的选择形式，支持 `list` 或者 `tree`。默认为 `list`。                                                                                                                 |
| rightMode                | `string`                                                                          |                                                                                    | 当展示形式为 `associated` 时用来配置右边的选择形式，可选：`list`、`table`、`tree`、`chained`。                                                                                                               |
| maxTagCount              | `number`                                                                          |                                                                                    | 标签的最大展示数量，超出数量后以收纳浮层的方式展示，仅在多选模式开启后生效                                                                                                                                   |
| overflowTagPopover       | `TooltipObject`                                                                   | `{"placement": "top", "trigger": "hover", "showArrow": false, "offset": [0, -10]}` | 收纳浮层的配置属性，详细配置参考[Tooltip](../tooltip#属性表)                                                                                                                                                 |
| optionClassName          | `string`                                                                          |                                                                                    | 选项 CSS 类名                                                                                                                                                                                                |
| popOverContainerSelector | `string`                                                                          |                                                                                    | 弹层挂载位置选择器，会通过`querySelector`获取                                                                                                                                                                |
| clearable                | `boolean`                                                                         |                                                                                    | 是否展示清空图标                                                                                                                                                                                             |
| overlay                  | `{ width: string \| number, align: "left" \| "center" \| "right" }`               |                                                                                    | 弹层宽度与对齐方式 `2.8.0 以上版本`                                                                                                                                                                          |
| showInvalidMatch         | `boolean`                                                                         | `false`                                                                            | 选项值与选项组不匹配时选项值是否飘红                                                                                                                                                                         |
| noResultsText            | `string`                                                                          | `"未找到任何结果"`                                                                 | 无结果时的文本                                                                                                                                                                                               |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称                         | 事件参数                                                                                                                                    | 说明                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| change                           | `[name]: string` 组件的值<br/>`selectedItems: Option \| Option[]` 选中的项<br/>`items: Option[]` 选项集合（< 2.3.2 及以下版本 为`options`） | 选中值变化时触发     |
| blur                             | `[name]: string` 组件的值<br/>`items: Option[]` 选项集合（< 2.3.2 及以下版本 为`options`）                                                  | 输入框失去焦点时触发 |
| focus                            | `[name]: string` 组件的值<br/>`items: Option[]` 选项集合（< 2.3.2 及以下版本 为`options`）                                                  | 输入框获取焦点时触发 |
| addConfirm (3.6.4 及以上版本)    | `[name]: string` 组件的值<br/>`item: object` 新增的节点信息<br/>`items: object[]`选项集合                                                   | 新增节点提交时触发   |
| editConfirm (3.6.4 及以上版本)   | `[name]: object` 组件的值<br/>`item: object` 编辑的节点信息<br/>`items: object[]`选项集合                                                   | 编辑节点提交时触发   |
| deleteConfirm (3.6.4 及以上版本) | `[name]: string` 组件的值<br/>`item: object` 删除的节点信息<br/>`items: object[]`选项集合                                                   | 删除节点提交时触发   |
| add（不推荐）                    | `[name]: object` 新增的节点信息<br/>`items: object[]`选项集合（< 2.3.2 及以下版本 为`options`）                                             | 新增节点提交时触发   |
| edit（不推荐）                   | `[name]: object` 编辑的节点信息<br/>`items: object[]`选项集合（< 2.3.2 及以下版本 为`options`）                                             | 编辑节点提交时触发   |
| delete（不推荐）                 | `[name]: object` 删除的节点信息<br/>`items: object[]`选项集合（< 2.3.2 及以下版本 为`options`）                                             | 删除节点提交时触发   |

### change

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "select",
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
          "label": "A",
          "value": "a"
        },
        {
          "label": "B",
          "value": "b"
        },
        {
          "label": "C",
          "value": "c"
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
      "type": "select",
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
          "label": "A",
          "value": "a"
        },
        {
          "label": "B",
          "value": "b"
        },
        {
          "label": "C",
          "value": "c"
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
      "type": "select",
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
          "label": "A",
          "value": "a"
        },
        {
          "label": "B",
          "value": "b"
        },
        {
          "label": "C",
          "value": "c"
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
      "type": "select",
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
          "label": "A",
          "value": "a"
        },
        {
          "label": "B",
          "value": "b"
        },
        {
          "label": "C",
          "value": "c"
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
      "type": "select",
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
          "label": "A",
          "value": "a"
        },
        {
          "label": "B",
          "value": "b"
        },
        {
          "label": "C",
          "value": "c"
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
      "type": "select",
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
          "label": "A",
          "value": "a"
        },
        {
          "label": "B",
          "value": "b"
        },
        {
          "label": "C",
          "value": "c"
        }
      ]
    }
  ]
}
```

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                               | 说明                                                                                    |
| -------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| clear    | -                                      | 清空                                                                                    |
| reset    | -                                      | 将值重置为初始值。6.3.0 及以下版本为`resetValue`                                        |
| reload   | -                                      | 重新加载，调用 `source`，刷新数据域数据刷新（重新加载）                                 |
| setValue | `value: string` \| `string[]` 更新的值 | 更新数据，开启`multiple`支持设置多项，开启`joinValues`时，多值用`,`分隔，否则多值用数组 |

### clear

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
          "name": "select",
          "type": "select",
          "label": "select",
          "options": [
            {
              "label": "OptionA",
              "value": "a"
            },
            {
              "label": "OptionB",
              "value": "b"
            },
            {
              "label": "OptionC",
              "value": "c"
            },
            {
              "label": "OptionD",
              "value": "d"
            }
          ],
          "value": "a",
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
          "name": "select",
          "type": "select",
          "label": "select",
          "options": [
            {
              "label": "OptionA",
              "value": "a"
            },
            {
              "label": "OptionB",
              "value": "b"
            },
            {
              "label": "OptionC",
              "value": "c"
            },
            {
              "label": "OptionD",
              "value": "d"
            }
          ],
          "value": "a",
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

### 刷新数据源 reload

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
          "type": "control",
          "label": "点击刷新",
          "mode": "horizontal",
          "body": [
            {
              "type": "action",
              "label": "点击刷新Select数据源",
              "level": "primary",
              "className": "mb-2",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "componentId": "select_reload",
                      "actionType": "reload",
                    }
                  ],
                  "debounce": {
                    "wait": 200
                  }
                }
              }
            }
          ]
        },
        {
            "name": "watchField",
            "type": "input-text",
            "label": "监听字段刷新",
            "mode": "horizontal",
            "placeholder": "输入内容刷新Select数据源",
            "onEvent": {
            "change": {
              "actions": [
                {
                  "componentId": "select_reload",
                  "actionType": "reload",
                }
              ],
              "debounce": {
                "wait": 250
              }
            }
          }
        },
        {
            "label": "Select",
            "type": "select",
            "name": "select",
            "id": "select_reload",
            "mode": "horizontal",
            "source": "/api/mock2/form/getOptions?waitSeconds=3",
            "multiple": true,
            "clearable": true
        }
    ]
}
```

### setValue

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
          "name": "select",
          "type": "select",
          "label": "select",
          "options": [
            {
              "label": "OptionA",
              "value": "a"
            },
            {
              "label": "OptionB",
              "value": "b"
            },
            {
              "label": "OptionC",
              "value": "c"
            },
            {
              "label": "OptionD",
              "value": "d"
            }
          ],
          "value": "a",
          "id": "setvalue_text"
        },
        {
            "type": "button",
            "label": "赋值",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "setValue",
                            "componentId": "setvalue_text",
                            "args": {
                                "value": "b"
                            }
                        }
                    ]
                }
            }
        }
    ]
}
```
