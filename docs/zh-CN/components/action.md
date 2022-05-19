---
title: Action 行为按钮
description:
type: 0
group: ⚙ 组件
menuName: Action 行为按钮
icon:
order: 26
---

Action 行为按钮，是触发页面行为的主要方法之一

## 基本用法

我们这里简单实现一个点击按钮弹框的交互。

```schema: scope="body"
{
  "label": "弹框",
  "type": "button",
  "actionType": "dialog",
  "dialog": {
    "title": "弹框",
    "body": "这是个简单的弹框。"
  }
}
```

## 样式

### 尺寸

配置`size`，显示不同尺寸

```schema: scope="body"
{
  "type": "button-toolbar",
  "buttons": [
    {
      "type": "button",
      "label": "默认尺寸"
    },
    {
      "type": "button",
      "label": "极小",
      "size": "xs"
    },
    {
      "type": "button",
      "label": "小",
      "size": "sm"
    },
    {
      "type": "button",
      "label": "中等",
      "size": "md"
    },
    {
      "type": "button",
      "label": "大",
      "size": "lg"
    }
  ]
}
```

### 主题

可以配置`level`或者`primary`，显示不同样式。

```schema: scope="body"
{
  "type": "button-toolbar",
  "buttons": [
    {
      "type": "button",
      "label": "默认"
    },
    {
      "type": "button",
      "label": "主要",
      "level": "primary"
    },
    {
      "type": "button",
      "label": "次要",
      "level": "secondary"
    },
    {
      "type": "button",
      "label": "信息",
      "level": "info"
    },
    {
      "type": "button",
      "label": "成功",
      "level": "success"
    },
    {
      "type": "button",
      "label": "警告",
      "level": "warning"
    },
    {
      "type": "button",
      "label": "危险",
      "level": "danger"
    },
    {
      "type": "button",
      "label": "浅色",
      "level": "light"
    },
    {
      "type": "button",
      "label": "深色",
      "level": "dark"
    },
    {
      "type": "button",
      "label": "链接",
      "level": "link"
    }
  ]
}
```

### 图标

可以配置`icon`配置项，实现按钮显示图标

```schema: scope="body"
{
  "label": "弹框",
  "type": "button",
  "actionType": "dialog",
  "icon": "fa fa-plus",
  "dialog": {
    "title": "弹框",
    "body": "这是个简单的弹框。"
  }
}
```

icon 也可以是 url 地址，比如

```schema: scope="body"
{
  "label": "弹框",
  "type": "button",
  "actionType": "dialog",
  "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
  "dialog": {
    "title": "弹框",
    "body": "这是个简单的弹框。"
  }
}
```

如果`label`配置为空字符串，可以只显示`icon`

```schema: scope="body"
{
  "label": "",
  "type": "button",
  "actionType": "dialog",
  "icon": "fa fa-plus",
  "dialog": {
    "title": "弹框",
    "body": "这是个简单的弹框。"
  }
}
```

## 操作前确认

可以通过配置`confirmText`，实现在任意操作前，弹出提示框确认是否进行该操作。

```schema: scope="body"
{
    "label": "ajax请求",
    "type": "button",
    "actionType": "ajax",
    "confirmText": "确认要发出这个请求？",
    "api": "/api/mock2/form/saveForm"
}
```

## ajax 请求

通过配置`"actionType":"ajax"`和`api`，可以实现 ajax 请求。

```schema: scope="body"
{
    "label": "ajax请求",
    "type": "button",
    "actionType": "ajax",
    "api": "/api/mock2/form/saveForm"
}
```

### 请求成功后，跳转至某个页面

##### 配置相对路径，实现单页跳转

```schema: scope="body"
{
    "label": "ajax请求",
    "type": "button",
    "actionType": "ajax",
    "api": "/api/mock2/form/saveForm",
    "redirect": "../docs/start/getting-started"
}
```

##### 配置完整路径，直接跳转指定路径

```schema: scope="body"
{
    "label": "ajax请求",
    "type": "button",
    "actionType": "ajax",
    "api": "/api/mock2/form/saveForm",
    "redirect": "https://www.baidu.com/"
}
```

### 请求成功后，显示反馈弹框

