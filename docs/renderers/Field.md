## Field

主要用在 [Table](#table) 的列配置 Column、[List](#list) 的内容、[Card](#card) 卡片的内容和表单的[Static-XXX](#static-xxx) 中。它主要用来展示数据。

```schema:height="450" scope="body"
{
  "type": "crud",
  "api": "/api/mock2/crud/list",
  "affixHeader": false,
  "syncLocation": false,
  "columns": [
    {
      "name": "id",
      "label": "ID",
      "type": "text"
    },
    {
      "name": "text",
      "label": "文本",
      "type": "text"
    },
    {
      "type": "image",
      "label": "图片",
      "name": "image",
      "popOver": {
        "title": "查看大图",
        "body": "<div class=\"w-xxl\"><img class=\"w-full\" src=\"${image}\"/></div>"
      }
    },
    {
      "name": "date",
      "type": "date",
      "label": "日期"
    },
    {
      "name": "progress",
      "label": "进度",
      "type": "progress"
    },
    {
      "name": "boolean",
      "label": "状态",
      "type": "status"
    },
    {
      "name": "boolean",
      "label": "开关",
      "type": "switch"
    },
    {
      "name": "type",
      "label": "映射",
      "type": "mapping",
      "map": {
        "1": "<span class='label label-info'>漂亮</span>",
        "2": "<span class='label label-success'>开心</span>",
        "3": "<span class='label label-danger'>惊吓</span>",
        "4": "<span class='label label-warning'>紧张</span>",
        "*": "其他：${type}"
      }
    },
    {
      "name": "list",
      "type": "list",
      "label": "List",
      "placeholder": "-",
      "listItem": {
        "title": "${title}",
        "subTitle": "${description}"
      }
    }
  ]
}
```
