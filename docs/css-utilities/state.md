---
title: 状态样式
---

除了给默认状态设置样式外，还支持几个特定状态的样式设置比如：hover（鼠标悬停）、active（当前选中）、focus（当前聚焦）或者 disabled（当前不可用）。

```schema:height="100" scope="body"
[
  {
    "type": "button",
    "label": "按钮示例",
    "className": "rounded-xl text-light bg-pink-400 border-pink-600 hover:bg-pink-500 hover:border-pink-800 active:bg-pink-600 active:border-pink-900",
    "actionType": "dialog",
    "dialog": {
      "title": "弹框",
      "body": "Hello World!"
    }
  },

  {
    "type": "button",
    "label": "悬停态",
    "className": "m-l-16 rounded-xl text-light bg-pink-500 border-pink-800 hover:bg-pink-500 hover:border-pink-800",
    "actionType": "dialog",
    "dialog": {
      "title": "弹框",
      "body": "Hello World!"
    }
  },

  {
    "type": "button",
    "label": "按下态",
    "className": "m-l-xs rounded-xl text-light bg-pink-600 border-pink-900 hover:bg-pink-600 hover:border-pink-900",
    "actionType": "dialog",
    "dialog": {
      "title": "弹框",
      "body": "Hello World!"
    }
  },

  {
    "type": "button",
    "label": "禁用态",
    "disabled": true,
    "className": "m-l-xs rounded-xl disabled:text-dark disabled:bg-pink-200 disabled:border-pink-400 ",
    "actionType": "dialog",
    "dialog": {
      "title": "弹框",
      "body": "Hello World!"
    }
  }
]
```
