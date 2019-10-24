## CRUD

增删改查模型，主要用来展现列表，并支持各类【增】【删】【改】【查】的操作。

CRUD 支持三种模式：`table`、`cards`、`list`，默认为 `table`。

| 属性名                                | 类型                           | 默认值                          | 说明                                                                                                                  |
|---------------------------------------|--------------------------------|---------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| type                                  | `string`                       |                                 | `type` 指定为 CRUD 渲染器                                                                                             |
| mode                                  | `string`                       | `"table"`                       | `"table" 、 "cards" 或者 "list"`                                                                                      |
| title                                 | `string`                       | `""`                            | 可设置成空，当设置成空时，没有标题栏                                                                                  |
| className                             | `string`                       |                                 | 表格外层 Dom 的类名                                                                                                   |
| [api](#api)                           | [Api](./Types.md#Api)          |                                 | CRUD 用来获取列表数据的 api。                                                                                         |
| loadDataOnce                          | `boolean`                      |                                 | 是否一次性加载所有数据（前端分页）                                                                                    |
| source                                | `string`                       |                                 | 数据映射接口返回某字段的值，不设置会默认把接口返回的`items`或者`rows`填充进`mode`区域                                 |
| filter                                | [Form](./Form/Form.md)         |                                 | 设置过滤器，当该表单提交后，会把数据带给当前 `mode` 刷新列表。                                                        |
| filterTogglable                       | `boolean`                      | `false`                         | 是否可显隐过滤器                                                                                                      |
| filterDefaultVisible                  | `boolean`                      | `true`                          | 设置过滤器默认是否可见。                                                                                              |
| initFetch                             | `boolean`                      | `true`                          | 是否初始化的时候拉取数据, 只针对有 filter 的情况, 没有 filter 初始都会拉取数据                                        |
| interval                              | `number`                       | `3000`                          | 刷新时间(最低 3000)                                                                                                   |
| silentPolling                         | `boolean`                      | `false`                         | 配置刷新时是否隐藏加载动画                                                                                            |
| stopAutoRefreshWhen                   | `string`                       | `""`                            | 通过[表达式](./Types.md#表达式)来配置停止刷新的条件                                                                   |
| stopAutoRefreshWhenModalIsOpen        | `boolean`                      | `false`                         | 当有弹框时关闭自动刷新，关闭弹框又恢复                                                                                |
| syncLocation                          | `boolean`                      | `true`                          | 是否将过滤条件的参数同步到地址栏                                                                                      |
| draggable                             | `boolean`                      | `false`                         | 是否可通过拖拽排序                                                                                                    |
| itemDraggableOn                       | `boolean`                      |                                 | 用[表达式](./Types.md#表达式)来配置是否可拖拽排序                                                                     |
| [saveOrderApi](#saveOrderApi)         | [Api](./Types.md#Api)          |                                 | 保存排序的 api。                                                                                                      |
| [quickSaveApi](#quickSaveApi)         | [Api](./Types.md#Api)          |                                 | 快速编辑后用来批量保存的 API。                                                                                        |
| [quickSaveItemApi](#quickSaveItemApi) | [Api](./Types.md#Api)          |                                 | 快速编辑配置成及时保存时使用的 API。                                                                                  |
| bulkActions                           | Array Of [Action](./Action.md) |                                 | 批量操作列表，配置后，表格可进行选中操作。                                                                            |
| defaultChecked                        | `boolean`                      | `false`                         | 当可批量操作时，默认是否全部勾选。                                                                                    |
| messages                              | `Object`                       |                                 | 覆盖消息提示，如果不指定，将采用 api 返回的 message                                                                   |
| messages.fetchFailed                  | `string`                       |                                 | 获取失败时提示                                                                                                        |
| messages.saveOrderFailed              | `string`                       |                                 | 保存顺序失败提示                                                                                                      |
| messages.saveOrderSuccess             | `string`                       |                                 | 保存顺序成功提示                                                                                                      |
| messages.quickSaveFailed              | `string`                       |                                 | 快速保存失败提示                                                                                                      |
| messages.quickSaveSuccess             | `string`                       |                                 | 快速保存成功提示                                                                                                      |
| primaryField                          | `string`                       | `"id"`                          | 设置 ID 字段名。                                                                                                      |
| defaultParams                         | `Object`                       |                                 | 设置默认 filter 默认参数，会在查询的时候一起发给后端                                                                  |
| pageField                             | `string`                       | `"page"`                        | 设置分页页码字段名。                                                                                                  |
| perPageField                          | `string`                       | `"perPage"`                     | 设置分页一页显示的多少条数据的字段名。注意：最好与 defaultParams 一起使用，请看下面例子。                             |
| perPageAvailable                      | `Array<number>`                | `[5, 10, 20, 50, 100]`          | 设置一页显示多少条数据下拉框可选条数。                                                                                |
| orderField                            | `string`                       |                                 | 设置用来确定位置的字段名，设置后新的顺序将被赋值到该字段中。                                                          |
| hideQuickSaveBtn                      | `boolean`                      | `false`                         | 隐藏顶部快速保存提示                                                                                                  |
| autoJumpToTopOnPagerChange            | `boolean`                      | `false`                         | 当切分页的时候，是否自动跳顶部。                                                                                      |
| syncResponse2Query                    | `boolean`                      | `true`                          | 将返回数据同步到过滤器上。                                                                                            |
| keepItemSelectionOnPageChange         | `boolean`                      | `true`                          | 保留条目选择，默认分页、搜素后，用户选择条目会被清空，开启此选项后会保留用户选择，可以实现跨页面批量操作。            |
| labelTpl                              | `string`                       |                                 | 单条描述模板，`keepItemSelectionOnPageChange`设置为`true`后会把所有已选择条目列出来，此选项可以用来定制条目展示文案。 |
| headerToolbar                         | Array                          | `['bulkActions', 'pagination']` | 顶部工具栏配置                                                                                                        |
| footerToolbar                         | Array                          | `['statistics', 'pagination']`  | 顶部工具栏配置                                                                                                        |



### 接口说明

开始之前请你先阅读[整体要求](../api.md)。

#### api

用来返回列表数据。


**发送：**

可能会包含以下信息。

* `page` 页码，从 `1` 开始,  表示当前请求第几页的信息。 字段名对应 `pageField` 如果配成这样 `{pageField: "pn"}` 发送的时候字段名会变成类似 `/api/xxx?pn=1`。
* `perPage` 每页多少条数据，默认假定是 10. 如果想修改请配置 `defaultParams: {perPage: 20}`。 另外字段名对应 `perPageField` 的配置。
* `orderBy` 用来告知以什么方式排序。字段名对应 `orderField`
* `orderDir`  不是 `asc` 就是 `desc`。分别表示正序还是倒序。

另外如果 CRUD 配置了 Filter，即过滤器表单，表单里面的数据也会自动 merge 到这个请求里面。前提是：你没有干预接口参数。

什么意思？来个对比 `/api/xxxx` 和 `/api/xxxx?a=${a}`。第二个配置方式就是干预了，如果你配置接口的时候有明确指定要发送什么参数，那么 amis 则不再默认把所有你可能要的参数都发过去了。这个时候如果想要接收原来的那些参数，你需要进一步配置 api，把你需要的参数写上如：`/api/xxxx?a=${a}&page=${page}&perPage=${perPage}`


**响应：**

常规返回格式如下：


```json
{
  "status": 0,
  "msg": "",
  "data": {
    "items": [
        { // 每个成员的数据。
            "id": 1,
            "xxx": "xxxx"
        }
    ],

    "total": 200 // 注意这里不是当前请求返回的 items 的长度，而是一共有多少条数据，用于生成分页，
    // 如果你不想要分页，把这个不返回就可以了。
  }
}
```

如果无法知道数据总条数，只能知道是否有下一页，请返回如下格式，AMIS 会简单生成一个简单版本的分页控件。

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "items": [
        { // 每个成员的数据。
            "id": 1,
            "xxx": "xxxx"
        }
    ],

    "hasNext": true // 是否有下一页。
  }
}
```

如果不需要分页，或者配置了 loadDataOnce 则可以忽略掉 `total` 和 `hasNext` 参数。


#### saveOrderApi

用来保存新的顺序，配置了 draggable 后会通过这个接口保存结果。

**发送：**

发送方式默认为 `POST` 会包含以下信息。

* `ids` 字符串如： `2,3,1,4,5,6` 用 id 来记录新的顺序。 前提是你的列表接口返回了 id 字段。另外如果你的 primaryField 不是 `id`，则需要配置如： `primaryField: "order_id"`。注意：无论你配置成什么 primayField，这个字段名始终是 ids。
* `rows` `Array<Item>` 数组格式，新的顺序，数组里面包含所有原始信息。
* `insertAfter` 或者 `insertBefore`  这是 amis 生成的 diff 信息，对象格式，key 为目标成员的 primaryField 值，即 id，value 为数组，数组中存放成员 primaryField 值。如： 

    ```json
    {
        "insertAfter": {
            "2": ["1", "3"],
            "6": ["4", "5"]
        }
    }
    ```

    表示：成员 1 和成员 3 插入到了成员 2 的后面。成员 4 和 成员 5 插入到了 成员 6 的后面。

发送数据多了？amis 只能猜你可能需要什么格式化的数据，api 不是可以配置数据映射吗？你可以通过 data 指定只发送什么如：

```json
{
    "saveOrderApi": {
        "url": "/api/xxxx",
        "data": {
            "ids": "${ids}"
        }
    }
}
```

这样就只会发送 ids 了。

**响应：**

响应没有什么特殊要求，只关注 status 状态。data 中返回了数据也不会影响结果集。默认调用完保存顺序接口会自动再调用一次 api 接口用来刷新数据。

#### quickSaveApi

用来保存快速编辑结果，当 crud 的列配置快速保存时会调用进来。

**发送：**

发送方式默认为 `POST` 会包含以下信息。

* `ids` `String` 如： `"1,2"` 用来说明这次快速保存涉及了哪些成员。
* `indexes` `Array<number>` 通过序号的方式告知更新了哪些成员。
* `rows` `Array<Object>` 修改过的成员集合，数组对象是在原有数据的基础上更新后的结果。
* `rowsDiff` `Array<Object>` 跟 `rows` 不一样的地方是这里只包含本次修改的数据。
* `rowsOrigin` `Array<Object>` 跟 `rows` 不一样的地方是这里是修改前段原始数据。
* `unModifiedItems` `Array<Object>` 其他没有修改的成员集合。

默认发送的数据有点多，不过可以通过api的数据映射自己选择需要的部分。


**响应：**

响应没有什么特殊要求，只关注 status 状态。


#### quickSaveItemApi

跟 quickSaveApi 不一样的地方在于当你配置快速保存为立即保存的时候，优先使用此接口。因为只会保存单条数据，所以发送格式会不一样，直接就是整个更新后的成员数据。

**发送：**

`POST` payload 中就是更新后的成员数据。

**响应：**

响应没有什么特殊要求，只关注 status 状态。

### 单条操作

当操作对象是单条数据时这类操作叫单条操作，比如：编辑、删除、通过、拒绝等等。CRUD 的 table 模式可以在 column 通过放置按钮来完成（其他模式参考 table 模式）。比如编辑就是添加个按钮行为是弹框类型的按钮或者添加一个页面跳转类型的按钮把当前行数据的 id 放在 query 中传过去、删除操作就是配置一个按钮行为是 AJAX 类型的按钮，将数据通过 api 发送给后端完成。

CRUD 中不限制有多少个单条操作、添加一个操作对应的添加一个按钮就行了。CRUD 在处理按钮行为的时候会把当前行的完整数据传递过去，如果你的按钮行为是弹出时，还会包含一下信息：

* `hasNext` `boolean` 当按钮行为是弹框时，还会携带这个数据可以用来判断当前页中是否有下一条数据。
* `hasPrev` `boolean` 当按钮行为是弹框时，还会携带这个数据可以判断用来当前页中是否有上一条数据。
* `index`  `number` 当按钮行为是弹框时，还会携带这个数据可以用来获取当前行数据在这一页中的位置。
* `prevIndex` `number`
* `nextIndex` `number`


如果你的按钮类型是 AJAX，你也可以限定只发送部分数据比如。

```json
{
    "type": "button",
    "label": "删除",
    "actionType": "ajax",
    "api": "delete:/api/xxxx/$id",
    "confirmText": "确定要删除？"
}
```

上面这个例子就会发送 id 字段了，如果想要全部发送过去同时还想添加点别的字段就这样：

```json
{
    "type": "button",
    "label": "删除",
    "actionType": "ajax",
    "api": {
        "method": "post",
        "url": "/api/xxxx/$id",
        "data": {
            "&": "$$",
            "op": "delete"
        }
    },
    "confirmText": "确定要删除？"
}
```

这取决于 api 怎么配置，关于 api 的配置说明请[前往这](./Types.md#api)。

### 批量操作

当操作对象是多条数据时这类操作叫批量操作、跟单条操作类似，将按钮放在 crud 的 `bulkActions` 中即可, 添加 bulkActions 后列表会自动出现选择框。CRUD 会准备以下数据供按钮行为使用。

* `items` `Array<object>` 选中的行数据。
* `rows` items 的别名，推荐用 items。
* `unselectedItems` `Array<object>` 没选中的行数据也可获取。
* `ids` `Array<number|string>` 前提是行数据中有 id 字段，或者有指定的 `primaryField` 字段。
* `...第一行所有行数据` 还有第一行的所有行数据也会包含进去。

### 快速编辑

列信息中可以配置 quickEdit 属性来启动快速编辑功能、开启后当鼠标hover到对应的行时，会出现一个编辑的小图标，点开后弹出表单项完成编辑。保存的结果不会立即发送 api 完成保存，除非你配置了立即保存，当所有的编辑都完成了，可以点击表格顶部的提交按钮，crud 将通过 quickSaveApi 通知后端完成保存。更多信息请看 quickSaveApi 和 quickSaveItemApi 的说明。