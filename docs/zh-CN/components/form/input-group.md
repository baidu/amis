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

1. input-group 上配置任意`name`值 (必填, 否则表单内存在多个输入组合时无法定位)
2. input-group 的 body 内配置的表单项上配置校验规则
3. 如果 input-group 的子元素配置了`label`, 则会在校验失败时作为标识符展示, 否则仅使用索引值作为标识符
4. 单个子元素多条校验信息会使用`; `分隔
5. 可以使用`"errorMode": "full" | "partial"`设置错误提示风格, `full`整体飘红, `partial`仅错误元素飘红, 默认为`"full"`

> 细粒度错误提示需`2.7.1`及以上版本

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-group",
      "name": "input-group",
      "label": "输入组合校验",
      "body": [
        {
          "type": "input-text",
          "placeholder": "请输入长度不超过6的数字类型",
          "name": "group-input1",
          "label": "子元素一",
          "validations": {
            "isNumeric": true,
            "maxLength": 6
          },
        },
        {
          "type": "input-text",
          "placeholder": "请输入长度不少于5的文本",
          "name": "group-input2",
          "required": true,
          "validations": {
            "minLength": 5
          }
        }
      ]
    }
  ]
}
```

## 属性表

| 属性名           | 类型                                      | 默认值   | 说明                                                  | 版本    |
| ---------------- | ----------------------------------------- | -------- | ----------------------------------------------------- | ------- |
| className        | `string`                                  |          | CSS 类名                                              |         |
| body             | Array<[表单项](./formitem)>               |          | 表单项集合                                            |         |
| validationConfig | `Record<'errorMode' \| 'delimiter', any>` | -        | 校验相关配置, 具体配置属性如下                        | `2.8.0` |
| +errorMode       | `"full" \| "partial"`                     | `"full"` | 错误提示风格, `full`整体飘红, `partial`仅错误元素飘红 | `2.8.0` |
| +delimiter       | `string`                                  | `"; "`   | 单个子元素多条校验信息的分隔符                        | `2.8.0` |
