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
      "name": "phone",
      "type": "text",
      "label": "电话：",
      "validations": {
        "isPhoneNumber": true
      }
    }
  }]
}
```

请点击上方切换到移动端预览效果。

`mobile` 属性可以出现在配置中的任意地方，替换父节点的任意属性，比如前面的例子可以写成放在 `form` 上替换所有 `controls`

```schema: scope="body"
{
  "type": "form",
  "controls": [{
    "name": "email",
    "type": "email",
    "label": "邮箱："
  }],
  "mobile": {
    "controls": [{
      "name": "phone",
      "type": "text",
      "label": "电话：",
      "validations": {
        "isPhoneNumber": true
      }
    }]
  }
}
```
