---
title: Card 卡片
description:
type: 0
group: ⚙ 组件
menuName: Card 卡片
icon:
order: 31
---

## 基本用法

```schema: scope="body"
{
    "type": "card",
    "header": {
        "title": "标题",
        "subTitle": "副标题",
        "description": "这是一段描述",
        "avatarClassName": "pull-left thumb-md avatar b-3x m-r",
        "avatar": "data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg t='1631083237695' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2420' xmlns:xlink='http://www.w3.org/1999/xlink' width='1024' height='1024'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%3C/style%3E%3C/defs%3E%3Cpath d='M959.872 128c0.032 0.032 0.096 0.064 0.128 0.128v767.776c-0.032 0.032-0.064 0.096-0.128 0.128H64.096c-0.032-0.032-0.096-0.064-0.128-0.128V128.128c0.032-0.032 0.064-0.096 0.128-0.128h895.776zM960 64H64C28.8 64 0 92.8 0 128v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z' p-id='2421' fill='%23bfbfbf'%3E%3C/path%3E%3Cpath d='M832 288c0 53.024-42.976 96-96 96s-96-42.976-96-96 42.976-96 96-96 96 42.976 96 96zM896 832H128V704l224-384 256 320h64l224-192z' p-id='2422' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E"
    },
    "body": [
      {
        "type": "divider"
      },
      {
        "type": "tpl",
        "tpl": "Trident",
        "inline": false,
        "label": "Engine"
      },
      {
        "name": "static",
        "type": "static",
        "label": "Browser",
        "value": "Internet Explorer 5.0"
      },
      {
        "type": "input-number",
        "name": "version",
        "label": "Version",
        "size": "sm"
      }
    ],
    "actions": [
        {
            "type": "button",
            "label": "编辑",
            "actionType": "dialog",
            "icon": "fa fa-pencil",
            "dialog": {
              "title": "编辑",
              "body": "你正在编辑该卡片"
            }
        },
        {
          "type": "button",
          "label": "删除",
          "icon": "fa fa-trash",
          "actionType": "dialog",
          "dialog": {
            "title": "提示",
            "body": "你删掉了该卡片"
          }
        }
    ]
}
```

## 打开链接

> 1.4.0 及以上版本

通过 `href` 属性可以设置点击卡片打开外部链接

```schema: scope="body"
{
    "type": "card",
    "href": "https://github.com/baidu/amis",
    "header": {
        "title": "标题",
        "subTitle": "副标题",
        "description": "这是一段描述",
        "avatarClassName": "pull-left thumb-md avatar b-3x m-r",
        "avatar": "data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg t='1631083237695' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2420' xmlns:xlink='http://www.w3.org/1999/xlink' width='1024' height='1024'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%3C/style%3E%3C/defs%3E%3Cpath d='M959.872 128c0.032 0.032 0.096 0.064 0.128 0.128v767.776c-0.032 0.032-0.064 0.096-0.128 0.128H64.096c-0.032-0.032-0.096-0.064-0.128-0.128V128.128c0.032-0.032 0.064-0.096 0.128-0.128h895.776zM960 64H64C28.8 64 0 92.8 0 128v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z' p-id='2421' fill='%23bfbfbf'%3E%3C/path%3E%3Cpath d='M832 288c0 53.024-42.976 96-96 96s-96-42.976-96-96 42.976-96 96-96 96 42.976 96 96zM896 832H128V704l224-384 256 320h64l224-192z' p-id='2422' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E"
    },
    "useCardLabel": false,
    "body": [
      {
        "type": "divider"
      },
      {
        "type": "tpl",
        "tpl": "Trident",
        "inline": false,
        "label": "Engine"
      },
      {
        "name": "static",
        "type": "static",
        "label": "Browser",
        "value": "Internet Explorer 5.0",
        "mode": "horizontal"
      },
      {
        "type": "input-number",
        "name": "version",
        "label": "Version",
        "size": "sm",
        "mode": "horizontal"
      }
    ],
    "actions": [
        {
            "type": "button",
            "label": "编辑",
            "actionType": "dialog",
            "dialog": {
              "title": "编辑",
              "body": "你正在编辑该卡片"
            }
        },
        {
          "type": "button",
          "label": "删除",
          "actionType": "dialog",
          "dialog": {
            "title": "提示",
            "body": "你删掉了该卡片"
          }
        }
    ]
}
```

