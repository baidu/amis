---
title: FormItem 普通表单项
description:
type: 0
group: null
menuName: Formula 表单项通用
icon:
order: 1
---

**表单项** 是组成一个表单的基本单位，它具有的一些特性会帮助我们更好地实现表单操作。

> 所有派生自`FormItem`的组件，都具有`FormItem`的特性。

## 基本用法

最基本的表单项配置像这样：

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "input-text",
      "label": "文本框",
      "name": "text"
    },
    {
      "type": "input-password",
      "label": "<a href='./password'>密码</a>",
      "name": "password"
    }
  ]
}
```

- `name`: **必填属性**，标识表单数据域中，当前表单项值的`key`，这个 name 可以是深层结构，比如 `aa.bb`
- `type`: **必填属性**，标识表单项类型
- `label`: 标识表单项的标签

> 所有表单项都只可以配置在`form`组件中，即`form`的`body`属性中。

## 表单项展示

### 内联模式

通过配置`"mode": "inline"`，标识当前表单项使用内联模式。

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "input-text",
      "label": "常规",
      "name": "text1"
    },
    {
      "type": "input-text",
      "label": "内联",
      "name": "text2",
      "mode": "inline"
    },
    {
      "type": "input-text",
      "label": "内联2",
      "name": "text2",
      "mode": "inline"
    },
    {
      "type": "group",
      "mode": "inline",
      "body": [
        {
          "type": "input-text",
          "label": "内联3",
          "name": "text2"
        },
        {
          "type": "input-text",
          "label": "内联4",
          "name": "text2"
        }
      ]
    }
  ]
}
```

### 表单项尺寸

可以配置`size`，来调整表单项的尺寸，支持`'xs' | 'sm' | 'md' | 'lg' | 'full'`，如下：

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "input-text",
      "label": "极小",
      "name": "text-xs",
      "size": "xs"
    },
    {
      "type": "input-text",
      "label": "小",
      "name": "text-sm",
      "size": "sm"
    },
    {
      "type": "input-text",
      "label": "中",
      "name": "text-md",
      "size": "md"
    },
    {
      "type": "input-text",
      "label": "大",
      "name": "text-lg",
      "size": "lg"
    },
    {
      "type": "input-text",
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

```schema: scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "body": [
    {
      "type": "input-text",
      "label": "常规",
      "name": "text1",
      "placeholder": "常规标签"
    },
    {
      "type": "input-text",
      "label": "",
      "name": "text1",
      "placeholder": "不显示标签"
    },
    {
      "type": "input-text",
      "label": false,
      "name": "text1",
      "placeholder": "不显示标签且清除空间"
    }
  ]
}
```

### 表单项标签提示

配置`labelRemark`可以实现标签描述提示

```schema: scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "body": [
    {
      "type": "input-text",
      "label": "无标签提示",
      "name": "text1"
    },
    {
      "type": "input-text",
      "label": "有标签提示",
      "labelRemark": "这是一段提示",
      "name": "text2"
    },
    {
      "type": "input-text",
      "label": "更复杂的标签提示",
      "labelRemark": {
        "type": "remark", "title": "提示", "content": "<pre>first \nsecond\n${text1}</pre>"
      },
      "name": "text3"
    }
  ]
}
```

其它配置请参考 [Remark](../remark)。

### 配置禁用

##### 静态配置

通过配置`"disabled": true`来禁用表单项

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "input-text",
      "label": "常规",
      "name": "text1"
    },
    {
      "type": "input-text",
      "label": "禁用",
      "name": "text2",
      "disabled": true
    }
  ]
}
```

##### 通过条件配置是否禁用

你也通过[表达式](../../../docs/concepts/expression)配置`disabledOn`，来实现在某个条件下禁用当前表单项.

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "input-number",
      "label": "数量",
      "name": "number",
      "value": 0,
      "description": "调整数量大小查看效果吧！"
    },
    {
      "type": "input-text",
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

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "input-text",
      "label": "常规",
      "name": "text1"
    },
    {
      "type": "input-text",
      "label": "隐藏",
      "name": "text2",
      "hidden": true
    }
  ]
}

```

上例中的`text2`被隐藏了。

##### 通过条件配置显隐

