### Button

按钮, 包含 `button`、`submit` 和 `reset`。 字段说明。

-   `type` 请设置成 `button`
-   `label` 按钮文字
-   `icon` 按钮图标。可以使用来自 fontawesome 的图标。
-   `level` 按钮级别。 包含： `link`、`primary`、`success`、`info`、`warning`和`danger`。
-   `size` 按钮大小。 包含： `xs`、`sm`、`md`和`lg`
-   `className` 按钮的类名。

如果按钮是 `button` 类型，则还需要配置 [Action](./Action.md) 中定义的属性，否则，amis 不知道如何响应当前按钮点击。

```schema:height="300" scope="form"
[
  {
    "type": "text",
    "name": "test",
    "label": "Text"
  },

  {
    "type": "button",
    "label": "Button",
    "actionType": "dialog",
    "dialog": {
      "confirmMode": false,
      "title": "提示",
      "body": "对，你刚点击了！"
    }
  },

  {
    "type": "submit",
    "level": "primary",
    "label": "Submit"
  },

  {
    "type": "reset",
    "label": "Reset",
    "level": "danger"
  }
]
```
