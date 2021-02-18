---
title: 组合条件
description:
type: 0
group: null
menuName: 组合条件
icon:
---

## 基本用法

用于设置复杂组合条件，支持添加条件，添加分组，设置组合方式，拖拽排序等功能。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "controls": [
        {
          "type": "condition-builder",
          "label": "条件组件",
          "name": "conditions",
          "description": "适合让用户自己拼查询条件，然后后端根据数据生成 query where",
          "fields": [
            {
              "label": "文本",
              "type": "text",
              "name": "text"
            },
            {
              "label": "数字",
              "type": "number",
              "name": "number"
            },
            {
              "label": "布尔",
              "type": "boolean",
              "name": "boolean"
            },
            {
              "label": "选项",
              "type": "select",
              "name": "select",
              "options": [
                {
                  "label": "A",
                  "value": "a"
                },
                {
                  "label": "B",
                  "value": "b"
                },
                {
                  "label": "C",
                  "value": "c"
                },
                {
                  "label": "D",
                  "value": "d"
                },
                {
                  "label": "E",
                  "value": "e"
                }
              ]
            },
            {
              "label": "动态选项",
              "type": "select",
              "name": "select2",
              "source": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1"
            },
            {
              "label": "日期",
              "children": [
                {
                  "label": "日期",
                  "type": "date",
                  "name": "date"
                },
                {
                  "label": "时间",
                  "type": "time",
                  "name": "time"
                },
                {
                  "label": "日期时间",
                  "type": "datetime",
                  "name": "datetime"
                }
              ]
            }
          ]
        }
    ]
}
```

## 值格式说明

```ts
type ValueGroup = {
  conjunction: 'and' | 'or';
  children: Array<ValueGroup | ValueItem>;
};
type ValueItem = {
  // 左侧字段，这块有预留类型，不过目前基本上只是字段。
  left: {
    type: 'field';
    field: string;
  };

  // 还有更多类型，暂不细说
  op: 'equals' | 'not_equal' | 'less' | 'less_or_equal';

  // 根据字段类型和 op 的不同，值格式会不一样。
  // 如果 op 是范围，right 就是个数组 [开始值，结束值]，否则就是值。
  right: any;
};

type Value = ValueGroup;
```

## 字段选项

字段选项为这个组件主要配置部分，通过 `fields` 字段来配置，有哪些字段，并且字段的类型是什么，支持哪些比较操作符。

`fields` 为数组类型，每个成员表示一个可选字段，支持多个层，配置示例

```json
"fields": [
  {
    "label": "字段1"
    // 字段1
  },
  {
    "label": "字段2"
    // 字段2
  },
  {
    "label": "字段分组",
    "children": [
      {
        "label": "字段3"
      },
      {
        "label": "字段4"
      }
    ]
  }
]
```

## 支持的字段类型

这里面能用的字段类型和表单项中的字段类型不一样，还没支持那么多，基本上只有一些基础的类型，其他复杂类型还需后续扩充，目前基本上支持以下这些类型。

### 文本

- `type` 字段配置中配置成 `"text"`
- `label` 字段名称。
- `placeholder` 占位符
- `operators` 默认为 `[ 'equal', 'not_equal', 'is_empty', 'is_not_empty', 'like', 'not_like', 'starts_with', 'ends_with' ]` 如果不要那么多，可以配置覆盖。
- `defaultOp` 默认为 `"equal"`

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "controls": [
        {
          "type": "condition-builder",
          "label": "条件组件",
          "name": "conditions",
          "description": "适合让用户自己拼查询条件，然后后端根据数据生成 query where",
          "fields": [
            {
              "label": "A",
              "type": "text",
              "name": "a"
            }
          ]
        }
    ]
}
```

### 数字

