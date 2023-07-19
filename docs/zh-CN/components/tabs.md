---
title: Tabs 选项卡
description:
type: 0
group: ⚙ 组件
menuName: Tabs
icon:
order: 68
---

选项卡容器组件。

## 基本用法

```schema: scope="body"
{
    "type": "tabs",
    "swipeable": true,
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

默认想要显示多少选项卡配置多少个 `tabs` 成员即可。但是有时候你可能会想根据某个数据来动态生成。这个时候需要额外配置 `source` 属性如。

```schema
{
    "type": "page",
    "data": {
        "arr": [
            {
                "a": "收入",
                "b": 199
            },

            {
                "a": "支出",
                "b": 299
            }
        ]
    },

    "body": [
        {
            "type": "tabs",
            "source": "${arr}",
            "tabs": [
                {
                    "title": "${a}",
                    "body": {
                        "type": "tpl",
                        "tpl": "金额：${b|number}元"
                    }
                }
            ]
        }
    ]
}
```

## 拖拽排序

```schema: scope="body"
{
    "type": "tabs",
    "draggable": true,
    "tabs": [
        {
            "title": "Tab 1",
            "tab": "Content 1"
        },
        {
            "title": "Tab 2",
            "tab": "Content 2"
        },
        {
            "title": "Tab 3",
            "tab": "Content 3"
        }
    ]
}
```

## 可增加、删除

`tab` 设置的 `closable` 优先级高于整体。使用 `addBtnText` 设置新增按钮文案

```schema: scope="body"
{
    "type": "tabs",
    "closable": true,
    "addable": true,
    "addBtnText": "新增Tab",
    "tabs": [
        {
            "title": "Tab 1",
            "tab": "Content 1",
            "closable": false
        },
        {
            "title": "Tab 2",
            "tab": "Content 2"
        }
    ]
}
```

## 可编辑标签名

双击标签名，可开启编辑

```schema: scope="body"
{
    "type": "tabs",
    "editable": true,
    "tabs": [
        {
            "title": "Tab 1",
            "tab": "Content 1",
        },
        {
            "title": "Tab 2",
            "tab": "Content 2"
        },
        {
            "title": "双击编辑",
            "tab": "Content 2"
        }
    ]
}
```

## 可禁用

```schema: scope="body"
{
    "type": "tabs",
    "tabs": [
        {
            "title": "Tab 1",
            "tab": "Content 1"
        },
        {
            "title": "Tab 2",
            "tab": "Content 2",
            "disabled": true
        }
    ]
}
```

## 显示提示

```schema: scope="body"
{
    "type": "tabs",
    "showTip": true,
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

## 作为表单项的值

如果在表单里给 tabs 配置了 name，它可以作为一个表单提交项的值，默认情况下会取 title

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "type": "tabs",
            "name": "tab",
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
    ]
}
```

如果不想使用 title，可以给每个 tab 设置 value，这样就会取这个 value 作为表单项的值

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "type": "tabs",
            "name": "tab",
            "tabs": [
                {
                    "title": "Tab 1",
                    "tab": "Content 1",
                    "value": 0
                },
                {
                    "title": "Tab 2",
                    "tab": "Content 2",
                    "value": 1
                }
            ]
        }
    ]
}
```

## 展示模式

### 简约

```schema: scope="body"
{
    "type": "tabs",
    "tabsMode": "simple",
    "tabs": [
        {
            "title": "简约(10)",
            "body": "选项卡内容1",
            "icon": "fa fa-home"
        },
        {
            "title": "选项卡2",
            "body": "选项卡内容2"
        },
        {
            "title": "选项卡3",
            "body": "选项卡内容3"
        }
    ]
}
```

### 加强

```schema: scope="body"
{
    "type": "tabs",
    "tabsMode": "strong",
    "tabs": [
        {
            "title": "选项卡1",
            "body": "选项卡内容1"
        },
        {
            "title": "选项卡2",
            "body": "选项卡内容2"
        },
        {
            "title": "选项卡3",
            "body": "选项卡内容3"
        }
    ]
}
```

### 线型

