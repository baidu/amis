---
title: 数据映射
description:
type: 0
group: 💡 概念
menuName: 数据映射
icon:
order: 12
---

数据映射支持用户通过`${xxx}`或`$xxx`获取当前数据链中某个变量的值，实现灵活的数据配置功能，主要用于模板字符串、 自定义 `api` 请求数据体格式等场景。

## 模板字符串

```schema:height="200"
{
  "type": "page",
  "data": {
    "name": "rick"
  },
  "body": {
    "type": "tpl",
    "tpl": "my name is ${name}" // 输出: my name is rick
  }
}
```

**tip：** 默认 amis 在解析模板字符串时，遇到`$`字符会尝试去解析该变量并替换改模板变量，如果你想输出纯文本`"${xxx}"`或`"$xxx"`，那么需要在`$`前加转义字符`"\\"`，即`"\\${xxx}"`

```schema:height="200"
{
  "type": "page",
  "data": {
    "name": "rick"
  },
  "body": {
    "type": "tpl",
    "tpl": "my name is \\${name}"
  }
}
```

## 支持链式取值

可以使用`.`进行链式取值

```schema:height="200"
{
  "type": "page",
  "data": {
    "name": "rick",
    "company": {
      "name": "baidu",
      "department": "it"
    }
  },
  "body": {
    "type": "tpl",
    "tpl": "my name is ${name}, I work for ${company.name}" // 输出 my name is rick, I work for baidu
  }
}
```

## 自定义 api 请求体数据格式

在表单提交接口时，amis 默认的请求体数据格式可能不符合你的预期，不用担心，你可以使用数据映射定制想要的数据格式：

查看下面这种场景：

```schema:height="350" scope="body"
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
        "type": "text",
        "label": "邮箱："
      }
    ]
}
```

当输入姓名：`rick` 和邮箱：`rick@gmail.com` 后，`form` 获取当前的数据域，提交后端接口的数据格式应该是这样的：

```json
{
  "name": "rick",
  "email": "rick@gmail.com"
}
```

遗憾的是，你的后端接口只支持的如下的输入数据结构，且无法修改：

```json
{
  "userName": "xxx",
  "userEmail": "xxx@xxx.com"
}
```

这时，除了直接更改你的 姓名表单项 和 邮箱表单项 的`name`属性为相应的字段以外，你可以配置`api`的`data`属性，使用**数据映射**轻松实现**数据格式的自定义：**

```schema:height="350" scope="body"
{
    "type": "form",
    "api": {
        "method": "post",
        "url": "https://houtai.baidu.com/api/mock2/form/saveForm",
        "data": {
            "userName": "${name}",
            "userEmail": "${email}"
        }
    },
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名："
      },
      {
        "name": "email",
        "type": "text",
        "label": "邮箱："
      }
    ]
}
```

你可以查看网络面板，发送给后端接口的数据体应该已经成功修改为：

```json
{
  "userName": "rick",
  "userEmail": "rick@gmail.com"
}
```

## 复杂配置

### 展开所配置的数据

可以使用`"&"`，作为数据映射 key，展开所配置的变量，例如：

下面例子中，我们想在提交的时候，除了提交 `name` 和 `email` 变量以外，还想添加 `c` 下面的所有变量 `e`,`f`,`g`，但是按照之前所讲的， api 应该这么配置：

```schema:height="350" scope="body"
{
  "type": "form",
  "data": {
    "a": "1",
    "b": "2",
    "c": {
      "e": "3",
      "f": "4",
      "g": "5"
    }
  },
  "api": {
    "url": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "method": "post",
    "data": {
      "name": "${name}",
      "email": "${email}",
      "e": "${c.e}",
      "f": "${c.f}",
      "g": "${c.g}"
    }
  },
  "controls": [
    {
      "type": "text",
      "name": "name",
      "label": "姓名："
    },
    {
      "name": "email",
      "type": "text",
      "label": "邮箱："
    }
  ]
}
```

点击提交查看网络面板数据，你会发现数据是符合预期的：

```json
{
  "name": "rick",
  "email": "rick@gmail.comn",
  "e": "3",
  "f": "4",
  "g": "5"
}
```

