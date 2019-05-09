## Page

Json 配置最外层是一个 `Page` 渲染器。他主要包含标题，副标题，提示信息等设置，需要注意的是，他有三个容器区域分别是：内容区、边栏区和工具条区，在容器里面放不同的渲染器，就能配置出不同的页面来。

```schema:height="200"
{
  "type": "page",
  "title": "Title",
  "subTitle": "SubTitle",
  "remark": "Remark",
  "aside": "Aside",
  "body": "Body",
  "toolbar": "Toolbar"
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
