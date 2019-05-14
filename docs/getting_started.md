---
title: 快速开始
---

为了简化前端开发，amis Renderer 能够直接用配置就能将页面渲染出来。

先来看个简单的例子。

```schema:height="300"
{
    "$schema": "https://houtai.baidu.com/v2/schemas/page.json#",
    "type": "page",
    "title": "这是标题部分",
    "subTitle": "这是子标题",
    "remark": "这是小提示信息",
    "aside": "这是侧边栏部分",
    "body": "这是内容区",
    "toolbar": "这是工具栏部分"
}
```

> PS: 可以通过编辑器实时修改预览

从上面的内容可以看出，一个简单页面框架已经基本出来了，这是 amis 渲染器配置的入口。从 `page` 渲染器开始出发，通过在容器中放置不同的渲染器来配置不同性质的页面。

简单说明以上配置信息。

-   `$schema` 这个字段可以忽略，他是指定当前 JSON 配置是符合指定路径 https://houtai.baidu.com/v2/schemas/page.json 的 JSON SCHEMA 文件描述的。PS: 编辑器就是靠这个描述文件提示的，可以 hover 到字段上看效果。
-   `type` 指定渲染器类型，这里指定的类型为 `page`。 更多渲染器类型可以去[这里面查看](./renderers)。
-   `title` 从 title 开始就是对应的渲染模型上的属性了。这里用来指定标题内容。
-   `subTitle` 副标题.
-   `remark` 标题上面的提示信息
-   `aside` 边栏区域内容
-   `body` 内容区域的内容
-   `toolbar` 工具栏部分的内容

这里有三个配置都是容器类型的。`aside`、`body` 和 `toolbar`。什么是容器类型？容器类型表示，他能够把其他渲染类型放进来。以上的例子为了简单，直接放了个字符串。字符串类型内部是把他当成了 [tpl](./renderers/Tpl.md) 渲染器来处理，在这里也可以通过对象的形式指定，如以下的例子的 body 区域是完全等价的。

```schema:height="100"
{
    "$schema": "https://houtai.baidu.com/v2/schemas/page.json",
    "type": "page",
    "body": {
        "type": "tpl",
        "tpl": "这是内容区"
    }
}
```

容器内可以直接放一个渲染器，也可以放多个，用数组包起来即可如：

```schema:height="130"
{
    "$schema": "https://houtai.baidu.com/v2/schemas/page.json",
    "type": "page",
    "body": [
        {
            "type": "tpl",
            "tpl": "<p>段落1</p>"
        },

        {
            "type": "tpl",
            "tpl": "<p>段落2</p>"
        },

        "<p>段落3</p>"
    ]
}
```

再来看一个表单页面的列子

```schema:height="440"
{
    "$schema": "https://houtai.baidu.com/v2/schemas/page.json#",
    "type": "page",
    "body": {
        "api": "/api/mock2/form/saveForm",
        "type": "form",
        "title": "联系我们",
        "controls": [
            {
                "type": "text",
                "label": "姓名",
                "name": "name"
            },

            {
                "type": "email",
                "label": "邮箱",
                "name": "email",
                "required": true
            },

            {
                "type": "textarea",
                "label": "内容",
                "name": "content",
                "required": true
            }
        ],
        "actions": [
            {
                "label": "发送",
                "type": "submit",
                "primary": true
            }
        ]
    }
}
```

这个例子就是在 body 容器内，放置一个 `form` 类型的渲染，它就成了一个简单的表单提交页面了，controls 中可以决定放哪些表单项目，actions 中可以放置操作按钮。

如果 body 区域放置一个 `crud` 渲染器，它就是列表页面了，再来看个栗子：

