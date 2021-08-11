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
    "api": "/api/mock2/form/saveForm?waitSeconds=2",
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

| 属性名            | 类型                                     | 默认值 | 说明                                                                                          |
| ----------------- | ---------------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| title             | `string`                                 |        | 步骤标题                                                                                      |
| mode              | `string`                                 |        | 展示默认，跟 [Form](./Form/Form.md) 中的模式一样，选择： `normal`、`horizontal`或者`inline`。 |
| horizontal        | `Object`                                 |        | 当为水平模式时，用来控制左右占比                                                              |
| horizontal.label  | `number`                                 |        | 左边 label 的宽度占比                                                                         |
| horizontal.right  | `number`                                 |        | 右边控制器的宽度占比。                                                                        |
| horizontal.offset | `number`                                 |        | 当没有设置 label 时，右边控制器的偏移量                                                       |
| api               | [API](../../docs/types/api)              |        | 当前步骤保存接口，可以不配置。                                                                |
| initApi           | [API](../../docs/types/api)              |        | 当前步骤数据初始化接口。                                                                      |
| initFetch         | `boolean`                                |        | 当前步骤数据初始化接口是否初始拉取。                                                          |
| initFetchOn       | [表达式](../../docs/concepts/expression) |        | 当前步骤数据初始化接口是否初始拉取，用表达式来决定。                                          |
| body              | Array<[FormItem](./form/formItem)>       |        | 当前步骤的表单项集合，请参考 [FormItem](./form/formItem)。                                    |
