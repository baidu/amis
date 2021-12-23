---
title: TabsTransferPicker 穿梭选择器
description:
type: 0
group: null
menuName: TabsTransferPicker 穿梭选择器
icon:
---

在[TabsTransfer 组合穿梭器](./tabs-transfer)的基础上扩充了弹窗选择模式，展示值用的是简单的 input 框，但是编辑的操作是弹窗个穿梭框来完成。

适合用来做复杂选人组件。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "组合穿梭器",
      "type": "tabs-transfer-picker",
      "name": "a",
      "sortable": true,
      "selectMode": "tree",
      "searchable": true,
      "pickerSize": "md",
      "menuTpl": "<div class='flex justify-between'><span>${label}</span>${email ? `<span class='text-muted m-r-xs text-sm'>${email}</span>`: ''}</div>",
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
                  "value": "zhugeliang",
                  "email": "zhugeliang@timi.com"
                }
              ]
            },
            {
              "label": "战士",
              "children": [
                {
                  "label": "曹操",
                  "value": "caocao",
                  "email": "caocao@timi.com"
                },
                {
                  "label": "钟无艳",
                  "value": "zhongwuyan",
                  "email": "zhongwuyan@timi.com"
                }
              ]
            },
            {
              "label": "打野",
              "children": [
                {
                  "label": "李白",
                  "value": "libai",
                  "email": "libai@timi.com"
                },
                {
                  "label": "韩信",
                  "value": "hanxin",
                  "email": "hanxin@timi.com"
                },
                {
                  "label": "云中君",
                  "value": "yunzhongjun",
                  "email": "yunzhongjun@timi.com"
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
                  "value": "zhugeliang",
                  "email": "zhugeliang@timi.com"
                }
              ]
            },
            {
              "label": "战士",
              "children": [
                {
                  "label": "曹操",
                  "value": "caocao",
                  "email": "caocao@timi.com"
                },
                {
                  "label": "钟无艳",
                  "value": "zhongwuyan",
                  "email": "zhongwuyan@timi.com"
                }
              ]
            },
            {
              "label": "打野",
              "children": [
                {
                  "label": "李白",
                  "value": "libai",
                  "email": "libai@timi.com"
                },
                {
                  "label": "韩信",
                  "value": "hanxin",
                  "email": "hanxin@timi.com"
                },
                {
                  "label": "云中君",
                  "value": "yunzhongjun",
                  "email": "yunzhongjun@timi.com"
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

更多配置请参考[TabsTransfer 组合穿梭器](./tabs-transfer)。
