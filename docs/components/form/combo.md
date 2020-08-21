---
title: Combo 组合
description:
type: 0
group: null
menuName: Combo
icon:
order: 12
---

组合模式，支持自由组合多个表单项。当设置成单选时数据格式为对象，当设置成多选时数据格式为数组，数组成员是对象（flat 模式可以直接是某个表单单项的数值）。

## 基本使用

配置`controls`属性，组合多个表单项

```schema:height="300" scope="body"
{
  "type": "form",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "combo",
      "name": "combo",
      "label": "Combo",
      "controls": [
        {
          "name": "text",
          "label": "文本",
          "type": "text"
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

## 多行展示模式

默认，combo 内表单项是横着展示一排，如果想换行展示，可以配置`"multiLine": true`

```schema:height="450" scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "combo",
      "name": "combo1",
      "label": "Combo 单行展示",
      "controls": [
        {
          "name": "text",
          "label": "文本",
          "type": "text"
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
      "controls": [
        {
          "name": "text",
          "label": "文本",
          "type": "text"
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

默认，combo 为单选模式，可以配置`"multiple": true`实现多选模式

```schema:height="400" scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "combo",
      "name": "combo1",
      "label": "Combo 单选展示",
      "controls": [
        {
          "name": "text",
          "label": "文本",
          "type": "text"
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
      "controls": [
        {
          "name": "text",
          "label": "文本",
          "type": "text"
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

```schema:height="400" scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "combo",
      "name": "combo1",
      "label": "最少添加1条",
      "multiple": true,
      "minLength": 1,
      "controls": [
        {
          "name": "text",
          "label": "文本",
          "type": "text"
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
      "controls": [
        {
          "name": "text",
          "label": "文本",
          "type": "text"
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

```schema:height="600" scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "combo",
      "name": "combo1",
      "label": "Combo 单选展示",
      "controls": [
        {
          "name": "text",
          "label": "文本",
          "type": "text"
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
      "controls": [
        {
          "name": "text",
          "label": "文本",
          "type": "text"
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

```schema:height="600" scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
        "type": "combo",
        "name": "combo1",
        "label": "默认模式",
        "multiple": true,
        "controls": [
            {
                "name": "text",
                "type": "text"
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
        "controls": [
            {
                "name": "text",
                "type": "text"
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

## 唯一验证

可以在配置的`controls`项上，配置`"unique": true`，指定当前表单项不可重复

```schema:height="400" scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
        "type": "combo",
        "name": "combo666",
        "label": "唯一",
        "multiple": true,
        "controls": [
            {
                "name": "text",
                "type": "text",
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

## 拖拽排序

多选模式下，可以配置`"draggable": true`实现拖拽调整排序

```schema:height="600" scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
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
        "controls": [
            {
                "name": "text",
                "type": "text"
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

如下面的栗子，定义了两种类型：文本和数字，用户新增的时候可以选择是新增文本还是数字。区分是文字和数字的方式是根据成员数据中的 type 字段来决定。

```schema:height="450" scope="form-item"
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
      "controls": [
        {
          "label": "名称",
          "name": "label",
          "type": "text"
        },
        {
          "label": "字段名",
          "name": "name",
          "type": "text"
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
      "controls": [
        {
          "label": "名称",
          "name": "label",
          "type": "text"
        },
        {
          "label": "字段名",
          "name": "name",
          "type": "text"
        },
        {
          "label": "最小值",
          "name": "min",
          "type": "number"
        },
        {
          "label": "最大值",
          "name": "max",
          "type": "number"
        },
        {
          "label": "步长",
          "name": "step",
          "type": "number"
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
- `conditions[x].controls` 该类型的表单设置。
- `typeSwitchable` 类型是否允许切换，如果设置成 true 会多一个类型切换的按钮。

## Tabs 模式

默认成员是一个一个排列的，如果数据比较多有点让人眼花缭乱。所以 Combo 支持了 tabs 的排列方式。

```schema:height="350" scope="form-item"
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
  "controls": [
    {
      "name": "a",
      "label": "文本",
      "type": "text",
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

```schema:height="500" scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
        "type": "text",
        "label": "父级文本框",
        "name": "super_text",
        "value": "123"
    },
    {
        "type": "combo",
        "name": "combo1",
        "label": "不可获取父级数据",
        "multiple": true,
        "controls": [
            {
                "name": "super_text",
                "type": "text"
            }
        ]
    }
  ]
}
```

可以配置`"canAccessSuperData": true`开启此特性，如下，配置了该配置项后，添加 Combo 的`text`表单项会自动映射父级数据域的同名变量

```schema:height="500" scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
        "type": "text",
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
        "controls": [
            {
                "name": "super_text",
                "type": "text"
            }
        ]
    }
  ]
}
```

## 同步更新内部表单项

配置`canAccessSuperData`可以获取父级数据域值，但是为了效率，在父级数据域变化的时候，默认 combo 内部是不会进行同步的

如下，添加一组 combo，然后可以看到默认会映射父级变量值`123`，但是当你在更改父级数据域`super_text`文本框值后，combo 内部文本框并没有同步更新

```schema:height="500" scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
        "type": "text",
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
        "controls": [
            {
                "name": "super_text",
                "type": "text"
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

```schema:height="500" scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
        "type": "text",
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
        "controls": [
            {
                "name": "super_text",
                "type": "text"
            }
        ]
    }
  ]
}
```

## 设置序号

默认 Combo 数据域中，每一项会有一个隐藏变量`index`，可以利用 Tpl 组件，显示当前项序号

```schema:height="600" scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
        "type": "combo",
        "name": "combo",
        "label": "显示序号",
        "multiple": true,
        "controls": [
            {
                "type": "tpl",
                "tpl": "<%= data.index + 1%>",
                "className": "p-t-xs",
                "mode": "inline"
            },
            {
                "name": "text",
                "type": "text"
            }
        ]
    }
  ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名                      | 类型                        | 默认值                                         | 说明                                                                                                                                                            |
| --------------------------- | --------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| formClassName               | `string`                    |                                                | 单组表单项的类名                                                                                                                                                |
| controls                    | Array<[表单项](./formitem)> |                                                | 组合展示的表单项                                                                                                                                                |
| controls[x].columnClassName | `string`                    |                                                | 列的类名，可以用它配置列宽度。默认平均分配。                                                                                                                    |
| controls[x].unique          | `boolean`                   |                                                | 设置当前列值是否唯一，即不允许重复选择。                                                                                                                        |
| multiple                    | `boolean`                   | `false`                                        | 是否多选                                                                                                                                                        |
| multiLine                   | `boolean`                   | `false`                                        | 默认是横着展示一排，设置以后竖着展示                                                                                                                            |
| minLength                   | `number`                    |                                                | 最少添加的条数                                                                                                                                                  |
| maxLength                   | `number`                    |                                                | 最多添加的条数                                                                                                                                                  |
| flat                        | `boolean`                   | `false`                                        | 是否将结果扁平化(去掉 name),只有当 controls 的 length 为 1 且 multiple 为 true 的时候才有效。                                                                   |
| joinValues                  | `boolean`                   | `true`                                         | 默认为 `true` 当扁平化开启的时候，是否用分隔符的形式发送给后端，否则采用 array 的方式。                                                                         |
| delimiter                   | `string`                    | `false`                                        | 当扁平化开启并且 joinValues 为 true 时，用什么分隔符。                                                                                                          |
| addable                     | `boolean`                   | `false`                                        | 是否可新增                                                                                                                                                      |
| removable                   | `boolean`                   | `false`                                        | 是否可删除                                                                                                                                                      |
| deleteApi                   | [API](../../types/api)      |                                                | 如果配置了，则删除前会发送一个 api，请求成功才完成删除                                                                                                          |
| deleteConfirmText           | `string`                    | `"确认要删除？"`                               | 当配置 `deleteApi` 才生效！删除时用来做用户确认                                                                                                                 |
| draggable                   | `boolean`                   | `false`                                        | 是否可以拖动排序, 需要注意的是当启用拖动排序的时候，会多一个\$id 字段                                                                                           |
| draggableTip                | `string`                    | `"可通过拖动每行中的【交换】按钮进行顺序调整"` | 可拖拽的提示文字                                                                                                                                                |
| addButtonText               | `string`                    | `"新增"`                                       | 新增按钮文字                                                                                                                                                    |
| scaffold                    | `object`                    | `{}`                                           | 单组表单项初始值                                                                                                                                                |
| canAccessSuperData          | `boolean`                   | `false`                                        | 指定是否可以自动获取上层的数据并映射到表单项上                                                                                                                  |
| conditions                  | `object`                    |                                                | 数组的形式包含所有条件的渲染类型，单个数组内的`test` 为判断条件，数组内的`controls`为符合该条件后渲染的`schema`                                                 |
| typeSwitchable              | `boolean`                   | `false`                                        | 是否可切换条件，配合`conditions`使用                                                                                                                            |
| noBorder                    | `boolean`                   | `false`                                        | 单组表单项是否显示边框                                                                                                                                          |
| strictMode                  | `boolean`                   | `true`                                         | 默认为严格模式，设置为 false 时，当其他表单项更新是，里面的表单项也可以及时获取，否则不会。                                                                     |
| syncFields                  | `Array<string>`             | `true`                                         | 配置同步字段。只有 strictMode 为 false 时有效。如果 combo 层级比较深，底层的获取外层的数据可能不同步。但是给 combo 配置这个属性就能同步下来。输入格式：`["os"]` |
