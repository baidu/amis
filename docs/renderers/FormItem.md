### FormItem

Form 中主要是由各种 FormItem 组成。FormItem 中主要包含这些字段。

-   `name` 字段名，表单提交时的 key。
-   `value` 值，可以通过它设置默认值。
-   `label` 描述标题，当表单为水平布局时，左边即便是不设置 label 为了保持对齐也会留空，如果想要去掉空白，请设置成 `false`。
-   `description` 描述内容。
-   `placeholder` 占位内容。
-   `type` 指定表单类型，如： `text`、`textarea`、`date`、`email`等等
-   `inline` 是否为 inline 模式。
-   `submitOnChange` 是否该表单项值发生变化时就提交当前表单。
-   `className` 表单最外层类名。
-   `disabled` 当前表单项是否是禁用状态。
-   `disabledOn` 通过[表达式](./Types.md#表达式)来配置当前表单项的禁用状态。
-   `visible` 是否可见。
-   `visibleOn` 通过[表达式](./Types.md#表达式)来配置当前表单项是否显示。
-   `hidden` 是否隐藏，不要跟 `visible` `visibleOn` 同时配置
-   `hiddenOn` 通过[表达式](./Types.md#表达式)来配置当前表单项是否隐藏。
-   `inputClassName` 表单控制器类名。
-   `labelClassName` label 的类名。
-   `required` 是否为必填。
-   `requiredOn` 通过[表达式](./Types.md#表达式)来配置当前表单项是否为必填。
-   `validations` 格式验证，支持设置多个，多个规则用英文逗号隔开。

    -   `isEmptyString` 必须是空白字符。
    -   `isEmail` 必须是 Email。
    -   `isUrl` 必须是 Url。
    -   `isNumeric` 必须是 数值。
    -   `isAlpha` 必须是 字母。
    -   `isAlphanumeric` 必须是 字母或者数字。
    -   `isInt` 必须是 整形。
    -   `isFloat` 必须是 浮点形。
    -   `isLength:length` 是否长度正好等于设定值。
    -   `minLength:length` 最小长度。
    -   `maxLength:length` 最大长度。
    -   `maximum:length` 最大值。
    -   `minimum:length` 最小值。
    -   `equals:xxx` 当前值必须完全等于 xxx。
    -   `equalsField:xxx` 当前值必须与 xxx 变量值一致。
    -   `isJson` 是否是合法的 Json 字符串。
    -   `notEmptyString` 要求输入内容不是空白。
    -   `isUrlPath` 是 url 路径。
    -   `matchRegexp:/foo/` 必须命中某个正则。
    -   `matchRegexp1:/foo/` 必须命中某个正则。
    -   `matchRegexp2:/foo/` 必须命中某个正则。
    -   `matchRegexp3:/foo/` 必须命中某个正则。
    -   `matchRegexp4:/foo/` 必须命中某个正则。
        如：

    ```js
    {
      "validations": "isNumeric,minimum:10",

      // 或者对象配置方式, 推荐
      "validations": {
        "isNumeric": true,
        "minimum": 10
      }
    }
    ```

-   `validationErrors` 自定义错误提示, 配置为对象, key 为规则名, value 为错误提示字符串(提示:其中`$1`表示输入)
    如：
    ```json
    {
        "validationErrors": {
            "isEmail": "请输入正确的邮箱地址"
        }
    }
    ```
-   `validateOnChange` 是否修改就验证数值，默认当表单提交过就会每次修改验证，如果要关闭请设置为 `false`，即便是关了，表单提交前还是会验证的。

```schema:height="200" scope="form-item"
{
  "type": "text",
  "name": "test1",
  "label": "Label",
  "description": "Description...",
  "placeholder": "Placeholder",
  "validateOnChange": true,
  "validations": "matchRegexp: /^a/, minLength:3,maxLength:5",
  "validationErrors": {
    "matchRegexp": "必须为a开头",
    "minLength": "小伙伴，最低为$1个字符!"
  }
}
```

不同类型的表单，可配置项还有更多，具体请看下面对应的类型。
