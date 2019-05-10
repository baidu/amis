## List

列表展示。

| 属性名                   | 类型                             | 默认值                | 说明                                       |
| ------------------------ | -------------------------------- | --------------------- | ------------------------------------------ |
| type                     | `string`                         |                       | `"list"` 指定为列表展示。                  |
| title                    | `string`                         |                       | 标题                                       |
| source                   | `string`                         | `${items}`            | 数据源, 绑定当前环境变量                   |
| placeholder              | string                           | ‘暂无数据’            | 当没数据的时候的文字提示                   |
| className                | `string`                         |                       | 外层 CSS 类名                              |
| headerClassName          | `string`                         | `amis-list-header`    | 顶部外层 CSS 类名                          |
| footerClassName          | `string`                         | `amis-list-footer`    | 底部外层 CSS 类名                          |
| listItem                 | `Array`                          |                       | 配置单条信息                               |
| listItem.title           | `string`                         |                       | 标题，支持模板语法如： \${xxx}             |
| listItem.titleClassName  | `string`                         | `h5`                  | 标题 CSS 类名                              |
| listItem.subTitle        | `string`                         |                       | 副标题，支持模板语法如： \${xxx}           |
| listItem.avatar          | `string`                         |                       | 图片地址，支持模板语法如： \${xxx}         |
| listItem.avatarClassName | `string`                         | `thumb-sm avatar m-r` | 图片 CSS 类名                              |
| listItem.desc            | `string`                         |                       | 描述，支持模板语法如： \${xxx}             |
| listItem.body            | `Array` 或者 [Field](./Field.md) |                       | 内容容器，主要用来放置 [Field](./Field.md) |
| listItem.actions         | Array Of [Button](./Button.md)   |                       | 按钮区域                                   |

```schema:height="400" scope="body"
{
    "type": "service",
    "api": "/api/sample?perPage=5",
    "body": [
        {
            "type": "panel",
            "title": "简单 List 示例",
            "body": {
                "type": "list",
                "source": "$rows",
                "listItem": {
                  "body": [
                    {
                      "type": "hbox",
                      "columns": [
                        {
                          "label": "Engine",
                          "name": "engine"
                        },

                        {
                            "name": "version",
                            "label": "Version"
                        }
                      ]
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
