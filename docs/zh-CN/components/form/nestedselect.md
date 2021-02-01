---
title: NestedSelect 级联选择器
description:
type: 0
group: null
menuName: NestedSelect 级联选择器
icon:
order: 31
---

## 基本用法

```schema: scope="body"
{
  "type": "form",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "nested-select",
      "name": "nestedSelect",
      "label": "级联选择器",
      "options": [
        {
          "label": "A",
          "value": "a"
        },
        {
          "label": "B",
          "value": "b",
          "children": [
            {
              "label": "B-1",
              "value": "b-1"
            },
            {
              "label": "B-2",
              "value": "b-2"
            },
            {
              "label": "B-3",
              "value": "b-3"
            }
          ]
        },
        {
          "label": "C",
          "value": "c"
        }
      ]
    }
  ]
}
```

## 选中父节点是否自动选中子节点

默认选中父节点会自动选中子节点，可以设置`"cascade": true`，不自动选中子节点

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "nested-select",
      "name": "nestedSelect1",
      "label": "默认自动选中子节点",
      "multiple": true,
      "options": [
        {
          "label": "A",
          "value": "a"
        },
        {
          "label": "B",
          "value": "b",
          "children": [
            {
              "label": "B-1",
              "value": "b-1"
            },
            {
              "label": "B-2",
              "value": "b-2"
            },
            {
              "label": "B-3",
              "value": "b-3"
            }
          ]
        },
        {
          "label": "C",
          "value": "c"
        }
      ]
    },
    {
        "type": "divider"
    },
     {
      "type": "nested-select",
      "name": "nestedSelect2",
      "label": "不自动选中子节点",
      "multiple": true,
      "cascade": true,
      "options": [
        {
          "label": "A",
          "value": "a"
        },
        {
          "label": "B",
          "value": "b",
          "children": [
            {
              "label": "B-1",
              "value": "b-1"
            },
            {
              "label": "B-2",
              "value": "b-2"
            },
            {
              "label": "B-3",
              "value": "b-3"
            }
          ]
        },
        {
          "label": "C",
          "value": "c"
        }
      ]
    }
  ]
}
```

## 选中父节点，值是否包含子节点

默认选中父节点，是不会带上子节点的值，想要自动带上子节点的值，那么配置`"withChildren": true`

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "nested-select",
      "name": "nestedSelect1",
      "label": "默认不自动带上子节点的值",
      "multiple": true,
      "options": [
        {
          "label": "A",
          "value": "a"
        },
        {
          "label": "B",
          "value": "b",
          "children": [
            {
              "label": "B-1",
              "value": "b-1"
            },
            {
              "label": "B-2",
              "value": "b-2"
            },
            {
              "label": "B-3",
              "value": "b-3"
            }
          ]
        },
        {
          "label": "C",
          "value": "c"
        }
      ]
    },
    {
        "type": "divider"
    },
     {
      "type": "nested-select",
      "name": "nestedSelect2",
      "label": "自动带上子节点的值",
      "multiple": true,
      "withChildren": true,
      "options": [
        {
          "label": "A",
          "value": "a"
        },
        {
          "label": "B",
          "value": "b",
          "children": [
            {
              "label": "B-1",
              "value": "b-1"
            },
            {
              "label": "B-2",
              "value": "b-2"
            },
            {
              "label": "B-3",
              "value": "b-3"
            }
          ]
        },
        {
          "label": "C",
          "value": "c"
        }
      ]
    }
  ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名           | 类型                                      | 默认值               | 说明                                                                                        |
| ---------------- | ----------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------- |
| options          | `Array<object>`或`Array<string>`          |                      | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| source           | `string`或 [API](../../../docs/types/api) |                      | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| delimeter        | `boolean`                                 | `false`              | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                   |
| labelField       | `boolean`                                 | `"label"`            | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField       | `boolean`                                 | `"value"`            | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| joinValues       | `boolean`                                 | `true`               | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                  |
| extractValue     | `boolean`                                 | `false`              | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)              |
| autoFill         | `object`                                  |                      | [自动填充](./options#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85-autofill)                         |
| cascade          | `boolean`                                 | `false`              | 设置 `true`时，当选中父节点时不自动选择子节点。                                             |
| withChildren     | `boolean`                                 | `false`              | 设置 `true`时，选中父节点时，值里面将包含子节点的值，否则只会保留父节点的值。               |
| searchable       | `boolean`                                 | `false`              | 可否搜索                                                                                    |
| searchPromptText | `string`                                  | `"输入内容进行检索"` | 搜索框占位文本                                                                              |
| multiple         | `boolean`                                 | `false`              | 可否多选                                                                                    |
