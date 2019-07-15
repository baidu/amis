## Service

功能型容器，自身不负责展示内容，主要职责在于通过配置的 api 拉取数据，数据可用于子组件。
该组件初始化时就会自动拉取一次数据，后续如果需要刷新，请结合 Action 实现，可以把 Action 的 actionType 设置为 reload, target 为该组件的 name 值。
同时该组件，还支持 api 数值自动监听，比如 `getData?type=$type` 只要当前环境 type 值发生变化，就会自动重新拉取。

| 属性名                | 类型                              | 默认值         | 说明                                                                |
| --------------------- | --------------------------------- | -------------- | ------------------------------------------------------------------- |
| type                  | `string`                          | `"service"`    | 指定为 service 渲染器                                               |
| className             | `string`                          |                | 外层 Dom 的类名                                                     |
| body                  | [Container](./Types.md#container) |                | 内容容器                                                            |
| api                   | [api](./Types.md#Api)             |                | 数据源 API 地址                                                     |
| initFetch             | `boolean`                         |                | 是否默认拉取                                                        |
| schemaApi             | [api](./Types.md#Api)             |                | 用来获取远程 Schema 的 api                                          |
| initFetchSchema       | `boolean`                         |                | 是否默认拉取 Schema                                                 |
| messages              | `Object`                          |                | 消息提示覆写，默认消息读取的是 API 返回的消息，但是在此可以覆写它。 |
| messages.fetchSuccess | `string`                          |                | 获取成功时提示                                                      |
| messages.fetchFailed  | `string`                          | `"初始化失败"` | 获取失败时提示                                                      |
| interval              | `number`                          | `3000`         | 刷新时间(最低 3000)                                                 |
| silentPolling         | `boolean`                         | `false`        | 配置刷新时是否显示加载动画                                          |
| stopAutoRefreshWhen   | `string`                          | `""`           | 通过[表达式](./Types.md#表达式)来配置停止刷新的条件                 |

```schema:height="200" scope="body"
{
    "type": "service",
    "api": "/api/mock2/page/initData",
    "body": {
        "type": "panel",
        "title": "$title",
        "body": "现在是：${date}"
    }
}
```


### 动态配置

Service 还有个重要的功能就是支持配置 `schemaApi`，通过它可以实现动态渲染。

```schema:height="200" scope="body"
{
  "name": "service1",
  "type": "service",
  "className": "m-t",
  "schemaApi": "/api/mock2/service/schema?type=tabs"
}
```