---
title: Dialog 对话框
description:
type: 0
group: ⚙ 组件
menuName: Dialog 对话框
icon:
order: 41
---

Dialog 弹框 主要由 [Action](./action) 触发，主要展示一个对话框以供用户操作。

## 基本用法

```schema: scope="body"
{
    "label": "点击弹框",
    "type": "button",
    "actionType": "dialog",
    "dialog": {
      "title": "弹框标题",
      "body": "这是一个弹框"
    }
}
```

## 配置尺寸

```schema: scope="body"
{
    "type": "button-toolbar",
    "buttons": [
        {
            "type": "button",
            "label": "较小的弹框",
            "actionType": "dialog",
            "dialog": {
                "size": "sm",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "标准弹框",
            "actionType": "dialog",
            "dialog": {
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "较大的弹框",
            "actionType": "dialog",
            "dialog": {
                "size": "lg",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "很大的弹框",
            "actionType": "dialog",
            "dialog": {
                "size": "xl",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "占满屏幕的弹框",
            "actionType": "dialog",
            "dialog": {
                "size": "full",
                "title": "全屏弹框",
                "body": "弹框尽可能占满，内容部分滚动。"
            }
        }
    ]
}
```

## 弹框与数据映射

默认弹框内由于数据链的存在，会自动映射父级同名变量，例如下例：