## 设置头像文本

如果没有 avatar，还可以通过 `avatarText` 设置头像文本

```schema: scope="body"
{
    "type": "card",
    "href": "https://github.com/baidu/amis",
    "header": {
        "title": "标题",
        "subTitle": "副标题",
        "description": "这是一段描述",
        "avatarText": "AMIS"
    },
    "body": "这里是内容"
}
```

> 1.5.0 及以上版本

可以设置文本背景色，它会根据数据分配一个颜色，主要配合 `cards` 使用

```schema
{
  "type": "page",
  "data": {
    "items": [
      {
        "engine": "Trident",
        "browser": "Internet Explorer 4.0"
      },
      {
        "engine": "Chrome",
        "browser": "Chrome 44"
      },
      {
        "engine": "Gecko",
        "browser": "Firefox 1.0"
      },
      {
        "engine": "Presto",
        "browser": "Opera 10"
      },
      {
        "engine": "Webkie",
        "browser": "Safari 12"
      }
    ]
  },
  "body": {
    "type": "cards",
    "source": "$items",
    "card": {
      "header": {
        "avatarText": "${engine|substring:0:2|upperCase}",
        "avatarTextBackground": ["#FFB900", "#D83B01", "#B50E0E", "#E81123", "#B4009E", "#5C2D91", "#0078D7", "#00B4FF", "#008272"]
      },
      "body": [
        {
          "label": "Browser",
          "name": "browser"
        }
      ]
    }
  }
}
```

## 点击卡片的行为

> 1.4.0 及以上版本

通过设置 `itemAction` 可以设置整个卡片的点击行为

```schema: scope="body"
{
    "type": "card",
    "itemAction": {
      "type": "button",
      "actionType": "dialog",
      "dialog": {
        "title": "详情",
        "body": "当前描述"
      }
    },
    "header": {
        "title": "标题",
        "subTitle": "副标题",
        "description": "这是一段描述",
        "avatarClassName": "pull-left thumb-md avatar b-3x m-r",
        "avatar": "data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg t='1631083237695' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2420' xmlns:xlink='http://www.w3.org/1999/xlink' width='1024' height='1024'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%3C/style%3E%3C/defs%3E%3Cpath d='M959.872 128c0.032 0.032 0.096 0.064 0.128 0.128v767.776c-0.032 0.032-0.064 0.096-0.128 0.128H64.096c-0.032-0.032-0.096-0.064-0.128-0.128V128.128c0.032-0.032 0.064-0.096 0.128-0.128h895.776zM960 64H64C28.8 64 0 92.8 0 128v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z' p-id='2421' fill='%23bfbfbf'%3E%3C/path%3E%3Cpath d='M832 288c0 53.024-42.976 96-96 96s-96-42.976-96-96 42.976-96 96-96 96 42.976 96 96zM896 832H128V704l224-384 256 320h64l224-192z' p-id='2422' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E"
    },
    "body": "这里是内容"
}
```

注意它和前面的 `href` 配置冲突，如果设置了 `href` 这个将不会生效

## 设置多媒体卡片

> 1.5.0 及以上版本

通过设置 `media` 可以设置为多媒体卡片, 通过 `mediaPosition` 可以设置多媒体位置

```schema: scope="body"
{
    "type": "card",
    "header": {
      "title": "标题"
    },
    "media": {
      "type": "image",
      "className": "w-36 h-24",
      "url": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
      "position": "left"
    },
    "body": "这里是内容",
    "secondary": "次要说明",
    "actions": [
      {
        "type": "button",
        "label": "操作",
        "actionType": "dialog",
        "className": "mr-4",
        "dialog": {
          "title": "操作",
          "body": "你正在编辑该卡片"
        }
      },
      {
        "type": "button",
        "label": "操作",
        "actionType": "dialog",
        "className": "mr-2.5",
        "dialog": {
          "title": "操作",
          "body": "你正在编辑该卡片"
        }
      },
      {
        "type": "dropdown-button",
        "level": "link",
        "icon": "fa fa-ellipsis-h",
        "className": "pr-1 flex",
        "hideCaret": true,
        "buttons": [
          {
            "type": "button",
            "label": "编辑",
            "actionType": "dialog",
            "dialog": {
              "title": "编辑",
              "body": "你正在编辑该卡片"
            }
          },
          {
            "type": "button",
            "label": "删除",
            "actionType": "dialog",
            "dialog": {
              "title": "提示",
              "body": "你删掉了该卡片"
            }
          }
        ]
      }
    ],
    "toolbar": [
      {
        "type": "tpl",
        "tpl": "标签",
        "className": "label label-warning"
      }
    ]
}
```

