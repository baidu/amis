### Panel

可以把相关信息以盒子的形式展示到一块。

| 属性名           | 类型                              | 默认值                                 | 说明                |
| ---------------- | --------------------------------- | -------------------------------------- | ------------------- |
| type             | `string`                          | `"panel"`                              | 指定为 Panel 渲染器 |
| className        | `string`                          | `"panel-default"`                      | 外层 Dom 的类名     |
| headerClassName  | `string`                          | `"panel-heading"`                      | header 区域的类名   |
| footerClassName  | `string`                          | `"panel-footer bg-light lter wrapper"` | footer 区域的类名   |
| actionsClassName | `string`                          | `"panel-footer"`                       | actions 区域的类名  |
| bodyClassName    | `string`                          | `"panel-body"`                         | body 区域的类名     |
| title            | `string`                          |                                        | 标题                |
| header           | [Container](./Types.md#container) |                                        | 顶部容器            |
| body             | [Container](./Types.md#container) |                                        | 内容容器            |
| footer           | [Container](./Types.md#container) |                                        | 底部容器            |
| affixFooter      | `boolean`                         |                                        | 是否固定底部容器    |
| actions          | Array Of [Button](./Button.md)    |                                        | 按钮区域            |

```schema:height="300" scope="body"
{
    "type": "panel",
    "title": "Panel Heading",
    "body": "Panel Body",
    "actions": [
        {
            "type": "button",
            "label": "Action 1",
            "actionType": "dialog",
            "dialog": {
              "confirmMode": false,
              "title": "提示",
              "body": "对，你刚点击了！"
            }
        },

        {
          "type": "button",
          "label": "Action 2",
          "actionType": "dialog",
          "dialog": {
            "confirmMode": false,
            "title": "提示",
            "body": "对，你刚点击了！"
          }
        }
    ]
}
```
