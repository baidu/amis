---
title: Button-Group 按钮集合
description:
type: 0
group: null
menuName: Button-Group
icon:
order: 6
---

## 基本用法

用于将多个按钮在展现上合并到一起。

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
      "type": "button-group",
      "buttons": [
        {
          "type": "button",
          "label": "Button",
          "actionType": "dialog",
          "dialog": {
            "title": "提示",
            "body": "对，你刚点击了！"
          }
        },

        {
          "type": "submit",
          "label": "提交"
        },

        {
          "type": "reset",
          "label": "重置"
        }
      ]
    }
  ]
}
```

## 作为选择器表单项

当不配置 `buttons` 属性时，`button-group`还可以作为 [选择类表单项](./options) 使用。

```schema: scope="body"
{
  "type": "form",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "debug": true,
  "controls": [
    {
      "type": "button-group",
      "label": "选项",
      "name": "type",
      "options": [
        {
          "label": "Option A",
          "value": "a"
        },
        {
          "label": "Option B",
          "value": "b"
        }
      ]
    }
  ]
}
```

更多属性查看 [选择类表单项文档](./options) 。

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名       | 类型                                      | 默认值    | 说明                                                                                        |
| ------------ | ----------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| options      | `Array<object>`或`Array<string>`          |           | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| source       | `string`或 [API](../../../docs/types/api) |           | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| multiple     | `boolean`                                 | `false`   | [多选](./options#%E5%A4%9A%E9%80%89-multiple)                                               |
| labelField   | `boolean`                                 | `"label"` | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField   | `boolean`                                 | `"value"` | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| joinValues   | `boolean`                                 | `true`    | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                  |
| extractValue | `boolean`                                 | `false`   | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)              |
| autoFill     | `object`                                  |           | [自动填充](./options#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85-autofill)                         |
