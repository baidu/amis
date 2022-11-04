## 逻辑函数

### IF

用法：`IF(condition, consequent, alternate)`

 * `condition:expression` 条件表达式.
 * `consequent:any` 条件判断通过的返回结果
 * `alternate:any` 条件判断不通过的返回结果

返回：`any` 根据条件返回不同的结果

示例：IF(A, B, C)

如果满足条件A，则返回B，否则返回C，支持多层嵌套IF函数。

也可以用表达式如：A ? B : C

### AND

用法：`AND(expression1, expression2, ...expressionN)`

 * `conditions:...expression` 条件表达式.

返回：`boolean` 

条件全部符合，返回 true，否则返回 false

示例：AND(语文成绩>80, 数学成绩>80)

语文成绩和数学成绩都大于 80，则返回 true，否则返回 false

也可以直接用表达式如：语文成绩>80 && 数学成绩>80

### OR

用法：`OR(expression1, expression2, ...expressionN)`

 * `conditions:...expression` 条件表达式.

返回：`boolean` 

条件任意一个满足条件，返回 true，否则返回 false

示例：OR(语文成绩>80, 数学成绩>80)

语文成绩和数学成绩任意一个大于 80，则返回 true，否则返回 false

也可以直接用表达式如：语文成绩>80 || 数学成绩>80

### XOR

用法：`XOR(condition1, condition2)`

 * `condition1:expression` 条件表达式1
 * `condition2:expression` 条件表达式2

返回：`boolean` 

异或处理，多个表达式组中存在奇数个真时认为真。

### IFS

用法：`IFS(condition1, result1, condition2, result2,...conditionN, resultN)`

 * `args:...any` 条件，返回值集合

返回：`any` 第一个满足条件的结果，没有命中的返回 false。

判断函数集合，相当于多个 else if 合并成一个。

示例：IFS(语文成绩 > 80, "优秀", 语文成绩 > 60, "良", "继续努力")

如果语文成绩大于 80，则返回优秀，否则判断大于 60 分，则返回良，否则返回继续努力。

## 数学函数

### ABS

用法：`ABS(num)`

 * `num:number` 数值

返回：`number` 传入数值的绝对值

返回传入数字的绝对值

### MAX

用法：`MAX(num1, num2, ...numN)`

 * `num:...number` 数值

返回：`number` 所有传入值中最大的那个

获取最大值，如果只有一个参数且是数组，则计算这个数组内的值

### MIN

用法：`MIN(num1, num2, ...numN)`

 * `num:...number` 数值

返回：`number` 所有传入值中最小的那个

获取最小值，如果只有一个参数且是数组，则计算这个数组内的值

### SUM

用法：`SUM(num1, num2, ...numN)`

 * `num:...number` 数值

返回：`number` 所有传入数值的总和

求和，如果只有一个参数且是数组，则计算这个数组内的值

### INT

用法：`INT(num)`

 * `num:number` 数值

返回：`number` 数值对应的整形

将数值向下取整为最接近的整数

### MOD

用法：`MOD(num, divisor)`

 * `num:number` 被除数
 * `divisor:number` 除数

返回：`number` 两数相除的余数

返回两数相除的余数，参数 number 是被除数，divisor 是除数

### PI

用法：`PI()`

圆周率 3.1415...

### ROUND

用法：`ROUND(num[, numDigits = 2])`

 * `num:number` 要处理的数字
 * `numDigits:number` 小数位数

返回：`number` 传入数值四舍五入后的结果

将数字四舍五入到指定的位数，可以设置小数位。

### FLOOR

用法：`FLOOR(num[, numDigits=2])`

 * `num:number` 要处理的数字
 * `numDigits:number` 小数位数

返回：`number` 传入数值向下取整后的结果

将数字向下取整到指定的位数，可以设置小数位。

### CEIL

用法：`CEIL(num[, numDigits=2])`

 * `num:number` 要处理的数字
 * `numDigits:number` 小数位数

返回：`number` 传入数值向上取整后的结果

将数字向上取整到指定的位数，可以设置小数位。

### SQRT

用法：`SQRT(num)`

 * `num:number` 要处理的数字

返回：`number` 开平方的结果

开平方，参数 number 为非负数

### AVG

用法：`AVG(num1, num2, ...numN)`

 * `num:...number` 要处理的数字

返回：`number` 所有数值的平均值

返回所有参数的平均值，如果只有一个参数且是数组，则计算这个数组内的值

### DEVSQ

用法：`DEVSQ(num1, num2, ...numN)`

 * `num:...number` 要处理的数字

返回：`number` 所有数值的平均值

返回数据点与数据均值点之差（数据偏差）的平方和，如果只有一个参数且是数组，则计算这个数组内的值

