## Alert

用来做文字特殊提示，分为四类：提示类、成功类、警告类和危险类。

| 属性名 | 类型 | 默认值 | 说明 |
| --------- | --------- | ------------------------------------------------ | ------------------- |
| type | `string`  | `"alert"` | 指定为 alert 渲染器 |
| className | `string`  | | 外层 Dom 的类名 |
| level | `string`  | `info` | 级别，可以是：`info`、`success`、`warning` 或者 `danger` |
| showCloseButton | `boolean` | false | 是否显示关闭按钮 |

```schema:height="120" scope="body"
{
    "type": "alert",
    "body": "这是一段提示",
    "level": "warning"
}
```

可结合 `visibleOn` 用来做错误信息提示。


```schema:height="120"
{
    "type": "page",
    "data": {
        "errMsg": "这是错误提示详情"
    },
    "body": {
        "type": "alert",
        "visibleOn": "this.errMsg",
        "body": "${errMsg}",
        "level": "danger",
        "showCloseButton": true
    }
}
```