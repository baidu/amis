```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "data": {
        "conditions": {
            "id": "5715234943c1",
            "conjunction": "and",
            "children": [
                {
                    "id": "7248016bc2d5",
                    "left": {
                        "type": "field",
                        "field": "time2"
                    },
                    "op": "not_equal",
                    "right":"01:01"
                },
                {
                    "id": "7248016bc2d511223",
                    "left": {
                        "type": "field",
                        "field": "boolean"
                    },
                    "op": "not_equal"
                },
                {
                    "id": "7248016bc2d5111",
                    "left": {
                        "type": "field",
                        "field": "datetime"
                    },
                    "op": "equal",
                    "right":"2023-06-21T18:05:00+08:00"
                }
            ]
        }    
    },
    "body": [
      {
        "type": "condition-builder",
        "label": "条件组件",
        "name": "conditions",
        "selectMode": "chained",
        "description": "适合让用户自己拼查询条件，然后后端根据数据生成 query where",
        "fields": [
            {
              "label": "文本",
              "type": "text",
              "name": "text"
            },
            {
              "label": "数字",
              "type": "number",
              "name": "number"
            },
            {
              "label": "布尔",
              "type": "boolean",
              "name": "boolean"
            },
            {
              "label": "链式结构",
              "name": "chained",
              "children": [
                {
                  "label": "Folder A",
                  "name": "Folder_A",
                  "children": [
                    {
                      "label": "file A",
                      "name": "time2",
                      "type": "time"
                    },
                    {
                      "label": "file B",
                      "name": "datetime",
                      "type": "datetime"
                    }
                  ]
                }
              ]
            }
          ]
      }
    ]
}
```