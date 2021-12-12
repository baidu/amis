---
title: 表达式
description:
type: 0
group: 💡 概念
menuName: 表达式
icon:
order: 13
---

一般来说，属性名类似于`xxxOn` 或者 `className` 的配置项，都可以使用表达式进行配置，表达式具有如下的语法：

```json
{
  "type": "tpl",
  "tpl": "当前作用域中变量 show 是 1 的时候才可以看得到我哦~",
  "visibleOn": "this.show === 1"
}
```

其中：`this.show === 1` 就是表达式。

## 表达式语法

> 表达式语法实际上是 JavaScript 代码，更多 JavaScript 知识查看 [这里](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)。
>
> 表达式中不要使用`${xxx}`语法，这个是数据映射的语法规则，不要搞混淆了！

在 amis 的实现过程中，当正则匹配到某个组件存在`xxxOn`语法的属性名时，会尝试进行下面步骤（以上面配置为例）：

1. 提取`visibleOn`配置项配置的 JavaScript 语句`this.show === 1`，并以当前组件的数据域为这段代码的数据作用域，执行这段 js 代码；
2. 之后将执行结果赋值给`visible`并添加到组件属性中
3. 执行渲染。当前示例中：`visible`代表着是否显示当前组件；

组件不同的配置项会有不同的效果，请大家在组件文档中多留意。

> 表达式的执行结果预期应该是`boolean`类型值，如果不是，amis 会根据 JavaScript 的规则将结果视作`boolean`类型进行判断

## 新表达式语法

> 1.5.0 及以上版本

原来的表达式用的就是原生 js，灵活性虽大，但是安全性不佳，为了与后端公式保持统一，故引入了新的规则，如：`${这里是表达式}`，也就是说如果开始字符是 `${` 且 `}` 结尾则认为是新版本的表达式。这个规则与模板中的语法保持一致。

- `${a == 1}` 变量 a 是否和 1 相等
- `${a % 2}` 变量 a 是否为偶数。

表达式中的语法与默认模板中的语法保持一致，所以以下示例直接用模板来方便呈现结果。

```schema
{
  "type": "page",
  "data": {
    "a": 1,
    "key": "y",
    "obj": {
      "x": 2,
      "y": 3
    },
    "arr": [1, 2, 3]
  },
  "body": [
    "a is ${a} <br />",
    "a + 1 is ${a + 1} <br />",
    "obj.x is ${obj.x} <br />",
    "obj['x'] is ${obj['x']} <br />",
    "obj[key] is ${obj[key]} <br />",
    "arr[0] is ${arr[0]} <br />",
    "arr[a] is ${arr[a]} <br />",
    "arr[a + 1] is ${arr[a + 1]} <br />",
  ]
}
```

### 公式

除了支持简单表达式外，还集成了很多公式(函数)如：

```schema
{
  "type": "page",
  "data": {
    "a": "",
    "语文成绩": 81
  },
  "body": [
    "1, 2, 3, 4 的平均数位 ${ AVG(1, 2, 3, 4)}",

    "当前成绩：${IF(语文成绩 > 80, '优秀', '继续努力')}"
  ]
}
```

!!!include(amis-formula/dist/doc.md)!!!