```schema: scope="body"
{
    "type": "tabs",
    "tabsMode": "line",
    "tabs": [
        {
            "title": "选项卡1",
            "body": "选项卡内容1"
        },
        {
            "title": "选项卡2",
            "body": "选项卡内容2"
        },
        {
            "title": "选项卡3",
            "body": "选项卡内容3"
        }
    ]
}
```

### 卡片

```schema: scope="body"
{
    "type": "tabs",
    "tabsMode": "card",
    "tabs": [
        {
            "title": "选项卡1",
            "body": "选项卡内容1"
        },
        {
            "title": "选项卡2",
            "body": "选项卡内容2"
        },
        {
            "title": "选项卡3",
            "body": "选项卡内容3"
        }
    ]
}
```

### 仿 Chrome

仿 Chrome tab 样式

```schema: scope="body"
{
    "type": "tabs",
    "tabsMode": "chrome",
    "tabs": [
        {
            "title": "选项卡1",
            "body": "选项卡内容1"
        },
        {
            "title": "选项卡2",
            "body": "选项卡内容2"
        },
        {
            "title": "选项卡3",
            "body": "选项卡内容3"
        }
    ]
}
```

### 水平铺满

```schema: scope="body"
{
    "type": "tabs",
    "tabsMode": "tiled",
    "tabs": [
        {
            "title": "选项卡1",
            "body": "选项卡内容1"
        },
        {
            "title": "选项卡2",
            "body": "选项卡内容2"
        },
        {
            "title": "选项卡3",
            "body": "选项卡内容3"
        },
        {
            "title": "选项卡4",
            "body": "选项卡内容4"
        }
    ]
}
```

### 选择器型

```schema: scope="body"
{
    "type": "tabs",
    "tabsMode": "radio",
    "tabs": [
        {
            "title": "选项卡1",
            "body": "选项卡内容1"
        },
        {
            "title": "选项卡2",
            "body": "选项卡内容2"
        },
        {
            "title": "选项卡3",
            "body": "选项卡内容3"
        }
    ]
}
```

### 垂直

```schema: scope="body"
{
    "type": "tabs",
    "tabsMode": "vertical",
    "tabs": [
        {
            "title": "选项卡1",
            "body": "选项卡内容1"
        },
        {
            "title": "选项卡2",
            "body": "选项卡内容2"
        },
        {
            "title": "选项卡3",
            "body": "选项卡内容3"
        }
    ]
}
```

### 侧边栏模式

使用 `sidePosition` 设置标签栏位置。

```schema: scope="body"
{
    "type": "tabs",
    "tabsMode": "sidebar",
    "sidePosition": "right",
    "tabs": [
        {
            "title": "按钮",
            "body": "选项卡内容1",
            "icon": "fa fa-square"
        },
        {
            "title": "动作",
            "body": "选项卡内容2",
            "icon": "fa fa-gavel"
        }
    ]
}
```

## 配置顶部工具栏

配置`toolbar`实现顶部工具栏。

```schema: scope="body"
{
    "type": "tabs",
    "toolbar": [
        {
            "type": "button",
            "label": "按钮",
            "size": "sm",
            "actionType": "dialog",
            "dialog": {
                "title": "弹窗标题",
                "body": "你点击了"
            }
        }
    ],
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

## 配置 hash

可以在单个`tab`下，配置`hash`属性，支持地址栏`#xxx`。

```schema: scope="body"
{
    "type": "tabs",
    "tabs": [
        {
            "title": "Tab 1",
            "hash": "tab1",
            "tab": "Content 1"
        },

        {
            "title": "Tab 2",
            "hash": "tab2",
            "tab": "Content 2"
        }
    ]
}
```

## 默认显示某个选项卡

主要配置`activeKey`属性来实现该效果，共有下面两种方法：

#### 配置 hash 值

支持变量，如 `"tab${id}"`

```schema: scope="body"
{
    "type": "tabs",
    "activeKey": "tab2",
    "tabs": [
        {
            "title": "Tab 1",
            "hash": "tab1",
            "tab": "Content 1"
        },

        {
            "title": "Tab 2",
            "hash": "tab2",
            "tab": "Content 2"
        }
    ]
}
```

