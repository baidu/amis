---
title: API
description:
type: 0
group: 🔧 类型
menuName: API
icon:
order: 20
---

API 类型用于配置请求接口的格式，涉及请求方式、请求地址、请求数据体等等相关配置

## 简单配置

如果你只需要配置简单的 ajax 接口，可以使用简单字符串格式，如下：

```
[<method>:]<url>
```

- **method**：get、post、put、delete，默认为 get
- **url**：接口地址，即模板字符串

示例：

```json
{
  "api": "get:/api/initData", // get 请求
  "api": "post:/api/initData", // post 请求
  "api": "put:/api/initData", // put 请求
  "api": "delete:/api/initData" // delete 请求
}
```

## 接口返回格式（重要）

所有配置在 amis 组件中的接口，都要符合下面的返回格式

```json
{
  "status": 0,
  "msg": "",
  "data": {
    ...其他字段
  }
}
```

- **status**: 返回 `0`，表示当前接口正确返回，否则按错误请求处理；
- **msg**: 返回接口处理信息，主要用于表单提交或请求失败时的 `toast` 显示；
- **data**: 必须返回一个具有 `key-value` 结构的对象。

**`status`**、**`msg`** 和 **`data`** 字段为接口返回的必要字段；

### 正确的格式

```json
{
  "status": 0,
  "msg": "",
  "data": {
    // 正确
    "text": "World!"
  }
}
```

### 错误的格式

直接返回字符串或者数组都是不推荐的

```json
{
  "status": 0,
  "msg": "",
  "data": "some string" // 错误，使用 key 包装
}
```

### 不推荐的格式

部分组件为了可以兼容，支持下面这种直接返回数组的用法，但并不推荐这种方式。

```json
{
  "status": 0,
  "msg": "",
  "data": ["a", "b"] // 不推荐，使用 key 包装
}
```

## 复杂配置

API 还支持配置对象类型

### 基本用法

```json
{
    "api": {
        "method": "get",
        "url": "xxxx",
        "data": {
            xxx
        },
        ... // 其他配置
    }
}
```

### 配置请求方式

可以配置`method`指定接口的请求方式，支持：`get`、`post`、`put`、`delete`。

> `method`值留空时：
>
> - 在初始化接口中，默认为`get`请求
> - 在`form`提交接口，默认为`post`请求

### 配置请求地址

可以配置`url`指定接口请求地址，支持[模板字符串](../concepts/template)。

### 配置请求数据

可以配置`data`，配置自定义接口请求数据体。

```schema:height="330" scope="body"
{
    "type": "form",
    "api": {
        "method": "post",
        "url": "https://houtai.baidu.com/api/mock2/form/saveForm",
        "data": {
            "myName": "${name}",
            "myEmail": "${email}"
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
        "type": "email",
        "label": "邮箱："
      }
    ]
}
```

支持[数据映射](./data-mapping)

> 当`method`配置为`get`时，`data`中的值默认会添加到请求路径中

### 配置请求数据格式

可以配置`dataType`，来指定请求的数据体格式，默认为`json`

> 下面例子中 api 没有配置`data`属性，因为`form`会默认将所有表单项的值进行提交。

#### application/json

默认是`application/json`，不需要额外配置

```schema:height="330" scope="body"
{
    "type": "form",
    "title": "默认JSON格式",
    "api": {
        "method": "post",
        "url": "https://houtai.baidu.com/api/mock2/form/saveForm",
        "data":{
            "&": "$$" // 获取表单数据域中的所有值
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
        "type": "email",
        "label": "邮箱："
      }
    ]
  }
```

#### application/x-www-form-urlencoded

配置`"dataType": "form"`，可配置发送体格式为`application/x-www-form-urlencoded`

```schema:height="330" scope="body"
{
    "type": "form",
    "api": {
        "method": "post",
        "url": "https://houtai.baidu.com/api/mock2/form/saveForm",
        "dataType": "form"
    },
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名："
      },
      {
        "name": "email",
        "type": "email",
        "label": "邮箱："
      }
    ]
  }
```

#### multipart/form-data

配置`"dataType": "form-data"`，可配置发送体格式为`multipart/form-data`

```schema:height="330" scope="body"
{
    "type": "form",
    "api": {
        "method": "post",
        "url": "https://houtai.baidu.com/api/mock2/form/saveForm",
        "dataType": "form-data"
    },
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名："
      },
      {
        "name": "email",
        "type": "email",
        "label": "邮箱："
      }
    ]
  }
```

当表单项中文件类型数据，则自动使用`multipart/form-data`数据体

```schema:height="330" scope="body"
{
    "type": "form",
    "api": {
        "method": "post",
        "url": "https://houtai.baidu.com/api/mock2/form/saveForm"
    },
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名："
      },
      {
        "name": "file",
        "type": "file",
        "label": "附件：",
        "asBlob": true
      }
    ]
  }
```

> `asBlob`配置项会指定当前 File 控件不再自己上传了，而是直接把文件数据作为表单项的值，文件内容会在 Form 表单提交的接口里面一起带上。

### 配置自定义请求头

可以配置`headers`对象，添加自定义请求头

