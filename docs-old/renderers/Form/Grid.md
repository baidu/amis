### Grid(FormItem)

支持 form 内部再用 grid 布局。

-   `type` 请设置成 `grid`
-   `columns` 数据，用来配置列内容。每个 column 又一个独立的渲染器。
-   `columns[x].columnClassName` 配置列的 `className`。
-   `columns[x].controls` 如果配置了表单集合，同时没有指定 type 类型，则优先展示表单集合。
-   `columns[x].xs` 设置极小屏幕宽度占比 1 - 12。
-   `columns[x].xsHidden` 设置极小屏幕是否隐藏。
-   `columns[x].xsOffset` 设置极小屏幕偏移量 1 - 12。
-   `columns[x].xsPull` 设置极小屏幕靠左的距离占比：1 - 12 。
-   `columns[x].xsPush` 设置极小屏幕靠右的距离占比：1 - 12 。
-   `columns[x].sm` 设置小屏幕宽度占比 1 - 12。
-   `columns[x].smHidden` 设置小屏幕是否隐藏。
-   `columns[x].smOffset` 设置小屏幕偏移量 1 - 12。
-   `columns[x].smPull` 设置小屏幕靠左的距离占比：1 - 12 。
-   `columns[x].smPush` 设置小屏幕靠右的距离占比：1 - 12 。
-   `columns[x].md` 设置平板屏幕宽度占比 1 - 12。
-   `columns[x].mdHidden` 设置平板屏幕是否隐藏。
-   `columns[x].mdOffset` 设置平板屏幕偏移量 1 - 12。
-   `columns[x].mdPull` 设置平板屏幕靠左的距离占比：1 - 12 。
-   `columns[x].mdPush` 设置平板屏幕靠右的距离占比：1 - 12 。
-   `columns[x].lg` 设置 PC 屏幕宽度占比 1 - 12。
-   `columns[x].lgHidden` 设置 PC 屏幕是否隐藏。
-   `columns[x].lgOffset` 设置 PC 屏幕偏移量 1 - 12。
-   `columns[x].lgPull` 设置 PC 屏幕靠左的距离占比：1 - 12 。
-   `columns[x].lgPush` 设置 PC 屏幕靠右的距离占比：1 - 12 。

```schema:height="200" scope="form-item"
{
  "type": "grid",
  "columns": [
    {
        "md": 3,
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
        "md": 9,
        "type": "tpl",
         "tpl": "其他渲染器类型"
    }
  ]
}
```