内容来源于 source

```schema: scope="body"
{
    "type": "page",
    "data": {
        "arr": [
            {
                "a": "收入",
                "b": 199,
                "key": "a"
            },

            {
                "a": "支出",
                "b": 299,
                "key": "b"
            }
        ]
    },
    "body": [
        {
            "type": "tabs",
            "activeKey": "b",
            "source": "${arr}",
            "tabs": [
                {
                    "title": "${a}",
                    "hash": "${key}",
                    "body": {
                        "type": "tpl",
                        "tpl": "金额：${b|number}元"
                    }
                }
            ]
        }
    ]
}
```

#### 配置索引值

单个`tab`上不要配置`hash`属性，配置需要展示的`tab`索引值，`0`代表第一个。支持变量，如`"${id}"`

```schema: scope="body"
{
    "type": "tabs",
    "activeKey": 1,
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

### 动态设置选项卡

```schema
{
  "type": "page",
    "data": {
    "key": 2
  },
  "body": [
    {
      "type": "radios",
      "name": "key",
      "mode": "inline",
      "label": "激活的选项卡",
      "options": [
        {
          "label": "Tab 1",
          "value": 0
        },
        {
          "label": "Tab 2",
          "value": 1
        },
        {
          "label": "Tab 3",
          "value": 2
        }
      ]
    },
    {
      "type": "tabs",
      "activeKey": "${key|toInt}",
      "tabs": [
        {
          "title": "Tab 1",
          "tab": "Content 1"
        },
        {
          "title": "Tab 2",
          "tab": "Content 2"
        },
        {
          "title": "Tab 3",
          "tab": "Content 3"
        }
      ]
    }
  ]
}
```

### 初始化设置默认选项卡

> 2.7.1 以上版本

```schema
{
  "type": "page",
  "data": {
    "defaultKey": 1,
    "activeKey": 2
  },
  "body": [
    {
      "type": "radios",
      "name": "key",
      "mode": "inline",
      "label": "激活的选项卡",
      "options": [
        {
          "label": "Tab 1",
          "value": 0
        },
        {
          "label": "Tab 2",
          "value": 1
        },
        {
          "label": "Tab 3",
          "value": 2
        }
      ]
    },
    {
      "type": "tabs",
      "activeKey": "${activeKey|toInt}",
      "defaultKey": "${defaultKey|toInt}",
      "tabs": [
        {
          "title": "Tab 1",
          "tab": "Content 1"
        },
        {
          "title": "Tab 2",
          "tab": "Content 2"
        },
        {
          "title": "Tab 3",
          "tab": "Content 3"
        }
      ]
    }
  ]
}
```

> 初始化组件时 `defaultKey` 优先级高于 `activeKey`，但 `defaultKey` 仅作用于组件初始化时，不会响应上下文数据变化。

## 图标

通过 icon 可以设置 tab 的图标，可以是 fontawesome 或 URL 地址。

```schema: scope="body"
{
    "type": "tabs",
    "tabs": [
        {
            "title": "Tab 1",
            "tab": "Content 1",
            "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg"
        },

        {
            "title": "Tab 2",
            "tab": "Content 2"
        }
    ]
}
```



## title自定义

> 3.2.0 及以上版本

通过配置 tabs 数组中 title 为 schema，就能自定义 title 的显示。

```schema: scope="body"
{
    "type": "tabs",
    "addBtnText": "新增Tab",
    "showTip": true,
    "tabs": [
        {
            "title": {
                "type": "container",
                "body": [
                    {
                        "type": "tpl",
                        "tpl": "这里是容器内容区"
                    },
                    {
                        "type": "icon",
                        "icon": "cloud"
                    }
                ]
            },
            "closable": true,
            "tab": "Content 1",
            "tip": "容器内容区提示"
        },
        {
            "title": "Tab 2",
            "tab": "Content 2"
        }
    ]
}
```

## 配置超出折叠

通过配置 `collapseOnExceed` 可以用来实现超出折叠，额外还能通过 `collapseBtnLabel` 配置折叠按钮的文字

```schema: scope="body"
{
    "type": "tabs",
    "tabsMode": "tiled",
    "tabs": [
        {
            "title": "Tab 1",
            "tab": "Content 1",
        },

        {
            "title": "Tab 2",
            "tab": "Content 2"
        },

        {
            "title": "Tab 3",
            "tab": "Content 3",
        },

        {
            "title": "Tab 4",
            "tab": "Content 4"
        },

        {
            "title": "Tab 5",
            "tab": "Content 5"
        }
    ],

    "collapseOnExceed": 3
}
```

## mountOnEnter

只有在点击卡片的时候才会渲染，在内容较多的时候可以提升性能，但第一次点击的时候会有卡顿。

## unmountOnExit

如果你想在切换 tab 时，自动销毁掉隐藏的 tab，请配置`"unmountOnExit": true`。

## 监听切换事件

```schema: scope="body"
{
    "type": "tabs",
    "activeKey": "tab2",
    "onSelect": "alert(key)",
    "tabs": [
      {
        "title": "Tab 1",
        "hash": "tab1",
        "tab": "Content 1"
      },
      {
        "title": "Tab 2",
        "hash": "tab2",
        "tab": "Content 2"
      }
    ]
  }
