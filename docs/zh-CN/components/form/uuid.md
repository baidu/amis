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

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "uuid",
      "name": "uuid"
    }
  ]
}
```

这个字段是不显示的，上面这个例子之所以显示是因为加了 `debug: true`。

## length

目前 uuid 的唯一可设置参数是 length，用于生成短随机数

```schema:height="200" scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "uuid",
      "name": "uuid",
      "length": 8
    }
  ]
}
```
