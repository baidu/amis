### FieldSet

多个输入框可以通过 fieldSet 捆绑在一起。

-   `type` 请设置成 `fieldSet`
-   `title` 标题
-   `controls` 表单项集合。
-   `mode` 展示默认，跟 [Form](./Form.md) 中的模式一样，选择： `normal`、`horizontal`或者`inline`。
-   `horizontal` 当为水平模式时，用来控制左右占比。
-   `horizontal.label` 左边 label 的宽度占比。
-   `horizontal.right` 右边控制器的宽度占比。
-   `horizontal.offset` 当没有设置 label 时，右边控制器的偏移量。
-   `collapsable` 配置是否可折叠，默认为 `true`。
-   `collapsed` 默认是否折叠。
-   `className` CSS 类名
-   `headingClassName` 标题 CSS 类名
-   `bodyClassName` 内容区域 CSS 类名

```schema:height="500" scope="form"
[
  {
    "type": "fieldSet",
    "title": "基本配置",
    "controls": [
      {
        "name": "a",
        "type": "text",
        "label": "文本1"
      },

      {
        "name": "a",
        "type": "text",
        "label": "文本2"
      }
    ]
  },

  {
    "type": "fieldSet",
    "title": "其他配置",
    "collapsed": true,
    "controls": [
      {
        "name": "c",
        "type": "text",
        "label": "文本3"
      },

      {
        "name": "d",
        "type": "text",
        "label": "文本4"
      }
    ]
  }
]
```
