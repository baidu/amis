---
title: 状态样式
---

除了给默认状态设置样式外，还支持几个特定状态的样式设置比如：hover（鼠标悬停）、active（当前选中）或者 disabled（当前不可用）。

```schema:height="100" scope="body"
{
  "type": "button",
  "label": "按钮",
  "className": "bg-pink-400 hover:bg-pink-600",
  "actionType": "dialog",
  "dialog": {
    "title": "弹框",
    "body": "Hello World!"
  }
}
```