你也通过[表达式](../../../docs/concepts/expression)配置`hiddenOn`，来实现在某个条件下禁用当前表单项.

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "input-number",
      "label": "数量",
      "name": "number",
      "value": 0,
      "description": "调整数量大小查看效果吧！"
    },
    {
      "type": "input-text",
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

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "body": [
    {
      "type": "input-text",
      "label": "姓名",
      "name": "name"
    }
  ]
}
```

如上例，更改姓名表单项值，可以改变表单数据域中`name`变量的值。

也支持链式配置 `name`属性，例如：`aaa.bbb`

```schema: scope="body"
{
  "type": "form",
  "debug": true,
  "body": [
    {
      "type": "input-text",
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

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "input-text",
      "label": "text",
      "name": "text",
      "value": "hello world!",
      "description": "拥有默认值的 text"
    }
  ]
}
```

> 1.10.0 及之后版本

`value`支持表达式，也就是说可以直接配置类似于这样的语法：`${xxx}`，如果想要获取当前数据域中的某个变量，可以设置该表单项`value`为`${name1}`，如下：

```schema: scope="body"
{
  "type": "form",
  "data":{
    "name1": "hello world!"
  },
  "body": [
    {
      "type": "input-text",
      "label": "text",
      "name": "test1",
      "value": "${name1}",
      "description": "默认值支持表达式"
    }
  ]
}
```

`value`也支持表达式运算，可以配置类似于这样的语法：`${num1 + 2}`，如下：

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "input-number",
      "label": "num1",
      "name": "num1",
      "value": "123"
    },
    {
      "type": "input-text",
      "label": "text",
      "name": "test1",
      "value": "${num1 + 2}",
      "description": "默认值支持表达式运算"
    }
  ]
}
```

`value`表达式支持[namespace](../../../docs/concepts/data-mapping#namespace)，可以配置类似于这样的语法：`${window:document.title}`，意思是从全局变量中取页面的标题。如下：

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "input-text",
      "label": "text",
      "name": "test1",
      "value": "${window:document.title}",
      "description": "默认值表达式支持namespace"
    }
  ]
}
```

**tip：** value表达式（`${xxx}`）支持 模板字符串、链式取值、过滤器，详细用法参考[数据映射](../../../docs/concepts/data-mapping)。

我们也可以不设置value表达式，通过 name 来映射当前数据域中某个字段。比如我们表单数据域中有变量`"text1": "hello world!"`，然后我们设置表达项`"name": "text1"`，这样就可以自动映射值了。如下：

```schema: scope="body"
{
  "type": "form",
  "data":{
    "text1": "hello world!"
  },
  "body": [
    {
      "type": "input-text",
      "label": "text",
      "name": "text1",
      "description": "关联数据域中的text1"
    }
  ]
}
```

关于优先级问题，当我们同时设置了value表达式`${xxx}`和`name`值映射，会优先使用value表达式`${xxx}`。只有当value为普通字符串`非${xxx}`时，才会使用`name`值映射。如下：

```schema: scope="body"
{
  "type": "form",
  "data":{
    "item1": "hello world!",
    "item2": "hello amis!",
    "item3": "hello amis-editor!"
  },
  "body": [
    {
      "type": "input-text",
      "label": "test1",
      "name": "test1",
      "value": "123",
      "description": "普通value默认值"
    },
    {
      "type": "input-text",
      "label": "test2",
      "name": "item1",
      "description": "关联数据域中的item1"
    },
    {
      "type": "input-text",
      "label": "test3",
      "name": "item2",
      "value": "345",
      "description": "非value表达式（\\${xxx}），则优先使用name映射"
    },
    {
      "type": "input-text",
      "label": "test4",
      "name": "item3",
      "value": "${test1}",
      "description": "value表达式（\\${xxx}）优先级最高"
    }
  ]
}
```

**tip：** 默认在解析表达式时，遇到`$`字符会尝试去解析该变量并替换成对应变量，如果你想输出纯文本`"${xxx}"`，那么需要在`$`前加转义字符`"\\"`，即`"\\${xxx}"`，如下所示：

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "input-text",
      "label": "test1",
      "name": "test1",
      "value": "\\${name}",
      "description": "显示输出纯文本 ${xxx}"
    },
    {
      "type": "input-text",
      "label": "test2",
      "name": "test2",
      "value": "my name is \\${name}",
      "description": "显示输出纯文本 ${xxx}"
    }
  ]
}
```

## 隐藏时删除表单项值

默认情况下，在通过 `hiddenOn` 或 `visibleOn` 配置显隐交互时，被隐藏的表单项值，不会在当前表单数据域中删除，例如：