```schema: scope="body"
{
    "type": "button",
    "label": "ajax 反馈弹框",
    "actionType": "ajax",
    "api": "/api/mock2/form/saveForm",
    "feedback": {
        "title": "操作成功",
        "body": "${id} 已操作成功"
    }
}
```

更多内容查看[Dialog 文档](./dialog#feedback-%E5%8F%8D%E9%A6%88%E5%BC%B9%E6%A1%86)

### 请求成功后，刷新目标组件

1. 目标组件需要配置 `name` 属性
2. Action 上添加 `"reload": "xxx"`，`xxx` 为目标组件的 `name` 属性值，如果配置多个组件，`name` 用逗号分隔，另外如果想让 reload 的时候再携带些数据可以类似这样配置 `{"reload": "xxx?a=${a}&b=${b}"}`, 这样不仅让目标组件刷新，同时还会把当前环境中的数据 a 和 b 传递给 xxx.

```schema
{
  "type": "page",
  "body": [
    {
      "type": "button",
      "label": "ajax 请求",
      "actionType": "ajax",
      "api": "/api/mock2/form/saveForm",
      "reload": "crud"
    },
    {
      "type": "divider"
    },
    {
      "type": "crud",
      "name": "crud",
      "api": "/api/mock2/sample?waitSeconds=1",
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
        }
      ]
    }
  ]
}
```

> 配置 `"reload": "window"` 可刷新当前页面

### 自定义 toast 文字

可以通过配置`messages`，自定义接口返回`toast`信息

```schema: scope="body"
{
    "type": "button",
    "label": "ajax 请求",
    "actionType": "ajax",
    "api": "/api/mapping",
    "messages": {
        "success": "成功了！欧耶",
        "failed": "失败了呢。。"
    }
}
```

需要注意如果 api 结果返回了 `msg` 字段，会优先使用 api 的返回。

**属性表**

| 属性名   | 类型                                                                                     | 默认值 | 说明                                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| api      | [Api](../../docs/types/api)                                                              | -      | 请求地址，参考 [api](../../docs/types/api) 格式说明。                                                                                  |
| redirect | [模板字符串](../../docs/concepts/template#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2) | -      | 指定当前请求结束后跳转的路径，可用 `${xxx}` 取值。                                                                                     |
| feedback | `DialogObject`                                                                           | -      | 如果 ajax 类型的，当 ajax 返回正常后，还能接着弹出一个 dialog 做其他交互。返回的数据可用于这个 dialog 中。格式可参考[Dialog](./Dialog) |
| messages | `object`                                                                                 | -      | `success`：ajax 操作成功后提示，可以不指定，不指定时以 api 返回为准。`failed`：ajax 操作失败提示。                                     |

## 下载请求

> 1.4.0 及以上版本

通过配置 `"actionType":"download"` 和 `api`，可以实现下载请求，它其实是 `ajax` 的一种特例，自动给 api 加上了 `"responseType": "blob"`。

```schema: scope="body"
{
    "label": "下载",
    "type": "action",
    "actionType": "download",
    "api": "/api/download"
}
```

上面的例子由于环境原因没法测试，需要在返回的 header 中配置 `content-type` 和 `Content-Disposition`，比如

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="download.pdf"
```

如果接口存在跨域，除了常见的 cors header 外，还需要添加以下 header

```
Access-Control-Expose-Headers:  Content-Disposition
```

## 保存到本地

> 1.10.0 及以上版本

和前面的下载接口功能类似，但不需要返回 `Content-Disposition` header，只需要解决跨域问题，主要用于一些简单的场景，比如下载文本

```schema: scope="body"
{
    "label": "保存",
    "type": "action",
    "actionType": "saveAs",
    "api": "/api/download"
}
```

> 这个功能目前还没用到 env 里的 fetcher 方法，不支持 POST

默认会自动取 url 中的文件名，如果没有的话就需要指定，比如

```schema: scope="body"
{
    "label": "保存",
    "type": "action",
    "actionType": "saveAs",
    "fileName": "下载的文件名",
    "api": "/api/download"
}
```

## 倒计时

主要用于发验证码的场景，通过设置倒计时 `countDown`（单位是秒），让点击按钮后禁用一段时间：

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "name": "phone",
      "type": "input-text",
      "required": true,
      "label": "手机号",
      "addOn": {
        "label": "发送验证码",
        "type": "button",
        "countDown": 60,
        "countDownTpl": "${timeLeft} 秒后重发",
        "actionType": "ajax",
        "api": "/api/mock2/form/saveForm?phone=${phone}"
      }
    }
  ]
}
```

同时还能通过 `countDownTpl` 来控制显示的文本，其中 `${timeLeft}` 变量是剩余时间。

## 跳转链接

### 单页跳转

```schema: scope="body"
{
    "label": "进入介绍页",
    "type": "button",
    "level": "info",
    "actionType": "link",
    "link": "../index"
}

```

**属性表**

| 属性名     | 类型     | 默认值 | 说明                                                                                                                |
| ---------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| actionType | `string` | `link` | 单页跳转                                                                                                            |
| link       | `string` | `link` | 用来指定跳转地址，跟 url 不同的是，这是单页跳转方式，不会渲染浏览器，请指定 amis 平台内的页面。可用 `${xxx}` 取值。 |

### 直接跳转

```schema: scope="body"
{
    "label": "打开 Baidu",
    "type": "button",
    "level": "success",
    "actionType": "url",
    "url": "http://www.baidu.com"
}
```

**属性表**

| 属性名     | 类型      | 默认值  | 说明                                             |
| ---------- | --------- | ------- | ------------------------------------------------ |
| actionType | `string`  | `url`   | 页面跳转                                         |
| url        | `string`  | -       | 按钮点击后，会打开指定页面。可用 `${xxx}` 取值。 |
| blank      | `boolean` | `false` | 如果为 `true` 将在新 tab 页面打开。              |

## 发送邮件

```schema: scope="body"
{
  "label": "发送邮件",
  "type": "button",
  "actionType": "email",
  "to": "amis@baidu.com",
  "cc": "baidu@baidu.com",
  "subject": "这是邮件主题",
  "body": "这是邮件正文"
}
```

### 异步获取数据

```schema: scope="body"
{
  "type": "page",
  "initApi": "/api/mock2/mail/mailInfo",
  "body": {
    "label": "发送邮件",
    "type": "button",
    "actionType": "email",
    "to": "${to}",
    "cc": "${cc}",
    "subject": "${subject}",
    "body": "${body}"
  }
}
```

**属性表**

| 属性名     | 类型     | 默认值  | 说明                             |
| ---------- | -------- | ------- | -------------------------------- |
| actionType | `string` | `email` | 点击后显示一个弹出框             |
| to         | `string` | -       | 收件人邮箱，可用 ${xxx} 取值。   |
| cc         | `string` | -       | 抄送邮箱，可用 ${xxx} 取值。     |
| bcc        | `string` | -       | 匿名抄送邮箱，可用 ${xxx} 取值。 |
| subject    | `string` | -       | 邮件主题，可用 ${xxx} 取值。     |
| body       | `string` | -       | 邮件正文，可用 ${xxx} 取值。     |

## 弹框

```schema: scope="body"
{
  "label": "Dialog Form",
  "type": "button",
  "level": "primary",
  "actionType": "dialog",
  "dialog": {
    "title": "表单设置",
    "body": {
      "type": "form",
      "api": "/api/mock2/form/saveForm",
      "body": [
        {
          "type": "input-text",
          "name": "text",
          "label": "文本"
        }
      ]
    }
  }
}
```

### 弹框结合 reload 刷新下拉框的例子

下面是一种典型场景，有个一个下拉框，然后有个按钮能弹框新增数据，新增了之后需要下拉框重新拉取最新列表（这个例子因为没实现新增功能，所以看不出更新，如果看网络请求会发现重新请求了一次）。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "name": "myForm",
    "body": [
        {
          "type": "select",
          "name": "group",
          "label": "分组",
          "source": "/api/mock2/form/getOptions"
        },
        {
          "label": "新增分组",
          "type": "button",
          "level": "primary",
          "actionType": "dialog",
          "reload": "myForm.group",
          "dialog": {
            "title": "新增分组",
            "body": {
              "type": "form",
              "api": "/api/mock2/form/saveForm",
              "body": [
                {
                  "type": "input-text",
                  "name": "groupName",
                  "label": "分组名"
                }
              ]
            }
          }
        }
    ]
}
```

可以看到 `reload` 是 `myForm.group`，第一个是表单的 name，第二个是下拉框的 name。

**属性表**

| 属性名        | 类型                       | 默认值   | 说明                                          |
| ------------- | -------------------------- | -------- | --------------------------------------------- |
| actionType    | `string`                   | `dialog` | 点击后显示一个弹出框                          |
| dialog        | `string` 或 `DialogObject` | -        | 指定弹框内容，格式可参考[Dialog](./dialog)    |
| nextCondition | `boolean`                  | -        | 可以用来设置下一条数据的条件，默认为 `true`。 |

## 抽屉

```schema: scope="body"
{
  "label": "Drawer Form",
  "type": "button",
  "actionType": "drawer",
  "drawer": {
    "title": "表单设置",
    "body": {
      "type": "form",
      "api": "/api/mock2/form/saveForm?waitSeconds=1",
      "body": [
        {
          "type": "input-text",
          "name": "text",
          "label": "文本"
        }
      ]
    }
  }
}
```

**属性表**

| 属性名     | 类型                       | 默认值   | 说明                                       |
| ---------- | -------------------------- | -------- | ------------------------------------------ |
| actionType | `string`                   | `drawer` | 点击后显示一个侧边栏                       |
| drawer     | `string` 或 `DrawerObject` | -        | 指定弹框内容，格式可参考[Drawer](./drawer) |

## 复制文本

```schema: scope="body"
{
    "label": "复制一段文本",
    "type": "button",
    "actionType": "copy",
    "content": "http://www.baidu.com"
}
```

可以通过 `copyFormat` 设置复制的格式，默认是文本

```schema: scope="body"
{
    "label": "复制一段富文本",
    "type": "button",
    "actionType": "copy",
    "copyFormat": "text/html",
    "content": "<a href='http://www.baidu.com'>link</a> <b>bold</b>"
}
```

**属性表**

| 属性名     | 类型                                 | 默认值 | 说明                                 |
| ---------- | ------------------------------------ | ------ | ------------------------------------ |
| actionType | `string`                             | `copy` | 复制一段内容到粘贴板                 |
| content    | [模板](../../docs/concepts/template) | -      | 指定复制的内容。可用 `${xxx}` 取值。 |

## 刷新其他组件

**属性表**

| 属性名     | 类型     | 默认值   | 说明                                                                        |
| ---------- | -------- | -------- | --------------------------------------------------------------------------- |
| actionType | `string` | `reload` | 刷新目标组件                                                                |
| target     | `string` | -        | 需要刷新的目标组件名字（组件的`name`值，自己配置的），多个请用 `,` 号隔开。 |

## 组件特有的行为类型

### 表单中表格添加一行

该 actionType 为[FormItem-Table](./form/input-table)专用行为

### 重置表单

在 form 中，配置`"type": "reset"`的按钮，可以实现重置表单数据的功能

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-text",
            "name": "username",
            "placeholder": "请输入用户名",
            "label": "用户名"
        },
        {
            "type": "input-password",
            "name": "password",
            "label": "密码",
            "placeholder": "请输入密码"
        },
        {
            "type": "checkbox",
            "name": "rememberMe",
            "option": "记住登录"
        }
    ],
    "actions": [
        {
            "type": "reset",
            "label": "重置"
        },
        {
            "type": "submit",
            "label": "提交",
            "level": "primary"
        }
    ]
}
```

### 清空表单

在 form 中，配置`"actionType": "clear"`的按钮，可以实现清空表单数据的功能，跟重置不同的是，重置其实是还原到初始值，并不一定是清空。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-text",
            "name": "username",
            "placeholder": "请输入用户名",
            "label": "用户名",
            "value": "rick"
        },
        {
            "type": "input-password",
            "name": "password",
            "label": "密码",
            "placeholder": "请输入密码"
        },
        {
            "type": "checkbox",
            "name": "rememberMe",
            "option": "记住登录"
        }
    ],
    "actions": [
        {
            "type": "button",
            "actionType": "clear",
            "label": "清空"
        },
        {
            "type": "reset",
            "label": "重置"
        },
        {
            "type": "submit",
            "label": "提交",
            "level": "primary"
        }
    ]
}
```

### 重置表单并提交

`actionType` 配置成 `"reset-and-submit"`

### 清空表单并提交

`actionType` 配置成 `"clear-and-submit"`

## 自定义点击事件

> 1.3.0 版本新增功能

如果上面的的行为不满足需求，还可以通过字符串形式的 `onClick` 来定义点击事件，这个字符串会转成 JavaScript 函数，并支持异步（如果是用 sdk 需要自己编译一个 es2017 版本）。

```schema: scope="body"
{
    "label": "点击",
    "type": "button",
    "onClick": "alert('点击了按钮'); console.log(props);"
}
```

amis 会传入两个参数 `event` 和 `props`，`event` 就是 React 的事件，而 `props` 可以拿到这个组件的其他属性，同时还能调用 amis 中的内部方法。

```schema: scope="body"
{
    "label": "点击",
    "type": "button",
    "onClick": "props.onAction(event, {actionType:'dialog', dialog: {title: '弹框', body: '这是代码调用的弹框'}})"
}
```

我们将前面的代码拿出来方便分析：

```javascript
// event 和 props 前面提到过，而 onAction 就是 amis 内部的方法，可以用来调用其他 action，需要传递两个参数，一个是 event，另一个就是 action 类型及所需的参数。
props.onAction(event, {
  actionType: 'dialog',
  dialog: {title: '弹框', body: '这是代码调用的弹框'}
});
```

这个函数如果返回 `false` 就会阻止 amis 其他 action 的执行，比如这个例子

```schema: scope="body"
{
  "label": "弹框",
  "type": "button",
  "actionType": "dialog",
  "onClick": "alert('点击按钮');",
  "dialog": {
    "title": "弹框",
    "body": "这是个简单的弹框。"
  }
}
```

它的行为是先执行 alert，再执行弹框，但如果我们加上一个 `return false`，就会发现后面的 amis 弹框不执行了。

```schema: scope="body"
{
  "label": "弹框",
  "type": "button",
  "actionType": "dialog",
  "onClick": "alert('点击按钮'); return false;",
  "dialog": {
    "title": "弹框",
    "body": "这是个简单的弹框。"
  }
}
```

如果是在表单项中，还能通过 `props.formStore.setValues();` 来修改其它表单项值

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-text",
      "name": "name",
      "label": "姓名："
    },
    {
      "type": "input-text",
      "name": "email",
      "label": "邮箱："
    },
    {
      "label": "修改姓名",
      "name": "name",
      "type": "button",
      "onClick": "props.formStore.setValues({name: 'amis', email: 'amis@baidu.com'});"
    }
  ]
}
```

