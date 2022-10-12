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

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.1 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称   | 事件参数                                                 | 说明             |
| ---------- | -------------------------------------------------------- | ---------------- |
| change     | `[name]: string` 组件的值<br/>`items: Option[]` 选项集合 | 选中值变化时触发 |
| tab-change | `key: number` 当前激活的选项卡索引                       | 选项卡切换时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称     | 动作配置                               | 说明                                                                                    |
| ------------ | -------------------------------------- | --------------------------------------------------------------------------------------- |
| clear        | -                                      | 清空                                                                                    |
| reset        | -                                      | 将值重置为`resetValue`，若没有配置`resetValue`，则清空                                  |
| selectAll    | -                                      | 全选                                                                                    |
| changeTabKey | `activeKey: number` 选中的 Tab         | 修改当前选中 tab，来选择其他选项                                                        |
| setValue     | `value: string` \| `string[]` 更新的值 | 更新数据，开启`multiple`支持设置多项，开启`joinValues`时，多值用`,`分隔，否则多值用数组 |
