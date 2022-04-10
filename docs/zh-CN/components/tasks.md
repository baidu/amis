---
title: Tasks 任务操作集合
description:
type: 0
group: ⚙ 组件
menuName: Tasks
icon:
order: 69
---

任务操作集合，类似于 orp 上线。

## 基本用法

```schema: scope="body"
{
    "type": "tasks",
    "name": "tasks",
    "items": [
        {
            "label": "hive 任务",
            "key": "hive",
            "status": 4,
            "remark": "查看详情<a target=\"_blank\" href=\"http://www.baidu.com\">日志</a>。"
        },
        {
            "label": "小流量",
            "key": "partial",
            "status": 4
        },
         {
             "label": "全量",
             "key": "full",
             "status": 4
         }
    ]
}
```

## 属性表

| 属性名            | 类型                        | 默认值                                                                                              | 说明                                                                                                                                      |
| ----------------- | --------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| type              | `string`                    | `"tasks"`                                                                                           | 指定为 Tasks 渲染器                                                                                                                       |
| className         | `string`                    |                                                                                                     | 外层 Dom 的类名                                                                                                                           |
| tableClassName    | `string`                    |                                                                                                     | table Dom 的类名                                                                                                                          |
| items             | `Array`                     |                                                                                                     | 任务列表                                                                                                                                  |
| items[x].label    | `string`                    |                                                                                                     | 任务名称                                                                                                                                  |
| items[x].key      | `string`                    |                                                                                                     | 任务键值，请唯一区分                                                                                                                      |
| items[x].remark   | `string`                    |                                                                                                     | 当前任务状态，支持 html                                                                                                                   |
| items[x].status   | `string`                    |                                                                                                     | 任务状态： 0: 初始状态，不可操作。1: 就绪，可操作状态。2: 进行中，还没有结束。3：有错误，不可重试。4: 已正常结束。5：有错误，且可以重试。 |
| checkApi          | [API](../../docs/types/api) |                                                                                                     | 返回任务列表，返回的数据请参考 items。                                                                                                    |
| submitApi         | [API](../../docs/types/api) |                                                                                                     | 提交任务使用的 API                                                                                                                        |
| reSubmitApi       | [API](../../docs/types/api) |                                                                                                     | 如果任务失败，且可以重试，提交的时候会使用此 API                                                                                          |
| interval          | `number`                    | `3000`                                                                                              | 当有任务进行中，会每隔一段时间再次检测，而时间间隔就是通过此项配置，默认 3s。                                                             |
| taskNameLabel     | `string`                    | 任务名称                                                                                            | 任务名称列说明                                                                                                                            |
| operationLabel    | `string`                    | 操作                                                                                                | 操作列说明                                                                                                                                |
| statusLabel       | `string`                    | 状态                                                                                                | 状态列说明                                                                                                                                |
| remarkLabel       | `string`                    | 备注                                                                                                | 备注列说明                                                                                                                                |
| btnText           | `string`                    | 上线                                                                                                | 操作按钮文字                                                                                                                              |
| retryBtnText      | `string`                    | 重试                                                                                                | 重试操作按钮文字                                                                                                                          |
| btnClassName      | `string`                    | `btn-sm btn-default`                                                                                | 配置容器按钮 className                                                                                                                    |
| retryBtnClassName | `string`                    | `btn-sm btn-danger`                                                                                 | 配置容器重试按钮 className                                                                                                                |
| statusLabelMap    | `array`                     | `["label-warning", "label-info", "label-success", "label-danger", "label-default", "label-danger"]` | 状态显示对应的类名配置                                                                                                                    |
| statusTextMap     | `array`                     | `["未开始", "就绪", "进行中", "出错", "已完成", "出错"]`                                            | 状态显示对应的文字显示配置                                                                                                                |

```schema: scope="body"
[
{
    "type": "tasks",
    "name": "tasks",
    "checkApi": "/api/mock2/task"
},

"为了演示，目前获取的状态都是随机出现的。"]
```
