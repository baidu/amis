---
title: Options 选择器表单项
description:
type: 0
group: null
menuName: Options 选择器表单项
icon:
order: 2
---

**选择器表单项** 是指那些（例如下拉选择框）具有选择器特性的表单项

它派生自 [表单项](./formitem)，拥有表单项所有的特性。

## 选项组格式

选择器表单项可以通过配置一组选项(`options`)，可以供给用户选择，如下：

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

`options`属性配置的对象数组就是`select`选择器组件的选项组。

### 标准格式

```json
{
    "options": [
        {
            "label": "xxx1",
            "value": "value1",
            "children": []
            ... // 其他变量值
        },
        {
            "label": "xxx2",
            "value": "value2",
            "children": []
            ... // 其他变量值
        }
    ]
}
```

标准的选项格式为对象数组，数组中的每个对象需要两个必备字段：

- `label`：标识当前选项的显示文本，帮助用户选择
- `value`：标识当前选项的值，用作数据保存和映射
- `children`：嵌套子选项，只有在 Tree 或 Nested-Select 等支持嵌套功能的组件中才有用

查看下面例子，修改选项你会发现数据域会发发生变化，改数据域中该表单项的值为选中选项的`value`值。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

### 简单格式

也可以配置简单的字符串或数字数组，此时默认`label`和`value`保持一致

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "options": ["A", "B", "C"]
        }
    ]
}
```

## 静态选项组 options

可以使用静态方式，配置一组选项组：

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

## 动态选项组 source

### 通过数据域中变量配置

你也可以配置`source`属性，利用 [数据映射](../../../docs/concepts/data-mapping)，获取当前数据链中的变量

```schema: scope="body"
{
    "type": "form",
    "data": {
        "items": [
            {
                "label":"A",
                "value":"a"
            },
            {
                "label":"B",
                "value":"b"
            },
            {
                "label":"C",
                "value":"c"
            }
        ]
    },
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "source": "${items}"
        }
    ]
}
```

上例中，我们给 select 组件，配置`"source": "${items}"`，获取了当前数据域中的`items`变量作为选项组。

### 远程拉取

除了可以通过数据映射获取当前数据域中的变量以外，`source`还支持配置接口，格式为 [API](../../../docs/types/api)，用于动态返回选项组。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "source": "/api/mock2/form/getOptions?waitSeconds=1"
        }
    ]
}
```

远程拉取接口时，返回的数据结构除了需要满足 [amis 接口要求的基本数据结构](../../../docs/types/api#%E6%8E%A5%E5%8F%A3%E8%BF%94%E5%9B%9E%E6%A0%BC%E5%BC%8F-%E9%87%8D%E8%A6%81-) 以外，必须用`"options"`作为选项组的`key`值，如下

```json
{
  "status": 0,
  "msg": "",
  "data": {
    // 必须用 options 作为选项组的 key 值
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
      }
    ]
  }
}
```

## 默认值/自动选中 value

我们知道表单项可以通过配置`value`属性来设置默认值

而选择器表单项如果设置`value`属性，为某一个选项中的`value`值，那么该选择器将自动选中该选项。

### 静态配置

静态配置同表单项默认值配置方式，直接在组件上配置`value`属性。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "value": "b",
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

上例我们设置默认值为`b`，则会自动匹配到选项`B`并选中。

如果想默认选择第一个，可以直接配置 `selectFirst` 属性。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "selectFirst": true,
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

### 动态配置

有时候我们想默认选中一个选项，但是`options`又是远程拉取的，无法确定默认值是啥，这时候，**需要在`source`接口中返回`value`，来动态设置默认值**，**接口返回数据结构**如下：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "value": "b", // 这样就会自动选中b选项
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
      }
    ]
  }
}
```

### 数据格式一致性问题

当使用 `source` 或 `value` 配置默认值的时候，需要保持数据格式的一致性。

如果使用 `source` 或 `value` 配置的默认值与当前表单项配置的数据格式不符合，而且用户没有再次操作该表单项，而直接提交表单，那么会将当前默认值原封不动的提交给后端，可能会导致不一致性的问题，我们看一个例子：

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "multiple": true,
            "value": ["a", "c"],
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

上例中， `select` 我们配置了`"multiple": true`，预期中，我们希望选中 `A` 和 `C` 项时，表单项的数据格式为：`"a,c"`，但是我们设置了`"value": ["a", "c"]`，并不符合我们当前表单项的数据格式配置，这样会导致两个问题：

1. 有可能不会默认选中 `A` 和 `C` 选项；
2. 当不操作该表单项，直接提交时，预期是：`"a,c"`，但提交给后端的数据为：`["a", "c"]`，导致了不一致性的问题。

> 通过 `source` 配置默认值同理，不再赘述

因此一定确保默认值与选择器表单项数据格式配置相匹配。

## 多选 multiple

大部分选择器组件默认是单选的，可以配置`"multiple": true`支持多选。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "data": {
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
            }
        ]
    },
    "body": [
        {
            "label": "单选",
            "type": "select",
            "name": "select1",
            "source": "${options}"
        },
        {
            "type": "divider"
        },
        {
            "label": "多选",
            "type": "select",
            "name": "select2",
            "multiple": true,
            "source": "${options}"
        }
    ]
}
```

