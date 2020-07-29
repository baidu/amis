### 穿梭器（Transfer）

适用于需选择的数据/信息源较多时，用户可直观的知道自己所选择的数据/信息的场景，一般左侧框为数据/信息源，右侧为已选数据/信息，被选中信息同时存在于 2 个框内。

- `type` 请设置成 `transfer`
- `options` 选项配置，类型为数组，成员格式如下。
  - `label` 文字
  - `value` 值
  - `children` 说明可以嵌套。
- `value` 设置默认值，如果想要默认选中某个，请设置默认值。
- `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。另外也可以用 `${xxxx}` 来获取当前作用域中的变量。
- `joinValues` 默认为 `true`
- `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 `value` 的值封装为数组，作为当前表单项的值。
- `delimiter` 默认为 `,`
- `searchable` 默认为 `false`，当设置为 `true` 时表示可以通过输入部分内容检索出选项。
- `searchApi` 可选，如果想通过接口检索，可以设置个 api。
- `statistics` 是否显示统计数据，设置为 `false` 不显示，默认为显示。
- `selectTitle` 默认为 `请选择`，左侧的标题文字。
- `resultTitle` 默认为 `当前选择`，右侧结果的标题文字。
- `sortable` 默认为 `false`，开启后，结果可以进行拖拽排序。
- `selectMode` 默认为 `list`， 可选：`list`、`table`、`tree`、`chained`、`associated`。分表为：列表形式、表格形式、树形选择形式、级联选择形式，关联选择形式（与级联选择的区别在于，级联是无限极，而关联只有一级，关联左边可以是个 tree）。
- `searchResultMode` 如果不设置将采用 `selectMode` 的值，可以单独配置，参考 `selectMode`，决定搜索结果的展示形式。
- `columns` 当展示形式为 `table` 可以用来配置展示哪些列，跟 table 中的 columns 配置相似，只是只有展示功能。
- `leftOptions` 当展示形式为 `associated` 时用来配置左边的选项集。
- `leftMode` 当展示形式为 `associated` 时用来配置左边的选择形式，支持 `list` 或者 `tree`。默认为 `list`。
- `rightMode`当展示形式为 `associated` 时用来配置右边的选择形式，可选：`list`、`table`、`tree`、`chained`。

* **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="450" scope="form"
[
    {
      "type": "transfer",
      "name": "transfer",
      "label": "穿梭器",
      "options": [
        {
          "label": "Option A",
          "value": "a"
        },
        {
          "label": "Option B",
          "value": "b"
        }
      ]
    },

    {
      "type": "static",
      "name": "transfer",
      "label": "当前值"
    }
]
```

[更多示例](/examples/form/transfer)

### 接口说明

开始之前请你先阅读[整体要求](../api.md)。

#### source

**发送**

默认 GET，不携带数据，可从上下文中取数据设置进去。

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

#### searchApi

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
