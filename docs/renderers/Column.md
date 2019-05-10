### Column

表格中的列配置

-   `type` 默认为 `text`，支持： `text`、`html`、`tpl`、`image`、`progress`、`status`、`date`、`datetime`、`time`、`json`、`mapping`参考 [Field 说明](./Field.md)和[Operation](./Operation.md)。
-   `name` 用来关联列表数据中的变量 `key`。
-   `label` 列标题。
-   `copyable` 开启后，会支持内容点击复制。
-   `width` 列宽度。
-   `popOver` 是否支持点击查看详情。当内容较长时，可以开启此配置。
-   `quickEdit` 配置后在内容区增加一个编辑按钮，点击后弹出一个编辑框。
-   `toggled` 控制默认是展示还是不展示，只有 Table 的 `columnsTogglable` 开启了才有效。