```schema: scope="body"
{
  "type": "crud",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample",
  "draggable": true,
  "columns": [
    {
      "name": "id",
      "label": "ID"
    },
    {
      "name": "engine",
      "label": "Rendering engine"
    },
    {
      "name": "browser",
      "label": "Browser"
    },
    {
      "name": "platform",
      "label": "Platform(s)"
    },
    {
      "name": "version",
      "label": "Engine version"
    },
    {
      "name": "grade",
      "label": "CSS grade"
    },
    {
      "type": "button",
      "label": "一个弹框",
      "actionType": "dialog",
      "dialog": {
        "title": "一个弹框",
        "body": [
          {
            "type": "form",
            "api": "/api/sample/$id",
            "controls": [
              {
                "type": "text",
                "name": "engine",
                "label": "Engine"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

上例弹框中的表单项 `Engine` 会自动映射到父级数据中的 `engine` 变量，如果想调整当前特性，如你想调整父级映射变量的字段，可以利用[数据映射](../../docs/concepts/data-mapping)，例如：

```schema: scope="body"
{
  "type": "crud",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample",
  "draggable": true,
  "columns": [
    {
      "name": "id",
      "label": "ID"
    },
    {
      "name": "engine",
      "label": "Rendering engine"
    },
    {
      "name": "browser",
      "label": "Browser"
    },
    {
      "name": "platform",
      "label": "Platform(s)"
    },
    {
      "name": "version",
      "label": "Engine version"
    },
    {
      "name": "grade",
      "label": "CSS grade"
    },
    {
      "type": "button",
      "label": "一个弹框",
      "actionType": "dialog",
      "dialog": {
        "data": {
          "engine2": "${engine}"
        },
        "title": "一个弹框",
        "body": [
          {
            "type": "form",
            "api": "/api/sample/$id",
            "controls": [
              {
                "type": "text",
                "name": "engine2",
                "label": "Engine"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

上例给 `dialog` 中配置 `data` 属性，可以将上层的 `engine` 变量映射为 `engine2`

## 多级弹框

```schema: scope="body"
{
    "type": "button",
    "label": "多级弹框",
    "actionType": "dialog",
    "dialog": {
        "title": "提示",
        "body": "这是个简单的弹框",
        "actions": [
            {
                "type": "button",
                "actionType": "confirm",
                "label": "确认",
                "primary": true
            },
            {
                "type": "button",
                "actionType": "dialog",
                "label": "再弹一个",
                "dialog": {
                    "title": "弹框中的弹框",
                    "body": "如果你想，可以无限弹下去",
                    "actions": [
                        {
                            "type": "button",
                            "actionType": "dialog",
                            "label": "来吧",
                            "level": "info",
                            "dialog": {
                                "title": "弹框中的弹框",
                                "body": "如果你想，可以无限弹下去",
                                "actions": [
                                    {
                                        "type": "button",
                                        "actionType": "confirm",
                                        "label": "不弹了",
                                        "primary": true
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```

## 行为后关闭弹框

在弹框中配置行为按钮，可以在按钮上配置`"close": true`，在行为完成后，关闭当前弹框。

```schema: scope="body"
{
    "type": "button",
    "label": "弹个框",
    "actionType": "dialog",
    "dialog": {
        "title": "弹框",
        "body": [
          {
            "type": "action",
            "label": "默认的 ajax 请求",
            "actionType": "ajax",
            "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=1"
          },
          {
            "type": "action",
            "label": "ajax 请求成功后关闭弹框",
            "actionType": "ajax",
            "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=1",
            "close": true
          }
        ]
    }
}
```

## 配置弹窗的按钮

可以通过设置 `actions` 来控制弹窗中的按钮。

```schema: scope="body"
{
    "type": "button-toolbar",
    "buttons": [
        {
            "type": "button",
            "label": "无按钮",
            "actionType": "dialog",
            "dialog": {
                "title": "提示",
                "actions": [],
                "body": "无按钮的弹框"
            }
        },
        {
            "type": "button",
            "label": "只有一个确认按钮",
            "actionType": "dialog",
            "dialog": {
                "title": "提示",
                "actions": [{
                  "type": "button",
                  "actionType": "confirm",
                  "label": "OK",
                  "primary": true
                }],
                "body": "只有一个 OK 的弹框"
            }
        }
    ]
}
```

## 弹框中配置表单

### 基本使用

```schema: scope="body"
{
    "type": "button",
    "label": "弹个表单",
    "actionType": "dialog",
    "dialog": {
        "title": "在弹框中的表单",
        "body": {
            "type": "form",
            "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
            "controls": [
                {
                    "type": "text",
                    "name": "username",
                    "required": true,
                    "placeholder": "请输入用户名",
                    "label": "用户名"
                },
                {
                    "type": "password",
                    "name": "password",
                    "label": "密码",
                    "required": true,
                    "placeholder": "请输入密码"
                },
                {
                    "type": "checkbox",
                    "name": "rememberMe",
                    "label": "记住登录"
                }
            ]
        }
    }
}
```

### 提交表单 或 ajax 请求

弹框中通过配置`form`或`ajax`行为按钮，可以实现`form`提交和`ajax`请求操作。

```schema: scope="body"
{
    "type": "button",
    "label": "弹个表单",
    "actionType": "dialog",
    "dialog": {
        "title": "在弹框中的表单",
        "actions": [
            {
                "label": "提交表单",
                "actionType": "submit",
                "primary": true,
                "type": "button"
            },
            {
                "label": "ajax请求",
                "actionType": "ajax",
                "primary": true,
                "type": "button",
                "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2"
            }
        ],
        "body": {
            "type": "form",
            "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
            "controls": [
                {
                    "type": "text",
                    "name": "text",
                    "required": true,
                    "label": "用户名",
                    "placeholder": "请输入用户名"
                },
                {
                    "type": "password",
                    "name": "password",
                    "label": "密码",
                    "placeholder": "请输入密码",
                    "required": true
                },
                {
                    "type": "checkbox",
                    "name": "rememberMe",
                    "label": "记住登录"
                }
            ]
        }
    }
}
```

### 提交表单 或 ajax 请求 后不关闭弹框

默认情况下，当弹框中配置了 form 并进行了**提交表单操作（confirm）**或进行了**`ajax`请求**，请求成功后，会自动关闭当前弹框，你可以通过手动设置`"close": true` 来禁止该默认特性。

```schema: scope="body"
{
    "type": "button",
    "label": "弹个表单",
    "actionType": "dialog",
    "dialog": {
        "title": "在弹框中的表单",
        "actions": [
            {
                "label": "提交表单后不关闭",
                "actionType": "submit",
                "close": false,
                "primary": true,
                "type": "button"
            },
            {
                "label": "ajax请求后不关闭",
                "actionType": "ajax",
                "primary": true,
                "type": "button",
                "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2"
            }
        ],
        "body": {
            "type": "form",
            "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
            "controls": [
                {
                    "type": "text",
                    "name": "text",
                    "required": true,
                    "label": "用户名",
                    "placeholder": "请输入用户名"
                },
                {
                    "type": "password",
                    "name": "password",
                    "label": "密码",
                    "required": true,
                    "placeholder": "请输入密码"
                },
                {
                    "type": "checkbox",
                    "name": "rememberMe",
                    "label": "记住登录"
                }
            ]
        }
    }
}
```

## feedback 反馈弹框

feedback 反馈弹框是指，在 ajax 请求后，可以显示一个弹框，进行反馈操作

### 基本使用

```schema: scope="body"
{
    "type": "button",
    "label": "Feedback",
    "actionType": "ajax",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData?waitSeconds=2",
    "tooltip": "点击我后会发送一个请求，请求回来后，弹出一个框。",
    "feedback": {
        "title": "操作成功",
        "body": "xxx 已操作成功"
    }
}
```

### 弹框中配置 feedback

#### 关闭 feedback 弹框时，同时关闭上层弹框

当你在弹框中配置了 feedback，操作之后，你希望关闭当前 feedback 弹框同时，关闭上层的弹框，具体有两种方式

##### 1. 不请求接口，直接关闭

`feedback`的`actions`中配置 `"actionType": "close"` 的按钮

```schema: scope="body"
{
  "type": "button",
  "label": "弹一个框",
  "actionType": "dialog",
  "dialog": {
    "title": "提示",
     "body": {
            "type": "form",
            "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
            "controls": [
                {
                    "type": "text",
                    "name": "text",
                    "required": true,
                    "label": "用户名",
                    "placeholder": "请输入用户名"
                },
                {
                    "type": "password",
                    "name": "password",
                    "label": "密码",
                    "required": true,
                    "placeholder": "请输入密码"
                },
                {
                    "type": "checkbox",
                    "name": "rememberMe",
                    "label": "记住登录"
                }
            ]
        },
    "actions": [
      {
        "type": "button",
        "label": "提交表单 Feedback",
        "actionType": "confirm",
        "feedback": {
          "body": "feedback弹框中，不请求接口了，直接点击按钮关闭",
          "actions": [
            {
              "type": "button",
              "actionType": "close",
              "label": "关闭"
            }
          ]
        }
      },
      {
        "type": "button",
        "label": "ajax请求 Feedback",
        "actionType": "ajax",
        "close": true,
        "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData?waitSeconds=1",
        "feedback": {
          "body": "feedback弹框中，不请求接口了，直接点击按钮关闭",
          "actions": [
            {
              "type": "button",
              "actionType": "close",
              "label": "关闭"
            }
          ]
        }
      }
    ]
  }
}
```

##### 2. 请求接口，请求成功后，关闭所有弹框

需要在 feedback 的 `body` 中添加 Form 组件，并配置`"actionType": "confirm"`，

```schema: scope="body"
{
  "type": "button",
  "label": "弹一个框",
  "actionType": "dialog",
  "dialog": {
    "body": {
        "type": "form",
        "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
        "controls": [
            {
                "type": "text",
                "name": "text",
                "required": true,
                "label": "用户名",
                "placeholder": "请输入用户名"
            },
            {
                "type": "password",
                "name": "password",
                "label": "密码",
                "required": true,
                "placeholder": "请输入密码"
            },
            {
                "type": "checkbox",
                "name": "rememberMe",
                "label": "记住登录"
            }
        ]
    },
    "actions": [
      {
        "type": "button",
        "label": "confirm Feedback",
        "actionType": "confirm",
        "feedback": {
          "body": {
            "type": "form",
            "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=1",
            "controls": [
              {
                "type": "tpl",
                "tpl": "点击确认，请求接口，接口请求成功后，关闭弹框"
              }
            ]
          },
          "actions": [
            {
              "type": "button",
              "actionType": "confirm",
              "label": "确认",
              "primary": true
            }
          ]
        }
      },
      {
        "type": "button",
        "label": "ajax Feedback",
        "actionType": "ajax",
        "close": true,
        "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=1",
        "feedback": {
          "body": {
            "type": "form",
            "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=1",
            "controls": [
              {
                "type": "tpl",
                "tpl": "点击确认，请求接口，接口请求成功后，关闭弹框"
              }
            ]
          },
          "actions": [
            {
              "type": "button",
              "actionType": "confirm",
              "label": "确认",
              "primary": true
            }
          ]
        }
      }
    ]
  }
}
```

> 注意上面的例子：如果你的触发`feedback`的按钮`actionType`为`ajax`时，为需要额外在按钮上配置`"close": true`

#### 取消 feedback 弹框时，不同时关闭上层弹框

改场景只适用于**不请求接口关闭弹框**的场景，需要在 feedback 层添加`"skipRestOnCancel": true`

```schema: scope="body"
{
  "type": "button",
  "label": "弹一个框",
  "actionType": "dialog",
  "dialog": {
    "title": "提示",
    "body": {
      "type": "form",
      "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData?waitSeconds=1",
      "controls": [
        {
          "type": "tpl",
          "tpl": "这是一个简单的弹框"
        }
      ]
    },
    "actions": [
      {
        "type": "button",
        "actionType": "confirm",
        "label": "Feedback",
        "feedback": {
          "body": "这是一个feedback弹框",
          "skipRestOnCancel": true,
          "actions": [
            {
              "type": "button",
              "actionType": "close",
              "label": "关闭"
            }
          ]
        }
      }
    ]
  }
}
```

#### 确认 feedback 弹框时，不同时关闭上层弹框

如果想让 feedback 弹框确认后，让之前触发这个 feedback 的按钮中断，那么需要配置 `skipRestOnConfirm`，这就意味着之前触发这个 feedback 的按钮必须重新提交一次。

### 根据条件显示 feedback

可以根据条件弹出，例如下面这个例子，只有当接口返回的时间戳可以整除 2 时才显示弹框。

```schema: scope="body"
{
    "type": "button",
    "label": "条件feedback",
    "actionType": "ajax",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData?waitSeconds=1",
    "feedback": {
        "visibleOn": "!(this.date % 2)",
        "title": "操作成功",
        "body": "当前时间戳: <code>${date}</code>"
    }
}
```

## 属性表

| 属性名          | 类型                                      | 默认值             | 说明                                                                                             |
| --------------- | ----------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| type            | `string`                                  |                    | `"dialog"` 指定为 Dialog 渲染器                                                                  |
| title           | [SchemaNode](../../docs/types/schemanode) |                    | 弹出层标题                                                                                       |
| body            | [SchemaNode](../../docs/types/schemanode) |                    | 往 Dialog 内容区加内容                                                                           |
| size            | `string`                                  |                    | 指定 dialog 大小，支持: `xs`、`sm`、`md`、`lg`                                                   |
| bodyClassName   | `string`                                  | `modal-body`       | Dialog body 区域的样式类名                                                                       |
| closeOnEsc      | `boolean`                                 | `false`            | 是否支持按 `Esc` 关闭 Dialog                                                                     |
| showCloseButton | `boolean`                                 | `true`             | 是否显示右上角的关闭按钮                                                                         |
| showErrorMsg    | `boolean`                                 | `true`             | 是否在弹框左下角显示报错信息                                                                     |
| disabled        | `boolean`                                 | `false`            | 如果设置此属性，则该 Dialog 只读没有提交操作。                                                   |
| actions         | Array<[Action](./action)>                 | 【确认】和【取消】 | 如果想不显示底部按钮，可以配置：`[]`                                                             |
| data            | `object`                                  |                    | 支持[数据映射](../../docs/concepts/data-mapping)，如果不设定将默认将触发按钮的上下文中继承数据。 |