### AVEDEV

用法：`AVEDEV(num1, num2, ...numN)`

 * `num:...number` 要处理的数字

返回：`number` 所有数值的平均值

数据点到其算术平均值的绝对偏差的平均值

### HARMEAN

用法：`HARMEAN(num1, num2, ...numN)`

 * `num:...number` 要处理的数字

返回：`number` 所有数值的平均值

数据点的调和平均值，如果只有一个参数且是数组，则计算这个数组内的值

### LARGE

用法：`LARGE(array, k)`

 * `nums:array` 要处理的数字
 * `k:number` 第几大

返回：`number` 所有数值的平均值

数据集中第 k 个最大值

### UPPERMONEY

用法：`UPPERMONEY(num)`

 * `num:number` 要处理的数字

返回：`string` 数值中文大写字符

将数值转为中文大写金额

### RAND

用法：`RAND()`

返回大于等于 0 且小于 1 的均匀分布随机实数。每一次触发计算都会变化。

示例：`RAND()*100`

返回 0-100 之间的随机数

### LAST

用法：`LAST(array)`

 * `arr:...number` 要处理的数组

返回：`any` 最后一个值

取数据最后一个

## 文本函数

### LEFT

用法：`LEFT(text, len)`

 * `text:string` 要处理的文本
 * `len:number` 要处理的长度

返回：`string` 对应字符串

返回传入文本左侧的指定长度字符串。

### RIGHT

用法：`RIGHT(text, len)`

 * `text:string` 要处理的文本
 * `len:number` 要处理的长度

返回：`string` 对应字符串

返回传入文本右侧的指定长度字符串。

### LEN

用法：`LEN(text)`

 * `text:string` 要处理的文本

返回：`number` 长度

计算文本的长度

### LENGTH

用法：`LENGTH(textArr)`

 * `textArr:Array<string>` 要处理的文本集合

返回：`Array<number>` 长度集合

计算文本集合中所有文本的长度

### ISEMPTY

用法：`ISEMPTY(text)`

 * `text:string` 要处理的文本

返回：`boolean` 判断结果

判断文本是否为空

### CONCATENATE

用法：`CONCATENATE(text1, text2, ...textN)`

 * `text:...string` 文本集合

返回：`string` 连接后的文本

将多个传入值连接成文本

### CHAR

用法：`CHAR(code)`

 * `code:number` 编码值

返回：`string` 指定位置的字符

返回计算机字符集的数字代码所对应的字符。

`CHAR(97)` 等价于 "a"

### LOWER

用法：`LOWER(text)`

 * `text:string` 文本

返回：`string` 结果文本

将传入文本转成小写

### UPPER

用法：`UPPER(text)`

 * `text:string` 文本

返回：`string` 结果文本

将传入文本转成大写

### UPPERFIRST

用法：`UPPERFIRST(text)`

 * `text:string` 文本

返回：`string` 结果文本

将传入文本首字母转成大写

### PADSTART

用法：`PADSTART(text)`

 * `text:string` 文本
 * `num:number` 目标长度
 * `pad:string` 用于补齐的文本

返回：`string` 结果文本

向前补齐文本长度

示例 `PADSTART("6", 2, "0")`

返回 `06`

### CAPITALIZE

用法：`CAPITALIZE(text)`

 * `text:string` 文本

返回：`string` 结果文本

将文本转成标题

示例 `CAPITALIZE("star")`

返回 `Star`

### ESCAPE

用法：`ESCAPE(text)`

 * `text:string` 文本

返回：`string` 结果文本

对文本进行 HTML 转义

示例 `ESCAPE("<star>&")`

返回 `&lt;start&gt;&amp;`

### TRUNCATE

用法：`TRUNCATE(text, 6)`

 * `text:string` 文本
 * `text:number` 最长长度

返回：`string` 结果文本

对文本长度进行截断

示例 `TRUNCATE("amis.baidu.com", 6)`

返回 `amis...`

### BEFORELAST

用法：`BEFORELAST(text, '.')`

 * `text:string` 文本
 * `delimiter:string` 结束文本

返回：`string` 判断结果

取在某个分隔符之前的所有字符串

### SPLIT

用法：`SPLIT(text, ',')`

 * `text:string` 文本
 * `delimiter:string` 文本片段

返回：`Array<string>` 文本集

将文本根据指定片段分割成数组

示例：`SPLIT("a,b,c", ",")`

返回 `["a", "b", "c"]`

### TRIM

用法：`TRIM(text)`

 * `text:string` 文本

返回：`string` 处理后的文本

将文本去除前后空格

### STRIPTAG

用法：`STRIPTAG(text)`

 * `text:string` 文本

