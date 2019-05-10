### Wizard

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
-   `steps[x].mode` 展示默认，跟 [Form](./Form.md) 中的模式一样，选择： `normal`、`horizontal`或者`inline`。
-   `steps[x].horizontal` 当为水平模式时，用来控制左右占比。
-   `steps[x].horizontal.label` 左边 label 的宽度占比。
-   `steps[x].horizontal.right` 右边控制器的宽度占比。
-   `steps[x].horizontal.offset` 当没有设置 label 时，右边控制器的偏移量。
-   `steps[x].api` 当前步骤保存接口，可以不配置。
-   `steps[x].initApi` 当前步骤数据初始化接口。
-   `steps[x].initFetch` 当前步骤数据初始化接口是否初始拉取。
-   `steps[x].initFetchOn` 当前步骤数据初始化接口是否初始拉取，用表达式来决定。
-   `steps[x].controls` 当前步骤的表单项集合，请参考 [FormItem](./FormItem.md)。

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
