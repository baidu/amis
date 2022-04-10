---
title: Input-Group 输入框组合
description:
type: 0
group: null
menuName: Input-Group
icon:
order: 28
---

**输入框组合选择器** 可用于输入框与其他组件进行组合。

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-group",
      "name": "input-group",
      "label": "input 组合",
      "body": [
        {
          "type": "input-text",
          "placeholder": "搜索作业ID/名称",
          "inputClassName": "b-r-none p-r-none",
          "name": "input-group"
        },
        {
          "type": "submit",
          "label": "搜索",
          "level": "primary"
        }
      ]
    },
    {
      "type": "input-group",
      "label": "各种组合",
      "body": [
        {
          "type": "select",
          "name": "memoryUnits",
          "options": [
            {
              "label": "Gi",
              "value": "Gi"
            },
            {
              "label": "Mi",
              "value": "Mi"
            },
            {
              "label": "Ki",
              "value": "Ki"
            }
          ],
          "value": "Gi"
        },
        {
          "type": "input-text",
          "name": "memory"
        },
        {
          "type": "select",
          "name": "memoryUnits2",
          "options": [
            {
              "label": "Gi",
              "value": "Gi"
            },
            {
              "label": "Mi",
              "value": "Mi"
            },
            {
              "label": "Ki",
              "value": "Ki"
            }
          ],
          "value": "Gi"
        },
        {
          "type": "button",
          "label": "Go"
        }
      ]
    }
  ]
}

```

## 校验

input-group 配置校验方法较为特殊，需要配置下面步骤：

1. input-group 上配置任意`name`值
2. input-group 的 body 内配置的表单项上配置校验规则

## 属性表

| 属性名    | 类型                        | 默认值 | 说明       |
| --------- | --------------------------- | ------ | ---------- |
| className | `string`                    |        | CSS 类名   |
| body      | Array<[表单项](./formitem)> |        | 表单项集合 |