但是当变量字段过多的时候，你需要一一映射配置，也许有点麻烦，所以可以使用`"&"`标识符，来展开所配置变量：

```schema:height="350" scope="body"
{
  "type": "form",
  "data": {
    "a": "1",
    "b": "2",
    "c": {
      "e": "3",
      "f": "4",
      "g": "5"
    }
  },
  "api": {
    "url": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "method": "post",
    "data": {
      "name": "${name}",
      "email": "${email}",
      "&": "${c}"
    }
  },
  "controls": [
    {
      "type": "text",
      "name": "name",
      "label": "姓名："
    },
    {
      "name": "email",
      "type": "text",
      "label": "邮箱："
    }
  ]
}
```

上例中我们 api.data 配置如下：

```json
"data": {
  "name": "${name}",
  "email": "${email}",
  "&": "${c}"
}
```

`"&"`标识符会将所配置的`c`变量的`value`值，展开并拼接在`data`中。查看网络面板可以看到数据如下：

```json
{
  "name": "rick",
  "email": "rick@gmail.comn",
  "e": "3",
  "f": "4",
  "g": "5"
}
```

### 数组提取值

```schema:height="350" scope="body"
{
    "type": "form",
    "api": {
        "method": "post",
        "url": "https://houtai.baidu.com/api/mock2/form/saveForm",
        "data": {
            "items": {
              "$table": {
                "a": "${a}",
                "c": "${c}"
              }
            }
        }
    },
    "controls": [
      {
        "type": "table",
        "name": "table",
        "label": "table",
        "columns": [
          {
            "label": "A",
            "name": "a"
          },
          {
            "label": "B",
            "name": "b"
          },
          {
            "label": "C",
            "name": "c"
          }
        ],
        "value": [
          {
            "a": "a1",
            "b": "b1",
            "c": "c1"
          },
          {
            "a": "a2",
            "b": "b2",
            "c": "c2"
          },
          {
            "a": "a3",
            "b": "b3",
            "c": "c3"
          }
        ]
      }
    ]
}
```

上例中的`api`的`data`配置格式如下：

```json
"data": {
    "items": {
      "$table": {
        "a": "${a}",
        "c": "${c}"
      }
    }
}
```

这个配置的意思是，只提取`table`数组中的`a`变量和`c`变量，组成新的数组，赋值给`items`变量

点击提交，查看浏览器网络面板可以发现，表单的提交数据结构如下：

```json
{
  "items": [
    {
      "a": "a1",
      "c": "c1"
    },
    {
      "a": "a2",
      "c": "c2"
    },
    {
      "a": "a3",
      "c": "c3"
    }
  ]
}
```

## 过滤器

过滤器是对数据映射的一种增强，它的作用是对获取数据做一些处理，基本用法如下：

```
${xxx [ |filter1 |filter2...] }
```

下面我们会逐一介绍每一个过滤器的用法。

