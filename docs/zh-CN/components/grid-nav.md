---
title: GridNav 宫格导航
description:
type: 0
group: ⚙ 组件
menuName: GridNav 宫格导航
icon:
order: 54
---

宫格菜单导航，不支持配置初始化接口初始化数据域，所以需要搭配类似像`Service`、`Form`或`CRUD`这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过`source`属性，获取数据链中的数据，完成菜单展示。

## 基本用法

通过 source 关联上下文数据，或者通过 name 关联。

```schema
{
    "type": "page",
    "data": {
        "items": [
          {
            "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
            "text": "导航1"
          },
          {
            "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
            "text": "导航2"
          },
          {
            "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
            "text": "导航3"
          },
          {
            "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
            "text": "导航4"
          }
        ]
    },
    "body": [
        {
            "type": "grid-nav",
            "source": "${items}"
        },
        {
            "type": "divider"
        },
        {
            "type": "grid-nav",
            "name": "items"
        }
    ]
}
```

也可以静态展示，即不关联数据固定显示。

```schema
{
    "type": "page",
    "body": {
        "type": "grid-nav",
        "options": [
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航1"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航2"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航3"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航4"
            }
        ]
    }
}
```

## 自定义列数

默认一行展示四个格子，可以通过 `columnNum` 自定义列数

```schema
{
    "type": "page",
    "data": {
        "items": [
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航1"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航2"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航3"
            }
        ]
    },
    "body": {
        "type": "grid-nav",
        "columnNum": 3,
        "source": "${items}"
    }
}
```

## 正方形格子

设置 `square` 属性后，格子的高度会和宽度保持一致。

```schema
{
    "type": "page",
    "data": {
        "items": [
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航1"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航2"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航3"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航4"
            }
        ]
    },
    "body": {
        "type": "grid-nav",
        "source": "${items}",
        "square": true
    }
}
```

## 格子间距

通过 `gutter` 属性设置格子之间的距离。

```schema
{
    "type": "page",
    "data": {
        "items": [
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航1"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航2"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航3"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航4"
            }
        ]
    },
    "body": {
        "type": "grid-nav",
        "source": "${items}",
        "gutter": 20
    }
}
```

## 内容横排

将 `direction` 属性设置为 `horizontal`，可以让宫格的内容呈横向排列。

```schema
{
    "type": "page",
    "data": {
        "items": [
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航1"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航2"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航3"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航4"
            }
        ]
    },
    "body": {
        "type": "grid-nav",
        "direction": "horizontal",
        "source": "${items}"
    }
}
```

## 图标占比

设置 `iconRatio` 可以控制图标宽度占比，默认 60%，设置 1-100 的数字。

```schema
{
    "type": "page",
    "data": {
        "items": [
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航1"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航2"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航3"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航4"
            }
        ]
    },
    "body": {
        "type": "grid-nav",
        "iconRatio": "40",
        "source": "${items}"
    }
}
```

## 角标提示

设置 badge 属性后，会在图标右上角展示相应的角标，支持红点、数字、彩带模式。

```schema
{
    "type": "page",
    "data": {
        "items": [
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航1",
                "badge": {
                    "mode": "text",
                    "text": "10"
                }
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航2",
                "badge": {
                    "mode": "dot"
                }
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航3",
                "badge": {
                    "mode": "ribbon",
                    "text": "热销"
                }
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航4"
            }
        ]
    },
    "body": {
        "type": "grid-nav",
        "source": "${items}",
        "border": false
    }
}
```

## 点击交互

设置 clickAction 属性支持通用点击交互，详见 [Action](./action) 配置

```schema
{
    "type": "page",
    "data": {
        "items": [
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "外部跳转",
                "link": "https://www.baidu.com",
                "blank": true
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "弹框",
                "clickAction": {
                    "actionType": "dialog",
                    "dialog": {
                        "title": "弹框",
                        "body": "这是个简单的弹框。"
                    }
                }
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "内部跳转",
                "link": "/docs/index"
            },
            {
                "icon": "https://internal-amis-res.cdn.bcebos.com/images/icon-1.png",
                "text": "导航4"
            }
        ]
    },
    "body": {
        "type": "grid-nav",
        "source": "${items}",
        "border": false
    }
}
```

## 属性表

| 属性名              | 类型            | 默认值     | 说明                                                     |
| ------------------- | --------------- | ---------- | -------------------------------------------------------- |
| type                | `string`        | `grid-nav` |                                                          |
| className           | `string`        |            | 外层 CSS 类名                                            |
| itemClassName       | `string`        |            | 列表项 css 类名                                          |
| value               | `Array<object>` |            | 图片数组                                                 |
| source              | `string`        |            | 数据源                                                   |
| square              | `boolean`       |            | 是否将列表项固定为正方形                                 |
| center              | `boolean`       | `true`     | 是否将列表项内容居中显示                                 |
| border              | `boolean`       | `true`     | 是否显示列表项边框                                       |
| gutter              | `number`        |            | 列表项之间的间距，默认单位为`px`                         |
| reverse             | `boolean`       |            | 是否调换图标和文本的位置                                 |
| iconRatio           | `number`        | 60         | 图标宽度占比，单位%                                      |
| direction           | `string`        | `vertical` | 列表项内容排列的方向，可选值为 `horizontal` 、`vertical` |
| columnNum           | `number`        | 4          | 列数                                                     |
| options.icon        | `string`        |            | 列表项图标                                               |
| options.text        | `string`        |            | 列表项文案                                               |
| options.badge       | `BadgeSchema`   |            | 列表项角标，详见 [Badge](./badge)                        |
| options.link        | `string`        |            | 内部页面路径或外部跳转 URL 地址，优先级高于 clickAction  |
| options.blank       | `boolean`       |            | 是否新页面打开，link 为 url 时有效                       |
| options.clickAction | `ActionSchema`  |            | 列表项点击交互 详见 [Action](./action)                   |

```

```