## 设置标签卡片

> 1.5.0 及以上版本

```schema: scope="body"
{
    "type": "card",
    "header": {
      "title": "标题"
    },
    "body": "这里是内容这里是内容这里是内容这里是内容这里是内容这里是内容这里是内容这里是内容这里是内容这里是内容这里是内容这里是内容这里是内容",
    "secondary": "次要说明",
    "actions": [
      {
        "type": "button",
        "label": "操作",
        "actionType": "dialog",
        "className": "mr-4",
        "dialog": {
          "title": "操作",
          "body": "你正在编辑该卡片"
        }
      },
      {
        "type": "button",
        "label": "操作",
        "actionType": "dialog",
        "className": "mr-2.5",
        "dialog": {
          "title": "操作",
          "body": "你正在编辑该卡片"
        }
      },
      {
        "type": "dropdown-button",
        "level": "link",
        "icon": "fa fa-ellipsis-h",
        "className": "pr-1 flex",
        "hideCaret": true,
        "buttons": [
          {
            "type": "button",
            "label": "编辑",
            "actionType": "dialog",
            "dialog": {
              "title": "编辑",
              "body": "你正在编辑该卡片"
            }
          },
          {
            "type": "button",
            "label": "删除",
            "actionType": "dialog",
            "dialog": {
              "title": "提示",
              "body": "你删掉了该卡片"
            }
          }
        ]
      }
    ],
    "toolbar": [
      {
        "type": "tpl",
        "tpl": "标签",
        "className": "label label-warning"
      }
    ]
}
```

## 设置按钮卡片

> 1.5.0 及以上版本

按钮卡片一般以卡片形式展示当前卡片的执行语义，例如：创建卡片、添加卡片等场景。

```schema: scope="body"
{
  "type": "card",
  "className": "hover:shadow",
  "body": {
    "type": "wrapper",
    "className": "h-32 flex items-center justify-center",
    "body": [
      {
        "type": "wrapper",
        "size": "none",
        "className": "text-center",
        "body": {
          "type": "icon",
          "icon": "plus",
          "className": "text-2xl",
        }
      },
      {
        "type": "wrapper",
        "size": "none",
        "body": "点击会有弹框"
      }
    ]
  },
  "itemAction": {
    "type": "button",
    "actionType": "dialog",
    "dialog": {
      "title": "详情",
      "body": "当前描述"
    }
  }
}
```

## 设置文本卡片

> 1.5.0 及以上版本

```schema: scope="body"
{
  "type": "card",
  "header": {
    "className": "items-center",
    "title": "卡片标题"
  },
  "body": {
    "type": "wrapper",
    "size": "none",
    "body": {
      "type": "tabs",
      "tabs": [
        {
          "title": "标签1",
          "className": "p-0",
          "tab": [
            {
              "type": "card",
              "className": "border-0",
              "header": {
                "className": "p-0 pb-2",
                "title": "内容标题"
              },
              "body": "卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容",
              "bodyClassName": "p-0"
            },
            {
              "type": "card",
              "className": "border-0",
              "header": {
                "className": "p-0 pb-2",
                "title": "内容标题"
              },
              "body": "卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容",
              "bodyClassName": "p-0"
            }
          ]
        },
        {
          "title": "标签2",
          "className": "p-0",
          "tab": "卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容卡片内容"
        }
      ]
    }
  },
  "toolbar": [
    {
      "type": "button",
      "label": "操作",
      "actionType": "dialog",
      "dialog": {
        "title": "操作",
        "body": "你正在编辑该卡片"
      }
    }
  ]
}
```

## 设置单元格卡片

> 1.5.0 及以上版本

