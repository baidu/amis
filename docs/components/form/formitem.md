---
title: FormItem 普通表单项
description:
type: 0
group: null
menuName: Formula 普通表单项
icon:
order: 1
---

**表单项** 是组成一个表单的基本单位，它具有的一些特性会帮助我们更好地实现表单操作。

> 所有派生自`FormItem`的组件，都具有`FormItem`的特性。

## 基本用法

最基本的表单项配置像这样：

```schema:height="300" scope="body"
{
  "type": "form",
  "controls": [
    {
      "type": "text",
      "label": "文本框",
      "name": "text"
    }
  ]
}
```

- `name`: **必填属性**，标识表单数据域中，当前表单项值的`key`
- `type`: **必填属性**，标识表单项类型
- `label`: 标识表单项的标签

> 所有表单项都只可以配置在`form`组件中，即`form`的`controls`属性中。

## 表单项展示

### 内联模式

通过配置`"mode": "inline"`，标识当前表单项使用内联模式。

```schema:height="320" scope="body"
{
  "type": "form",
  "controls": [
    {
      "type": "text",
      "label": "常规",
      "name": "text1"
    },
    {
      "type": "text",
      "label": "内联",
      "name": "text2",
      "mode": "inline"
    }
  ]
}
```

### 表单项尺寸

可以配置`size`，来调整表单项的尺寸，支持`'xs' | 'sm' | 'md' | 'lg' | 'full'`，如下：

```schema:height="550" scope="body"
{
  "type": "form",
  "controls": [
    {
      "type": "text",
      "label": "极小",
      "name": "text-xs",
      "size": "xs"
    },
    {
      "type": "text",
      "label": "小",
      "name": "text-sm",
      "size": "sm"
    },
    {
      "type": "text",
      "label": "中",
      "name": "text-md",
      "size": "md"
    },
    {
      "type": "text",
      "label": "大",
      "name": "text-lg",
      "size": "lg"
    },
    {
      "type": "text",
      "label": "占满",
      "name": "text-lg",
      "size": "full"
    }
  ]
}
```

> 不同组件的`size`效果可能会有所不同，具体请参考对应的组件文档。

### 表单项标签

设置`label`属性来配置表单项标签。

当表单为水平布局时，左边即便是不设置`label`为了保持对齐也会留空，如果想要去掉空白，请设置成`false`。

```schema:height="350" scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "controls": [
    {
      "type": "text",
      "label": "常规",
      "name": "text1",
      "placeholder": "常规标签"
    },
    {
      "type": "text",
      "label": "",
      "name": "text1",
      "placeholder": "不显示标签"
    },
    {
      "type": "text",
      "label": false,
      "name": "text1",
      "placeholder": "不显示标签且清除空间"
    }
  ]
}
```

### 表单项标签提示

配置`labelRemark`可以实现标签描述提示

```schema:height="350" scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "controls": [
    {
      "type": "text",
      "label": "无标签提示",
      "name": "text1"
    },
    {
      "type": "text",
      "label": "有标签提示",
      "labelRemark": "这是一段提示",
      "name": "text2"
    },
    {
      "type": "text",
      "label": "更复杂的标签提示",
      "labelRemark": {
        "type": "remark", "title": "提示", "content": "<pre>first \nsecond\n${text1}</pre>"
      },
      "name": "text3"
    }
  ]
}
```

### 配置禁用

##### 静态配置

通过配置`"disabled": true`来禁用表单项

```schema:height="350" scope="body"
{
  "type": "form",
  "controls": [
    {
      "type": "text",
      "label": "常规",
      "name": "text1"
    },
    {
      "type": "text",
      "label": "禁用",
      "name": "text2",
      "disabled": true
    }
  ]
}
```

##### 通过条件配置是否禁用

你也通过[表达式](../../concepts/expression)配置`disabledOn`，来实现在某个条件下禁用当前表单项.

```schema:height="400" scope="body"
{
  "type": "form",
  "controls": [
    {
      "type": "number",
      "label": "数量",
      "name": "number",
      "value": 0,
      "description": "调整数量大小查看效果吧！"
    },
    {
      "type": "text",
      "label": "文本",
      "name": "text",
      "disabledOn": "this.number > 1",
      "description": "当数量大于1的时候，该文本框会被禁用"
    }
  ]
}
```

### 配置显隐

##### 静态配置

通过配置`"hidden": true`或者`"visible": false`来禁用表单项

```schema:height="300" scope="body"
{
  "type": "form",
  "controls": [
    {
      "type": "text",
      "label": "常规",
      "name": "text1"
    },
    {
      "type": "text",
      "label": "隐藏",
      "name": "text2",
      "hidden": true
    }
  ]
}

```

上例中的`text2`被隐藏了。

##### 通过条件配置显隐