还可以通过 `checkAll` 开启全选。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "多选",
            "type": "select",
            "name": "select2",
            "checkAll": true,
            "multiple": true,
            "source": "/api/mock2/form/getOptions"
        }
    ]
}
```

默认多选的值格式为逗号拼接 value 值，例如：`1,2,3`，如果需要改变值格式，请阅读下面 [拼接符 delimiter](#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)、[拼接值 joinValues](#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues) 和 [提取多选值 extractValue](#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)配置项。

如果值太多折行可以通过 `valuesNoWrap` 来避免折行。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "多选",
            "type": "select",
            "name": "select2",
            "checkAll": true,
            "valuesNoWrap": true,
            "multiple": true,
            "source": "/api/mock2/form/getOptions"
        }
    ]
}
```

## 拼接符 delimiter

多选模式下，默认表单项值为选中的选项的`value`值，用默认拼接符`,`拼接，如下

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "multiple": true,
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

默认的拼接符是逗号`,`，但是当你的某个选项中的`value`值内包含`,`这个字符，这样会造成一些预期中的问题

你可以设置`delimiter`属性，自定义拼接符，保证不与你选项中的`value`值冲突

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "multiple": true,
            "delimiter": "|",
            "options": [
                {
                    "label":"A",
                    "value":"a,1"
                },
                {
                    "label":"B",
                    "value":"b,2"
                },
                {
                    "label":"C",
                    "value":"c,3"
                }
            ]
        }
    ]
}
```

上例我们`value`中有逗号，与默认拼接符冲突，这时设置`"delimiter": "|"`，可以看到选择多个选项时，每个选项的`value`属性会用`|`拼接起来，作为表单项的值

## 拼接值 joinValues

当选择器表单项选中某一选项后，当前表单项的值格式默认：

- 单选：选中选项的`value`值
- 多选：选中所有选项的`value`，用拼接符进行拼接，默认拼接符为`,`

选中下面两个选择器，观察数据域值变化。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "单选",
            "type": "select",
            "name": "select1",
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
                }
            ]
        },
        {
            "type": "divider"
        },
        {
            "label": "多选",
            "type": "select",
            "name": "select2",
            "multiple": true,
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
                }
            ]
        }
    ]
}
```

但是你可以通过配置`"joinValues": false`，来获取完整的选项对象

### 单选模式

单选模式下，配置`"joinValues": false`，该表单项值为选中选项的完整对象值，选中下例中的任意选项，观察数据域变化。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "joinValues": false,
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

### 多选模式

多选模式下，配置`"joinValues": false`，该表单项值为所有选中项的对象数组

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "multiple": true,
            "joinValues": false,
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

### 自动选中问题

当你通过`joinValues`调整选择器表单项的数据结构后，设置默认值时，格式也要和设置的数据结构保持一致