## 全局键盘快捷键触发

> 1.3.0 版本新增功能

可以通过 `hotKey` 属性来配置键盘快捷键触发，比如下面的例子

```schema: scope="body"
{
  "label": "使用 ⌘+o 或 ctrl+o 来弹框",
  "type": "button",
  "hotKey": "command+o,ctrl+o",
  "actionType": "dialog",
  "dialog": {
    "title": "弹框",
    "body": "这是个简单的弹框。"
  }
}
```

除了 ctrl 和 command 还支持 shift、alt。

其它键盘特殊按键的命名列表：backspace, tab, clear, enter, return, esc, escape, space, up, down, left, right, home, end, pageup, pagedown, del, delete, f1 - f19, num_0 - num_9, num_multiply, num_add, num_enter, num_subtract, num_decimal, num_divide。

> 注意这个主要用于实现页面级别快捷键，如果要实现回车提交功能，请将 `input-text` 放在 `form` 里，而不是给 button 配一个 `enter` 的快捷键。

## Action 作为容器组件

> 1.5.0 及以上版本

action 还可以使用 `body` 来渲染其他组件，让那些不支持行为的组件支持点击事件，比如下面的例子

```schema: scope="body"
[{
  "type": "action",
  "body": [{
    "type": "color",
    "value": "#108cee"
  }],
  "actionType": "dialog",
  "dialog": {
    "title": "弹框",
    "body": "这是个简单的弹框。"
  }
},{
  "type": "action",
  "body": {
    "type": "image",
    "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80"
  },
  "tooltip": "点击会有弹框",
  "actionType": "dialog",
  "dialog": {
    "title": "弹框",
    "body": "这是个简单的弹框。"
  }
}]
```