```schema:height="600"
{
  "$schema": "https://houtai.baidu.com/v2/schemas/page.json#",
  "type": "page",
  "title": "增删改查示例",
  "toolbar": [
    {
      "type": "button",
      "actionType": "dialog",
      "label": "新增",
      "icon": "fa fa-plus pull-left",
      "primary": true,
      "dialog": {
        "title": "新增",
        "body": {
          "type": "form",
          "name": "sample-edit-form",
          "api": "",
          "controls": [
            {
              "type": "alert",
              "level": "info",
              "body": "因为没有配置 api 接口，不能真正的提交哈！"
            },
            {
              "type": "text",
              "name": "text",
              "label": "文本",
              "required": true
            },
            {
              "type": "divider"
            },
            {
              "type": "image",
              "name": "image",
              "label": "图片",
              "required": true
            },
            {
              "type": "divider"
            },
            {
              "type": "date",
              "name": "date",
              "label": "日期",
              "required": true
            },
            {
              "type": "divider"
            },
            {
              "type": "select",
              "name": "type",
              "label": "选项",
              "options": [
                {
                  "label": "漂亮",
                  "value": "1"
                },
                {
                  "label": "开心",
                  "value": "2"
                },
                {
                  "label": "惊吓",
                  "value": "3"
                },
                {
                  "label": "紧张",
                  "value": "4"
                }
              ]
            }
          ]
        }
      }
    }
  ],
  "body": [
    {
      "type": "crud",
      "api": "/api/mock2/crud/list",
      "defaultParams": {
          "perPage": 5
      },
      "columns": [
        {
          "name": "id",
          "label": "ID",
          "type": "text"
        },
        {
          "name": "text",
          "label": "文本",
          "type": "text"
        },
        {
          "type": "image",
          "label": "图片",
          "multiple": false,
          "name": "image",
          "popOver": {
            "title": "查看大图",
            "body": "<div class=\"w-xxl\"><img class=\"w-full\" src=\"${image}\"/></div>"
          }
        },
        {
          "name": "date",
          "type": "date",
          "label": "日期"
        },
        {
          "name": "type",
          "label": "映射",
          "type": "mapping",
          "map": {
            "1": "<span class='label label-info'>漂亮</span>",
            "2": "<span class='label label-success'>开心</span>",
            "3": "<span class='label label-danger'>惊吓</span>",
            "4": "<span class='label label-warning'>紧张</span>",
            "*": "其他：${type}"
          }
        },
        {
          "type": "container",
          "label": "操作",
          "body": [
            {
              "type": "button",
              "icon": "fa fa-eye",
              "level": "link",
              "actionType": "dialog",
              "tooltip": "查看",
              "dialog": {
                "title": "查看",
                "body": {
                  "type": "form",
                  "controls": [
                    {
                      "type": "static",
                      "name": "id",
                      "label": "ID"
                    },
                    {
                      "type": "divider"
                    },
                    {
                      "type": "static",
                      "name": "text",
                      "label": "文本"
                    },
                    {
                      "type": "divider"
                    },
                    {
                      "type": "static-image",
                      "label": "图片",
                      "name": "image",
                      "popOver": {
                        "title": "查看大图",
                        "body": "<div class=\"w-xxl\"><img class=\"w-full\" src=\"${image}\"/></div>"
                      }
                    },
                    {
                      "type": "divider"
                    },
                    {
                      "name": "date",
                      "type": "static-date",
                      "label": "日期"
                    },
                    {
                      "type": "divider"
                    },
                    {
                      "name": "type",
                      "label": "映射",
                      "type": "static-mapping",
                      "map": {
                        "1": "<span class='label label-info'>漂亮</span>",
                        "2": "<span class='label label-success'>开心</span>",
                        "3": "<span class='label label-danger'>惊吓</span>",
                        "4": "<span class='label label-warning'>紧张</span>",
                        "*": "其他：${type}"
                      }
                    }
                  ]
                }
              }
            },
            {
              "type": "button",
              "icon": "fa fa-pencil",
              "tooltip": "编辑",
              "level": "link",
              "actionType": "drawer",
              "drawer": {
                "position": "left",
                "size": "lg",
                "title": "编辑",
                "body": {
                  "type": "form",
                  "name": "sample-edit-form",
                  "controls": [
                    {
                      "type": "alert",
                      "level": "info",
                      "body": "因为没有配置 api 接口，不能真正的提交哈！"
                    },
                    {
                      "type": "hidden",
                      "name": "id"
                    },
                    {
                      "type": "text",
                      "name": "text",
                      "label": "文本",
                      "required": true
                    },
                    {
                      "type": "divider"
                    },
                    {
                      "type": "image",
                      "name": "image",
                      "multiple": false,
                      "label": "图片",
                      "required": true
                    },
                    {
                      "type": "divider"
                    },
                    {
                      "type": "date",
                      "name": "date",
                      "label": "日期",
                      "required": true
                    },
                    {
                      "type": "divider"
                    },
                    {
                      "type": "select",
                      "name": "type",
                      "label": "选项",
                      "options": [
                        {
                          "label": "漂亮",
                          "value": "1"
                        },
                        {
                          "label": "开心",
                          "value": "2"
                        },
                        {
                          "label": "惊吓",
                          "value": "3"
                        },
                        {
                          "label": "漂亮",
                          "value": "紧张"
                        }
                      ]
                    }
                  ]
                }
              }
            },
            {
              "type": "button",
              "level": "link",
              "icon": "fa fa-times text-danger",
              "actionType": "ajax",
              "tooltip": "删除",
              "confirmText": "您确认要删除?",
              "api": ""
            }
          ]
        }
      ]
    }
  ]
}
```

这个栗子最主要的渲染器就是 CRUD 渲染器了，他的作用是配置了个 API，把数据拉取过来后，根据配置 columns 信息完成列表展示，列类型可以是静态文本、图片、映射或者日期等等。 `columns` 通过 `name` 与行数据关联。除了展示外还可以放置操作按钮。

这里相对复杂一点配置就是按钮了，按钮主要是通过 `actionType`来决定用户点下的行为。可以配置成 弹框、发送 ajax、页面跳转、复制内容到剪切板、刷新目标组件等等。具体请参考：[Action 渲染器说明](./renderers/Action.md)

更多用法请参考[渲染器手册](./renderers)和示例。
