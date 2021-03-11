---
title: Tree 树形选择框
description:
type: 0
group: null
menuName: Tree 树形选择框
icon:
order: 59
---

## 基本使用

配置的`options`中，可以通过`children`字段进行嵌套展示，实现树形选择器

```schema: scope="body"
{
  "type": "form",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "tree",
      "name": "tree",
      "label": "Tree",
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        }
      ]
    }
  ]
}
```

## 选择器样式

配置`"type": "tree-select"`可以实现选择器样式

```schema: scope="body"
{
  "type": "form",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
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
      "type": "tree",
      "name": "tree1",
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
      "type": "tree",
      "name": "tree2",
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
      "type": "tree",
      "name": "tree1",
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
      "type": "tree",
      "name": "tree2",
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

也可以设置`onlyChildren`，实现只包含子节点的值

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "tree",
      "name": "tree1",
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
      "type": "tree",
      "name": "tree2",
      "label": "只包含子节点的值",
      "multiple": true,
      "onlyChildren": true,
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

## 默认展开

默认是展开所有子节点的，如果不想默认展开，则配置`"initiallyOpen": false`

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "tree",
      "name": "tree1",
      "label": "默认不自动带上子节点的值",
      "initiallyOpen": false,
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

如果层级较多，也可以配置`unfoldedLevel`指定展开的层级数。

下例中设置`"unfoldedLevel": 1`，默认展开第 1 层

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "tree",
      "name": "tree1",
      "label": "默认不自动带上子节点的值",
      "initiallyOpen": false,
      "unfoldedLevel": 1,
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
              "value": "b-2",
              "children": [
                {
                    "label": "B-2-1",
                    "value": "b-2-1"
                },
                {
                    "label": "B-2-2",
                    "value": "b-2-2"
                },
                {
                    "label": "B-2-3",
                    "value": "b-2-3"
                }
            ]
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

## 可编辑

配置 `creatable`、`removable` 和 `editable` 可以实现树可编辑。

```schema: scope="body"
{
  "type": "form",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "tree",
      "name": "tree",
      "label": "Tree",
      "creatable": true,
      "removable": true,
      "editable": true,
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        }
      ]
    }
  ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名        | 类型                                         | 默认值           | 说明                                                                                                                |
| ------------- | -------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| options       | `Array<object>`或`Array<string>`             |                  | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                                           |
| source        | `string`或 [API](../../../../docs/types/api) |                  | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                                        |
| autoComplete  | [API](../../../../docs/types/api)            |                  | [自动提示补全](./options#%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8-autocomplete)                                         |
| multiple      | `boolean`                                    | `false`          | 是否多选                                                                                                            |
| delimeter     | `string`                                     | `false`          | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                                           |
| labelField    | `string`                                     | `"label"`        | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield)                         |
| valueField    | `string`                                     | `"value"`        | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)                                    |
| joinValues    | `boolean`                                    | `true`           | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                                          |
| extractValue  | `boolean`                                    | `false`          | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)                                      |
| creatable     | `boolean`                                    | `false`          | [新增选项](./options#%E5%89%8D%E7%AB%AF%E6%96%B0%E5%A2%9E-creatable)                                                |
| addControls   | Array<[表单项](./formitem)>                  |                  | [自定义新增表单项](./options#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%B0%E5%A2%9E%E8%A1%A8%E5%8D%95%E9%A1%B9-addcontrols)  |
| addApi        | [API](../../../docs/types/api)               |                  | [配置新增选项接口](./options#%E9%85%8D%E7%BD%AE%E6%96%B0%E5%A2%9E%E6%8E%A5%E5%8F%A3-addapi)                         |
| editable      | `boolean`                                    | `false`          | [编辑选项](./options#%E5%89%8D%E7%AB%AF%E7%BC%96%E8%BE%91-editable)                                                 |
| editControls  | Array<[表单项](./formitem)>                  |                  | [自定义编辑表单项](./options#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BC%96%E8%BE%91%E8%A1%A8%E5%8D%95%E9%A1%B9-editcontrols) |
| editApi       | [API](../../../docs/types/api)               |                  | [配置编辑选项接口](./options#%E9%85%8D%E7%BD%AE%E7%BC%96%E8%BE%91%E6%8E%A5%E5%8F%A3-editapi)                        |
| removable     | `boolean`                                    | `false`          | [删除选项](./options#%E5%88%A0%E9%99%A4%E9%80%89%E9%A1%B9)                                                          |
| deleteApi     | [API](../../../docs/types/api)               |                  | [配置删除选项接口](./options#%E9%85%8D%E7%BD%AE%E5%88%A0%E9%99%A4%E6%8E%A5%E5%8F%A3-deleteapi)                      |
| searchable    | `boolean`                                    | `false`          | 是否可检索，仅在 type 为 `tree-select` 的时候生效                                                                   |
| hideRoot      | `boolean`                                    | `true`           | 如果想要显示个顶级节点，请设置为 `false`                                                                            |
| rootLabel     | `boolean`                                    | `"顶级"`         | 当 `hideRoot` 不为 `false` 时有用，用来设置顶级节点的文字。                                                         |
| showIcon      | `boolean`                                    | `true`           | 是否显示图标                                                                                                        |
| showRadio     | `boolean`                                    | `false`          | 是否显示单选按钮，`multiple` 为 `false` 是有效。                                                                    |
| initiallyOpen | `boolean`                                    | `true`           | 设置是否默认展开所有层级。                                                                                          |
| unfoldedLevel | `number`                                     | `0`              | 设置默认展开的级数，只有`initiallyOpen`不是`true`时生效。                                                           |
| cascade       | `boolean`                                    | `false`          | 当选中父节点时不自动选择子节点。                                                                                    |
| withChildren  | `boolean`                                    | `false`          | 选中父节点时，值里面将包含子节点的值，否则只会保留父节点的值。                                                      |
| onlyChildren  | `boolean`                                    | `false`          | 多选时，选中父节点时，是否只将其子节点加入到值中。                                                                  |
| rootCreatable | `boolean`                                    | `false`          | 是否可以创建顶级节点                                                                                                |
| rootCreateTip | `string`                                     | `"添加一级节点"` | 创建顶级节点的悬浮提示                                                                                              |
| minLength     | `number`                                     |                  | 最少选中的节点数                                                                                                    |
| maxLength     | `number`                                     |                  | 最多选中的节点数                                                                                                    |
