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

| 属性名                | 类型                              | 默认值                              | 说明                                                                                       |
| --------------------- | --------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| type                  | `string`                          | `"tabs"`                            | 指定为 Tabs 渲染器                                                                         |
| className             | `string`                          |                                     | 外层 Dom 的类名                                                                            |
| tabsMode              | `string`                          |                                     | 展示模式，取值可以是 `line`、`card`、`radio`、`vertical`、`chrome`、`simple`、`strong`、`tiled`、`sidebar`         |
| tabsClassName         | `string`                          |                                     | Tabs Dom 的类名                                                                            |
| tabs                  | `Array`                           |                                     | tabs 内容                                                                                  |
| source                | `string`                          |                                     | tabs 关联数据，关联后可以重复生成选项卡                                                    |
| toolbar               | [SchemaNode](../types/schemanode) |                                     | tabs 中的工具栏                                                                            |
| toolbarClassName      | `string`                          |                                     | tabs 中工具栏的类名                                                                        |
| tabs[x].title         | `string`                          |                                     | Tab 标题                                                                                   |
| tabs[x].icon          | `icon`                            |                                     | Tab 的图标                                                                                 |
| tabs[x].iconPosition  | `left` / `right`                  | `left`                              | Tab 的图标位置                                                                                 |
| tabs[x].tab           | [SchemaNode](../types/schemanode) |                                     | 内容区                                                                                     |
| tabs[x].hash          | `string`                          |                                     | 设置以后将跟 url 的 hash 对应                                                              |
| tabs[x].reload        | `boolean`                         |                                     | 设置以后内容每次都会重新渲染，对于 crud 的重新拉取很有用                                   |
| tabs[x].unmountOnExit | `boolean`                         |                                     | 每次退出都会销毁当前 tab 栏内容                                                            |
| tabs[x].className     | `string`                          | `"bg-white b-l b-r b-b wrapper-md"` | Tab 区域样式                                                                               |
| tabs[x].closable      | `boolean`                         | false                               | 是否支持删除，优先级高于组件的 `closable`                                                      |
| tabs[x].disabled      | `boolean`                         | false                               | 是否禁用                                                    |
| mountOnEnter          | `boolean`                         | false                               | 只有在点中 tab 的时候才渲染                                                                |
| unmountOnExit         | `boolean`                         | false                               | 切换 tab 的时候销毁                                                                        |
| addable               | `boolean`                         | false                               | 是否支持新增                                                                               |
| addBtnText            | `string`                          | 增加                                 | 新增按钮文案                                                                               |
| closable              | `boolean`                         | false                               | 是否支持删除                                                                               |
| draggable             | `boolean`                         | false                               | 是否支持拖拽                                                                               |
| showTip               | `boolean`                         | false                               | 是否支持提示                                                                               |
| showTipClassName      | `string`                          | `'' `                               | 提示的类                                                                              |
| editable              | `boolean`                         | false                               | 收否可编辑标签名                                                                              |
| scrollable            | `boolean`                         | true                                | 是否导航支持内容溢出滚动。（属性废弃）                                             |
| sidePosition          | `left` / `right`                  | `left`                              | `sidebar` 模式下，标签栏位置

## 事件表

| 事件名称 | 事件参数 | 说明 |
| ----  | ------------------------------------ | ------------------ |
| change |  `value: number \| string` 选项卡切换 | 切换选项卡时触发 |

## 动作表

| 动作名称 | 动作配置 | 说明 |
| --------------- | ----------------------------------- | -------------- |
| changeActiveKey | `activeKey: number \| string` 激活项 | 修改激活的tab值  |
