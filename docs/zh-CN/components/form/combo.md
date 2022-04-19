---
title: Combo 组合
description:
type: 0
group: null
menuName: Combo
icon:
order: 12
---

用于将多个表单项组合到一起，实现深层结构的数据编辑。

比如想提交 `user.name` 这样的数据结构，有两种方法：一种是将表单项的 name 设置为`user.name`，另一种就是使用 combo。

## 基本使用

配置`items`属性，组合多个表单项

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "combo",
      "name": "user",
      "label": "用户",
      "items": [
        {
          "name": "text",
          "label": "名字",
          "type": "input-text"
        },
        {
          "name": "gender",
          "label": "性别",
          "type": "select",
          "options": ["男", "女"]
        }
      ]
    }
  ]
}
```

## 多行展示模式

默认，combo 内表单项是横着展示一排，如果想换行展示，可以配置`"multiLine": true`

```schema: scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "combo",
      "name": "combo1",
      "label": "Combo 单行展示",
      "items": [
        {
          "name": "text",
          "label": "文本",
          "type": "input-text"
        },
        {
          "name": "select",
          "label": "选项",
          "type": "select",
          "options": ["a", "b", "c"]
        }
      ]
    },
    {
        "type": "divider"
    },
    {
      "type": "combo",
      "name": "combo2",
      "label": "Combo 多行展示",
      "multiLine": true,
      "items": [
        {
          "name": "text",
          "label": "文本",
          "type": "input-text"
        },
        {
          "name": "select",
          "label": "选项",
          "type": "select",
          "options": ["a", "b", "c"]
        }
      ]
    }
  ]
}
```

## 多选模式

默认，combo 为单选模式，可以配置`"multiple": true`实现多选模式。

这时提交的将会是对象数组。

```schema: scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "combo",
      "name": "combo1",
      "label": "Combo 单选展示",
      "items": [
        {
          "name": "text",
          "label": "文本",
          "type": "input-text"
        },
        {
          "name": "select",
          "label": "选项",
          "type": "select",
          "options": ["a", "b", "c"]
        }
      ]
    },
    {
        "type": "divider"
    },
    {
      "type": "combo",
      "name": "combo2",
      "label": "Combo 多选展示",
      "multiple": true,
      "items": [
        {
          "name": "text",
          "label": "文本",
          "type": "input-text"
        },
        {
          "name": "select",
          "label": "选项",
          "type": "select",
          "options": ["a", "b", "c"]
        }
      ]
    }
  ]
}
```

## 限制个数

多选模式下，可以配置`minLength`和`maxLength`配置该 Combo 可添加的条数

```schema: scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "combo",
      "name": "combo1",
      "label": "最少添加1条",
      "multiple": true,
      "minLength": 1,
      "items": [
        {
          "name": "text",
          "label": "文本",
          "type": "input-text"
        },
        {
          "name": "select",
          "label": "选项",
          "type": "select",
          "options": ["a", "b", "c"]
        }
      ]
    },
    {
      "type": "combo",
      "name": "combo2",
      "label": "最多添加3条",
      "multiple": true,
      "maxLength": 3,
      "items": [
        {
          "name": "text",
          "label": "文本",
          "type": "input-text"
        },
        {
          "name": "select",
          "label": "选项",
          "type": "select",
          "options": ["a", "b", "c"]
        }
      ]
    }
  ]
}
```

## 值格式

观察下例中表单数据域值的变化，可以发现：

- 单选模式时，**数据格式为对象**；
- 多选模式时，**数据格式为数组，数组成员是对象**

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "combo",
      "name": "combo1",
      "label": "Combo 单选展示",
      "items": [
        {
          "name": "text",
          "label": "文本",
          "type": "input-text"
        },
        {
          "name": "select",
          "label": "选项",
          "type": "select",
          "options": ["a", "b", "c"]
        }
      ]
    },
    {
        "type": "divider"
    },
    {
      "type": "combo",
      "name": "combo2",
      "label": "Combo 多选展示",
      "multiple": true,
      "items": [
        {
          "name": "text",
          "label": "文本",
          "type": "input-text"
        },
        {
          "name": "select",
          "label": "选项",
          "type": "select",
          "options": ["a", "b", "c"]
        }
      ]
    }
  ]
}
```

