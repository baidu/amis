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
      "label": "选人",
      "type": "tabs-transfer-picker",
      "name": "a",
      "sortable": true,
      "selectMode": "tree",
      "pickerSize": "md",
      "menuTpl": "<div class='flex justify-between'><span>${label}</span>${email ? `<div class='text-muted m-r-xs text-sm text-right'>${email}<br />${phone}</div>`: ''}</div>",
      "valueTpl": "${label}(${value})",
      "options": [
        {
          "label": "成员",
          "selectMode": "tree",
          "searchable": true,
          "children": [
            {
              "label": "法师",
              "children": [
                {
                  "label": "诸葛亮",
                  "value": "zhugeliang",
                  "email": "zhugeliang@timi.com",
                  "phone": 13111111111
                }
              ]
            },
            {
              "label": "战士",
              "children": [
                {
                  "label": "曹操",
                  "value": "caocao",
                  "email": "caocao@timi.com",
                  "phone": 13111111111
                },
                {
                  "label": "钟无艳",
                  "value": "zhongwuyan",
                  "email": "zhongwuyan@timi.com",
                  "phone": 13111111111
                }
              ]
            },
            {
              "label": "打野",
              "children": [
                {
                  "label": "李白",
                  "value": "libai",
                  "email": "libai@timi.com",
                  "phone": 13111111111
                },
                {
                  "label": "韩信",
                  "value": "hanxin",
                  "email": "hanxin@timi.com",
                  "phone": 13111111111
                },
                {
                  "label": "云中君",
                  "value": "yunzhongjun",
                  "email": "yunzhongjun@timi.com",
                  "phone": 13111111111
                }
              ]
            }
          ]
        },
        {
          "label": "角色",
          "selectMode": "list",
          "children": [
            {
              "label": "角色 1",
              "value": "role1",
            },
            {
              "label": "角色 2",
              "value": "role2",
            },
            {
              "label": "角色 3",
              "value": "role3",
            },
            {
              "label": "角色 4",
              "value": "role4",
            }
          ]
        },
        {
          "label": "部门",
          "selectMode": "tree",
          "children": [
            {
              "label": "总部",
              "value": "dep0",
              "children": [
                {
                  "label": "部门 1",
                  "value": "dep1",
                  "children": [
                    {
                      "label": "部门 4",
                      "value": "dep4",
                    },
                    {
                      "label": "部门 5",
                      "value": "dep5",
                    }
                  ]
                },
                {
                  "label": "部门 2",
                  "value": "dep2",
                },
                {
                  "label": "部门 3",
                  "value": "dep3",
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
