---
title: Form 表单
description:
type: 0
group: ⚙ 组件
menuName: Form 表单
icon:
order: 24
---

表单是 amis 中核心组件之一，主要作用是提交或者展示表单数据。

## 基本用法

最基本的用法是配置 [表单项](./formitem) 和 提交接口`api`。

如下我们配置姓名和邮箱表单项，并可以填写数据并提交给接口`/api/mock2/form/saveForm`。

```schema:height="330" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名："
      },
      {
        "name": "email",
        "type": "email",
        "label": "邮箱："
      }
    ]
}
```

## 表单展示

### 默认模式

默认展示模式为文字表单项分行显示

```schema:height="330" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名："
      },
      {
        "name": "email",
        "type": "email",
        "label": "邮箱："
      }
    ]
}
```

### 水平模式

水平模式，左右摆放，左右比率分配。

```schema:height="330" scope="body"
{
    "type": "form",
    "title": "水平模式",
    "mode": "horizontal",
    "controls": [
      {
        "type": "email",
        "name": "email",
        "label": "邮箱",
        "required": true
      },
      {
        "type": "password",
        "name": "password",
        "label": "密码"
      },
      {
        "type": "checkbox",
        "name": "rememberMe",
        "label": "记住登录"
      }
    ]
}
```

可以配置`horizontal`属性，调整偏移量，格式如下：

```
"horizontal": {
    "left": 2,
    "right": 10,
    "offset": 2
}
```

```schema:height="330" scope="body"
{
    "type": "form",
    "title": "水平模式",
    "mode": "horizontal",
    "horizontal": {
      "left": 2,
      "right": 10,
      "offset": 2
    },
    "controls": [
      {
        "type": "email",
        "name": "email",
        "label": "邮箱",
        "required": true
      },
      {
        "type": "password",
        "name": "password",
        "label": "密码"
      },
      {
        "type": "checkbox",
        "name": "rememberMe",
        "label": "记住登录"
      }
    ]
}
```

### 内联模式

使用内联模式展现表单项

```schema:height="200" scope="body"
 {
    "type": "form",
    "title": "内联模式",
    "mode": "inline",
    "controls": [
      {
        "type": "email",
        "name": "email",
        "label": "邮箱"
      },
      {
        "type": "password",
        "name": "password"
      },
      {
        "type": "checkbox",
        "name": "rememberMe",
        "label": "记住登录"
      },
      {
        "type": "submit",
        "label": "登录"
      }
    ]
  }
```

### 实现一行展示多个表单项

使用 group 实现一行显示多个表单项

```schema:height="650" scope="body"
 [
    {
      "type": "form",
      "title": "常规模式",
      "controls": [
        {
          "type": "group",
          "controls": [
            {
              "type": "email",
              "name": "email",
              "label": "邮箱"
            },
            {
              "type": "password",
              "name": "password",
              "label": "密码"
            }
          ]
        }
      ]
    },
    {
      "type": "form",
      "title": "水平模式",
      "mode": "horizontal",
      "controls": [
        {
          "type": "group",
          "controls": [
            {
              "type": "email",
              "name": "email2",
              "label": "邮箱"
            },
            {
              "type": "password",
              "name": "password2",
              "label": "密码"
            }
          ]
        }
      ]
    },
    {
      "type": "form",
      "title": "内联模式",
      "mode": "inline",
      "controls": [
        {
          "type": "group",
          "controls": [
            {
              "type": "email",
              "name": "email",
              "label": "邮箱"
            },
            {
              "type": "password",
              "name": "password",
              "label": "密码"
            }
          ]
        }
      ]
    }
  ]
```

### 底部按钮栏

#### 隐藏默认提交按钮

Form 默认会在底部渲染一个提交按钮，用于执行表单的提交行为。你可以通过两种方式去掉这个默认的提交按钮：

1. 配置：`"submitText": ""`
2. 配置：`"actions": []`

