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

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                                                 | 说明                      |
| -------- | -------------------------------------------------------- | ------------------------- |
| change   | `[name]: string` 组件的值<br/>`items: object[]` 选项集合 | picker 弹窗确认提交时触发 |
| focus    | `[name]: string` 组件的值                                | 获取焦点(非内嵌模式)      |
| blur     | `[name]: string` 组件的值                                | 失去焦点(非内嵌模式)      |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                               | 说明                                                                                    |
| -------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| clear    | -                                      | 清空                                                                                    |
| reset    | -                                      | 将值重置为`resetValue`，若没有配置`resetValue`，则清空                                  |
| setValue | `value: string` \| `string[]` 更新的值 | 更新数据，开启`multiple`支持设置多项，开启`joinValues`时，多值用`,`分隔，否则多值用数组 |