```schema: scope="body"
{
  "type": "form",
  "debug":"true",
  "body": [
    {
      "type": "input-number",
      "label": "数量",
      "name": "number",
      "value": 0,
      "description": "调整数量大小查看效果吧！"
    },
    {
      "type": "input-text",
      "label": "文本",
      "value":"这是一段文本",
      "name": "text",
      "hiddenOn": "this.number > 1",
      "description": "当数量大于1的时候，该文本框会隐藏"
    }
  ]
}
```

观察上例，在调整 `number` 数量大于 1 时，`文本` 表单项会隐藏，但是对应的表单数据域中的 `text` 变量值仍存在。

如果想要实现隐藏表单项后，在当前表单数据域中删除该表单项对应的值，那么可以在当前表单项上配置 `"clearValueOnHidden": true`。

```schema: scope="body"
{
  "type": "form",
  "debug":"true",
  "body": [
    {
      "type": "input-number",
      "label": "数量",
      "name": "number",
      "value": 0,
      "description": "调整数量大小查看效果吧！"
    },
    {
      "type": "input-text",
      "label": "文本",
      "value":"这是一段文本",
      "name": "text",
      "hiddenOn": "this.number > 1",
      "description": "当数量大于1的时候，该文本框会隐藏",
      "clearValueOnHidden": true
    }
  ]
}
```

再次观察上例，当 `文本` 表单项隐藏时，对应的 `text` 变量也会被删除掉。

> 注意: 如果有其他同 name 的表达项的存在，即使其他表单项值没有隐藏，也会在数据域中删掉该值。

## 表单项必填

### 静态配置

通过配置`"required": true`来标识该表单项为必填。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-text",
      "label": "常规",
      "name": "text",
      "required": true
    }
  ]
}
```

### 满足条件校验必填

你也通过[表达式](../../../docs/concepts/expression)配置`requiredOn`，来实现在某个条件下使当前表单项必填。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-number",
      "label": "数量",
      "name": "number",
      "value": 0,
      "description": "调整数量大小查看效果吧！"
    },
    {
      "type": "input-text",
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

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-text",
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

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-text",
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

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-text",
      "label": "文本",
      "name": "text",
      "validations": "isNumeric",
      "description": "请输入数字类型文本"
    }
  ]
}
```

也可以指定多个格式校验，中间用`逗号`分隔。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-text",
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

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-text",
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

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "input-text",
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

默认的校验信息如下，可以直接配置文字，也可用多语言中的 key。参考：https://github.com/baidu/amis/blob/master/src/locale/zh-CN.ts#L175-L201

```js
{
  isEmail: 'validate.isEmail',
  isRequired: 'validate.isRequired',
  isUrl: 'validate.isUrl',
  isInt: 'validate.isInt',
  isAlpha: 'validate.isAlpha',
  isNumeric: 'validate.isNumeric',
  isAlphanumeric: 'validate.isAlphanumeric',
  isFloat: 'validate.isFloat',
  isWords: 'validate.isWords',
  isUrlPath: 'validate.isUrlPath',
  matchRegexp: 'validate.matchRegexp',
  minLength: 'validate.minLength',
  maxLength: 'validate.maxLength',
  maximum: 'validate.maximum',
  lt: 'validate.lt',
  minimum: 'validate.minimum',
  gt: 'validate.gt',
  isJson: 'validate.isJson',
  isLength: 'validate.isLength',
  notEmptyString: 'validate.notEmptyString',
  equalsField: 'validate.equalsField',
  equals: 'validate.equals',
  isPhoneNumber: 'validate.isPhoneNumber',
  isTelNumber: 'validate.isTelNumber',
  isZipcode: 'validate.isZipcode',
  isId: 'validate.isId'
}
```

### 表单项值发生变化即校验

默认校验是当进行行为操作时，对表单项进行校验，如果你想每次表单项的值发生变化的时候就校验，请配置`"validateOnChange": true`

### 支持的格式校验

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
- `isUrlPath` 是 url 路径。
- `isPhoneNumber` 是否为合法的手机号码
- `isTelNumber` 是否为合法的电话号码
- `isZipcode` 是否为邮编号码
- `isId` 是否为身份证号码，没做校验
- `matchRegexp:/foo/` 必须命中某个正则。
- `matchRegexp1:/foo/` 必须命中某个正则。
- `matchRegexp2:/foo/` 必须命中某个正则。
- `matchRegexp3:/foo/` 必须命中某个正则。
- `matchRegexp4:/foo/` 必须命中某个正则。

#### 验证只允许 http 协议的 url 地址

> 1.4.0 及以上版本

isUrl 可以配置如下参数