在这种模式下不支持按钮的各种配置项，比如 `label`、`size`、`icon` 等，因为它只作为容器组件，没有展现。

## 按钮提示

通过 `tooltip` 来设置提示

```schema: scope="body"
{
  "label": "弹框",
  "type": "button",
  "actionType": "link",
  "link": "../index",
  "tooltip": "点击链接跳转"
}
```

如果按钮是 disabled，需要使用 `disabledTip`

```schema: scope="body"
{
  "label": "弹框",
  "type": "button",
  "actionType": "link",
  "disabled": true,
  "link": "../index",
  "disabledTip": "禁用了"
}
```

还可以通过 `tooltipPlacement` 设置弹出位置

```schema: scope="body"
{
  "label": "弹框",
  "type": "button",
  "actionType": "link",
  "link": "../index",
  "tooltipPlacement": "right",
  "tooltip": "点击链接跳转"
}
```

## 通用属性表

所有`actionType`都支持的通用配置项

| 属性名             | 类型                                 | 默认值      | 说明                                                                                                                                                                        |
| ------------------ | ------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type               | `string`                             | `action`    | 指定为 Page 渲染器。                                                                                                                                                        |
| actionType         | `string`                             | -           | 【必填】这是 action 最核心的配置，来指定该 action 的作用类型，支持：`ajax`、`link`、`url`、`drawer`、`dialog`、`confirm`、`cancel`、`prev`、`next`、`copy`、`close`。       |
| label              | `string`                             | -           | 按钮文本。可用 `${xxx}` 取值。                                                                                                                                              |
| level              | `string`                             | `default`   | 按钮样式，支持：`link`、`primary`、`secondary`、`info`、`success`、`warning`、`danger`、`light`、`dark`、`default`。                                                        |
| size               | `string`                             | -           | 按钮大小，支持：`xs`、`sm`、`md`、`lg`。                                                                                                                                    |
| icon               | `string`                             | -           | 设置图标，例如`fa fa-plus`。                                                                                                                                                |
| iconClassName      | `string`                             | -           | 给图标上添加类名。                                                                                                                                                          |
| rightIcon          | `string`                             | -           | 在按钮文本右侧设置图标，例如`fa fa-plus`。                                                                                                                                  |
| rightIconClassName | `string`                             | -           | 给右侧图标上添加类名。                                                                                                                                                      |
| active             | `boolean`                            | -           | 按钮是否高亮。                                                                                                                                                              |
| activeLevel        | `string`                             | -           | 按钮高亮时的样式，配置支持同`level`。                                                                                                                                       |
| activeClassName    | `string`                             | `is-active` | 给按钮高亮添加类名。                                                                                                                                                        |
| block              | `boolean`                            | -           | 用`display:"block"`来显示按钮。                                                                                                                                             |
| confirmText        | [模板](../../docs/concepts/template) | -           | 当设置后，操作在开始前会询问用户。可用 `${xxx}` 取值。                                                                                                                      |
| reload             | `string`                             | -           | 指定此次操作完后，需要刷新的目标组件名字（组件的`name`值，自己配置的），多个请用 `,` 号隔开。                                                                               |
| tooltip            | `string`                             | -           | 鼠标停留时弹出该段文字，也可以配置对象类型：字段为`title`和`content`。可用 `${xxx}` 取值。                                                                                  |
| disabledTip        | `string`                             | -           | 被禁用后鼠标停留时弹出该段文字，也可以配置对象类型：字段为`title`和`content`。可用 `${xxx}` 取值。                                                                          |
| tooltipPlacement   | `string`                             | `top`       | 如果配置了`tooltip`或者`disabledTip`，指定提示信息位置，可配置`top`、`bottom`、`left`、`right`。                                                                            |
| close              | `boolean` or `string`                | -           | 当`action`配置在`dialog`或`drawer`的`actions`中时，配置为`true`指定此次操作完后关闭当前`dialog`或`drawer`。当值为字符串，并且是祖先层弹框的名字的时候，会把祖先弹框关闭掉。 |
| required           | `Array<string>`                      | -           | 配置字符串数组，指定在`form`中进行操作之前，需要指定的字段名的表单项通过验证                                                                                                |

## 事件表

| 事件名称   | 事件参数 | 说明     |
| ---------- | -------- | -------- |
| click      | -        | 点击     |
| mouseenter | -        | 鼠标移入 |
| mouseleave | -        | 鼠标移出 |

## 动作表

暂无
