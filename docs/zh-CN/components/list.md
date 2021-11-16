---
title: List 列表
description:
type: 0
group: ⚙ 组件
menuName: List
icon:
order: 56
---

列表展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像`Service`这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过`source`属性，获取数据链中的数据，完成数据展示。

## 基本用法

```schema: scope="body"
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
              "label": "查看详情",
              "actionType": "dialog",
              "dialog": {
                "title": "查看详情",
                "body": {
                  "type": "form",
                  "body": [
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

或者你也可以使用 CRUD 的 [list 模式](./crud#list-%E5%88%97%E8%A1%A8%E6%A8%A1%E5%BC%8F)

## 单行点击操作

> 1.4.0 及以上版本

配置 itemAction 可以实现点击某一行后进行操作，支持 [action](./action) 里的所有配置，比如弹框、刷新其它组件等。

```schema: scope="body"
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
        "itemAction": {
          "type": "button",
          "actionType": "dialog",
          "dialog": {
            "title": "详情",
            "body": "当前行的数据 browser: ${browser}, version: ${version}"
          }
        },
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
              "label": "查看详情",
              "actionType": "dialog",
              "dialog": {
                "title": "查看详情",
                "body": {
                  "type": "form",
                  "body": [
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

## 属性表

| 属性名                   | 类型                                 | 默认值                | 说明                                                                         |
| ------------------------ | ------------------------------------ | --------------------- | ---------------------------------------------------------------------------- |
| type                     | `string`                             |                       | `"list"` 指定为列表展示。                                                    |
| title                    | `string`                             |                       | 标题                                                                         |
| source                   | `string`                             | `${items}`            | 数据源, 获取当前数据域变量，支持[数据映射](../../docs/concepts/data-mapping) |
| placeholder              | `string`                             | ‘暂无数据’            | 当没数据的时候的文字提示                                                     |
| className                | `string`                             |                       | 外层 CSS 类名                                                                |
| headerClassName          | `string`                             | `amis-list-header`    | 顶部外层 CSS 类名                                                            |
| footerClassName          | `string`                             | `amis-list-footer`    | 底部外层 CSS 类名                                                            |
| listItem                 | `Array`                              |                       | 配置单条信息                                                                 |
| listItem.title           | [模板](../../docs/concepts/template) |                       | 标题                                                                         |
| listItem.titleClassName  | `string`                             | `h5`                  | 标题 CSS 类名                                                                |
| listItem.subTitle        | [模板](../../docs/concepts/template) |                       | 副标题                                                                       |
| listItem.avatar          | [模板](../../docs/concepts/template) |                       | 图片地址                                                                     |
| listItem.avatarClassName | `string`                             | `thumb-sm avatar m-r` | 图片 CSS 类名                                                                |
| listItem.desc            | [模板](../../docs/concepts/template) |                       | 描述                                                                         |
| listItem.body            | `Array`                              |                       | 内容容器，主要用来放置非表单项组件                                           |
| listItem.actions         | Array<[Action](./action)>            |                       | 按钮区域                                                                     |
| listItem.actionsPosition | 'left' or 'right'                    | 默认在右侧            | 按钮位置                                                                     |