```schema:height="400" scope="body"
[
    {
      "type": "form",
      "title": "通过 submitText 去掉提交按钮",
      "submitText": "",
      "controls": [
        {
          "type": "text",
          "name": "email",
          "label": "邮箱"
        }
      ]
    },
    {
      "type": "form",
      "title": "通过 actions 去掉提交按钮",
      "actions": [],
      "controls": [
        {
          "type": "text",
          "name": "email",
          "label": "邮箱"
        }
      ]
    }
  ]
```

#### 配置若干自定义按钮

同样，你可以通过 actions 属性，配置任意你想要的行为按钮。

```schema:height="330" scope="body"
{
    "type": "form",
    "title": "表单",
    "controls": [
      {
        "type": "text",
        "name": "email",
        "label": "邮箱"
      },
      {
        "type": "password",
        "name": "password",
        "label": "密码"
      }
    ],
    "actions": [
      {
        "type": "submit",
        "label": "登录"
      },
      {
        "type": "action",
        "actionType": "dialog",
        "label": "登录须知",
        "dialog": {
          "title": "登录须知",
          "body": "登录须知"
        }
      },
      {
        "type": "button",
        "label": "百度一下",
        "url": "https://www.baidu.com/"
      }
    ]
  }
```

请记住，如果想触发表单提交行为，请配置`"actionType": "submit"`或`"type": "submit"`按钮

### 去掉表单边框

通过配置`"wrapWithPanel": false`，可以去掉默认表单边框（包括标题，按钮栏以及边距样式等）。

```schema:height="250" scope="body"
{
    "type": "form",
    "wrapWithPanel": false,
    "controls": [
      {
        "type": "text",
        "name": "email",
        "label": "邮箱"
      },
      {
        "type": "password",
        "name": "password",
        "label": "密码"
      }
    ]
  }
```

**注意！配置该属性后，`title`和`actions`属性将失效并无法渲染，请在表单内自行配置。**

### 固定底部栏

如果表单项较多导致表单过长，而不方便操作底部的按钮栏，可以配置`"affixFooter": true`属性，将底部按钮栏固定在浏览器底部

## 表单项数据初始化

表单可以通过配置`initApi`，实现表单初始化时请求接口，用于展示数据或初始化表单项。

```schema:height="330" scope="body"
{
    "type": "form",
    "initApi": "https://houtai.baidu.com/api/mock2/form/initData",
    "title": "编辑用户信息",
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名"
      },
      {
        "type": "text",
        "name": "email",
        "label": "邮箱"
      }
    ]
}
```

### 轮询初始化请求

Form 支持轮询初始化接口，步骤如下：

1. 配置`initApi`
2. 配置 `interval`：单位为`ms`，最低值`3000`，低于该值按`3000`处理

```schema:height="300" scope="body"
{
    "type": "form",
    "initApi": "https://houtai.baidu.com/api/mock2/page/initData",
    "interval": 3000,
    "title": "表单",
    "controls": [
      {
        "type": "text",
        "name": "date",
        "label": "时间戳"
      }
    ]
  }
```

如果希望在满足某个条件的情况下停止轮询，配置`stopAutoRefreshWhen`表达式。

```schema:height="300" scope="body"
{
    "type": "form",
    "initApi": "https://houtai.baidu.com/api/mock2/page/initData",
    "interval": 3000,
    "title": "表单",
    "stopAutoRefreshWhen": "this.date % 5",
    "controls": [
      {
        "type": "text",
        "name": "date",
        "label": "时间戳"
      }
    ]
  }
```

### 静态初始化数据域

我们也可以手动设置 form 的数据域来初始化多个表单项值

```schema:height="330" scope="body"
{
    "type": "form",
    "data": {
      "name": "rick",
      "email": "rick@gmail.com"
    },
    "title": "用户信息",
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名"
      },
      {
        "type": "email",
        "name": "email",
        "label": "邮箱"
      }
    ]
  }
```

### 数据格式一致性问题

当表单来初始化表单项值时，需要保持数据格式的一致性。

如果表单初始化的值与表单项配置的数据格式不符合，而且用户没有再次操作该表单项，而直接提交表单，那么会将当前默认值原封不动的提交给后端，也许会导致不一致性的问题，我们看一个例子：