```schema:height="330" scope="body"
{
    "type": "form",
    "api": {
        "method": "post",
        "url": "https://houtai.baidu.com/api/mock2/form/saveForm",
        "headers": {
            "my-header": "aaa"
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
        "type": "email",
        "label": "邮箱："
      }
    ]
  }
```

### 配置请求条件

可以配置表达式`sendOn`来实现：当符合某个条件的情况下，接口才触发请求

```schema:height="250" scope="body"
{
    "title": "",
    "type": "form",
    "mode": "horizontal",
    "controls": [
      {
        "label": "选项1",
        "type": "radios",
        "name": "a",
        "inline": true,
        "options": [
          {
            "label": "选项A",
            "value": 1
          },
          {
            "label": "选项B",
            "value": 2
          },
          {
            "label": "选项C",
            "value": 3
          }
        ]
      },
      {
        "label": "选项2",
        "type": "select",
        "size": "sm",
        "name": "b",
        "source": {
            "method": "get",
            "url": "https://houtai.baidu.com/api/mock2/options/level2?a=${a}",
            "sendOn": "data.a === 2"
        },
        "description": "只有<code>选项1</code>选择<code>B</code>的时候，才触发<code>选项2</code>的<code>source</code>接口重新拉取"
      }
    ],
    "actions": []
}
```

查看 **选项 2** 的`source`属性，他是 API 类型值，支持配置`sendOn` [表达式](../concepts/expression)，实现根据条件请求接口。

### 配置接口缓存

当你在某种情况下，需要非常频繁的请求同一个接口，例如列表中，每一行中都有一个 Service 进行数据拉取操作，

```schema:height="600" scope="body"
{
    "type": "crud",
    "api": "https://houtai.baidu.com/api/sample?waitSeconds=1",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "type": "service",
            "label": "数据",
            "api": "https://houtai.baidu.com/api/mock2/page/initData",
            "body": {
                "type": "tpl",
                "tpl": "当前日期是：${date}"
            }
        }
    ]
}
```

如上，如果你打开浏览器网络面板，会发现`/api/mock2/page/initData`接口将重复请求多次，次数为你当前列表的数据条数。

这往往并不理想，你可以设置`cache`来设置缓存时间，单位是毫秒，在设置的缓存时间内，同样的请求将不会重复发起，而是会获取缓存好的请求响应数据。

```schema:height="600" scope="body"
{
    "type": "crud",
    "api": "https://houtai.baidu.com/api/sample?waitSeconds=1",
    "columns": [
        {
            "name": "id",
            "label": "ID"
        },
        {
            "type": "service",
            "label": "数据",
            "api": {
                "method": "get",
                "url": "https://houtai.baidu.com/api/mock2/page/initData",
                "cache": 2000
            },
            "body": {
                "type": "tpl",
                "tpl": "当前日期是：${date}"
            }
        }
    ]
}
```

这下我们再打开网络面板，发现只有一条请求了

### 配置请求适配器

amis 的 API 配置，如果无法配置出你想要的请求结构，那么可以配置`requestAdaptor`发送适配器

**发送适配器** 是指在接口请求前，对请求进行一些自定义处理，例如修改发送数据体、添加请求头、等等，基本用法是，获取暴露的`api`参数，并且对该参数进行一些修改，并`return`出去：

##### 暴露的参数

发送适配器暴露以下参数以供用户进行操作:

- **api**：当前请求的 api 对象，一般包含下面几个属性：
  - url：当前接口 Api 地址
  - method：当前请求的方式
  - data：请求的数据体
  - headers：请求的头部信息

##### 字符串形式

如果在 JSON 文件中配置的话，`requestAdaptor`只支持字符串形式。

字符串形式实际上可以认为是外层包裹了一层函数，你需要补充内部的函数实现，并将修改好的 `api` 对象 `return` 出去：

```js
function (api) {
  // 你的适配器代码
}
```

用法示例：

```schema:height="330" scope="body"
{
    "type": "form",
    "api": {
        "method": "post",
        "url": "https://houtai.baidu.com/api/mock2/form/saveForm",
        "requestAdaptor": "return {\n    ...api,\n    data: {\n        ...api.data,    // 获取暴露的 api 中的 data 变量\n        foo: 'bar'      // 新添加数据\n    }\n}"
    },
    "controls": [
      {
        "type": "text",
        "name": "name",
        "label": "姓名："
      },
      {
        "name": "email",
        "type": "email",
        "label": "邮箱："
      }
    ]
  }
```

上例中的适配器实际上是如下代码的字符串形式：

```js
// 进行一些操作

// 一定要将调整后的 api 对象 return 出去
return {
  ...api,
  data: {
    ...api.data, // 获取暴露的 api 中的 data 变量
    foo: 'bar' // 新添加数据
  }
};
```

##### 函数形式

如果你的使用环境为 js 文件，则可以直接传入函数，如下：

