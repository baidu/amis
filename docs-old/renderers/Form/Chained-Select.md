### Chained-Select

无限级别下拉，只支持单选，且必须和 `source` 搭配，通过 API 拉取数据，只要 API 有返回结果，就能一直无限级别下拉下去。

-   `type` 请设置成 `chained-select`
-   `options` 选项配置，类型为数组，成员格式如下。
    -   `label` 文字
    -   `value` 值
-   `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。另外也可以用 `$xxxx` 来获取当前作用域中的变量。
-   `joinValues` 默认为 `true`
-   单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
-   多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
-   `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 `value` 的值封装为数组，作为当前表单项的值。
-   `delimiter` 默认为 `,`
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

```schema:height="300" scope="form-item"
{
  "name": "select3",
  "type": "chained-select",
  "label": "级联下拉",
  "source": "/api/mock2/options/chainedOptions?waitSeconds=1&parentId=$parentId&level=$level&maxLevel=4&waiSeconds=1",
  "value": "a,b"
}
```