### 打平值

默认多选模式下，数据格式是对象数组的形式，当你配置的组合中只有一个表单项时，可以配置`"flat": true`，将值进行打平处理。

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "type": "combo",
        "name": "combo1",
        "label": "默认模式",
        "multiple": true,
        "items": [
            {
                "name": "text",
                "type": "input-text"
            }
        ]
    },
    {
        "type": "divider"
    },
    {
        "type": "combo",
        "name": "combo2",
        "label": "打平模式",
        "multiple": true,
        "flat": true,
        "items": [
            {
                "name": "text",
                "type": "input-text"
            }
        ]
    }
  ]
}
```

查看上例表单数据域，可以看到打平后数据格式如下：

```json
{
  "combo2": ["aaa", "bbb"]
}
```

## 增加层级

combo 还有一个作用是增加层级，比如返回的数据是一个深层对象

```json
{
  "a": {
    "b": "data"
  }
}
```

如果要用文本框显示，name 必须是 `a.b`，但使用 combo 创建层级后，name 就可以只是 `b`：

```json
{
  "name": "a",
  "type": "combo",
  "label": "",
  "noBorder": true,
  "multiLine": true,
  "items": [
    {
      "type": "input-text",
      "name": "b"
    }
  ]
}
```

这样就能结合 [definitions](../../../docs/types/definitions#树形结构) 实现无限层级结构。

## 唯一验证

可以在配置的`body`项上，配置`"unique": true`，指定当前表单项不可重复

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "type": "combo",
        "name": "combo666",
        "label": "唯一",
        "multiple": true,
        "items": [
            {
                "name": "text",
                "type": "input-text",
                "placeholder": "文本",
                "unique": true
            },
            {
                "name": "select",
                "type": "select",
                "options": [
                    "a",
                    "b",
                    "c"
                ],
                "unique": true
            }
        ]
    }
  ]
}
```

上例中，`text`和`select`都配置了`"unique": true`，新增多条 combo，在任意两个`text`输入框的值相同时，提交时都会报错`"当前值不唯一"`，而`select`选择框也不可选择重复的选项

> 暂不支持 `Nested-Select` 组件

## 拖拽排序

