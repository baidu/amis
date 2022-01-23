---
title: InputFormula 公式编辑器
description:
type: 0
group: null
menuName: InputFormula
icon:
order: 21
---

## 基本用法

用来输入公式。还是 beta 版本，整体待优化。

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "body": [
    {
      "type": "input-formula",
      "name": "formula",
      "label": "公式",
      "evalMode": false,
      "value": "SUM(1 + 2)",
      "variables": [
        {
          "label": "表单字段",
          "children": [
            {
              "label": "文章名",
              "value": "name",
              "tag": "文本"
            },
            {
              "label": "作者",
              "value": "author",
              "tag": "文本"
            },
            {
              "label": "售价",
              "value": "price",
              "tag": "数字"
            },
            {
              "label": "出版时间",
              "value": "time",
              "tag": "时间"
            },
            {
              "label": "版本号",
              "value": "version",
              "tag": "数字"
            },
            {
              "label": "出版社",
              "value": "publisher",
              "tag": "文本"
            }
          ]
        },
        {
          "label": "流程字段",
          "children": [
            {
              "label": "联系电话",
              "value": "telphone"
            },
            {
              "label": "地址",
              "value": "addr"
            }
          ]
        }
      ],
    }
  ]
}
```

## 展示模式

设置`"inputMode": "button"`可以切换编辑器的展示模式。

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "body": [
    {
      "type": "input-formula",
      "name": "formula",
      "label": "公式",
      "variableMode": "tree",
      "evalMode": false,
      "value": "SUM(1 + 2)",
      "inputMode": "button",
      "variables": [
        {
          "label": "表单字段",
          "children": [
            {
              "label": "文章名",
              "value": "name",
              "tag": "文本"
            },
            {
              "label": "作者",
              "value": "author",
              "tag": "文本"
            },
            {
              "label": "售价",
              "value": "price",
              "tag": "数字"
            },
            {
              "label": "出版时间",
              "value": "time",
              "tag": "时间"
            },
            {
              "label": "版本号",
              "value": "version",
              "tag": "数字"
            },
            {
              "label": "出版社",
              "value": "publisher",
              "tag": "文本"
            }
          ]
        },
        {
          "label": "流程字段",
          "children": [
            {
              "label": "联系电话",
              "value": "telphone"
            },
            {
              "label": "地址",
              "value": "addr"
            }
          ]
        }
      ],
    }
  ]
}
```

## 变量展示模式

设置不同`variableMode`字段切换变量展示模式，树形结构：

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "body": [
    {
      "type": "input-formula",
      "name": "formula",
      "label": "公式",
      "variableMode": "tree",
      "evalMode": false,
      "variables": [
        {
          "label": "表单字段",
          "children": [
            {
              "label": "文章名",
              "value": "name",
              "tag": "文本"
            },
            {
              "label": "作者",
              "value": "author",
              "tag": "文本"
            },
            {
              "label": "售价",
              "value": "price",
              "tag": "数字"
            },
            {
              "label": "出版时间",
              "value": "time",
              "tag": "时间"
            },
            {
              "label": "版本号",
              "value": "version",
              "tag": "数字"
            },
            {
              "label": "出版社",
              "value": "publisher",
              "tag": "文本"
            }
          ]
        },
        {
          "label": "流程字段",
          "children": [
            {
              "label": "联系电话",
              "value": "telphone"
            },
            {
              "label": "地址",
              "value": "addr"
            }
          ]
        }
      ],
    }
  ]
}
```

Tab 结构：

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "body": [
    {
      "type": "input-formula",
      "name": "formula",
      "label": "公式",
      "variableMode": "tabs",
      "evalMode": false,
      "variables": [
        {
          "label": "表单字段",
          "children": [
            {
              "label": "文章名",
              "value": "name",
              "tag": "文本"
            },
            {
              "label": "作者",
              "value": "author",
              "tag": "文本"
            },
            {
              "label": "售价",
              "value": "price",
              "tag": "数字"
            },
            {
              "label": "出版时间",
              "value": "time",
              "tag": "时间"
            },
            {
              "label": "版本号",
              "value": "version",
              "tag": "数字"
            },
            {
              "label": "出版社",
              "value": "publisher",
              "tag": "文本"
            }
          ]
        },
        {
          "label": "流程字段",
          "children": [
            {
              "label": "联系电话",
              "value": "telphone"
            },
            {
              "label": "地址",
              "value": "addr"
            }
          ]
        }
      ],
    }
  ]
}
```

## 属性表

| 属性名            | 类型                                                                                       | 默认值         | 说明                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------------------ |
| title             | `string`                                                                                   | `'公式编辑器'` | 弹框标题                                                                       |
| header            | `string`                                                                                   | -              | 编辑器 header 标题，如果不设置，默认使用表单项`label`字段                      |
| evalMode          | `boolean`                                                                                  | `true`         | 表达式模式 或者 模板模式，模板模式则需要将表达式写在 `${` 和 `}` 中间。        |
| variables         | `{label: string; value: string; children?: any[]; tag?: string}[]`                         | `[]`           | 可用变量                                                                       |
| variableMode      | `string`                                                                                   | `list`         | 可配置成 `tabs` 或者 `tree` 默认为列表，支持分组。                             |
| functions         | `Object[]`                                                                                 | -              | 可以不设置，默认就是 amis-formula 里面定义的函数，如果扩充了新的函数则需要指定 |
| inputMode         | `'button' \| 'input-button'`                                                               | -              | 控件的展示模式                                                                 |
| icon              | `string`                                                                                   | -              | 按钮图标，例如`fa fa-list`                                                     |
| btnLabel          | `string`                                                                                   | `'公示编辑'`   | 按钮文本，`inputMode`为`button`时生效                                          |
| level             | `'info' \| 'success' \| 'warning' \| 'danger' \| 'link' \| 'primary' \| 'dark' \| 'light'` | `default`      | 按钮样式                                                                       |
| btnSize           | `'xs' \| 'sm' \| 'md' \| 'lg'`                                                             | -              | 按钮大小                                                                       |
| borderMode        | `'full' \| 'half' \| 'none'`                                                               | -              | 输入框边框模式                                                                 |
| placeholder       | `string`                                                                                   | `'暂无数据'`   | 输入框占位符                                                                   |
| className         | `string`                                                                                   | -              | 控件外层 CSS 样式类名                                                          |
| variableClassName | `string`                                                                                   | -              | 变量面板 CSS 样式类名                                                          |
| functionClassName | `string`                                                                                   | -              | 函数面板 CSS 样式类名                                                          |
