### Chained-Select

无限级别下拉，只支持单选，且必须和 `source` 搭配，通过 API 拉取数据，只要 API 有返回结果，就能一直无限级别下拉下去。

-   `type` 请设置成 `chained-select`
-   `options` 选项配置，类型为数组，成员格式如下。
    -   `label` 文字
    -   `value` 值
-   `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。另外也可以用 `$xxxx` 来获取当前作用域中的变量。
    更多配置请参考 [FormItem](./FormItem.md)。
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="300" scope="form-item"
{
  "name": "select3",
  "type": "chained-select",
  "label": "级联下拉",
  "source": "/api/mock2/options/chainedOptions?waitSeconds=1&parentId=$parentId&level=$level&maxLevel=4&waiSeconds=1",
  "value": "a,b"
}
```