多选模式下，可以配置`"draggable": true`实现拖拽调整排序

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "type": "combo",
        "name": "combo",
        "label": "拖拽排序",
        "multiple": true,
        "value": [
            {
                "text": "1",
                "select": "a"
            },
            {
                "text": "2",
                "select": "b"
            }
        ],
        "draggable": true,
        "items": [
            {
                "name": "text",
                "type": "input-text"
            },
            {
                "name": "select",
                "type": "select",
                "options": [
                    "a",
                    "b",
                    "c"
                ]
            }
        ]
    }
  ]
}
```

## 条件分支

默认 Combo 渲染的成员是固定表单项的，成员的类型时一致，如果不一致怎么办？这里可以设置条件分支来给不同的成员设置不同的表单项。

如下面的例子，定义了两种类型：文本和数字，用户新增的时候可以选择是新增文本还是数字。区分是文字和数字的方式是根据成员数据中的 type 字段来决定。

```schema: scope="form-item2"
{
  "type": "combo",
  "name": "combo-conditions2",
  "label": "多选",
  "value": [
    {
      "type": "text"
    }
  ],
  "multiLine": true,
  "multiple": true,
  "typeSwitchable": false,
  "conditions": [
    {
      "label": "文本",
      "test": "this.type === \"text\"",
      "scaffold": {
        "type": "text",
        "label": "文本",
        "name": ""
      },
      "items": [
        {
          "label": "名称",
          "name": "label",
          "type": "input-text"
        },
        {
          "label": "字段名",
          "name": "name",
          "type": "input-text"
        }
      ]
    },
    {
      "label": "数字",
      "test": "this.type === \"number\"",
      "scaffold": {
        "type": "number",
        "label": "数字",
        "name": ""
      },
      "items": [
        {
          "label": "名称",
          "name": "label",
          "type": "input-text"
        },
        {
          "label": "字段名",
          "name": "name",
          "type": "input-text"
        },
        {
          "label": "最小值",
          "name": "min",
          "type": "input-number"
        },
        {
          "label": "最大值",
          "name": "max",
          "type": "input-number"
        },
        {
          "label": "步长",
          "name": "step",
          "type": "input-number"
        }
      ]
    }
  ]
}
```

- `conditions` Array<Condition> 数组，每个成员是一种类型
- `conditions[x].label` 类型名称
- `conditions[x].test` 表达式，目标成员数据是否属于这个类型？
- `conditions[x].scaffold` 初始数据，当新增的时候直接使用此数据。
- `conditions[x].items` 该类型的表单设置。
- `typeSwitchable` 类型是否允许切换，如果设置成 true 会多一个类型切换的按钮。

## Tabs 模式

默认成员是一个一个排列的，如果数据比较多有点让人眼花缭乱。所以 Combo 支持了 tabs 的排列方式。

```schema: scope="form-item2"
{
  "type": "combo",
  "name": "combo101",
  "label": "组合多条多行",
  "multiple": true,
  "multiLine": true,
  "value": [
    {}
  ],
  "tabsMode": true,
  "tabsStyle": "card",
  "maxLength": 3,
  "items": [
    {
      "name": "a",
      "label": "文本",
      "type": "input-text",
      "placeholder": "文本",
      "value": "",
      "size": "full"
    },
    {
      "name": "b",
      "label": "选项",
      "type": "select",
      "options": [
        "a",
        "b",
        "c"
      ],
      "size": "full"
    }
  ]
}
```

- `tabsMode` boolean 用来开启此模式
- `tabsStyle` string 样式，可选：`line`、`card` 或者 `radio`.
- `tabsLabelTpl` 用来生成标题的模板，默认为：`成员 ${index|plus}`

注意：这是新引入的功能，目前还不支持拖拽组合使用。且此模式只有多选时才能生效。

## 获取父级数据

默认情况下，Combo 内表达项无法获取父级数据域的数据，如下，我们添加 Combo 表单项时，尽管 Combo 内的文本框的`name`与父级数据域中的`super_text`变量同名，但是没有自动映射值。

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "type": "input-text",
        "label": "父级文本框",
        "name": "super_text",
        "value": "123"
    },
    {
        "type": "combo",
        "name": "combo1",
        "label": "不可获取父级数据",
        "multiple": true,
        "items": [
            {
                "name": "super_text",
                "type": "input-text"
            }
        ]
    }
  ]
}
```

可以配置`"canAccessSuperData": true`开启此特性，如下，配置了该配置项后，添加 Combo 的`text`表单项会自动映射父级数据域的同名变量

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "type": "input-text",
        "label": "父级文本框",
        "name": "super_text",
        "value": "123"
    },
    {
        "type": "combo",
        "name": "combo2",
        "label": "可获取父级数据",
        "multiple": true,
        "canAccessSuperData": true,
        "items": [
            {
                "name": "super_text",
                "type": "input-text"
            }
        ]
    }
  ]
}
```

## 同步更新内部表单项

配置`canAccessSuperData`可以获取父级数据域值，但是为了效率，在父级数据域变化的时候，默认 combo 内部是不会进行同步的

如下，添加一组 combo，然后可以看到默认会映射父级变量值`123`，但是当你在更改父级数据域`super_text`文本框值后，combo 内部文本框并没有同步更新

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "type": "input-text",
        "label": "父级文本框",
        "name": "super_text",
        "value": "123"
    },
    {
        "type": "combo",
        "name": "combo2",
        "label": "可获取父级数据",
        "multiple": true,
        "canAccessSuperData": true,
        "items": [
            {
                "name": "super_text",
                "type": "input-text"
            }
        ]
    }
  ]
}
```

如果想实现内部同步更新，需要如下配置：

- 配置`"strictMode": false`
- 配置`syncFields`字符串数组，数组项是需要同步的变量名

