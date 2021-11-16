---
title: TabsTransfer 组合穿梭器
description:
type: 0
group: null
menuName: TabsTransfer 组合穿梭器
icon:
---

在[穿梭器（Transfer）](./transfer)的基础上扩充了左边的展示形式，支持 Tabs 的形式展示。对应的 options 的顶级数据，顶层 options 的成员支持 selectMode 配置这个 tab 下面的选项怎么展示。title 可以配置 tab 的标题。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
    "label": "组合穿梭器",
    "type": "tabs-transfer",
    "name": "a",
    "sortable": true,
    "selectMode": "tree",
    "searchable": true,
    "options": [
      {
        "label": "成员",
        "selectMode": "tree",
        "children": [
          {
            "label": "法师",
            "children": [
              {
                "label": "诸葛亮",
                "value": "zhugeliang"
              }
            ]
          },
          {
            "label": "战士",
            "children": [
              {
                "label": "曹操",
                "value": "caocao"
              },
              {
                "label": "钟无艳",
                "value": "zhongwuyan"
              }
            ]
          },
          {
            "label": "打野",
            "children": [
              {
                "label": "李白",
                "value": "libai"
              },
              {
                "label": "韩信",
                "value": "hanxin"
              },
              {
                "label": "云中君",
                "value": "yunzhongjun"
              }
            ]
          }
        ]
      },
      {
        "label": "用户",
        "selectMode": "chained",
        "children": [
          {
            "label": "法师",
            "children": [
              {
                "label": "诸葛亮",
                "value": "zhugeliang2"
              }
            ]
          },
          {
            "label": "战士",
            "children": [
              {
                "label": "曹操",
                "value": "caocao2"
              },
              {
                "label": "钟无艳",
                "value": "zhongwuyan2"
              }
            ]
          },
          {
            "label": "打野",
            "children": [
              {
                "label": "李白",
                "value": "libai2"
              },
              {
                "label": "韩信",
                "value": "hanxin2"
              },
              {
                "label": "云中君",
                "value": "yunzhongjun2"
              }
            ]
          }
        ]
      }
    ]
  }
  ]
}
```

## 属性表

更多配置请参考[穿梭器（Transfer）](./transfer)。
