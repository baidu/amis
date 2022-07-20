---
title: Table View 表格展现
description:
type: 0
group: ⚙ 组件
menuName: Table View 表格展现
icon:
order: 68
---

> 1.2.0 及以上版本才有此功能

通过表格的方式来展现数据，和 [table](./table) 的不同之处：

- 数据源要求不同
  - table 的数据源需要是多行的数据，最典型的就是来自某个数据库的表
  - table view 的数据源可以来自各种固定的数据，比如单元格的某一列是来自某个变量
- 功能不同
  - table 只能用来做数据表的展现
  - table view 除了展现复杂的报表，还能用来进行布局
- 合并单元格方式不同
  - table 的合并单元格需要依赖数据
  - table view 的合并单元格是手动指定的，因此可以支持不规则的数据格式

## 基本用法

```schema: scope="body"
{
  "type": "service",
  "data": {
    "beijing": "20",
    "tianjing": "19"
  },
  "body": [
    {
      "type": "table-view",
      "trs": [
        {
          "background": "#F7F7F7",
          "tds": [
            {
              "body": {
                "type": "tpl",
                "tpl": "地区"
              }
            },
            {
              "body": {
                "type": "tpl",
                "tpl": "城市"
              }
            },
            {
              "body": {
                "type": "tpl",
                "tpl": "销量"
              }
            }
          ]
        },
        {
          "tds": [
            {
              "rowspan": 2,
              "body": {
                "type": "tpl",
                "tpl": "华北"
              }
            },
            {
              "body": {
                "type": "tpl",
                "tpl": "北京"
              }
            },
            {
              "body": {
                "type": "tpl",
                "tpl": "${beijing}"
              }
            }
          ]
        },
        {
          "tds": [
            {
              "body": {
                "type": "tpl",
                "tpl": "天津"
              }
            },
            {
              "body": {
                "type": "tpl",
                "tpl": "${tianjing}"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

可以看到 table view 需要手动进行单元格合并，因此更适合使用可视化编辑器进行编辑。

## 设置项

table view 的设置项有三层，可以分别对表格级别、行级别、单元格级别进行设置。

### 表格设置项

| 属性名      | 类型            | 默认值                                                | 说明             |
| ----------- | --------------- | ----------------------------------------------------- | ---------------- |
| width       | `number/string` | '100%'                                                |                  |
| padding     | `number/string` | 'var(--TableCell-paddingY) var(--TableCell-paddingX)' | 单元格默认内间距 |
| border      | `boolean`       | true                                                  | 是否显示边框     |
| borderColor | `string`        | `var(--borderColor)`                                  | 边框颜色         |
| trs         |                 |                                                       | 参考下面的行设置 |

### 行设置

| 属性名     | 类型            | 默认值 | 说明                 |
| ---------- | --------------- | ------ | -------------------- |
| height     | `number/string` |        |                      |
| background | `string`        |        | 行背景色             |
| tds        |                 |        | 参考下面的单元格设置 |

### 单元格设置

| 属性名     | 类型                                      | 默认值         | 说明                                                             |
| ---------- | ----------------------------------------- | -------------- | ---------------------------------------------------------------- |
| background | `string`                                  |                | 单元格背景色                                                     |
| color      | `string`                                  |                | 单元格文字颜色                                                   |
| bold       | `boolean`                                 | false          | 单元格文字是否加粗                                               |
| width      | `number/string`                           |                | 单元格宽度，只需要设置第一行                                     |
| padding    | `number/string`                           | 集成表格的设置 | 单元格内间距                                                     |
| align      | `string`                                  | `left`         | 单元格内的水平对齐，可以是 `left`、`center`、`right`             |
| valign     | `string`                                  | `middle`       | 单元格内的垂直对齐，可以是 `top`、`middle`、`bottom`、`baseline` |
| colspan    | `number`                                  |                | 单元格水平跨几行                                                 |
| rowspan    | `number`                                  |                | 单元格垂直跨几列                                                 |
| body       | [SchemaNode](../../docs/types/schemanode) |                | 其它 amis 设置                                                   |

### 支持变量及表达式

> 2.1.0 及以上版本

table-view 的所有属性都支持变量，比如下面的例子通过表达式实现了针对数据进行不同展示

```schema
{
  "type": "page",
  "title": "标题",
  "data": {
    "score": 40
  },
  "body": {
    "type": "table-view",
    "trs": [
      {
        "tds": [
          {
            "background": "${score>50 ? '#fef1d2': '#d7f8ff'}",
            "body": {
              "type": "tpl",
              "tpl": "分数>50"
            }
          },
          {
            "background": "${score<100 ? '#fef1d2': '#d7f8ff'}",
            "body": {
              "type": "tpl",
              "tpl": "分数<100"
            }
          }
        ]
      }
    ]
  }
}
```

### 列设置项

列设置项主要是用于控制整列的样式，比如

```schema: scope="body"
{
  "type": "table-view",
  "cols": [
    {

    },
    {
      "style": {
        "background": "#F7F7F7"
      }
    }
  ],
  "trs": [
    {
      "tds": [
        {
          "rowspan": 2,
          "body": {
            "type": "tpl",
            "tpl": "华北"
          }
        },
        {
          "body": {
            "type": "tpl",
            "tpl": "北京"
          }
        }
      ]
    },
    {
      "tds": [
        {
          "body": {
            "type": "tpl",
            "tpl": "天津"
          }
        }
      ]
    }
  ]
}
```

| 属性名 | 类型     | 默认值 | 说明                 |
| ------ | -------- | ------ | -------------------- |
| span   | `number` |        | 这是个跨几列的设置项 |
| style  | `object` |        | 列样式               |

### 标题设置

可以通过 `caption` 来添加段标题文本，并通过 `captionSide` 来控制显示在底部还是顶部。

```schema: scope="body"
{
  "type": "table-view",
  "caption": "标题",
  "captionSide": "bottom",
  "trs": [
    {
      "tds": [
        {
          "rowspan": 2,
          "body": {
            "type": "tpl",
            "tpl": "华北"
          }
        },
        {
          "body": {
            "type": "tpl",
            "tpl": "北京"
          }
        },
        {
          "body": {
            "type": "tpl",
            "tpl": "${beijing}"
          }
        }
      ]
    },
    {
      "tds": [
        {
          "body": {
            "type": "tpl",
            "tpl": "天津"
          }
        },
        {
          "body": {
            "type": "tpl",
            "tpl": "${tianjing}"
          }
        }
      ]
    }
  ]
}
```

## 作为布局方法

table-view 除了可以用来展现表格类型的数据，还能用来实现复杂布局效果，只需要将 `border` 隐藏就行，除了拆分单元格还能通过嵌套的方式实现布局，比如：

```schema: scope="body"
{
  "type": "table-view",
  "border": false,
  "trs": [
    {
      "background": "#feceea",
      "tds": [
        {
          "colspan": 2,
          "align": "center",
          "body": {
            "type": "tpl",
            "tpl": "头部"
          }
        }
      ]
    },
    {
      "tds": [
        {
          "rowspan": 2,
          "background": "#fef1d2",
          "width": 200,
          "body": {
            "type": "tpl",
            "tpl": "侧边"
          }
        },
        {
          "align": "center",
          "background": "#a9fdd8",
          "body": {
            "type": "tpl",
            "tpl": "右上"
          }
        }
      ]
    },
    {
      "height": 200,
      "tds": [
        {
          "align": "center",
          "background": "#d7f8ff",
          "body": {
            "type": "table-view",
            "border": false,
            "trs": [
              {
                "tds": [
                  {
                    "align": "center",
                    "body": {
                      "type": "tpl",
                      "tpl": "栏目 1"
                    }
                  },
                  {
                    "align": "center",
                    "body": {
                      "type": "tpl",
                      "tpl": "栏目 2"
                    }
                  },
                  {
                    "align": "center",
                    "body": {
                      "type": "tpl",
                      "tpl": "栏目 3"
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "tds": [
        {
          "colspan": 2,
          "align": "center",
          "background": "#cec5fa",
          "body": {
            "type": "tpl",
            "tpl": "底部"
          }
        }
      ]
    }
  ]
}
```
