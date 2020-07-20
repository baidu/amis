## JSON

可以用来显示深层嵌套的 JSON 内容。

| 属性名      | 类型     | 默认值       | 说明                                           |
| ----------- | -------- | ------------ | ---------------------------------------------- |
| type        | `string` | `"json"`     | 指定为 JSON 渲染器                             |
| name        | `string` |              | 用于 CRUD 或 Form 中，通过这个 name 来获取数值 |
| jsonTheme   | `string` | `"twilight"` | 颜色主题，还有一个是 `"eighties"`              |
| levelExpand | `number` | 1            | 默认展开的层级                                 |

```schema:height="150" scope="body"
{
    "type": "json",
    "levelExpand": 2,
    "value": {
        "name": "amis",
        "source": {
            "github": "https://github.com/baidu/amis"
        }
    }
}

```