```

会传递 key 参数和 props

## 属性表

| 属性名                | 类型                              | 默认值                              | 说明                                                                                                       |
| --------------------- | --------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| type                  | `string`                          | `"tabs"`                            | 指定为 Tabs 渲染器                                                                                         |
| defaultKey            | `string` / `number`               |                                     | 组件初始化时激活的选项卡，hash 值或索引值，支持使用表达式 `2.7.1 以上版本`                                 |
| activeKey             | `string` / `number`               |                                     | 激活的选项卡，hash 值或索引值，支持使用表达式，可响应上下文数据变化                                        |
| className             | `string`                          |                                     | 外层 Dom 的类名                                                                                            |
| linksClassName        | `string`                          |                                     | Tabs 标题区的类名                                                                                            |
| contentClassName      | `string`                          |                                     | Tabs 内容区的类名                                                                                            |
| tabsMode              | `string`                          |                                     | 展示模式，取值可以是 `line`、`card`、`radio`、`vertical`、`chrome`、`simple`、`strong`、`tiled`、`sidebar` |
| tabs                  | `Array`                           |                                     | tabs 内容                                                                                                  |
| source                | `string`                          |                                     | tabs 关联数据，关联后可以重复生成选项卡                                                                    |
| toolbar               | [SchemaNode](../types/schemanode) |                                     | tabs 中的工具栏                                                                                            |
| toolbarClassName      | `string`                          |                                     | tabs 中工具栏的类名                                                                                        |
| tabs[x].title         | `string` \| [SchemaNode](../types/schemanode)                        |                                     | Tab 标题，当是 [SchemaNode](../types/schemanode) 时，该 title 不支持 editable 为 true 的双击编辑                                                                                               |
| tabs[x].icon          | `icon`                            |                                     | Tab 的图标                                                                                                 |
| tabs[x].iconPosition  | `left` / `right`                  | `left`                              | Tab 的图标位置                                                                                             |
| tabs[x].tab           | [SchemaNode](../types/schemanode) |                                     | 内容区                                                                                                     |
| tabs[x].hash          | `string`                          |                                     | 设置以后将跟 url 的 hash 对应                                                                              |
| tabs[x].reload        | `boolean`                         |                                     | 设置以后内容每次都会重新渲染，对于 crud 的重新拉取很有用                                                   |
| tabs[x].unmountOnExit | `boolean`                         |                                     | 每次退出都会销毁当前 tab 栏内容                                                                            |
| tabs[x].className     | `string`                          | `"bg-white b-l b-r b-b wrapper-md"` | Tab 区域样式                                                                                               |
| tabs[x].tip     | `string`                          |                         | `3.2.0及以上版本支持` Tab 提示，当开启 `showTip` 时生效，作为 Tab 在 hover 时的提示显示，可不配置，如不设置，`tabs[x].title` 作为提示显示                                                |
| tabs[x].closable      | `boolean`                         | false                               | 是否支持删除，优先级高于组件的 `closable`                                                                  |
| tabs[x].disabled      | `boolean`                         | false                               | 是否禁用                                                                                                   |
| mountOnEnter          | `boolean`                         | false                               | 只有在点中 tab 的时候才渲染                                                                                |
| unmountOnExit         | `boolean`                         | false                               | 切换 tab 的时候销毁                                                                                        |
| addable               | `boolean`                         | false                               | 是否支持新增                                                                                               |
| addBtnText            | `string`                          | 增加                                | 新增按钮文案                                                                                               |
| closable              | `boolean`                         | false                               | 是否支持删除                                                                                               |
| draggable             | `boolean`                         | false                               | 是否支持拖拽                                                                                               |
| showTip               | `boolean`                         | false                               | 是否支持提示                                                                                               |
| showTipClassName      | `string`                          | `'' `                               | 提示的类                                                                                                   |
| editable              | `boolean`                         | false                               | 是否可编辑标签名。当 `tabs[x].title` 为 [SchemaNode](../types/schemanode) 时，双击编辑 Tab 的 title 显示空的内容                                                                                          |
| scrollable            | `boolean`                         | true                                | 是否导航支持内容溢出滚动。（属性废弃）                                                                     |
| sidePosition          | `left` / `right`                  | `left`                              | `sidebar` 模式下，标签栏位置                                                                               |
| collapseOnExceed      | `number`                          |                                     | 当 tabs 超出多少个时开始折叠                                                                               |
| collapseBtnLabel      | `string`                          | `more`                              | 用来设置折叠按钮的文字                                                                                     |
| swipeable             | `boolean`                         | false                               | 是否开启手势滑动切换（移动端生效）                                                                         |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                             | 说明             |
| -------- | ------------------------------------ | ---------------- |
| change   | `value: number \| string` 选项卡索引 | 切换选项卡时触发 |

### change

```schema: scope="body"
{
    "type": "tabs",
    "mode": "line",
    "tabs": [
    {
        "title": "选项卡1",
        "body": "选项卡内容1"
    },
    {
        "title": "选项卡2",
        "body": "选项卡内容2"
    },
    {
        "title": "选项卡3",
        "body": "选项卡内容3"
    }
    ],
    "onEvent": {
        "change": {
            "actions": [
                {
                    "actionType": "toast",
                    "args": {
                    "msgType": "info",
                    "msg": "切换至选项卡${event.data.value}"
                    }
                }
            ]
        }
    }
}
```

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称        | 动作配置                                 | 说明             |
| --------------- | ---------------------------------------- | ---------------- |
| changeActiveKey | `activeKey: number \| string` 选项卡索引 | 激活指定的选项卡 |

### changeActiveKey

可以尝试点击下方按钮，实现选项卡激活。

```schema: scope="body"
[
    {
      "type": "action",
      "label": "激活选项卡1",
      "className": "mr-3 mb-3",
      "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "changeActiveKey",
              "componentId": "tabs-change-receiver",
              "args": {
                "activeKey": 1
              }
            }
          ]
        }
      }
    },
    {
      "type": "action",
      "label": "激活选项卡2",
      "className": "mr-3 mb-3",
      "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "changeActiveKey",
              "componentId": "tabs-change-receiver",
              "args": {
                "activeKey": 2
              }
            }
          ]
        }
      }
    },
    {
      "type": "action",
      "label": "激活选项卡3",
      "className": "mr-3 mb-3",
      "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "changeActiveKey",
              "componentId": "tabs-change-receiver",
              "args": {
                "activeKey": 3
              }
            }
          ]
        }
      }
    },
    {
      "id": "tabs-change-receiver",
      "type": "tabs",
      "mode": "line",
      "tabs": [
        {
          "title": "选项卡1",
          "body": "选项卡内容1"
        },
        {
          "title": "选项卡2",
          "body": "选项卡内容2"
        },
        {
          "title": "选项卡3",
          "body": "选项卡内容3"
        }
      ]
    }
]
```