例如下面这个例子，当你给`select`设置了`"joinValues": false`时，选中 B 选项，则该表单项值为`{"label":"B","value":"b"}`，如果你想要默认选中某一项，则也需要设置`value`为完整的对象：`{"label":"B","value":"b"}`

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "joinValues": false,
            "value": {
                "label":"B",
                "value":"b"
            },
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

## 提取多选值 extractValue

当`"joinValues": false`时，默认会将选中的所有选项组成的对象数组，作为表单项的值，如果你想只抽取选项中的 value 值，拼成新的数组，那么可以配置`"extractValue": true`

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "multiple": true,
            "joinValues": false,
            "extractValue": true,
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

选中所有选型，你会看到表单项的值为：`["a", "b", "c"]`。

### 自动选中问题

当你通过`joinValues`和`extractValue`调整选择器表单项的数据结构后，设置默认值时，格式也要和设置的数据结构保持一致

例如下面这个例子，当你给`select`设置了`"joinValues": false`和`"extractValue": true`时，选中 A、B 选项，则该表单项值为`["a", "b"]`，如果你想要默认选中某一项，则也需要设置`value`为同样格式：`["a", "b"]`

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "multiple": true,
            "joinValues": false,
            "extractValue": true,
            "value": ["a", "b"],
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

## 检索 searchable

可以配置 `"searchable": true` 显示前端过滤，适合用于有大量内容的列表。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "searchable": true,
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

## 自动补全 autoComplete

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "name": "select",
            "type": "select",
            "label": "选项自动补全",
            "autoComplete": "/api/mock2/options/autoComplete?term=$term",
            "placeholder": "请输入"
        }
    ]
}
```

可以在`autoComplete`配置中，用数据映射，获取变量`term`，为当前输入的关键字。

支持该配置项的组件有：Text、Select、Chained-Select、TreeSelect、Condition-Builder。

## 选项标签字段 labelField

默认渲染选项组，会获取每一项中的`label`变量作为展示文本，如果你的选中项中没有`label`字段，可能会有显示问题

例如下例中，options 中只有`text`和`value`字段而没有 `label` 字段，这时点开下拉框，你会发现选项无法正常显示。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "options": [
                {
                    "text":"A",
                    "value":"a"
                },
                {
                    "text":"B",
                    "value":"b"
                },
                {
                    "text":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

这种情况下如果你想自定义该字段，则可以设置`labelField`

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "labelField": "text",
            "options": [
                {
                    "text":"A",
                    "value":"a"
                },
                {
                    "text":"B",
                    "value":"b"
                },
                {
                    "text":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

> 不推荐使用该方式，建议格式化好选项组数据结构

## 选项值字段 valueField

默认渲染选项组，会获取每一项中的`value`变量作为表单项值，如果你的选中项中没有`value`字段，将会无法选中

例如下例中，options 中只有`label`和`val`字段而没有`value`字段，这时点开下拉框，你会发现选项无法正常选中。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "options": [
                {
                    "label":"A",
                    "val":"a"
                },
                {
                    "label":"B",
                    "val":"b"
                },
                {
                    "label":"C",
                    "val":"c"
                }
            ]
        }
    ]
}
```

