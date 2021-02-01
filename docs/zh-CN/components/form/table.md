---
title: Table 表格
description:
type: 0
group: null
menuName: Table 表格
icon:
order: 54
---

## 基本用法

可以用来展示数组类型的数据。配置`columns` 数组，来定义列信息。

```schema: scope="body"
{
  "type": "form",
  "debug": "true",
  "data": {
    "table": [
        {
            "a": "a1",
            "b": "b1"
        },
        {
            "a": "a2",
            "b": "b2"
        },
        {
            "a": "a3",
            "b": "b3"
        }
    ]
  },
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
    "type":"table",
    "name":"table",
    "columns":[
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
    ]
  }
  ]
}
```

我们为表单数据域设置了`table`变量，配置`table`表单项可以展示该数据

## 可新增行

可以配置`addable`和`editable`指定可以新增且编辑行数据

```schema: scope="body"
{
  "type": "form",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
    "type":"table",
    "name":"table",
    "addable": true,
    "editable": true,
    "columns":[
        {
          "name": "a",
          "label": "A"
        },
        {
          "name": "b",
          "label": "B"
        }
    ]
  }
  ]
}
```

### 按钮触发新增行

按钮上配置`"actionType": "add"`和`target`指定表格`name`，可以实现点击按钮添加一行的效果。

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      },
      {
        "a": "a2",
        "b": "b2"
      },
      {
        "a": "a3",
        "b": "b3"
      }
    ]
  },
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "table",
      "name": "table",
      "label": "Table",
      "columns": [
        {
          "label": "A",
          "name": "a"
        },
        {
          "label": "B",
          "name": "b"
        }
      ]
    },
    {
        "type": "button",
        "label": "Table新增一行",
        "target": "table",
        "actionType": "add"
    }
  ]
}
```

当表格上配置了`addApi`时，会请求该 `api`，并将返回数据添加到目标表格。

### 编辑行配置

还可以在列上配置`quickEdit`实现编辑配置，更多配置参考 [快速编辑](../crud#%E5%BF%AB%E9%80%9F%E7%BC%96%E8%BE%91)

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      },
      {
        "a": "a2",
        "b": "b2"
      },
      {
        "a": "a3",
        "b": "b3"
      }
    ]
  },
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "table",
      "name": "table",
      "label": "Table",
      "columns": [
        {
          "label": "A",
          "name": "a",
          "quickEdit": true
        },
        {
          "label": "B",
          "name": "b",
          "quickEdit": true
        }
      ]
    }
  ]
}
```

## 可拖拽

配置`"draggable": true`，实现可拖拽调整顺序

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      },
      {
        "a": "a2",
        "b": "b2"
      },
      {
        "a": "a3",
        "b": "b3"
      }
    ]
  },
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "table",
      "name": "table",
      "label": "Table",
      "draggable": true,
      "columns": [
        {
          "label": "A",
          "name": "a"
        },
        {
          "label": "B",
          "name": "b"
        }
      ]
    }
  ]
}
```

## 非确认模式

配置`"needConfirm": false`，不需要确认，那么就是一直就是处于编辑形态。

```schema: scope="body"
{
  "type": "form",
  "data": {
    "table": [
      {
        "a": "a1",
        "b": "b1"
      },
      {
        "a": "a2",
        "b": "b2"
      },
      {
        "a": "a3",
        "b": "b3"
      }
    ]
  },
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
      "type": "table",
      "name": "table",
      "label": "Table",
      "needConfirm": false,
      "addable": true,
      "removable": true,
      "columns": [
        {
          "label": "A",
          "name": "a",
          "quickEdit": false
        },
        {
          "label": "B",
          "name": "b"
        }
      ]
    }
  ]
}
```

## 获取父级数据

默认情况下，Table 内表达项无法获取父级数据域的数据，如下，我们添加 Table 表单项时，尽管 Table 内的文本框的`name`与父级数据域中的`super_text`变量同名，但是没有自动映射值。

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
        "type": "text",
        "label": "父级文本框",
        "name": "super_text",
        "value": "123"
    },
    {
        "type": "table",
        "name": "list",
        "label": "不可获取父级数据",
        "addable": true,
        "needConfirm": false,
        "columns": [
            {
                "name": "super_text",
                "type": "text",
                "label": "A"
            }
        ]
    }
  ]
}
```