```schema:height="260" scope="body"
{
    "type": "form",
    "data": {
        "select": ["a", "c"]
    },
    "controls": [
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

上例中， `select` 我们配置了`"multiple": true`，预期中，我们希望选中 `A` 和 `C` 项时，表单项的数据格式为：`"a,c"`，但是我们表单数据域中，`select`默认值为`"value": ["a", "c"]`，并不符合我们当前表单项的数据格式配置，这样会导致两个问题：

1. 有可能不会默认选中 `A` 和 `C` 选项；
2. 当不操作该表单项，直接提交时，预期是：`"a,c"`，但提交给后端的数据为：`["a", "c"]`，导致了不一致性的问题。

> 通过 `initApi` 配置默认值同理，不再赘述

因此一定确保默认值与选择器表单项数据格式配置相匹配。

## 表单提交

配置`api`属性，当表单执行提交行为时，会默认将当前表单数据域中的数据使用`post`方式发送给所配置`api`

```schema:height="330" scope="body"
{
    "type": "form",
    "initApi": "https://houtai.baidu.com/api/saveForm",
    "title": "用户信息",
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名"
      },
      {
        "type": "email",
        "name": "email",
        "label": "邮箱"
      }
    ]
  }
```

点击提交按钮，会看到发送表单请求，请求数据体为：

```json
{
  "name": "xxx",
  "email": "xxx@xx.com"
}
```

发送请求默认为 `POST` 方式，会将所有表单项整理成一个对象发送过过去。除此之外你可以主动获取以下信息。

- `diff` 只会包含 `diff` 结果
- `prinstine` 原始数据
  如:

```json
{
  "api": {
    "method": "post",
    "url": "/api/xxx/save",
    "data": {
      "modified": "$$",
      "diff": "${diff}",
      "origin": "${prinstine}"
    }
  }
}
```

> 如果 返回了 `data` 对象，且是对象，会把结果 merge 到表单数据里面。

当你需要配置特定的请求方式，请求体，`header`时，使用对象类型 api 配置，并使用 数据映射 进行数据配置。

下面示例我们更改了请求方法为`PUT`，并在原提交数据的基础上添加一个字段`"_from"`。更多用法查看 [API 文档](../../types/api) 和 [数据映射](../../concepts/data-mapping)文档

```schema:height="330" scope="body"
{
    "type": "form",
    "initApi": {
      "method": "put",
      "url": "https://houtai.baidu.com/api/mock2/page/initData",
      "data": {
        "&": "$$$$",
        "_from": "browser"
      }
    },
    "title": "用户信息",
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名"
      },
      {
        "type": "email",
        "name": "email",
        "label": "邮箱"
      }
    ]
  }
```

触发表单提交行为有下面几种方式：

1. 默认的`提交按钮`
2. 为行为按钮配置`"actionType": "submit"`
3. 配置`"type": "submit"`的按钮

### 轮询提交请求

通过设置`asyncApi`，当表单提交发送保存接口后，还会继续轮询请求该接口，默认间隔为`3秒`，直到返回 `finished` 属性为 `true` 才 结束。

```schema:height="330" scope="body"
{
    "type": "form",
    "initApi": "https://houtai.baidu.com/api/mock2/page/initData",
    "asyncApi": "https://houtai.baidu.com/api/mock2/page/initData",
    "title": "用户信息",
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名"
      },
      {
        "type": "email",
        "name": "email",
        "label": "邮箱"
      }
    ]
  }
```

如果决定结束轮询的标识字段名不是 `finished`，请设置`finishedField`属性，比如：`"finishedField": "is_success"`

## 重置表单

配置`"type": "reset"`或者`"actionType": "reset"`的按钮，可以实现点击重置表单项值。

```schema:height="330" scope="body"
{
    "type": "form",
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名"
      },
      {
        "type": "email",
        "name": "email",
        "label": "邮箱"
      }
    ],
    "actions": [
        {
            "type": "reset",
            "label": "重置"
        },
        {
            "type": "submit",
            "label": "保存"
        }
    ]
  }
