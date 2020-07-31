---
title: 配置与组件
description: 配置与组件
type: 0
group: 💡 概念
menuName: 配置与组件
icon:
order: 9
---

## 最简单的 amis 配置

一个最简单的 amis 配置看起来是这样的：

```json
{
  "type": "page",
  "body": "Hello World!"
}
```

请观察上面的代码，这是一段普通的 JSON 格式文本，它的含义是：

1. `type`是每一个 amis 节点中，最重要的一个字段，它会告诉 amis 当前节点需要渲染的是`Page`组件
2. 而`body`字段会被看作是`Page`组件的属性，将该属性值所配置的内容，渲染到`Page`组件的内容区中

上面配置通过 amis 的处理，会渲染出一个简单的页面，并在页面中展示文字：`Hello World!`，就像下面这样：

```schema:height="200"
{
  "type": "page",
  "body": "Hello World!"
}
```

后续章节中，你会经常看到例如上面这样，支持**实时编辑配置预览效果**的页面配置预览工具，它可以帮助你更直观的看到具体配置所展示的页面效果。

## 组件

上面提到，`type`字段会告诉 amis 当前节点渲染的组件为`Page`，`Page` 属于 amis 内置组件之一。

组件节点的配置永远都是由 **`type`字段** （用于标识当前是哪个组件）和 **若干属性值** 构成的。

```
{
  "type": "xxx",
  ...若干属性值
}
```

## 组件树

这次我们看一个稍微复杂一点的配置：

```json
{
  "type": "page",
  "body": {
    "type": "tpl",
    "tpl": "Hello World!"
  }
}
```

该配置渲染页面如下：

```schema:height="200"
{
  "type": "page",
  "body": {
    "type": "tpl",
    "tpl": "Hello World!"
  }
}
```

看起来和之前的示例没啥区别，但是发现和之前不同的地方了吗？

这次 `Page` 组件的 `body` 属性值，我们配置了一个对象，**通过`type`指明`body`内容区内会渲染一个叫`Tpl`的组件**，它是一个模板渲染组件，这里我们先只是配置一段固定文字。

它是 `Page` 的子节点。

再来观察下面这个配置:

```schema:height="320" scope="body"
[
    {
      "type": "tpl",
      "tpl": "Hello World!"
    },
    {
        "type": "divider"
    },
    {
      "type": "form",
      "controls": [
        {
          "type": "text",
          "name": "name",
          "label": "姓名"
        }
      ]
    }
]
```

我们通过数组的形式，在内容区配置`tpl`和`form`组件。

没错，`body` 属性支持数组结构，这也就意味着你可以 **通过组件树的形式** 渲染出足够复杂的页面。

具有`body`这类属性的组件一般称为**容器型组件**，就如名字所形容的，这类组件可以作为容器，在他们的子节点配置若干其他类型的组件，amis 中还有很多类似的组件，例如`Form`、`Service`等，后续我们会逐一进行介绍。

> **注意：**
>
> `Page`是一个特殊的容器组件，它是 amis 页面配置中 **必须也是唯一的顶级节点**