这种情况下如果你想自定义该字段，则可以设置`valueField`

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "valueField": "val",
            "options": [
                {
                    "label":"A",
                    "val":"a"
                },
                {
                    "label":"B",
                    "val":"b"
                },
                {
                    "label":"C",
                    "val":"c"
                }
            ]
        }
    ]
}
```

> 不推荐使用该方式，建议格式化好选项组数据结构

## 新增选项

部分选择器组件支持在前端进行新增选项的操作。

支持该功能的组件有：CheckBoxes、Select、Tree

### 前端新增 creatable

，可以配置`"creatable": true`，支持在前端临时新增选项。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "creatable": true,
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

点开下拉框，会看到选项列表底部有`新增选项`按钮，点击后会显示一个包含简单表单的弹框，点击提交可以新增选项，不同组件交互会有不同。

新增选项表单弹框的默认配置如下：

```json
{
  "type": "dialog",
  "title": "新增选项",
  "body": {
    "type": "form",
    "body": [
      {
        "type": "text",
        "name": "label",
        "label": false,
        "placeholder": "请输入名称"
      }
    ]
  }
}
```

- 你可以配置`createBtnLabel`来自定义这个弹框的标题；
- 你也可以配置`optionLabel`，来替换`"选项"`这个字符，如我们配置`"optionLabel": "员工"`，标题会显示：`新增员工`；
- 默认表单项的`name`属性为`labelField`所配置的值，默认为`label`

### 自定义新增表单项 addControls

默认只有一个文本框，也就是意味着，默认添加选项后，该选项`label`和`value`是一样的，如果你想自定义该表单中的表单项，你可以通过配置`addControls`属性

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "creatable": true,
            "addControls": [
                {
                    "type": "text",
                    "name": "label",
                    "label": "选项标题"
                },
                {
                    "type": "text",
                    "name": "value",
                    "label": "选项值"
                }
            ],
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

上例中你可以选项标题输入`D`，选项值输入`d`。实现自定义添加选项格式

不过在没配置保存接口时，`addControls`中务必需要有`labelField`和`valueField`所配置的`name`表单项才可以正确保存

> `addControls`属性格式为表单项数组，更多细节参考 [FormItem 表单项](./formitem)。

### 配置新增接口 addApi

默认新增只会暂时把新增的值保存在前端，如果你想前端新增选项后，同时把该选项保存到后端，则可以配置保存接口`addApi`。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "addApi": "/api/mock2/form/saveForm",
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

> 配置`addApi`实际上将该配置值设置给该表单的`api`属性。
>
> 如果同时配置了`source`和`addApi`，添加选项成功后会重新获取请求`source`接口

## 编辑选项

部分选择器组件支持在前端编辑选项

支持该功能的组件有：CheckBoxes、Select、Tree、Table-formitem

### 前端编辑 editable

配置`"editable": true`，支持在前端编辑选项。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "editable": true,
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

点开下拉框，会看到每个选项右侧有一个编辑图标，点击后会显示一个编辑选项的弹框，修改后点击提交可以编辑选项标签。不同组件交互会有不同

编辑选项弹框的默认配置如下：

```json
{
  "type": "dialog",
  "title": "新增选项",
  "body": {
    "type": "form",
    "body": [
      {
        "type": "text",
        "name": "label",
        "label": false,
        "placeholder": "请输入名称"
      }
    ]
  }
}
```

- 你也可以配置`optionLabel`，来替换`"选项"`这个字符，如我们配置`"optionLabel": "员工"`，标题会显示：`新增员工`；
- 默认表单项的`name`属性为`labelField`所配置的值，默认为`label`

### 自定义编辑表单项 editControls

默认只能修改当前选项的`label`属性，如果你想要修改其他属性，可以配置`editControls`，自定义编辑表单项

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "editable": true,
            "editControls": [
                {
                    "type": "text",
                    "name": "label",
                    "label": "选项标题"
                },
                {
                    "type": "text",
                    "name": "value",
                    "label": "选项值"
                }
            ],
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

修改后重新选中该表单项，观察数据域中数据变化。

### 配置编辑接口 editApi

默认编辑只会作用在前端，如果你想前端编辑选项后，同时把该选项保存到后端，则可以配置保存接口`editApi`。

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "editApi": "/api/mock2/form/saveForm",
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

> 配置`editApi`实际上将该配置值设置给编辑表单的`api`属性。
>
> 如果同时配置了`source`和`editApi`，添加选项成功后会重新获取请求`source`接口

## 删除选项

部分选择器组件，支持在前端进行编辑选项操作

支持该功能的组件有：CheckBoxes、Select、Tree、Table-formitem

### 配置删除接口 deleteApi

删除选项不支持在前端级别删除，我们认为是没有意义的，必须要配置`deleteApi`使用接口进行删除

配置`"removable": true`和`deleteApi`，支持在前端删除选项。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "deleteApi": "/api/mock2/form/saveForm",
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

点开下拉框，鼠标悬浮在选项上，可以看到右侧会有删除图标，点击可请求删除接口进行删除

## 自动填充 autoFill

一些选择器组件，支持配置`autoFill`，将当前已选中的选项的某个字段的值，自动填充到表单中某个表单项中，支持[数据映射](../../../docs/concepts/data-mapping)

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "select",
            "label": "选项",
            "name": "select",
            "autoFill": {
                "option.instantValidate": "${label}",
                "option.submitValidate": "${label}",
            },
            "clearable": true,
            "options": [
                {
                    "label": "Option A",
                    "value": "a"
                },
                {
                    "label": "Option B",
                    "value": "b"
                }
            ]
        },
        {
            "type": "input-text",
            "name": "option.instantValidate",
            "label": "选中项",
            "description": "填充后立即校验",
            "required": true,
            "validateOnChange": true,
            "validations": {
                "equals": "Option B"
            },
            "validationErrors": {
                "equals": "校验失败，数据必须为Option B"
            }
        },
        {
            "type": "input-text",
            "name": "option.submitValidate",
            "label": "选中项1",
            "description": "填充后提交表单时才校验",
            "required": true,
            "validations": {
                "equals": "Option B"
            },
            "validationErrors": {
                "equals": "校验失败，数据必须为Option B"
            }
        }
    ]
}
```

