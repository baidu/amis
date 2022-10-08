---
title: Status 状态
description:
type: 0
group: ⚙ 组件
menuName: Status
icon:
order: 65
---

## 基本用法

它最适合的用法是放在列表类组件（CRUD，Table，List 等）的列中，用来表示状态。

```schema: scope="body"
{
    "type": "status",
    "value": 1
}
```

## 默认状态列表

下表是默认支持的几种状态：

```schema: scope="body"
{
    "type": "table",
    "data": {
        "items": [
            {
                "label": "-",
                "value": "0",
                "icon": "fail",
                "status": 0
            },
            {
                "label": "-",
                "value": "1",
                "icon": "success",
                "status": 1
            },
            {
                "label": "成功",
                "value": "success",
                "icon": "success",
                "status": "success"
            },
            {
                "label": "运行中",
                "value": "pending",
                "icon": "rolling",
                "status": "pending"
            },
            {
                "label": "排队中",
                "value": "queue",
                "icon": "warning",
                "status": "queue"
            },
            {
                "label": "调度中",
                "value": "schedule",
                "icon": "schedule",
                "status": "schedule"
            },
            {
                "label": "失败",
                "value": "fail",
                "icon": "fail",
                "status": "fail"
            }
        ]
    },
    "columns": [
        {
            "name": "value",
            "label": "默认value值"
        },
        {
            "name": "label",
            "label": "默认label"
        },
        {
          "name": "icon",
          "label": "默认icon值"
        },
        {
            "name": "status",
            "label": "状态",
            "type": "mapping",
            "map": {
                "*": {
                    "type": "status"
                }
            }
        }
    ]
}
```

## 自定义状态图标和文本

如果默认提供的状态无法满足业务需求，可以使用`map` 和 `labelMap`属性分别配置状态组件的**图标**和**展示文案**。用户自定义的`map` 和 `labelMap`会和默认属性进行 merge，如果只需要修改某一项配置时，无需全量覆盖。

```schema
{
  "type": "page",
  "body": [
    {
      "type": "status",
      "map": {
        "0": "fa fa-check-circle",
        "1": "fa fa-times-circle"
      },
      "labelMap": {
        "0": "正常",
        "1": "异常"
      },
      "value": 0,
      "className": "mr-3"
    },
    {
      "type": "status",
      "map": {
        "0": "fas fa-check-circle",
        "1": "fas fa-times-circle"
      },
      "labelMap": {
        "0": "正常",
        "1": "异常"
      },
      "value": 1
    }
  ]
}
```

## 动态数据

`map` 和 `labelMap`支持配置变量，通过数据映射获取上下文中的变量。

> 2.3.0 及以上版本

```schema
{
  "type": "page",
  "data": {
    "statusLabel": {
      "success": "任务成功",
      "warning": "已停机"
    },
    "statusIcon":  {
      "waiting": "far fa-clock",
      "warning": "fas fa-exclamation"
    }
  },
  "body": {
    "type": "table",
    "data": {
      "items": [
        {
          "id": "1",
          "name": "Task1",
          "status": "success"
        },
        {
          "id": "2",
          "name": "Task2",
          "status": "processing",
        },
        {
          "id": "3",
          "name": "Task3",
          "status": "waiting",
        },
        {
          "id": "4",
          "name": "Task4",
          "status": "warning",
        },
        {
          "id": "5",
          "name": "Task5",
          "status": "fail",
        }
      ]
    },
    "columns": [
      {
        "name": "id",
        "label": "ID"
      },
      {
        "name": "name",
        "label": "Name"
      },
      {
        "name": "status",
        "label": "状态",
        "type": "mapping",
        "map": {
          "*": {
            "type": "status",
            "map": {
              "processing": "rolling",
              "waiting": "${statusIcon.waiting}",
              "warning": "${statusIcon.warning}"
            },
            "labelMap": {
              "success": "${statusLabel.success}",
              "processing": "处理中",
              "waiting": "等待中",
              "warning": "${statusLabel.warning}"
            }
          }
        }
      }
    ]
  }
}
```

## 属性表

| 属性名      | 类型     | 默认值 | 说明                            |
| ----------- | -------- | ------ | ------------------------------- |
| type        | `string` |        | `"status"` 指定为 Status 渲染器 |
| className   | `string` |        | 外层 Dom 的 CSS 类名            |
| placeholder | `string` | `-`    | 占位文本                        |
| map         | `object` |        | 映射图标                        |
| labelMap    | `object` |        | 映射文本                        |