返回：`string` 处理后的文本

去除文本中的 HTML 标签

示例：`STRIPTAG("<b>amis</b>")`

返回：`amis`

### LINEBREAK

用法：`LINEBREAK(text)`

 * `text:string` 文本

返回：`string` 处理后的文本

将字符串中的换行转成 HTML `<br>`，用于简单换行的场景

示例：`LINEBREAK("\n")`

返回：`<br/>`

### STARTSWITH

用法：`STARTSWITH(text, '片段')`

 * `text:string` 文本
 * `startString:string` 起始文本

返回：`string` 判断结果

判断字符串(text)是否以特定字符串(startString)开始，是则返回 True，否则返回 False

### ENDSWITH

用法：`ENDSWITH(text, '片段')`

 * `text:string` 文本
 * `endString:string` 结束文本

返回：`string` 判断结果

判断字符串(text)是否以特定字符串(endString)结束，是则返回 True，否则返回 False

### CONTAINS

用法：`CONTAINS(text, searchText)`

 * `text:string` 文本
 * `searchText:string` 搜索文本

返回：`string` 判断结果

判断参数 1 中的文本是否包含参数 2 中的文本。

### REPLACE

用法：`REPLACE(text, search, replace)`

 * `text:string` 要处理的文本
 * `search:string` 要被替换的文本
 * `replace:string` 要替换的文本

返回：`string` 处理结果

对文本进行全量替换。

### SEARCH

用法：`SEARCH(text, search, 0)`

 * `text:string` 要处理的文本
 * `search:string` 用来搜索的文本
 * `start:number` 起始位置

返回：`number` 命中的位置

对文本进行搜索，返回命中的位置

### MID

用法：`MID(text, from, len)`

 * `text:string` 要处理的文本
 * `from:number` 起始位置
 * `len:number` 处理长度

返回：`number` 命中的位置

返回文本字符串中从指定位置开始的特定数目的字符

### BASENAME

用法：`BASENAME(text)`

 * `text:string` 要处理的文本

返回：`string` 文件名

返回路径中的文件名

示例：`/home/amis/a.json`

