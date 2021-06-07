---
title: 数据域与数据链
description:
type: 0
group: 💡 概念
menuName: 数据域与数据链
icon:
order: 10
---

## 基本的数据展示

我们再看之前的简单示例：

```json
{
  "type": "page",
  "body": "Hello World!"
}
```

目前我们只是在 `Page` 组件中渲染一串固定的文本，如何实现 **通过接口拉取想要的数据，并展示到 `Page` 组件的内容区** 呢？

## 添加初始化接口

```json
{
  "type": "page",
  "initApi": "/api/mock2/page/initData",
  "body": "date is ${date}"
}
```

这个 api 接口返回的数据结构如下：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "title": "Test Page Component",
    "date": "2017-10-13"
  }
}
```

渲染后页面效果：

```schema
{
  "type": "page",
  "initApi": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData",
  "body": "date is ${date}"
}
```

## 发生了什么?

我们可以看到，输出结果不变，但是我们这次渲染的是接口返回的数据：

1. 首先我们给 `Page` 组件配置了`initApi`属性，该属性会在组件初始化时，请求所该属性所配置的接口
2. 接口请求成功后，`Page` 会把接口返回的`data`内数据存到当前的数据域中
3. `Page` 在渲染 `body` 所配置的文本时，会解析文本内容，当解析到模板变量`${text}`时，amis 会把尝试在当前组件的数据域中获取`text`变量值，并替换掉`${text}`，最后渲染解析后的文本。

> 下一节我们会介绍[模板](./template)，`body`属性自身支持模板语法，amis 中支持模板语法的组件还有很多

## 数据域

前面我们提到了**数据域**这个概念，它是 amis 中最重要的概念之一。

还是通过最简单的示例进行讲解：

```json
{
  "type": "page",
  "body": "Hello ${text}"
}
```

上面的配置要做的很简单：使用 `Page` 组件，在内容区内渲染一段模板文字，其中`${text}`是**模板变量**，它会去到当前组件的数据域中，获取`text`变量值。

毫无疑问，`${text}`将会解析为空白文本，最终渲染的文本是 `Hello`

```schema
{
  "type": "page",
  "body": "Hello ${text}"
}
```

因为当前 `Page` 组件的数据域中是没有任何数据的，相比之前的示例，区别在于前面我们为 `Page` 组件配置了初始化接口，它会将接口返回的数据存入数据域中以供组件使用。

再观察下面这段配置：

```schema
{
  "data": {
    "text": "World!"
  },
  "type": "page",
  "body": "Hello ${text}"
}
```

再次查看渲染结果，顺利输出了 `Hello World!`

相信你可能已经猜到，**组件的`data`属性值是数据域的一种形式**，实际上当我们没有显式的配置数据域时，可以假想成这样：

```schema
{
  "data": {}, // 空的数据域
  "type": "page",
  "body": "Hello ${text}"
}
```

> 而前面我们知道 amis 的特性之一是基于组件树，因此自然数据域也会形成类似于树型结构，如何来处理这些数据域之间的联系呢，这就是我们马上要介绍到的 **[数据链](./datascope-and-datachain#%E6%95%B0%E6%8D%AE%E9%93%BE)**

## 数据链

相信通过上文，你已经基本掌握了 amis 中数据域的概念，接下来我们会介绍另一个重要概念：**数据链**。

**数据链**的特性是，当前组件在遇到获取变量的场景（例如模板渲染、展示表单数据、渲染列表等等）时：

1. 首先会先尝试在当前组件的数据域中寻找变量，当成功找到变量时，通过数据映射完成渲染，停止寻找过程；
2. 当在当前数据域中没有找到变量时，则向上寻找，在父组件的数据域中，重复步骤`1`和`2`；
3. 一直寻找，直到顶级节点，也就是`page`节点，寻找过程结束。
4. 但是如果 url 中有参数，还会继续向上查找这层，所以很多时候配置中可以直接 `${id}` 取地址栏参数。

> 为了方便讲解，我们这一章的例子统一使用的设置组件`data`属性的方式来初始化数据域，请记住，如果组件支持，你永远可以通过接口来进行数据域的初始化

继续来看这个例子：

```schema
{
  "type": "page",
  "data": {
    "name": "zhangsan",
    "age": 20
  },
  "body": [
    {
      "type": "tpl",
      "tpl": "my name is ${name}"
    },
    {
      "type": "service",
      "data": {
        "name": "lisi"
      },
      "body":  {
        "type": "tpl",
        "tpl": "my name is ${name}, I'm ${age} years old"
      }
    }
  ]
}
```

上面的配置项形成了如下的组件树和数据链：

组件树：

```
page
  ├─ tpl
  └─ service
       └─ tpl