```js
const schema = {
  type: 'form',
  api: {
    method: 'post',
    url: 'https://houtai.baidu.com/api/mock2/form/saveForm',
    requestAdaptor: function (api) {
      return {
        ...api,
        data: {
          ...api.data, // 获取暴露的 api 中的 data 变量
          foo: 'bar' // 新添加数据
        }
      };
    }
  },
  controls: [
    {
      type: 'text',
      name: 'name',
      label: '姓名：'
    },
    {
      name: 'text',
      type: 'email',
      label: '邮箱：'
    }
  ]
};
```

上面例子中，我们获取暴露的`api`对象中的`data`变量，并且为其添加了一个新的字段`foo`，并且一起返回出去就可以了，这样我们的请求数据体中就会加上我们这个新的字段。

你也可以使用`debugger`自行进行调试。

### 配置接收适配器

同样的，如果后端返回的响应结构不符合 amis 的[接口格式要求](#%E6%8E%A5%E5%8F%A3%E8%BF%94%E5%9B%9E%E6%A0%BC%E5%BC%8F-%E9%87%8D%E8%A6%81-)，而后端不方便调整时，可以配置`adaptor`实现接收适配器

**接收适配器** 是指在接口请求后，对响应进行一些自定义处理，例如修改响应的数据结构、修改响应的数据等等。

例如：接口正确返回的格式中，会返回`"code": 200`，而 amis 中，接口返回格式需要`"status": 0`，这时候就需要接收适配器进行调整结构。

##### 暴露的参数

接收适配器器暴露以下参数以供用户进行操作:

- **payload**：当前请求的响应 payload，即 response.data
- **response**：当前请求的原始响应

##### 字符串形式

如果在 JSON 文件中配置的话，`adaptor`只支持字符串形式。

字符串形式实际上可以认为是外层包裹了一层函数，你需要补充内部的函数实现，并将修改好的 `payload` 对象 `return` 出去：

```js
function (payload, responsee) {
  // 你的适配器代码
}
```

用法示例：

```json
{
  "type": "form",
  "api": {
    "method": "post",
    "url": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "adaptor": "return {\n    ...payload,\n    status: payload.code === 200 ? 0 : payload.code\n}"
  },
  "controls": [
    {
      "type": "text",
      "name": "name",
      "label": "姓名："
    },
    {
      "name": "file",
      "type": "file",
      "label": "附件：",
      "asBlob": true
    }
  ]
}
```

上例中的适配器实际上是如下代码的字符串形式：

```js
// 进行一些操作

// 一定要将调整后的 payload 对象 return 出去
return {
  ...payload,
  status: payload.code === 200 ? 0 : payload.code
};
```

##### 函数形式

如果你的使用环境为 js 文件，则可以直接传入函数，如下：

```js
const schema = {
  type: 'form',
  api: {
    method: 'post',
    url: 'https://houtai.baidu.com/api/mock2/form/saveForm',
    adaptor: function (payload, response) {
      return {
        ...payload,
        status: payload.code === 200 ? 0 : payload.code
      };
    }
  },
  controls: [
    {
      type: 'text',
      name: 'name',
      label: '姓名：'
    },
    {
      name: 'email',
      type: 'email',
      label: '邮箱：'
    }
  ]
};
```

### replaceData

返回的数据是否替换掉当前的数据，默认为 `false`（即追加），设置为`true`就是完全替换当前数据。

### 属性表

| 字段名         | 说明         | 类型                                                                                                 | 备注                                                                                                                                                                                          |
| -------------- | ------------ | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| method         | 请求方式     | 字符串                                                                                               | 支持：get、post、put、delete                                                                                                                                                                  |
| url            | 请求地址     | [模板字符串](https://suda.bce.baidu.com/docs/template#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2) | -                                                                                                                                                                                             |
| data           | 请求数据     | 对象或字符串                                                                                         | 支持数据映射                                                                                                                                                                                  |
| dataType       | 数据体格式   | 字符串                                                                                               | 默认为 `json` 可以配置成 `form` 或者 `form-data`。当 `data` 中包含文件时，自动会采用 `form-data（multipart/form-data）` 格式。当配置为 `form` 时为 `application/x-www-form-urlencoded` 格式。 |
| qsOptions      | --           | 对象或字符串                                                                                         | 当 dataType 为 form 或者 form-data 的时候有用。具体参数请参考这里，默认设置为: `{ arrayFormat: 'indices', encodeValuesOnly: true }`                                                           |
| headers        | 请求头       | 对象                                                                                                 | -                                                                                                                                                                                             |
| sendOn         | 请求条件     | [表达式](../concepts/expression)                                                                     | -                                                                                                                                                                                             |
| cache          | 接口缓存时间 | 整型数字                                                                                             | -                                                                                                                                                                                             |
| requestAdaptor | 发送适配器   | 字符串                                                                                               | ，支持字符串串格式，或者直接就是函数如：                                                                                                                                                      |
| adaptor        | 接收适配器   | 字符串                                                                                               | 如果接口返回不符合要求，可以通过配置一个适配器来处理成 amis 需要的。同样支持 Function 或者 字符串函数体格式                                                                                   |
| replaceData    | 替换当前数据 | 布尔                                                                                                 | 返回的数据是否替换掉当前的数据，默认为 `false`，即：`追加`，设置成 `true` 就是完全替换。                                                                                                      |
