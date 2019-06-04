## Nav

| 属性名            | 类型      | 默认值   | 说明                                   |
| ----------------- | --------- | -------- | -------------------------------------- |
| type              | `string`  | `"tabs"` | 指定为 Nav 渲染器                      |
| className         | `string`  |          | 外层 Dom 的类名                        |
| stacked           | `boolean` | `true`   | 设置成 false 可以以 tabs 的形式展示    |
| links             | `Array`   |          | 链接集合                               |
| links[x].label    | `string`  |          | 名称                                   |
| links[x].to       | `string`  |          | 链接地址                               |
| links[x].icon     | `string`  |          | 图标                                   |
| links[x].active   | `boolean` |          | 是否高亮                               |
| links[x].activeOn | `表达式`  |          | 是否高亮的条件，留空将自动分析链接地址 |

链接集合。

```schema:height="300" scope="body"
{
    "type": "nav",
    "stacked": true,
    "className": "w-md",
    "links": [
        {
            "label": "Nav 1",
            "to": "/docs/index",
            "icon": "fa fa-user",
            "active": true
        },

        {
            "label": "Nav 2",
            "to": "/docs/api"
        },

        {
            "label": "Nav 3",
            "to": "/docs/renderers"
        }
    ]
}
```

```schema:height="300" scope="body"
{
    "type": "nav",
    "stacked": false,
    "links": [
        {
            "label": "Nav 1",
            "to": "/docs/index",
            "icon": "fa fa-user"
        },

        {
            "label": "Nav 2",
            "to": "/docs/api"
        },

        {
            "label": "Nav 3",
            "to": "/docs/renderers"
        }
    ]
}
```
