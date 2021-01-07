---
title: Button 按钮
description:
type: 0
group: ⚙ 组件
menuName: Button 按钮
icon:
order: 29
---

## 基本用法

```schema: scope="body"
{
  "label": "弹个框",
  "type": "button",
  "actionType": "dialog",
  "dialog": {
    "title": "弹框",
    "body": "这是个简单的弹框。"
  }
}
```

`button` 实际上是 `action` 的别名，更多用法见[action](./action)
