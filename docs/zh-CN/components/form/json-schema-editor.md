---
title: JSONSchema Editor
description:
type: 0
group: null
menuName: JSONSchema Editor
icon:
order: 61
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    debug: true,
    "body": [
        {
            "type": "json-schema-editor",
            "name": "schema",
            "label": "字段类型"
        }
    ]
}
```

## 顶级类型可配置

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "json-schema-editor",
            "name": "schema",
            "label": "字段类型",
            "rootTypeMutable": true,
            "showRootInfo": true
        }
    ]
}
```

## 属性表

| 属性名          | 类型      | 默认值 | 说明                 |
| --------------- | --------- | ------ | -------------------- |
| rootTypeMutable | 'boolean' | false  | 顶级类型是否可配置   |
| showRootInfo    | 'boolean' | false  | 是否显示顶级类型信息 |