- `type` 字段配置中配置成 `"number"`
- `label` 字段名称。
- `placeholder` 占位符
- `operators` 默认为 `[ 'equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between', 'is_empty', 'is_not_empty' ]` 如果不要那么多，可以配置覆盖。
- `defaultOp` 默认为 `"equal"`
- `minimum` 最小值
- `maximum` 最大值
- `step` 步长

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "controls": [
        {
          "type": "condition-builder",
          "label": "条件组件",
          "name": "conditions",
          "description": "适合让用户自己拼查询条件，然后后端根据数据生成 query where",
          "fields": [
            {
              "label": "A",
              "type": "number",
              "name": "a",
              "minimum": 1,
              "maximum": 10,
              "step": 1
            }
          ]
        }
    ]
}
```

### 日期

- `type` 字段配置中配置成 `"date"`
- `label` 字段名称。
- `placeholder` 占位符
- `operators` 默认为 `[ 'equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between', 'is_empty', 'is_not_empty' ]` 如果不要那么多，可以配置覆盖。
- `defaultOp` 默认为 `"equal"`
- `defaultValue` 默认值
- `format` 默认 `"YYYY-MM-DD"` 值格式
- `inputFormat` 默认 `"YYYY-MM-DD"` 显示的日期格式。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "controls": [
        {
          "type": "condition-builder",
          "label": "条件组件",
          "name": "conditions",
          "description": "适合让用户自己拼查询条件，然后后端根据数据生成 query where",
          "fields": [
            {
              "label": "A",
              "type": "date",
              "name": "a"
            }
          ]
        }
    ]
}
```

### 日期时间

- `type` 字段配置中配置成 `"datetime"`
- `label` 字段名称。
- `placeholder` 占位符
- `operators` 默认为 `[ 'equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between', 'is_empty', 'is_not_empty' ]` 如果不要那么多，可以配置覆盖。
- `defaultOp` 默认为 `"equal"`
- `defaultValue` 默认值
- `format` 默认 `""` 值格式
- `inputFormat` 默认 `"YYYY-MM-DD HH:mm"` 显示的日期格式。
- `timeFormat` 默认 `"HH:mm"` 时间格式，决定输入框有哪些。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "controls": [
        {
          "type": "condition-builder",
          "label": "条件组件",
          "name": "conditions",
          "description": "适合让用户自己拼查询条件，然后后端根据数据生成 query where",
          "fields": [
            {
              "label": "A",
              "type": "datetime",
              "name": "a"
            }
          ]
        }
    ]
}
```

### 时间

- `type` 字段配置中配置成 `"time"`
- `label` 字段名称。
- `placeholder` 占位符
- `operators` 默认为 `[ 'equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between', 'is_empty', 'is_not_empty' ]` 如果不要那么多，可以配置覆盖。
- `defaultOp` 默认为 `"equal"`
- `defaultValue` 默认值
- `format` 默认 `"HH:mm"` 值格式
- `inputFormat` 默认 `"HH:mm"` 显示的日期格式。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "controls": [
        {
          "type": "condition-builder",
          "label": "条件组件",
          "name": "conditions",
          "description": "适合让用户自己拼查询条件，然后后端根据数据生成 query where",
          "fields": [
            {
              "label": "A",
              "type": "time",
              "name": "a"
            }
          ]
        }
    ]
}
```

### 下拉选择

- `type` 字段配置中配置成 `"select"`
- `label` 字段名称。
- `placeholder` 占位符
- `operators` 默认为 `[ 'select_equals', 'select_not_equals', 'select_any_in', 'select_not_any_in' ]` 如果不要那么多，可以配置覆盖。
- `defaultOp`
- `options` 选项列表，`Array<{label: string, value: any}>`
- `source` 动态选项，请配置 api。
- `searchable` 是否可以搜索

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "controls": [
        {
          "type": "condition-builder",
          "label": "条件组件",
          "name": "conditions",
          "description": "适合让用户自己拼查询条件，然后后端根据数据生成 query where",
          "fields": [
            {
              "label": "A",
              "type": "select",
              "name": "a",
              "source": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1",
              "searchable": true
            }
          ]
        }
    ]
}
```
