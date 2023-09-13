---
title: InputTree 树形选择框
description:
type: 0
group: null
menuName: InpputTree 树形选择框
icon:
order: 59
---

## 基本使用

配置的`options`中，可以通过`children`字段进行嵌套展示，实现树形选择器

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
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
              "label": "Folder B",
              "value": 3,
              "children": [
                {
                  "label": "file b1",
                  "value": 3.1
                },
                {
                  "label": "file b2",
                  "value": 3.2
                }
              ]
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
  "api": "/api/mock2/form/saveForm",
  "body": [
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

## 是否显示展开线

> 1.1.6 版本

通过 `showOutline` 来控制是否显示展开线。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
      "name": "tree",
      "label": "Tree",
      "showOutline": true,
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
              "label": "Folder B",
              "value": 3,
              "children": [
                {
                  "label": "file b1",
                  "value": 3.1
                },
                {
                  "label": "file b2",
                  "value": 3.2
                }
              ]
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

> since 1.9.0

`autoCheckChildren`默认为 true，选中父节点会自动选中子节点，可以设置`"autoCheckChildren": false`，不自动选中子节点

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
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
      "type": "input-tree",
      "name": "tree2",
      "label": "不自动选中子节点",
      "multiple": true,
      "autoCheckChildren": false,
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

## 选中父节点自动选中子节点，数据是否包含父子节点的值

`cascade`默认为 false，子节点禁止反选，值不包含子节点值，配置`"cascade": true`，子节点可以反选，值包含父子节点值（1.9.0 之前的版本 cascade 配置为 true 的效果为：选中父节点不默认选中子节点）

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
      "name": "tree1",
      "label": "默认子节点禁止反选，值不包含子节点值",
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
      "type": "input-tree",
      "name": "tree2",
      "label": "子节点可以反选，值包含父子节点值",
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

`withChildren`默认为 false，子节点禁止反选，值包含父子节点值，配置`withChildren": true`，子节点禁止反选，值包含父子节点值

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
      "name": "tree1",
      "label": "默认不包含子节点的值",
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
      "type": "input-tree",
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
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
      "name": "tree1",
      "label": "默认不包含子节点的值",
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
      "type": "input-tree",
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

## 只允许选择叶子节点

> 1.10.0 及以上版本

在单选时，可通过 `onlyLeaf` 可以配置只允许选择叶子节点

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
      "name": "tree",
      "label": "Tree",
      "onlyLeaf": true,
      "searchable": true,
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
        },
        {
          "label": "Folder E",
          "value": "61",
          "children": [
            {
              "label": "Folder G",
              "value": "62",
              "children": [
                {
                  "label": "file H",
                  "value": 6
                },
                {
                  "label": "file I",
                  "value": 7
                }
              ]
            }
          ]
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
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
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

如果层级较多，也可以配置`unfoldedLevel`指定展开的层级数，默认展开第 1 层

下例中设置`"unfoldedLevel": 2`，表示展开第 2 层

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
      "name": "tree1",
      "label": "默认不自动带上子节点的值",
      "initiallyOpen": false,
      "unfoldedLevel": 2,
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
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
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

## 控制哪些项可编辑

配置 `creatable`、`removable` 和 `editable` 可以实现树可编辑，同时如果需要关闭部分节点的编辑权限，可以在节点上配置`creatable`、`removable` 和 `editable`。

`rootCreatable` 可以用来关闭顶层是否可以创建。如果想要控制顶层可编辑，请配置 `hideRoot`，用节点来控制。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
      "name": "tree",
      "label": "Tree",
      "creatable": true,
      "removable": true,
      "editable": true,
      "rootCreatable": false,
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "creatable": false,
          "removable": false,
          "editable": false,
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
          "value": 4,
          "removable": false
        },
        {
          "label": "file D",
          "value": 5,
          "editable": false
        }
      ]
    }
  ]
}
```

## 控制添加/编辑的表单

配置 `addControls` 可以控制添加时需要填写哪些信息，同样还有 `editControls` 来配置编辑节点的表单

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
      "name": "tree",
      "label": "Tree",
      "creatable": true,
      "addControls": [
        {
          "label": "节点名称",
          "type": "input-text",
          "required": true,
          "name": "label"
        },
        {
          "label": "节点值",
          "type": "input-text",
          "required": true,
          "name": "value"
        }
      ],
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

## 懒加载

> since 1.1.6

需要懒加载的选项请配置 `defer` 为 true，然后配置 `deferApi` 即可完成懒加载。如果不配置 `deferApi` 会使用 `source` 接口。
`deferApi` 中可以用到当前选项中的任何字段，比如以下这个例子是把 label 传给了 defer 接口

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
      "name": "tree",
      "label": "Tree",
      "deferApi": "/api/mock2/form/deferOptions?label=${label}&waitSeconds=2",
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "collapsed": true,
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
          "label": "这下面是懒加载的",
          "value": 4,
          "defer": true
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

## 节点路径模式

> since 1.2.4

配置`enableNodePath: true`后, 可以将`value`格式转换成节点路径模式，`pathSeparator`设置路径分隔符，建议将该属性的值和拼接符`delimiter`区分开。节点路径模式下，`value`中所有节点的父节点都会自动加载数据并回显。不同配置属性的节点路径模式`value`如下:

```
    a
   / \
  b   d
 /