```

数据链：

```json
{
  "name": "zhangsan",
  "age": 20,
  "__sub": {
    "name": "lisi"
  }
}
```

> `__sub` 字段只是为了方便理解。

首先，`page`组件下的`tpl`组件，在渲染`my name is ${name}`时，首先会在`page`的数据域中，尝试寻找`name`变量，在当前数据域中，`name`变量为`zhangsan`，因此寻找变量结束，通过数据映射渲染，输出：`my name is zhangsan`，渲染结束；

然后，`service`组件开始渲染，`service`组件内子组件`tpl`，它配置的模板字符串是：`my name is ${name}, I'm ${age} years old`，它会在`service`的数据域中，尝试寻找`name`和`age`变量。

由代码可以看出，`service`数据域中`name`变量为`lisi`，因此停止该变量的寻找，接下来寻找`age`变量。

很明显在`service`数据域中寻找`age`变量会失败，因此向上查找，尝试在`page`数据域中寻找`age`变量，找到为`20`，寻找变量结束，通过数据映射渲染，输出：`my name is lisi, I'm 20 years old`，渲染结束。

> **注意：** 当前例子中，对数据域中数据的获取使用的是 **\${xxx}** 模板语法，但是在不同的组件配置项中，获取数据的语法会有差异，我们会在后续的[模板](./template)和[表达式章节](./expression)中一一介绍。

### 常见误解

需要注意，只有少数几个容器组件会创建新的数据域，除了最顶层的 Page，还有 CRUD、Dialog、IFrame、Form、Service 等。

常见的错误写法是给容器组件加 data 属性，比如：

```schema
{
  "type": "page",
  "data": {
    "name": "zhangsan"
  },
  "body": [
    {
      "type": "tpl",
      "tpl": "my name is ${name}"
    },
    {
      "type": "container",
      "data": {
        "name": "lisi"
      },
      "body":  {
        "type": "tpl",
        "tpl": "my name is ${name}"
      }
    }
  ]
}
```

这样是不会生效的，正确的做法是使用 Service 包裹一层，如下所示

```schema
{
  "type": "page",
  "data": {
    "name": "zhangsan"
  },
  "body": [
    {
      "type": "tpl",
      "tpl": "my name is ${name}"
    },
    {
      "type": "service",
      "data": {
        "name": "lisi"
      },
      "body": {
        "type": "container",
        "body":  {
          "type": "tpl",
          "tpl": "my name is ${name}"
        }
      }
    }
  ]
}
```

## 初始化数据域

通过上面的介绍你可能发现，初始化数据域有两种方式：

### 1. 配置组件初始化接口

想要将自己的服务中的数据保存到某个组件的数据域中，最好的方式就是为当前组件配置初始化接口：

```json
{
  "type": "page",
  "initApi": "/api/initData",
  "body": "Hello ${text}"
}
```

接口必须按照下面的格式返回：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "text": "World!"
    ...其他字段
  }
}
```

**注意：**

1. **并不是所有组件都支持配置初始化接口来实现数据域初始化操作**，对于那些不支持配置初始化接口的组件来说，一般会使用 [**Service 组件**](../components/service) 来辅助实现数据域初始化；
2. **`status`**、**`msg`** 和 **`data`** 字段为接口返回的必要字段；
3. `data`必须返回一个具有`key-value`结构的对象

```json
{
  "status": 0,
  "msg": "",
  "data": { // 正确
    "text": "World!"
  }
}

// 直接返回字符串或者数组都是无效的
{
  "status": 0,
  "msg": "",
  "data": "some string" // 错误，使用 key 包装
}
{
  "status": 0,
  "msg": "",
  "data": ["a", "b"] // 错误，使用 key 包装
}
```

> `api` 除了配置字符串格式以外，还可以配置复杂对象结构，更多详情查看[API 文档](../types/api)

### 2. 显式配置 data 属性值

另一种初始化当前数据域的方式是显式的设置组件的`data`属性值：

```schema
{
  "data": {
    "text": "World!",
    "name": "amis"
  },
  "type": "page",
  "body": "Hello ${text}, my name is ${name}."
}
```

### 同时配置

在同时配置 **初始化接口** 和 **`data`属性** 时，数据域将会合并`data`属性值和初始化接口返回的数据

## 更新数据域

部分组件的某些交互或行为会对当前组件的数据域进行更新：

```schema
{
  "type": "page",
  "body": {
    "type": "form",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "body": [
      {
        "type": "input-text",
        "name": "name",
        "label": "姓名："
      },
      {
        "type": "input-text",
        "name": "age",
        "label": "年龄："
      },
      {
        "type": "static-tpl",
        "tpl": "生成的id为：${id}"
      }
    ]
  }
}
```

`/api/saveForm`接口会保存当前表单提交的数据，并返回后端服务生成的`id`，并返回到前端，格式如下;

```json
{
  "status": 0,
  "msg": "保存成功",
  "data": {
    "id": 1
  }
}
```

这时 amis 将会把`data`数据与当前`form`组件的数据域进行**merge**，`form`组件中的`static-tpl`组件会根据更新后的数据域，显示`id`为`1`。

> 具有类似特征的组件还有`Formula`等
