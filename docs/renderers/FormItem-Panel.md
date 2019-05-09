### Panel(FormItem)

还是为了布局，可以把一部分 [FormItem](./FormItem.md) 合并到一个 panel 里面单独展示。

-   `title` panel 标题
-   `body` [Container](./Types.md#container) 可以是其他渲染模型。
-   `bodyClassName` body 的 className.
-   `footer` [Container](./Types.md#container) 可以是其他渲染模型。
-   `footerClassName` footer 的 className.
-   `controls` 跟 `body` 二选一，如果设置了 controls 优先显示表单集合。

```schema:height="400" scope="form-item"
{
  "type": "hbox",
  "columns": [
    {
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
      "columnClassName": "w-xl",
      "controls": [
        {
          "type": "panel",
          "title": "bla bla",
          "controls": [
            {
              "name": "text",
              "type": "text",
              "label": false,
              "placeholder": "Text 1"
            },

            {
              "name": "text2",
              "type": "text",
              "label": false,
              "placeholder": "Text 2"
            }
          ]
        }
      ]
    }
  ]
}

```
