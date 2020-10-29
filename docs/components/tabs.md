---
title: Tabs 选项卡
description:
type: 0
group: ⚙ 组件
menuName: Tabs
icon:
order: 68
---

## 基本用法

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

## 展示模式

### 线型

```schema:height="300" scope="body"
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
    ]
}
```

### 卡片模式

```schema:height="300" scope="body"
{
    "type": "tabs",
    "mode": "card",
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

### 选择器型

```schema:height="300" scope="body"
{
    "type": "tabs",
    "mode": "radio",
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

```schema:height="300" scope="body"
{
    "type": "tabs",
    "mode": "vertical",
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

## 配置顶部工具栏

配置`toolbar`实现顶部工具栏。

```schema:height="200" scope="body"
{
    "type": "tabs",
    "toolbar": [
        {
            "type": "button",
            "label": "按钮",
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

```schema:height="300" scope="body"
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

```schema:height="300" scope="body"
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

单个`tab`上不要配置`hash`属性，配置需要展示的`tab`索引值，`0`代表第一个。

```schema:height="300" scope="body"
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

## unmountOnExit

如果你想在切换 tab 时，自动销毁掉隐藏的 tab，请配置`"unmountOnExit": true`

## 属性表

| 属性名                | 类型                              | 默认值                              | 说明                                                     |
| --------------------- | --------------------------------- | ----------------------------------- | -------------------------------------------------------- |
| type                  | `string`                          | `"tabs"`                            | 指定为 Tabs 渲染器                                       |
| className             | `string`                          |                                     | 外层 Dom 的类名                                          |
| mode                  | `string`                          |                                     | 展示模式，取值可以是 `line`、`card`、`radio`、`vertical`   |
| tabsClassName         | `string`                          |                                     | Tabs Dom 的类名                                          |
| tabs                  | `Array`                           |                                     | tabs 内容                                                |
| toolbar               | [SchemaNode](../types/schemanode) |                                     | tabs 中的工具栏                                          |
| toolbarClassName      | `string`                          |                                     | tabs 中工具栏的类名                                      |
| tabs[x].title         | `string`                          |                                     | Tab 标题                                                 |
| tabs[x].icon          | `icon`                            |                                     | Tab 的图标                                               |
| tabs[x].tab           | [SchemaNode](../types/schemanode) |                                     | 内容区                                                   |
| tabs[x].hash          | `string`                          |                                     | 设置以后将跟 url 的 hash 对应                            |
| tabs[x].reload        | `boolean`                         |                                     | 设置以后内容每次都会重新渲染，对于 crud 的重新拉取很有用 |
| tabs[x].unmountOnExit | `boolean`                         |                                     | 每次退出都会销毁当前 tab 栏内容                          |
| tabs[x].className     | `string`                          | `"bg-white b-l b-r b-b wrapper-md"` | Tab 区域样式                                             |
