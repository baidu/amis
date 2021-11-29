---
title: 表达式
description:
type: 0
group: 💡 概念
menuName: 表达式
icon:
order: 13
---

一般来说，属性名类似于`xxxOn` 或者 `className` 的配置项，都可以使用表达式进行配置，表达式具有如下的语法：

```json
{
  "type": "tpl",
  "tpl": "当前作用域中变量 show 是 1 的时候才可以看得到我哦~",
  "visibleOn": "this.show === 1"
}
```

其中：`this.show === 1` 就是表达式。

## 表达式语法

> 表达式语法实际上是 JavaScript 代码，更多 JavaScript 知识查看 [这里](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)。
>
> 表达式中不要使用`${xxx}`语法，这个是数据映射的语法规则，不要搞混淆了！

在 amis 的实现过程中，当正则匹配到某个组件存在`xxxOn`语法的属性名时，会尝试进行下面步骤（以上面配置为例）：

1. 提取`visibleOn`配置项配置的 JavaScript 语句`this.show === 1`，并以当前组件的数据域为这段代码的数据作用域，执行这段 js 代码；
2. 之后将执行结果赋值给`visible`并添加到组件属性中
3. 执行渲染。当前示例中：`visible`代表着是否显示当前组件；

组件不同的配置项会有不同的效果，请大家在组件文档中多留意。

> 表达式的执行结果预期应该是`boolean`类型值，如果不是，amis 会根据 JavaScript 的规则将结果视作`boolean`类型进行判断

## 新表达式语法

> 1.5.0 及以上版本

原来的表达式用的就是原生 js，灵活性虽大，但是安全性不佳，为了与后端公式保持统一，故引入了新的规则，如：`${这里是表达式}`，也就是说如果开始字符是 `${` 且 `}` 结尾则认为是新版本的表达式。这个规则与模板中的语法保持一致。

- `${a == 1}` 变量 a 是否和 1 相等
- `${a % 2}` 变量 a 是否为偶数。

表达式中的语法与默认模板中的语法保持一致，所以以下示例直接用模板来方便呈现结果。

```schema
{
  "type": "page",
  "data": {
    "a": 1,
    "key": "y",
    "obj": {
      "x": 2,
      "y": 3
    }
  },
  "body": [
    "a is ${a} <br />",
    "a + 1 is ${a + 1} <br />",
    "obj.x is ${obj.x} <br />",
    "obj['x'] is ${obj['x']} <br />",
    "obj[key] is ${obj[key]} <br />"
  ]
}
```

### 公式

除了支持简单表达式外，还集成了很多公式(函数)如：

```schema
{
  "type": "page",
  "data": {
    "a": ""
  },
  "body": "1, 2, 3, 4 的平均数位 ${ AVG(1, 2, 3, 4)}"
}
```

## 逻辑函数

可以通过条件函数，也可以直接用三元表达式如：`${ 语文成绩 > 80 ? "优秀" : "继续努力" }`

### IF

判断函数，语法：IF(判断条件, 符合条件时返回值, 不符合条件时返回值)