上例中我们配置了`"autoFill": {"option.instantValidate": "${label}"}`，表示将选中项中的`label`的值，自动填充到当前表单项中`name`为`option.instantValidate`的文本框中。可以额外配置`"validateOnChange": true`，实现自动填充后立即校验填充项。

**多选模式**

当表单项为多选模式时，不能再直接取选项中的值了，而是通过 `items` 变量来取，通过它可以获取当前选中的选项集合。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "select",
            "label": "选项",
            "name": "select",
            "autoFill": {
                "options": "${items|pick:label}",
                "firstOption": "${items|first|pick:label}"
            },
            "multiple": true,
            "clearable": true,
            "options": [
                {
                    "label": "Option A",
                    "value": "a"
                },
                {
                    "label": "Option B",
                    "value": "b"
                }
            ]
        }
    ]
}
```

支持该配置项的有：ButtonGroup、List、NestedSelect、Picker、Radios、Select。

## 控制选项高度

> 1.10.0 及以上版本

下拉框在数据量较大时（超过 100，可以通过 `virtualThreshold` 控制）会自动切换到虚拟渲染模式，如果选项的内容较长会导致内容重叠，这时需要设置 `itemHeight` 来避免。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "select",
            "label": "虚拟列表选择",
            "name": "virtual-select",
            "clearable": true,
            "searchable": true,
            "source": "/api/mock2/form/getOptions?waitSeconds=1&size=200"
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名           | 类型                                                                              | 默认值    | 说明                                                                         |
| ---------------- | --------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| options          | `Array<object>`或`Array<string>`                                                  |           | 选项组，供用户选择                                                           |
| source           | [API](../../../docs/types/api) 或 [数据映射](../../../docs/concepts/data-mapping) |           | 选项组源，可通过数据映射获取当前数据域变量、或者配置 API 对象                |
| multiple         | `boolean`                                                                         | `false`   | 是否支持多选                                                                 |
| labelField       | `boolean`                                                                         | `"label"` | 标识选项中哪个字段是`label`值                                                |
| valueField       | `boolean`                                                                         | `"value"` | 标识选项中哪个字段是`value`值                                                |
| joinValues       | `boolean`                                                                         | `true`    | 是否拼接`value`值                                                            |
| extractValue     | `boolean`                                                                         | `false`   | 是否将`value`值抽取出来组成新的数组，只有在`joinValues`是`false`是生效       |
| itemHeight       | `number`                                                                          | `32`      | 每个选项的高度，用于虚拟渲染                                                 |
| virtualThreshold | `number`                                                                          | `100`     | 在选项数量超过多少时开启虚拟渲染                                             |
| valuesNoWrap     | `boolean`                                                                         | `false`   | 默认情况下多选所有选项都会显示，通过这个可以最多显示一行，超出的部分变成 ... |
