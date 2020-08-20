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

```schema:height="700" scope="body"
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
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
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

```schema:height="700" scope="body"
{
  "type": "form",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
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

```schema:height="400" scope="body"
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
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
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

```schema:height="400" scope="body"
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
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
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

```schema:height="400" scope="body"
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
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
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

```schema:height="400" scope="body"
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
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
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

## 属性表

| 属性名                       | 类型                    | 默认值           | 说明                                     |
| ---------------------------- | ----------------------- | ---------------- | ---------------------------------------- |
| type                         | `string`                | `"table"`        | 指定为 Table 渲染器                      |
| addable                      | `boolean`               | `false`          | 是否可增加一行                           |
| editable                     | `boolean`               | `false`          | 是否可编辑                               |
| removable                    | `boolean`               | `false`          | 是否可删除                               |
| showAddBtn                   | `boolean`               | `true`           | 是否显示添加按钮                         |
| addApi                       | [API](../../types/api)  | -                | 新增时提交的 API                         |
| updateApi                    | [API](../../types/api)  | -                | 修改时提交的 API                         |
| deleteApi                    | [API](../../types/api)  | -                | 删除时提交的 API                         |
| addBtnLabel                  | `string`                |                  | 增加按钮名称                             |
| addBtnIcon                   | `string`                | `"fa fa-plus"`   | 增加按钮图标                             |
| updateBtnLabel               | `string`                | `""`             | 更新按钮名称                             |
| updateBtnIcon                | `string`                | `"fa fa-pencil"` | 更新按钮图标                             |
| deleteBtnLabel               | `string`                | `""`             | 删除按钮名称                             |
| deleteBtnIcon                | `string`                | `"fa fa-minus"`  | 删除按钮图标                             |
| confirmBtnLabel              | `string`                | `""`             | 确认编辑按钮名称                         |
| confirmBtnIcon               | `string`                | `"fa fa-check"`  | 确认编辑按钮图标                         |
| cancelBtnLabel               | `string`                | `""`             | 取消编辑按钮名称                         |
| cancelBtnIcon                | `string`                | `"fa fa-times"`  | 取消编辑按钮图标                         |
| columns                      | `array`                 | []               | 列信息                                   |
| columns[x].quickEdit         | `boolean` 或者 `object` | -                | 配合 editable 为 true 一起使用           |
| columns[x].quickEditOnUpdate | `boolean` 或者 `object` | -                | 可以用来区分新建模式和更新模式的编辑配置 |
