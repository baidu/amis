## 类型说明

### Container

Container 不是一个特定的渲染器，而是 amis 中一个特殊类型，它是以下类型的任何一种。

-   `String` 字符串，可以包含 `html` 片段。
-   `Object` 指定一个渲染器如： `{"type": "button", "label": "按钮"}`
-   `Array` 还可以是一个数组，数组的成员可以就是一个 `Container`.

示例:

```json
{
    "container": "普通一段字符串"
}
```

```json
{
    "container": {
        "type": "button",
        "label": "按钮"
    }
}
```

```json
{
    "container": [
        "普通一段字符串",

        {
            "type": "button",
            "label": "按钮"
        },

        ["普通一段字符串", "普通一段字符串"]
    ]
}
```

### API

Api 类型可以是字符串或者对象。API 中可以直接设置数据发送结构，注意看示例。

-   `String` `[<type>:]<url>`

    -   `<type>` 可以是： `get`、`post`、`put`、`delete`或者`raw`
    -   `<url>` 即 api 地址，支持通过 `$key` 取变量。

    如：

          * `get:http://imis.tieba.baidu.com/yule/list?start=$startTime&end=$endTime`
          * `get:http://imis.tieba.baidu.com/yule/list?$$` 拿所有可用数据。
          * `get:http://imis.tieba.baidu.com/yule/list?data=$$` 拿所有可用数据。

-   `Object`

    -   `url` api 地址
    -   `method` 可以是：`get`、`post`、`put`或者`delete`
    -   `data` 数据体, 数据对象。
    -   `dataType` 数据体格式，默认为 `json` 可以配置成 `form` 或者 `form-data`。当 data 中包含文件时，自动会采用 `form-data`（multipart/form-data） 格式。当配置为 `form` 时为 `application/x-www-form-urlencoded` 格式。
    -   `qsOptions` 当 dataType 为 `form` 或者 `form-data` 的时候有用。具体参数请参考这： https://github.com/ljharb/qs 默认设置为 `{arrayFormat: 'indices', encodeValuesOnly: true}`
    -   `headers` 头部，配置方式和 data 配置一样，下面不详讲。如果要使用，请前往群组系统配置中，添加允许。
    -   `sendOn` 可以配置发送条件比如： `this.id` 表示当存在 id 值时才发送这个请求。
    -   `cache` 通过配置此属性开启缓存，单位是 ms，比如设置 3000 的话，当前接口在3s内请求，只要传参一致就会走缓存。
    -   `requestAdaptor` (api) => api; 发送适配器，支持字符串串格式，或者直接就是函数如：

        ```
        {
            "type": "crud",
            "api": {
                "url": "/api/xxx",
                "method": "get",
                "requestAdaptor": "api.url += '?arg1=1&arg2=2'; console.log(api); return api;"
            }
        }
        ```
    -    `adaptor` (payload, response, api) => payload 返回适配器，如果接口返回不符合要求，可以通过配置一个适配器来处理成 amis 需要的。同样支持 Function 或者 字符串函数体格式。PS: Function 类型，只有采用非 json 方式配置才能配置出来。

    `data` 数据体，如果默认不指定，amis 会猜一些你可能需要点数据发送过去，如果不符合你预期，可以通过指定 data 数据来满足，额外还可以做一些数据映射 如：

    取某个变量。

    ```json
    {
        "url": "http://imis.tieba.baidu.com/yule/list",
        "method": "post",
        "data": {
            "start": "$startTime"
        }
    }
    ```

    直接将所有可用数据映射给 all 变量。

    ```json
    {
        "url": "http://imis.tieba.baidu.com/yule/list",
        "method": "post",
        "data": {
            "all": "$$"
        }
    }
    ```

    正常如果指定了 data，则只会发送 data 指定的数据了，如果想要保留原有数据，只定制修改一部分。

    ```json
    {
        "url": "http://imis.tieba.baidu.com/yule/list",
        "method": "post",
        "data": {
            "&": "$$", // 原来的数据先 copy 过来。
            "a": "123",
            "b": "${b}"
        }
    }
    ```

    如果目标变量是数组，而发送的数据，又不希望把成员全部发送过去，可以这样配置。

    ```json
    {
        "url": "http://imis.tieba.baidu.com/yule/list",
        "method": "post",
        "data": {
            "all": {
                "$rows": {
                    "a": "$a",
                    "b": "$b"
                }
            }
        }
    }
    ```

    如果 `$rows` 的结构为 `[{a: 1, b: 2, c: 3, d: 4}, {a: 1, b: 2, c: 3, d: 4}]`, 经过上述映射后，实际发送的数据为 `{all: [{a: 1, b:2}, {a: 1, b: 2}]}`

    如果你觉得上面的这种写法比较诡异，建议你用以下写法。

    ```json
    {
        "url": "http://imis.tieba.baidu.com/yule/list",
        "method": "post",
        "data": {
            "all": "${rows|pick:a,b}"
        }
    }
    ```

** 注意 **

amis 平台中使用所有的 http 地址 url 的如： `"http://www.baidu.com"` 都会被替换成 proxy 代理，如果不希望这么做，请明确指示如： `"raw:http://www.baidu.com"`。还有为了安全，amis 默认只能转发公司内部 API 接口，如果您的接口在外网环境，也请明确指示如：`"external:http://www.baidu.com"`

### 表达式

配置项中，所有 `boolean` 类型的配置，都可以用 JS 表达式来配置。所有`boolean` 配置项，后面加个 `On` 则是表达式配置方式，可以用 js 语法来根据当前模型中的数据来决定是否启用。
如：[FormItem](./Form/FormItem.md) 中的 `disabledOn`、`hiddenOn`、`visibleOn`、[CRUD](./CRUD.md) 中的 `itemDraggableOn` 等等。

```schema:height="300" scope="form"
[
    {
        "type": "radios",
        "name": "foo",
        "inline": true,
        "label": " ",
        "options": [
            {
                "label": "类型1",
                "value": 1
            },
            {
                "label": "类型2",
                "value": 2
            },
            {
                "label": "类型3",
                "value": 3
            }
        ]
    },

    {
        "type": "text",
        "name": "text",
        "placeholder": "类型1 可见",
        "visibleOn": "data.foo == 1"
    },

     {
         "type": "text",
         "name": "text2",
         "placeholder": "类型2 不可点",
         "disabledOn": "data.foo == 2"
     },

   {
       "type": "button",
       "label": "类型三不能提交",
       "level": "primary",
       "disabledOn": "data.foo == 3"
   }

]
```

为了能加入权限控制，表达是中允许可以用 `acl.can` 方法来检测当前用户是否拥有某个权限。
如： `{"disabledOn": "!acl.can('some-resource')"}`。权限能力部分，请前往[能力管理](/docs/manual#%E8%83%BD%E5%8A%9B%E7%AE%A1%E7%90%86)，
权限配置请前往[权限配置](/docs/manual#%E6%9D%83%E9%99%90%E9%85%8D%E7%BD%AE)管理。
