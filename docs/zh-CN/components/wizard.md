---
title: Wizard 向导
description:
type: 0
group: ⚙ 组件
menuName: Wizard 向导
icon:
order: 73
---

表单向导，能够配置多个步骤引导用户一步一步完成表单提交。

## 基本使用

```schema: scope="body"
{
    "type": "wizard",
    "initApi": "/api/mock2/form/saveForm?waitSeconds=2",
    "mode": "vertical",
    "steps": [
        {
            "title": "第一步",
            "body": [
                {
                    "name": "website",
                    "label": "网址",
                    "type": "input-url",
                    "required": true
                },
                {
                    "name": "email",
                    "label": "邮箱",
                    "type": "input-email",
                    "required": true
                }
            ]
        },
        {
            "title": "Step 2",
            "body": [
                {
                    "name": "email2",
                    "label": "邮箱",
                    "type": "input-email",
                    "required": true
                }
            ]
        },
        {
            "title": "Step 3",
            "body": [
                "这是最后一步了"
            ]
        }
    ]
}
```

## 属性表

| 属性名              | 类型                                     | 默认值               | 说明                                                                                                                                                     |
| ------------------- | ---------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                | `string`                                 | `"wizard"`           | 指定为 `Wizard` 组件                                                                                                                                     |
| mode                | `string`                                 | `"horizontal"`       | 展示模式，选择：`horizontal` 或者 `vertical`                                                                                                             |
| api                 | [API](../../docs/types/api)              |                      | 最后一步保存的接口。                                                                                                                                     |
| initApi             | [API](../../docs/types/api)              |                      | 初始化数据接口                                                                                                                                           |
| initFetch           | [API](../../docs/types/api)              |                      | 初始是否拉取数据。                                                                                                                                       |
| initFetchOn         | [表达式](../../docs/concepts/expression) |                      | 初始是否拉取数据，通过表达式来配置                                                                                                                       |
| actionPrevLabel     | `string`                                 | `上一步`             | 上一步按钮文本                                                                                                                                           |
| actionNextLabel     | `string`                                 | `下一步`             | 下一步按钮文本                                                                                                                                           |
| actionNextSaveLabel | `string`                                 | `保存并下一步`       | 保存并下一步按钮文本                                                                                                                                     |
| actionFinishLabel   | `string`                                 | `完成`               | 完成按钮文本                                                                                                                                             |
| className           | `string`                                 |                      | 外层 CSS 类名                                                                                                                                            |
| actionClassName     | `string`                                 | `btn-sm btn-default` | 按钮 CSS 类名                                                                                                                                            |
| reload              | `string`                                 |                      | 操作完后刷新目标对象。请填写目标组件设置的 name 值，如果填写为 `window` 则让当前页面整体刷新。                                                           |
| redirect            | [模板](../../docs/concepts/template)     | `3000`               | 操作完后跳转。                                                                                                                                           |
| target              | `string`                                 | `false`              | 可以把数据提交给别的组件而不是自己保存。请填写目标组件设置的 name 值，如果填写为 `window` 则把数据同步到地址栏上，同时依赖这些数据的组件会自动重新刷新。 |
| steps               | Array<[step](#step)>                     |                      | 数组，配置步骤信息                                                                                                                                       |
| startStep           | `string`                                 | `1`                  | 起始默认值，从第几步开始。可支持模版，但是只有在组件创建时渲染模版并设置当前步数，在之后组件被刷新时，当前 step 不会根据 startStep 改变                  |

### step

| 属性名            | 类型                                     | 默认值 | 说明                                                                                       |
| ----------------- | ---------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| title             | `string`                                 |        | 步骤标题                                                                                   |
| mode              | `string`                                 |        | 展示默认，跟 [Form](./Form/Form) 中的模式一样，选择： `normal`、`horizontal`或者`inline`。 |
| horizontal        | `Object`                                 |        | 当为水平模式时，用来控制左右占比                                                           |
| horizontal.label  | `number`                                 |        | 左边 label 的宽度占比                                                                      |
| horizontal.right  | `number`                                 |        | 右边控制器的宽度占比。                                                                     |
| horizontal.offset | `number`                                 |        | 当没有设置 label 时，右边控制器的偏移量                                                    |
| api               | [API](../../docs/types/api)              |        | 当前步骤保存接口，可以不配置。                                                             |
| initApi           | [API](../../docs/types/api)              |        | 当前步骤数据初始化接口。                                                                   |
| initFetch         | `boolean`                                |        | 当前步骤数据初始化接口是否初始拉取。                                                       |
| initFetchOn       | [表达式](../../docs/concepts/expression) |        | 当前步骤数据初始化接口是否初始拉取，用表达式来决定。                                       |
| body              | Array<[FormItem](./form/formItem)>       |        | 当前步骤的表单项集合，请参考 [FormItem](./form/formItem)。                                 |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`为当前数据域中的字段名，例如：当前数据域为 {username: 'amis'}，则可以通过${username}获取对应的值。

| 事件名称       | 事件参数                                                                                         | 说明                         |
| -------------- | ------------------------------------------------------------------------------------------------ | ---------------------------- |
| inited         | `event.data: object` initApi 远程请求返回的初始化数据<br/>`[name]: any` 当前数据域中指定字段的值 | 远程初始化接口请求成功时触发 |
| stepChange     | `step: number` 步骤索引                                                                          | 切换步骤时触发               |
| change         | `event.data: object` 当前表单数据<br/>`[name]: any` 当前数据域中指定字段的值                     | 表单值变化时触发             |
| stepSubmitSucc | -                                                                                                | 单个步骤提交成功             |
| stepSubmitFail | `error: object` 单个步骤 api 远程请求失败后返回的错误信息                                        | 单个步骤提交失败             |
| finished       | `event.data: object` 即将提交的表单数据<br/>`[name]: any` 当前数据域中指定字段的值               | 最终提交时触发               |
| submitSucc     | `result: object` api 远程请求成功后返回的结果数据                                                | 最终提交成功时触发           |
| submitFail     | `error: object` api 远程请求失败后返回的错误信息                                                 | 最终提交失败时触发           |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称    | 动作配置                   | 说明                                     |
| ----------- | -------------------------- | ---------------------------------------- |
| submit      | -                          | 全部提交                                 |
| step-submit | -                          | 分步提交                                 |
| next        | -                          | 下一步                                   |
| prev        | -                          | 上一步                                   |
| goto-step   | `step: number` 目标步骤    | 定位步骤                                 |
| reload      | -                          | 重新加载，调用 `intiApi`，刷新数据域数据 |
| setValue    | `value: object` 更新的数据 | 更新数据                                 |
