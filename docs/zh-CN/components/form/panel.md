---
title: Panel 面板
description:
type: 0
group: null
menuName: Panel
icon:
order: 34
---

展现上将多个 [表单项](./formItem) 放同一个容器下。

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
        {
          "type": "panel",
          "controls": [
            {
              "name": "text",
              "type": "text",
              "label": "text"
            },

            {
              "name": "text2",
              "type": "text",
              "label": "text2"
            }
          ]
        }
    ]
}
```

## 属性表

| 属性名          | 类型                                 | 默认值 | 说明                                                                |
| --------------- | ------------------------------------ | ------ | ------------------------------------------------------------------- |
| title           | `string`                             |        | panel 标题                                                          |
| body            | [SchemaNode](../../types/schemanode) |        | 内容区                                                              |
| bodyClassName   | `string`                             |        | body 的 className                                                   |
| footer          | [SchemaNode](../../types/schemanode) |        | 底部区                                                              |
| footerClassName | `string`                             |        | footer 的 className                                                 |
| controls        | Array<表单项>                        |        | `controls` 跟 `body` 二选一，如果设置了 controls 优先显示表单集合。 |

- `title` panel 标题
- `body` [SchemaNode](../../types/schemanode) 可以是其他渲染模型。
- `bodyClassName` body 的 className.
- `footer` [SchemaNode](../../types/schemanode) 可以是其他渲染模型。
- `footerClassName` footer 的 className.
- `controls` 跟 `body` 二选一，如果设置了 controls 优先显示表单集合。
