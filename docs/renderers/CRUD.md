### CRUD

增删改查模型，主要用来展现列表，并支持各类【增】【删】【改】【查】的操作。

CRUD 支持三种模式：`table`、`cards`、`list`，默认为 `table`。

| 属性名                         | 类型                           | 默认值                          | 说明                                                                                                                  |
| ------------------------------ | ------------------------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| type                           | `string`                       |                                 | `"Action.md"` 指定为 CRUD 渲染器                                                                                      |
| mode                           | `string`                       | `"table"`                       | `"table" 、 "cards" 或者 "list"`                                                                                      |
| title                          | `string`                       | `""`                            | 可设置成空，当设置成空时，没有标题栏                                                                                  |
| className                      | `string`                       |                                 | 表格外层 Dom 的类名                                                                                                   |
| api                            | [Api](./Types.md#Api)          |                                 | CRUD 用来获取列表数据的 api。                                                                                         |
| filter                         | [Form](./Form.md)              |                                 | 设置过滤器，当该表单提交后，会把数据带给当前 Action.md 刷新列表。                                                     |
| filterTogglable                | `boolean`                      | `false`                         | 是否可显隐过滤器                                                                                                      |
| filterDefaultVisible           | `boolean`                      | `true`                          | 设置过滤器默认是否可见。                                                                                              |
| initFetch                      | `boolean`                      | `true`                          | 是否初始化的时候拉取数据, 只针对有 filter 的情况, 没有 filter 初始都会拉取数据                                        |
| interval                       | `number`                       | `3000`                          | 刷新时间(最低 3000)                                                                                                   |
| silentPolling                  | `boolean`                      | `false`                         | 配置刷新时是否隐藏加载动画                                                                                            |
| stopAutoRefreshWhen            | `string`                       | `""`                            | 通过[表达式](./Types.md#表达式)来配置停止刷新的条件                                                                   |
| stopAutoRefreshWhenModalIsOpen | `boolean`                      | `false`                         | 当有弹框时关闭自动刷新，关闭弹框又恢复                                                                                |
| syncLocation                   | `boolean`                      | `true`                          | 是否将过滤条件的参数同步到地址栏                                                                                      |
| draggable                      | `boolean`                      | `false`                         | 是否可通过拖拽排序                                                                                                    |
| itemDraggableOn                | `boolean`                      |                                 | 用[表达式](./Types.md#表达式)来配置是否可拖拽排序                                                                     |
| saveOrderApi                   | [Api](./Types.md#Api)          |                                 | 保存排序的 api。                                                                                                      |
| quickSaveApi                   | [Api](./Types.md#Api)          |                                 | 快速编辑后用来批量保存的 API。                                                                                        |
| quickSaveItemApi               | [Api](./Types.md#Api)          |                                 | 快速编辑配置成及时保存时使用的 API。                                                                                  |
| bulkActions                    | Array Of [Action](./Action.md) |                                 | 批量操作列表，配置后，表格可进行选中操作。                                                                            |
| defaultChecked                 | `boolean`                      | `false`                         | 当可批量操作时，默认是否全部勾选。                                                                                    |
| messages                       | `Object`                       |                                 | 覆盖消息提示，如果不指定，将采用 api 返回的 message                                                                   |
| messages.fetchFailed           | `string`                       |                                 | 获取失败时提示                                                                                                        |
| messages.saveOrderFailed       | `string`                       |                                 | 保存顺序失败提示                                                                                                      |
| messages.saveOrderSuccess      | `string`                       |                                 | 保存顺序成功提示                                                                                                      |
| messages.quickSaveFailed       | `string`                       |                                 | 快速保存失败提示                                                                                                      |
| messages.quickSaveSuccess      | `string`                       |                                 | 快速保存成功提示                                                                                                      |
| primaryField                   | `string`                       | `"id"`                          | 设置 ID 字段名。                                                                                                      |
| defaultParams                  | `Object`                       |                                 | 设置默认 filter 默认参数，会在查询的时候一起发给后端                                                                  |
| pageField                      | `string`                       | `"page"`                        | 设置分页页码字段名。                                                                                                  |
| perPageField                   | `string`                       | `"perPage"`                     | 设置分页一页显示的多少条数据的字段名。注意：最好与 defaultParams 一起使用，请看下面例子。                             |
| perPageAvailable               | `Array<number>`                | `[5, 10, 20, 50, 100]`          | 设置一页显示多少条数据下拉框可选条数。                                                                                |
| orderField                     | `string`                       |                                 | 设置用来确定位置的字段名，设置后新的顺序将被赋值到该字段中。                                                          |
| hideQuickSaveBtn               | `boolean`                      | `false`                         | 隐藏顶部快速保存提示                                                                                                  |
| autoJumpToTopOnPagerChange     | `boolean`                      | `false`                         | 当切分页的时候，是否自动跳顶部。                                                                                      |
| syncResponse2Query             | `boolean`                      | `true`                          | 将返回数据同步到过滤器上。                                                                                            |
| keepItemSelectionOnPageChange  | `boolean`                      | `true`                          | 保留条目选择，默认分页、搜素后，用户选择条目会被清空，开启此选项后会保留用户选择，可以实现跨页面批量操作。            |
| labelTpl                       | `string`                       |                                 | 单条描述模板，`keepItemSelectionOnPageChange`设置为`true`后会把所有已选择条目列出来，此选项可以用来定制条目展示文案。 |
| headerToolbar                  | Array                          | `['bulkActions', 'pagination']` | 顶部工具栏配置                                                                                                        |
| footerToolbar                  | Array                          | `['statistics', 'pagination']`  | 顶部工具栏配置                                                                                                        |
