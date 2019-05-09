### Tpl

tpl 类型的渲染器支持用 JS 模板引擎来组织输出，采用的 lodash 的 [template](https://lodash.com/docs/4.15.0#template)，关于语法部分，请前往 lodash 文档页面。

```schema:height="200"
{
  "data": {
    "user": "no one"
  },
  "body": {
    "type": "tpl",
    "tpl": "User: <%= data.user%>"
  }
}
```

可用 js 方法。

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

如果只想简单取下变量，可以用 `$xxx` 或者 `${xxx}`。同时如果不指定类型，默认就是 `tpl`, 所以以上示例可以简化为。

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

通过 `$xxx` 取到的值，默认是不做任何处理，如果希望把 html 转义了的，请使用：`${xxx | html}`。

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
-   `pick` 如果是对象则从当前值中再次查找值如： `${xxx|pick:yyy}` 等价于 `${xxx.yyy}`。如果是数组，则做 map 操作，操作完后还是数组，不过成员已经变成了你选择的东西。
-   `ubb2html` 我想你应该不需要，贴吧定制的 ubb 格式。
-   `html2ubb` 我想你应该不需要，贴吧定制的 ubb 格式。
-   `split` 可以将字符传通过分隔符分离成数组，默认分隔符为 `,` 如： `${ids|split|last}` 即取一段用逗号分割的数值中的最后一个。
-   `nth` 取数组中的第 n 个成员。如： `${ids|split|nth:1}`
-   `str2date` 请参考 [date](./Date.md) 中日期默认值的设置格式。
-   `duration` 格式化成时间端如：`2` -=> `2秒` `67` => `1分7秒` `1111111` => `13天21时39分31秒`
-   `asArray` 将数据包成数组如： `a` => `[a]`
-   `lowerCase` 转小写
-   `upperCase` 转大写
-   `base64Encode` base64 转码
-   `base64Decode` base64 解码

组合使用。

-   `${&|json|html}` 把当前可用的数据全部打印出来。\$& 取当前值，json 做 json stringify，然后 html 转义。
-   `${rows:first|pick:id}` 把 rows 中的第一条数据中的 id 取到。
-   `${rows|pick:id|join:,}`
