---
title: Hidden 隐藏字段
description:
type: 0
group: null
menuName: Hidden 隐藏字段
icon:
order: 26
---

## 基本用法

默认表单提交，在没有 [自定义 API 请求数据](../../../docs/types/api#%E9%85%8D%E7%BD%AE%E8%AF%B7%E6%B1%82%E6%95%B0%E6%8D%AE) 的情况下，只会发送 `body` 里面的这些成员，对于隐藏的字段同时又希望提交表单的时候带过去，可以使用 `hidden` 组件

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "hidden",
      "name": "id",
      "value": 1
    },
    {
      "type": "input-text",
      "name": "name",
      "label": "姓名："
    },
    {
      "name": "email",
      "type": "input-email",
      "label": "邮箱："
    }
  ]
}
```
