---
title: UUID 字段
description:
type: 0
group: null
menuName: UUID 字段
icon:
order: 30
---

## 基本用法

随机生成一个 id，可以用于防止表单重复提交。

```schema:height="400" scope="body"
{
  "type": "form",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "debug": true,
  "controls": [
    {
      "type": "uuid",
      "name": "uuid"
    },
    {
      "type": "text",
      "name": "name",
      "label": "姓名："
    }
  ]
}
```

这个字段是不显示的，上面这个例子之所以显示是因为加了 `debug: true`。
