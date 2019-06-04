### Formula

公式类型，可以设置公式，并将结果设置给目标值。

-   `type` 请设置成 `formula`
-   `name` 这是变量名，公式结果将作用到此处指定的变量中去。
-   `formula` 公式。如： `data.var_a + 2`，其实就是 JS 表达式。
-   `condition` 作用条件。有两种写法
    -   用 tpl 语法，把关联的字段写上如： `${xxx} ${yyy}` 意思是当 xxx 和 yyy 的取值结果变化了就再应用一次公式结果。
    -   自己写判断如: `data.xxx == "a" && data.xxx !== data.__prev.xxx` 当 xxx 变化了，且新的值是字符 "a" 时应用，可以写更加复杂的判断。
-   `initSet` 初始化时是否设置。默认是 `true`
-   `autoSet` 观察公式结果，如果计算结果有变化，则自动应用到变量上。默认为 `true`。
-   `id` 定义个名字，当某个按钮的目标指定为此值后，会触发一次公式应用。这个机制可以在 `autoSet` 为 false 时用来手动触发。
    > 为什么不是设置 `name`?
    > 因为 name 值已经用来设置目标变量名了，这个表单项肯定已经存在了，所以不是唯一了，不能够被按钮指定。

```schema:height="300" scope="form"
[
  {
    "type": "number",
    "name": "a",
    "label": "A"
  },
  {
    "type": "number",
    "name": "b",
    "label": "B"
  },
  {
    "type": "number",
    "name": "sum",
    "label": "和",
    "disabled": true,
    "description": "自动计算 A + B"
  },
  {
    "type": "formula",
    "name": "sum",
    "value": 0,
    "formula": "a + b"
  }
]
```
