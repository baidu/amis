## Cards

卡片集合。

| 属性名          | 类型              | 默认值              | 说明                       |
| --------------- | ----------------- | ------------------- | -------------------------- |
| type            | `string`          |                     | `"cards"` 指定为卡片集合。 |
| title           | `string`          |                     | 标题                       |
| source          | `string`          | `${items}`          | 数据源, 绑定当前环境变量   |
| placeholder     | string            | ‘暂无数据’          | 当没数据的时候的文字提示   |
| className       | `string`          |                     | 外层 CSS 类名              |
| headerClassName | `string`          | `amis-grid-header`  | 顶部外层 CSS 类名          |
| footerClassName | `string`          | `amis-grid-footer`  | 底部外层 CSS 类名          |
| itemClassName   | `string`          | `col-sm-4 col-md-3` | 卡片 CSS 类名              |
| card            | [Card](./Card.md) |                     | 配置卡片信息               |

```schema:height="450" scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=8",
    "body": [
        {
            "type": "panel",
            "title": "简单 Cards 示例",
            "body": {
                "type": "cards",
                "source": "$rows",
                "card": {
                  "body": [
                    {
                      "label": "Engine",
                      "name": "engine"
                    },

                    {
                      "name": "version",
                      "label": "Version"
                    }
                  ],

                  "actions": [
                    {
                      "type": "button",
                      "level": "link",
                      "icon": "fa fa-eye",
                      "actionType": "dialog",
                      "dialog": {
                        "title": "查看详情",
                        "body": {
                          "type": "form",
                          "controls": [
                            {
                              "label": "Engine",
                              "name": "engine",
                              "type": "static"
                            },

                            {
                                "name": "version",
                                "label": "Version",
                                "type": "static"
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
            }
        }
    ]
}
```
