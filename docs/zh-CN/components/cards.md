---
title: Cards 卡片组
description:
type: 0
group: ⚙ 组件
menuName: Cards 卡片组
icon:
order: 32
---

卡片展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像`Service`这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过`source`属性，获取数据链中的数据，完成数据展示。

## 基本用法

这里我们使用手动初始数据域的方式，即配置`data`属性，进行数据域的初始化。

```schema
{
  "type": "page",
  "data": {
    "items": [
      {
        "engine": "Trident",
        "browser": "Internet Explorer 4.0",
        "platform": "Win 95+",
        "version": "4",
        "grade": "X"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 5.0",
        "platform": "Win 95+",
        "version": "5",
        "grade": "C"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 5.5",
        "platform": "Win 95+",
        "version": "5.5",
        "grade": "A"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 6",
        "platform": "Win 98+",
        "version": "6",
        "grade": "A"
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 7",
        "platform": "Win XP SP2+",
        "version": "7",
        "grade": "A"
      }
    ]
  },
  "body": {
    "type": "cards",
    "source": "$items",
    "card": {
      "body": [
        {
          "label": "Engine",
          "name": "engine"
        },
        {
          "label": "Browser",
          "name": "browser"
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
              "body": [
                {
                  "label": "Engine",
                  "name": "engine",
                  "type": "static"
                },

                {
                  "name": "browser",
                  "label": "Browser",
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
```

或者你也可以使用 CRUD 的 [card 模式](./crud#cards-%E5%8D%A1%E7%89%87%E6%A8%A1%E5%BC%8F)

## 属性表

| 属性名          | 类型                                         | 默认值              | 说明                           |
| --------------- | -------------------------------------------- | ------------------- | ------------------------------ |
| type            | `string`                                     |                     | `"cards"` 指定为卡片组。       |
| title           | [模板](../../docs/concepts/template)         |                     | 标题                           |
| source          | [数据映射](../../docs/concepts/data-mapping) | `${items}`          | 数据源, 获取当前数据域中的变量 |
| placeholder     | [模板](../../docs/concepts/template)         | ‘暂无数据’          | 当没数据的时候的文字提示       |
| className       | `string`                                     |                     | 外层 CSS 类名                  |
| headerClassName | `string`                                     | `amis-grid-header`  | 顶部外层 CSS 类名              |
| footerClassName | `string`                                     | `amis-grid-footer`  | 底部外层 CSS 类名              |
| itemClassName   | `string`                                     | `col-sm-4 col-md-3` | 卡片 CSS 类名                  |
| card            | [Card](./card)                               |                     | 配置卡片信息                   |
