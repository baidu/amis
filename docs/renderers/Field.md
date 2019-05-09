## Field

主要用在 [Table](./Table.md) 的列配置 Column、[List](./List.md) 的内容、[Card](./Card.md) 卡片的内容和表单的[Static-XXX](./Static.md#static-xxx) 中。它主要用来展示数据。

```schema:height="450" scope="body"
{
  "type": "Action.md",
  "api": "/api/mock2/Action.md/list",
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

-   `name` 绑定变量名。
-   `placeholder` 当没有值时的展示内容。
-   `popOver` 配置后在内容区增加一个放大按钮，点击后弹出一个详情弹框。
    `boolean` 简单的开启或者关闭
    `Object` 弹出的内容配置。请参考 [Dialog](./Dialog.md) 配置说明。
-   `quickEdit` 配置后在内容区增加一个编辑按钮，点击后弹出一个编辑框。
    `boolean` 简单的开启或者关闭
    `Object` 快速编辑详情，请参考 [FormItem](./FormItem.md) 配置。
    `.mode` 模式如果设置为 `inline` 模式，则直接展示输入框，而不需要点击按钮后展示。
    `.saveImmediately` 开启后，直接保存，而不是等全部操作完后批量保存。
-   `copyable` 配置后会在内容区增加一个复制按钮，点击后把内容复制到剪切板。
    todo

### Tpl(Field)

请参考[tpl](./Tpl.md)

### Plain(Field)

请参考[Plain](./Plain.md)

### Json(Field)

todo

### Date(Field)

用来显示日期。

-   `type` 请设置为 `date`。
-   `format` 默认为 `YYYY-MM-DD`，时间格式，请参考 moment 中的格式用法。
-   `valueFormat` 默认为 `X`，时间格式，请参考 moment 中的格式用法。

### Mapping(Field)

用来对值做映射显示。

-   `type` 请设置为 `date`。
-   `map` 映射表, 比如

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

-   `type` 请设置为 `image`。
-   `description` 图片描述。
-   `defaultImage` 默认图片地址。
-   `className` CSS 类名。
-   `src` 图片地址，支持变量。如果想动态显示，请勿配置。

### Progress(Field)

用来展示进度条。

-   `type` 请设置为 `progress`。
-   `showLabel` 是否显示文字
-   `map` 等级配置
    默认

    ```json
    ["bg-danger", "bg-warning", "bg-info", "bg-success", "bg-success"]
    ```

    展示的样式取决于当前值在什么区间段，比如以上的配置，把 100 切成了 5 分，前 1/5, 即 25 以前显示 `bg-danger` 背景。50 ~ 75 显示 `bg-info` 背景。

-   `progressClassName` 进度外层 CSS 类名 默认为: `progress-xs progress-striped active m-t-xs m-b-none`
-   `progressBarClassName` 进度条 CSS 类名。

### Status(Field)

用来显示状态，用图表展示。

-   `type` 请设置为 `status`。
-   `map` 图标配置

    默认:

    ```json
    ["fa fa-times text-danger", "fa fa-check text-success"]
    ```

    即如果值 `value % map.length` 等于 0 则显示第一个图标。`value % map.length` 等于 1 则显示第二个图标，无限类推。所以说 map 其实不只是支持 2 个，可以任意个。

    这个例子，当值为 0 、2、4 ... 时显示红 `X`， 当值为 1, 3, 5 ...  绿 `√`

### Switch(Field)

用来占一个开关。

-   `type` 请设置为 `switch`。
-   `option` 选项说明
-   `trueValue` 勾选后的值
-   `falseValue` 未勾选的值

## Tabs

| 属性名            | 类型                              | 默认值                              | 说明                                                          |
| ----------------- | --------------------------------- | ----------------------------------- | ------------------------------------------------------------- |
| type              | `string`                          | `"tabs"`                            | 指定为 Tabs 渲染器                                            |
| className         | `string`                          |                                     | 外层 Dom 的类名                                               |
| tabsClassName     | `string`                          |                                     | Tabs Dom 的类名                                               |
| tabs              | `Array`                           |                                     | tabs 内容                                                     |
| tabs[x].title     | `string`                          |                                     | Tab 标题                                                      |
| tabs[x].icon      | `icon`                            |                                     | Tab 的图标                                                    |
| tabs[x].tab       | [Container](./Types.md#Container) |                                     | 内容区                                                        |
| tabs[x].hash      | `string`                          |                                     | 设置以后将跟 url 的 hash 对应                                 |
| tabs[x].reload    | `boolean`                         |                                     | 设置以后内容每次都会重新渲染，对于 Action.md 的重新拉取很有用 |
| tabs[x].className | `string`                          | `"bg-white b-l b-r b-b wrapper-md"` | Tab 区域样式                                                  |

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