> 过滤器可以 [串联使用](#串联使用过滤器)

### html

用于显示 html 文本。

##### 基本用法

```
${xxx | html}
```

```schema:height="200"
{
  "type": "page",
  "data": {
    "html": "<div>这是一段<code>html</code></div>"
  },
  "body": {
    "type": "tpl",
    "tpl": "html is: ${html|html}"
  }
}
```

### raw

不同场景下，在使用数据映射时，amis 可能默认会使用`html`过滤器对数据进行转义显示，这时如果想要输出原始文本，请配置`raw`过滤器。

##### 基本用法

使用`raw`可以直接输出原始文本

```
${xxx | raw}
```

```schema:height="200"
{
  "type": "page",
  "data": {
    "html": "<div>这是一段<code>html</code></div>"
  },
  "body": {
    "type": "tpl",
    "tpl": "html is: ${html|raw}"
  }
}
```

> **注意！！！**
>
> `raw`过滤器虽然支持显示原始文本，也就意味着可以输出 HTML 片段，但是动态渲染 HTML 是非常危险的，容易导致 **XSS** 攻击。
>
> 因此在 使用`raw`过滤器的时候，请确保变量的内容可信，且永远不要渲染用户填写的内容。

### json

用于将数据转换为`json`格式字符串

##### 基本用法

```
${xxx | json[:tabSize]}
```

```schema:height="200"
{
  "type": "page",
  "data": {
    "info": {
      "name": "rick",
      "company": "baidu"
    }
  },
  "body": {
    "type": "tpl",
    "tpl": "my info is ${info|json}" // 输出: my info is { "name": "rick", "company": "baidu" }
  }
}
```

##### 指定缩进数

```
${xxx|json:4} // 指定缩进为4个空格
```

### toJson

与[json](#json)相反，用于将`json`格式的字符串，转换为`javascript`对象

```
${xxx | toJson}
```

```schema:height="200"
{
  "type": "page",
  "data": {
    "info": "{\"name\": \"rick\", \"company\": \"baidu\"}"
  },
  "body": {
    "type": "tpl",
    "tpl": "my info is ${info|toJson}"
  }
}
```

对`Javascript`的直接输出会显示`[object Object]`，你可以使用 [json 过滤器](./data-mapping#json) 来格式化显示`json`文本。

### date

日期格式化过滤器，用于把特定时间值按指定格式输出。

##### 基本用法

```
${xxx | date[:format][:inputFormat]}
```

- **format**：需要展示的格式，默认为`'LLL'`，即本地化时间格式
- **inputFormat**：指定该变量值的格式，默认为`'X'`，即时间戳

具体参数的配置需要参考 [moment](https://momentjs.com/docs/)

```schema:height="200"
{
  "type": "page",
  "data": {
    "now": 1586865590
  },
  "body": {
    "type": "tpl",
    "tpl": "now is ${now|date}" // 输出: now is 2020年4月14日晚上7点59分
  }
}
```

##### 配置输出格式

例如你想将某一个时间值，以 `2020-04-14` 这样的格式输出，那么查找 moment 文档可知配置格式应为 `YYYY-MM-DD`，即：

```schema:height="200"
{
  "type": "page",
  "data": {
    "now": 1586865590
  },
  "body": {
    "type": "tpl",
    "tpl": "now is ${now|date:YYYY-MM-DD}" // 通过配置输出格式，输出: now is 2020-04-14
  }
}
```

##### 配置数据格式

如果你的数据值默认不是`X`格式（即时间戳格式），那么需要配置`inputformat`参数用于解析当前时间值，例如：

```schema:height="200"
{
  "type": "page",
  "data": {
    "now": "2020/4/14 19:59:50" // 查阅 moment 文档可知，需要配置数据格式为 "YYYY/MM/DD HH:mm:ss"
  },
  "body": {
    "type": "tpl",
    "tpl": "now is ${now|date:LLL:YYYY/MM/DD HH\\:mm\\:ss}" // 配置输出格式和数据格式，输出: now is 2020年4月14日晚上7点59分
  }
}
```

> **注意：** 在过滤器参数中使用`:`字符，需要在前面加`\\`转义字符

### number

自动给数字加千分位。

##### 基本用法

```
${xxx | number}
```

```schema:height="200"
{
  "type": "page",
  "data": {
    "price": 233333333
  },
  "body": {
    "type": "tpl",
    "tpl": "price is ${price|number}" // 输出: price is 233,333,333
  }
}
```

### trim

把变量值前后多余的空格去掉。

##### 基本用法

```
${xxx | trim}
```

### percent

##### 基本用法

```
${xxx | percent[:decimals]}
```

- **decimals**：指定小数点后`n`位数，默认为`0`

```schema:height="200"
{
  "type": "page",
  "data": {
    "value": 0.8232343
  },
  "body": {
    "type": "tpl",
    "tpl": "value is ${value|percent}" // 输出: value is 82%
  }
}
```

##### 指定小数点后位数

```schema:height="200"
{
  "type": "page",
  "data": {
    "value": 0.8232343
  },
  "body": {
    "type": "tpl",
    "tpl": "value is ${value|percent:2}" // 保留小数点后4位，输出: value is 82.32%
  }
}
```

### round

四舍五入取整

```
${xxx | round[:decimals]}
```

- **decimals**：指定小数点后`n`位小数，默认为`2`

```schema:height="200"
{
  "type": "page",
  "data": {
    "number1": 2.3,
    "number2": 2.6
  },
  "body": {
    "type": "tpl",
    "tpl": "number1 is ${number1|round}, number2 is ${number2|round}" // 输出: number1 is 2.30, number2 is 2.60
  }
}
```

##### 指定小数点后位数

```schema:height="200"
{
  "type": "page",
  "data": {
    "number": 2.6
  },
  "body": {
    "type": "tpl",
    "tpl": "number is ${number|round:0}" // 保留小数点后0位，输出: number is 3
  }
}
```

### truncate

当超出若干个字符时，后面的部分直接显示某串字符

##### 基本用法

```
${xxx | truncate[:length][:mask]}
```

- **length**：指定多长的字符后省略，默认为`200`
- **mask**：省略时显示的字符，默认为`"..."`

```schema:height="200"
{
  "type": "page",
  "data": {
    "text": "这是一段非常长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长的文字"
  },
  "body": {
    "type": "tpl",
    "tpl": "text is ${text|truncate:10}" // 输出: text is 这是一段非常长长长长...
  }
}
```

### url_encode

效果同 [encodeURIComponent() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)

##### 基本用法

```
${xxx | url_encode}
```

### url_decode

效果同 [decodeURIComponent() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)

##### 基本用法

```
${xxx | url_decode}
```

### default

当变量值为空时，显示其他值代替。

##### 基本用法

```
${xxx | default[:defaultValue]}
```

- **defaultValue**：显示的默认值

```schema:height="200"
{
  "type": "page",
  "data": {
    "value": "" // 或者是 null 或 undefined
  },
  "body": {
    "type": "tpl",
    "tpl": "value is ${value|default:-}" // 输出: value is -
  }
}
```

### split

可以将字符传通过分隔符分离成数组

##### 基本用法

```
${xxx | split[:delimiter]}
```

- **delimiter**：分隔值，默认为`,`

```schema:height="200"
{
  "type": "page",
  "data": {
    "array": "a,b,c"
  },
  "body": {
    "type": "tpl",
    "tpl": "array is ${array|split|json}" // 输出: array is ["a", "b", "c"]
  }
}
```

### join

当变量值是数组时，可以把内容连接起来。

##### 基本用法

```
${xxx | join[:glue]}
```

- **glue**：连接符，默认为`空字符`

```schema:height="200"
{
  "type": "page",
  "data": {
    "array": ["a", "b", "c"]
  },
  "body": {
    "type": "tpl",
    "tpl": "array is ${array|join}" // 输出: array is abc
  }
}
```

##### 配置连接符

```schema:height="200"
{
  "type": "page",
  "data": {
    "array": ["a", "b", "c"]
  },
  "body": {
    "type": "tpl",
    "tpl": "array is ${array|join:-}" // 输出: array is a,b,c
  }
}
```

### first

获取数组中的第一个值

##### 基本用法

```
${xxx | first}
```

```schema:height="200"
{
  "type": "page",
  "data": {
    "array": ["a", "b", "c"]
  },
  "body": {
    "type": "tpl",
    "tpl": "first element is ${array|first}" // 输出: first element is a
  }
}
```

### last

获取数组中的最后一个值

##### 基本用法

```
${xxx | last}
```

```schema:height="200"
{
  "type": "page",
  "data": {
    "array": ["a", "b", "c"]
  },
  "body": {
    "type": "tpl",
    "tpl": "last element is ${array|last}" // 输出: last element is c
  }
}
```

### nth

获取数组中的第`n`个值

##### 基本用法

```
${xxx | nth[:nth]}
```

- **nth**：指定获取第几个值

```schema:height="200"
{
  "type": "page",
  "data": {
    "array": ["a", "b", "c"]
  },
  "body": {
    "type": "tpl",
    "tpl": "second element is ${array|nth:1}" // 输出: second element is b
  }
}
```

**注意：** nth 配置`0`为获取第一个元素。

### pick

获取对象或数组中符合条件的筛选值

##### 基本用法

```
${xxx | pick[:path]}
```

- **path:** 指定筛选的模板，默认为`&`，即返回原数据

##### 在对象中获取某个 key 值

```schema:height="200"
{
  "type": "page",
  "data": {
    "object": {
      "a": 1,
      "b": 2,
      "c": 3
    }
  },
  "body": {
    "type": "tpl",
    "tpl": "a value of object is ${object|pick:a}" // 输出: a value of object is 1
  }
}
```

##### 遍历对象数组获取指定值

```schema:height="200"
{
  "type": "page",
  "data": {
    "array": [
      {
        "a": 1,
        "b": 2,
        "c": 3
      },
      {
        "a": 10,
        "b": 20,
        "c": 30
      },
      {
        "a": 100,
        "b": 200,
        "c": 300
      }
    ]
  },
  "body": {
    "type": "tpl",
    "tpl": "new array is ${array|pick:a|json}" // 输出: new array is [1, 10 ,100]
  }
}
```

##### 遍历数组对象，并自定义 key

```schema:height="200"
{
  "type": "page",
  "data": {
    "array": [
      {
        "aaa": 1,
        "bbb": 2,
        "ccc": 3
      },
      {
        "aaa": 10,
        "bbb": 20,
        "ccc": 30
      },
      {
        "aaa": 100,
        "bbb": 200,
        "ccc": 300
      }
    ]
  },
  "body": {
    "type": "tpl",
    "tpl": "new array is ${array|pick:a~aaa,b~bbb|json}"
    // 输出: new array is  [ { "a": 1, "b": 2 }, { "a": 10, "b": 20 }, { "a": 100, "b": 200 } ]
  }
}
```

### duration

秒值格式化成时间格式

##### 基本用法

```
${xxx | duration}
```

```schema:height="200"
{
  "type": "page",
  "data": {
    "time1": 2,
    "time2": 67,
    "time3": 1111111
  },
  "body": [
    {
        "type": "tpl",
        "tpl": "time1 is ${time1|duration}"
    },
    {
        "type": "divider"
    },
    {
        "type": "tpl",
        "tpl": "time2 is ${time2|duration}"
    },
    {
        "type": "divider"
    },
    {
        "type": "tpl",
        "tpl": "time3 is ${time3|duration}"
    }
  ]
}
```

### asArray

将数据包成数组

##### 基本用法

```
${xxx | asArray}
```

```schema:height="200"
{
  "type": "page",
  "data": {
    "value": "a"
  },
  "body": {
    "type": "tpl",
    "tpl": "new value is ${value|asArray|json}" // 输出: new value is ["a"]
  }
}
```

### lowerCase

将字符串转小写

##### 基本用法

```
${xxx | lowerCase}
```

```schema:height="200"
{
  "type": "page",
  "data": {
    "text": "World"
  },
  "body": {
    "type": "tpl",
    "tpl": "Hello ${text|lowerCase}" // 输出: Hello world
  }
}
```

### upperCase

将字符串转大写

##### 基本用法

```
${xxx | upperCase}
```

```schema:height="200"
{
  "type": "page",
  "data": {
    "text": "World"
  },
  "body": {
    "type": "tpl",
    "tpl": "Hello ${text|upperCase}" // 输出: Hello WORLD
  }
}
```

### base64Encode

base64 加密

##### 基本用法

```
${xxx | base64Encode}
```

```schema:height="200"
{
  "type": "page",
  "data": {
    "text": "World"
  },
  "body": {
    "type": "tpl",
    "tpl": "Hello ${text|base64Encode}" // 输出: Hello V29ybGQ=
  }
}
```

### base64Decode

base64 解密

##### 基本用法

```
${xxx | base64Decode}
```

```schema:height="200"
{
  "type": "page",
  "data": {
    "text": "V29ybGQ="
  },
  "body": {
    "type": "tpl",
    "tpl": "Hello ${text|base64Decode}" // 输出: Hello World
  }
}
```

### isTrue

真值条件过滤器

##### 基本用法

```
${xxx | isTrue[:trueValue][:falseValue]
```

- **trueValue**: 如果变量为 [真](https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy)，即返回该值；
- **falseValue**: 如果变量为 [假](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)，则返回该值。

> 配置`trueValue`和`falseValue`时，如果想要返回当前数据域中某个变量的值，那么参数可以直接配置变量名而不需要在两边添加引号；如果想返回某字符串，那么需要给参数两边添加单引号或双引号，
>
> 例如 `${xxx|isTrue:'foo':bar}`，当 `xxx` 变量为真，那么会返回 **字符串`'foo'`**，如果不为真，那么返回数据域中 **变量`bar`** 的值。

```schema:height="200"
{
  "type": "page",
  "data": {
    "value1": true,
    "value2": false
  },
  "body": [
    {
        "type": "tpl",
        "tpl": "value1：${value1|isTrue:'是真':'是假'}" // 输出: value是真
    },
    {
        "type": "divider"
    },
    {
        "type": "tpl",
        "tpl": "value2：${value2|isTrue:'是真':'是假'}" // 输出: value是真
    }
  ]
}
```

##### 返回数据域中变量

参数中不添加引号，可以直接返回数据域中变量值

```schema:height="200"
{
  "type": "page",
  "data": {
    "value1": true,
    "value2": false,
    "trueValue": "这个值是真的",
    "falseValue": "这个值是假的"
  },
  "body": [
    {
        "type": "tpl",
        "tpl": "value1：${value1|isTrue:trueValue:falseValue}" // 输出: value是真
    },
    {
        "type": "divider"
    },
    {
        "type": "tpl",
        "tpl": "value2：${value2|isTrue:trueValue:falseValue}" // 输出: value是真
    }
  ]
}
```

### isFalse

假值条件过滤器

##### 基本用法

```
${xxx | isFalse[:falseValue][:trueValue]
```

用法与 [isTrue 过滤器](#istrue) 相同，判断逻辑相反

### isMatch

模糊匹配条件过滤器

##### 基本用法

```
${xxx | isMatch[:matchParam][:trueValue][:falseValue]
```

- **matchParam**: 匹配关键字参数
  - 如果想模糊匹配特定字符串，那么参数需要在两边添加单引号或者双引号；
  - 如果想模糊匹配某个变量值，那么参数不需要添加引号。
- **trueValue**: 如果模糊匹配成功，即返回该值；
- **falseValue**: 如果模糊匹配失败，则返回该值。

```schema:height="200"
{
  "type": "page",
  "data": {
    "text1": "Hello",
    "text2": "World"
  },
  "body": [
    {
        "type": "tpl",
        "tpl": "${text1|isMatch:'hello':'匹配':'不匹配'}" // 输出: 匹配
    },
    {
        "type": "divider"
    },
    {
        "type": "tpl",
        "tpl": "${text2|isMatch:'hello':'匹配':'不匹配'}" // 输出: 匹配
    }
  ]
}
```

##### 返回数据域中变量

参数中不添加引号，可以直接返回数据域中变量值

```schema:height="200"
{
  "type": "page",
  "data": {
    "text1": "Hello",
    "text2": "World",
    "matchValue": "这个值匹配上了",
    "notmatchValue": "这个值没有匹配上"
  },
  "body": [
    {
        "type": "tpl",
        "tpl": "${text1|isMatch:'hello':matchValue:notmatchValue}" // 输出: 匹配
    },
    {
        "type": "divider"
    },
    {
        "type": "tpl",
        "tpl": "${text2|isMatch:'hello':matchValue:notmatchValue}" // 输出: 匹配
    }
  ]
}
```

### notMatch

##### 基本用法

```
${xxx | notMatch[:matchParam][:trueValue][:falseValue]
```

用法与 [isMatch](#isMatch) 相同，判断逻辑相反。

### isEquals

全等匹配过滤器

##### 基本用法

```
${xxx | isEquals[:equalsValue][:trueValue][:falseValue]
```

- **equalsValue**: 全等匹配关键字参数
  - 如果想判断等于特定字符串，那么参数需要在两边添加单引号或者双引号；
  - 如果想判断等于某个变量值，那么参数不需要添加引号。
- **trueValue**: 如果模糊匹配成功，即返回该值；
- **falseValue**: 如果模糊匹配失败，则返回该值。

```schema:height="200"
{
  "type": "page",
  "data": {
    "text1": "Hello",
    "text2": "hello"
  },
  "body": [
    {
        "type": "tpl",
        "tpl": "${text1|isEquals:'Hello':'等于':'不等于'}" // 输出: 等于
    },
    {
        "type": "divider"
    },
    {
        "type": "tpl",
        "tpl": "${text2|isEquals:'Hello':'等于':'不等于'}" // 输出: 等于
    }
  ]
}
```

##### 返回数据域中变量

参数中不添加引号，可以直接返回数据域中变量值

```schema:height="200"
{
  "type": "page",
  "data": {
    "text1": "Hello",
    "text2": "hello",
    "equalsValue": "这个值等于'Hello'",
    "notequalsValue": "这个值不等于'Hello'"
  },
  "body": [
    {
        "type": "tpl",
        "tpl": "${text1|isEquals:'Hello':equalsValue:notequalsValue}" // 输出: 等于
    },
    {
        "type": "divider"
    },
    {
        "type": "tpl",
        "tpl": "${text2|isEquals:'Hello':equalsValue:notequalsValue}" // 输出: 等于
    }
  ]
}
```

### notEquals

不全等匹配过滤器

##### 基本用法

```
${xxx | notEquals[:equalsValue][:trueValue][:falseValue]
```

用法与 [isEquals](#isEquals) 相同，判断逻辑相反。

### filter

过滤数组，操作对象为数组，当目标对象不是数组时将无效。

##### 基本用法

```
${xxx | filter[:keys][:directive][:arg1]}
```

- **keys**: 参与过滤的字段集合
- **directive**: 用于过滤数组的指令，包含下面这几种
  - `isTrue` 目标值为真通过筛选。
  - `isFalse` 目标值为假时通过筛选。
  - `isExists` 目标值是否存在。
  - `match` 模糊匹配后面的参数。`${xxx|filter:a,b:match:keywords}` 表示 xxx 里面的成员，如果字段 a 或者 字段 b 模糊匹配 keywords 变量的值，则通过筛选。
  - `equals` 相对于模糊匹配，这个就相对精确匹配了，用法跟 `match` 一样。
  - `isIn` 目标值是否在一个范围内？`${xxx|filter:yyy:isIn:a,b}` xxx 数组内的 yyy 变量是否是字符串 `"a"` 或者 `"b"`，如果要取变量就是 `${xxx|filter:yyy:isIn:zzz}` xxx 数组内的 yyy 属性，必须在 zzz 变量这个数组内。
  - `notIn`目标值是否不在一个范围内，参考 `isIn`。
  
- **arg1**: 字符串或变量名

  比如: `${xxx|filter:readonly:isTrue}` 将 xxx 数组中 readonly 为 true 的成员提取出来。
  再来个栗子：`${xxx|filter:a,b:match:keywords}` 将 xxx 数组中成员变量 a 或者 b 的值与环境中 keywords 的值相匹配的提取出来。如果不需要取变量，也可以写固定值如：`${xxx|filter:a,b:match:'123'}`

## 串联使用过滤器

使用单一的过滤器可能无法满足你的所有需求，幸运的是 amis 支持串联使用过滤器，而前一个过滤器的值会作为下一个过滤器的入参，进行下一步处理。语法如下:

```
${xxx|filter1|filter2|...}
```

##### 先拆分字符串，再获取第 n 个值

```schema:height="200"
{
  "type": "page",
  "data": {
    "value":"a,b,c"
  },
  "body": {
    "type": "tpl",
    "tpl": "${value|split|first}" // 输出: a
  }
}
```

上例子中`${value|split|first}`，会经历下面几个步骤：

1. 会先执行`split`过滤器，将字符串`a,b,c`，拆分成数组`["a", "b", "c"]`；
2. 然后将该数据传给下一个过滤器`first`，执行该过滤器，获取数组第一个元素，为`"a"`
3. 输出`"a"`
