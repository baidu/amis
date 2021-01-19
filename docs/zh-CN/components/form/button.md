---
title: Button 按钮
description:
type: 0
group: null
menuName: Button
icon:
order: 4
---

按钮用于实现点击时触发行为，比如弹窗等， 更多请参考 [Action](./action)，在 `form` 中还支持提交和重置功能的按钮。

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名："
      },
      {
        "type": "action",
        "actionType": "dialog",
        "label": "按钮",
        "dialog": {
            "title": "弹框标题",
            "body": "这是一个弹框"
        }
      }
    ]
}
```

## 提交表单

请配置`"actionType": "submit"`或`"type": "submit"`按钮，可以触发表单提交行为，

```schema: scope="body"
{
    "type": "form",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名："
      },
      {
        "type": "submit",
        "label": "提交"
      }
    ]
}
```

## 重置表单

请配置`"actionType": "reset"`或`"type": "reset"`按钮，可以触发表单提交行为。

```schema: scope="body"
{
    "type": "form",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名："
      },
      {
        "type": "reset",
        "label": "重置"
      }
    ]
}
```

## 属性表

见 [Action 行为按钮](../action)
