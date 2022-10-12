---
title: Calendar 日历日程
description:
type: 0
group: ⚙ 组件
menuName: Calendar 日历日程
icon:
order: 36
---

## 基本用法

设置 `schedules` 属性

```schema: scope="body"
{
    "type": "calendar",
    "value": "1638288000",
    "schedules": [
      {
        "startTime": "2021-12-11 05:14:00",
        "endTime": "2021-12-11 06:14:00",
        "content": "这是一个日程1"
      },
      {
        "startTime": "2021-12-21 05:14:00",
        "endTime": "2021-12-22 05:14:00",
        "content": "这是一个日程2"
      }
    ]
}
```

## 自定义颜色

```schema: scope="body"
{
    "type": "calendar",
    "value": "1638288000",
    "schedules": [
      {
        "startTime": "2021-12-11 05:14:00",
        "endTime": "2021-12-11 06:14:00",
        "content": "这是一个日程1",
        "className": "bg-success"
      },
      {
        "startTime": "2021-12-21 05:14:00",
        "endTime": "2021-12-22 05:14:00",
        "content": "这是一个日程2",
        "className": "bg-info"
      }
    ]
}
```

## 自定义日程展示

```schema: scope="body"
{
    "type": "calendar",
    "value": "1638288000",
    "schedules": [
      {
        "startTime": "2021-12-11 05:14:00",
        "endTime": "2021-12-11 06:14:00",
        "content": "这是一个日程1"
      },
      {
        "startTime": "2021-12-21 05:14:00",
        "endTime": "2021-12-22 05:14:00",
        "content": "这是一个日程2"
      }
    ],
    "scheduleAction": {
      "actionType": "drawer",
      "drawer": {
        "title": "日程",
        "body": {
          "type": "table",
          "columns": [
            {
              "name": "time",
              "label": "时间"
            },
            {
              "name": "content",
              "label": "内容"
            }
          ],
          "data": "${scheduleData}"
        }
      }
    }
}
```

## 支持从数据源中获取日程

```schema
{
    "type": "page",
    "data": {
      "schedules": [
        {
          "startTime": "2021-12-11 05:14:00",
          "endTime": "2021-12-11 06:14:00",
          "content": "这是一个日程1"
        },
        {
          "startTime": "2021-12-21 05:14:00",
          "endTime": "2021-12-22 05:14:00",
          "content": "这是一个日程2"
        }
      ]
    },
    "body": [
      {
        "type": "calendar",
        "value": "1638288000",
        "schedules": "${schedules}"
      }
    ]
}
```

## 放大模式

```schema: scope="body"
{
    "type": "calendar",
    "value": "1638288000",
    "largeMode": true,
    "schedules": [
      {
        "startTime": "2021-12-10 23:59:59",
        "endTime": "2021-12-11 00:00:00",
        "content": "这是一个日程1"
      },
      {
        "startTime": "2021-12-12 00:00:00",
        "endTime": "2021-12-13 00:00:01",
        "content": "这是一个日程2"
      },
      {
        "startTime": "2021-12-20 05:14:00",
        "endTime": "2021-12-21 05:14:00",
        "content": "这是一个日程3"
      },
      {
        "startTime": "2021-12-21 05:14:00",
        "endTime": "2021-12-22 05:14:00",
        "content": "这是一个日程4"
      },
      {
        "startTime": "2021-12-22 02:14:00",
        "endTime": "2021-12-23 05:14:00",
        "content": "这是一个日程5"
      },
      {
        "startTime": "2021-12-22 02:14:00",
        "endTime": "2021-12-22 05:14:00",
        "content": "这是一个日程6"
      },
      {
        "startTime": "2021-12-22 02:14:00",
        "endTime": "2021-12-22 05:14:00",
        "content": "这是一个日程7"
      },
      {
        "startTime": "2021-12-25 12:00:00",
        "endTime": "2021-12-25 15:00:00",
        "content": "这是一个日程8"
      }
    ]
}
```

## 今日高亮样式自定义

> 2.1.1 及以上版本

```schema: scope="body"
{
    "type": "calendar",
    "value": "NOW()",
    "todayActiveStyle": {
      "backgroundColor": "#ef4444 !important",
      "color": "#f8f9fa",
      "border": "none",
      "borderRadius": "15px"
    },
    "schedules": [
      {
        "startTime": "2021-12-11 05:14:00",
        "endTime": "2021-12-11 06:14:00",
        "content": "这是一个日程1"
      },
      {
        "startTime": "2021-12-21 05:14:00",
        "endTime": "2021-12-22 05:14:00",
        "content": "这是一个日程2"
      }
    ]
}
```

## Calendar 属性表

| 属性名             | 类型                                                                                      | 默认值                                                                 | 说明                                                                                                                                                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type               | `string`                                                                                  | `"calendar"`                                                           | 指定为 calendar 渲染器                                                                                                                                                                                                          |
| schedules          | `Array<{startTime: string, endTime: string, content: any, className?: string}> \| string` |                                                                        | 日历中展示日程，可设置静态数据或从上下文中取数据，startTime 和 endTime 格式参考[文档](https://momentjs.com/docs/#/parsing/string/)，className 参考[背景色](https://baidu.gitee.io/amis/zh-CN/style/background/background-color) |
| scheduleClassNames | `Array<string>`                                                                           | `['bg-warning', 'bg-danger', 'bg-success', 'bg-info', 'bg-secondary']` | 日历中展示日程的颜色，参考[背景色](https://baidu.gitee.io/amis/zh-CN/style/background/background-color)                                                                                                                         |
| scheduleAction     | `SchemaNode`                                                                              |                                                                        | 自定义日程展示                                                                                                                                                                                                                  |
| largeMode          | `boolean`                                                                                 | `false`                                                                | 放大模式                                                                                                                                                                                                                        |
| todayActiveStyle   | `Record<string, any>`                                                                     |                                                                        | 今日激活时的自定义样式                                                                                                                                                                                                          |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.2 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数                 | 说明             |
| -------- | ------------------------ | ---------------- |
| change   | `value: string` 组件的值 | 时间值变化时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                 | 说明                                                   |
| -------- | ------------------------ | ------------------------------------------------------ |
| clear    | -                        | 清空                                                   |
| reset    | -                        | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| setValue | `value: string` 更新的值 | 更新数据                                               |
