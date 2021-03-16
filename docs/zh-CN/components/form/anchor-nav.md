---
title: AnchorNav 锚点导航
description:
type: 0
group: null
menuName: AnchorNav 锚点导航
icon:
order: 53
---

有多组表单输入框时，可以通过锚点导航来分组，方便定位查看。

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "controls": [
    {
      "type": "anchor-nav",
      "links": [
        {
          "title": "员工基本信息",
          "controls": [
            {
                "type": "fieldSet",
                "title": "员工基本信息",
                "controls": [
                    {
                    "name": "name",
                    "type": "text",
                    "label": "用户名"
                    },

                    {
                    "name": "age",
                    "type": "text",
                    "label": "年龄"
                    }
                ]
                }
          ]
        },

        {
          "title": "在职信息",
          "controls": [
            {
                "type": "fieldSet",
                "title": "在职信息",
                "controls": [
                    {
                    "name": "home",
                    "type": "text",
                    "label": "居住地址"
                    },

                    {
                    "name": "address",
                    "type": "text",
                    "label": "工作地址"
                    }
                ]
            }
          ]
        },

        {
          "title": "教育经历",
          "controls": [
            {
                "type": "fieldSet",
                "title": "教育经历",
                "controls": [
                    {
                    "name": "school1",
                    "type": "text",
                    "label": "经历1"
                    },
                    {
                    "name": "school2",
                    "type": "text",
                    "label": "经历2"
                    },
                    {
                    "name": "school2",
                    "type": "text",
                    "label": "经历2"
                    }
                ]
            }
          ]
        },

        {
          "title": "紧急联系人信息",
          "controls": [
            {
                "type": "fieldSet",
                "title": "紧急联系人信息",
                "controls": [
                    {
                    "name": "contact1",
                    "type": "text",
                    "label": "联系人1"
                    },
                    {
                    "name": "contact2",
                    "type": "text",
                    "label": "联系人2"
                    },
                    {
                    "name": "contact3",
                    "type": "text",
                    "label": "联系人3"
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

## 更多功能

请参考[这里](../anchor-nav)。

## 属性表

请参考[这里](../anchor-nav#属性表)。
