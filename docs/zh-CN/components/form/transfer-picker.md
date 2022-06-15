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

## 自定义选项展示

```schema: scope="body"
{
    "type": "form",
    "body": [
      {
        "label": "默认",
        "type": "transfer-picker",
        "name": "transfer",
        "menuTpl": "<div class='flex justify-between'><span>${label}</span><span class='text-muted m-r text-sm'>${tag}</span></div>",
        "valueTpl": "${label}(${value})",
        "options": [
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
```

## 属性表

更多配置请参考[穿梭器（Transfer）](./transfer)。

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`event.data.xxx`事件参数变量来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数                          | 说明                             |
| -------- | --------------------------------- | -------------------------------- |
| change   | `event.data.value: string` 选中值 | picker 弹窗确认提交时触发        |
| focus    | -                                 | 输入框获取焦点(非内嵌模式)时触发 |
| blur     | -                                 | 输入框失去焦点(非内嵌模式)时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                 | 说明                                                   |
| -------- | ------------------------ | ------------------------------------------------------ |
| clear    | -                        | 清空                                                   |
| reset    | -                        | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| setValue | `value: string` 更新的值 | 更新数据，多值用`,`分隔                                |
