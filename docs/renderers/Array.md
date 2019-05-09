### Array

数组输入框配置

其实就是 [Combo](./Combo.md) 的一个 flat 用法。

-   `type` 请设置成 `array`
-   `items` 配置单项表单类型
-   `addable` 是否可新增。
-   `removable` 是否可删除
-   `draggable` 默认为 `false`, 是否可以拖动排序, 需要注意的是当启用拖动排序的时候，会多一个\$id 字段
-   `draggableTip` 可拖拽的提示文字，默认为：`"可通过拖动每行中的【交换】按钮进行顺序调整"`
-   `addButtonText` 新增按钮文字，默认为 `"新增"`。
-   `minLength` 限制最小长度。
-   `maxLength` 限制最大长度。
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="450" scope="form"
[
  {
    "name": "array",
    "label": "颜色集合",
    "type": "array",
    "value": ["red"],
    "inline": true,
    "items": {
      "type": "color"
    }
  },

  {
    "type": "static",
    "name": "array",
    "label": "当前值"
  }
]
```
