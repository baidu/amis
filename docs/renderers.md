---
title: AMis 渲染器手册
---

AMis 页面是通过 Json 配置出来的，是由一个一个渲染模型组成的，掌握他们规则，就能灵活配置出各种页面。


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

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"page"` |  指定为 Page 渲染器。 |
| title | `string` |  | 页面标题 |
| subTitle | `string` |  | 页面副标题 |
| remark | `string` |  | 标题附近会出现一个提示图标，鼠标放上去会提示该内容。 |
| aside | [Container](#Container) |  | 往页面的边栏区域加内容 |
| toolbar | [Container](#Container) |  | 往页面的右上角加内容，需要注意的是，当有 Title 是，区域在右上角，没有时区域就在顶部 |
| body | [Container](#Container) |  | 往页面的内容区域加内容 |
| className | `string` |  | 外层 dom 类名 |
| toolbarClassName | `string` | `v-middle wrapper text-right bg-light b-b` | Toolbar dom 类名 |
| bodyClassName | `string` | `wrapper` | Body dom 类名 |
| asideClassName | `string` | `w page-aside-region bg-auto` | Aside dom 类名 |
| headerClassName | `string` | `bg-light b-b wrapper` | Header 区域 dom 类名 |
| initApi | [Api](#api) |  | Page 用来获取初始数据的 api。返回的数据可以整个 page 级别使用。[详情](/docs/api#page) |
| initFetch | `boolean` | `true` | 是否起始拉取 initApi |
| initFetchOn | `string` |  | 是否起始拉取 initApi, 通过表达式配置 |
| interval | `number` | `3000` | 刷新时间(最低3000) |
| silentPolling | `boolean` | `false` | 配置刷新时是否显示加载动画 |
| stopAutoRefreshWhen | `string` | `""` | 通过[表达式](#表达式)来配置停止刷新的条件 |


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

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` |  |  `"form"` 指定为 Form 渲染器 |
| mode | `string` | `normal` | 表单展示方式，可以是：`normal`、`horizontal` 或者 `inline` [示例](/docs/demo/forms/mode) |
| horizontal | `Object` | `{"left":"col-sm-2", "right":"col-sm-10", "offset":"col-sm-offset-2"}` | 当 mode 为 `horizontal` 时有用，用来控制 label | 
| title | `string` | `"表单"` | Form 的标题 |
| submitText | `String` | `"提交"` | 默认的提交按钮名称，如果设置成空，则可以把默认按钮去掉。 |
| className | `string` |  | 外层 Dom 的类名 |
| controls | `Array` of [FormItem](#FormItem) |  | Form 表单项集合 [详情](#controls) |
| actions | `Array` of [Action](#action) |  | Form 提交按钮，成员为 Action [详情](#action) |
| messages | `Object` | | 消息提示覆写，默认消息读取的是 API 返回的消息，但是在此可以覆写它。 |
| messages.fetchSuccess | `string` | | 获取成功时提示 |
| messages.fetchFailed | `string` | | 获取失败时提示 |
| messages.saveFailed | `string` | | 保存成功时提示 |
| messages.saveSuccess | `string` | | 保存失败时提示 |
| wrapWithPanel | `boolean` | `true` | 是否让 Form 用 panel 包起来，设置为 false 后，actions 将无效。 |
| api | [Api](#api) |  | Form 用来保存数据的 api。[详情](/docs/api#form) |
| initApi | [Api](#api) |  | Form 用来获取初始数据的 api。[详情](/docs/api#form) |
| interval | `number` | `3000` | 刷新时间(最低3000) |
| silentPolling | `boolean` | `false` | 配置刷新时是否显示加载动画 |
| stopAutoRefreshWhen | `string` | `""` | 通过[表达式](#表达式)来配置停止刷新的条件 |
| initAsyncApi | [Api](#api) |  | Form 用来获取初始数据的 api,与initApi不同的是，会一直轮训请求该接口，直到返回 finished 属性为 true 才 结束。[详情](/docs/api#form) |
| initFetch | `boolean` | `true` | 设置了initApi或者initAsyncApi后，默认会开始就发请求，设置为false后就不会起始就请求接口 |
| initFetchOn | `string` |  | 用表达式来配置 |
| initFinishedField | `string` | `finished` | 设置了initAsyncApi后，默认会从返回数据的data.finished来判断是否完成，也可以设置成其他的xxx，就会从data.xxx中获取 |
| initCheckInterval | `number` | `3000` | 设置了initAsyncApi以后，默认拉取的时间间隔 |
| schemaApi | [Api](#api) |  | `已不支持`，请改用 controls 里面放置 Service 渲染器实现 |
| asyncApi | [Api](#api) |  | 设置此属性后，表单提交发送保存接口后，还会继续轮训请求该接口，直到返回 `finished` 属性为 `true` 才 结束。[详情](/docs/api#form) |
| checkInterval | `number` | 3000 | 轮训请求的时间间隔，默认为 3秒。设置 `asyncApi` 才有效 |
| finishedField | `string` | `"finished"` | 如果决定结束的字段名不是 `finished` 请设置此属性，比如 `is_success` |
| submitOnChange | `boolean` | `false` | 表单修改即提交 |
| primaryField | `string` | `"id"` | 设置主键 id, 当设置后，检测表单是否完成时（asyncApi），只会携带此数据。 |
| target | `string` |  | 默认表单提交自己会通过发送 api 保存数据，但是也可以设定另外一个 form 的 name 值，或者另外一个 `CRUD` 模型的 name 值。 如果 target 目标是一个 `Form` ，则目标 `Form` 会重新触发 `initApi`，api 可以拿到当前 form 数据。如果目标是一个 `CRUD` 模型，则目标模型会重新触发搜索，参数为当前 Form 数据。当目标是 `window` 时，会把当前表单的数据附带到页面地址上。 |
| redirect | `string` |  | 设置此属性后，Form 保存成功后，自动跳转到指定页面。支持相对地址，和绝对地址（相对于组内的）。 |
| reload | `string` | | 操作完后刷新目标对象。请填写目标组件设置的 name 值，如果填写为 `window` 则让当前页面整体刷新。 |
| autoFocus | `boolean` | `false` | 是否自动聚焦。 |
| name | `string` | | 设置一个名字后，方便其他组件与其通信 |

表单项都是通过 controls 设置的，类型是数组，成员主要是[FormItem](#FormItem)，默认一行一个（当然 form 是 inline 模式时例外），如果想一行多个，可以将多个[FormItem](#FormItem)放在一个 [Group](#Group) 里面。

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

水平模式的 Form 也支持 [Group](#Group) 展现。

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

### FormItem

Form 中主要是由各种 FormItem 组成。FormItem 中主要包含这些字段。

* `name` 字段名，表单提交时的 key。
* `value` 值，可以通过它设置默认值。
* `label` 描述标题，当表单为水平布局时，左边即便是不设置 label 为了保持对齐也会留空，如果想要去掉空白，请设置成 `false`。
* `description` 描述内容。
* `placeholder` 占位内容。
* `type` 指定表单类型，如： `text`、`textarea`、`date`、`email`等等
* `inline` 是否为 inline 模式。
* `submitOnChange` 是否该表单项值发生变化时就提交当前表单。
* `className` 表单最外层类名。
* `disabled` 当前表单项是否是禁用状态。
* `disabledOn` 通过[表达式](#表达式)来配置当前表单项的禁用状态。
* `visible` 是否可见。
* `visibleOn` 通过[表达式](#表达式)来配置当前表单项是否显示。
* `hidden` 是否隐藏，不要跟 `visible` `visibleOn` 同时配置
* `hiddenOn` 通过[表达式](#表达式)来配置当前表单项是否隐藏。
* `inputClassName` 表单控制器类名。
* `labelClassName` label 的类名。
* `required` 是否为必填。
* `requiredOn` 通过[表达式](#表达式)来配置当前表单项是否为必填。
* `validations` 格式验证，支持设置多个，多个规则用英文逗号隔开。
    * `isEmptyString` 必须是空白字符。
    * `isEmail` 必须是 Email。
    * `isUrl` 必须是 Url。
    * `isNumeric` 必须是 数值。
    * `isAlpha` 必须是 字母。
    * `isAlphanumeric` 必须是 字母或者数字。
    * `isInt` 必须是 整形。
    * `isFloat` 必须是 浮点形。
    * `isLength:length` 是否长度正好等于设定值。
    * `minLength:length` 最小长度。
    * `maxLength:length` 最大长度。
    * `maximum:length` 最大值。
    * `minimum:length` 最小值。
    * `equals:xxx` 当前值必须完全等于 xxx。
    * `equalsField:xxx` 当前值必须与 xxx 变量值一致。
    * `isJson` 是否是合法的 Json 字符串。
    * `notEmptyString` 要求输入内容不是空白。
    * `isUrlPath` 是 url 路径。
    * `matchRegexp:/foo/` 必须命中某个正则。
    * `matchRegexp1:/foo/` 必须命中某个正则。
    * `matchRegexp2:/foo/` 必须命中某个正则。
    * `matchRegexp3:/foo/` 必须命中某个正则。
    * `matchRegexp4:/foo/` 必须命中某个正则。
  如：

  ```js
  {
    "validations": "isNumeric,minimum:10",

    // 或者对象配置方式, 推荐
    "validations": {
      "isNumeric": true,
      "minimum": 10
    }
  }
  ```
* `validationErrors` 自定义错误提示, 配置为对象, key为规则名, value为错误提示字符串(提示:其中`$1`表示输入)
  如： 
  ```json
  {
    "validationErrors": {
      "isEmail": "请输入正确的邮箱地址"
    }
  }
  ```
* `validateOnChange` 是否修改就验证数值，默认当表单提交过就会每次修改验证，如果要关闭请设置为 `false`，即便是关了，表单提交前还是会验证的。


```schema:height="200" scope="form-item"
{
  "type": "text",
  "name": "test1",
  "label": "Label",
  "description": "Description...",
  "placeholder": "Placeholder",
  "validateOnChange": true,
  "validations": "matchRegexp: /^a/, minLength:3,maxLength:5",
  "validationErrors": {
    "matchRegexp": "必须为a开头",
    "minLength": "小伙伴，最低为$1个字符!"
  }
}
```

不同类型的表单，可配置项还有更多，具体请看下面对应的类型。

### Hidden

隐藏字段类型，默认表单提交，只会发送 controls 里面的这些成员，对于隐藏的字段同时又希望提交表单的时候带过去，请把表单项配置成 `hidden` 类型。

* `type` 请设置成 `hidden`

### Text

普通的文本输入框。

* `type` 请设置成 `text`
* `addOn` 输入框附加组件，比如附带一个提示文字，或者附带一个提交按钮。
* `addOn.type` 请选择 `text` 、`button` 或者 `submit`。
* `addOn.label` 文字说明
* `addOn.xxx` 其他参数请参考按钮配置部分。
* `clearable` 在有值的时候是否显示一个删除图标在右侧。
* `resetValue` 默认为 `""`, 删除后设置此配置项给定的值。
* `options` 可选，选项配置，类型为数组，成员格式如下，配置后用户输入内容时会作为选项提示辅助输入。
    * `label` 文字
    * `value` 值
* `source` 通过 options 只能配置静态数据，如果设置了 source 则会从接口拉取，实现动态效果。
* `autoComplete` 跟 source 不同的是，每次用户输入都会去接口获取提示。
* `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="200" scope="form-item"
{
  "type": "text",
  "name": "text",
  "label": "文本"
}
```

带提示功能

```schema:height="240" scope="form-item"
{
  "type": "text",
  "name": "text",
  "label": "文本",
  "clearable": true,
  "addOn": {
    "type": "submit",
    "icon": "fa fa-search",
    "level": "primary"
  },
  "options": [
    "wangzhaojun",
    "libai",
    "luna",
    "zhongkui"
  ]
}
```

### Textarea

多行文本输入框。

* `type` 请设置成 `textarea`
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="200" scope="form-item"
{
  "type": "textarea",
  "name": "text",
  "label": "多行文本"
}
```

### Url

URL 输入框。

* `type` 请设置成 `url`
* `addOn` 输入框附加组件，比如附带一个提示文字，或者附带一个提交按钮。
* `addOn.type` 请选择 `text` 、`button` 或者 `submit`。
* `addOn.label` 文字说明
* `addOn.xxx` 其他参数请参考按钮配置部分。
* `clearable` 在有值的时候是否显示一个删除图标在右侧。
* `resetValue` 默认为 `""`, 删除后设置此配置项给定的值。
* `options` 可选，选项配置，类型为数组，成员格式如下，配置后用户输入内容时会作为选项提示辅助输入。
    * `label` 文字
    * `value` 值
* `source` 通过 options 只能配置静态数据，如果设置了 source 则会从接口拉取，实现动态效果。
* `autoComplete` 跟 source 不同的是，每次用户输入都会去接口获取提示。
* `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="200" scope="form-item"
{
  "type": "url",
  "name": "text",
  "validateOnChange": true,
  "label": "Url"
}
```

### Email

Email 输入框。

* `type` 请设置成 `email`
* `addOn` 输入框附加组件，比如附带一个提示文字，或者附带一个提交按钮。
* `addOn.type` 请选择 `text` 、`button` 或者 `submit`。
* `addOn.label` 文字说明
* `addOn.xxx` 其他参数请参考按钮配置部分。
* `clearable` 在有值的时候是否显示一个删除图标在右侧。
* `resetValue` 默认为 `""`, 删除后设置此配置项给定的值。
* `options` 可选，选项配置，类型为数组，成员格式如下，配置后用户输入内容时会作为选项提示辅助输入。
    * `label` 文字
    * `value` 值
* `source` 通过 options 只能配置静态数据，如果设置了 source 则会从接口拉取，实现动态效果。
* `autoComplete` 跟 source 不同的是，每次用户输入都会去接口获取提示。
* `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="200" scope="form-item"
{
  "type": "email",
  "name": "text",
  "validateOnChange": true,
  "label": "Email"
}
```

### Password

密码输入框。

* `type` 请设置成 `password`
* `addOn` 输入框附加组件，比如附带一个提示文字，或者附带一个提交按钮。
* `addOn.type` 请选择 `text` 、`button` 或者 `submit`。
* `addOn.label` 文字说明
* `addOn.xxx` 其他参数请参考按钮配置部分。
* `clearable` 在有值的时候是否显示一个删除图标在右侧。
* `resetValue` 默认为 `""`, 删除后设置此配置项给定的值。
* 更多配置请参考 [FormItem](#FormItem)

### Number

数字输入框。

* `type` 请设置成 `number`
* `min` 最小值
* `step` 步长
* `max` 最大值
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="200" scope="form-item"
{
  "type": "number",
  "name": "text",
  "label": "数字",
  "min": 1,
  "max": 10,
  "step": 1
}
```

### Divider

分割线

* `type` 请设置成 `divider`

```schema:height="200" scope="form-item"
{
  "type": "divider"
}
```

### Select

选项表单。

* `type` 请设置成 `select`
* `options` 选项配置，类型为数组，成员格式如下。
    * `label` 文字
    * `value` 值
* `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。[详情](/docs/api#select) 另外也可以用 `$xxxx` 来获取当前作用域中的变量。
* `autoComplete` 跟 source 不同的是，每次用户输入都会去接口获取提示。
* `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
* `joinValues` 默认为 `true`
 * 单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
 * 多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
* `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
* `delimiter` 默认为 `,`
* `clearable` 默认为 `false`, 当设置为 `true` 时，已选中的选项右侧会有个小 `X` 用来取消设置。
* `searchable` 默认为 `false`，表示可以通过输入部分内容检索出选项。
* 更多配置请参考 [FormItem](#FormItem)


单选

```schema:height="250" scope="form"
[
    {
      "type": "select",
      "name": "select",
      "label": "单选",
      "clearable": true,
      "options": [
        {
          "label": "Option A",
          "value": "a"
        },
        {
          "label": "Option B",
          "value": "b"
        }
      ]
    },

    {
      "type": "static",
      "name": "select",
      "label": "当前值"
    }
]
```

多选

```schema:height="280" scope="form"
[
    {
      "type": "select",
      "name": "select",
      "label": "多选",
      "clearable": true,
      "multiple": true,
      "options": [
        {
          "label": "OptionA",
          "value": "a"
        },
        {
          "label": "OptionB",
          "value": "b"
        },
        {
          "label": "OptionC",
          "value": "c"
        },
        {
          "label": "OptionD",
          "value": "d"
        }
      ]
    },

    {
      "type": "static",
      "name": "select",
      "label": "当前值"
    }
]
```

### Chained-Select

无限级别下拉，只支持单选，且必须和 `source` 搭配，通过 API 拉取数据，只要 API 有返回结果，就能一直无限级别下拉下去。

* `type` 请设置成 `chained-select`
* `options` 选项配置，类型为数组，成员格式如下。
    * `label` 文字
    * `value` 值
* `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。[详情](/docs/api#select) 另外也可以用 `$xxxx` 来获取当前作用域中的变量。
更多配置请参考 [FormItem](#FormItem)。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="300" scope="form-item"
{
  "name": "select3",
  "type": "chained-select",
  "label": "级联下拉",
  "source": "/api/mock2/options/chainedOptions?waitSeconds=1&parentId=$parentId&level=$level&maxLevel=4&waiSeconds=1",
  "value": "a,b"
}
```


### Checkbox

勾选框

* `type` 请设置成 `checkbox`
* `option` 选项说明
* `trueValue` 默认 `true`
* `falseValue` 默认 `false`
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="200" scope="form-item"
{
  "name": "checkbox",
  "type": "checkbox",
  "label": "Checkbox",
  "option": "选项说明"
}
```

### Checkboxes

复选框

* `type` 请设置成 `checkboxes`
* `options` 选项配置，类型为数组，成员格式如下。
    * `label` 文字
    * `value` 值
* `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。[详情](/docs/api#select)
* `joinValues` 默认为 `true`  选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
* `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
* `delimiter` 默认为 `,`
* `columnsCount` 默认为 `1` 可以配置成一行显示多个。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="330" scope="form"
[
    {
      "name": "checkboxes",
      "type": "checkboxes",
      "label": "Checkboxes",
      "options": [
          {
            "label": "OptionA",
            "value": "a"
          },
          {
            "label": "OptionB",
            "value": "b"
          },
          {
            "label": "OptionC",
            "value": "c"
          },
          {
            "label": "OptionD",
            "value": "d"
          }
        ]
    },

    {
        "type": "static",
        "name": "checkboxes",
        "label": "当前值"
    }
]
```

### Radios

单选框

* `type` 请设置成 `radios`
* `options` 选项配置，类型为数组，成员格式如下。
    * `label` 文字
    * `value` 值
* `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。[详情](/docs/api#select)
* `columnsCount` 默认为 `1` 可以配置成一行显示多个。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="330" scope="form"
[
    {
      "name": "radios",
      "type": "radios",
      "label": "Radios",
      "options": [
          {
            "label": "OptionA",
            "value": "a"
          },
          {
            "label": "OptionB",
            "value": "b"
          },
          {
            "label": "OptionC",
            "value": "c"
          },
          {
            "label": "OptionD",
            "value": "d"
          }
        ]
    },

    {
        "type": "static",
        "name": "radios",
        "label": "当前值"
    }
]
```

### List(FormItem)

简单的列表选择框。

* `type` 请设置成 `list`
* `options` 选项配置，类型为数组，成员格式如下。
    * `label` 文字
    * `value` 值
    * `image` 图片的 http 地址。
* `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。[详情](/docs/api#select)
* `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
* `joinValues` 默认为 `true`
 * 单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
 * 多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
* `delimiter` 默认为 `,`
* `clearable` 默认为 `true`, 表示可以取消选中。
* 更多配置请参考 [FormItem](#FormItem)


单选

```schema:height="250" scope="form"
[
    {
      "type": "list",
      "name": "select",
      "label": "单选",
      "clearable": true,
      "options": [
        {
          "label": "Option A",
          "value": "a"
        },
        {
          "label": "Option B",
          "value": "b"
        }
      ]
    },

    {
      "type": "static",
      "name": "select",
      "label": "当前值"
    }
]
```

多选

```schema:height="280" scope="form"
[
    {
      "type": "list",
      "name": "select",
      "label": "多选",
      "clearable": true,
      "multiple": true,
      "options": [
        {
          "label": "OptionA",
          "value": "a"
        },
        {
          "label": "OptionB",
          "value": "b"
        },
        {
          "label": "OptionC",
          "value": "c"
        },
        {
          "label": "OptionD",
          "value": "d"
        }
      ]
    },

    {
      "type": "static",
      "name": "select",
      "label": "当前值"
    }
]
```

选项带图片

```schema:height="280" scope="form"
[
    {
      "type": "list",
      "name": "select",
      "label": "图片",
      "clearable": true,
      "options": [
        {
          "label": "OptionA",
          "value": "a",
          "image": "raw:https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
        },
        {
          "label": "OptionB",
          "value": "b",
          "image": "raw:https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
        },
        {
          "label": "OptionC",
          "value": "c",
          "image": "raw:https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
        },
        {
          "label": "OptionD",
          "value": "d",
          "image": "raw:https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
        }
      ]
    },

    {
      "type": "static",
      "name": "select",
      "label": "当前值"
    }
]
```

### Switch

可选框，和 checkbox 完全等价。

* `type` 请设置成 `switch`
* `option` 选项说明
* `trueValue` 默认 `true`
* `falseValue` 默认 `false`
* 更多配置请参考 [FormItem](#FormItem)


```schema:height="200" scope="form-item"
{
  "name": "switch",
  "type": "switch",
  "label": "Switch",
  "option": "开关说明"
}
```
### Date

日期类型。

* `type` 请设置成 `date`
* `format` 默认 `X` 即时间戳格式，用来提交的时间格式。更多格式类型请参考 moment.
* `inputFormat` 默认 `YYYY-MM-DD` 用来配置显示的时间格式。
* `placeholder` 默认 `请选择日期`
* `value` 这里面 value 需要特殊说明一下，因为支持相对值。如：
  * `-2mins` 2分钟前
  * `+2days` 2天后
  * `-10week` 十周前
* `minDate` 限制最小日期，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`
* `maxDate` 限制最小日期，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`

  可用单位： `min`、`hour`、`day`、`week`、`month`、`year`。所有单位支持复数形式。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="250" scope="form"
[
    {
      "type": "date",
      "name": "select",
      "label": "日期"
    },

    {
      "type": "static",
      "name": "select",
      "label": "当前值"
    }
]
```

### Datetime

日期时间类型。

* `type` 请设置成 `datetime`
* `format` 默认 `X` 即时间戳格式，用来提交的时间格式。更多格式类型请参考 moment.
* `inputFormat` 默认 `YYYY-MM-DD HH:mm:ss` 用来配置显示的时间格式。
* `placeholder` 默认 `请选择日期`
* `timeConstraints` 请参考： https://github.com/YouCanBookMe/react-datetime
* `value` 这里面 value 需要特殊说明一下，因为支持相对值。如：
  * `-2mins` 2分钟前
  * `+2days` 2天后
  * `-10week` 十周前
* `minDate` 限制最小日期，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`
* `maxDate` 限制最小日期，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`
* `minTime` 限制最小时间，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`
* `maxTime` 限制最大时间，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`

  可用单位： `min`、`hour`、`day`、`week`、`month`、`year`。所有单位支持复数形式。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="250" scope="form"
[
    {
      "type": "datetime",
      "name": "select",
      "label": "日期"
    },

    {
      "type": "static",
      "name": "select",
      "label": "当前值"
    }
]
```

### Time

时间类型。

* `type` 请设置成 `time`
* `format` 默认 `X` 即时间戳格式，用来提交的时间格式。更多格式类型请参考 moment.
* `inputFormat` 默认 `HH:mm` 用来配置显示的时间格式。
* `placeholder` 默认 `请选择日期`
* `timeConstraints` 请参考： https://github.com/YouCanBookMe/react-datetime
* `value` 这里面 value 需要特殊说明一下，因为支持相对值。如：
  * `-2mins` 2分钟前
  * `+2days` 2天后
  * `-10week` 十周前
* `minTime` 限制最小时间，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`
* `maxTime` 限制最大时间，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`

  可用单位： `min`、`hour`、`day`、`week`、`month`、`year`。所有单位支持复数形式。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="250" scope="form"
[
    {
      "type": "time",
      "name": "select",
      "label": "日期"
    },

    {
      "type": "static",
      "name": "select",
      "label": "当前值"
    }
]
```

### Date-Range

日期范围类型。

* `type` 请设置成 `date-range`
* `format` 默认 `X` 即时间戳格式，用来提交的时间格式。更多格式类型请参考 moment.
* `inputFormat` 默认 `HH:mm` 用来配置显示的时间格式。
* `minDate` 限制最小日期，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`
* `maxDate` 限制最小日期，可用 `${xxx}` 取值，或者输入相对时间，或者时间戳。如：`${start}`、`+3days`、`+3days+2hours`或者 `${start|default:-2days}+3days`
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="250" scope="form"
[
    {
      "type": "date-range",
      "name": "select",
      "label": "日期范围"
    },

    {
      "type": "static",
      "name": "select",
      "label": "当前值"
    }
]
```

考虑到大家都习惯用两个字段来存储，那么就用 date 来代替吧。

```schema:height="250" scope="form"
[
  [
    {
      "type": "date",
      "name": "start",
      "label": "开始日期",
      "maxDate": "$end"
    },

    {
      "type": "date",
      "name": "end",
      "label": "结束日期",
      "minDate": "$start"
    }
  ],

  {
    "type": "static",
    "name": "select",
    "label": "当前值",
    "description": "包含开始日期和结束日期",
    "tpl": "$start - $end"
  }
]
```

### Color

颜色选择器。

* `type` 请设置成 `color`
* `format` 请选择 `hex`、`hls`、`rgb`或者`rgba`。默认为 `hex`。
* `clearable` 是否显示清除按钮。

```schema:height="400" scope="form-item"
{
  "type": "color",
  "name": "color",
  "label": "颜色"
}
```

### Range

范围输入框。

* `type` 请设置成 `range`
* `min` 最小值
* `max` 最大值
* `step` 步长

```schema:height="400" scope="form-item"
{
  "type": "range",
  "name": "range",
  "label": "数字范围",
  "min": 0, 
  "max": 20,
  "step": 2
}
```

### Image

图片格式输入，默认 AMis 会直接存储在 FEX 的 hiphoto 里面，提交到 form 是直接的图片 url。

* `type` 请设置成 `image`
* `reciever` 默认 `/api/upload` 如果想自己存储，请设置此选项。
* `multiple` 是否多选。
* `maxLength` 默认没有限制，当设置后，一次只允许上传指定数量文件。
* `joinValues` 多选时是否将多个值用 `delimiter` 连接起来。
* `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
* `delimiter` 连接符，默认是 `,`, 多选时且 `joinValues` 为 `true` 时用来连接值。
* `autoUpload` 是否选择完就自动开始上传？默认为 `true`
* `compress` 默认 `true` 如果想默认压缩请开启。
* `compressOptions`
  * `maxWidth` 设置最大宽度。
  * `maxHeight` 设置最大高度。
* `showCompressOptions` 默认为 false, 开启后，允许用户输入压缩选项。
* `crop` 用来设置是否支持裁剪。
  * `aspectRatio` 浮点型，默认 `1` 即 `1:1`，如果要设置 `16:9` 请设置 `1.7777777777777777` 即 `16 / 9`。
* `allowInput` 默认都是通过用户选择图片后上传返回图片地址，如果开启此选项，则可以允许用户图片地址。
* `limit` 限制图片大小，超出不让上传。
  * `width` 限制图片宽度。
  * `height` 限制图片高度。
  * `minWidth` 限制图片最小宽度。
  * `minHeight` 限制图片最小高度。
  * `maxWidth` 限制图片最大宽度。
  * `maxHeight` 限制图片最大高度。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="250" scope="form-item"
{
  "type": "image",
  "name": "image",
  "label": "Images"
}
```


### File

文件输入，AMis 也默认处理了图片存储，提交给 API 的是文件的下载地址。

* `type` 请设置成 `file`
* `reciever` 默认 `/api/upload/file` 如果想自己存储，请设置此选项。(PS: 如果想存自己的 bos, 系统配置中可以直接填写自己的bos配置。)
* `accept` 默认 `text/plain` 默认只支持纯文本，要支持其他类型，请配置此属性。
* `maxSize` 默认没有限制，当设置后，文件大小大于此值将不允许上传。
* `multiple` 是否多选。
* `maxLength` 默认没有限制，当设置后，一次只允许上传指定数量文件。
* `joinValues` 多选时是否将多个值用 `delimiter` 连接起来。
* `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
* `delimiter` 链接符
* `autoUpload` 是否选择完就自动开始上传？默认为 `true`
* `fileField` 默认 `file`, 如果你不想自己存储，则可以忽略此属性。
* `downloadUrl` 默认显示文件路径的时候会支持直接下载，可以支持加前缀如：`http://xx.dom/filename=` ，如果不希望这样，可以把当前配置项设置为 `false`。
* `useChunk` 默认为 'auto' amis 所在服务器，限制了文件上传大小不得超出10M，所以 amis 在用户选择大文件的时候，自动会改成分块上传模式。
* `chunkSize` 分块大小，默认为 5M.
* `startChunkApi` 默认 `/api/upload/startChunk` 想自己存储时才需要关注。
* `chunkApi` 默认 `/api/upload/chunk` 想自己存储时才需要关注。
* `finishChunkApi` 默认 `/api/upload/finishChunk` 想自己存储时才需要关注。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="250" scope="form-item"
{
  "type": "file",
  "name": "file",
  "label": "File",
  "maxSize": 1048576
}
```

### Matrix

矩阵类型的输入框。

* `type` 请设置成 `matrix`
* `columns` 列信息， 数组中 `label` 字段是必须给出的
* `rows` 行信息， 数组中 `label` 字段是必须给出的
* `rowLabel` 行标题说明
* `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。[详情](/docs/api#matrix)
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="250" scope="form-item"
{
  "type": "matrix",
  "name": "matrix",
  "label": "Matrix",
  "rowLabel": "行标题说明",
  "columns": [
    {
      "label": "列1"
    },
    {
      "label": "列2"
    }
  ],
  "rows": [
    {
      "label": "行1"
    },
    {
      "label": "行2"
    }
  ]
}
```

### Tree

树形结构输入框。

* `type` 请设置成 `tree`
* `options` 类似于 [select](#select) 中 `options`, 并且支持通过 `children` 无限嵌套。
* `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。[详情](/docs/api#tree)
* `hideRoot` 默认是会显示一个顶级，如果不想显示，请设置 `false`
* `rootLabel` 默认为 `顶级`，当 hideRoot 不为 `false` 时有用，用来设置顶级节点的文字。
* `showIcon` 是否显示投标，默认为 `true`。
* `showRadio` 是否显示单选按钮，multiple 为 `false` 是有效。
* `cascade` 设置成 `true` 时当选中父节点时不自动选择子节点。
* `withChildren` 是指成 `true`，选中父节点时，值里面将包含子节点的值，否则只会保留父节点的值。
* `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
* `joinValues` 默认为 `true`
 * 单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
 * 多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
* `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
* `delimiter` 默认为 `,`
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="300" scope="form-item"
{
  "type": "tree",
  "name": "tree",
  "label": "Tree",
  "options": [
    {
      "label": "Folder A",
      "value": 1,
      "children": [
        {
          "label": "file A",
          "value": 2
        },
        {
          "label": "file B",
          "value": 3
        }
      ]
    },
    {
      "label": "file C",
      "value": 4
    },
    {
      "label": "file D",
      "value": 5
    }
  ]
}
```

### TreeSelect

树形结构选择框。

* `type` 请设置成 `tree-select`
* `options` 类似于 [select](#select) 中 `options`, 并且支持通过 `children` 无限嵌套。
* `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。[详情](/docs/api#tree)
* `hideRoot` 默认是会显示一个顶级，如果不想显示，请设置 `false`
* `rootLabel` 默认为 `顶级`，当 hideRoot 不为 `false` 时有用，用来设置顶级节点的文字。
* `showIcon` 是否显示投标，默认为 `true`。
* `showRadio` 是否显示单选按钮，multiple 为 `false` 是有效。
* `cascade` 设置成 `true` 时当选中父节点时不自动选择子节点。
* `withChildren` 是指成 `true`，选中父节点时，值里面将包含子节点的值，否则只会保留父节点的值。
* `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
* `joinValues` 默认为 `true`
 * 单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
 * 多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
* `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
* `delimiter` 默认为 `,`
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="300" scope="form-item"
{
  "type": "tree-select",
  "name": "tree",
  "label": "Tree",
  "options": [
    {
      "label": "Folder A",
      "value": 1,
      "children": [
        {
          "label": "file A",
          "value": 2
        },
        {
          "label": "file B",
          "value": 3
        }
      ]
    },
    {
      "label": "file C",
      "value": 4
    },
    {
      "label": "file D",
      "value": 5
    }
  ]
}
```

### NestedSelect

树形结构选择框。

* `type` 请设置成 `nested-select`
* `options` 类似于 [select](#select) 中 `options`, 并且支持通过 `children` 无限嵌套。
* `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。[详情](/docs/api#tree)
* `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
* `joinValues` 默认为 `true`
 * 单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
 * 多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
* `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
* `delimiter` 默认为 `,`
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="300" scope="form-item"
{
  "type": "nested-select",
  "name": "nestedSelect",
  "label": "级联选择器",
  "size": "sm",
  "options": [
      {
          "label": "A",
          "value": "a"
      },
      {
          "label": "B",
          "value": "b",
          "children": [
              {
                  "label": "B-1",
                  "value": "b-1"
              },
              {
                  "label": "B-2",
                  "value": "b-2"
              },
              {
                  "label": "B-3",
                  "value": "b-3"
              }
          ]
      },
      {
          "label": "C",
          "value": "c"
      }
  ]
}
```

### Button

按钮, 包含 `button`、`submit` 和 `reset`。 字段说明。

* `type` 请设置成 `button`
* `label` 按钮文字
* `icon` 按钮图标。可以使用来自 fontawesome 的图标。
* `level` 按钮级别。 包含： `link`、`primary`、`success`、`info`、`warning`和`danger`。
* `size` 按钮大小。 包含： `xs`、`sm`、`md`和`lg`
* `className` 按钮的类名。

如果按钮是 `button` 类型，则还需要配置 [Action](#action) 中定义的属性，否则，AMis 不知道如何响应当前按钮点击。


```schema:height="300" scope="form"
[
  {
    "type": "text",
    "name": "test",
    "label": "Text"
  },

  {
    "type": "button",
    "label": "Button",
    "actionType": "dialog",
    "dialog": {
      "confirmMode": false,
      "title": "提示",
      "body": "对，你刚点击了！"
    }
  },

  {
    "type": "submit",
    "level": "primary",
    "label": "Submit"
  },

  {
    "type": "reset",
    "label": "Reset",
    "level": "danger"
  }
]
```

### Button-Toolbar

从上面的例子可以看出，当按钮独立配置的时候，是独占一行的，如果想让多个按钮在一起放置，可以利用 button-toolbar

* `type` 请设置成 `button-toolbar`
* `buttons` 按钮集合。

```schema:height="200" scope="form"
[
  {
    "type": "text",
    "name": "test",
    "label": "Text"
  },

  {
    "type": "button-toolbar",
    "buttons": [
      {
        "type": "button",
        "label": "Button",
        "actionType": "dialog",
        "dialog": {
          "confirmMode": false,
          "title": "提示",
          "body": "对，你刚点击了！"
        }
      },

      {
        "type": "submit",
        "label": "Submit"
      },

      {
        "type": "reset",
        "label": "Reset"
      }
    ]
  }
]
```

### Button-Group(FormItem)

按钮集合，直接看示例吧。

* `type` 请设置成 `button-group`
* `buttons` 配置按钮集合。

```schema:height="200" scope="form"
[
  {
    "type": "text",
    "name": "test",
    "label": "Text"
  },

  {
    "type": "button-toolbar",
    "buttons": [
      {
        "type": "button-group",
        "buttons": [
          {
            "type": "button",
            "label": "Button",
            "actionType": "dialog",
            "dialog": {
              "confirmMode": false,
              "title": "提示",
              "body": "对，你刚点击了！"
            }
          },

          {
            "type": "submit",
            "label": "Submit"
          },

          {
            "type": "reset",
            "label": "Reset"
          }
        ]
      },

      {
        "type": "submit",
        "icon": "fa fa-check text-success"
      },

      {
        "type": "reset",
        "icon": "fa fa-times text-danger"
      }
    ]
  }
]
```

button-group 有两种模式，除了能让按钮组合在一起，还能做类似于单选功能。

当不配置 buttons 属性时，就可以当复选框用。

* `options` 选项配置，类型为数组，成员格式如下。
    * `label` 文字
    * `value` 值
    * `image` 图片的 http 地址。
* `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。[详情](/docs/api#select)
* `multiple` 默认为 `false`, 设置成 `true` 表示可多选。
* `joinValues` 默认为 `true`
 * 单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
 * 多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
* `delimiter` 默认为 `,`
* `clearable` 默认为 `true`, 表示可以取消选中。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="250" scope="form"
[
    {
      "type": "button-group",
      "name": "select",
      "label": "单选",
      "options": [
        {
          "label": "Option A",
          "value": "a"
        },
        {
          "label": "Option B",
          "value": "b"
        }
      ]
    },

    {
      "type": "static",
      "name": "select",
      "label": "当前值"
    }
]
```

### Combo

组合模式，支持自由组合多个表单项。

* `type` 请设置成 `combo`
* `multiple` 默认为 `false` 配置是否为多选模式
* `controls` 配置组合成员，所有成员都是横向展示，可以是任意 [FormItem](#FormItem)
* `controls[x].columnClassName` 列的类名，可以用它配置列宽度。默认平均分配。
* `controls[x].unique` 设置当前列值是否唯一，即不允许重复选择。
* `maxLength` 当multiple为true的时候启用，设置可以最大项数。
* `flat` 默认为 `false`, 是否将结果扁平化(去掉name),只有当controls的length为1且multiple为true的时候才有效。
* `joinValues` 默认为 `true` 当扁平化开启的时候，是否用分隔符的形式发送给后端，否则采用array的方式。
* `delimiter` 当扁平化开启并且joinValues为true时，用什么分隔符。
* `multiLine` 默认是横着展示一排，设置以后竖着展示
* `addable` 是否可新增。
* `removable` 是否可删除
* `deleteApi` 如果配置了，则删除前会发送一个 api，请求成功才完成删除！
* `deleteConfirmText` 默认为 `确认要删除？`，当配置 `deleteApi` 才生效！删除时用来做用户确认！
* `draggable` 默认为 `false`, 是否可以拖动排序, 需要注意的是当启用拖动排序的时候，会多一个$id字段
* `draggableTip` 可拖拽的提示文字，默认为：`"可通过拖动每行中的【交换】按钮进行顺序调整"`
* `addButtonText` 新增按钮文字，默认为 `"新增"`。
* `minLength` 限制最小长度。
* `maxLength` 限制最大长度。
* `scaffold` 单条初始值。默认为  `{}`。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="450" scope="form"
[
{
  "type": "combo",
  "name": "combo",
  "label": "单选组合项",
  "controls": [
    {
      "name": "a",
      "type": "text"
    },
    {
      "name": "b",
      "type": "select",
      "options": ["a", "b", "c"]
    }
  ]
},
{
  "type": "static",
  "name": "combo",
  "label": "当前值"
},

{
  "type": "combo",
  "name": "combo2",
  "label": "多选组合项",
  "multiple": true,
  "draggable": true,
  "controls": [
    {
      "label": "字段1",
      "name": "a",
      "type": "text"
    },
    {
      "label": "字段2",
      "name": "b",
      "type": "select",
      "options": ["a", "b", "c"],
      "unique": true
    }
  ]
},
{
  "type": "static",
  "name": "combo2",
  "label": "当前值"
}
]
```

combo 多行模式。

```schema:height="450" scope="form"
[
{
  "type": "combo",
  "name": "combo",
  "label": "多选组合form",
  "multiple": true,
  "multiLine": true,
  "controls": [
      {
        "label": "字段1",
        "name": "a",
        "type": "text"
      },
      {
        "label": "字段2",
        "name": "b",
        "type": "select",
        "options": ["a", "b", "c"]
      }
    ]

},
{
  "type": "static",
  "name": "combo",
  "label": "当前值"
},

{
  "type": "combo",
  "name": "xxx",
  "label": "单选组合form",
  "multiLine": true,
  "controls": [
    {
      "name": "a",
      "type": "text"
    },
    {
      "name": "b",
      "type": "select",
      "options": ["a", "b", "c"]
    }
  ]
},
{
  "type": "static",
  "name": "xxx",
  "label": "当前值"
}

]
```

### Array

数组输入框配置

其实就是 [Combo](#combo) 的一个 flat 用法。

* `type` 请设置成 `array`
* `items` 配置单项表单类型
* `addable` 是否可新增。
* `removable` 是否可删除
* `draggable` 默认为 `false`, 是否可以拖动排序, 需要注意的是当启用拖动排序的时候，会多一个$id字段
* `draggableTip` 可拖拽的提示文字，默认为：`"可通过拖动每行中的【交换】按钮进行顺序调整"`
* `addButtonText` 新增按钮文字，默认为 `"新增"`。
* `minLength` 限制最小长度。
* `maxLength` 限制最大长度。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="450" scope="form"
[
  {
    "name": "array",
    "label": "颜色集合",
    "type": "array",
    "value": ["red"],
    "inline": true,
    "items": {
      "type": "color"
    }
  },

  {
    "type": "static",
    "name": "array",
    "label": "当前值"
  }
]
```

### SubForm

formItem 还可以是子表单类型。

* `type` 请设置成 `form`
* `multiple` 默认为 `false` 配置是否为多选模式
* `labelField` 当值中存在这个字段，则按钮名称将使用此字段的值来展示。
* `btnLabel` 按钮默认名称
* `minLength` 限制最小长度。
* `maxLength` 限制最大长度。
* `addButtonClassName` 新增按钮 CSS 类名 默认：`btn-success btn-sm`。
* `editButtonClassName` 修改按钮 CSS 类名 默认：`btn-info btn-addon btn-sm`。
* `form` 字表单的配置
  `title` 标题
  `controls` 请参考 [Form](#/form) 中的配置说明。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="400" scope="form"
[
{
  "type": "form",
  "name": "form",
  "label": "子Form",
  "btnLabel": "设置子表单",
  "form": {
    "title": "配置子表单",
    "controls": [
      {
        "name": "a",
        "label": "A",
        "type": "text"
      },

      {
        "name": "b",
        "label": "B",
        "type": "text"
      }
    ]
  }
},
{
  "type": "static",
  "name": "form",
  "label": "当前值"
},
{
  "type": "form",
  "name": "form2",
  "label": "多选",
  "multiple": true,
  "maxLength":3,
  "btnLabel": "设置子表单",
  "form": {
    "title": "配置子表单",
    "controls": [
      {
        "name": "a",
        "label": "A",
        "type": "text"
      },

      {
        "name": "b",
        "label": "B",
        "type": "text"
      }
    ]
  }
},
{
  "type": "static",
  "name": "form2",
  "label": "当前值"
}
]
```

### Picker

列表选取。可以静态数据，或者通过接口拉取动态数据。

* `type` 请设置成 `picker`
* `multiple` 是否为多选。
* `options` 选项配置，类型为数组，成员格式如下。
    * `label` 文字
    * `value` 值
* `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。[详情](/docs/api#select) 另外也可以用 `$xxxx` 来获取当前作用域中的变量。
* `joinValues` 默认为 `true`
 * 单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
 * 多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
* `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
* `delimiter` 默认为 `,`
* `modalMode` 设置 `dialog` 或者 `drawer`，用来配置弹出方式。
* `pickerSchema` 默认为 `{mode: 'list', listItem: {title: '${label}'}}`, 即用 List 类型的渲染，来展示列表信息。更多的玩法请参考 [CRUD](#crud) 的配置。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="300" scope="form-item"
{
  "type": "picker",
  "name": "type4",
  "joinValues": true,
  "valueField": "id",
  "labelField": "engine",
  "label": "多选",
  "source": "/api/sample",
  "size": "lg",
  "value": "4,5",
  "multiple": true,
  "pickerSchema": {
    "mode": "table",
    "name": "thelist",
    "quickSaveApi": "/api/sample/bulkUpdate",
    "quickSaveItemApi": "/api/sample/$id",
    "draggable": true,
    "headerToolbar": {
      "wrapWithPanel": false,
      "type": "form",
      "className": "text-right",
      "target": "thelist",
      "mode": "inline",
      "controls": [
        {
          "type": "text",
          "name": "keywords",
          "addOn": {
            "type": "submit",
            "label": "搜索",
            "level": "primary",
            "icon": "fa fa-search pull-left"
          }
        }
      ]
    },
    "columns": [
      {
        "name": "engine",
        "label": "Rendering engine",
        "sortable": true,
        "searchable": true,
        "type": "text",
        "toggled": true
      },
      {
        "name": "browser",
        "label": "Browser",
        "sortable": true,
        "type": "text",
        "toggled": true
      },
      {
        "name": "platform",
        "label": "Platform(s)",
        "sortable": true,
        "type": "text",
        "toggled": true
      },
      {
        "name": "version",
        "label": "Engine version",
        "quickEdit": true,
        "type": "text",
        "toggled": true
      },
      {
        "name": "grade",
        "label": "CSS grade",
        "quickEdit": {
          "mode": "inline",
          "type": "select",
          "options": [
            "A",
            "B",
            "C",
            "D",
            "X"
          ],
          "saveImmediately": true
        },
        "type": "text",
        "toggled": true
      },
      {
        "type": "operation",
        "label": "操作",
        "width": 100,
        "buttons": [
          {
            "type": "button",
            "icon": "fa fa-eye",
            "actionType": "dialog",
            "dialog": {
              "title": "查看",
              "body": {
                "type": "form",
                "controls": [
                  {
                    "type": "static",
                    "name": "engine",
                    "label": "Engine"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "static",
                    "name": "browser",
                    "label": "Browser"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "static",
                    "name": "platform",
                    "label": "Platform(s)"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "static",
                    "name": "version",
                    "label": "Engine version"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "static",
                    "name": "grade",
                    "label": "CSS grade"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "html",
                    "html": "<p>添加其他 <span>Html 片段</span> 需要支持变量替换（todo）.</p>"
                  }
                ]
              }
            }
          },
          {
            "type": "button",
            "icon": "fa fa-pencil",
            "actionType": "dialog",
            "dialog": {
              "position": "left",
              "size": "lg",
              "title": "编辑",
              "body": {
                "type": "form",
                "name": "sample-edit-form",
                "api": "/api/sample/$id",
                "controls": [
                  {
                    "type": "text",
                    "name": "engine",
                    "label": "Engine",
                    "required": true
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "text",
                    "name": "browser",
                    "label": "Browser",
                    "required": true
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "text",
                    "name": "platform",
                    "label": "Platform(s)",
                    "required": true
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "text",
                    "name": "version",
                    "label": "Engine version"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "select",
                    "name": "grade",
                    "label": "CSS grade",
                    "options": [
                      "A",
                      "B",
                      "C",
                      "D",
                      "X"
                    ]
                  }
                ]
              }
            }
          },
          {
            "type": "button",
            "icon": "fa fa-times text-danger",
            "actionType": "ajax",
            "confirmText": "您确认要删除?",
            "api": "delete:/api/sample/$id"
          }
        ],
        "toggled": true
      }
    ]
  }
}
```

### Service(FormItem)

目前看到的配置方式都是静态配置，如果你想动态配置，即配置项由接口决定，那么就使用此渲染器。

* `type` 请设置成 `service`。
* `api` 数据接口
* `initFetch` 初始是否拉取
* `schemaApi` 配置接口，即由接口返回内容区的配置信息。
  正常期待返回是一个渲染器的配置如： 

  ```json
  {
    "type": "tpl",
    "tpl": "这是内容。"
  }
  ```

  但是，由于是在 form 里面，支持返回

  ```json
  {
    "controls": [
      // 表单项配置
    ]
  }
  ```
* `initFetchSchema` 是否初始拉取配置接口。
* `name` 取个名字方便别的组件与之交互。比如某个按钮的 target 设置成次 name, 则会触发重新拉取。
* `body` 内容容器，如果配置 schemaApi 则不需要配置，否则不配置的话，就没有内容展现。

```schema:height="300" scope="form"
[
  {
    "name": "tpl",
    "type": "select",
    "label": "模板",
    "inline": true,
    "required": true,
    "value": "tpl1",
    "options": [
      {
        "label": "模板1",
        "value": "tpl1"
      },
      {
        "label": "模板2",
        "value": "tpl2"
      },
      {
        "label": "模板3",
        "value": "tpl3"
      }
    ]
  },
  {
    "type": "service",
    "className": "m-t",
    "initFetchSchemaOn": "data.tpl",
    "schemaApi": "/api/mock2/service/form?tpl=$tpl"
  }
]
```


### Formula

公式类型，可以设置公式，并将结果设置给目标值。

* `type` 请设置成 `formula`
* `name` 这是变量名，公式结果将作用到此处指定的变量中去。
* `formula` 公式。如： `data.var_a + 2`，其实就是 JS 表达式。
* `condition` 作用条件。有两种写法
  * 用 tpl 语法，把关联的字段写上如： `${xxx} ${yyy}` 意思是当 xxx 和 yyy 的取值结果变化了就再应用一次公式结果。
  * 自己写判断如: `data.xxx == "a" && data.xxx !== data.__prev.xxx` 当 xxx 变化了，且新的值是字符 "a" 时应用，可以写更加复杂的判断。
* `initSet` 初始化时是否设置。默认是 `true`
* `autoSet` 观察公式结果，如果计算结果有变化，则自动应用到变量上。默认为 `true`。
* `id` 定义个名字，当某个按钮的目标指定为此值后，会触发一次公式应用。这个机制可以在  `autoSet` 为 false 时用来手动触发。
  > 为什么不是设置 `name`? 
  因为 name 值已经用来设置目标变量名了，这个表单项肯定已经存在了，所以不是唯一了，不能够被按钮指定。

```schema:height="300" scope="form"
[
  {
    "type": "number",
    "name": "a",
    "label": "A"
  },
  {
    "type": "number",
    "name": "b",
    "label": "B"
  },
  {
    "type": "number",
    "name": "sum",
    "label": "和",
    "disabled": true,
    "description": "自动计算 A + B"
  },
  {
    "type": "formula",
    "name": "sum",
    "value": 0,
    "formula": "a + b"
  }
]
```

### Group

表单项集合中，默认都是一行一个，如果想要一行多个，请用 Group 包裹起来。

* `type` 请设置成 `group`
* `controls` 表单项集合。
* `mode` 展示默认，跟 [Form](#form) 中的模式一样，选择： `normal`、`horizontal`或者`inline`。
* `horizontal` 当为水平模式时，用来控制左右占比。
* `horizontal.label` 左边 label 的宽度占比。
* `horizontal.right` 右边控制器的宽度占比。
* `horizontal.offset` 当没有设置 label 时，右边控制器的偏移量。
* `className` CSS 类名。

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

### FieldSet

多个输入框可以通过 fieldSet 捆绑在一起。

* `type` 请设置成 `fieldSet`
* `title` 标题
* `controls` 表单项集合。
* `mode` 展示默认，跟 [Form](#form) 中的模式一样，选择： `normal`、`horizontal`或者`inline`。
* `horizontal` 当为水平模式时，用来控制左右占比。
* `horizontal.label` 左边 label 的宽度占比。
* `horizontal.right` 右边控制器的宽度占比。
* `horizontal.offset` 当没有设置 label 时，右边控制器的偏移量。
* `collapsable` 配置是否可折叠，默认为 `true`。
* `collapsed` 默认是否折叠。
* `className` CSS 类名
* `headingClassName` 标题 CSS 类名
* `bodyClassName` 内容区域 CSS 类名

```schema:height="500" scope="form"
[
  {
    "type": "fieldSet",
    "title": "基本配置",
    "controls": [
      {
        "name": "a",
        "type": "text",
        "label": "文本1"
      },

      {
        "name": "a",
        "type": "text",
        "label": "文本2"
      }
    ]
  },

  {
    "type": "fieldSet",
    "title": "其他配置",
    "collapsed": true,
    "controls": [
      {
        "name": "c",
        "type": "text",
        "label": "文本3"
      },

      {
        "name": "d",
        "type": "text",
        "label": "文本4"
      }
    ]
  }
]
```

### Tabs(FormItem)

多个输入框也可以通过选项卡来分组。

* `type` 请设置成 `tabs`
* `tabs` 选项卡数组
* `tabs[x].title` 标题
* `tabs[x].controls` 表单项集合。
* `tabs[x].body` 内容容器，跟 `controls` 二选一。 
* `tabClassName` 选项卡 CSS 类名。

```schema:height="500" scope="form-item"
{
  "type": "tabs",
  "tabs": [
    {
      "title": "基本配置",
      "controls": [
        {
          "name": "a",
          "type": "text",
          "label": "文本1"
        },

        {
          "name": "a",
          "type": "text",
          "label": "文本2"
        }
      ]
    },

    {
      "title": "其他配置",
      "controls": [
        {
          "name": "c",
          "type": "text",
          "label": "文本3"
        },

        {
          "name": "d",
          "type": "text",
          "label": "文本4"
        }
      ]
    }
  ]
}
```


### Table(FormItem)

可以用来展现数据的,可以用来展示数组类型的数据，比如multiple的[子form](#SubForm)。

* `type` 请设置成 `table`
* `columns` 数组类型，用来定义列信息。

```schema:height="250" scope="form"
[
    {
    "type": "form",
    "name": "form",
    "label": "子Form",
    "btnLabel": "设置子表单",
    "multiple": true,
    "form": {
      "title": "配置子表单",
      "controls": [
        {
          "name": "a",
          "label": "A",
          "type": "text"
        },
        {
          "name": "b",
          "label": "B",
          "type": "text"
        }
      ]
    }
  },
  {
    "type":"table",
    "name":"form",
    "columns":[
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
    ]
  }
]
```

当然也可以用来作为表单输入。

| 属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"table"`  |   指定为 Table 渲染器 |
| addable | `boolean` | false |  是否可增加一行 |
| editable | `boolean` | false |  是否可编辑 |
| removable | `boolean` | false |  是否可删除 |
| addApi | [api](#api) | - |  新增时提交的API |
| updateApi | [api](#api) | - |  修改时提交的API |
| deleteApi | [api](#api) | - |  删除时提交的API |
| addBtnLabel | `string` |  |  增加按钮名称 |
| addBtnIcon | `string` | `"fa fa-plus"` |  增加按钮图标 |
| updateBtnLabel | `string` | `""` |  更新按钮名称 |
| updateBtnIcon | `string` | `"fa fa-pencil"` |  更新按钮图标 |
| deleteBtnLabel | `string` | `""` |  删除按钮名称 |
| deleteBtnIcon | `string` | `"fa fa-minus"` |  删除按钮图标 |
| confirmBtnLabel | `string` | `""` |  确认编辑按钮名称 |
| confirmBtnIcon | `string` | `"fa fa-check"` |  确认编辑按钮图标 |
| cancelBtnLabel | `string` | `""` |  取消编辑按钮名称 |
| cancelBtnIcon | `string` | `"fa fa-times"` |  取消编辑按钮图标 |
| columns | `array` | [] |  列信息 |
| columns[x].quickEdit | `boolean` 或者 `object` | - |  配合editable为true一起使用 |
| columns[x].quickEditOnUpdate | `boolean` 或者 `object` | - |  可以用来区分新建模式和更新模式的编辑配置 |

* 更多配置请参考 [FormItem](#FormItem)
* 更多Demo详情请参考 [表格编辑](/docs/examples/form/table)

```schema:height="250" scope="form-item"
{
    "type":"table",
    "name":"form",
    "editable": true,
    "addable": true,
    "removable": true,
    "label": "表格输入",
    "columns":[
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B",
          "quickEdit": {
            "type": "select",
              "options": [
                {
                  "label": "A",
                  "value": "a"
                },
                {
                  "label": "B",
                  "value": "b"
                }
              ]
          }
        }
    ]
  }
```

### Repeat

可用来设置重复频率

* `type` 请设置成 `repeat`
* `options` 默认: `hourly,daily,weekly,monthly`， 可用配置 `secondly,minutely,hourly,daily,weekdays,weekly,monthly,yearly`
* `placeholder` 默认为 `不重复`, 当不指定值时的说明。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="300" scope="form-item"
{
  "type": "repeat",
  "name": "repeat",
  "label": "重复频率"
}
```

### Rich-Text

富文本编辑器

* `type` 请设置成 `rich-text`
* `saveAsUbb` 是否保存为 ubb 格式
* `reciever` 默认的图片保存 API `/api/upload/image`
* `size` 框的大小，可以设置成 `md` 或者 `lg` 来增大输入框。
* `buttons` 默认为

  ```js
  [
    'paragraphFormat', 'quote', 'color', '|',
    'bold', 'italic', 'underline', 'strikeThrough', '|',
    'formatOL', 'formatUL', 'align', '|',
    'insertLink', 'insertImage', 'insertTable', '|',
    'undo', 'redo', 'html'
  ]
  ```
* `options` Object 类型，给富文本的配置信息。请参考  https://www.froala.com/wysiwyg-editor/docs/options
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="350" scope="form-item"
{
  "type": "rich-text",
  "name": "html",
  "label": "Rich Text"
}
```
### Editor
### XXX-Editor

* `type` 请设置成 `editor` 或者 `bat-editor`、`c-editor`、`coffeescript-editor`、`cpp-editor`、`csharp-editor`、`css-editor`、`dockerfile-editor`、`fsharp-editor`、`go-editor`、`handlebars-editor`、`html-editor`、`ini-editor`、`java-editor`、`javascript-editor`、`json-editor`、`less-editor`、`lua-editor`、`markdown-editor`、`msdax-editor`、`objective-c-editor`、`php-editor`、`plaintext-editor`、`postiats-editor`、`powershell-editor`、`pug-editor`、`python-editor`、`r-editor`、`razor-editor`、`ruby-editor`、`sb-editor`、`scss-editor`、`sol-editor`、`sql-editor`、`swift-editor`、`typescript-editor`、`vb-editor`、`xml-editor`、`yaml-editor`。
* `language` 默认为 `javascript` 当 `type` 为 `editor` 的时候有用。
* 更多配置请参考 [FormItem](#FormItem)

```schema:height="350" scope="form-item"
{
  "type": "json-editor",
  "name": "json",
  "label": "Json Editor"
}
```

### Diff-Editor

* `type` 请设置成 `diff-editor`
* `language` 默认为 `javascript` 当 `type` 为 `diff-editor` 的时候有用
* `diffValue` 设置左侧编辑器的值，支持`${xxx}`获取变量
* `disabled` 配置 **右侧编辑器** 是否可编辑，**左侧编辑器**始终不可编辑
* 更多配置请参考 [FormItem](#FormItem)

PS: 当用作纯展示时，可以通过`value`配置项，设置右侧编辑器的值

```schema:height="350" scope="form-item"
{
  "type": "diff-editor",
  "name": "diff",
  "diffValue": "hello world",
  "label": "Diff-Editor"
}
```

### Static

纯用来展现数据的。

* `type` 请设置成 `static`
* `name` 变量名。
* `value` 值，可以通过它设置默认值。
* `label` 描述标题，当表单为水平布局时，左边即便是不设置 label 为了保持对齐也会留空，如果想要去掉空白，请设置成 `false`。
* `description` 描述内容。
* `placeholder` 占位内容，默认 `-`。
* `inline` 是否为 inline 模式。
* `className` 表单最外层类名。
* `visible` 是否可见。
* `visibleOn` 通过[表达式](#表达式)来配置当前表单项是否显示。
* `hidden` 是否隐藏，不要跟 `visible` `visibleOn` 同时配置
* `hiddenOn` 通过[表达式](#表达式)来配置当前表单项是否隐藏。
* `inputClassName` 表单控制器类名。
* `labelClassName` label 的类名。
* `tpl` 如果想一次展示多条数据，可以考虑用 `tpl`，模板引擎是 lodash template，同时你还可以简单用 `$` 取值。 具体请查看 [tpl](#tpl)

```schema:height="250" scope="form-item"
{
  "type": "static",
  "name": "select",
  "label": "Label",
  "value": "A"
}
```

### Static-XXX

* `type` 请设置成 `static-tpl`、`static-plain`、`static-json`、`static-date`、`static-datetime`、`static-time`、`static-mapping`、`static-image`、`static-progress`、`static-status`或者`static-switch`

纯用来展示数据的，用法跟crud里面的[Column](#column)一样, 且支持 quickEdit 和 popOver 功能。

```schema:height="250" scope="form-item"
{
  "type": "static-json",
  "name": "json",
  "label": "Label",
  "value": {
    "a":"dd",
    "b":"asdasd"
  }
}
```

### HBox(FormItem)

支持 form 内部再用 HBox 布局，实现左右排列。没错用 [Group](#group) 也能实现，所以还是推荐用 [Group](#group)。

* `type` 请设置成 `hbox`
* `columns` 数据，用来配置列内容。每个 column 又一个独立的渲染器。
* `columns[x].columnClassName` 配置列的 `className`。
* `columns[x].controls` 如果配置了表单集合，同时没有指定 type 类型，则优先展示表单集合。

```schema:height="200" scope="form-item"
{
  "type": "hbox",
  "columns": [
    {
        "columnClassName": "w-sm",
        "controls": [
            {
                "name": "text",
                "type": "text",
                "label": false,
                "placeholder": "Text"
            }
        ]
    },

    {
        "type": "tpl",
         "tpl": "其他类型的渲染器"
    }
  ]
}
```

### Grid(FormItem)

支持 form 内部再用 grid 布局。

* `type` 请设置成 `grid`
* `columns` 数据，用来配置列内容。每个 column 又一个独立的渲染器。
* `columns[x].columnClassName` 配置列的 `className`。
* `columns[x].controls` 如果配置了表单集合，同时没有指定 type 类型，则优先展示表单集合。
* `columns[x].xs` 设置极小屏幕宽度占比 1 - 12。
* `columns[x].xsHidden` 设置极小屏幕是否隐藏。
* `columns[x].xsOffset` 设置极小屏幕偏移量 1 - 12。
* `columns[x].xsPull` 设置极小屏幕靠左的距离占比：1 - 12 。
* `columns[x].xsPush` 设置极小屏幕靠右的距离占比：1 - 12 。
* `columns[x].sm` 设置小屏幕宽度占比 1 - 12。
* `columns[x].smHidden` 设置小屏幕是否隐藏。
* `columns[x].smOffset` 设置小屏幕偏移量 1 - 12。
* `columns[x].smPull` 设置小屏幕靠左的距离占比：1 - 12 。
* `columns[x].smPush` 设置小屏幕靠右的距离占比：1 - 12 。
* `columns[x].md` 设置平板屏幕宽度占比 1 - 12。
* `columns[x].mdHidden` 设置平板屏幕是否隐藏。
* `columns[x].mdOffset` 设置平板屏幕偏移量 1 - 12。
* `columns[x].mdPull` 设置平板屏幕靠左的距离占比：1 - 12 。
* `columns[x].mdPush` 设置平板屏幕靠右的距离占比：1 - 12 。
* `columns[x].lg` 设置PC屏幕宽度占比 1 - 12。
* `columns[x].lgHidden` 设置PC屏幕是否隐藏。
* `columns[x].lgOffset` 设置PC屏幕偏移量 1 - 12。
* `columns[x].lgPull` 设置PC屏幕靠左的距离占比：1 - 12 。
* `columns[x].lgPush` 设置PC屏幕靠右的距离占比：1 - 12 。

```schema:height="200" scope="form-item"
{
  "type": "grid",
  "columns": [
    {
        "md": 3,
        "controls": [
            {
                "name": "text",
                "type": "text",
                "label": false,
                "placeholder": "Text"
            }
        ]
    },

    {
        "md": 9,
        "type": "tpl",
         "tpl": "其他渲染器类型"
    }
  ]
}
```

### Panel(FormItem)

还是为了布局，可以把一部分 [FormItem](#formItem) 合并到一个 panel 里面单独展示。

* `title` panel 标题
* `body` [Container](#container) 可以是其他渲染模型。
* `bodyClassName` body 的 className.
* `footer` [Container](#container) 可以是其他渲染模型。
* `footerClassName` footer 的 className.
* `controls` 跟 `body` 二选一，如果设置了 controls 优先显示表单集合。

```schema:height="400" scope="form-item"
{
  "type": "hbox",
  "columns": [
    {
        "controls": [
            {
                "name": "text",
                "type": "text",
                "label": false,
                "placeholder": "Text"
            }
        ]
    },

    {
         "columnClassName": "w-xl",
         "controls": [
            {
                "type": "panel",
                "title": "bla bla",
                "controls": [
                    {
                        "name": "text",
                        "type": "text",
                        "label": false,
                        "placeholder": "Text 1"
                    },

                    {
                        "name": "text2",
                        "type": "text",
                        "label": false,
                        "placeholder": "Text 2"
                    }
                ]
            }
        ]
    }
  ]
}
```

## Wizard

表单向导，能够配置多个步骤引导用户一步一步完成表单提交。

* `type` 请设置 `wizard`。
* `mode` 展示模式，请选择：`horizontal` 或者 `vertical`，默认为 `horizontal`。
* `api` 最后一步保存的接口。
* `initApi` 初始化数据接口。
* `initFetch` 初始是否拉取数据。
* `initFetchOn` 初始是否拉取数据，通过表达式来配置。
* `actionPrevLabel` 上一步按钮名称，默认：`上一步`。
* `actionNextLabel` 下一步按钮名称`下一步`。
* `actionNextSaveLabel` 保存并下一步按钮名称，默认：`保存并下一步`。
* `actionFinishLabel` 完成按钮名称，默认：`完成`。
* `className` 外层 CSS 类名。
* `actionClassName` 按钮 CSS 类名，默认：`btn-sm btn-default`。
* `reload` 操作完后刷新目标对象。请填写目标组件设置的 name 值，如果填写为 `window` 则让当前页面整体刷新。
* `redirect` 操作完后跳转。
* `target` 可以把数据提交给别的组件而不是自己保存。请填写目标组件设置的 name 值，如果填写为 `window` 则把数据同步到地址栏上，同时依赖这些数据的组件会自动重新刷新。
* `steps` 数组，配置步骤信息。
* `steps[x].title` 步骤标题。
* `steps[x].mode` 展示默认，跟 [Form](#form) 中的模式一样，选择： `normal`、`horizontal`或者`inline`。
* `steps[x].horizontal` 当为水平模式时，用来控制左右占比。
* `steps[x].horizontal.label` 左边 label 的宽度占比。
* `steps[x].horizontal.right` 右边控制器的宽度占比。
* `steps[x].horizontal.offset` 当没有设置 label 时，右边控制器的偏移量。
* `steps[x].api` 当前步骤保存接口，可以不配置。
* `steps[x].initApi` 当前步骤数据初始化接口。
* `steps[x].initFetch` 当前步骤数据初始化接口是否初始拉取。
* `steps[x].initFetchOn` 当前步骤数据初始化接口是否初始拉取，用表达式来决定。
* `steps[x].controls` 当前步骤的表单项集合，请参考 [FormItem](#formitem)。


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

## Tpl

tpl 类型的渲染器支持用 JS 模板引擎来组织输出，采用的 lodash 的 [template](https://lodash.com/docs/4.15.0#template)，关于语法部分，请前往 lodash 文档页面。

```schema:height="200"
{
  "data": {
    "user": "no one"
  },
  "body": {
    "type": "tpl",
    "tpl": "User: <%= data.user%>"
  }
}
```

可用 js 方法。

* `formatDate(value, format='LLL', inputFormat='')` 格式化时间格式，关于 format 请前往 [moment](http://momentjs.com/) 文档页面。
* `formatTimeStamp(value, format='LLL')` 格式化时间戳为字符串。
* `formatNumber(number)` 格式化数字格式，加上千分位。
* `countDown(value)` 倒计时，显示离指定时间还剩下多少天，只支持时间戳。
* 下面 filters 中的方法也可以使用如： `<%= date(data.xxx, 'YYYY-MM-DD')%>`
* 可以联系我们添加更多公用方法。

如：

```json
{
  "data": {
    "user": "no one"
  },
  "body": {
    "type": "tpl",
    "tpl": "User: <%= formatDate(data.time, 'YYYY-MM-DD') %>"
  }
}
```

如果只想简单取下变量，可以用 `$xxx` 或者 `${xxx}`。同时如果不指定类型，默认就是 `tpl`, 所以以上示例可以简化为。

> 取值支持多级，如果层级比较深可以用 `.` 来分割如： `${xx.xxx.xx}`
> 另外 `$&` 表示直接获取当前的 `data`。

```schema:height="200"
{
  "data": {
    "user": "no one"
  },
  "body": "User: $user"
}
```

通过  `$xxx` 取到的值，默认是不做任何处理，如果希望把 html 转义了的，请使用：`${xxx | html}`。

从上面的语法可以看出来，取值时是支持指定 filter 的，那么有哪些 filter 呢？

* `html` 转义 html 如：`${xxx|html}`。
* `json` json stringify。
* `raw` 表示不转换, 原样输出。
* `date` 做日期转换如： `${xxx | date:YYYY-MM-DD}`
* `number` 自动给数字加千分位。`${xxx | number}` `9999` => `9,999`
* `trim` 把前后多余的空格去掉。
* `percent` 格式化成百分比。`${xxx | percent}` `0.8232343` => `82.32%`
* `round` 四舍五入取整。
* `truncate` 切除， 当超出 200 个字符时，后面的部分直接显示 ...。 `${desc | truncate:500:...}`
* `url_encode` 做 url encode 转换。
* `url_decode` 做 url decode 转换。
* `default` 当值为空时，显示其他值代替。 `${xxx | default:-}` 当为空时显示 `-`
* `join` 当值是 array 时，可以把内容连起来。${xxx | join:,}
* `first` 获取数组的第一个成员。
* `last` 获取数组的最后一个成员。
* `pick` 如果是对象则从当前值中再次查找值如： `${xxx|pick:yyy}` 等价于 `${xxx.yyy}`。如果是数组，则做 map 操作，操作完后还是数组，不过成员已经变成了你选择的东西。
* `ubb2html` 我想你应该不需要，贴吧定制的 ubb 格式。
* `html2ubb` 我想你应该不需要，贴吧定制的 ubb 格式。
* `split` 可以将字符传通过分隔符分离成数组，默认分隔符为 `,` 如： `${ids|split|last}` 即取一段用逗号分割的数值中的最后一个。
* `nth` 取数组中的第 n 个成员。如： `${ids|split|nth:1}`
* `str2date` 请参考 [date](#date) 中日期默认值的设置格式。
* `duration` 格式化成时间端如：`2` -=> `2秒` `67` => `1分7秒`  `1111111` => `13天21时39分31秒`
* `asArray` 将数据包成数组如： `a` => `[a]`
* `lowerCase` 转小写
* `upperCase` 转大写
* `base64Encode` base64 转码
* `base64Decode` base64 解码

组合使用。

* `${&|json|html}` 把当前可用的数据全部打印出来。$& 取当前值，json 做 json stringify，然后 html 转义。
* `${rows:first|pick:id}` 把 rows 中的第一条数据中的 id 取到。
* `${rows|pick:id|join:,}`



## Plain

plain, 单纯的文字输出来。

```schema:height="200"
{
  "body": {
    "type": "plain",
    "text": "Pure Text <html>"
  }
}
```

## Html

html, 当需要用到变量时，请用 [Tpl](#tpl) 代替。

```schema:height="200"
{
  "body": {
    "type": "html",
    "html": "支持 Html <code>Html</code>"
  }
}
```

## Action

Action 是一种特殊的渲染器，它本身是一个按钮，同时它能触发事件。

* `type` 指定为 `button`。
* `actionType` 【必填】 选项：`ajax`、`link`、`url`、`dawer`、`dialog`、`confirm`、`cancel`、`prev`、`next`、`copy` 或者 `close`。
* `api` 当 `actionType` 为 `ajax` 时，必须指定，参考 [api](#api) 格式说明。
* `link` 当 `actionType` 为 `link` 时必须指定，用来指定跳转地址，跟 url 不同的是，这是单页跳转方式，不会渲染浏览器，请指定 AMis 平台内的页面。
* `url` 当 `actionType` 为 `url` 时必须指定，按钮点击后，会打开指定页面。
* `blank` 当 `actionType` 为 `url` 时可选，如果为false将在本页面打开。
* `dialog` 当 `actionType` 为 `dialog` 时用来指定弹框内容。
* `dawer` 当 `actionType` 为 `drawer` 时用来指定抽出式弹框内容。
* `copy` 当 `actionType` 为 `copy` 时用来指定复制的内容。
* `nextCondition` 当 `actionType` 为 `dialog` 时可以用来设置下一条数据的条件，默认为 `true`。详情请见 [Demo](/docs/demo/crud/next)。
* `confirmText` 当设置 `confirmText` 后，操作在开始前会询问用户。
* `reload` 指定此次操作完后，需要刷新的目标组件名字（组件的 name 指，自己配置的），多个请用 `,` 号隔开。
* `feedback` 如果 ajax 类型的，当 ajax 返回正常后，还能接着弹出一个 dialog 做其他交互。返回的数据可用于这个 dialog 中。
* `messages`，actionType 为 `ajax` 时才有用。
  * `success` ajax 操作成功后提示，可以不指定，不指定时以 api 返回为准。
  * `failed` ajax 操作失败提示。

示例：

* `ajax` 当按钮点击时，发送 ajax 请求，发送的数据取决于所在的容器里面。

  ```schema:height="200"
  {
    "data": {
      "user": "no one"
    },
    "body": {
      "label": "Post",
      "type": "button",
      "actionType": "ajax",
      "confirmText": "确定？",
      "api": "/api/mock2/form/saveForm",
      "messages": {
        "success": "发送成功"
      }
    }
  }
  ```
* `link` 当按钮点击后，无刷新进入 AMis 内部某个页面。

  ```schema:height="200"
    {
      "body": {
        "label": "进入简介页面",
        "type": "button",
        "level": "info",
        "actionType": "link",
        "link": "/docs/index"
      }
    }
    ```
* `url` 当按钮点击后，新窗口打开指定页面。

  ```schema:height="200"
    {
      "body": {
        "label": "打开 Baidu",
        "type": "button",
        "level": "success",
        "actionType": "url",
        "url": "raw:http://www.baidu.com"
      }
    }
    ```
* `dialog` 当按钮点击后，弹出一个对话框。 关于 dialog 配置，请查看 [Dialog 模型](#dialog)。

  ```schema:height="200"
    {
      "body": {
        "label": "Dialog Form",
        "type": "button",
        "level": "primary",
        "actionType": "dialog",
        "dialog": {
          "title": "表单设置",
          "body": {
            "type": "form",
            "api": "/api/mock2/form/saveForm?waitSeconds=1",
            "controls": [
              {
                "type": "text",
                "name": "text",
                "label": "文本"
              }
            ]
          }
        }
      }
    }
    ```

* `drawer` 当按钮点击后，弹出一个抽出式对话框。 关于 drawer 配置，请查看 [Drawer 模型](#drawer)。

  ```schema:height="200"
    {
      "body": {
        "label": "Drawer Form",
        "type": "button",
        "level": "primary",
        "actionType": "drawer",
        "drawer": {1
          "title": "表单设置",
          "body": {
            "type": "form",
            "api": "/api/mock2/form/saveForm?waitSeconds=1",
            "controls": [
              {
                "type": "text",
                "name": "text",
                "label": "文本"
              }
            ]
          }
        }
      }
    }
    ```

## Dialog

Dialog 由 [Action](#action) 触发。他是一个类似于 [Page](#page) 的容器模型。

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|
| type | `string` |  |  `"dialog"` 指定为 Dialog 渲染器 |
| title | `string` 或者 [Container](#Container) |  |  弹出层标题 |
| body | [Container](#Container) |  | 往 Dialog 内容区加内容 |
| size | `string` |  | 指定 dialog 大小，支持: `xs`、`sm`、`md`、`lg` |
| bodyClassName | `string` | `modal-body` | Dialog body 区域的样式类名 |
| closeOnEsc | `boolean` | `false` | 是否支持按 `Esc` 关闭 Dialog |
| disabled | `boolean` | `false` | 如果设置此属性，则该 Dialog 只读没有提交操作。 |
| actions | Array Of [Action](#action) |  | 可以不设置，默认只有【确认】和【取消】两个按钮。|

```schema:height="200"
{
  "body": {
    "label": "弹出",
    "type": "button",
    "level": "primary",
    "actionType": "dialog",
    "dialog": {
      "title": "表单设置",
      "body": {
        "type": "form",
        "api": "/api/mock2/form/saveForm?waitSeconds=1",
        "controls": [
          {
            "type": "text",
            "name": "text",
            "label": "文本"
          }
        ]
      }
    }
  }
}
```

## Drawer

Drawer 由 [Action](#action) 触发。

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` |  |  `"drawer"` 指定为 Drawer 渲染器 |
| title | `string` 或者 [Container](#Container) |  |  弹出层标题 |
| body | [Container](#Container) |  | 往 Dialog 内容区加内容 |
| size | `string` |  | 指定 dialog 大小，支持: `xs`、`sm`、`md`、`lg` |
| bodyClassName | `string` | `modal-body` | Dialog body 区域的样式类名 |
| closeOnEsc | `boolean` | `false` | 是否支持按 `Esc` 关闭 Dialog |
| overlay | `boolean` | `true` | 是否显示蒙层 |
| resizable | `boolean` | `false` | 是否可通过拖拽改变 Drawer 大小 |
| actions | Array Of [Action](#action) |  | 可以不设置，默认只有【确认】和【取消】两个按钮。|

```schema:height="200"
{
  "body": {
    "label": "弹出",
    "type": "button",
    "level": "primary",
    "actionType": "drawer",
    "drawer": {
      "title": "表单设置",
      "body": {
        "type": "form",
        "api": "/api/mock2/form/saveForm?waitSeconds=1",
        "controls": [
          {
            "type": "text",
            "name": "text",
            "label": "文本"
          }
        ]
      }
    }
  }
}
```

## CRUD

增删改查模型，主要用来展现列表，并支持各类【增】【删】【改】【查】的操作。复杂示例请前往 [Demo](/docs/demo/crud/table)。

CRUD 支持三种模式：`table`、`cards`、`list`，默认为 `table`。

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` |  |  `"crud"` 指定为 CRUD 渲染器 |
| mode | `string` | `"table"` |  `"table" 、 "cards" 或者 "list"` |
| title | `string` | `""`  |  可设置成空，当设置成空时，没有标题栏 |
| className | `string` |  |  表格外层 Dom 的类名 |
| api | [Api](#api) |  | CRUD 用来获取列表数据的 api。[详情](/docs/api#crud) |
| filter | [Form](#form) |  | 设置过滤器，当该表单提交后，会把数据带给当前 crud 刷新列表。 |
| initFetch | `boolean` | `true` | 是否初始化的时候拉取数据, 只针对有filter的情况, 没有filter初始都会拉取数据 |
| interval | `number` | `3000` | 刷新时间(最低3000) |
| silentPolling | `boolean` | `false` | 配置刷新时是否显示加载动画 |
| stopAutoRefreshWhen | `string` | `""` | 通过[表达式](#表达式)来配置停止刷新的条件 |
| syncLocation | `boolean` | `true` | 是否将过滤条件的参数同步到地址栏 |
| draggable | `boolean` | `false` | 是否可通过拖拽排序 |
| itemDraggableOn | `boolean` |  | 用[表达式](#表达式)来配置是否可拖拽排序 |
| saveOrderApi | [Api](#api) |  | 保存排序的 api。[详情](/docs/api#crud)  |
| quickSaveApi | [Api](#api) |  | 快速编辑后用来批量保存的 API。[详情](/docs/api#crud)  |
| quickSaveItemApi | [Api](#api) |  | 快速编辑配置成及时保存时使用的 API。[详情](/docs/api#crud)  |
| bulkActions | Array Of [Action](#action) |  | 批量操作列表，配置后，表格可进行选中操作。 |
| defaultChecked | `boolean` | `false` | 当可批量操作时，默认是否全部勾选。 |
| messages | `Object` |  | 覆盖消息提示，如果不指定，将采用 api 返回的 message |
| messages.fetchFailed | `string` |  | 获取失败时提示 |
| messages.saveOrderFailed | `string` |  | 保存顺序失败提示 |
| messages.saveOrderSuccess | `string` |  | 保存顺序成功提示 |
| messages.quickSaveFailed | `string` |  | 快速保存失败提示 |
| messages.quickSaveSuccess | `string` |  | 快速保存成功提示 |
| primaryField | `string` | `"id"` | 设置 ID 字段名。 |
| defaultParams | `Object` |  | 设置默认filter默认参数，会在查询的时候一起发给后端 |
| pageField | `string` | `"page"` | 设置分页页码字段名。 |
| perPageField | `string` | `"perPage"` | 设置分页一页显示的多少条数据的字段名。注意：最好与defaultParams一起使用，请看下面例子。 |
| orderField | `string` |  | 设置用来确定位置的字段名，设置后新的顺序将被赋值到该字段中。 |
| headerToolbar | Array | `['bulkActions', 'pagination']` | 顶部工具栏配置 |
| footerToolbar | Array | `['statistics', 'pagination']` | 顶部工具栏配置 |

### Table(CRUD)

在 CRUD中的 Table 主要增加了 Column 里面的以下配置功能，更多参数，请参考[Table](#table)

* `sortable` 开启后可以根据当前列排序(后端排序)。

```schema:height="800" scope="body"
{
    "type": "crud",
    "api": "/api/sample",
    "syncLocation": false,
    "title": null,
    "perPageField":"rn",
    "defaultParams":{
        "rn": 10
    },
    "columns": [
        {
            "name": "id",
            "label": "ID",
            "width": 20,
            "sortable": true
        },
        {
            "name": "engine",
            "label": "Rendering engine",
            "sortable": true,
            "toggled": false
        },
        {
            "name": "browser",
            "label": "Browser",
            "sortable": true
        },
        {
            "name": "platform",
            "label": "Platform(s)",
            "sortable": true
        },
        {
            "name": "version",
            "label": "Engine version"
        }
    ]
}
```


### Cards(CRUD)

请参考[Cards](#cards)

```schema:height="800" scope="body"
{
"type": "crud",
"api": "/api/mock2/crud/users",
"syncLocation": false,
"mode": "cards",
"defaultParams": {
  "perPage": 6
},
"switchPerPage": false,
"placeholder": "没有用户信息",
"columnsCount": 2,
"card": {
  "header": {
    "className": "bg-white",
    "title": "$name",
    "subTitle": "$realName",
    "description": "$email",
    "avatar": "${avatar | raw}",
    "highlight": "$isSuperAdmin",
    "avatarClassName": "pull-left thumb-md avatar b-3x m-r"
  },
  "bodyClassName": "padder",
  "body": "\n      <% if (data.roles && data.roles.length) { %>\n        <% data.roles.map(function(role) { %>\n          <span class=\"label label-default\"><%- role.name %></span>\n        <% }) %>\n      <% } else { %>\n        <p class=\"text-muted\">没有分配角色</p>\n      <% } %>\n      ",
  "actions": [
    {
      "label": "编辑",
      "actionType": "dialog",
      "dialog": {
        "title": null,
        "body": {
          "api": "",
          "type": "form",
        "tabs": [
          {
            "title": "基本信息",
            "controls": [
              {
                "type": "hidden",
                "name": "id"
              },
              {
                "name": "name",
                "label": "帐号",
                "disabled": true,
                "type": "text"
              },
              {
                "type": "divider"
              },
              {
                "name": "email",
                "label": "邮箱",
                "type": "text",
                "disabled": true
              },
              {
                "type": "divider"
              },
              {
                "name": "isAmisOwner",
                "label": "管理员",
                "description": "设置是否为超级管理",
                "type": "switch"
              }
            ]
          },
          {
            "title": "角色信息",
            "controls": [
              
            ]
          },
          {
            "title": "设置权限",
            "controls": [
              
            ]
          }
        ]
        }
      }
    },
    {
      "label": "移除",
      "confirmText": "您确定要移除该用户?",
      "actionType": "ajax",
      "api": "delete:/api/mock2/notFound"
    }
  ]
}
}
```

### List(CRUD)

请参考[List](#list)

```schema:height="800" scope="body"
{
"type": "crud",
"api": "/api/mock2/crud/permissions",
"mode": "list",
"placeholder": "当前组内, 还没有配置任何权限.",
"syncLocation": false,
"title": null,
"listItem": {
  "title": "$name",
  "subTitle": "$description",
  "actions": [
    {
      "icon": "fa fa-edit",
      "tooltip": "编辑",
      "actionType": "dialog",
      "dialog": {
        "title": "编辑能力（权限）",
        "body": {
          "type": "form",
          "controls": [
          {
            "type": "hidden",
            "name": "id"
          },
          {
            "name": "name",
            "label": "权限名称",
            "type": "text",
            "disabled": true
          },
          {
            "type": "divider"
          },
          {
            "name": "description",
            "label": "描述",
            "type": "textarea"
          }
        ]
        }
      }
    },
    {
      "tooltip": "删除",
      "disabledOn": "~[\"admin:permission\", \"admin:user\", \"admin:role\", \"admin:acl\", \"admin:page\", \"page:readAll\", \"admin:settings\"].indexOf(name)",
      "icon": "fa fa-times",
      "confirmText": "您确定要移除该权限?",
      "actionType": "ajax",
      "api": "delete:/api/mock2/notFound"
    }
  ]
}
}
```

## Panel

可以把相关信息以盒子的形式展示到一块。

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"panel"`  |   指定为 Panel 渲染器 |
| className | `string` |  `"panel-default"` |  外层 Dom 的类名 |
| headerClassName | `string` | `"panel-heading"` |   header 区域的类名 |
| footerClassName | `string` | `"panel-footer bg-light lter wrapper"` |   footer 区域的类名 |
| actionsClassName | `string` | `"panel-footer"` |   actions 区域的类名 |
| bodyClassName | `string` | `"panel-body"` |   body 区域的类名 |
| title | `string` |  | 标题 |
| header | [Container](#container) |  | 顶部容器 |
| body | [Container](#container) |  | 内容容器 |
| footer | [Container](#container) |  | 底部容器 |
| actions | Array Of [Button](#button) |  | 按钮区域 |


```schema:height="300" scope="body"
{
    "type": "panel",
    "title": "Panel Heading",
    "body": "Panel Body",
    "actions": [
        {
            "type": "button",
            "label": "Action 1",
            "actionType": "dialog",
            "dialog": {
              "confirmMode": false,
              "title": "提示",
              "body": "对，你刚点击了！"
            }
        },

        {
          "type": "button",
          "label": "Action 2",
          "actionType": "dialog",
          "dialog": {
            "confirmMode": false,
            "title": "提示",
            "body": "对，你刚点击了！"
          }
        }
    ]
}
```

## Wrapper

简单的一个容器。

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"wrapper"`  |   指定为 Wrapper 渲染器 |
| className | `string` |  |  外层 Dom 的类名 |
| size | `string` |  | 支持: `xs`、`sm`、`md`和`lg` |
| body | [Container](#container) |  | 内容容器 |


```schema:height="200" scope="body"
{
    "type": "wrapper",
    "body": "Wrapped Body",
    "className": "bg-white wrapper"
}
```

## Service

功能型容器，自身不负责展示内容，主要职责在于通过配置的 api 拉取数据，数据可用于子组件。
该组件初始化时就会自动拉取一次数据，后续如果需要刷新，请结合 Action 实现，可以把 Action 的 actionType 设置为 reload, target 为该组件的 name 值。
同时该组件，还支持 api 数值自动监听，比如  `getData?type=$type` 只要当前环境 type 值发生变化，就会自动重新拉取。

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"service"`  |   指定为 service 渲染器 |
| className | `string` |  |  外层 Dom 的类名 |
| body | [Container](#container) |  | 内容容器 |
| api | [api](#api) |  | 数据源 API 地址 |
| initFetch | `boolean` |  | 是否默认拉取 |
| schemaApi | [api](#api) |  | 用来获取远程 Schema 的 api |
| initFetchSchema | `boolean` |  | 是否默认拉取 Schema |
| interval | `number` | `3000` | 刷新时间(最低3000) |
| silentPolling | `boolean` | `false` | 配置刷新时是否显示加载动画 |
| stopAutoRefreshWhen | `string` | `""` | 通过[表达式](#表达式)来配置停止刷新的条件 |


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

## Chart

图表渲染器，采用echarts渲染，配置格式跟echarts相同，配置文档[文档](http://echarts.baidu.com/option.html#title)

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"chart"`  |   指定为 chart 渲染器 |
| className | `string` |  |  外层 Dom 的类名 |
| body | [Container](#container) |  | 内容容器 |
| api | [api](#api) |  | 配置项远程地址 |
| initFetch | `boolean` |  | 是否默认拉取 |
| interval | `number` |  | 刷新时间(最低3000) |
| config | `object/string` |  | 设置eschars的配置项,当为`string`的时候可以设置function等配置项|
| style | `object` |  | 设置根元素的style |


```schema:height="350" scope="body"
{
    "type": "chart",
    "api": "/api/mock2/chart/chart",
    "interval": 5000
}
```

## Collapse

折叠器

* `type` 请设置成 `collapse`
* `title` 标题
* `collapsed` 默认是否要收起。
* `className` CSS 类名，默认：`bg-white wrapper`。
* `headingClassName` 标题 CSS 类名，默认：`font-thin b-b b-light text-lg p-b-xs`。
* `bodyClassName` 内容 CSS 类名。

```schema:height="350" scope="body"
{
    "type": "collapse",
    "title": "标题",
    "body": "内容。。。"
}
```

## Video

视频播放器。

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"video"`  |   指定为 video 渲染器 |
| className | `string` |  |  外层 Dom 的类名 |
| src | `string` |  |  视频地址 |
| poster | `string` |  |  视频封面地址 |
| muted | `boolean` |  |  是否静音 |
| autoPlay | `boolean` |  |  是否自动播放 |

```schema:height="500" scope="body"
{
    "type": "video",
    "autoPlay": false,
    "src": "raw:https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    "poster": "raw:https://video-react.js.org/assets/poster.png"
}
```

## Table

表格展示。

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` |  |  `"table"` 指定为 table 渲染器 |
| title | `string` |  |  标题 |
| source | `string` | `${items}` |  数据源, 绑定当前环境变量 |
| affixHeader | `boolean` | `true` | 是否固定表头 |
| columnsTogglable | `auto` 或者 `boolean` | `auto` | 展示列显示开关, 自动即：列数量大于或等于5个时自动开启 |
| placeholder | string | ‘暂无数据’ | 当没数据的时候的文字提示 |
| className | `string` | `panel-default` |  外层 CSS 类名 |
| tableClassName | `string` | `table-db table-striped` |  表格 CSS 类名 |
| headerClassName | `string` | `crud-table-header` |  顶部外层 CSS 类名 |
| footerClassName | `string` | `crud-table-footer` |  底部外层 CSS 类名 |
| toolbarClassName | `string` | `crud-table-toolbar` |  工具栏 CSS 类名 |
| columns | Array of [Column](#column) |  | 用来设置列信息 |

```schema:height="700" scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
        {
            "type": "panel",
            "title": "简单表格示例1",
            "body": {
                "type": "table",
                "source": "$rows",
                "columns": [
                    {
                        "name": "engine",
                        "label": "Engine"
                    },

                    {
                        "name": "version",
                        "label": "Version"
                    }
                ]
            }
        },

        {
            "type": "panel",
            "title": "简单表格示例2",
            "body": {
                "type": "table",
                "source": "$rows",
                "columns": [
                    {
                        "name": "engine",
                        "label": "Engine"
                    },

                    {
                        "name": "version",
                        "label": "Version"
                    }
                ]
            }
        }
    ]
}
```

### Column

表格中的列配置

* `type` 默认为 `text`，支持： `text`、`html`、`tpl`、`image`、`progress`、`status`、`date`、`datetime`、`time`、`json`、`mapping`参考 [Field 说明](#field)和[Operation](#operation)。
* `name` 用来关联列表数据中的变量 `key`。
* `label` 列标题。
* `copyable` 开启后，会支持内容点击复制。
* `width` 列宽度。
* `popOver` 是否支持点击查看详情。当内容较长时，可以开启此配置。
* `quickEdit` 配置后在内容区增加一个编辑按钮，点击后弹出一个编辑框。
* `toggled` 控制默认是展示还是不展示，只有 Table 的 `columnsTogglable` 开启了才有效。

### Operation

表格列中的操作栏，用来放置按钮集合，只能放在 table 的列配置中。

* `type` 请设置成 `operation`。
* `label` 列标题。
* `buttons` 按钮集合，请参考[Button](#button) 按钮配置说明。

## List

列表展示。

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` |  |  `"list"` 指定为列表展示。 |
| title | `string` |  |  标题 |
| source | `string` | `${items}` |  数据源, 绑定当前环境变量 |
| placeholder | string | ‘暂无数据’ | 当没数据的时候的文字提示 |
| className | `string` |  |  外层 CSS 类名 |
| headerClassName | `string` | `amis-list-header` |  顶部外层 CSS 类名 |
| footerClassName | `string` | `amis-list-footer` |  底部外层 CSS 类名 |
| listItem | `Array` |  | 配置单条信息 |
| listItem.title | `string` |  | 标题，支持模板语法如： ${xxx}|
| listItem.titleClassName | `string` | `h5` | 标题 CSS 类名 |
| listItem.subTitle | `string` |  | 副标题，支持模板语法如： ${xxx}|
| listItem.avatar | `string` |  | 图片地址，支持模板语法如： ${xxx}|
| listItem.avatarClassName | `string` | `thumb-sm avatar m-r` | 图片 CSS 类名 |
| listItem.desc | `string` |  | 描述，支持模板语法如： ${xxx} |
| listItem.body | `Array` 或者 [Field](#field) | | 内容容器，主要用来放置 [Field](#field) |
| listItem.actions | Array Of [Button](#button) |  | 按钮区域 |

```schema:height="400" scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
        {
            "type": "panel",
            "title": "简单 List 示例",
            "body": {
                "type": "list",
                "source": "$rows",
                "listItem": {
                  "body": [
                    {
                      "type": "hbox",
                      "columns": [
                        {
                          "label": "Engine",
                          "name": "engine"
                        },

                        {
                            "name": "version",
                            "label": "Version"
                        }
                      ]
                    }
                  ],

                  "actions": [
                    {
                      "type": "button",
                      "level": "link",
                      "icon": "fa fa-eye",
                      "actionType": "dialog",
                      "dialog": {
                        "title": "查看详情",
                        "body": {
                          "type": "form",
                          "controls": [
                            {
                              "label": "Engine",
                              "name": "engine",
                              "type": "static"
                            },

                            {
                                "name": "version",
                                "label": "Version",
                                "type": "static"
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
            }
        }
    ]
}
```

## Card

卡片的展示形式。

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"card"`  |   指定为 Card 渲染器 |
| className | `string` |  `"panel-default"` |  外层 Dom 的类名 |
| header | `Object` |  | Card 头部内容设置 |
| header.className | `string` |  | 头部类名 |
| header.title | `string` |  | 标题 |
| header.subTitle | `string` |  | 副标题 |
| header.desc | `string` |  | 描述 |
| header.avatar | `string` |  | 图片 |
| header.highlight | `boolean` |  | 是否点亮 |
| header.avatarClassName | `string` | `"pull-left thumb avatar b-3x m-r"` | 图片类名 |
| body | `Array` 或者 [Field](#field) | | 内容容器，主要用来放置 [Field](#field) |
| bodyClassName | `string` | `"padder m-t-sm m-b-sm"` | 内容区域类名 |
| actions | Array Of [Button](#button) |  | 按钮区域 |


```schema:height="300" scope="body"
{
    "type": "card",
    "header": {
        "title": "Title",
        "subTitle": "Sub Title",
        "description": "description",
        "avatarClassName": "pull-left thumb-md avatar b-3x m-r",
        "avatar": "raw:http://hiphotos.baidu.com/fex/%70%69%63/item/c9fcc3cec3fdfc03ccabb38edd3f8794a4c22630.jpg"
    },
    "body": "Body",
    "actions": [
        {
            "type": "button",
            "label": "Action 1",
            "actionType": "dialog",
            "dialog": {
              "confirmMode": false,
              "title": "提示",
              "body": "对，你刚点击了！"
            }
        },

        {
          "type": "button",
          "label": "Action 2",
          "actionType": "dialog",
          "dialog": {
            "confirmMode": false,
            "title": "提示",
            "body": "对，你刚点击了！"
          }
        }
    ]
}
```

## Cards

卡片集合。

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` |  |  `"cards"` 指定为卡片集合。 |
| title | `string` |  |  标题 |
| source | `string` | `${items}` |  数据源, 绑定当前环境变量 |
| placeholder | string | ‘暂无数据’ | 当没数据的时候的文字提示 |
| className | `string` |  |  外层 CSS 类名 |
| headerClassName | `string` | `amis-grid-header` |  顶部外层 CSS 类名 |
| footerClassName | `string` | `amis-grid-footer` |  底部外层 CSS 类名 |
| itemClassName | `string` | `col-sm-4 col-md-3` |  卡片 CSS 类名 |
| card | [Card](#card) |  | 配置卡片信息 |

```schema:height="450" scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=8",
    "body": [
        {
            "type": "panel",
            "title": "简单 Cards 示例",
            "body": {
                "type": "cards",
                "source": "$rows",
                "card": {
                  "body": [
                    {
                      "label": "Engine",
                      "name": "engine"
                    },

                    {
                      "name": "version",
                      "label": "Version"
                    }
                  ],

                  "actions": [
                    {
                      "type": "button",
                      "level": "link",
                      "icon": "fa fa-eye",
                      "actionType": "dialog",
                      "dialog": {
                        "title": "查看详情",
                        "body": {
                          "type": "form",
                          "controls": [
                            {
                              "label": "Engine",
                              "name": "engine",
                              "type": "static"
                            },

                            {
                                "name": "version",
                                "label": "Version",
                                "type": "static"
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
            }
        }
    ]
}
```

## Field

主要用在 [Table](#table) 的列配置 Column、[List](#list) 的内容、[Card](#card) 卡片的内容和表单的[Static-XXX](#static-xxx) 中。它主要用来展示数据。


```schema:height="450" scope="body"
{
  "type": "crud",
  "api": "/api/mock2/crud/list",
  "affixHeader": false,
  "syncLocation": false,
  "columns": [
    {
      "name": "id",
      "label": "ID",
      "type": "text"
    },
    {
      "name": "text",
      "label": "文本",
      "type": "text"
    },
    {
      "type": "image",
      "label": "图片",
      "name": "image",
      "popOver": {
        "title": "查看大图",
        "body": "<div class=\"w-xxl\"><img class=\"w-full\" src=\"${image}\"/></div>"
      }
    },
    {
      "name": "date",
      "type": "date",
      "label": "日期"
    },
    {
      "name": "progress",
      "label": "进度",
      "type": "progress"
    },
    {
      "name": "boolean",
      "label": "状态",
      "type": "status"
    },
    {
      "name": "boolean",
      "label": "开关",
      "type": "switch"
    },
    {
      "name": "type",
      "label": "映射",
      "type": "mapping",
      "map": {
        "1": "<span class='label label-info'>漂亮</span>",
        "2": "<span class='label label-success'>开心</span>",
        "3": "<span class='label label-danger'>惊吓</span>",
        "4": "<span class='label label-warning'>紧张</span>",
        "*": "其他：${type}"
      }
    },
    {
      "name": "list",
      "type": "list",
      "label": "List",
      "placeholder": "-",
      "listItem": {
        "title": "${title}",
        "subTitle": "${description}"
      }
    }
  ]
}
```

### Field 通用配置

* `name` 绑定变量名。
* `placeholder` 当没有值时的展示内容。
* `popOver` 配置后在内容区增加一个放大按钮，点击后弹出一个详情弹框。
  `boolean` 简单的开启或者关闭
  `Object` 弹出的内容配置。请参考 [Dialog](#dialog) 配置说明。
* `quickEdit` 配置后在内容区增加一个编辑按钮，点击后弹出一个编辑框。
  `boolean` 简单的开启或者关闭
  `Object` 快速编辑详情，请参考 [FormItem](#formitem) 配置。
  `.mode` 模式如果设置为 `inline` 模式，则直接展示输入框，而不需要点击按钮后展示。
  `.saveImmediately` 开启后，直接保存，而不是等全部操作完后批量保存。
* `copyable` 配置后会在内容区增加一个复制按钮，点击后把内容复制到剪切板。
  todo

### Tpl(Field)

请参考[tpl](#tpl)

### Plain(Field)

请参考[Plain](#plain)

### Json(Field)

todo

### Date(Field)

用来显示日期。

* `type` 请设置为 `date`。
* `format` 默认为 `YYYY-MM-DD`，时间格式，请参考 moment 中的格式用法。
* `valueFormat` 默认为 `X`，时间格式，请参考 moment 中的格式用法。

### Mapping(Field)

用来对值做映射显示。

* `type` 请设置为 `date`。
* `map` 映射表, 比如

  ```json
  {
    "type": "mapping",
    "name": "flag",
    "map": {
      "1": "<span class='label label-default'>One</span>",
      "*": "其他 ${flag}"
    }
  }
  ```

  当值为 1 时，显示 One, 当值为其他时会命中 `*` 所以显示 `其他 flag的值`。

### Image(Field)

用来展示图片。

* `type` 请设置为 `image`。
* `description` 图片描述。
* `defaultImage` 默认图片地址。
* `className` CSS 类名。
* `src` 图片地址，支持变量。如果想动态显示，请勿配置。

### Progress(Field)

用来展示进度条。

* `type` 请设置为 `progress`。
* `showLabel` 是否显示文字
* `map` 等级配置
  默认

  ```json
  [
      'bg-danger',
      'bg-warning',
      'bg-info',
      'bg-success',
      'bg-success'
  ]
  ```

  展示的样式取决于当前值在什么区间段，比如以上的配置，把 100 切成了 5 分，前 1/5, 即 25 以前显示 `bg-danger` 背景。50 ~ 75 显示 `bg-info` 背景。
* `progressClassName` 进度外层 CSS 类名 默认为: `progress-xs progress-striped active m-t-xs m-b-none`
* `progressBarClassName` 进度条 CSS 类名。

### Status(Field)

用来显示状态，用图表展示。

* `type` 请设置为 `status`。
* `map` 图标配置

  默认: 

  ```json
  [
    'fa fa-times text-danger',
    'fa fa-check text-success'
  ]
  ```

  即如果值 `value % map.length` 等于 0 则显示第一个图标。`value % map.length` 等于 1 则显示第二个图标，无限类推。所以说 map 其实不只是支持2个，可以任意个。

  这个例子，当值为 0 、2、4 ... 时显示红 `X`， 当值为 1, 3, 5 ... 绿 `√`

### Switch(Field)

用来占一个开关。

* `type` 请设置为 `switch`。
* `option` 选项说明
* `trueValue` 勾选后的值
* `falseValue` 未勾选的值

## Tabs

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"tabs"`  |   指定为 Tabs 渲染器 |
| className | `string` |  |  外层 Dom 的类名 |
| tabsClassName | `string` |  |  Tabs Dom 的类名 |
| tabs | `Array` |  |  tabs 内容 |
| tabs[x].title | `string` |  | Tab 标题 |
| tabs[x].icon | `icon` |  | Tab 的图标 |
| tabs[x].tab | [Container](#container) |  | 内容区 |
| tabs[x].hash | `string` |  | 设置以后将跟url的hash对应 |
| tabs[x].reload | `boolean` |  | 设置以后内容每次都会重新渲染，对于crud的重新拉取很有用 |
| tabs[x].className | `string` | `"bg-white b-l b-r b-b wrapper-md"` | Tab 区域样式 |


```schema:height="300" scope="body"
{
    "type": "tabs",
    "tabs": [
        {
            "title": "Tab 1",
            "tab": "Content 1"
        },

        {
            "title": "Tab 2",
            "tab": "Content 2"
        }
    ]
}
```

## Grid

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"grid"`  |   指定为 Grid 渲染器 |
| className | `string` |  |  外层 Dom 的类名 |
| columns | `Array` |  |  列集合 |
| columns[x] | [Container](#Container) |  |  成员可以是其他渲染器 |
| columns[x].xs | `int` |  |  宽度占比： 1 - 12 |
| columns[x].xsHidden | `boolean` |  |  是否隐藏 |
| columns[x].xsOffset | `int` |  |  偏移量 1 - 12 |
| columns[x].xsPull | `int` |  | 靠左的距离占比：1 - 12  |
| columns[x].xsPush | `int` |  |  靠右的距离占比： 1 - 12 |
| columns[x].sm | `int` |  |  宽度占比： 1 - 12 |
| columns[x].smHidden | `boolean` |  |  是否隐藏 |
| columns[x].smOffset | `int` |  |  偏移量 1 - 12 |
| columns[x].smPull | `int` |  | 靠左的距离占比：1 - 12  |
| columns[x].smPush | `int` |  |  靠右的距离占比： 1 - 12 |
| columns[x].md | `int` |  |  宽度占比： 1 - 12 |
| columns[x].mdHidden | `boolean` |  |  是否隐藏 |
| columns[x].mdOffset | `int` |  |  偏移量 1 - 12 |
| columns[x].mdPull | `int` |  | 靠左的距离占比：1 - 12  |
| columns[x].mdPush | `int` |  |  靠右的距离占比： 1 - 12 |
| columns[x].lg | `int` |  |  宽度占比： 1 - 12 |
| columns[x].lgHidden | `boolean` |  |  是否隐藏 |
| columns[x].lgOffset | `int` |  |  偏移量 1 - 12 |
| columns[x].lgPull | `int` |  | 靠左的距离占比：1 - 12  |
| columns[x].lgPush | `int` |  |  靠右的距离占比： 1 - 12 |

更多使用说明，请参看 [Grid Props](https://react-bootstrap.github.io/components.html#grid-props-col)



```schema:height="300" scope="body"
[
    {
        "type": "grid",
        "className": "b-a bg-dark lter",
        "columns": [
            {
                "type": "plain",
                "text": "md: 3",
                "md": 3,
                "className": "b-r"
            },

            {
                "type": "plain",
                "text": "md: 9",
                "md": 9
            }
        ]
    },

    {
        "type": "grid",
        "className": "b-a m-t bg-dark lter",
        "columns": [
            {
                "type": "plain",
                "text": "mdOffset: 3",
                "mdOffset": 3
            }
        ]
    }
]
```

## HBox

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"hbox"`  |   指定为 HBox 渲染器 |
| className | `string` |  |  外层 Dom 的类名 |
| columns | `Array` |  |  列集合 |
| columns[x] | [Container](#Container) |  |  成员可以是其他渲染器 |
| columns[x].columnClassName | `string` | `"wrapper-xs"` |  列上类名 |


```schema:height="300" scope="body"
[
    {
        "type": "hbox",
        "className": "b-a bg-dark lter",
        "columns": [
            {
                "type": "plain",
                "text": "Col A",
                "columnClassName": "wrapper-xs b-r"
            },

            "Col B"
        ]
    },

    {
        "type": "hbox",
        "className": "b-a m-t bg-dark lter",
        "columns": [
            {
                "type": "plain",
                "text": "w-md",
                "columnClassName": "w-md wrapper-xs bg-primary b-r"
            },
            "..."
        ]
    }
]
```

## Button-Group

按钮集合。

* `type` 请设置成 `button-group`
* `buttons` 配置按钮集合。

```schema:height="200" scope="body"
{
  "type": "button-toolbar",
  "buttons": [
    {
      "type": "button-group",
      "buttons": [
        {
          "type": "button",
          "label": "Button",
          "actionType": "dialog",
          "dialog": {
            "confirmMode": false,
            "title": "提示",
            "body": "对，你刚点击了！"
          }
        },

        {
          "type": "submit",
          "label": "Submit"
        },

        {
          "type": "reset",
          "label": "Reset"
        }
      ]
    },

    {
      "type": "submit",
      "icon": "fa fa-check text-success"
    },

    {
      "type": "reset",
      "icon": "fa fa-times text-danger"
    }
  ]
}
```


## iFrame

如果需要内嵌外部站点，可用 iframe 来实现。

```schema:height="300" scope="body"
{
    "type": "iframe",
    "src": "raw:http://www.baidu.com",
    "style": {
        "height": 260
    }
}
```

## Nav

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"tabs"`  |   指定为 Nav 渲染器 |
| className | `string` |  |  外层 Dom 的类名 |
| stacked | `boolean` | `true` |  设置成 false 可以以 tabs 的形式展示 |
| links | `Array` |  |  链接集合 |
| links[x].label | `string` |  | 名称 |
| links[x].to | `string` |  | 链接地址 |
| links[x].icon | `string` |  | 图标 |


链接集合。

```schema:height="300" scope="body"
{
    "type": "nav",
    "stacked": true,
    "className": "w-md",
    "links": [
        {
            "label": "Nav 1",
            "to": "/docs/index",
            "icon": "fa fa-user",
            "active": true
        },

        {
            "label": "Nav 2",
            "to": "/docs/api"
        },

        {
            "label": "Nav 3",
            "to": "/docs/renderers"
        }
    ]
}
```

```schema:height="300" scope="body"
{
    "type": "nav",
    "stacked": false,
    "links": [
        {
            "label": "Nav 1",
            "to": "/docs/index",
            "icon": "fa fa-user"
        },

        {
            "label": "Nav 2",
            "to": "/docs/api"
        },

        {
            "label": "Nav 3",
            "to": "/docs/renderers"
        }
    ]
}
```

## Tasks

任务操作集合，类似于 orp 上线。

```schema:height="300" scope="body"
{
    "type": "tasks",
    "name": "tasks",
    "items": [
        {
            "label": "hive 任务",
            "key": "hive",
            "status": 4,
            "remark": "查看详情<a target=\"_blank\" href=\"http://www.baidu.com\">日志</a>。"
        },
        {
            "label": "小流量",
            "key": "partial",
            "status": 4
        },
         {
             "label": "全量",
             "key": "full",
             "status": 4
         }
    ]
}
```

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"tasks"`  |   指定为 Tasks 渲染器 |
| className | `string` |  |  外层 Dom 的类名 |
| tableClassName | `string` |  |  table Dom 的类名 |
| items | `Array` |  |  任务列表 |
| items[x].label | `string` |  |  任务名称 |
| items[x].key | `string` |  |  任务键值，请唯一区分 |
| items[x].remark | `string` |  |  当前任务状态，支持 html |
| items[x].status | `string` |  |  任务状态： 0: 初始状态，不可操作。1: 就绪，可操作状态。2: 进行中，还没有结束。3：有错误，不可重试。4: 已正常结束。5：有错误，且可以重试。 |
| checkApi | [api](#api) |  |  返回任务列表，返回的数据请参考 items。 |
| submitApi | [api](#api) |  |  提交任务使用的 API |
| reSubmitApi | [api](#api) |  |  如果任务失败，且可以重试，提交的时候会使用此 API |
| interval | `number` | `3000` |  当有任务进行中，会每隔一段时间再次检测，而时间间隔就是通过此项配置，默认 3s。 |
| taskNameLabel | `string` | 任务名称 |  任务名称列说明 |
| operationLabel | `string` | 操作 |  操作列说明 |
| statusLabel | `string` | 状态 |  状态列说明 |
| remarkLabel | `string` | 备注 |  备注列说明 |
| btnText | `string` | 上线 |  操作按钮文字 |
| retryBtnText | `string` | 重试 |  重试操作按钮文字 |
| btnClassName | `string` | `btn-sm btn-default` |  配置容器按钮 className |
| retryBtnClassName | `string` | `btn-sm btn-danger` |  配置容器重试按钮 className |
| statusLabelMap | `array` | `["label-warning", "label-info", "label-success", "label-danger", "label-default", "label-danger"]` |  状态显示对应的类名配置 |
| statusTextMap | `array` | `["未开始", "就绪", "进行中", "出错", "已完成", "出错"]` |  状态显示对应的文字显示配置 |



```schema:height="300" scope="body"
[
{
    "type": "tasks",
    "name": "tasks",
    "checkApi": "/api/mock2/task"
},

"为了演示，目前获取的状态都是随机出现的。"]
```

## QRCode

二维码显示组件

|属性名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| type | `string` | `"qr-code"`  |   指定为 QRCode 渲染器 |
| className | `string` |  |  外层 Dom 的类名 |
| codeSize | `number` | `128` |  二维码的宽高大小 |
| backgroundColor | `string` | `"#fff"` |  二维码背景色 |
| foregroundColor | `string` | `"#000"` | 二维码前景色 |
| level | `string` | `"L"` | 二维码复杂级别，有（'L' 'M' 'Q' 'H'）四种 |
| value | `string` | `"https://www.baidu.com"` | 扫描二维码后显示的文本，如果要显示某个页面请输入完整url（`"http://..."`或`"https://..."`开头），支持使用 `${xxx}` 来获取变量 |


```schema:height="300" scope="body"
{
    "type": "qr-code",
    "codeSize": 128,
    "backgroundColor": "#fff",
    "foregroundColor": "#000",
    "level": "L",
    "value": "https://www.baidu.com"
}
```

## 类型说明

### Container

Container 不是一个特定的渲染器，而是 AMis 中一个特殊类型，它是以下类型的任何一种。

* `String` 字符串，可以包含 `html` 片段。
* `Object` 指定一个渲染器如： `{"type": "button", "label": "按钮"}`
* `Array` 还可以是一个数组，数组的成员可以就是一个 `Container`.

示例:

```json
{
  "container": "普通一段字符串"
}
```

```json
{
  "container": {
    "type": "button",
    "label": "按钮"
  }
}
```

```json
{
  "container": [
    "普通一段字符串",

    {
      "type": "button",
      "label": "按钮"
    },

    [
      "普通一段字符串",
      "普通一段字符串"
    ]
  ]
}
```


### API

Api 类型可以是字符串或者对象。API 中可以直接设置数据发送结构，注意看示例。


* `String` `[<type>:]<url>`
    * `<type>` 可以是： `get`、`post`、`put`、`delete`或者`raw`
    * `<url>` 即 api 地址，支持通过 `$key` 取变量。

    如：

        * `get:http://imis.tieba.baidu.com/yule/list?start=$startTime&end=$endTime`
        * `get:http://imis.tieba.baidu.com/yule/list?$$` 拿所有可用数据。
        * `get:http://imis.tieba.baidu.com/yule/list?data=$$` 拿所有可用数据。
* `Object`
    * `url` api 地址
    * `method` 可以是：`get`、`post`、`put`或者`delete`
    * `data` 数据体
    * `headers` 头部，配置方式和 data 配置一样，下面不详讲。如果要使用，请前往群组系统配置中，添加允许。

    如：

    取某个变量。

    ```json
    {
      "url": "http://imis.tieba.baidu.com/yule/list",
      "method": "post",
      "data": {
        "start": "$startTime"
      }
    }
    ```

    直接将所有可用数据映射给 all 变量。

    ```json
    {
      "url": "http://imis.tieba.baidu.com/yule/list",
      "method": "post",
      "data": {
        "all": "$$"
      }
    }
    ```

    正常如果指定了 data，则只会发送data 指定的数据了，如果想要保留原有数据，只定制修改一部分。

    ```json
    {
      "url": "http://imis.tieba.baidu.com/yule/list",
      "method": "post",
      "data": {
        "&": "$$", // 原来的数据先 copy 过来。
        "a": "123",
        "b": "${b}"
      }
    }
    ```

    如果目标变量是数组，而发送的数据，有不希望把成员全部发送过去，可以这样配置。

    ```json
    {
      "url": "http://imis.tieba.baidu.com/yule/list",
      "method": "post",
      "data": {
        "all": {
          "$rows": {
            "a": "$a",
            "b": "$b"
          }
        }
      }
    }
    ```

    如果 $rows 的结构为 `[{a: 1, b: 2, c: 3, d: 4}, {a: 1, b: 2, c: 3, d: 4}]`, 经过上述映射后，实际发送的数据为 `{all: [{a: 1, b:2}, {a: 1, b: 2}]}`


** 注意 **

AMis 所有值为 url 的如： `"http://www.baidu.com"` 都会被替换成 proxy 代理，如果不希望这么做，请明确指示如： `"raw:http://www.baidu.com"`。还有为了安全，AMis 默认只能转发公司内部 API 接口，如果您的接口在外网环境，也请明确指示如：`"external:http://www.baidu.com"`

### 表达式

配置项中，所有 `boolean` 类型的配置，都可以用 JS 表达式来配置。所有`boolean` 配置项，后面加个 `On` 则是表达式配置方式，可以用 js 语法来根据当前模型中的数据来决定是否启用。
如：[FormItem](#FormItem) 中的 `disabledOn`、`hiddenOn`、`visibleOn`、[CRUD](#CRUD) 中的 `itemDraggableOn` 等等。


```schema:height="300" scope="form"
[
    {
        "type": "radios",
        "name": "foo",
        "inline": true,
        "label": " ",
        "options": [
            {
                "label": "类型1",
                "value": 1
            },
            {
                "label": "类型2",
                "value": 2
            },
            {
                "label": "类型3",
                "value": 3
            }
        ]
    },

    {
        "type": "text",
        "name": "text",
        "placeholder": "类型1 可见",
        "visibleOn": "data.foo == 1"
    },

     {
         "type": "text",
         "name": "text2",
         "placeholder": "类型2 不可点",
         "disabledOn": "data.foo == 2"
     },

   {
       "type": "button",
       "label": "类型三不能提交",
       "level": "primary",
       "disabledOn": "data.foo == 3"
   }

]
```

为了能加入权限控制，表达是中允许可以用 `acl.can` 方法来检测当前用户是否拥有某个权限。
如： `{"disabledOn": "!can('some-resource')"}`。权限能力部分，请前往[能力管理](/docs/manual#%E8%83%BD%E5%8A%9B%E7%AE%A1%E7%90%86)，
权限配置请前往[权限配置](/docs/manual#%E6%9D%83%E9%99%90%E9%85%8D%E7%BD%AE)管理。
