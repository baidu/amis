---
title: Elevator 电梯导航
description:
type: 0
group: null
menuName: Elevator 电梯导航
icon:
order: 53
---

有多组输入框时，可以通过电梯导航来分组，方便定位查看。

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "controls": [
    {
      "type": "elevator",
      "floors": [
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
                "title": "地址信息",
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

请参考[这里](../elevator)。

## 属性表

请参考[这里](../elevator#属性表)。
