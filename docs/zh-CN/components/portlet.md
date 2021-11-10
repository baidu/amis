---
title: Portlet 门户栏目
description:
type: 0
group: ⚙ 组件
menuName: Portlet
icon:
order: 60
---

门户栏目组件。

## 基本用法

```schema: scope="body"
{
    "type": "page",
    "data": {
        "text": "这是一段描述信息"
    },
    "body": {
        "type": "portlet",
        "desc": "${text}",
        shrinkToolbar: true,
        "toolbar": [
                {
                        "label": "固定操作",
                        "type": "button",
                        "actionType": "ajax",
                        "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm"
                }
        ],
        "tabs": [
            {
                "title": "标题",
                "tab": "Content 1",
                "toolbar": [
                    {
                        "label": "ajax请求1",
                        "level": "link",
                        "type": "button",
                        "actionType": "ajax",
                        "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm"
                    },
                    {
                        "type": "button",
                        "level": "link",
                        "url": "https://www.baidu.com",
                        "actionType": "url",
                        "label": "跳转1"
                    }
                ]
            },
            {
                "title": "标题2",
                "tab": "Content 2",
                "toolbar": [
                    {
                        "label": "ajax请求2",
                        "type": "button",
                        "level": "link",
                        "actionType": "ajax",
                        "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm"
                    },
                    {
                        "type": "button",
                        "level": "link",
                        "url": "https://www.baidu.com",
                        "actionType": "url",
                        "label": "跳转2"
                    }
                ]
            }
        ]
    }
}
```
## shrink toolbar

将tab里配置的toolbar以下拉的形式收起展示

```schema: scope="body"
{
    "type": "portlet",
    "tabs": [
        {
            "title": "Tab 1",
            "tab": "Content 1",
            "shrinkToolbar": true,
            "toolbar": [
                {
                    "label": "ajax请求",
                    "type": "button",
                    "actionType": "ajax",
                    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm"
                },
                {
                    "type": "button",
                    "hotKey": "command+o,ctrl+o",
                    "label": "弹框",
                    "actionType": "dialog",
                    "dialog": {
                        "title": "弹框",
                        "body": "这是个简单的弹框。"
                        }
                }
            ]
        },
        {
            "title": "Tab 2",
            "tab": "Content 2",
            "toolbar": [
                {
                    "type": "link",
                    "href": "https://www.baidu.com",
                    "body": "跳转"
                }
            ]
        }
    ]
}
```

## 影藏头部

去掉头部，默认只展示内容tab第一项的内容

```schema: scope="body"
{
    "type": "portlet",
    "hideHeader": true,
    "tabs": [
        {
            "title": "Tab 1",
            "tab": "Content 1"
        }
    ]
}
```

## 设置style

默认tabs只有一项的时候没有选中状态

```schema: scope="body"
{
    "type": "portlet",
    "style": {
        "borderColor": '#333'
    },
    "tabs": [
        {
            "title": "Tab 1",
            "tab": "Content 1"
        }
    ]
}
```



## 去掉分隔线

```schema: scope="body"
{
    "type": "portlet",
    "divider": false,
    "activeSelect": false,
    "tabs": [
        {
            "title": "Tab 1",
            "tab": "Content 1"
        }
    ]
}
```

## source动态数据

配置 source 属性,根据某个数据来动态生成。具体使用参考Tabs选项卡组件

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
    "activeKey": 1,
    "onSelect": "alert(key)",
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

会传递 key 参数和 props

## 属性表

| 属性名                | 类型                              | 默认值                              | 说明                                                                                       |
| --------------------- | --------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| type                  | `string`                          | `"portlet"`                            | 指定为 Portlet 渲染器                                                                         |
| className             | `string`                          |                                     | 外层 Dom 的类名                                                                            |
| tabsClassName         | `string`                          |                                     | Tabs Dom 的类名                                                                            |
| contentClassName      | `string`                          |                                     | Tabs content Dom 的类名                                                                            |
| tabs                  | `Array`                           |                                     | tabs 内容                                                                                  |
| source                | `Object`                          |                                     | tabs 关联数据，关联后可以重复生成选项卡                                                    |
| toolbar               | [SchemaNode](../types/schemanode) |                                     | tabs 中的工具栏，不随tab切换而变化                                                                            |
| style                 | `string \| Object`                |                                     | 自定义样式|
| desc                  | [模板](../../docs/concepts/template)|                                    | 标题右侧信息                                                                           |
| hideHeader                | `boolean`                     |       false                          | 影藏头部                                                   |
| divider                | `boolean`                        |        false                         | 去掉分隔线                                                    |
| tabs[x].title         | `string`                          |                                     | Tab 标题                                                                                   |
| tabs[x].icon          | `icon`                            |                                     | Tab 的图标                                                                                 |
| tabs[x].tab           | [SchemaNode](../types/schemanode) |                                     | 内容区                                                                                     |
| tabs[x].toolbar       | [SchemaNode](../types/schemanode) |                                     | tabs 中的工具栏，随tab切换而变化  
| tabs[x].reload        | `boolean`                         |                                     | 设置以后内容每次都会重新渲染，对于 crud 的重新拉取很有用                                   |
| tabs[x].unmountOnExit | `boolean`                         |                                     | 每次退出都会销毁当前 tab 栏内容                                                            |
| tabs[x].className     | `string`                          | `"bg-white b-l b-r b-b wrapper-md"` | Tab 区域样式                                                                               |
| mountOnEnter          | `boolean`                         | false                               | 只有在点中 tab 的时候才渲染                                                                |
| unmountOnExit         | `boolean`                         | false                               | 切换 tab 的时候销毁                                                                        |
| scrollable            | `boolean`                         | false                               | 是否导航支持内容溢出滚动，`vertical`和`chrome`模式下不支持该属性；`chrome`模式默认压缩标签 |