你也通过[表达式](../../concepts/expression)配置`hiddenOn`，来实现在某个条件下禁用当前表单项.

```schema:height="400" scope="body"
{
  "type": "form",
  "controls": [
    {
      "type": "number",
      "label": "数量",
      "name": "number",
      "value": 0,
      "description": "调整数量大小查看效果吧！"
    },
    {
      "type": "text",
      "label": "文本",
      "name": "text",
      "hiddenOn": "this.number > 1",
      "description": "当数量大于1的时候，该文本框会隐藏"
    }
  ]
}
```

> `visible`和`hidden`，`visibleOn`和`hiddenOn`除了判断逻辑相反以外，没有任何区别

## 表单项值

表单项值，即表单项通过用户交互发生变化后，更新表单数据域中同`name`变量值.

```schema:height="350" scope="body"
{
  "type": "form",
  "debug": true,
  "controls": [
    {
      "type": "text",
      "label": "姓名",
      "name": "name"
    }
  ]
}
```

如上例，更改姓名表单项值，可以改变表单数据域中`name`变量的值。

也支持链式配置 `name`属性，例如：`aaa.bbb`

```schema:height="350" scope="body"
{
  "type": "form",
  "debug": true,
  "controls": [
    {
      "type": "text",
      "label": "姓名",
      "name": "person.name"
    }
  ]
}
```

观察上例，这样更改表单项值，会改变数据域中`person.name`的值

```json
{
  "person": {
    "name": "xxx"
  }
}
```

## 配置默认值

通过配置`value`属性，可以设置表单项的默认值。

```schema:height="320" scope="body"
{
  "type": "form",
  "controls": [
    {
      "type": "text",
      "label": "text",
      "name": "text",
      "value": "hello world!",
      "description": "拥有默认值的 text"
    }
  ]
}
```

`value`不支持数据映射，也就是说不可以直接配置类似于这样的语法：`${xxx}`，如果想要映射当前数据域中的某个变量，那么设置该表单项`name`为该变量名就行，如下：

```schema:height="300" scope="body"
{
  "type": "form",
  "data":{
    "text": "hello world!"
  },
  "controls": [
    {
      "type": "text",
      "label": "text",
      "name": "text",
      "description": "拥有默认值的 text"
    }
  ]
}
```

上例中我们表单数据域中有变量`"text": "hello world!"`，然后我们设置表达项`"name": "text"`，这样就可以自动映射值了。

## 表单项必填

### 静态配置

通过配置`"required": true`来标识该表单项为必填。

```schema:height="300" scope="body"
{
  "type": "form",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "text",
      "label": "常规",
      "name": "text",
      "required": true
    }
  ]
}
```

### 满足条件校验必填

你也通过[表达式](../../concepts/expression)配置`requiredOn`，来实现在某个条件下使当前表单项必填。

```schema:height="400" scope="body"
{
  "type": "form",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "number",
      "label": "数量",
      "name": "number",
      "value": 0,
      "description": "调整数量大小查看效果吧！"
    },
    {
      "type": "text",
      "label": "文本",
      "name": "text",
      "requiredOn": "this.number > 1",
      "description": "当数量大于1的时候，该文本框为必填"
    }
  ]
}
```

## 格式校验

可以配置`validations`属性，指定校验当前表单项值的格式

可以通过对象形式配置

```schema:height="400" scope="body"
{
  "type": "form",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "text",
      "label": "文本",
      "name": "text",
      "validations": {
        "isNumeric": true
      },
      "description": "请输入数字类型文本"
    }
  ]
}
```

同样也可以配置多个格式校验

```schema:height="400" scope="body"
{
  "type": "form",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "text",
      "label": "文本",
      "name": "text",
      "validations": {
        "isNumeric": true,
        "minimum": 10
      },
      "description": "请输入数字类型文本"
    }
  ]
}
```

### 字符串形式（不推荐）

也可以配置字符串形式来指定，如下例，输入不合法的值，点击提交会报错并显示报错信息

```schema:height="400" scope="body"
{
  "type": "form",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "text",
      "label": "文本",
      "name": "text",
      "validations": "isNumeric",
      "description": "请输入数字类型文本"
    }
  ]
}
```

也可以指定多个格式校验，中间用`逗号`分隔。

```schema:height="400" scope="body"
{
  "type": "form",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "text",
      "label": "文本",
      "name": "text",
      "validations": "isNumeric,minimum:10",
      "description": "请输入数字类型文本"
    }
  ]
}
```

如果需要配置参数，例如显示最大值或最小值，则在格式标识符后`:`和参数

### 自定义校验信息

amis 会有默认的报错信息，如果你想自定义校验信息，配置`validationErrors`属性

```schema:height="400" scope="body"
{
  "type": "form",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "text",
      "label": "文本",
      "name": "text",
      "validations": {
        "isNumeric": true
      },
      "validationErrors": {
        "isNumeric": "同学，请输入数字哈"
      },
      "description": "请输入数字类型文本"
    }
  ]
}
```

