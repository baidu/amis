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

```schema:height="100" scope="body"
{
  "label": "弹框",
  "type": "action",
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

```schema:height="100" scope="body"
{
  "type": "button-toolbar",
  "buttons": [
    {
      "type": "action",
      "label": "默认尺寸"
    },
    {
      "type": "action",
      "label": "极小",
      "size": "xs"
    },
    {
      "type": "action",
      "label": "小",
      "size": "sm"
    },
    {
      "type": "action",
      "label": "中等",
      "size": "md"
    },
    {
      "type": "action",
      "label": "大",
      "size": "lg"
    }
  ]
}
```

### 主题

可以配置`level`或者`primary`，显示不同样式。

```schema:height="100" scope="body"
{
  "type": "button-toolbar",
  "buttons": [
    {
      "type": "action",
      "label": "默认"
    },
    {
      "type": "action",
      "label": "主要",
      "level": "primary"
    },
    {
      "type": "action",
      "label": "次要",
      "level": "secondary"
    },
    {
      "type": "action",
      "label": "成功",
      "level": "success"
    },
    {
      "type": "action",
      "label": "警告",
      "level": "warning"
    },
    {
      "type": "action",
      "label": "危险",
      "level": "danger"
    },
    {
      "type": "action",
      "label": "浅色",
      "level": "light"
    },
    {
      "type": "action",
      "label": "深色",
      "level": "dark"
    },
    {
      "type": "action",
      "label": "链接",
      "level": "link"
    }
  ]
}
```

### 图标

可以配置`icon`配置项，实现按钮显示图标

```schema:height="100" scope="body"
{
  "label": "弹框",
  "type": "action",
  "actionType": "dialog",
  "icon": "fa fa-plus",
  "dialog": {
    "title": "弹框",
    "body": "这是个简单的弹框。"
  }
}
```

如果`label`配置为空字符串，可以只显示`icon`

```schema:height="100" scope="body"
{
  "label": "",
  "type": "action",
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

```schema:height="100" scope="body"
{
    "label": "ajax请求",
    "type": "button",
    "actionType": "ajax",
    "confirmText": "确认要发出这个请求？",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm"
}
```

## ajax 请求

通过配置`"actionType":"ajax"`和`api`，可以实现 ajax 请求。

```schema:height="100" scope="body"
{
    "label": "ajax请求",
    "type": "button",
    "actionType": "ajax",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm"
}
```

### 请求成功后，跳转至某个页面

##### 配置相对路径，实现单页跳转

```schema:height="100" scope="body"
{
    "label": "ajax请求",
    "type": "button",
    "actionType": "ajax",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "redirect": "./getting-started"
}
```

##### 配置完整路径，直接跳转指定路径

```schema:height="100" scope="body"
{
    "label": "ajax请求",
    "type": "button",
    "actionType": "ajax",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "redirect": "https://www.baidu.com/"
}
```

### 请求成功后，显示反馈弹框

```schema:height="100" scope="body"
{
    "type": "button",
    "label": "ajax 反馈弹框",
    "actionType": "ajax",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "feedback": {
        "title": "操作成功",
        "body": "xxx 已操作成功"
    }
}
```

更多内容查看[Dialog 文档](./dialog#feedback-%E5%8F%8D%E9%A6%88%E5%BC%B9%E6%A1%86)

### 请求成功后，刷新目标组件

1. 目标组件需要配置 `name` 属性
2. Action 上添加 `"reload": "xxx"`，`xxx` 为目标组件的 `name` 属性值，如果配置多个组件，`name` 用逗号分隔

```schema:height="700"
{
  "type": "page",
  "body": [
    {
      "type": "button",
      "label": "ajax 请求",
      "actionType": "ajax",
      "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
      "reload": "crud"
    },
    {
      "type": "divider"
    },
    {
      "type": "crud",
      "name": "crud",
      "api": "https://houtai.baidu.com/api/sample?waitSeconds=1",
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

```schema:height="100" scope="body"
{
    "type": "button",
    "label": "ajax 请求",
    "actionType": "ajax",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "messages": {
        "success": "成功了！欧耶",
        "failed": "失败了呢。。"
    }
}
```

**属性表**

| 属性名   | 类型                                                                             | 默认值 | 说明                                                                                                                                      |
| -------- | -------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| api      | [Api](../types/api)                                                              | -      | 请求地址，参考 [api](../types/api) 格式说明。                                                                                             |
| redirect | [模板字符串](../concepts/template#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2) | -      | 指定当前请求结束后跳转的路径，可用 `${xxx}` 取值。                                                                                        |
| feedback | `DialogObject`                                                                   | -      | 如果 ajax 类型的，当 ajax 返回正常后，还能接着弹出一个 dialog 做其他交互。返回的数据可用于这个 dialog 中。格式可参考[Dialog](./Dialog.md) |
| messages | `object`                                                                         | -      | `success`：ajax 操作成功后提示，可以不指定，不指定时以 api 返回为准。`failed`：ajax 操作失败提示。                                        |

## 跳转链接

### 单页跳转

```schema:height="100" scope="body"
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

```schema:height="100" scope="body"
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

## 弹框

```schema:height="100" scope="body"
{
  "label": "Dialog Form",
  "type": "button",
  "level": "primary",
  "actionType": "dialog",
  "dialog": {
    "title": "表单设置",
    "body": {
      "type": "form",
      "api": "https://houtai.baidu.com/api/mock2/form/saveForm?waitSeconds=1",
      "controls": [
        {
          "type": "text",
          "name": "text",
          "label": "文本"
        }
      ]
    }
  }
}
```

**属性表**

| 属性名        | 类型                       | 默认值   | 说明                                          |
| ------------- | -------------------------- | -------- | --------------------------------------------- |
| actionType    | `string`                   | `dialog` | 点击后显示一个弹出框                          |
| dialog        | `string` 或 `DialogObject` | -        | 指定弹框内容，格式可参考[Dialog](./dialog)    |
| nextCondition | `boolean`                  | -        | 可以用来设置下一条数据的条件，默认为 `true`。 |

## 抽屉

```schema:height="100" scope="body"
{
  "label": "Drawer Form",
  "type": "button",
  "actionType": "drawer",
  "drawer": {
    "title": "表单设置",
    "body": {
      "type": "form",
      "api": "https://houtai.baidu.com/api/mock2/form/saveForm?waitSeconds=1",
      "controls": [
        {
          "type": "text",
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

```schema:height="100" scope="body"
{
    "label": "复制一段文本",
    "type": "button",
    "actionType": "copy",
    "content": "http://www.baidu.com"
}
```

**属性表**

| 属性名     | 类型                         | 默认值 | 说明                                 |
| ---------- | ---------------------------- | ------ | ------------------------------------ |
| actionType | `string`                     | `copy` | 复制一段内容到粘贴板                 |
| content    | [模板](../concepts/template) | -      | 指定复制的内容。可用 `${xxx}` 取值。 |

## 刷新其他组件

**属性表**

| 属性名     | 类型     | 默认值   | 说明                                                                        |
| ---------- | -------- | -------- | --------------------------------------------------------------------------- |
| actionType | `string` | `reload` | 刷新目标组件                                                                |
| target     | `string` | -        | 需要刷新的目标组件名字（组件的`name`值，自己配置的），多个请用 `,` 号隔开。 |

## 组件特有的行为类型

### 表单中表格添加一行

该 actionType 为[FormItem-Table](./form/table)专用行为

### 重置表单

在 form 中，配置`"type": "reset"`的按钮，可以实现重置表单数据的功能

```schema:height="400" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "type": "text",
            "name": "username",
            "placeholder": "请输入用户名",
            "label": "用户名"
        },
        {
            "type": "password",
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

## 通用属性表

所有`actionType`都支持的通用配置项

| 属性名           | 类型                         | 默认值      | 说明                                                                                                                                                                  |
| ---------------- | ---------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type             | `string`                     | `action`    | 指定为 Page 渲染器。                                                                                                                                                  |
| actionType       | `string`                     | -           | 【必填】这是 action 最核心的配置，来指定该 action 的作用类型，支持：`ajax`、`link`、`url`、`drawer`、`dialog`、`confirm`、`cancel`、`prev`、`next`、`copy`、`close`。 |
| label            | `string`                     | -           | 按钮文本。可用 `${xxx}` 取值。                                                                                                                                        |
| level            | `string`                     | `default`   | 按钮样式，支持：`link`、`primary`、`secondary`、`info`、`success`、`warning`、`danger`、`light`、`dark`、`default`。                                                  |
| size             | `string`                     | -           | 按钮大小，支持：`xs`、`sm`、`md`、`lg`。                                                                                                                              |
| icon             | `string`                     | -           | 设置图标，例如`fa fa-plus`。                                                                                                                                          |
| iconClassName    | `string`                     | -           | 给图标上添加类名。                                                                                                                                                    |
| active           | `boolean`                    | -           | 按钮是否高亮。                                                                                                                                                        |
| activeLevel      | `string`                     | -           | 按钮高亮时的样式，配置支持同`level`。                                                                                                                                 |
| activeClassName  | `string`                     | `is-active` | 给按钮高亮添加类名。                                                                                                                                                  |
| block            | `boolean`                    | -           | 用`display:"block"`来显示按钮。                                                                                                                                       |
| confirmText      | [模板](../concepts/template) | -           | 当设置后，操作在开始前会询问用户。可用 `${xxx}` 取值。                                                                                                                |
| reload           | `string`                     | -           | 指定此次操作完后，需要刷新的目标组件名字（组件的`name`值，自己配置的），多个请用 `,` 号隔开。                                                                         |
| tooltip          | `string`                     | -           | 鼠标停留时弹出该段文字，也可以配置对象类型：字段为`title`和`content`。可用 `${xxx}` 取值。                                                                            |
| disabledTip      | `string`                     | -           | 被禁用后鼠标停留时弹出该段文字，也可以配置对象类型：字段为`title`和`content`。可用 `${xxx}` 取值。                                                                    |
| tooltipPlacement | `string`                     | `top`       | 如果配置了`tooltip`或者`disabledTip`，指定提示信息位置，可配置`top`、`bottom`、`left`、`right`。                                                                      |
| close            | `boolean`                    | -           | 当`action`配置在`dialog`或`drawer`的`actions`中时，配置为`true`指定此次操作完后关闭当前`dialog`或`drawer`。                                                           |
| required         | `Array<string>`              | -           | 配置字符串数组，指定在`form`中进行操作之前，需要指定的字段名的表单项通过验证                                                                                          |
