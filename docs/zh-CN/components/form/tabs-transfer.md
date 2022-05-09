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

## 自定义选项展示

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
      "menuTpl": "<div class='flex justify-between'><span>${label}</span><span class='text-muted m-r text-sm'>${tag}</span></div>",
      "valueTpl": "${label}(${value})",
      "options": [
        {
          "label": "成员",
          "selectMode": "list",
          "searchable": true,
          "children": [
            {
              "label": "诸葛亮",
              "value": "zhugeliang",
              "tag": "法师",
            },
            {
              "label": "曹操",
              "value": "caocao",
              "tag": "战士",
            },
            {
              "label": "钟无艳",
              "value": "zhongwuyan",
              "tag": "战士",
            },
            {
              "label": "李白",
              "value": "libai",
              "tag": "打野"
            },
            {
              "label": "韩信",
              "value": "hanxin",
              "tag": "打野"
            },
            {
              "label": "云中君",
              "value": "yunzhongjun",
              "tag": "打野"
            }
          ]
        },
        {
          "label": "用户",
          "selectMode": "list",
          "children": [
            {
              "label": "诸葛亮",
              "value": "zhugeliang",
              "tag": "法师",
            },
            {
              "label": "曹操",
              "value": "caocao",
              "tag": "战士",
            },
            {
              "label": "钟无艳",
              "value": "zhongwuyan",
              "tag": "战士",
            },
            {
              "label": "李白",
              "value": "libai",
              "tag": "打野"
            },
            {
              "label": "韩信",
              "value": "hanxin",
              "tag": "打野"
            },
            {
              "label": "云中君",
              "value": "yunzhongjun",
              "tag": "打野"
            }
          ]
        }
      ]
    }
  ]
}
```

## 数据懒加载

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
    "options": [
      {
        "label": "成员",
        "selectMode": "associated",
        "searchable": true,
        "leftMode": "tree",
        "children": [
          {
            ref: "user",
            "children": [
              {
                "label": "诸葛亮",
                "value": "zhugeliang2"
              },
              {
                "label": "上官婉儿",
                "value": "shangguan"
              }
            ]
          },
          {
            "ref": "a",
            "children": [
              {
                "label": "A-1",
                "value": "a1"
              },
              {
                "label": "A-2",
                "value": "a2"
              }
            ]
          },
          {
            "ref": "b",
            "children": [
              {
                "label": "B-1",
                "value": "b1"
              }
            ]
          },
          {
            "ref": "c",
            "children": [
              {
                "label": "C-1",
                "value": "c1"
              }
            ]
          },
          {
            "ref": "d",
            "children": [
              {
                "label": "D-1",
                "value": "d1"
              }
            ]
          },
          {
            "ref": "e",
            "children": [
              {
                "label": "E-1",
                "value": "e1"
              },
              {
                "label": "E-2",
                "value": "e2"
              }
            ]
          }
        ],
        "leftOptions": [
          {
            "defer": true,
            "deferApi": "/api/mock2/form/getOptions",
            "label": "DEFER"
          },
          {
            "label": "法师",
            "value": "user"
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

## 事件表

| 事件名称   | 事件参数                              | 说明   |
| ---------- | ------------------------------------- | ------ |
| change     | `value: string` 时间值                | 值变化 |
| tab-change | `key: number` 当前选择的 tab 的 index | 值变化 |

## 动作表

| 动作名称  | 动作配置                 | 说明                                                   |
| --------- | ------------------------ | ------------------------------------------------------ |
| clear     | -                        | 清空                                                   |
| reset     | -                        | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| selectAll | -                        | 全选                                                   |
| changeTabKey | `activeKey: number` 选中的Tab          | 修改当前选中tab，来选择其他选项        |
| setValue  | `value: string` 更新的值 | 更新数据，多值用`,`分隔                                |