如果需要获取当前格式校验配置的参数，可以使用`$1`

```schema:height="400" scope="body"
{
  "type": "form",
  "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
  "controls": [
    {
      "type": "text",
      "label": "文本",
      "name": "text",
      "validations": {
        "isNumeric": true,
        "minimum": 10
      },
      "validationErrors": {
        "minimum": "同学，最少输入$1以上的数字哈"
      },
      "description": "请输入数字类型文本"
    }
  ]
}
```

### 表单项值发生变化即校验

默认校验是当进行行为操作时，对表单项进行校验，如果你想每次表单项的值发生变化的时候就校验，请配置`"validateOnChange": false`

### 支持的格式校验

- `isEmptyString` 必须是空白字符。**注意！** 该格式校验是值，校验空白字符，而不是当前表单项是否为空，想校验是否为空，请配置 [必填校验](#%E8%A1%A8%E5%8D%95%E9%A1%B9%E5%BF%85%E5%A1%AB)
- `isEmail` 必须是 Email。
- `isUrl` 必须是 Url。
- `isNumeric` 必须是 数值。
- `isAlpha` 必须是 字母。
- `isAlphanumeric` 必须是 字母或者数字。
- `isInt` 必须是 整形。
- `isFloat` 必须是 浮点形。
- `isLength:length` 是否长度正好等于设定值。
- `minLength:length` 最小长度。
- `maxLength:length` 最大长度。
- `maximum:number` 最大值。
- `minimum:number` 最小值。
- `equals:xxx` 当前值必须完全等于 xxx。
- `equalsField:xxx` 当前值必须与 xxx 变量值一致。
- `isJson` 是否是合法的 Json 字符串。
- `notEmptyString` 要求输入内容不是空白。
- `isUrlPath` 是 url 路径。
- `matchRegexp:/foo/` 必须命中某个正则。
- `matchRegexp1:/foo/` 必须命中某个正则。
- `matchRegexp2:/foo/` 必须命中某个正则。
- `matchRegexp3:/foo/` 必须命中某个正则。
- `matchRegexp4:/foo/` 必须命中某个正则。

## 服务端校验

也可以通过接口返回错误信息，实现服务端校验

```schema:height="300" scope="body"
{
  "type": "form",
  "api": "https://houtai.baidu.com/api/mock2/form/saveFormFailed?waitSeconds=1",
  "controls": [
    {
        "name": "test2",
        "type": "text",
        "label": "服务端验证"
    }
  ]
}
```

点击提交，api 接口返回中，需要在 errors 变量中，返回某个表单项的报错信息，`key`值为该表单项的`name`值。

如上，接口返回的格式如下，提交后，`test2`表达项会显示报错信息

```json
{
  "status": 422, // 返回非0状态码
  "msg": "",
  "errors": {
    "test2": "服务器端说，这个有错误。"
  },
  "data": null
}
```

## 属性表

| 属性名         | 类型                                       | 默认值 | 说明                                                       |
| -------------- | ------------------------------------------ | ------ | ---------------------------------------------------------- |
| type           | `string`                                   |        | 指定表单项类型                                             |
| className      | `string`                                   |        | 表单最外层类名                                             |
| inputClassName | `string`                                   |        | 表单控制器类名                                             |
| labelClassName | `string`                                   |        | label 的类名                                               |
| name           | `string`                                   |        | 字段名，指定该表单项提交时的 key                           |
| label          | [模板](../../concepts/template) 或 `false` |        | 表单项标签                                                 |
| labelRemark    | [Remark](../../components/remark)          |        | 表单项标签描述                                             |
| description    | [模板](../../concepts/template)            |        | 表单项描述                                                 |
| placeholder    | `string`                                   |        | 表单项描述                                                 |
| inline         | `boolean`                                  |        | 是否为 内联 模式                                           |
| submitOnChange | `boolean`                                  |        | 是否该表单项值发生变化时就提交当前表单。                   |
| disabled       | `boolean`                                  |        | 当前表单项是否是禁用状态                                   |
| disabledOn     | [表达式](../../concepts/expression)        |        | 当前表单项是否禁用的条件                                   |
| visible        | [表达式](../../concepts/expression)        |        | 当前表单项是否禁用的条件                                   |
| visibleOn      | [表达式](../../concepts/expression)        |        | 当前表单项是否禁用的条件                                   |
| required       | `boolean`                                  |        | 是否为必填。                                               |
| requiredOn     | [表达式](../../concepts/expression)        |        | 过[表达式](../Types.md#表达式)来配置当前表单项是否为必填。 |
| validations    | [表达式](../../concepts/expression)        |        | 表单项值格式验证，支持设置多个，多个规则用英文逗号隔开。   |
