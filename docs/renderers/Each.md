## Each

基于现有变量循环输出渲染器

-   `type` 请设置 `each`。
-   `value` 格式为数组。
-   `items` 使用`value`中的数据，循环输出渲染器。


```schema:height="160" scope="body"
{
    "type": "each",
    "value": ["A", "B", "C"],
    "items": {
        "type": "tpl",
        "tpl": "<span class='label label-default'><%= data.item %></span> "
    }
}
```