返回：a.json`

## 日期函数

### DATE

用法：`DATE('2021-12-06 08:20:00')`

创建日期对象，可以通过特定格式的字符串，或者数值。

需要注意的是，其中月份的数值是从0开始的，也就是说，
如果是12月份，你应该传入数值11。

### TIMESTAMP

用法：`TIMESTAMP(date, 'x')`

 * `date:date` 日期对象
 * `format:string` 时间戳格式，带毫秒传入 'x'。默认为 'X' 不带毫秒的。

返回：`number` 时间戳

返回时间的时间戳

### TODAY

用法：`TODAY()`

返回今天的日期

### NOW

用法：`NOW()`

返回现在的日期

### DATETOSTR

用法：`DATETOSTR(date, 'YYYY-MM-DD')`

 * `date:date` 日期对象
 * `format:string` 日期格式，默认为 "YYYY-MM-DD HH:mm:ss"

返回：`number` 日期字符串

将日期转成日期字符串

### STARTOF

用法：`STARTOF(date[unit = "day"])`

 * `date:date` 日期对象
 * `unit:string` 比如可以传入 'day'、'month'、'year' 或者 `week` 等等

返回：`date` 新的日期对象

返回日期的指定范围的开端

### ENDOF

用法：`ENDOF(date[unit = "day"])`

 * `date:date` 日期对象
 * `unit:string` 比如可以传入 'day'、'month'、'year' 或者 `week` 等等

返回：`date` 新的日期对象

返回日期的指定范围的末尾

### YEAR

用法：`YEAR(date)`

 * `date:date` 日期对象

返回：`number` 数值

返回日期的年份

### MONTH

用法：`MONTH(date)`

 * `date:date` 日期对象

返回：`number` 数值

返回日期的月份，这里就是自然月份。

### DAY

用法：`DAY(date)`

 * `date:date` 日期对象

返回：`number` 数值

返回日期的天

### HOUR

用法：`HOUR(date)`

 * `date:date` 日期对象

返回：`number` 数值

返回日期的小时

### MINUTE

用法：`MINUTE(date)`

 * `date:date` 日期对象

返回：`number` 数值

返回日期的分

### SECOND

用法：`SECOND(date)`

 * `date:date` 日期对象

返回：`number` 数值

返回日期的秒

### YEARS

用法：`YEARS(endDate, startDate)`

 * `endDate:date` 日期对象
 * `startDate:date` 日期对象

返回：`number` 数值

返回两个日期相差多少年

### MINUTES

用法：`MINUTES(endDate, startDate)`

 * `endDate:date` 日期对象
 * `startDate:date` 日期对象

返回：`number` 数值

返回两个日期相差多少分钟

### DAYS

用法：`DAYS(endDate, startDate)`

 * `endDate:date` 日期对象
 * `startDate:date` 日期对象

返回：`number` 数值

返回两个日期相差多少天

### HOURS

用法：`HOURS(endDate, startDate)`

 * `endDate:date` 日期对象
 * `startDate:date` 日期对象

返回：`number` 数值

返回两个日期相差多少小时

### DATEMODIFY

用法：`DATEMODIFY(date, 2, 'days')`

 * `date:date` 日期对象
 * `num:number` 数值
 * `unit:string` 单位：支持年、月、天等等

返回：`date` 日期对象

修改日期，对日期进行加减天、月份、年等操作

示例：

DATEMODIFY(A, -2, 'month')

对日期 A 进行往前减2月的操作。

### STRTODATE

用法：`STRTODATE(value[, format=""])`

 * `value:string` 日期字符
 * `format:string` 日期格式

返回：`date` 日期对象

将字符日期转成日期对象，可以指定日期格式。

示例：STRTODATE('2021/12/6', 'YYYY/MM/DD')

### ISBEFORE

用法：`ISBEFORE(a, b)`

 * `a:date` 第一个日期
 * `b:date` 第二个日期
 * `unit:string` 单位，默认是 'day'， 即之比较到天

返回：`boolean` 判断结果

判断两个日期，是否第一个日期在第二个日期的前面

### ISAFTER

用法：`ISAFTER(a, b)`

 * `a:date` 第一个日期
 * `b:date` 第二个日期
 * `unit:string` 单位，默认是 'day'， 即之比较到天

返回：`boolean` 判断结果

判断两个日期，是否第一个日期在第二个日期的后面

### ISSAMEORBEFORE

用法：`ISSAMEORBEFORE(a, b)`

 * `a:date` 第一个日期
 * `b:date` 第二个日期
 * `unit:string` 单位，默认是 'day'， 即之比较到天

返回：`boolean` 判断结果

判断两个日期，是否第一个日期在第二个日期的前面或者相等

### ISSAMEORAFTER

用法：`ISSAMEORAFTER(a, b)`

 * `a:date` 第一个日期
 * `b:date` 第二个日期
 * `unit:string` 单位，默认是 'day'， 即之比较到天

返回：`boolean` 判断结果

判断两个日期，是否第一个日期在第二个日期的后面或者相等

## 数组

### COUNT

用法：`COUNT(arr)`

 * `arr:Array<any>` 数组

返回：`boolean` 结果

返回数组的长度

### ARRAYMAP

用法：`ARRAYMAP(arr, item => item)`

 * `arr:Array<any>` 数组
 * `iterator:Array<any>` 箭头函数

返回：`boolean` 结果

数组做数据转换，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。

### ARRAYFILTER

用法：`ARRAYFILTER(arr, item => item)`

 * `arr:Array<any>` 数组
 * `iterator:Array<any>` 箭头函数

返回：`boolean` 结果

数据做数据过滤，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。
将第二个箭头函数返回为 false 的成员过滤掉。

### COMPACT

用法：`COMPACT(arr)`

 * `arr:Array<any>` 数组

返回：`Array<any>` 结果

数组过滤掉 false、null、0 和 ""

示例：

COMPACT([0, 1, false, 2, '', 3]) 得到 [1, 2, 3]

### JOIN

用法：`JOIN(arr, string)`

 * `arr:Array<any>` 数组
 * `separator:String` 分隔符

返回：`String` 结果

数组转成字符串

示例：

JOIN(['a', 'b', 'c'], '=') 得到 'a=b=c'

### CONCAT

用法：`CONCAT(['a', 'b', 'c'], ['1'], ['3'])`

 * `arr:Array<any>` 数组

返回：`Array<any>` 结果

数组合并

示例：

CONCAT(['a', 'b', 'c'], ['1'], ['3']) 得到 ['a', 'b', 'c', '1', '3']

### UNIQ

用法：`UNIQ([{a: '1'}, {b: '2'}, {a: '1'}], 'x')`

 * `arr:Array<any>` 数组
 * `field:string` 字段

返回：`Array<any>` 结果

数组去重，第二个参数「field」，可指定根据该字段去重

示例：

UNIQ([{a: '1'}, {b: '2'}, {a: '1'}]， 'id')

## 其他

### ISTYPE

用法：`ISTYPE([{a: '1'}, {b: '2'}, {a: '1'}], 'array')`

 * `判断对象:string` null

返回：`boolean` 结果结果

判断是否为类型支持：string, number, array, date, plain-object。

