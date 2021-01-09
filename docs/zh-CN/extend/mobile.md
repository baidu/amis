---
title: 移动端扩展
---

有时候我们需要在移动端下展示不同效果，可以通过 `mobile` 属性来在移动端下覆盖部分属性。

```schema: scope="body"
{
  "type": "form",
  "controls": [{
    "name": "email",
    "type": "email",
    "label": "邮箱：",
    "mobile": {
      "type": "text",
      "label": "电话：",
      "validations": {
        "isPhoneNumber": true
      }
    }
  }]
}
```

请点击上方切换到移动端预览
