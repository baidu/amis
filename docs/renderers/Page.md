## Page

页面渲染器，他主要包含标题，副标题，提示信息等设置，需要注意的是，他有三个容器区域分别是：内容区、边栏区和工具条区，在容器里面放不同的渲染器，就能配置出不同的页面来。

可以配置 `initApi` 从远端拉取数据，拉取的数据可以在整个页面级别使用。

```schema:height="200"
{
  "type": "page",
  "title": "Title",
  "subTitle": "SubTitle",
  "remark": "Remark",
  "aside": "Aside",
  "body": "时间: ${date | date}",
  "toolbar": "Toolbar",
  "initApi": "/api/mock2/service/data"
}
```

> PS: 代码支持及时编辑预览

| 属性名              | 类型                              | 默认值                                     | 说明                                                                                |
| ------------------- | --------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| type                | `string`                          | `"page"`                                   | 指定为 Page 渲染器。                                                                |
| title               | `string`                          |                                            | 页面标题                                                                            |
| subTitle            | `string`                          |                                            | 页面副标题                                                                          |
| remark              | `string`                          |                                            | 标题附近会出现一个提示图标，鼠标放上去会提示该内容。                                |
| aside               | [Container](./Types.md#Container) |                                            | 往页面的边栏区域加内容                                                              |
| toolbar             | [Container](./Types.md#Container) |                                            | 往页面的右上角加内容，需要注意的是，当有 Title 是，区域在右上角，没有时区域就在顶部 |
| body                | [Container](./Types.md#Container) |                                            | 往页面的内容区域加内容                                                              |
| className           | `string`                          |                                            | 外层 dom 类名                                                                       |
| toolbarClassName    | `string`                          | `v-middle wrapper text-right bg-light b-b` | Toolbar dom 类名                                                                    |
| bodyClassName       | `string`                          | `wrapper`                                  | Body dom 类名                                                                       |
| asideClassName      | `string`                          | `w page-aside-region bg-auto`              | Aside dom 类名                                                                      |
| headerClassName     | `string`                          | `bg-light b-b wrapper`                     | Header 区域 dom 类名                                                                |
| initApi             | [Api](./Types.md#Api)             |                                            | Page 用来获取初始数据的 api。返回的数据可以整个 page 级别使用。                     |
| initFetch           | `boolean`                         | `true`                                     | 是否起始拉取 initApi                                                                |
| initFetchOn         | `string`                          |                                            | 是否起始拉取 initApi, 通过表达式配置                                                |
| interval            | `number`                          | `3000`                                     | 刷新时间(最低 3000)                                                                 |
| silentPolling       | `boolean`                         | `false`                                    | 配置刷新时是否显示加载动画                                                          |
| stopAutoRefreshWhen | `string`                          | `""`                                       | 通过[表达式](./Types.md#表达式)来配置停止刷新的条件                                 |


### 接口说明

开始之前请你先阅读[整体要求](../api.md)。

#### initApi

Page 渲染器可以配置 initApi 来拉取后端数据。

**发送：**

默认不发送任何参数，如果有需要，在这可以取地址栏上的参数，假如地址栏携带了 id=1 这个参数, 那么接口这么配置就能把 id 作为 query 参数发送给后端。

```json
{
  "initApi": "/api/xxx?id=${id}"
}
```

**响应：**

data 返回是对象即可。

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "a": 1
  }
}
```

当配置了 initApi 且返回如上数据后，当前 page 渲染器，以及所有孩子渲染器都能取到这个这个变量了如：


```json
{
  "type": "page",
  "initApi": "/api/xxx",
  "body": "${a}"
}
```