c
----------------------------------------------
multiple  joinValues  extractValue  value
----------------------------------------------
false       true           -        'a/b/c'
false       false        false      {label: 'A/B/C', value: 'a/b/c'}
true        true           -        'a/b/c,a/d'
true        false        true       ['a/b/c', 'a/d']
true        false        false      [{label: 'A/B/C', value: 'a/b/c'},{label: 'A/D', value: 'a/d'}]
```

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
      "name": "tree",
      "label": "Tree",
      "deferApi": "/api/mock2/form/deferOptions?label=${label}&waitSeconds=2",
      "value": "1/2,4/lazy-1/lazy-1-3,4/lazy-1/lazy-1-5",
      "enableNodePath": true,
      "pathSeparator": '/',
      "multiple": true,
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "collapsed": true,
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
          "label": "这下面是懒加载的",
          "value": 4,
          "defer": true
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

## 自定义选项渲染

> `2.8.0` 及以上版本

使用`menuTpl`属性，自定义下拉选项的渲染内容。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
      "name": "tree",
      "label": "Tree",
      "menuTpl": "<div class='flex justify-between'><span>${label}</span><span class='bg-gray-200 rounded p-1 text-xs text-center w-14'>${tag}</span></div>",
      "iconField": "icon",
      "options": [
        {
          "label": "采购单",
          "value": "order",
          "tag": "数据模型",
          "icon": "fa fa-database",
          "children": [
            {
              "label": "ID",
              "value": "id",
              "tag": "数字",
              "icon": "fa fa-check",
            },
            {
              "label": "采购人",
              "value": "name",
              "tag": "字符串",
              "icon": "fa fa-check",
            },
            {
              "label": "采购时间",
              "value": "time",
              "tag": "日期时间",
              "icon": "fa fa-check",
            }
          ]
        }
      ]
    }
  ]
}
```

## 选项搜索

> `2.8.0` 及以上版本

开启`"searchable": true`后，支持搜索当前数据源内的选项

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-tree",
      "name": "tree",
      "label": "Tree",
      "deferApi": "/api/mock2/form/deferOptions?label=${label}&waitSeconds=2",
      "searchable": true,
      "searchConfig": {
        "sticky": true
      },
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "collapsed": true,
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
          "label": "这下面是懒加载的",
          "value": 4,
          "defer": true
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

