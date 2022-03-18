---
title: MatrixCheckboxes 矩阵
description:
type: 0
group: null
menuName: MatrixCheckboxes
icon:
order: 30
---

矩阵类型的输入框。

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "matrix-checkboxes",
      "name": "matrix",
      "label": "Matrix",
      "rowLabel": "行标题说明",
      "columns": [
        {
          "label": "列1"
        },
        {
          "label": "列2"
        }
      ],
      "rows": [
        {
          "label": "行1"
        },
        {
          "label": "行2"
        }
      ]
    }
  ]
}
```

## 单选模式

配置`"multiple": false`可以设置单选，配置`singleSelectMode`可以设置单选模式

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "matrix-checkboxes",
      "name": "matrix",
      "label": "Matrix",
      "rowLabel": "行标题说明",
      "multiple": false,
      "columns": [
        {
          "label": "列1"
        },
        {
          "label": "列2"
        }
      ],
      "rows": [
        {
          "label": "行1"
        },
        {
          "label": "行2"
        }
      ]
    }
  ]
}
```

## 动态选项

可以配置 source 渲染动态选项

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "name": "matrix",
        "type": "matrix-checkboxes",
        "label": "动态矩阵组件",
        "source": "/api/mock2/options/matrix?waitSeconds=1"
    }
  ]
}
```

以上面为例，source 接口返回格式如下：

```json
{
  "status": 0,
  "msg": "ok",
  "data": {
    "columns": [
      {
        "label": "Col A",
        "col": "a"
      },
      {
        "label": "Col B",
        "col": "b"
      },
      {
        "label": "Col C",
        "col": "c"
      },
      {
        "label": "Col D",
        "col": "d"
      },
      {
        "label": "Col E",
        "col": "e"
      }
    ],
    "rows": [
      {
        "label": "Row 1",
        "rol": 1
      },
      {
        "label": "Row 2",
        "rol": 2
      },
      {
        "label": "Row 3",
        "rol": 3
      },
      {
        "label": "Row 4",
        "rol": 4
      },
      {
        "label": "Row 5",
        "rol": 5
      },
      {
        "label": "Row 6",
        "rol": 6
      }
    ]
  }
}
```

### column 模式

默认为 column 模式，即每列只能单选某个单元格

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "matrix-checkboxes",
      "name": "matrix",
      "label": "Matrix",
      "rowLabel": "行标题说明",
      "multiple": false,
      "columns": [
        {
          "label": "列1"
        },
        {
          "label": "列2"
        }
      ],
      "rows": [
        {
          "label": "行1"
        },
        {
          "label": "行2"
        }
      ]
    }
  ]
}
```

### cell 模式

cell 模式，指全部选项中只能单选某个单元格

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "matrix-checkboxes",
      "name": "matrix",
      "label": "Matrix",
      "rowLabel": "行标题说明",
      "multiple": false,
      "singleSelectMode": "cell",
      "columns": [
        {
          "label": "列1"
        },
        {
          "label": "列2"
        }
      ],
      "rows": [
        {
          "label": "行1"
        },
        {
          "label": "行2"
        }
      ]
    }
  ]
}
```

### row 模式

row 模式，每行只能单选某个单元格

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "matrix-checkboxes",
      "name": "matrix",
      "label": "Matrix",
      "rowLabel": "行标题说明",
      "multiple": false,
      "singleSelectMode": "row",
      "columns": [
        {
          "label": "列1"
        },
        {
          "label": "列2"
        }
      ],
      "rows": [
        {
          "label": "行1"
        },
        {
          "label": "行2"
        }
      ]
    }
  ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名           | 类型                           | 默认值     | 说明                                                                                                                                                        |
| ---------------- | ------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| columns          | `Array<column>`                |            | 列信息，数组中 `label` 字段是必须给出的                                                                                                                     |
| rows             | `Array<row>`                   |            | 行信息， 数组中 `label` 字段是必须给出的                                                                                                                    |
| rowLabel         | `string`                       |            | 行标题说明                                                                                                                                                  |
| source           | [API](../../../docs/types/api) |            | Api 地址，如果选项组不固定，可以通过配置 `source` 动态拉取。                                                                                                |
| multiple         | `boolean`                      | `true`     | 是否多选                                                                                                                                                    |
| singleSelectMode | `string`                       | `"column"` | 设置单选模式，`multiple`为`false`时有效，可设置为`cell`, `row`, `column` 分别为全部选项中只能单选某个单元格、每行只能单选某个单元格，每列只能单选某个单元格 |

## 事件表

| 事件名称 | 事件参数                                                                                           | 说明 |
| -------- | -------------------------------------------------------------------------------------------------- | ---- |
| change    |  `value: Array` 选中值 | 选中值发生变化时触发 |

## 动作表

| 动作名称 | 动作配置                                                                                           | 说明 |
| -------- | -------------------------------------------------------------------------------------------------- | ---- |
| clear    |  - | 清空 |
| reset    |  - | 重置 |
