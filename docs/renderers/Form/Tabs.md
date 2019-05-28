### Tabs(FormItem)

多个输入框也可以通过选项卡来分组。

-   `type` 请设置成 `tabs`
-   `tabs` 选项卡数组
-   `tabs[x].title` 标题
-   `tabs[x].controls` 表单项集合。
-   `tabs[x].body` 内容容器，跟 `controls` 二选一。
-   `tabClassName` 选项卡 CSS 类名。

```schema:height="500" scope="form-item"
{
  "type": "tabs",
  "tabs": [
    {
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
      "title": "其他配置",
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
}
```
