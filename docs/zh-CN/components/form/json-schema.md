---
title: JSONSchema
description:
type: 0
group: null
menuName: JSONSchema
icon:
order: 61
---

## 基本用法

> 1.10.0 及以上版本

> 此组件还在实验阶段，很多 json-schema 属性没有对应实现，使用前请先确认你要的功能满足了需求

基于 json-schema 定义生成表单输入项。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    debug: true,
    "body": [
        {
            "type": "json-schema",
            "name": "value",
            "label": "字段值",
            "schema": {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  title: 'ID'
                },
                name: {
                  type: 'string',
                  title: '名称'
                },
                description: {
                  type: 'string',
                  title: '描述'
                }
              }
            }
        }
    ]
}
```

## 复杂 case

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    debug: true,
    "body": [
        {
            "type": "json-schema",
            "name": "value",
            "label": "字段值",
            "schema": {
              type: 'object',
              additionalProperties: false,
              required: ['id', 'name'],
              properties: {
                id: {
                  type: 'number',
                  title: 'ID'
                },
                name: {
                  type: 'string',
                  title: '名称'
                },
                description: {
                  type: 'string',
                  title: '描述'
                },
                date: {
                  type: 'object',
                  title: '日期',
                  additionalProperties: false,
                  required: ['year', 'month', 'day'],
                  properties: {
                    year: {
                      type: 'number',
                      title: '年'
                    },
                    month: {
                      type: 'number',
                      title: '月'
                    },
                    day: {
                      type: 'number',
                      title: '日'
                    }
                  }
                },
                tag: {
                  type: 'array',
                  title: '个人标签',
                  items: {
                    type: 'string'
                  },
                  minContains: 2,
                  maxContains: 10
                }
              }
            }
        }
    ]
}
```

## 远程获取 schema

```schema: scope="body"
{
    "type": "form",
    debug: true,
    "body": [
        {
            "type": "json-schema",
            "name": "value",
            "label": "字段值",
            "schema": "/api/mock2/json-schema"
        }
    ]
}
```

## 属性表

| 属性名 | 类型                 | 默认值 | 说明             |
| ------ | -------------------- | ------ | ---------------- |
| schema | `object` \| `string` |        | 指定 json-schema |
