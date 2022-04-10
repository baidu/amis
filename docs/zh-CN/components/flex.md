---
title: Flex 布局
description:
type: 0
group: ⚙ 组件
menuName: Flex 布局
icon:
order: 47
---

Flex 布局是基于 CSS Flex 实现的布局效果，它比 Grid 和 HBox 对子节点位置的可控性更强，比用 CSS 类的方式更易用，并且默认使用水平垂直居中的对齐。

## 基本用法

```schema: scope="body"
{
  "type": "flex",
  "items": [{
      "style": {
          "backgroundColor": "#1A5CFF",
          "width": 100,
          "height": 50,
          "margin": 5
      },
      "type": "tpl",
      "tpl": ""
  }, {
      "style": {
          "backgroundColor": "#46C93A",
          "width": 100,
          "height": 50,
          "margin": 5
      },
      "type": "tpl",
      "tpl": ""
  }, {
      "style": {
          "backgroundColor": "#FF4757",
          "width": 100,
          "height": 50,
          "margin": 5
      },
      "type": "tpl",
      "tpl": ""
  }]
}
```

其中 `items` 里的每一个都可以是其他 amis 类型。

## 子节点水平分布

> 严格来说并不一定是水平，因为还能通过 direction 修改方向，不过这里为了简化就这么称呼了

可以通过 justify 控制水平分布方式，默认是 `center` 居中，其他几种的示例如下：

```schema
{
    "type": "page",
    "body": [
        "center",
        {
            "type": "flex",
            "justify": "center",
            "items": [{
                "style": {
                    "backgroundColor": "#1A5CFF",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#46C93A",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#FF4757",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }]
        },
        "flex-start",
        {
            "type": "flex",
            "justify": "flex-start",
            "items": [{
                "style": {
                    "backgroundColor": "#1A5CFF",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#46C93A",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#FF4757",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }]
        },
        "flex-end",
        {
            "type": "flex",
            "justify": "flex-end",
            "items": [{
                "style": {
                    "backgroundColor": "#1A5CFF",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#46C93A",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#FF4757",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }]
        },
        "space-around",
        {
            "type": "flex",
            "justify": "space-around",
            "items": [{
                "style": {
                    "backgroundColor": "#1A5CFF",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "width": 100,
                "height": 30,
                "style": {
                    "backgroundColor": "#46C93A",
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#FF4757",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }]
        },
        "space-between",
        {
            "type": "flex",
            "justify": "space-between",
            "items": [{
                "style": {
                    "backgroundColor": "#1A5CFF",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#46C93A",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#FF4757",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }]
        },
        "space-evenly",
        {
            "type": "flex",
            "justify": "space-evenly",
            "items": [{
                "style": {
                    "backgroundColor": "#1A5CFF",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#46C93A",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#FF4757",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }]
        }
    ]
}
```

## 垂直方向位置

可以通过设置 `alignItems` 改变在子节点在垂直方向的位置，默认是 `center` 居中，其他几个常见设置请参考：

```schema: scope="body"
{
    "type": "page",
    "body": [
        "center",
        {
            "type": "flex",
            "alignItems": "center",
            "style": {
                "height": 60,
                "backgroundColor": "#fff"
            },
            "items": [{
                "style": {
                    "backgroundColor": "#1A5CFF",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#46C93A",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#FF4757",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }]
        },
        {
            "type": "divider"
        },
        "flex-start",
        {
            "type": "flex",
            "alignItems": "flex-start",
            "style": {
                "height": 60,
                "backgroundColor": "#fff"
            },
            "items": [{
                "style": {
                    "backgroundColor": "#1A5CFF",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#46C93A",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#FF4757",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }]
        },
        {
            "type": "divider"
        },
        "flex-end",
        {
            "type": "flex",
            "alignItems": "flex-end",
            "style": {
                "height": 60,
                "backgroundColor": "#fff"
            },
            "items": [{
                "style": {
                    "backgroundColor": "#1A5CFF",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#46C93A",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#FF4757",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }]
        }
    ]
}
```

## 布局方向

默认是行的方式，可以通过 "direction": "column" 改成列的方式。

```schema: scope="body"
{
    "type": "page",
    "body": [
        "direction: row",
        {
            "type": "flex",
            "items": [{
                "style": {
                    "backgroundColor": "#1A5CFF",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#46C93A",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#FF4757",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }]
        },
        "direction: column",
        {
            "type": "flex",
            "direction": "column",
            "items": [{
                "style": {
                    "backgroundColor": "#1A5CFF",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#46C93A",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }, {
                "style": {
                    "backgroundColor": "#FF4757",
                    "width": 100,
                    "height": 30,
                    "margin": 5
                },
                "type": "tpl",
                "tpl": ""
            }]
        }
    ]
}
```

## 移动端支持

有时候希望在移动端有不同展现，比如将 `direction` 改成 `column`：

```schema: scope="body"
{
  "type": "flex",
  "mobile": {
    "direction": "column"
  },
  "items": [{
      "style": {
          "backgroundColor": "#1A5CFF",
          "width": 100,
          "height": 50,
          "margin": 5
      },
      "type": "tpl",
      "tpl": ""
  }, {
      "style": {
          "backgroundColor": "#46C93A",
          "width": 100,
          "height": 50,
          "margin": 5
      },
      "type": "tpl",
      "tpl": ""
  }, {
      "style": {
          "backgroundColor": "#FF4757",
          "width": 100,
          "height": 50,
          "margin": 5
      },
      "type": "tpl",
      "tpl": ""
  }]
}
```

其他关于移动端定制的细节请参考[这里](../docs/extend/mobile)。

## 属性表

| 属性名     | 类型                                   | 默认值 | 说明                                                                                                |
| ---------- | -------------------------------------- | ------ | --------------------------------------------------------------------------------------------------- |
| type       | `string`                               | `flex` | 指定为 Flex 渲染器                                                                                  |
| className  | `string`                               |        | css 类名                                                                                            |
| justify    | `string`                               |        | "start", "flex-start", "center", "end", "flex-end", "space-around", "space-between", "space-evenly" |
| alignItems | `string`                               |        | "stretch", "start", "flex-start", "flex-end", "end", "center", "baseline"                           |
| style      | `object`                               |        | 自定义样式                                                                                          |
| items[]    | [SchemaNode](../docs/types/schemanode) |        |
