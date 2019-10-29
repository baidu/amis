## Tpl

tpl 类型的渲染器支持用 JS 模板引擎来组织输出，采用的 lodash 的 [template](https://lodash.com/docs/4.15.0#template)，关于语法部分，请前往 lodash 文档页面。

```schema:height="200"
{
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
      "tpl": "User: <%= data.user%>"
    },
    {
      "type": "tpl",
      "inline": false,
      "tpl": "<% if (data.items && data.items.length) { %>Array: <% data.items.forEach(function(item) { %> <span class='label label-default'><%= item %></span> <% }); %><% } %>"
    }
  ]
}
```

仔细看示例不难发现，语法跟 ejs 很像，`<% 这里面是 js 语句 %>`，所以只要会写 js，做页面渲染没有什么问题。另外以下是一些可用 js 方法。

-   `formatDate(value, format='LLL', inputFormat='')` 格式化时间格式，关于 format 请前往 [moment](http://momentjs.com/) 文档页面。
-   `formatTimeStamp(value, format='LLL')` 格式化时间戳为字符串。
-   `formatNumber(number)` 格式化数字格式，加上千分位。
-   `countDown(value)` 倒计时，显示离指定时间还剩下多少天，只支持时间戳。
-   下面 filters 中的方法也可以使用如： `<%= date(data.xxx, 'YYYY-MM-DD')%>`
-   可以联系我们添加更多公用方法。

如：

```json
{
    "data": {
        "user": "no one"
    },
    "body": {
        "type": "tpl",
        "tpl": "User: <%= formatDate(data.time, 'YYYY-MM-DD') %>"
    }
}
```

如果只想简单取下变量，可以用 `$xxx` 或者 `${xxx}`。同时如果不指定渲染器类型，默认就是 `tpl`, 所以以上示例可以简化为。

> 取值支持多级，如果层级比较深可以用 `.` 来分割如： `${xx.xxx.xx}`
> 另外 `$&` 表示直接获取当前的 `data`。

```schema:height="200"
{
  "data": {
    "user": "no one"
  },
  "body": "User: $user"
}
```

`注意：$xxx 与 <%= data.xxx %> 这两种语法不能同时使用，只有一种有效，所以不要交叉使用。`

通过 `$xxx` 取到的值，默认是会做 html 转义的，也就是说  `$xxx` 完全等价于 `${xxx | html}`, 如果你想什么都不做，那么请这么写 `${xxx | raw}`。

从上面的语法可以看出来，取值时是支持指定 filter 的，那么有哪些 filter 呢？

-   `html` 转义 html 如：`${xxx|html}`。
-   `json` json stringify。
-   `raw` 表示不转换, 原样输出。
-   `date` 做日期转换如： `${xxx | date:YYYY-MM-DD}`
-   `number` 自动给数字加千分位。`${xxx | number}` `9999` => `9,999`
-   `trim` 把前后多余的空格去掉。
-   `percent` 格式化成百分比。`${xxx | percent}` `0.8232343` => `82.32%`
-   `round` 四舍五入取整。
-   `truncate` 切除， 当超出 200 个字符时，后面的部分直接显示 ...。 `${desc | truncate:500:...}`
-   `url_encode` 做 url encode 转换。
-   `url_decode` 做 url decode 转换。
-   `default` 当值为空时，显示其他值代替。 `${xxx | default:-}` 当为空时显示 `-`
-   `join` 当值是 array 时，可以把内容连起来。\${xxx | join:,}
-   `first` 获取数组的第一个成员。
-   `last` 获取数组的最后一个成员。
-   `pick` 如果是对象则从当前值中再次查找值如： `${xxx|pick:yyy}` 等价于 `${xxx.yyy}`。如果是数组，则做 map 操作，操作完后还是数组，不过成员已经变成了你选择的东西。如: `${xxx|pick:bbb}` 如果 xxx 的值为 `[{aaa: 1, bbb: 2}]` 经过处理后就是 `[2]`。更复杂的用法： `${xxx|pick:a~aaa,b~bbb}` 经过处理就是 `[{a:1, b: 2}]`
-   `split` 可以将字符传通过分隔符分离成数组，默认分隔符为 `,` 如： `${ids|split|last}` 即取一段用逗号分割的数值中的最后一个。
-   `nth` 取数组中的第 n 个成员。如： `${ids|split|nth:1}`
-   `str2date` 请参考 [date](./Date.md) 中日期默认值的设置格式。
-   `duration` 格式化成时间端如：`2` -=> `2秒` `67` => `1分7秒` `1111111` => `13天21时39分31秒`
-   `asArray` 将数据包成数组如： `a` => `[a]`
-   `lowerCase` 转小写
-   `upperCase` 转大写
-   `base64Encode` base64 转码
-   `base64Decode` base64 解码
-   `filter` 过滤数组，操作对象为数组，当目标对象不是数组时将无效。使用语法 ${xxx | filter: 参与过滤的字段集合:指令:取值变量名}。比如: `${xxx|filter:readonly:isTrue}` 将xxx 数组中 readonly 为 true 的成员提取出来。再来个栗子：`${xxx|filter:a,b:match:keywords}` 将 xxx 数组中成员变量 a 或者 b 的值与环境中 keywords 的值相匹配的提取出来。如果不需要取变量，也可以写固定值如：`${xxx|filter:a,b:match:'123'}`

组合使用。

-   `${&|json|html}` 把当前可用的数据全部打印出来。`$&` 取当前值，json 做 json stringify，然后 html 转义。
-   `${rows|first|pick:id}` 把 rows 中的第一条数据中的 id 取到。
-   `${rows|pick:id|join:,}`


没有找到合适的？可以自定义 filter。如果是 AMIS 平台用户，可以将以下代码加入到自定义组件中，如果不是请想办法插入以下代码。


```js
import {registerFilter} from 'amis';

registerFilter('my-filter', (input:string) => `${input}Boom`);
```

加入成功后就可以这样使用了 `${xxx | my-filter}`。 如果 `xxx` 的值是 `abc` 那么输出将会是 `abcBoom`。