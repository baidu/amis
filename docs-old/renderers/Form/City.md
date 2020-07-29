### City

城市选择器，可用于让用户输入城市。

-   `type` 请设置成 `city`
-   `allowDistrict` 默认 `true` 允许输入区域
-   `allowCity`  默认 `true` 允许输入城市
-   `extractValue`  默认 `true` 是否抽取值，如果设置成 `false` 值格式会变成对象，包含 `code`、`province`、`city` 和 `district` 文字信息。
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="200" scope="form"
[
    {
      "name": "city",
      "type": "city",
      "label": "城市选择"
    },

    {
        "type": "static",
        "name": "city",
        "label": "当前值"
    }
]
```

从配置项可以看出来，通过设置 `allowDistrict` 和 `allowCity` 是可以限制用户输入级别的，比如只选择省份。

```schema:height="200" scope="form"
[
    {
      "name": "city",
      "type": "city",
      "label": "城市选择",
      "allowDistrict": false,
      "allowCity": false
    },

    {
        "type": "static",
        "name": "city",
        "label": "当前值"
    }
]
```

从上面的例子可以看出来，值默认格式是编码（即 `code`），如果你想要详细点的信息，可以把 `extractValue` 设置成 `false`。

```schema:height="200" scope="form"
[
    {
      "name": "city",
      "type": "city",
      "label": "城市选择",
      "extractValue": false
    },

    {
        "type": "static",
        "name": "city",
        "label": "当前值"
    }
]
```