---
title: 模板
description:
type: 0
group: 💡 概念
menuName: 模板
icon:
order: 11
---

为了可以更加灵活渲染文本、数据结构，amis 借鉴其他模板引擎，实现了一套模板渲染功能。

## 模板字符串

### 普通文本

配置一段普通文本并输出

```schema
{
  "type": "page",
  "body": "Hello World!" // 输出 Hello World!
}
```

### 文本中获取变量

可以支持在普通文本中，使用**数据映射**语法：`${xxx}` 获取数据域中变量的值，如下

```schema
{
  "data": {
    "text": "World!"
  },
  "type": "page",
  "body": "Hello ${text}" // 输出 Hello World!
}
```

更多`${xxx}`语法相关介绍，移步 [数据映射](./data-mapping)。

### 渲染 html

使用**数据映射**语法：`${xxx}` 获取数据域中变量的值，并渲染 HTML

```schema
{
  "data": {
    "text": "World!"
  },
  "type": "page",
  "body": "<h1>Hello</h1> <span>${text}</span>"
}
```

如果是变量本身有 html，则需要使用 raw 过滤

```schema
{
  "data": {
    "text": "<b>World!</b>"
  },
  "type": "page",
  "body": "<h1>Hello</h1> <span>${text|raw}</span>"
}
```

### 表达式

> 1.5.0 及以上版本

支持简单的表达式运算以及公式调用，具体请查看[新表达式语法](./expression#新表达式语法)

```json
{
  "type": "tpl",
  "tpl": "${xxx == 1 ? 'One' : 'Others'}"
}
```

## JavaScript 模板引擎

amis 还支持用 JavaScript 模板引擎进行组织输出，内部采用 [lodash template](https://lodash.com/docs/4.17.15#template) 进行实现。

```schema
{
    "type": "page",
    "data": {
        "user": "no one",
        "items": [
            "A",
            "B",
            "C"
        ]
    },
    "body": [
        {
            "type": "tpl",
            "tpl": "User: <%= data.user %>"
        },
        {
            "type": "divider"
        },
        {
            "type": "tpl",
            "tpl": "<% if (data.items && data.items.length) { %>Array: <% data.items.forEach(function(item) { %> <span class='label label-default'><%= item %></span> <% }); %><% } %>"
        }
    ]
}
```

> 注意到了吗？
>
> 在 JavaScript 模板引擎中，我们获取数据域变量的方式是`data.xxx`，而不是之前的`${xxx}`，如果你熟悉 JavaScript 的话，这里模板引擎其实是将数据域，当做当前代码的数据作用域进行执行，因此需要使用`data.xxx`进行取值
>
> 要注意使用模板的时候在不同的场景下要使用正确的取值方式。

仔细看示例不难发现，语法跟 ejs 很像，`<% 这里面是 js 语句 %>`，所以只要会写 js，做页面渲染没有什么问题。另外以下是一些可用 js 方法。

- `formatDate(value, format='LLL', inputFormat='')`格式化时间格式，关于 format 请前往 [moment](https://momentjs.com/docs/) 文档页面。
- `formatTimeStamp(value, format='LLL')` 格式化时间戳为字符串。
- `formatNumber(number)` 格式化数字格式，加上千分位。
- `countDown(value)` 倒计时，显示离指定时间还剩下多少天，只支持时间戳。

下面 filters 中的方法也可以使用如： `<%= date(data.xxx, 'YYYY-MM-DD') %>`

## 注意事项

#### 1. 模板字符串 和 Javascript 模板引擎 不可以交叉使用

例如：

```json
{
  "type": "tpl",
  "tpl": "${data.xxx === 'a'}" //错误！
}
```

```json
{
  "type": "tpl",
  "tpl": "${xxx === 'a'}" // 正确
}
```