- schemes 协议，默认是为： `['http', 'https', 'ftp', 'sftp']`
- allowLocal 是否允许填写本地地址
- allowDataUrl 是否允许 dataUrl

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
        "name": "url",
        "type": "input-text",
        "label": "只允许 https 打头的 url",
        "validations": {
          "isUrl": {
            "schemes": ["https"]
          }
        }
    }
  ]
}
```

### 自定义校验函数

可以自己写代码扩展表单验证，请参考 [这里](../../docs/extend/addon#扩展表单验证)

## 服务端校验

### 通过表单提交接口

也可以通过表单提交接口返回错误信息，实现服务端校验

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveFormFailed?waitSeconds=1",
  "body": [
    {
        "name": "test2",
        "type": "input-text",
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

#### Combo 校验

Combo 类型的表单项，要实现服务端校验，可以使用 `路径key` 来定位要显示报错信息的表单项，例如 `a[0].b` 定位到 a combo 的第一项中 b 表单项。

例如有如下表单，点击提交，查看效果：

```schema:scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveFormFailedCombo?waitSeconds=1",
  "body": [
    {
      "type": "combo",
      "name": "combo1",
      "label": "组合多条单行",
      "multiple": true,
      "value": [
        {
          "a": "a1",
          "b": "a"
        },
        {
          "a": "a2",
          "b": "c"
        }
      ],
      "items": [
        {
          "name": "a",
          "type": "input-text"
        },
        {
          "name": "b",
          "type": "select",
          "options": ["a", "b", "c"]
        }
      ]
    },
    {
      "type": "combo",
      "name": "combo2",
      "label": "组合单条单行",
      "value": {
        "a": "a",
        "b": "b"
      },
      "items": [
        {
          "name": "a",
          "type": "input-text"
        },
        {
          "name": "b",
          "type": "select",
          "options": ["a", "b", "c"]
        }
      ]
    }
  ]
}
```

接口返回如下

```json
{
  "status": 422,
  "msg": "",
  "errors": {
    "combo1": "服务器端说，这个combo1有问题",
    "combo1[1].a": "服务器端说，这个combo1的第二项中的a有问题", // 或 combo1.1.a
    "combo2": "服务器端说，这个combo2有问题",
    "combo2.b": "服务器端说，这个combo2中的b有问题"
  },
  "data": null
}
```

#### Table 校验

Table 类型的表单项，要实现服务端校验，可以使用 `路径key` 来定位要显示报错信息的表单项，例如 `a[0].b` 定位到 a table 的第一项中 b 表单项。

例如有如下表单，点击提交，查看效果：

```schema:scope="body"
{
  "type": "form",
  "debug": true,
  "mode": "horizontal",
  "api": "/api/mock2/form/saveFormFailedTable?waitSeconds=1",
  "body": [
    {
      "label": "Table 服务端校验",
      "type": "input-table",
      "name": "table",
      "multiple": true,
      "value": [
        {
          "a": "a1",
          "b": "b1"
        },
        {
          "a": "a2",
          "b": "b2"
        }
      ],
      "columns": [
        {
          "name": "a",
          "type": "text",
          "label": "A",
          "quickEdit": {
            "mode": "inline"
          }
        },
        {
          "name": "b",
          "type": "text",
          "label": "B",
          "quickEdit": {
            "mode": "inline"
          }
        }
      ]
    },

    {
      "label": "Combo 内 Table 服务端校验",
      "type": "combo",
      "name": "combo",
      "items": [
        {
          "name": "a",
          "type": "text",
          "label": "A"
        },
        {
          "label": "Table",
          "type": "input-table",
          "name": "table",
          "multiple": true,
          "value": [
            {
              "a": "a1",
              "b": "b1"
            },
            {
              "a": "a2",
              "b": "b2"
            }
          ],
          "columns": [
            {
              "name": "a",
              "type": "text",
              "label": "A",
              "quickEdit": {
                "mode": "inline"
              }
            },
            {
              "name": "b",
              "type": "text",
              "label": "B",
              "quickEdit": {
                "mode": "inline"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

接口返回如下

```json
{
  "status": 422,
  "msg": "",
  "errors": {
    "table": "表格有问题",
    "table[0].a": "表格的第一项中的 a 有问题",
    "table[1].b": "表格的第二项中的 b 有问题",
    "combo.table[0].b": "Combo中表格的第一项中的 b 有问题",
    "combo.table[1].a": "Combo中表格的第二项中的 a 有问题"
  },
  "data": null
}
```

### 通过表单项校验接口

可以在表单项上，配置校验接口 `validateApi`，实现单个表单项后端校验。

```schema:scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "label": "name",
      "type": "input-text",
      "name": "name",
      "required": true,
      "validateApi": "/api/mock2/form/formitemFailed"
    },
    {
      "label": "email",
      "type": "input-text",
      "name": "email",
      "validateApi": "/api/mock2/form/formitemSuccess",
      "required": true
    }
  ]
}
```

校验接口显示校验信息返回格式如下：

```json
{
  "status": 422,
  "errors": "当前用户已存在"
}
```

- `status`: 返回 `0` 表示校验成功，`422` 表示校验失败;
- `errors`: 返回 `status` 为 `422` 时，显示的校验失败信息;

### 配置自动填充

通过配置 "autoFillApi" 为自动填充数据源接口地址；amis 可以将返回数据自动填充到表单中，例如如下配置；

```schema:scope="body"
{
  "type": "form",
  "body": [
    {
      "type": "input-text",
      "label": "浏览器",
      "name": "browser",
      "autoFillApi": {
        api: "/api/mock2/form/autoUpdate?browser=$browser",
        replaceData: {
          browser: "${browser}",
          version: "${version}",
          platform1: "${platform}",
        },
        silent: false
      }
    },
    {
      "type": "input-text",
      "label": "版本",
      "name": "version"
    },
    {
      "type": "input-text",
      "label": "平台",
      "name": "platform1"
    },
  ]
}
```

自动填充接口返回格式如下：
注意：amis 仅处理接口返回结果仅有一项的数据，默认自动填充相关字段

```json
{
  "status": 0,
  "data": {
    "rows": [
      {
        "key": "value",
        "key1": "value1"
      }
    ]
  }
}
```

或者是

```json
{
  "status": 0,
  "data": {
    "key": "value",
    "key1": "value1"
  }
}
```

## 属性表

| 属性名               | 类型                                               | 默认值    | 说明                                                             |
| -------------------- | -------------------------------------------------- | --------- | ---------------------------------------------------------------- |
| type                 | `string`                                           |           | 指定表单项类型                                                   |
| className            | `string`                                           |           | 表单最外层类名                                                   |
| inputClassName       | `string`                                           |           | 表单控制器类名                                                   |
| labelClassName       | `string`                                           |           | label 的类名                                                     |
| name                 | `string`                                           |           | 字段名，指定该表单项提交时的 key                                 |
| value                | `string`                                           |           | 表单默认值                                                       |
| label                | [模板](../../../docs/concepts/template) 或 `false` |           | 表单项标签                                                       |
| labelAlign           | `"right" \| "left"`                                | `"right"` | 表单项标签对齐方式，默认右对齐，仅在 `mode`为`horizontal` 时生效 |
| labelRemark          | [Remark](../remark)                                |           | 表单项标签描述                                                   |
| description          | [模板](../../../docs/concepts/template)            |           | 表单项描述                                                       |
| placeholder          | `string`                                           |           | 表单项描述                                                       |
| inline               | `boolean`                                          |           | 是否为 内联 模式                                                 |
| submitOnChange       | `boolean`                                          |           | 是否该表单项值发生变化时就提交当前表单。                         |
| disabled             | `boolean`                                          |           | 当前表单项是否是禁用状态                                         |
| disabledOn           | [表达式](../../../docs/concepts/expression)        |           | 当前表单项是否禁用的条件                                         |
| visible              | [表达式](../../../docs/concepts/expression)        |           | 当前表单项是否禁用的条件                                         |
| visibleOn            | [表达式](../../../docs/concepts/expression)        |           | 当前表单项是否禁用的条件                                         |
| required             | `boolean`                                          |           | 是否为必填。                                                     |
| requiredOn           | [表达式](../../../docs/concepts/expression)        |           | 过[表达式](../Types.md#表达式)来配置当前表单项是否为必填。       |
| validations          | [表达式](../../../docs/concepts/expression)        |           | 表单项值格式验证，支持设置多个，多个规则用英文逗号隔开。         |
| validateApi          | [表达式](../../../docs/types/api)                  |           | 表单校验接口                                                     |
| autoUpdate           | Object                                             |           | 自动填充配置                                                     |
| autoUpdate.api       | [api](../../types/api)                             |           | 自动填充数据接口地址                                             |
| autoUpdate.mapping   | Object                                             |           | 自动填充字段映射关系                                             |
| autoUpdate.showToast | `boolean`                                          |           | 是否展示数据格式错误提示，默认为 false                           |