可以配置`"canAccessSuperData": true` 同时配置 `"strictMode": false` 开启此特性，如下，配置了该配置项后，添加 Table 的`text`表单项会初始会自动映射父级数据域的同名变量。需要注意的是，这里只会初始会映射，一旦修改过就是当前行数据为主了。也就是说，表单项类型的，只会起到初始值的作用。如果为非表单项则会同步更新，比如这个例子的第二列。同时非表单项字段可以用在表单项字段中做联动。

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
  "controls": [
    {
        "type": "text",
        "label": "父级文本框",
        "name": "super_text",
        "value": "123"
    },
    {
        "type": "switch",
        "label": "父级勾选框",
        "name": "super_switch",
        "value": false
    },
    {
        "type": "table",
        "name": "list",
        "label": "可获取父级数据",
        "addable": true,
        "needConfirm": false,
        "canAccessSuperData": true,
        "strictMode": false,
        "value": [{}],
        "columns": [
            {
                "name": "super_text",
                "type": "text",
                "label": "表单项",
                "quickEdit": {
                  "disabledOn": "this.super_switch"
                }
            },

            {
                "name": "super_switch",
                "type": "status",
                "quickEdit": false,
                "label": "非表单项"
            }
        ]
    }
  ]
}
```

## 属性表

| 属性名                       | 类型                           | 默认值           | 说明                                                                                                 |
| ---------------------------- | ------------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------- |
| type                         | `string`                       | `"table"`        | 指定为 Table 渲染器                                                                                  |
| addable                      | `boolean`                      | `false`          | 是否可增加一行                                                                                       |
| editable                     | `boolean`                      | `false`          | 是否可编辑                                                                                           |
| removable                    | `boolean`                      | `false`          | 是否可删除                                                                                           |
| showAddBtn                   | `boolean`                      | `true`           | 是否显示添加按钮                                                                                     |
| addApi                       | [API](../../../docs/types/api) | -                | 新增时提交的 API                                                                                     |
| updateApi                    | [API](../../../docs/types/api) | -                | 修改时提交的 API                                                                                     |
| deleteApi                    | [API](../../../docs/types/api) | -                | 删除时提交的 API                                                                                     |
| addBtnLabel                  | `string`                       |                  | 增加按钮名称                                                                                         |
| addBtnIcon                   | `string`                       | `"fa fa-plus"`   | 增加按钮图标                                                                                         |
| updateBtnLabel               | `string`                       | `""`             | 更新按钮名称                                                                                         |
| updateBtnIcon                | `string`                       | `"fa fa-pencil"` | 更新按钮图标                                                                                         |
| deleteBtnLabel               | `string`                       | `""`             | 删除按钮名称                                                                                         |
| deleteBtnIcon                | `string`                       | `"fa fa-minus"`  | 删除按钮图标                                                                                         |
| confirmBtnLabel              | `string`                       | `""`             | 确认编辑按钮名称                                                                                     |
| confirmBtnIcon               | `string`                       | `"fa fa-check"`  | 确认编辑按钮图标                                                                                     |
| cancelBtnLabel               | `string`                       | `""`             | 取消编辑按钮名称                                                                                     |
| cancelBtnIcon                | `string`                       | `"fa fa-times"`  | 取消编辑按钮图标                                                                                     |
| needConfirm                  | `boolean`                      | `true`           | 是否需要确认操作，，可用来控控制表格的操作交互                                                       |
| canAccessSuperData           | `boolean`                      | `false`          | 是否可以访问父级数据，也就是表单中的同级数据，通常需要跟 strictMode 搭配使用                         |
| strictMode                   | `boolean`                      | `true`           | 为了性能，默认其他表单项项值变化不会让当前表格更新，有时候为了同步获取其他表单项字段，需要开启这个。 |
| columns                      | `array`                        | []               | 列信息                                                                                               |
| columns[x].quickEdit         | `boolean` 或者 `object`        | -                | 配合 editable 为 true 一起使用                                                                       |
| columns[x].quickEditOnUpdate | `boolean` 或者 `object`        | -                | 可以用来区分新建模式和更新模式的编辑配置                                                             |
