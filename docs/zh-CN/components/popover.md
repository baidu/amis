---
title: PopOver 弹出提示
description:
type: 0
group: ⚙ 功能
menuName: popover
icon:
order: 60
---

popover 不是一个独立组件，它是嵌入到其它组件中使用的，目前可以在以下组件中配置

- table 的 column
- list 的 column
- static
- cards 里的字段

## 基本配置

比如在 CRUD 的 tpl 中，可以默认截断显示，然后加上 popOver 来显示全部内容

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample?waitSeconds=1",
    "columns": [
        {
            "type": "tpl",
            "name": "engine",
            "label": "Rendering engine",
            "tpl": "${engine|truncate:6}",
            "popOver": "${engine}"
        }
    ]
}
```

> 上面的 popOver 精简写法只支持 1.6.5 及以上版本，之前版本需要使用 "popOver": {"body": "$engine"}

## 在其它组件里的示例

```schema: scope="body"
[
  {
    "type": "form",
    "body": [
      {
        "name": "static",
        "type": "static",
        "label": "静态展示",
        "value": "static",
        "popOver": "弹出内容"
      }
    ]
  },
  {
    "type": "service",
    "api": "/api/mock2/sample?perPage=5",
    "body": [
      {
        "type": "list",
        "source": "$rows",
        "listItem": {
          "body": [
            {
              "type": "hbox",
              "columns": [
                {
                  "label": "Engine",
                  "name": "engine",
                  "popOver": "弹出内容"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "type": "service",
    "api": "/api/mock2/sample?perPage=5",
    "body": {
      "type": "cards",
      "source": "$rows",
      "card": {
        "body": [
          {
            "label": "Engine",
            "name": "engine",
            "popOver": "弹出内容"
          }
        ]
      }
    }
  }
]
```

## 更多配置

可以配置触发条件，是否显示 icon，title 等，具体请参考后面的配置列表

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample?waitSeconds=1",
    "columns": [
        {
            "type": "tpl",
            "name": "engine",
            "label": "Rendering engine",
            "tpl": "${engine|truncate:6}",
            "popOver": {
                "trigger": "hover",
                "position": "left-top",
                "showIcon": false,
                "title": "标题",
                "body": {
                    "type": "tpl",
                    "tpl": "${engine}"
                }
            }
        }
    ]
}
```

## popOverEnableOn

可以给列上配置`popOverEnableOn`属性，该属性为[表达式](../../docs/concepts/expression)，通过[表达式](../../docs/concepts/expression)配置当前行是否启动`popOver`功能

```schema: scope="body"
{
    "type": "crud",
    "api": "/api/mock2/sample?waitSeconds=1",
    "columns": [
        {
            "name": "id",
            "label": "ID",
            "popOver": {
                "body": {
                    "type": "tpl",
                    "tpl": "${id}"
                }
            },
            "popOverEnableOn": "this.id == 1"
        },
        {
            "name": "engine",
            "label": "Rendering engine",
            "popOver": {
                "body": {
                    "type": "tpl",
                    "tpl": "${engine}"
                }
            }
        }
    ]
}
```

## 属性列表

- `mode` 可配置成 `popOver`、`dialog` 或者 `drawer`。 默认为 `popOver`。
- `size` 当配置成 `dialog` 或者 `drawer` 的时候有用。
- `position` 配置弹出位置，只有 `popOver` 模式有用，默认是自适应。
  可选参数：

  - `center`
  - `left-top`
  - `right-top`
  - `left-bottom`
  - `right-bottom`

  atX-atY-myX-myY
  即：对齐目标的位置-对齐自己的位置

  - `left-top-right-bottom` 在目标位置的左上角显示。
  - `left-center-right-center` 在目标的左侧显示，垂直对齐。
  - ...

  固定位置

  - `fixed-center`
  - `fixed-left-top`
  - `fixed-right-top`
  - `fixed-left-bottom`
  - `fixed-right-bottom`。

- `offset` 默认 `{top: 0, left: 0}`，如果要来一定的偏移请设置这个。
- `trigger` 触发弹出的条件。可配置为 `click` 或者 `hover`。默认为 `click`。
- `showIcon` 是否显示图标。默认会有个放大形状的图标出现在列里面。如果配置成 false，则触发事件出现在列上就会触发弹出。
- `title` 弹出框的标题。
- `body` 弹出框的内容。
