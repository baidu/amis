## Wizard

表单向导，能够配置多个步骤引导用户一步一步完成表单提交。

-   `type` 请设置 `wizard`。
-   `mode` 展示模式，请选择：`horizontal` 或者 `vertical`，默认为 `horizontal`。
-   `api` 最后一步保存的接口。
-   `initApi` 初始化数据接口。
-   `initFetch` 初始是否拉取数据。
-   `initFetchOn` 初始是否拉取数据，通过表达式来配置。
-   `actionPrevLabel` 上一步按钮名称，默认：`上一步`。
-   `actionNextLabel` 下一步按钮名称`下一步`。
-   `actionNextSaveLabel` 保存并下一步按钮名称，默认：`保存并下一步`。
-   `actionFinishLabel` 完成按钮名称，默认：`完成`。
-   `className` 外层 CSS 类名。
-   `actionClassName` 按钮 CSS 类名，默认：`btn-sm btn-default`。
-   `reload` 操作完后刷新目标对象。请填写目标组件设置的 name 值，如果填写为 `window` 则让当前页面整体刷新。
-   `redirect` 操作完后跳转。
-   `target` 可以把数据提交给别的组件而不是自己保存。请填写目标组件设置的 name 值，如果填写为 `window` 则把数据同步到地址栏上，同时依赖这些数据的组件会自动重新刷新。
-   `steps` 数组，配置步骤信息。
-   `steps[x].title` 步骤标题。
-   `steps[x].mode` 展示默认，跟 [Form](./Form/Form.md) 中的模式一样，选择： `normal`、`horizontal`或者`inline`。
-   `steps[x].horizontal` 当为水平模式时，用来控制左右占比。
-   `steps[x].horizontal.label` 左边 label 的宽度占比。
-   `steps[x].horizontal.right` 右边控制器的宽度占比。
-   `steps[x].horizontal.offset` 当没有设置 label 时，右边控制器的偏移量。
-   `steps[x].api` 当前步骤保存接口，可以不配置。
-   `steps[x].initApi` 当前步骤数据初始化接口。
-   `steps[x].initFetch` 当前步骤数据初始化接口是否初始拉取。
-   `steps[x].initFetchOn` 当前步骤数据初始化接口是否初始拉取，用表达式来决定。
-   `steps[x].controls` 当前步骤的表单项集合，请参考 [FormItem](./Form/FormItem.md)。

```schema:height="400" scope="body"
{
    "type": "wizard",
    "api": "/api/mock2/form/saveForm?waitSeconds=2",
    "mode": "vertical",
    "steps": [
        {
            "title": "第一步",
            "controls": [
                {
                    "name": "website",
                    "label": "网址",
                    "type": "url",
                    "required": true
                },
                {
                    "name": "email",
                    "label": "邮箱",
                    "type": "email",
                    "required": true
                }
            ]
        },
        {
            "title": "Step 2",
            "controls": [
                {
                    "name": "email2",
                    "label": "邮箱",
                    "type": "email",
                    "required": true
                }
            ]
        },
        {
            "title": "Step 3",
            "controls": [
                "这是最后一步了"
            ]
        }
    ]
}
```

### 接口说明

开始之前请你先阅读[整体要求](../api.md)。


#### initApi

可以用来初始化表单数据。

**发送**

默认不携带任何参数，可以在上下文中取变量设置进去。

**响应**

 要求返回的数据 data 是对象，不要返回其他格式，且注意层级问题，data 中返回的数据正好跟 form 中的变量一一对应。

 ```
 {
   status: 0,
   msg: '',
   data: {
     a: '123'
   }
 }
 ```

 如果有个表单项的 name 配置成  a，initApi 返回后会自动填充 '123'。

 #### api

 用来保存表单结果。

 **发送**

 默认为 `POST` 方式，会将所有表单项整理成一个对象发送过过去。

 **响应**

 如果 返回了 data 对象，且是对象，会把结果 merge 到表单数据里面。

 #### initAsyncApi

 这个接口的作用在于解决接口耗时比较长导致超时问题的情况，当配置此接口后，初始化接口的时候先请求 initApi 如果 initApi 接口返回了 data.finished 为 true，则初始化完成。如果返回为 false 则之后每隔 3s 请求 initAsyncApi，直到接口返回了 data.finished 为 true 才结束。 用这种机制的话，业务 api 不需要完全等待操作完成才输出结果，而是直接检测状态，没完成也直接返回，后续还会发起请求检测。

 格式要求就是 data 是对象，且 有 finished 这个字段。返回的其他字段会被 merge 到表单数据里面。

 ##### asyncApi

 保存同样也可以采用异步模式，具体请参考 initAsyncApi。