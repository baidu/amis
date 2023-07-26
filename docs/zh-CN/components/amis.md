---
title: AMIS 渲染器
description:
type: 0
group: ⚙ 组件
menuName: AMIS 渲染器
icon:
order: 28
---

用于渲染数据中的 amis 配置

## 基本使用

只需要设置 schema 或 name，值可以是 JSON 对象或字符串的 JSON

```schema: scope="body"
{
  "type": "amis",
  "schema": {
    "type": "tpl",
    "tpl": "amis render"
  }
}
```

## 通过 name 绑定动态数据

可以用在表单或 CRUD 中，下面示例演示了编辑后实时渲染的效果，因为使用了相同 的 name

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "title": "实时测试 amis 渲染效果",
    "body": [
        {
            "type": "group",
            "body": [
                {
                    "type": "editor",
                    "name": "amis",
                    "language": "json",
                    "value": {
                      "label": "弹框",
                      "type": "button",
                      "actionType": "dialog",
                      "dialog": {
                        "title": "弹框",
                        "body": "这是个简单的弹框。"
                      }
                    }
                },
                {
                    "type": "amis",
                    "name": "amis"
                }
            ]
        }

    ]
}
```

## 向下传递 props

通过设置 props 向下传递，这个 props 会作为默认值

```schema: scope="body"
{
  "type": "amis",
  "props": {
    "tpl": "amis render"
  },
  "value": {
    "type": "tpl"
  }
}
```

## 属性表

| 属性名 | 类型     | 默认值   | 说明               |
| ------ | -------- | -------- | ------------------ |
| type   | `string` | `"amis"` | 指定为 amis 渲染器 |
| name   | `string` |          | 绑定上下文变量名   |
| props  | `object` |          | 向下传递的 props   |
