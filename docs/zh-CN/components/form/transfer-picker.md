---
title: TransferPicker 穿梭选择器
description:
type: 0
group: null
menuName: TransferPicker 穿梭选择器
icon:
---

在[穿梭器（Transfer）](./transfer)的基础上扩充了弹窗选择模式，展示值用的是简单的 input 框，但是编辑的操作是弹窗个穿梭框来完成。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
    "label": "组合穿梭器",
    "type": "transfer-picker",
    "name": "a",
    "sortable": true,
    "selectMode": "tree",
    "searchable": true,
    "options": [
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
  }
  ]
}
```

## 属性表

更多配置请参考[穿梭器（Transfer）](./transfer)。