以上面为例，我们在 combo 上配置`"strictMode": false`和`"syncFields": ["super_text"]`，即可实现同步

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "type": "input-text",
        "label": "父级文本框",
        "name": "super_text",
        "value": "123"
    },
    {
        "type": "combo",
        "name": "combo2",
        "label": "可获取父级数据",
        "multiple": true,
        "canAccessSuperData": true,
        "strictMode": false,
        "syncFields": ["super_text"],
        "items": [
            {
                "name": "super_text",
                "type": "input-text"
            }
        ]
    }
  ]
}
```

## 设置序号

默认 Combo 数据域中，每一项会有一个隐藏变量`index`，可以利用 Tpl 组件，显示当前项序号

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "type": "combo",
        "name": "combo",
        "label": "显示序号",
        "multiple": true,
        "items": [
            {
                "type": "tpl",
                "tpl": "<%= this.index + 1%>",
                "className": "p-t-xs",
                "mode": "inline"
            },
            {
                "name": "text",
                "type": "input-text"
            }
        ]
    }
  ]
}
```

## 自定义删除按钮

默认删除单项按钮为"x"，可以通过配置 deleteBtn 属性自定义删除单项按钮，目前 deleteBtn 支持的属性有
`string`和[Button](../button.md)类型

如下，当 deleteBtn 为`string`时，对应的值会被渲染成文本

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "type": "combo",
        "name": "combo",
        "label": "删除按钮文本",
        "multiple": true,
        "deleteBtn": "删除",
        "items": [
            {
                "name": "text",
                "type": "input-text"
            }
        ],
        "value": [
          {
            "text": "1"
          }
        ]
    }
  ]
}
```

如果想要赋予删除按钮更多能力，则需要将 deleteBtn 配置成[Button](../button.md)类型

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "type": "combo",
        "name": "combo",
        "label": "更复杂的删除按钮",
        "multiple": true,
        "deleteBtn": {
          "type": "button",
          "label": "delete",
          "level": "danger",
          "tooltip": "提示文本",
          "tooltipPlacement": "top",
          "onClick": "alert(index)"
        },
        "items": [
            {
                "name": "text",
                "type": "input-text"
            }
        ],
        "value": [
          {
            "text": "1"
          }
        ]
    }
  ]
}
```

## 自定义新增按钮

可以通过配置 `addBtn` 属性自定义新增按钮，在非 Tabs 模式下生效。目前 `addBtn` 支持属性 [Button](../button.md)类型

如果仅想更改新增按钮文本请使用 `addButtonText`, 仅想增添样式请使用 `addButtonClassName`

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
        "type": "combo",
        "name": "combo",
        "label": "自定义新增",
        "multiple": true,
        "addBtn": {
          "type": "button",
          "label": "增加",
          "level": "default",
          "block": true
        },
        "items": [
            {
                "name": "text",
                "type": "input-text"
            }
        ],
        "value": [
          {
            "text": ""
          }
        ]
    }
  ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名                   | 类型                               | 默认值                                         | 说明                                                                                                                                                                |
