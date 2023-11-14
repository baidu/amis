export default {
  "title": "解析Query参数",
  "body": [
    {
      "type": "alert",
      "body": {
        "type": "html",
        "html": "<code>parsePrimitiveQuery</code>默认开启，开启后会对url中的Query进行转换，将原始类型的字符串格式的转化为同位类型，目前仅支持<strong>布尔类型</strong>"
      },
      "level": "info",
      "showCloseButton": true,
      "showIcon": true,
      "className": "mb-2"
    },
    {
      "type": "crud",
      "name": "crud",
      "syncLocation": true,
      "api": "/api/mock2/crud/table5",
      "filter": {
        "debug": true,
        "title": "条件搜索",
        "body": [
          {
            "type": "group",
            "body": [
              {
                "type": "switch",
                "name": "status",
                "label": "已核验",
                "size": "sm",
                "value": false
              }
            ]
          }
        ],
        "actions": [
          {
            "type": "reset",
            "label": "重置"
          },
          {
            "type": "submit",
            "level": "primary",
            "label": "查询"
          }
        ]
      },
      "columns": [
        {
          "name": "id",
          "label": "ID"
        },
        {
          "name": "browser",
          "label": "Browser"
        },
        {
          "name": "status",
          "label": "已核验",
          "type": "tpl",
          "tpl": "${status === true ? '是' : '否'}",
          "filterable": {
            "options": [
              {"label": "是", "value": true},
              {"label": "否", "value": false}
            ]
          }
        },
      ]
    }
  ]
}
