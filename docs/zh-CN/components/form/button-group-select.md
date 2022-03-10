---
title: Button-Group-Select 按钮点选
description:
type: 0
group: null
menuName: Button-Group-Select
icon:
order: 6
---

## 基本用法

按钮集合当 select 点选用。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "button-group-select",
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
        },
        {
          "label": "Option C",
          "value": "c"
        }
      ]
    }
  ]
}
```

## 垂直模式

配置`"vertical": true`，实现垂直模式

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "button-group-select",
      "label": "选项",
      "name": "type",
      "vertical": true,
      "options": [
        {
          "label": "Option A",
          "value": "a"
        },
        {
          "label": "Option B",
          "value": "b"
        },
        {
          "label": "Option C",
          "value": "c"
        }
      ]
    }
  ]
}
```

## 平铺模式

配置 `"tiled": true` 实现平铺模式

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "button-group-select",
      "label": "选项",
      "name": "type",
      "tiled": true,
      "options": [
        {
          "label": "Option A",
          "value": "a"
        },
        {
          "label": "Option B",
          "value": "b"
        },
        {
          "label": "Option C",
          "value": "c"
        }
      ]
    }
  ]
}
```

## 按钮主题样式

配置 `btnLevel` 统一设置按钮主题样式，注意 `buttons ` 或 `options` 中的`level`属性优先级高于`btnLevel`。配置 `btnActiveLevel` 为按钮设置激活态时的主题样式。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "button-group-select",
      "label": "选项",
      "name": "type",
      "btnLevel": "light",
      "btnActiveLevel": "warning",
      "options": [
        {
          "label": "Option A",
          "value": "a"
        },
        {
          "label": "Option B",
          "value": "b"
        },
        {
          "label": "Option C",
          "value": "c",
          "level": "primary"
        }
      ]
    }
  ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名         | 类型                                                                                                                | 默认值                  | 说明                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| type           | `string`                                                                                                            | `"button-group-select"` | 指定为 button-group-select 渲染器                                                           |
| vertical       | `boolean`                                                                                                           | `false`                 | 是否使用垂直模式                                                                            |
| tiled          | `boolean`                                                                                                           | `false`                 | 是否使用平铺模式                                                                            |
| btnLevel       | `'link' \| 'primary' \| 'secondary' \| 'info'\|'success' \| 'warning' \| 'danger' \| 'light'\| 'dark' \| 'default'` | `"default"`             | 按钮样式                                                                                    |
| btnActiveLevel | `'link' \| 'primary' \| 'secondary' \| 'info'\|'success' \| 'warning' \| 'danger' \| 'light'\| 'dark' \| 'default'` | `"default"`             | 选中按钮样式                                                                                |
| options        | `Array<object>`或`Array<string>`                                                                                    |                         | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| source         | `string`或 [API](../../../docs/types/api)                                                                           |                         | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| multiple       | `boolean`                                                                                                           | `false`                 | [多选](./options#%E5%A4%9A%E9%80%89-multiple)                                               |
| labelField     | `boolean`                                                                                                           | `"label"`               | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField     | `boolean`                                                                                                           | `"value"`               | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| joinValues     | `boolean`                                                                                                           | `true`                  | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                  |
| extractValue   | `boolean`                                                                                                           | `false`                 | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)              |
| autoFill       | `object`                                                                                                            |                         | [自动填充](./options#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85-autofill)                         |
