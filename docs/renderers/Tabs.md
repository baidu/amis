## Tabs

| 属性名            | 类型                    | 默认值                              | 说明                                                     |
| ----------------- | ----------------------- | ----------------------------------- | -------------------------------------------------------- |
| type              | `string`                | `"tabs"`                            | 指定为 Tabs 渲染器                                       |
| className         | `string`                |                                     | 外层 Dom 的类名                                          |
| tabsClassName     | `string`                |                                     | Tabs Dom 的类名                                          |
| tabs              | `Array`                 |                                     | tabs 内容                                                |
| tabs[x].title     | `string`                |                                     | Tab 标题                                                 |
| tabs[x].icon      | `icon`                  |                                     | Tab 的图标                                               |
| tabs[x].tab       | [Container](#container) |                                     | 内容区                                                   |
| tabs[x].hash      | `string`                |                                     | 设置以后将跟 url 的 hash 对应                            |
| tabs[x].reload    | `boolean`               |                                     | 设置以后内容每次都会重新渲染，对于 crud 的重新拉取很有用 |
| tabs[x].className | `string`                | `"bg-white b-l b-r b-b wrapper-md"` | Tab 区域样式                                             |

```schema:height="300" scope="body"
{
    "type": "tabs",
    "tabs": [
        {
            "title": "Tab 1",
            "tab": "Content 1"
        },

        {
            "title": "Tab 2",
            "tab": "Content 2"
        }
    ]
}
```