```schema: scope="body"
{
  "type": "card",
  "body": [
    {
      "type": "wrapper",
      "size": "none",
      "body": {
        "type": "wrapper",
        "size": "none",
        "style": {
          "display": "flex",
          "align-items": "center",
          "justify-content": "space-between",
          "margin-bottom": "4px"
        },
        "body": [
          {
            "type": "wrapper",
            "size": "none",
            "style": {
              "flex": "1",
              "overflow": "hidden",
              "white-space": "nowrap",
              "text-overflow": "ellipsis"
            },
            "body": "单元格"
          },
          {
            "type": "wrapper",
            "size": "none",
            "style": {
              "color": "#999"
            },
            "body": "内容"
          }
        ]
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "wrapper",
      "size": "none",
      "body": [
        {
          "type": "wrapper",
          "size": "none",
          "style": {
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "space-between",
            "marginBottom": "4px"
          },
          "body": [
            {
              "type": "wrapper",
              "size": "none",
              "style": {
                "flex": "1",
                "overflow": "hidden",
                "whiteSpace": "nowrap",
                "textOverflow": "ellipsis"
              },
              "body": "单元格"
            },
            {
              "type": "wrapper",
              "size": "none",
              "style": {
                "color": "#999"
              },
              "body": "内容"
            }
          ]
        },
        {
          "type": "wrapper",
          "size": "none",
          "style": {
            "color": "#999",
            "fontSize": "12px"
          },
          "body": "描述信息"
        }
      ]
    }
  ]
}
```

## 配置工具栏

> 1.5.0 及以上版本

```schema: scope="body"
{
    "type": "card",
    "header": {
        "title": "标题",
        "subTitle": "副标题",
        "description": "这是一段描述",
        "avatarClassName": "pull-left thumb-md avatar b-3x m-r",
        "avatar": "data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg t='1631083237695' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2420' xmlns:xlink='http://www.w3.org/1999/xlink' width='1024' height='1024'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%3C/style%3E%3C/defs%3E%3Cpath d='M959.872 128c0.032 0.032 0.096 0.064 0.128 0.128v767.776c-0.032 0.032-0.064 0.096-0.128 0.128H64.096c-0.032-0.032-0.096-0.064-0.128-0.128V128.128c0.032-0.032 0.064-0.096 0.128-0.128h895.776zM960 64H64C28.8 64 0 92.8 0 128v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z' p-id='2421' fill='%23bfbfbf'%3E%3C/path%3E%3Cpath d='M832 288c0 53.024-42.976 96-96 96s-96-42.976-96-96 42.976-96 96-96 96 42.976 96 96zM896 832H128V704l224-384 256 320h64l224-192z' p-id='2422' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E"
    },
    "body": "这里是内容",
    "toolbar": [
      {
        "type": "button",
        "icon": "fa fa-eye",
        "actionType": "dialog",
        "dialog": {
          "title": "查看",
          "body": {
            "type": "form",
            "body": [
              {
                "type": "static",
                "name": "engine",
                "label": "Engine"
              },
              {
                "type": "divider"
              },
              {
                "type": "static",
                "name": "browser",
                "label": "Browser"
              },
              {
                "type": "divider"
              },
              {
                "type": "static",
                "name": "platform",
                "label": "Platform(s)"
              },
              {
                "type": "divider"
              },
              {
                "type": "static",
                "name": "version",
                "label": "Engine version"
              },
              {
                "type": "divider"
              },
              {
                "type": "static",
                "name": "grade",
                "label": "CSS grade"
              },
              {
                "type": "divider"
              },
              {
                "type": "html",
                "html": "<p>添加其他 <span>Html 片段</span> 需要支持变量替换（todo）.</p>"
              }
            ]
          }
        }
      },
      {
        "type": "dropdown-button",
        "level": "link",
        "icon": "fa fa-ellipsis-h",
        "hideCaret": true,
        "buttons": [
          {
              "type": "button",
              "label": "编辑",
              "actionType": "dialog",
              "dialog": {
                "title": "编辑",
                "body": "你正在编辑该卡片"
              }
          },
          {
            "type": "button",
            "label": "删除",
            "actionType": "dialog",
            "dialog": {
              "title": "提示",
              "body": "你删掉了该卡片"
            }
          }
        ]
      }
    ]
}
```

## 属性表

