## Form

表单渲染器，主要用来展示或者接收用户输入后将数据提交给后端或者其他组件。

```schema:height="360"
{
  "type": "page",
  "body": {
    "type": "form",
    "name": "sample1",
    "api": "/api/mock2/form/saveForm?waitSeconds=1",
    "controls": [
      {
        "name": "email",
        "label": "Email",
        "type": "email",
        "description": "描述文字"
      },
      {
        "name": "text",
        "type": "text",
        "label": "Text"
      }
    ]
  }
}
```

| 属性名                | 类型                                 | 默认值                                                                 | 说明                                                                                                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| type                  | `string`                             |                                                                        | `"form"` 指定为 Form 渲染器                                                                                                                                                                                                                                                                                                                                  |
| mode                  | `string`                             | `normal`                                                               | 表单展示方式，可以是：`normal`、`horizontal` 或者 `inline`                                                                                                                                                                                                                                                                                                   |
| horizontal            | `Object`                             | `{"left":"col-sm-2", "right":"col-sm-10", "offset":"col-sm-offset-2"}` | 当 mode 为 `horizontal` 时有用，用来控制 label                                                                                                                                                                                                                                                                                                               |
| title                 | `string`                             | `"表单"`                                                               | Form 的标题                                                                                                                                                                                                                                                                                                                                                  |
| submitText            | `String`                             | `"提交"`                                                               | 默认的提交按钮名称，如果设置成空，则可以把默认按钮去掉。                                                                                                                                                                                                                                                                                                     |
| className             | `string`                             |                                                                        | 外层 Dom 的类名                                                                                                                                                                                                                                                                                                                                              |
| controls              | `Array` of [FormItem](./FormItem.md) |                                                                        | Form 表单项集合                                                                                                                                                                                                                                                                                                                                              |
| actions               | `Array` of [Action](./Action.md)     |                                                                        | Form 提交按钮，成员为 Action                                                                                                                                                                                                                                                                                                                                 |
| messages              | `Object`                             |                                                                        | 消息提示覆写，默认消息读取的是 API 返回的消息，但是在此可以覆写它。                                                                                                                                                                                                                                                                                          |
| messages.fetchSuccess | `string`                             |                                                                        | 获取成功时提示                                                                                                                                                                                                                                                                                                                                               |
| messages.fetchFailed  | `string`                             |                                                                        | 获取失败时提示                                                                                                                                                                                                                                                                                                                                               |
| messages.saveFailed   | `string`                             |                                                                        | 保存成功时提示                                                                                                                                                                                                                                                                                                                                               |
| messages.saveSuccess  | `string`                             |                                                                        | 保存失败时提示                                                                                                                                                                                                                                                                                                                                               |
| wrapWithPanel         | `boolean`                            | `true`                                                                 | 是否让 Form 用 panel 包起来，设置为 false 后，actions 将无效。                                                                                                                                                                                                                                                                                               |
| panelClassName        | `boolean`                            | `true`                                                                 | 是否让 Form 用 panel 包起来，设置为 false 后，actions 将无效。                                                                                                                                                                                                                                                                                               |
| api                   | [Api](./Types.md#api)                |                                                                        | Form 用来保存数据的 api。                                                                                                                                                                                                                                                                                                                                    |
| initApi               | [Api](./Types.md#api)                |                                                                        | Form 用来获取初始数据的 api。                                                                                                                                                                                                                                                                                                                                |
| interval              | `number`                             | `3000`                                                                 | 刷新时间(最低 3000)                                                                                                                                                                                                                                                                                                                                          |
| silentPolling         | `boolean`                            | `false`                                                                | 配置刷新时是否显示加载动画                                                                                                                                                                                                                                                                                                                                   |
| stopAutoRefreshWhen   | `string`                             | `""`                                                                   | 通过[表达式](./Types.md#表达式) 来配置停止刷新的条件                                                                                                                                                                                                                                                                                                         |
| initAsyncApi          | [Api](./Types.md#api)                |                                                                        | Form 用来获取初始数据的 api,与 initApi 不同的是，会一直轮训请求该接口，直到返回 finished 属性为 true 才 结束。                                                                                                                                                                                                                                               |
| initFetch             | `boolean`                            | `true`                                                                 | 设置了 initApi 或者 initAsyncApi 后，默认会开始就发请求，设置为 false 后就不会起始就请求接口                                                                                                                                                                                                                                                                 |
| initFetchOn           | `string`                             |                                                                        | 用表达式来配置                                                                                                                                                                                                                                                                                                                                               |
| initFinishedField     | `string`                             | `finished`                                                             | 设置了 initAsyncApi 后，默认会从返回数据的 data.finished 来判断是否完成，也可以设置成其他的 xxx，就会从 data.xxx 中获取                                                                                                                                                                                                                                      |
| initCheckInterval     | `number`                             | `3000`                                                                 | 设置了 initAsyncApi 以后，默认拉取的时间间隔                                                                                                                                                                                                                                                                                                                 |
| schemaApi             | [Api](./Types.md#api)                |                                                                        | `已不支持`，请改用 controls 里面放置 Service 渲染器实现                                                                                                                                                                                                                                                                                                      |
| asyncApi              | [Api](./Types.md#api)                |                                                                        | 设置此属性后，表单提交发送保存接口后，还会继续轮训请求该接口，直到返回 `finished` 属性为 `true` 才 结束。                                                                                                                                                                                                                                                    |
| checkInterval         | `number`                             | 3000                                                                   | 轮训请求的时间间隔，默认为 3 秒。设置 `asyncApi` 才有效                                                                                                                                                                                                                                                                                                      |
| finishedField         | `string`                             | `"finished"`                                                           | 如果决定结束的字段名不是 `finished` 请设置此属性，比如 `is_success`                                                                                                                                                                                                                                                                                          |
| submitOnChange        | `boolean`                            | `false`                                                                | 表单修改即提交                                                                                                                                                                                                                                                                                                                                               |
| submitOnInit          | `boolean`                            | `false`                                                                | 初始就提交一次                                                                                                                                                                                                                                                                                                                                               |
| resetAfterSubmit      | `boolean`                            | `false`                                                                | 提交后是否重置表单                                                                                                                                                                                                                                                                                                                                           |
| primaryField          | `string`                             | `"id"`                                                                 | 设置主键 id, 当设置后，检测表单是否完成时（asyncApi），只会携带此数据。                                                                                                                                                                                                                                                                                      |
| target                | `string`                             |                                                                        | 默认表单提交自己会通过发送 api 保存数据，但是也可以设定另外一个 form 的 name 值，或者另外一个 `CRUD` 模型的 name 值。 如果 target 目标是一个 `Form` ，则目标 `Form` 会重新触发 `initApi`，api 可以拿到当前 form 数据。如果目标是一个 `CRUD` 模型，则目标模型会重新触发搜索，参数为当前 Form 数据。当目标是 `window` 时，会把当前表单的数据附带到页面地址上。 |
| redirect              | `string`                             |                                                                        | 设置此属性后，Form 保存成功后，自动跳转到指定页面。支持相对地址，和绝对地址（相对于组内的）。                                                                                                                                                                                                                                                                |
| reload                | `string`                             |                                                                        | 操作完后刷新目标对象。请填写目标组件设置的 name 值，如果填写为 `window` 则让当前页面整体刷新。                                                                                                                                                                                                                                                               |
| autoFocus             | `boolean`                            | `false`                                                                | 是否自动聚焦。                                                                                                                                                                                                                                                                                                                                               |
| canAccessSuperData    | `boolean`                            | `true`                                                                 | 指定是否可以自动获取上层的数据并映射到表单项上                                                                                                                                                                                                                                                                                                                 |
| name                  | `string`                             |                                                                        | 设置一个名字后，方便其他组件与其通信                                                                                                                                                                                                                                                                                                                         |

表单项都是通过 controls 设置的，类型是数组，成员主要是[FormItem](./FormItem.md)，默认一行一个（当然 form 是 inline 模式时例外），如果想一行多个，可以将多个[FormItem](./FormItem.md)放在一个 [Group](./Group.md) 里面。

```schema:height="360" scope="body"
{
  "type": "form",
  "name": "sample2",
  "controls": [
    {
      "type": "text",
      "name": "test",
      "label": "Label",
      "placeholder": "Placeholder"
    },

    {
      "type": "divider"
    },

    {
      "type": "group",
      "controls": [
        {
          "type": "text",
          "name": "test1",
          "label": "Label",
          "placeholder": "Placeholder"
        },

        {
          "type": "text",
          "name": "test2",
          "label": "Label",
          "placeholder": "Placeholder"
        }
      ]
    }
  ]
}
```

水平模式的 Form 也支持 [Group](./Group.md) 展现。

```schema:height="430" scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "name": "sample3",
  "controls": [
    {
      "type": "text",
      "name": "test",
      "label": "Label",
      "placeholder": "Placeholder"
    },

    {
      "type": "divider"
    },

    {
      "type": "group",
      "controls": [
        {
          "type": "text",
          "name": "test1",
          "label": "Label",
          "placeholder": "Placeholder"
        },

        {
          "type": "text",
          "name": "test2",
          "label": "Label",
          "placeholder": "Placeholder"
        }
      ]
    },

    {
      "type": "divider"
    },

    {
      "type": "group",
      "controls": [
        {
          "type": "text",
          "name": "test3",
          "label": "Label",
          "placeholder": "Placeholder"
        },

        {
          "inline": true,
          "type": "text",
          "name": "test4",
          "label": "Label",
          "placeholder": "Placeholder"
        }
      ]
    },

    {
      "type": "divider"
    },

    {
      "type": "group",
      "controls": [
        {
          "type": "text",
          "name": "test3",
          "label": "Label",
          "inline": true,
          "labelClassName": "col-sm-2",
          "placeholder": "Placeholder"
        },

        {
          "inline": true,
          "type": "text",
          "name": "test4",
          "label": "Label",
          "placeholder": "Placeholder"
        }
      ]
    }
  ]
}
```
