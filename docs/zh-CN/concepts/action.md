---
title: 行为
description:
type: 0
group: 💡 概念
menuName: 行为
icon:
order: 12
---

页面的交互操作，例如：**提交表单、显示一个弹框、跳转页面、复制一段文字到粘贴板**等等操作，都可以视作页面的一种**行为**。

在 amis 中，大部分 **行为** 是跟 **行为按钮组件** 进行绑定的，也就是说，当你想要配置一个行为，大部分情况下你应该遵循下面的步骤：

1. 添加一个 **行为按钮组件**；
2. 配置当前 **行为类型（actionType）**；
3. 根据当前行为类型，配置你想要的 **属性**。

## 如何配置行为？

### 通过行为按钮

```schema: scope="body"
{
    "type": "action",
    "label": "发出一个请求",
    "actionType": "ajax",
    "api": "/api/mock2/form/saveForm"
}
```

1. 在`page`内容区中，添加一个`action`行为按钮组件
2. 配置当前行为类型是 ajax（即发送一个 ajax 请求)
3. 配置请求 api，值为 API 类型

现在点击该按钮，你会发现浏览器发出了这个`ajax`请求。

很简单是吧？我们再来一个例子：

```schema: scope="body"
{
    "type": "action",
    "label": "弹个框",
    "actionType": "dialog",
    "dialog": {
      "title": "弹框",
      "body": "Hello World!"
    }
}
```

这次我们配置`actionType`为`dialog`，意味着点击该按钮会弹出一个模态框，并配置`dialog`内容，来显示字符串`Hello World!`

> `dialog`是容器，也就意味着可以在`body`属性中配置其他组件

完整的行为列表可以查看 [action](../../components/action)组件

### 组件所支持的行为

一些特殊组件，例如 Chart 组件 中的图表点击行为，可以直接配置`clickAction`，来配置行为对象。