| 属性名                        | 类型                                 | 默认值                              | 说明                                              |
| ----------------------------- | ------------------------------------ | ----------------------------------- | ------------------------------------------------- |
| type                          | `string`                             | `"card"`                            | 指定为 Card 渲染器                                |
| className                     | `string`                             |                                     | 外层 Dom 的类名                                   |
| href                          | [模板](../../docs/concepts/template) |                                     | 外部链接                                          |
| header                        | `Object`                             |                                     | Card 头部内容设置                                 |
| header.className              | `string`                             |                                     | 头部类名                                          |
| header.title                  | [模板](../../docs/concepts/template) |                                     | 标题                                              |
| header.titleClassName         | `string`                             |                                     | 标题类名                                          |
| header.subTitle               | [模板](../../docs/concepts/template) |                                     | 副标题                                            |
| header.subTitleClassName      | `string`                             |                                     | 副标题类名                                        |
| header.subTitlePlaceholder    | `string`                             |                                     | 副标题占位                                        |
| header.description            | [模板](../../docs/concepts/template) |                                     | 描述                                              |
| header.descriptionClassName   | `string`                             |                                     | 描述类名                                          |
| header.descriptionPlaceholder | `string`                             |                                     | 描述占位                                          |
| header.avatar                 | [模板](../../docs/concepts/template) |                                     | 图片                                              |
| header.avatarClassName        | `string`                             | `"pull-left thumb avatar b-3x m-r"` | 图片包括层类名                                    |
| header.imageClassName         | `string`                             |                                     | 图片类名                                          |
| header.avatarText             | [模板](../../docs/concepts/template) |                                     | 如果不配置图片，则会在图片处显示该文本            |
| header.avatarTextBackground   | `Array`                              |                                     | 设置文本背景色，它会根据数据分配一个颜色          |
| header.avatarTextClassName    | `string`                             |                                     | 图片文本类名                                      |
| header.highlight              | `boolean`                            | `false`                             | 是否显示激活样式                                  |
| header.highlightClassName     | `string`                             |                                     | 激活样式类名                                      |
| header.href                   | [模板](../../docs/concepts/template) |                                     | 点击卡片跳转的链接地址                            |
| header.blank                  | `boolean`                            | `true`                              | 是否新窗口打开                                    |
| body                          | `Array`                              |                                     | 内容容器，主要用来放置非表单项组件                |
| bodyClassName                 | `string`                             |                                     | 内容区域类名                                      |
| actions                       | Array<[Action](./action)>            |                                     | 配置按钮集合                                      |
| actionsCount                  | `number`                             | `4`                                 | 按钮集合每行个数                                  |
| itemAction                    | [Action](./action)                   |                                     | 点击卡片的行为                                    |
| media                         | `Object`                             |                                     | Card 多媒体部内容设置                             |
| media.type                    | `'image'\|'video'`                   |                                     | 多媒体类型                                        |
| media.url                     | `string`                             |                                     | 图片/视频链接                                     |
| media.position                | `'left'\|'right'\|'top'\|'bottom'`   | `'left'`                            | 多媒体位置                                        |
| media.className               | `string`                             | `"w-44 h-28"`                       | 多媒体类名                                        |
| media.isLive                  | `boolean`                            | `false`                             | 视频是否为直播                                    |
| media.autoPlay                | `boolean`                            | `false`                             | 视频是否自动播放                                  |
| media.poster                  | `string`                             | `false`                             | 视频封面                                          |
| secondary                     | [模板](../../docs/concepts/template) |                                     | 次要说明                                          |
| toolbar                       | Array<[Action](./action)>            |                                     | 工具栏按钮                                        |
| dragging                      | `boolean`                            | `false`                             | 是否显示拖拽图标                                  |
| selectable                    | `boolean`                            | `false`                             | 卡片是否可选                                      |
| checkable                     | `boolean`                            | `true`                              | 卡片选择按钮是否禁用                              |
| selected                      | `boolean`                            | `false`                             | 卡片选择按钮是否选中                              |
| hideCheckToggler              | `boolean`                            | `false`                             | 卡片选择按钮是否隐藏                              |
| multiple                      | `boolean`                            | `false`                             | 卡片是否为多选                                    |
| useCardLabel                  | `boolean`                            | `true`                              | 卡片内容区的表单项 label 是否使用 Card 内部的样式 |