| ------------------------ | ---------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| formClassName            | `string`                           |                                                | 单组表单项的类名                                                                                                                                                    |
| items                    | Array<[表单项](./formitem)>        |                                                | 组合展示的表单项                                                                                                                                                    |
| items[x].columnClassName | `string`                           |                                                | 列的类名，可以用它配置列宽度。默认平均分配。                                                                                                                        |
| items[x].unique          | `boolean`                          |                                                | 设置当前列值是否唯一，即不允许重复选择。                                                                                                                            |
| noBorder                 | `boolean`                          | `false`                                        | 单组表单项是否显示边框                                                                                                                                              |
| scaffold                 | `object`                           | `{}`                                           | 单组表单项初始值                                                                                                                                                    |
| multiple                 | `boolean`                          | `false`                                        | 是否多选                                                                                                                                                            |
| multiLine                | `boolean`                          | `false`                                        | 默认是横着展示一排，设置以后竖着展示                                                                                                                                |
| minLength                | `number`                           |                                                | 最少添加的条数                                                                                                                                                      |
| maxLength                | `number`                           |                                                | 最多添加的条数                                                                                                                                                      |
| flat                     | `boolean`                          | `false`                                        | 是否将结果扁平化(去掉 name),只有当 items 的 length 为 1 且 multiple 为 true 的时候才有效。                                                                          |
| joinValues               | `boolean`                          | `true`                                         | 默认为 `true` 当扁平化开启的时候，是否用分隔符的形式发送给后端，否则采用 array 的方式。                                                                             |
| delimiter                | `string`                           | `false`                                        | 当扁平化开启并且 joinValues 为 true 时，用什么分隔符。                                                                                                              |
| addable                  | `boolean`                          | `false`                                        | 是否可新增                                                                                                                                                          |
| removable                | `boolean`                          | `false`                                        | 是否可删除                                                                                                                                                          |
| deleteApi                | [API](../../../docs/types/api)     |                                                | 如果配置了，则删除前会发送一个 api，请求成功才完成删除                                                                                                              |
| deleteConfirmText        | `string`                           | `"确认要删除？"`                               | 当配置 `deleteApi` 才生效！删除时用来做用户确认                                                                                                                     |
| draggable                | `boolean`                          | `false`                                        | 是否可以拖动排序, 需要注意的是当启用拖动排序的时候，会多一个\$id 字段                                                                                               |
| draggableTip             | `string`                           | `"可通过拖动每行中的【交换】按钮进行顺序调整"` | 可拖拽的提示文字                                                                                                                                                    |
| subFormMode              | `string`                           | `"normal"`                                     | 可选`normal`、`horizontal`、`inline`                                                                                                                                |
| placeholder              | `string`                           | ``                                             | 没有成员时显示。                                                                                                                                                    |
| canAccessSuperData       | `boolean`                          | `false`                                        | 指定是否可以自动获取上层的数据并映射到表单项上                                                                                                                      |
| conditions               | `object`                           |                                                | 数组的形式包含所有条件的渲染类型，单个数组内的`test` 为判断条件，数组内的`items`为符合该条件后渲染的`schema`                                                        |
| typeSwitchable           | `boolean`                          | `false`                                        | 是否可切换条件，配合`conditions`使用                                                                                                                                |
| strictMode               | `boolean`                          | `true`                                         | 默认为严格模式，设置为 false 时，当其他表单项更新是，里面的表单项也可以及时获取，否则不会。                                                                         |
| syncFields               | `Array<string>`                    | `[]`                                           | 配置同步字段。只有 `strictMode` 为 `false` 时有效。如果 Combo 层级比较深，底层的获取外层的数据可能不同步。但是给 combo 配置这个属性就能同步下来。输入格式：`["os"]` |
| nullable                 | `boolean`                          | `false`                                        | 允许为空，如果子表单项里面配置验证器，且又是单条模式。可以允许用户选择清空（不填）。                                                                                |
| itemClassName            | `string`                           |                                                | 单组 CSS 类                                                                                                                                                         |
| itemsWrapperClassName    | `string`                           |                                                | 组合区域 CSS 类                                                                                                                                                     |
| deleteBtn                | [Button](../button.md) or `string` | 自定义删除按钮                                 | 只有当`removable`为 `true` 时有效; 如果为`string`则为按钮的文本；如果为`Button`则根据配置渲染删除按钮。                                                             |
| addBtn                   | [Button](../button.md)             | 自定义新增按钮                                 | 可新增自定义配置渲染新增按钮，在`tabsMode: true`下不生效。                                                                                                          |
| addButtonClassName       | `string`                           |                                                | 新增按钮 CSS 类名                                                                                                                                                   |
| addButtonText            | `string`                           | `"新增"`                                       | 新增按钮文字                                                                                                                                                        |

## 事件表

| 事件名称   | 事件参数                                                                   | 说明                                    |
| ---------- | -------------------------------------------------------------------------- | --------------------------------------- |
| add        | value: `string` or `string[]` 现有的数据集                                 | 添加组合项                              |
| delete     | key: `number` 移除项的索引<br />value: `string` or `string[]` 现有的数据集 | 删除组合项                              |
| tabsChange | key: `number` 切换后 tab 的索引                                            | 切换 tab<br/>前置条件：tabsMode 为 true |

## 动作表

暂无
