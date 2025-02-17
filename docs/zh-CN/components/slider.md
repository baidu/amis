---
title: Slider 滑动条
description:
type: 0
group: ⚙ 组件
menuName: Tabs
icon:
---

主要用于移动端中支持左右滑动展示更多内容，在桌面端中更多内容展示在右侧

## 基本用法

```schema
{
  "type": "page",
  "body": {
    "type": "service",
    "api": "/api/mock2/sample?perPage=5",
    "body": [
      {
        "type": "list",
        "source": "$rows",
        "listItem": {
          "body": [
            {
              "type": "slider",
              "body": [
                {
                  "type": "container",
                  "body": {
                    "type": "tpl",
                    "tpl": "Engine: ${engine}"
                  }
                }
              ],
              "left":  [
                {
                  "type": "button",
                  "level": "primary",
                  "label": "详情",
                  "actionType": "dialog",
                  "dialog": {
                    "title": "查看详情",
                    "body": {
                      "type": "form",
                      "body": [
                        {
                          "label": "Engine",
                          "name": "engine",
                          "type": "static"
                        },
                        {
                          "name": "version",
                          "label": "Version",
                          "type": "static"
                        }
                      ]
                    }
                  }
                }
              ],
              "right":  [
                {
                  "type": "button",
                  "level": "danger",
                  "label": "删除"
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```

## 事件表

> 2.6.1 及以上版本

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，详细查看[事件动作](../../docs/concepts/event-action)。

| 事件名称  | 事件参数                     | 说明               |
| --------- | ---------------------------- | ------------------ |
| leftShow  | `label: string` 鼠标事件对象 | 左侧内容出现时触发 |
| leftHide  | `label: string` 鼠标事件对象 | 左侧内容隐藏时触发 |
| rightShow | `label: string` 鼠标事件对象 | 右侧内容出现时触发 |
| rightHide | `label: string` 鼠标事件对象 | 右侧内容隐藏时触发 |

## 属性表

| 属性名    | 类型                                      | 默认值     | 说明                                      |
| --------- | ----------------------------------------- | ---------- | ----------------------------------------- |
| type      | `string`                                  | `'slider'` | 指定为滑动条渲染器                        |
| body      | [SchemaNode](../../docs/types/schemanode) |            | 容器主要内容                              |
| right     | [SchemaNode](../../docs/types/schemanode) |            | 容器右侧内容，在 pc 下展示在右侧          |
| left      | [SchemaNode](../../docs/types/schemanode) |            | 容器左侧内容，在 pc 下展示在右侧          |
| bodyWidth | `string`                                  | `'60%'`    | pc 下 body 即移动端默认宽度占比，默认 60% |