`IF(语文成绩 > 80, "优秀", "继续努力")` 如果语文成绩大于 80，则返回优秀，否则返回继续努力`

```schema
{
  "type": "page",
  "data": {
    "语文成绩": 81
  },
  "body": "当前成绩：${IF(语文成绩 > 80, '优秀', '继续努力')}"
}
```

### AND

条件全部符合，返回 true，否则返回 false

如：AND(条件 1, 条件 2)

`AND(语文成绩>80, 数学成绩>80)` 语文成绩和数学成绩都大于 80，则返回 true，否则返回 false

### OR

条件符合其中一个，返回 true，如果条件全部都不符合，则返回 false

`OR(语文成绩>80, 数学成绩>80)` 语文成绩或者数学成绩有一门大于 80，则返回 true，如果两门都小于 80，则返回 false

### XOR

异或处理，如果两个条件相同，则返回 false，否则返回 true

`XOR(语文成绩>80, 数学成绩>80)` 语文成绩与数学成绩都大于 80 或者都小于 80，则返回 false，否则返回 true

### IFS

判断函数集合，相当于多个 else if 合并成一个

`IFS(语文成绩 > 80, "优秀", 语文成绩 > 60, "良", "继续努力")` 如果语文成绩大于 80，则返回优秀，否则判断大于 60 分，则返回良，否则返回继续努力。

## 数学函数

### ABS

返回数字 number 的绝对值

`ABS(-8)`结果为 8， `ABS(40)`结果为 40。

### MAX

获取最大值

`MAX(语文成绩, 数学成绩)` 那个分数高返回哪个。

### MIN

获取最小值

`MIN(数值1, 数值2, 数值3)`

### SUM

求和

`SUM(数值1, 数值2, 数值3)`

### INT

将数字(number)向下取整为最接近的整数

`INT(number)`

### MOD

返回两数相除的余数，参数 number 是被除数，divisor 是除数

`MOD(number,divisor)`

### PI

圆周率 3.1415...

`PI()`

### ROUND

将数字四舍五入到指定的位数，number 为要处理的数字，num_digits 为指定小数位数

`ROUND(number, num_digits)`

### SQRT

开平方，参数 number 为非负数

`SQRT(number)`

### AVG

返回所有参数的平均值，参数 v 是子表的某一个数字控件

`AVG(数值1, 数字2)`

### UPPERMONEY

将数值转为中文大写金额

`UPPERMONEY(数值)`

### RAND

返回大于等于 0 且小于 1 的均匀分布随机实数。每一次触发计算都会变化。

`RAND()*100` 返回 0-100 之间的随机数

## 文本函数

### LEFT

返回文本中第一个字符到指定个数的字符

`LEFT(文本, 长度)`

### RIGHT

从文本右侧获取指定个数的字符文本

`RIGHT(文本, 长度)`

### LEN

计算文本的长度

`LEN(文本)`

### ISEMPTY

判断值是否为空字符串、空对象或者空数组。

`ISEMPTY(变量)`

### CONCATENATE

将多个文本字符串合并成一个文本字符串。建议直接用 `` 字符模板

`CONCATENATE(A,B,C)`

### CHAR

返回计算机字符集的数字代码所对应的字符。

`CHAR(10)`

### LOWER

将一个文本字符串中的所有大写字母转换为小写字母。

`LOWER("ABC")`

### UPPER

将一个文本字符串中的所有小写字母转换为大写字母。

`LOWER("abc")`，返回 ABC

### SPLIT

将文本按指定字符串分割成数组。

`SPLIT("a,b,c", ",")` 返回 `["a", "b", "c"]`

### TRIM

删除字符串首尾的空格

`TRIM(" ab c ")` 返回 `"ab c"`

### STARTSWITH

判断字符串(text)是否以特定字符串(startString)开始，是则返回 True，否则返回 False

`STARTSWITH(text, "abc")` 当 text 是“abc”开头时，返回为“true”，否则返回“false”

### CONTAINS

判断参数 1 中的文本是否包含参数 2 中的文本。

`CONTAINS("abcdefg", "ab")`

### REPLACE

使用其他文本字符串并根据所指定的字符数替换某文本字符串中的部分文本，old_text 为某文本字符串，start_num 为要替换的起始位置编号，num_chars 为要替换的字符个数，new_text 为替换后的字符串

`REPLACE(old_text,start_num,num_chars,new_text)`

### SEARCH

返回文本字符串 find_text 在指定字符串 within_text 中出现的起始位置编号，未找到则返回-1（忽略大小写），其中 start_num 为在 within_text 中第几个位置开始查找

`SEARCH(find,text,start)`

### MID

返回文本字符串中从指定位置开始的特定数目的字符，text 为文本字符串，start_num 为指定开始位置，num_chars 为特定数目

`MID(text,start_num,num_chars)`

## 日期函数

### DATE

返回日期对象

`DATE(year,month,day,[hour,minute,second])`

### STRTODATE

字符文本转成日期对象

`STRTODATE("2021-11-29", "YYYY-MM-DD")`

### DATETOSTR

将日期对象按格式转成日期字符

`DATETOSTR(date, "YYYY-MM-DD")`

### TIMESTAMP

返回时间的时间戳

`TIMESTAMP(date)`

### TODAY

返回今天。

`TODAY()`

### NOW

返回现在。

`NOW()`

### STARTOF

返回日期的指定范围的开端

`STARTOF(date, "day")` 返回日期的开头 00:00:00

### ENDOF

返回日期的指定范围的结尾

`ENDOF(TODAY(), "day")` 返回今天的的结尾 23:59:59

### YEAR

返回某日期的年份。

`YEAR(date)`

### MONTH

返回某日期的月份。 月份是介于 1 到 12 之间的整数。

`MONTH(date)`

### DAY

返回某日期的天数。 天数是介于 1 到 31 之间的整数。

`DAY(date)`

### HOUR

返回某日期的小时数。

`HOUR(date)`

### MINUTE

返回某日期的分钟数。

`MINUTE(date)`

### SECOND

返回某日期的秒数。

`SECOND(date)`

### YEARS

返回两个日期之间的年数差值

`YEARS(endDate, startDate)`

### MINUTES

返回两个时间之间的分钟数。

`MINUTES(endDate,startDate)`

### DAYS

返回两个日期之间的天数。

`DAYS(endDate, startDate)`

### WORKDAYS

返回两个日期之间的工作日天数。

`WORKDAYS(endDate, startDate)`

### HOURS

返回两个日期之间的小时数。

`DAYS(endDate, startDate)`

### DATEMODIFY

修改日期

`DATEMODIFY(date, 2, "days")` 在已有变量的基础上加 2 天，第三个参数支持各种单位。

### ISBEFORE

日期比较

`ISBEFORE(a, b)` 比较第一个日期是否在第二个日期前面

### ISSAMEORBEFORE

日期比较

`ISSAMEORBEFORE(a, b)` 比较第一个日期是否在第二个日期前面，或者相同

### ISAFTER

日期比较

`ISAFTER(a, b)` 比较第一个日期是否在第二个日期后面

### ISSAMEORAFTER

日期比较

`ISSAMEORAFTER(a, b)` 比较第一个日期是否在第二个日期后面，或者相同

## 其他

### COUNT

返回数组长度

`COUNT(value)`
