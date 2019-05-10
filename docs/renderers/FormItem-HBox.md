### HBox(FormItem)

支持 form 内部再用 HBox 布局，实现左右排列。没错用 [Group](./Group.md) 也能实现，所以还是推荐用 [Group](./Group.md)。

-   `type` 请设置成 `hbox`
-   `columns` 数据，用来配置列内容。每个 column 又一个独立的渲染器。
-   `columns[x].columnClassName` 配置列的 `className`。
-   `columns[x].controls` 如果配置了表单集合，同时没有指定 type 类型，则优先展示表单集合。

```schema:height="200" scope="form-item"
{
  "type": "hbox",
  "columns": [
    {
        "columnClassName": "w-sm",
        "controls": [
            {
                "name": "text",
                "type": "text",
                "label": false,
                "placeholder": "Text"
            }
        ]
    },

    {
        "type": "tpl",
         "tpl": "其他类型的渲染器"
    }
  ]
}
```