| 属性名                 | 类型                                         | 默认值           | 说明                                                                                                                                 | 版本                         |
| ---------------------- | -------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| options                | `Array<object>`或`Array<string>`             |                  | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                                                            |
| source                 | `string`或 [API](../../../../docs/types/api) |                  | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                                                         |
| autoComplete           | [API](../../../../docs/types/api)            |                  | [自动提示补全](./options#%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8-autocomplete)                                                          |
| multiple               | `boolean`                                    | `false`          | 是否多选                                                                                                                             |
| delimiter              | `string`                                     | `false`          | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                                                            |
| labelField             | `string`                                     | `"label"`        | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield)                                          |
| valueField             | `string`                                     | `"value"`        | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)                                                     |
| iconField              | `string`                                     | `"icon"`         | 图标值字段                                                                                                                           |
| joinValues             | `boolean`                                    | `true`           | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                                                           |
| extractValue           | `boolean`                                    | `false`          | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)                                                       |
| creatable              | `boolean`                                    | `false`          | [新增选项](./options#%E5%89%8D%E7%AB%AF%E6%96%B0%E5%A2%9E-creatable)                                                                 |
| addControls            | Array<[表单项](./formitem)>                  |                  | [自定义新增表单项](./options#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%B0%E5%A2%9E%E8%A1%A8%E5%8D%95%E9%A1%B9-addcontrols)                   |
| addApi                 | [API](../../../docs/types/api)               |                  | [配置新增选项接口](./options#%E9%85%8D%E7%BD%AE%E6%96%B0%E5%A2%9E%E6%8E%A5%E5%8F%A3-addapi)                                          |
| editable               | `boolean`                                    | `false`          | [编辑选项](./options#%E5%89%8D%E7%AB%AF%E7%BC%96%E8%BE%91-editable)                                                                  |
| editControls           | Array<[表单项](./formitem)>                  |                  | [自定义编辑表单项](./options#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BC%96%E8%BE%91%E8%A1%A8%E5%8D%95%E9%A1%B9-editcontrols)                  |
| editApi                | [API](../../../docs/types/api)               |                  | [配置编辑选项接口](./options#%E9%85%8D%E7%BD%AE%E7%BC%96%E8%BE%91%E6%8E%A5%E5%8F%A3-editapi)                                         |
| removable              | `boolean`                                    | `false`          | [删除选项](./options#%E5%88%A0%E9%99%A4%E9%80%89%E9%A1%B9)                                                                           |
| deleteApi              | [API](../../../docs/types/api)               |                  | [配置删除选项接口](./options#%E9%85%8D%E7%BD%AE%E5%88%A0%E9%99%A4%E6%8E%A5%E5%8F%A3-deleteapi)                                       |
| searchable             | `boolean`                                    | `false`          | 是否可检索                                                                                                                           | `2.8.0`前仅`tree-select`支持 |
| hideRoot               | `boolean`                                    | `true`           | 如果想要显示个顶级节点，请设置为 `false`                                                                                             |
| rootLabel              | `boolean`                                    | `"顶级"`         | 当 `hideRoot` 不为 `false` 时有用，用来设置顶级节点的文字。                                                                          |
| showIcon               | `boolean`                                    | `true`           | 是否显示图标                                                                                                                         |
| showRadio              | `boolean`                                    | `false`          | 是否显示单选按钮，`multiple` 为 `false` 是有效。                                                                                     |
| showOutline            | `boolean`                                    | `false`          | 是否显示树层级展开线                                                                                                                 |
| initiallyOpen          | `boolean`                                    | `true`           | 设置是否默认展开所有层级。                                                                                                           |
| unfoldedLevel          | `number`                                     | `1`              | 设置默认展开的级数，只有`initiallyOpen`不是`true`时生效。                                                                            |
| autoCheckChildren      | `boolean`                                    | `true`           | 当选中父节点时级联选择子节点。                                                                                                       |
| cascade                | `boolean`                                    | `false`          | autoCheckChildren 为 true 时生效；默认行为：子节点禁用，值只包含父节点值；设置为 true 时，子节点可反选，值包含父子节点值。           |
| withChildren           | `boolean`                                    | `false`          | cascade 为 false 时生效，选中父节点时，值里面将包含父子节点的值，否则只会保留父节点的值。                                            |
| onlyChildren           | `boolean`                                    | `false`          | autoCheckChildren 为 true 时生效，不受 cascade 影响；onlyChildren 为 true，ui 行为级联选中子节点，子节点可反选，值只包含子节点的值。 |
| onlyLeaf               | `boolean`                                    | `false`          | 只允许选择叶子节点                                                                                                                   |
| rootCreatable          | `boolean`                                    | `false`          | 是否可以创建顶级节点                                                                                                                 |
| rootCreateTip          | `string`                                     | `"添加一级节点"` | 创建顶级节点的悬浮提示                                                                                                               |
| minLength              | `number`                                     |                  | 最少选中的节点数                                                                                                                     |
| maxLength              | `number`                                     |                  | 最多选中的节点数                                                                                                                     |
| treeContainerClassName | `string`                                     |                  | tree 最外层容器类名                                                                                                                  |
| enableNodePath         | `boolean`                                    | `false`          | 是否开启节点路径模式                                                                                                                 |
| pathSeparator          | `string`                                     | `/`              | 节点路径的分隔符，`enableNodePath`为`true`时生效                                                                                     |
| highlightTxt           | `string`                                     |                  | 标签中需要高亮的字符，支持变量                                                                                                       |
| itemHeight             | `number`                                     | `32`             | 每个选项的高度，用于虚拟渲染                                                                                                         |
| virtualThreshold       | `number`                                     | `100`            | 在选项数量超过多少时开启虚拟渲染                                                                                                     |
| menuTpl                | `string`                                     |                  | 选项自定义渲染 HTML 片段                                                                                                             | `2.8.0`                      |
| enableDefaultIcon      | `boolean`                                    | `true`           | 是否为选项添加默认的前缀 Icon，父节点默认为`folder`，叶节点默认为`file`                                                              | `2.8.0`                      |
| heightAuto             | `boolean`                                    | `false`          | 默认高度会有个 maxHeight，即超过一定高度就会内部滚动，如果希望自动增长请设置此属性                                                   | `3.0.0`                      |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称     | 事件参数                                                                                        | 说明                         |
| ------------ | ----------------------------------------------------------------------------------------------- | ---------------------------- |
| change       | `[name]: string` 组件的值                                                                       | 选中值变化时触发             |
| add          | `items: object[]`选项集合（< 2.3.2 及以下版本 为`options`）<br/>`[name]: object` 新增的节点信息 | 新增节点提交时触发           |
| edit         | `items: object[]`选项集合（< 2.3.2 及以下版本 为`options`）<br/>`[name]: object` 编辑的节点信息 | 编辑节点提交时触发           |
| delete       | `items: object[]`选项集合（< 2.3.2 及以下版本 为`options`）<br/>`[name]: object` 删除的节点信息 | 删除节点提交时触发           |
| loadFinished | `[name]: object` deferApi 懒加载远程请求成功后返回的数据                                        | 懒加载接口远程请求成功时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                               | 说明                                                                                    |
| -------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| expand   | openLevel: `number`                    | 展开指定层级                                                                            |
| collapse | -                                      | 收起                                                                                    |
| clear    | -                                      | 清空                                                                                    |
| reset    | -                                      | 将值重置为`resetValue`，若没有配置`resetValue`，则清空                                  |
| setValue | `value: string` \| `string[]` 更新的值 | 更新数据，开启`multiple`支持设置多项，开启`joinValues`时，多值用`,`分隔，否则多值用数组 |
