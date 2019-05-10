### Static

纯用来展现数据的。

-   `type` 请设置成 `static`
-   `name` 变量名。
-   `value` 值，可以通过它设置默认值。
-   `label` 描述标题，当表单为水平布局时，左边即便是不设置 label 为了保持对齐也会留空，如果想要去掉空白，请设置成 `false`。
-   `description` 描述内容。
-   `placeholder` 占位内容，默认 `-`。
-   `inline` 是否为 inline 模式。
-   `className` 表单最外层类名。
-   `visible` 是否可见。
-   `visibleOn` 通过[表达式](./Types.md#表达式)来配置当前表单项是否显示。
-   `hidden` 是否隐藏，不要跟 `visible` `visibleOn` 同时配置
-   `hiddenOn` 通过[表达式](./Types.md#表达式)来配置当前表单项是否隐藏。
-   `inputClassName` 表单控制器类名。
-   `labelClassName` label 的类名。
-   `tpl` 如果想一次展示多条数据，可以考虑用 `tpl`，模板引擎是 lodash template，同时你还可以简单用 `$` 取值。 具体请查看 [tpl](./Tpl.md)

```schema:height="250" scope="form-item"
{
  "type": "static",
  "name": "select",
  "label": "Label",
  "value": "A"
}
```

### Static-XXX

-   `type` 请设置成 `static-tpl`、`static-plain`、`static-json`、`static-date`、`static-datetime`、`static-time`、`static-mapping`、`static-image`、`static-progress`、`static-status`或者`static-switch`

纯用来展示数据的，用法跟 crud 里面的[Column](.Column.md)一样, 且支持 quickEdit 和 popOver 功能。

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
