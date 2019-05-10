### Group

表单项集合中，默认都是一行一个，如果想要一行多个，请用 Group 包裹起来。

-   `type` 请设置成 `group`
-   `controls` 表单项集合。
-   `mode` 展示默认，跟 [Form](./Form.md) 中的模式一样，选择： `normal`、`horizontal`或者`inline`。
-   `horizontal` 当为水平模式时，用来控制左右占比。
-   `horizontal.label` 左边 label 的宽度占比。
-   `horizontal.right` 右边控制器的宽度占比。
-   `horizontal.offset` 当没有设置 label 时，右边控制器的偏移量。
-   `className` CSS 类名。

```schema:height="360" scope="body"
{
  "type": "form",
  "name": "sample2",
  "controls": [
    {
      "type": "text",
      "name": "test",
      "label": "Label",
      "placeholder": "Placeholder"
    },

    {
      "type": "divider"
    },

    {
      "type": "group",
      "controls": [
        {
          "type": "text",
          "name": "test1",
          "label": "Label",
          "placeholder": "Placeholder"
        },

        {
          "type": "text",
          "name": "test2",
          "label": "Label",
          "placeholder": "Placeholder"
        }
      ]
    }
  ]
}
```
