/**
 * 公式文档
 */
exports.doc = [
  {
    name: "IF",
    description: "示例：IF(A, B, C)\n\n如果满足条件A，则返回B，否则返回C，支持多层嵌套IF函数。\n\n也可以用表达式如：A ? B : C",
    example: "IF(condition, consequent, alternate)",
    params: [
      {
        type: "expression",
        name: "condition",
        description: "条件表达式."
      },
      {
        type: "any",
        name: "consequent",
        description: "条件判断通过的返回结果"
      },
      {
        type: "any",
        name: "alternate",
        description: "条件判断不通过的返回结果"
      }
    ],
    returns: {
      type: "any",
      description: "根据条件返回不同的结果"
    },
    namespace: "逻辑函数"
  },
  {
    name: "AND",
    description: "条件全部符合，返回 true，否则返回 false\n\n示例：AND(语文成绩>80, 数学成绩>80)\n\n语文成绩和数学成绩都大于 80，则返回 true，否则返回 false\n\n也可以直接用表达式如：语文成绩>80 && 数学成绩>80",
    example: "AND(expression1, expression2, ...expressionN)",
    params: [
      {
        type: "...expression",
        name: "conditions",
        description: "条件表达式."
      }
    ],
    returns: {
      type: "boolean",
      description: null
    },
    namespace: "逻辑函数"
  },
  {
    name: "OR",
    description: "条件任意一个满足条件，返回 true，否则返回 false\n\n示例：OR(语文成绩>80, 数学成绩>80)\n\n语文成绩和数学成绩任意一个大于 80，则返回 true，否则返回 false\n\n也可以直接用表达式如：语文成绩>80 || 数学成绩>80",
    example: "OR(expression1, expression2, ...expressionN)",
    params: [
      {
        type: "...expression",
        name: "conditions",
        description: "条件表达式."
      }
    ],
    returns: {
      type: "boolean",
      description: null
    },
    namespace: "逻辑函数"
  },
  {
    name: "XOR",
    description: "异或处理，两个表达式同时为「真」，或者同时为「假」，则结果返回为「真」",
    example: "XOR(condition1, condition2)",
    params: [
      {
        type: "expression",
        name: "condition1",
        description: "条件表达式1"
      },
      {
        type: "expression",
        name: "condition2",
        description: "条件表达式2"
      }
    ],
    returns: {
      type: "boolean",
      description: null
    },
    namespace: "逻辑函数"
  },
  {
    name: "IFS",
    description: "判断函数集合，相当于多个 else if 合并成一个。\n\n示例：IFS(语文成绩 > 80, \"优秀\", 语文成绩 > 60, \"良\", \"继续努力\")\n\n如果语文成绩大于 80，则返回优秀，否则判断大于 60 分，则返回良，否则返回继续努力。",
    example: "IFS(condition1, result1, condition2, result2,...conditionN, resultN)",
    params: [
      {
        type: "...any",
        name: "args",
        description: "条件，返回值集合"
      }
    ],
    returns: {
      type: "any",
      description: "第一个满足条件的结果，没有命中的返回 false。"
    },
    namespace: "逻辑函数"
  },
  {
    name: "ABS",
    description: "返回传入数字的绝对值",
    example: "ABS(num)",
    params: [
      {
        type: "number",
        name: "num",
        description: "数值"
      }
    ],
    returns: {
      type: "number",
      description: "传入数值的绝对值"
    },
    namespace: "数学函数"
  },
  {
    name: "MAX",
    description: "获取最大值，如果只有一个参数且是数组，则计算这个数组内的值",
    example: "MAX(num1, num2, ...numN)",
    params: [
      {
        type: "...number",
        name: "num",
        description: "数值"
      }
    ],
    returns: {
      type: "number",
      description: "所有传入值中最大的那个"
    },
    namespace: "数学函数"
  },
  {
    name: "MIN",
    description: "获取最小值，如果只有一个参数且是数组，则计算这个数组内的值",
    example: "MIN(num1, num2, ...numN)",
    params: [
      {
        type: "...number",
        name: "num",
        description: "数值"
      }
    ],
    returns: {
      type: "number",
      description: "所有传入值中最小的那个"
    },
    namespace: "数学函数"
  },
  {
    name: "SUM",
    description: "求和，如果只有一个参数且是数组，则计算这个数组内的值",
    example: "SUM(num1, num2, ...numN)",
    params: [
      {
        type: "...number",
        name: "num",
        description: "数值"
      }
    ],
    returns: {
      type: "number",
      description: "所有传入数值的总和"
    },
    namespace: "数学函数"
  },
  {
    name: "INT",
    description: "将数值向下取整为最接近的整数",
    example: "INT(num)",
    params: [
      {
        type: "number",
        name: "num",
        description: "数值"
      }
    ],
    returns: {
      type: "number",
      description: "数值对应的整形"
    },
    namespace: "数学函数"
  },
  {
    name: "MOD",
    description: "返回两数相除的余数，参数 number 是被除数，divisor 是除数",
    example: "MOD(num, divisor)",
    params: [
      {
        type: "number",
        name: "num",
        description: "被除数"
      },
      {
        type: "number",
        name: "divisor",
        description: "除数"
      }
    ],
    returns: {
      type: "number",
      description: "两数相除的余数"
    },
    namespace: "数学函数"
  },
  {
    name: "PI",
    description: "圆周率 3.1415...",
    example: "PI()",
    params: [],
    returns: {
      type: "number",
      description: "圆周率数值"
    },
    namespace: "数学函数"
  },
  {
    name: "ROUND",
    description: "将数字四舍五入到指定的位数，可以设置小数位。",
    example: "ROUND(num[, numDigits = 2])",
    params: [
      {
        type: "number",
        name: "num",
        description: "要处理的数字"
      },
      {
        type: "number",
        name: "numDigits",
        description: "小数位数"
      }
    ],
    returns: {
      type: "number",
      description: "传入数值四舍五入后的结果"
    },
    namespace: "数学函数"
  },
  {
    name: "FLOOR",
    description: "将数字向下取整到指定的位数，可以设置小数位。",
    example: "FLOOR(num[, numDigits=2])",
    params: [
      {
        type: "number",
        name: "num",
        description: "要处理的数字"
      },
      {
        type: "number",
        name: "numDigits",
        description: "小数位数"
      }
    ],
    returns: {
      type: "number",
      description: "传入数值向下取整后的结果"
    },
    namespace: "数学函数"
  },
  {
    name: "CEIL",
    description: "将数字向上取整到指定的位数，可以设置小数位。",
    example: "CEIL(num[, numDigits=2])",
    params: [
      {
        type: "number",
        name: "num",
        description: "要处理的数字"
      },
      {
        type: "number",
        name: "numDigits",
        description: "小数位数"
      }
    ],
    returns: {
      type: "number",
      description: "传入数值向上取整后的结果"
    },
    namespace: "数学函数"
  },
  {
    name: "SQRT",
    description: "开平方，参数 number 为非负数",
    example: "SQRT(num)",
    params: [
      {
        type: "number",
        name: "num",
        description: "要处理的数字"
      }
    ],
    returns: {
      type: "number",
      description: "开平方的结果"
    },
    namespace: "数学函数"
  },
  {
    name: "AVG",
    description: "返回所有参数的平均值，如果只有一个参数且是数组，则计算这个数组内的值",
    example: "AVG(num1, num2, ...numN)",
    params: [
      {
        type: "...number",
        name: "num",
        description: "要处理的数字"
      }
    ],
    returns: {
      type: "number",
      description: "所有数值的平均值"
    },
    namespace: "数学函数"
  },
  {
    name: "DEVSQ",
    description: "返回数据点与数据均值点之差（数据偏差）的平方和，如果只有一个参数且是数组，则计算这个数组内的值",
    example: "DEVSQ(num1, num2, ...numN)",
    params: [
      {
        type: "...number",
        name: "num",
        description: "要处理的数字"
      }
    ],
    returns: {
      type: "number",
      description: "所有数值的平均值"
    },
    namespace: "数学函数"
  },
  {
    name: "AVEDEV",
    description: "数据点到其算术平均值的绝对偏差的平均值",
    example: "AVEDEV(num1, num2, ...numN)",
    params: [
      {
        type: "...number",
        name: "num",
        description: "要处理的数字"
      }
    ],
    returns: {
      type: "number",
      description: "所有数值的平均值"
    },
    namespace: "数学函数"
  },
  {
    name: "HARMEAN",
    description: "数据点的调和平均值，如果只有一个参数且是数组，则计算这个数组内的值",
    example: "HARMEAN(num1, num2, ...numN)",
    params: [
      {
        type: "...number",
        name: "num",
        description: "要处理的数字"
      }
    ],
    returns: {
      type: "number",
      description: "所有数值的平均值"
    },
    namespace: "数学函数"
  },
  {
    name: "LARGE",
    description: "数据集中第 k 个最大值",
    example: "LARGE(array, k)",
    params: [
      {
        type: "array",
        name: "nums",
        description: "要处理的数字"
      },
      {
        type: "number",
        name: "k",
        description: "第几大"
      }
    ],
    returns: {
      type: "number",
      description: "所有数值的平均值"
    },
    namespace: "数学函数"
  },
  {
    name: "UPPERMONEY",
    description: "将数值转为中文大写金额",
    example: "UPPERMONEY(num)",
    params: [
      {
        type: "number",
        name: "num",
        description: "要处理的数字"
      }
    ],
    returns: {
      type: "string",
      description: "数值中文大写字符"
    },
    namespace: "数学函数"
  },
  {
    name: "RAND",
    description: "返回大于等于 0 且小于 1 的均匀分布随机实数。每一次触发计算都会变化。\n\n示例：`RAND()*100`\n\n返回 0-100 之间的随机数",
    example: "RAND()",
    params: [],
    returns: {
      type: "number",
      description: "随机数"
    },
    namespace: "数学函数"
  },
  {
    name: "LAST",
    description: "取数据最后一个",
    example: "LAST(array)",
    params: [
      {
        type: "...number",
        name: "arr",
        description: "要处理的数组"
      }
    ],
    returns: {
      type: "any",
      description: "最后一个值"
    },
    namespace: "数学函数"
  },
  {
    name: "LEFT",
    description: "返回传入文本左侧的指定长度字符串。",
    example: "LEFT(text, len)",
    params: [
      {
        type: "string",
        name: "text",
        description: "要处理的文本"
      },
      {
        type: "number",
        name: "len",
        description: "要处理的长度"
      }
    ],
    returns: {
      type: "string",
      description: "对应字符串"
    },
    namespace: "文本函数"
  },
  {
    name: "RIGHT",
    description: "返回传入文本右侧的指定长度字符串。",
    example: "RIGHT(text, len)",
    params: [
      {
        type: "string",
        name: "text",
        description: "要处理的文本"
      },
      {
        type: "number",
        name: "len",
        description: "要处理的长度"
      }
    ],
    returns: {
      type: "string",
      description: "对应字符串"
    },
    namespace: "文本函数"
  },
  {
    name: "LEN",
    description: "计算文本的长度",
    example: "LEN(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "要处理的文本"
      }
    ],
    returns: {
      type: "number",
      description: "长度"
    },
    namespace: "文本函数"
  },
  {
    name: "LENGTH",
    description: "计算文本集合中所有文本的长度",
    example: "LENGTH(textArr)",
    params: [
      {
        type: "Array<string>",
        name: "textArr",
        description: "要处理的文本集合"
      }
    ],
    returns: {
      type: "Array<number>",
      description: "长度集合"
    },
    namespace: "文本函数"
  },
  {
    name: "ISEMPTY",
    description: "判断文本是否为空",
    example: "ISEMPTY(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "要处理的文本"
      }
    ],
    returns: {
      type: "boolean",
      description: "判断结果"
    },
    namespace: "文本函数"
  },
  {
    name: "CONCATENATE",
    description: "将多个传入值连接成文本",
    example: "CONCATENATE(text1, text2, ...textN)",
    params: [
      {
        type: "...string",
        name: "text",
        description: "文本集合"
      }
    ],
    returns: {
      type: "string",
      description: "连接后的文本"
    },
    namespace: "文本函数"
  },
  {
    name: "CHAR",
    description: "返回计算机字符集的数字代码所对应的字符。\n\n`CHAR(97)` 等价于 \"a\"",
    example: "CHAR(code)",
    params: [
      {
        type: "number",
        name: "code",
        description: "编码值"
      }
    ],
    returns: {
      type: "string",
      description: "指定位置的字符"
    },
    namespace: "文本函数"
  },
  {
    name: "LOWER",
    description: "将传入文本转成小写",
    example: "LOWER(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      }
    ],
    returns: {
      type: "string",
      description: "结果文本"
    },
    namespace: "文本函数"
  },
  {
    name: "UPPER",
    description: "将传入文本转成大写",
    example: "UPPER(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      }
    ],
    returns: {
      type: "string",
      description: "结果文本"
    },
    namespace: "文本函数"
  },
  {
    name: "UPPERFIRST",
    description: "将传入文本首字母转成大写",
    example: "UPPERFIRST(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      }
    ],
    returns: {
      type: "string",
      description: "结果文本"
    },
    namespace: "文本函数"
  },
  {
    name: "PADSTART",
    description: "向前补齐文本长度\n\n示例 `PADSTART(\"6\", 2, \"0\")`\n\n返回 `06`",
    example: "PADSTART(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      },
      {
        type: "number",
        name: "num",
        description: "目标长度"
      },
      {
        type: "string",
        name: "pad",
        description: "用于补齐的文本"
      }
    ],
    returns: {
      type: "string",
      description: "结果文本"
    },
    namespace: "文本函数"
  },
  {
    name: "CAPITALIZE",
    description: "将文本转成标题\n\n示例 `CAPITALIZE(\"star\")`\n\n返回 `Star`",
    example: "CAPITALIZE(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      }
    ],
    returns: {
      type: "string",
      description: "结果文本"
    },
    namespace: "文本函数"
  },
  {
    name: "ESCAPE",
    description: "对文本进行 HTML 转义\n\n示例 `ESCAPE(\"star\")`\n\n返回 `Star`",
    example: "ESCAPE(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      }
    ],
    returns: {
      type: "string",
      description: "结果文本"
    },
    namespace: "文本函数"
  },
  {
    name: "TRUNCATE",
    description: "对文本长度进行截断\n\n示例 `TRUNCATE(\"amis.baidu.com\", 6)`\n\n返回 `amis...`",
    example: "TRUNCATE(text, 6)",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      },
      {
        type: "number",
        name: "text",
        description: "最长长度"
      }
    ],
    returns: {
      type: "string",
      description: "结果文本"
    },
    namespace: "文本函数"
  },
  {
    name: "BEFORELAST",
    description: "取在某个分隔符之前的所有字符串",
    example: "BEFORELAST(text, '.')",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      },
      {
        type: "string",
        name: "delimiter",
        description: "结束文本"
      }
    ],
    returns: {
      type: "string",
      description: "判断结果"
    },
    namespace: "文本函数"
  },
  {
    name: "SPLIT",
    description: "将文本根据指定片段分割成数组\n\n示例：`SPLIT(\"a,b,c\", \",\")`\n\n返回 `[\"a\", \"b\", \"c\"]`",
    example: "SPLIT(text, ',')",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      },
      {
        type: "string",
        name: "delimiter",
        description: "文本片段"
      }
    ],
    returns: {
      type: "Array<string>",
      description: "文本集"
    },
    namespace: "文本函数"
  },
  {
    name: "TRIM",
    description: "将文本去除前后空格",
    example: "TRIM(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      }
    ],
    returns: {
      type: "string",
      description: "处理后的文本"
    },
    namespace: "文本函数"
  },
  {
    name: "STRIPTAG",
    description: "去除文本中的 HTML 标签\n\n示例：`STRIPTAG(\"<b>amis</b>\")`\n\n返回：`amis`",
    example: "STRIPTAG(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      }
    ],
    returns: {
      type: "string",
      description: "处理后的文本"
    },
    namespace: "文本函数"
  },
  {
    name: "LINEBREAK",
    description: "将字符串中的换行转成 HTML `<br>`，用于简单换行的场景\n\n示例：`LINEBREAK(\"\\n\")`\n\n返回：`<br/>`",
    example: "LINEBREAK(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      }
    ],
    returns: {
      type: "string",
      description: "处理后的文本"
    },
    namespace: "文本函数"
  },
  {
    name: "STARTSWITH",
    description: "判断字符串(text)是否以特定字符串(startString)开始，是则返回 True，否则返回 False",
    example: "STARTSWITH(text, '片段')",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      },
      {
        type: "string",
        name: "startString",
        description: "起始文本"
      }
    ],
    returns: {
      type: "string",
      description: "判断结果"
    },
    namespace: "文本函数"
  },
  {
    name: "ENDSWITH",
    description: "判断字符串(text)是否以特定字符串(endString)结束，是则返回 True，否则返回 False",
    example: "ENDSWITH(text, '片段')",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      },
      {
        type: "string",
        name: "endString",
        description: "结束文本"
      }
    ],
    returns: {
      type: "string",
      description: "判断结果"
    },
    namespace: "文本函数"
  },
  {
    name: "CONTAINS",
    description: "判断参数 1 中的文本是否包含参数 2 中的文本。",
    example: "CONTAINS(text, searchText)",
    params: [
      {
        type: "string",
        name: "text",
        description: "文本"
      },
      {
        type: "string",
        name: "searchText",
        description: "搜索文本"
      }
    ],
    returns: {
      type: "string",
      description: "判断结果"
    },
    namespace: "文本函数"
  },
  {
    name: "REPLACE",
    description: "对文本进行全量替换。",
    example: "REPLACE(text, search, replace)",
    params: [
      {
        type: "string",
        name: "text",
        description: "要处理的文本"
      },
      {
        type: "string",
        name: "search",
        description: "要被替换的文本"
      },
      {
        type: "string",
        name: "replace",
        description: "要替换的文本"
      }
    ],
    returns: {
      type: "string",
      description: "处理结果"
    },
    namespace: "文本函数"
  },
  {
    name: "SEARCH",
    description: "对文本进行搜索，返回命中的位置",
    example: "SEARCH(text, search, 0)",
    params: [
      {
        type: "string",
        name: "text",
        description: "要处理的文本"
      },
      {
        type: "string",
        name: "search",
        description: "用来搜索的文本"
      },
      {
        type: "number",
        name: "start",
        description: "起始位置"
      }
    ],
    returns: {
      type: "number",
      description: "命中的位置"
    },
    namespace: "文本函数"
  },
  {
    name: "MID",
    description: "返回文本字符串中从指定位置开始的特定数目的字符",
    example: "MID(text, from, len)",
    params: [
      {
        type: "string",
        name: "text",
        description: "要处理的文本"
      },
      {
        type: "number",
        name: "from",
        description: "起始位置"
      },
      {
        type: "number",
        name: "len",
        description: "处理长度"
      }
    ],
    returns: {
      type: "number",
      description: "命中的位置"
    },
    namespace: "文本函数"
  },
  {
    name: "BASENAME",
    description: "返回路径中的文件名\n\n示例：`/home/amis/a.json`\n\n返回：a.json`",
    example: "BASENAME(text)",
    params: [
      {
        type: "string",
        name: "text",
        description: "要处理的文本"
      }
    ],
    returns: {
      type: "string",
      description: "文件名"
    },
    namespace: "文本函数"
  },
  {
    name: "DATE",
    description: "创建日期对象，可以通过特定格式的字符串，或者数值。\n\n需要注意的是，其中月份的数值是从0开始的，也就是说，\n如果是12月份，你应该传入数值11。",
    example: "DATE('2021-12-06 08:20:00')",
    params: [],
    returns: {
      type: "Date",
      description: "日期对象"
    },
    namespace: "日期函数"
  },
  {
    name: "TIMESTAMP",
    description: "返回时间的时间戳",
    example: "TIMESTAMP(date[, format = \"X\"])",
    params: [
      {
        type: "date",
        name: "date",
        description: "日期对象"
      },
      {
        type: "string",
        name: "format",
        description: "时间戳格式，带毫秒传入 'x'。默认为 'X' 不带毫秒的。"
      }
    ],
    returns: {
      type: "number",
      description: "时间戳"
    },
    namespace: "日期函数"
  },
  {
    name: "TODAY",
    description: "返回今天的日期",
    example: "TODAY()",
    params: [],
    returns: {
      type: "number",
      description: "日期"
    },
    namespace: "日期函数"
  },
  {
    name: "NOW",
    description: "返回现在的日期",
    example: "NOW()",
    params: [],
    returns: {
      type: "number",
      description: "日期"
    },
    namespace: "日期函数"
  },
  {
    name: "DATETOSTR",
    description: "将日期转成日期字符串",
    example: "DATETOSTR(date[, format=\"YYYY-MM-DD HH:mm:ss\"])",
    params: [
      {
        type: "date",
        name: "date",
        description: "日期对象"
      },
      {
        type: "string",
        name: "format",
        description: "日期格式，默认为 \"YYYY-MM-DD HH:mm:ss\""
      }
    ],
    returns: {
      type: "number",
      description: "日期字符串"
    },
    namespace: "日期函数"
  },
  {
    name: "STARTOF",
    description: "返回日期的指定范围的开端",
    example: "STARTOF(date[unit = \"day\"])",
    params: [
      {
        type: "date",
        name: "date",
        description: "日期对象"
      },
      {
        type: "string",
        name: "unit",
        description: "比如可以传入 'day'、'month'、'year' 或者 `week` 等等"
      }
    ],
    returns: {
      type: "date",
      description: "新的日期对象"
    },
    namespace: "日期函数"
  },
  {
    name: "ENDOF",
    description: "返回日期的指定范围的末尾",
    example: "ENDOF(date[unit = \"day\"])",
    params: [
      {
        type: "date",
        name: "date",
        description: "日期对象"
      },
      {
        type: "string",
        name: "unit",
        description: "比如可以传入 'day'、'month'、'year' 或者 `week` 等等"
      }
    ],
    returns: {
      type: "date",
      description: "新的日期对象"
    },
    namespace: "日期函数"
  },
  {
    name: "YEAR",
    description: "返回日期的年份",
    example: "YEAR(date)",
    params: [
      {
        type: "date",
        name: "date",
        description: "日期对象"
      }
    ],
    returns: {
      type: "number",
      description: "数值"
    },
    namespace: "日期函数"
  },
  {
    name: "MONTH",
    description: "返回日期的月份，这里就是自然月份。",
    example: "MONTH(date)",
    params: [
      {
        type: "date",
        name: "date",
        description: "日期对象"
      }
    ],
    returns: {
      type: "number",
      description: "数值"
    },
    namespace: "日期函数"
  },
  {
    name: "DAY",
    description: "返回日期的天",
    example: "DAY(date)",
    params: [
      {
        type: "date",
        name: "date",
        description: "日期对象"
      }
    ],
    returns: {
      type: "number",
      description: "数值"
    },
    namespace: "日期函数"
  },
  {
    name: "HOUR",
    description: "返回日期的小时",
    example: "HOUR(date)",
    params: [
      {
        type: "date",
        name: "date",
        description: "日期对象"
      }
    ],
    returns: {
      type: "number",
      description: "数值"
    },
    namespace: "日期函数"
  },
  {
    name: "MINUTE",
    description: "返回日期的分",
    example: "MINUTE(date)",
    params: [
      {
        type: "date",
        name: "date",
        description: "日期对象"
      }
    ],
    returns: {
      type: "number",
      description: "数值"
    },
    namespace: "日期函数"
  },
  {
    name: "SECOND",
    description: "返回日期的秒",
    example: "SECOND(date)",
    params: [
      {
        type: "date",
        name: "date",
        description: "日期对象"
      }
    ],
    returns: {
      type: "number",
      description: "数值"
    },
    namespace: "日期函数"
  },
  {
    name: "YEARS",
    description: "返回两个日期相差多少年",
    example: "YEARS(endDate, startDate)",
    params: [
      {
        type: "date",
        name: "endDate",
        description: "日期对象"
      },
      {
        type: "date",
        name: "startDate",
        description: "日期对象"
      }
    ],
    returns: {
      type: "number",
      description: "数值"
    },
    namespace: "日期函数"
  },
  {
    name: "MINUTES",
    description: "返回两个日期相差多少分钟",
    example: "MINUTES(endDate, startDate)",
    params: [
      {
        type: "date",
        name: "endDate",
        description: "日期对象"
      },
      {
        type: "date",
        name: "startDate",
        description: "日期对象"
      }
    ],
    returns: {
      type: "number",
      description: "数值"
    },
    namespace: "日期函数"
  },
  {
    name: "DAYS",
    description: "返回两个日期相差多少天",
    example: "DAYS(endDate, startDate)",
    params: [
      {
        type: "date",
        name: "endDate",
        description: "日期对象"
      },
      {
        type: "date",
        name: "startDate",
        description: "日期对象"
      }
    ],
    returns: {
      type: "number",
      description: "数值"
    },
    namespace: "日期函数"
  },
  {
    name: "HOURS",
    description: "返回两个日期相差多少小时",
    example: "HOURS(endDate, startDate)",
    params: [
      {
        type: "date",
        name: "endDate",
        description: "日期对象"
      },
      {
        type: "date",
        name: "startDate",
        description: "日期对象"
      }
    ],
    returns: {
      type: "number",
      description: "数值"
    },
    namespace: "日期函数"
  },
  {
    name: "DATEMODIFY",
    description: "修改日期，对日期进行加减天、月份、年等操作\n\n示例：\n\nDATEMODIFY(A, -2, 'month')\n\n对日期 A 进行往前减2月的操作。",
    example: "DATEMODIFY(date, 2, 'days')",
    params: [
      {
        type: "date",
        name: "date",
        description: "日期对象"
      },
      {
        type: "number",
        name: "num",
        description: "数值"
      },
      {
        type: "string",
        name: "unit",
        description: "单位：支持年、月、天等等"
      }
    ],
    returns: {
      type: "date",
      description: "日期对象"
    },
    namespace: "日期函数"
  },
  {
    name: "STRTODATE",
    description: "将字符日期转成日期对象，可以指定日期格式。\n\n示例：STRTODATE('2021/12/6', 'YYYY/MM/DD')",
    example: "STRTODATE(value[, format=\"\"])",
    params: [
      {
        type: "string",
        name: "value",
        description: "日期字符"
      },
      {
        type: "string",
        name: "format",
        description: "日期格式"
      }
    ],
    returns: {
      type: "date",
      description: "日期对象"
    },
    namespace: "日期函数"
  },
  {
    name: "ISBEFORE",
    description: "判断两个日期，是否第一个日期在第二个日期的前面",
    example: "ISBEFORE(a, b)",
    params: [
      {
        type: "date",
        name: "a",
        description: "第一个日期"
      },
      {
        type: "date",
        name: "b",
        description: "第二个日期"
      },
      {
        type: "string",
        name: "unit",
        description: "单位，默认是 'day'， 即之比较到天"
      }
    ],
    returns: {
      type: "boolean",
      description: "判断结果"
    },
    namespace: "日期函数"
  },
  {
    name: "ISAFTER",
    description: "判断两个日期，是否第一个日期在第二个日期的后面",
    example: "ISAFTER(a, b)",
    params: [
      {
        type: "date",
        name: "a",
        description: "第一个日期"
      },
      {
        type: "date",
        name: "b",
        description: "第二个日期"
      },
      {
        type: "string",
        name: "unit",
        description: "单位，默认是 'day'， 即之比较到天"
      }
    ],
    returns: {
      type: "boolean",
      description: "判断结果"
    },
    namespace: "日期函数"
  },
  {
    name: "ISSAMEORBEFORE",
    description: "判断两个日期，是否第一个日期在第二个日期的前面或者相等",
    example: "ISSAMEORBEFORE(a, b)",
    params: [
      {
        type: "date",
        name: "a",
        description: "第一个日期"
      },
      {
        type: "date",
        name: "b",
        description: "第二个日期"
      },
      {
        type: "string",
        name: "unit",
        description: "单位，默认是 'day'， 即之比较到天"
      }
    ],
    returns: {
      type: "boolean",
      description: "判断结果"
    },
    namespace: "日期函数"
  },
  {
    name: "ISSAMEORAFTER",
    description: "判断两个日期，是否第一个日期在第二个日期的后面或者相等",
    example: "ISSAMEORAFTER(a, b)",
    params: [
      {
        type: "date",
        name: "a",
        description: "第一个日期"
      },
      {
        type: "date",
        name: "b",
        description: "第二个日期"
      },
      {
        type: "string",
        name: "unit",
        description: "单位，默认是 'day'， 即之比较到天"
      }
    ],
    returns: {
      type: "boolean",
      description: "判断结果"
    },
    namespace: "日期函数"
  },
  {
    name: "COUNT",
    description: "返回数组的长度",
    example: "COUNT(arr)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "数组"
      }
    ],
    returns: {
      type: "boolean",
      description: "结果"
    },
    namespace: "数组"
  },
  {
    name: "ARRAYMAP",
    description: "数组做数据转换，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。",
    example: "ARRAYMAP(arr, item => item)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "数组"
      },
      {
        type: "Array<any>",
        name: "iterator",
        description: "箭头函数"
      }
    ],
    returns: {
      type: "boolean",
      description: "结果"
    },
    namespace: "数组"
  },
  {
    name: "COMPACT",
    description: "数组过滤掉 false、null、0 和 \"\"\n\n示例：\n\nCOMPACT([0, 1, false, 2, '', 3]) 得到 [1, 2, 3]",
    example: "COMPACT(arr)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "数组"
      }
    ],
    returns: {
      type: "Array<any>",
      description: "结果"
    },
    namespace: "数组"
  },
  {
    name: "JOIN",
    description: "数组转成字符串\n\n示例：\n\nJOIN(['a', 'b', 'c'], '~') 得到 'a~b~c'",
    example: "JOIN(arr, string)",
    params: [
      {
        type: "Array<any>",
        name: "arr",
        description: "数组"
      },
      {
        type: "String",
        name: "separator",
        description: "分隔符"
      }
    ],
    returns: {
      type: "String",
      description: "结果"
    },
    namespace: "数组"
  }
]