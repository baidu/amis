### CRUD

增删改查模型，主要用来展现列表，并支持各类【增】【删】【改】【查】的操作。复杂示例请前往 [Demo](/docs/demo/crud/table)。

CRUD 支持三种模式：`table`、`cards`、`list`，默认为 `table`。

| 属性名                    | 类型                           | 默认值                          | 说明                                                                                      |
| ------------------------- | ------------------------------ | ------------------------------- | ----------------------------------------------------------------------------------------- |
| type                      | `string`                       |                                 | `"crud"` 指定为 CRUD 渲染器                                                               |
| mode                      | `string`                       | `"table"`                       | `"table" 、 "cards" 或者 "list"`                                                          |
| title                     | `string`                       | `""`                            | 可设置成空，当设置成空时，没有标题栏                                                      |
| className                 | `string`                       |                                 | 表格外层 Dom 的类名                                                                       |
| api                       | [Api](./Types#Api)             |                                 | CRUD 用来获取列表数据的 api。                                                             |
| filter                    | [Form](./Form.md)              |                                 | 设置过滤器，当该表单提交后，会把数据带给当前 crud 刷新列表。                              |
| initFetch                 | `boolean`                      | `true`                          | 是否初始化的时候拉取数据, 只针对有 filter 的情况, 没有 filter 初始都会拉取数据            |
| interval                  | `number`                       | `3000`                          | 刷新时间(最低 3000)                                                                       |
| silentPolling             | `boolean`                      | `false`                         | 配置刷新时是否显示加载动画                                                                |
| stopAutoRefreshWhen       | `string`                       | `""`                            | 通过[表达式](./Types.md#表达式)来配置停止刷新的条件                                       |
| syncLocation              | `boolean`                      | `true`                          | 是否将过滤条件的参数同步到地址栏                                                          |
| draggable                 | `boolean`                      | `false`                         | 是否可通过拖拽排序                                                                        |
| itemDraggableOn           | `boolean`                      |                                 | 用[表达式](./Types.md#表达式)来配置是否可拖拽排序                                         |
| saveOrderApi              | [Api](./Types#Api)             |                                 | 保存排序的 api。                                                                          |
| quickSaveApi              | [Api](./Types#Api)             |                                 | 快速编辑后用来批量保存的 API。                                                            |
| quickSaveItemApi          | [Api](./Types#Api)             |                                 | 快速编辑配置成及时保存时使用的 API。                                                      |
| bulkActions               | Array Of [Action](./action.md) |                                 | 批量操作列表，配置后，表格可进行选中操作。                                                |
| defaultChecked            | `boolean`                      | `false`                         | 当可批量操作时，默认是否全部勾选。                                                        |
| messages                  | `Object`                       |                                 | 覆盖消息提示，如果不指定，将采用 api 返回的 message                                       |
| messages.fetchFailed      | `string`                       |                                 | 获取失败时提示                                                                            |
| messages.saveOrderFailed  | `string`                       |                                 | 保存顺序失败提示                                                                          |
| messages.saveOrderSuccess | `string`                       |                                 | 保存顺序成功提示                                                                          |
| messages.quickSaveFailed  | `string`                       |                                 | 快速保存失败提示                                                                          |
| messages.quickSaveSuccess | `string`                       |                                 | 快速保存成功提示                                                                          |
| primaryField              | `string`                       | `"id"`                          | 设置 ID 字段名。                                                                          |
| defaultParams             | `Object`                       |                                 | 设置默认 filter 默认参数，会在查询的时候一起发给后端                                      |
| pageField                 | `string`                       | `"page"`                        | 设置分页页码字段名。                                                                      |
| perPageField              | `string`                       | `"perPage"`                     | 设置分页一页显示的多少条数据的字段名。注意：最好与 defaultParams 一起使用，请看下面例子。 |
| orderField                | `string`                       |                                 | 设置用来确定位置的字段名，设置后新的顺序将被赋值到该字段中。                              |
| headerToolbar             | Array                          | `['bulkActions', 'pagination']` | 顶部工具栏配置                                                                            |
| footerToolbar             | Array                          | `['statistics', 'pagination']`  | 顶部工具栏配置                                                                            |
