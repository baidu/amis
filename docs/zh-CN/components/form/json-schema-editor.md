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

> 1.9.0 及以上版本

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

## 预设类型

通过设置 definitions 属性可以提供一些默认类型，可以减少类型的定义成本。

```schema: scope="form-item"
{
    label: 'JSON Schema Editor',
    name: 'schema',
    // showRootInfo: true,
    // rootTypeMutable: true,
    type: 'json-schema-editor',
    disabledTypes: ['null', 'interger', 'boolean'],
    definitions: {
        user: {
            type: 'object',
            title: '用户',
            properties: {
            name: {
                type: 'string',
                title: '用户名',
                description: '用户名信息'
            },

            id: {
                type: 'interger',
                title: '用户ID'
            },

            email: {
                type: 'string',
                title: '用户邮箱'
            },

            displayName: {
                type: 'string',
                title: '用户昵称'
            }
            }
        }
    }
}
```

## 开启高级配置

通过 `enableAdvancedSetting` 可以开启高级配置，同时通过 `advancedSettings` 可以定制弹窗中的配置面板。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "type": "json-schema-editor",
            "name": "schema",
            "label": "字段类型",
            "enableAdvancedSetting": true,
            "advancedSettings": {
                "string": [
                    {
                        "type": "input-text",
                        "name": "maxLength",
                        "label": "Max Length"
                    }
                ],
                "number": [
                    {
                        "type": "input-number",
                        "name": "max",
                        "label": "Max"
                    }
                ]
            }
        }
    ]
}
```

## 占位提示

> 2.8.0 及以上版本

设置`placeholder`属性，可以修改属性控件的默认占位提示文本，当前属性值会和默认值做合并

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "json-schema-editor",
            "name": "schema",
            "label": "字段类型",
            "enableAdvancedSetting": true,
            "placeholder": {
                "key": "请输入字段名称",
                "title": "请输入名称",
                "description": "请输入描述信息",
                "default": "",
                "empty": "暂无字段"
            }
        }
    ]
}
```

## 属性表

| 属性名          | 类型                          | 默认值                                                                                   | 说明                                                                                             | 版本    |
| --------------- | ----------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------- |
| rootTypeMutable | `boolean`                     | false                                                                                    | 顶级类型是否可配置                                                                               |
| showRootInfo    | `boolean`                     | false                                                                                    | 是否显示顶级类型信息                                                                             |
| disabledTypes   | `Array<string>`               |                                                                                          | 用来禁用默认数据类型，默认类型有：string、number、interger、object、number、array、boolean、null |
| definitions     | `object`                      |                                                                                          | 用来配置预设类型                                                                                 |
| placeholder     | `SchemaEditorItemPlaceholder` | `{key: "字段名", title: "名称", description: "描述", default: "默认值", empty: "<空>",}` | 属性输入控件的占位提示文本                                                                       | `2.8.0` |

### SchemaEditorItemPlaceholder

```typescript
interface SchemaEditorItemPlaceholder {
  /* 字段名称输入框占位文本 */
  key?: string;
  /* 名称输入框占位文本 */
  title?: string;
  /* 描述信息输入框占位文本 */
  description?: string;
  /* 默认值输入框占位文本 */
  default?: string;
  /* 默认值输入框占位文本 */
  empty?: string;
}
```