```

> **请注意：**这里的重置是将表单数据域重置到**初始状态**，**而不是清空**，如果你配置了初始化接口，那么重置操作是会**将表单项重置至初始化表单项值**

## 表单数据域调试

配置`debug:true`可以查看当前表单的数据域数据详情，方便数据映射、表达式等功能调试，如下，你可以修改表单项查看数据域变化

```schema:height="330" scope="body"
{
    "type": "form",
    "title": "用户信息",
    "debug": true,
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名"
      },
      {
        "type": "email",
        "name": "email",
        "label": "邮箱"
      }
    ]
  }
```

> 该配置不会展示完整的数据链，只会展示当前表单的数据域

## 禁用数据链

默认表单是可以获取到完整数据链中的数据的，但是该默认行为不适用于所有场景，例如：

在 CRUD 的列表项中配置弹框，弹框中有一个表单，则该表单项中所有的同`name`表单项都会根据上层`crud`的行数据进行初始化，如果你是实现编辑的功能那并没有是什么问题，但是如果你是新建功能，那么这将不符合你的预期，你可以手动设置`"canAccessSuperData": false`来关闭该行为

## 提交后行为

表单提交成功后，可以执行一些行为。

### 重置表单

如果想提交表单成功后，重置当前表单至初始状态，可以配置`"resetAfterSubmit": true`。

```schema:height="330" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "resetAfterSubmit": true,
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名："
      },
      {
        "name": "email",
        "type": "email",
        "label": "邮箱："
      }
    ]
  }
```

编辑表单项，点击提交，成功后会发现表单项的值会重置到初始状态，即空

> 注意，如果表单项有默认值，则会将该表单项的值重置至该默认值。

### 跳转页面

配置`redirect`属性，可以指定表单提交成功后要跳转至的页面

```schema:height="330" scope="body"
{
    "type": "form",
    "initApi": "https://houtai.baidu.com/api/mock2/page/initData",
    "redirect": "/user/list",
    "title": "用户信息",
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名"
      },
      {
        "type": "email",
        "name": "email",
        "label": "邮箱"
      }
    ]
  }
```

### 刷新目标组件

配置`reload`属性为其他组件`name`值，可以在表单提交成功之后，刷新指定组件。

```schema:height="330" scope="body"
[
    {
      "type": "form",
      "initApi": "https://houtai.baidu.com/api/mock2/page/initData",
      "title": "用户信息",
      "reload": "my_service",
      "controls": [
        {
          "type": "text",
          "name": "name",
          "label": "姓名"
        },
        {
          "type": "email",
          "name": "email",
          "label": "邮箱"
        }
      ]
    },
    {
      "type": "service",
      "name": "my_service",
      "api": "https://houtai.baidu.com/api/mock2/page/initData",
      "body": "service初识数据"
    }
  ]
```

上例中`form`提交成功后，会触发`name`为`my_service`的`Service`组件重新请求初始化接口

上面示例是一种[组件间联动](../concepts/linkage#%E7%BB%84%E4%BB%B6%E9%97%B4%E8%81%94%E5%8A%A8)

### 将数据域发送给目标组件

配置`target`属性为目标组件`name`值，可以在触发提交行为后，将当前表单的数据域发送给目标组件。

```schema:height="330" scope="body"
[
    {
      "type": "form",
      "target": "detailForm",
      "controls": [
        {
          "type": "text",
          "placeholder": "关键字",
          "name": "keywords"
        }
      ]
    },
    {
      "type": "form",
      "name": "detailForm",
      "initApi": "https://houtai.baidu.com/api/mock2/page/initData?keywords=${keywords}",
      "controls": [
        {
          "label": "名称",
          "type": "static",
          "name": "name"
        },
        {
          "label": "作者",
          "type": "static",
          "name": "author"
        },
        {
          "label": "关键字",
          "type": "static",
          "name": "keywords"
        },
        {
          "label": "请求时间",
          "type": "static-datetime",
          "format": "YYYY-MM-DD HH:mm:ss",
          "name": "date"
        }
      ]
    }
  ]
