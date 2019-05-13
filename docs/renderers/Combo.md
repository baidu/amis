### Combo

组合模式，支持自由组合多个表单项。

-   `type` 请设置成 `combo`
-   `multiple` 默认为 `false` 配置是否为多选模式
-   `controls` 配置组合成员，所有成员都是横向展示，可以是任意 [FormItem](./FormItem.md)
-   `controls[x].columnClassName` 列的类名，可以用它配置列宽度。默认平均分配。
-   `controls[x].unique` 设置当前列值是否唯一，即不允许重复选择。
-   `maxLength` 当 multiple 为 true 的时候启用，设置可以最大项数。
-   `flat` 默认为 `false`, 是否将结果扁平化(去掉 name),只有当 controls 的 length 为 1 且 multiple 为 true 的时候才有效。
-   `joinValues` 默认为 `true` 当扁平化开启的时候，是否用分隔符的形式发送给后端，否则采用 array 的方式。
-   `delimiter` 当扁平化开启并且 joinValues 为 true 时，用什么分隔符。
-   `multiLine` 默认是横着展示一排，设置以后竖着展示
-   `addable` 是否可新增。
-   `removable` 是否可删除
-   `deleteApi` 如果配置了，则删除前会发送一个 api，请求成功才完成删除！
-   `deleteConfirmText` 默认为 `确认要删除？`，当配置 `deleteApi` 才生效！删除时用来做用户确认！
-   `draggable` 默认为 `false`, 是否可以拖动排序, 需要注意的是当启用拖动排序的时候，会多一个\$id 字段
-   `draggableTip` 可拖拽的提示文字，默认为：`"可通过拖动每行中的【交换】按钮进行顺序调整"`
-   `addButtonText` 新增按钮文字，默认为 `"新增"`。
-   `minLength` 限制最小长度。
-   `maxLength` 限制最大长度。
-   `scaffold` 单条初始值。默认为 `{}`。
-   `canAccessSuperData` 指定是否可以自动获取上层的数据并映射到表单项上，默认是`true`。
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="450" scope="form"
[
{
  "type": "combo",
  "name": "combo",
  "label": "单选组合项",
  "controls": [
    {
      "name": "a",
      "type": "text"
    },
    {
      "name": "b",
      "type": "select",
      "options": ["a", "b", "c"]
    }
  ]
},
{
  "type": "static",
  "name": "combo",
  "label": "当前值"
},

{
  "type": "combo",
  "name": "combo2",
  "label": "多选组合项",
  "multiple": true,
  "draggable": true,
  "controls": [
    {
      "label": "字段1",
      "name": "a",
      "type": "text"
    },
    {
      "label": "字段2",
      "name": "b",
      "type": "select",
      "options": ["a", "b", "c"],
      "unique": true
    }
  ]
},
{
  "type": "static",
  "name": "combo2",
  "label": "当前值"
}
]
```

combo 多行模式。

```schema:height="450" scope="form"
[
{
  "type": "combo",
  "name": "combo",
  "label": "多选组合form",
  "multiple": true,
  "multiLine": true,
  "controls": [
      {
        "label": "字段1",
        "name": "a",
        "type": "text"
      },
      {
        "label": "字段2",
        "name": "b",
        "type": "select",
        "options": ["a", "b", "c"]
      }
    ]

},
{
  "type": "static",
  "name": "combo",
  "label": "当前值"
},

{
  "type": "combo",
  "name": "xxx",
  "label": "单选组合form",
  "multiLine": true,
  "controls": [
    {
      "name": "a",
      "type": "text"
    },
    {
      "name": "b",
      "type": "select",
      "options": ["a", "b", "c"]
    }
  ]
},
{
  "type": "static",
  "name": "xxx",
  "label": "当前值"
}

]
```
