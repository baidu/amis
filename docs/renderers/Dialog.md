### Dialog

Dialog 由 [Action](./Action.md) 触发。他是一个类似于 [Page](./Page.md) 的容器模型。

| 属性名        | 类型                                            | 默认值       | 说明                                             |
| ------------- | ----------------------------------------------- | ------------ | ------------------------------------------------ |
| type          | `string`                                        |              | `"dialog"` 指定为 Dialog 渲染器                  |
| title         | `string` 或者 [Container](./Types.md#Container) |              | 弹出层标题                                       |
| body          | [Container](./Types.md#Container)               |              | 往 Dialog 内容区加内容                           |
| size          | `string`                                        |              | 指定 dialog 大小，支持: `xs`、`sm`、`md`、`lg`   |
| bodyClassName | `string`                                        | `modal-body` | Dialog body 区域的样式类名                       |
| closeOnEsc    | `boolean`                                       | `false`      | 是否支持按 `Esc` 关闭 Dialog                     |
| disabled      | `boolean`                                       | `false`      | 如果设置此属性，则该 Dialog 只读没有提交操作。   |
| actions       | Array Of [Action](./Action.md)                  |              | 可以不设置，默认只有【确认】和【取消】两个按钮。 |

```schema:height="200"
{
  "body": {
    "label": "弹出",
    "type": "button",
    "level": "primary",
    "actionType": "dialog",
    "dialog": {
      "title": "表单设置",
      "body": {
        "type": "form",
        "api": "/api/mock2/form/saveForm?waitSeconds=1",
        "controls": [
          {
            "type": "text",
            "name": "text",
            "label": "文本"
          }
        ]
      }
    }
  }
}
```