```

第一个表单在提交时，会将它的表单数据域数据发送给`detailForm`表单，触发`detailForm`的初始化接口联动，重新请求接口更新数据域，并更新关键字表单项。

上面示例组合使用了 [组件间联动](../concepts/linkage#%E7%BB%84%E4%BB%B6%E9%97%B4%E8%81%94%E5%8A%A8) 和 [接口联动](../concepts/linkage#%E6%8E%A5%E5%8F%A3%E8%81%94%E5%8A%A8)

## 持久化保存表单项数据

表单默认在重置之后（切换页面、弹框中表单关闭表单），会自动清空掉表单中的所有数据，如果你想持久化保留当前表单项的数据而不清空它，那么配置`persistData:true`

如果想提交成功后，清空该缓存，则配置`"clearPersistDataAfterSubmit": true`

## 属性表

| 属性名                      | 类型                         | 默认值                                                                 | 说明                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------- | ---------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| type                        | `string`                     |                                                                        | `"form"` 指定为 Form 渲染器                                                                                                                                                                                                                                                                                                                                  |
| name                        | `string`                     |                                                                        | 设置一个名字后，方便其他组件与其通信                                                                                                                                                                                                                                                                                                                         |
| mode                        | `string`                     | `normal`                                                               | 表单展示方式，可以是：`normal`、`horizontal` 或者 `inline`                                                                                                                                                                                                                                                                                                   |
| horizontal                  | `Object`                     | `{"left":"col-sm-2", "right":"col-sm-10", "offset":"col-sm-offset-2"}` | 当 mode 为 `horizontal` 时有用，用来控制 label                                                                                                                                                                                                                                                                                                               |
| title                       | `string`                     | `"表单"`                                                               | Form 的标题                                                                                                                                                                                                                                                                                                                                                  |
| submitText                  | `String`                     | `"提交"`                                                               | 默认的提交按钮名称，如果设置成空，则可以把默认按钮去掉。                                                                                                                                                                                                                                                                                                     |
| className                   | `string`                     |                                                                        | 外层 Dom 的类名                                                                                                                                                                                                                                                                                                                                              |
| controls                    | Array<[表单项](./formitem)>  |                                                                        | Form 表单项集合                                                                                                                                                                                                                                                                                                                                              |
| actions                     | Array<[行为按钮](../action)> |                                                                        | Form 提交按钮，成员为 Action                                                                                                                                                                                                                                                                                                                                 |
| messages                    | `Object`                     |                                                                        | 消息提示覆写，默认消息读取的是 API 返回的消息，但是在此可以覆写它。                                                                                                                                                                                                                                                                                          |
| messages.fetchSuccess       | `string`                     |                                                                        | 获取成功时提示                                                                                                                                                                                                                                                                                                                                               |
| messages.fetchFailed        | `string`                     |                                                                        | 获取失败时提示                                                                                                                                                                                                                                                                                                                                               |
| messages.saveSuccess        | `string`                     |                                                                        | 保存成功时提示                                                                                                                                                                                                                                                                                                                                               |
| messages.saveFailed         | `string`                     |                                                                        | 保存失败时提示                                                                                                                                                                                                                                                                                                                                               |
| wrapWithPanel               | `boolean`                    | `true`                                                                 | 是否让 Form 用 panel 包起来，设置为 false 后，actions 将无效。                                                                                                                                                                                                                                                                                               |
| panelClassName              | `string`                     |                                                                        | 外层 panel 的类名                                                                                                                                                                                                                                                                                                                                            |
| api                         | [API](../../types/api)       |                                                                        | Form 用来保存数据的 api。                                                                                                                                                                                                                                                                                                                                    |
| initApi                     | [API](../../types/api)       |                                                                        | Form 用来获取初始数据的 api。                                                                                                                                                                                                                                                                                                                                |
| interval                    | `number`                     | `3000`                                                                 | 刷新时间(最低 3000)                                                                                                                                                                                                                                                                                                                                          |
| silentPolling               | `boolean`                    | `false`                                                                | 配置刷新时是否显示加载动画                                                                                                                                                                                                                                                                                                                                   |
| stopAutoRefreshWhen         | `string`                     | `""`                                                                   | 通过[表达式](./Types.md#表达式) 来配置停止刷新的条件                                                                                                                                                                                                                                                                                                         |
| initAsyncApi                | [API](../../types/api)       |                                                                        | Form 用来获取初始数据的 api,与 initApi 不同的是，会一直轮询请求该接口，直到返回 finished 属性为 true 才 结束。                                                                                                                                                                                                                                               |
| initFetch                   | `boolean`                    | `true`                                                                 | 设置了 initApi 或者 initAsyncApi 后，默认会开始就发请求，设置为 false 后就不会起始就请求接口                                                                                                                                                                                                                                                                 |
| initFetchOn                 | `string`                     |                                                                        | 用表达式来配置                                                                                                                                                                                                                                                                                                                                               |
| initFinishedField           | `string`                     | `finished`                                                             | 设置了 initAsyncApi 后，默认会从返回数据的 data.finished 来判断是否完成，也可以设置成其他的 xxx，就会从 data.xxx 中获取                                                                                                                                                                                                                                      |
| initCheckInterval           | `number`                     | `3000`                                                                 | 设置了 initAsyncApi 以后，默认拉取的时间间隔                                                                                                                                                                                                                                                                                                                 |
| asyncApi                    | [API](../../types/api)       |                                                                        | 设置此属性后，表单提交发送保存接口后，还会继续轮询请求该接口，直到返回 `finished` 属性为 `true` 才 结束。                                                                                                                                                                                                                                                    |
| checkInterval               | `number`                     | 3000                                                                   | 轮询请求的时间间隔，默认为 3 秒。设置 `asyncApi` 才有效                                                                                                                                                                                                                                                                                                      |
| finishedField               | `string`                     | `"finished"`                                                           | 如果决定结束的字段名不是 `finished` 请设置此属性，比如 `is_success`                                                                                                                                                                                                                                                                                          |
| submitOnChange              | `boolean`                    | `false`                                                                | 表单修改即提交                                                                                                                                                                                                                                                                                                                                               |
| submitOnInit                | `boolean`                    | `false`                                                                | 初始就提交一次                                                                                                                                                                                                                                                                                                                                               |
| resetAfterSubmit            | `boolean`                    | `false`                                                                | 提交后是否重置表单                                                                                                                                                                                                                                                                                                                                           |
| primaryField                | `string`                     | `"id"`                                                                 | 设置主键 id, 当设置后，检测表单是否完成时（asyncApi），只会携带此数据。                                                                                                                                                                                                                                                                                      |
| target                      | `string`                     |                                                                        | 默认表单提交自己会通过发送 api 保存数据，但是也可以设定另外一个 form 的 name 值，或者另外一个 `CRUD` 模型的 name 值。 如果 target 目标是一个 `Form` ，则目标 `Form` 会重新触发 `initApi`，api 可以拿到当前 form 数据。如果目标是一个 `CRUD` 模型，则目标模型会重新触发搜索，参数为当前 Form 数据。当目标是 `window` 时，会把当前表单的数据附带到页面地址上。 |
| redirect                    | `string`                     |                                                                        | 设置此属性后，Form 保存成功后，自动跳转到指定页面。支持相对地址，和绝对地址（相对于组内的）。                                                                                                                                                                                                                                                                |
| reload                      | `string`                     |                                                                        | 操作完后刷新目标对象。请填写目标组件设置的 name 值，如果填写为 `window` 则让当前页面整体刷新。                                                                                                                                                                                                                                                               |
| autoFocus                   | `boolean`                    | `false`                                                                | 是否自动聚焦。                                                                                                                                                                                                                                                                                                                                               |
| canAccessSuperData          | `boolean`                    | `true`                                                                 | 指定是否可以自动获取上层的数据并映射到表单项上                                                                                                                                                                                                                                                                                                               |
| persistData                 | `boolean`                    | `true`                                                                 | 指定表单是否开启本地缓存                                                                                                                                                                                                                                                                                                                                     |
| clearPersistDataAfterSubmit | `boolean`                    | `true`                                                                 | 指定表单提交成功后是否清除本地缓存                                                                                                                                                                                                                                                                                                                           |
| trimValues                  | `boolean`                    | `false`                                                                | trim 当前表单项的每一个值                                                                                                                                                                                                                                                                                                                                    |
