### Static-XXX

-   `type` 请设置成 `static-tpl`、`static-plain`、`static-json`、`static-date`、`static-datetime`、`static-time`、`static-mapping`、`static-image`、`static-progress`、`static-status`或者`static-switch`

纯用来展示数据的，用法跟 crud 里面的[Column](#column)一样, 且支持 quickEdit 和 popOver 功能。

```schema:height="250" scope="form-item"
{
  "type": "static-json",
  "name": "json",
  "label": "Label",
  "value": {
    "a":"dd",
    "b":"asdasd"
  }
}
```
