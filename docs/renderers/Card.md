## Card

卡片的展示形式。

| 属性名                 | 类型                             | 默认值                              | 说明                                       |
| ---------------------- | -------------------------------- | ----------------------------------- | ------------------------------------------ |
| type                   | `string`                         | `"card"`                            | 指定为 Card 渲染器                         |
| className              | `string`                         | `"panel-default"`                   | 外层 Dom 的类名                            |
| header                 | `Object`                         |                                     | Card 头部内容设置                          |
| header.className       | `string`                         |                                     | 头部类名                                   |
| header.title           | `string`                         |                                     | 标题                                       |
| header.subTitle        | `string`                         |                                     | 副标题                                     |
| header.desc            | `string`                         |                                     | 描述                                       |
| header.avatar          | `string`                         |                                     | 图片                                       |
| header.highlight       | `boolean`                        |                                     | 是否点亮                                   |
| header.avatarClassName | `string`                         | `"pull-left thumb avatar b-3x m-r"` | 图片类名                                   |
| body                   | `Array` 或者 [Field](./Field.md) |                                     | 内容容器，主要用来放置 [Field](./Field.md) |
| bodyClassName          | `string`                         | `"padder m-t-sm m-b-sm"`            | 内容区域类名                               |
| actions                | Array Of [Button](./Button.md)   |                                     | 按钮区域                                   |

```schema:height="300" scope="body"
{
    "type": "card",
    "header": {
        "title": "Title",
        "subTitle": "Sub Title",
        "description": "description",
        "avatarClassName": "pull-left thumb-md avatar b-3x m-r",
        "avatar": "raw:http://hiphotos.baidu.com/fex/%70%69%63/item/c9fcc3cec3fdfc03ccabb38edd3f8794a4c22630.jpg"
    },
    "body": "Body",
    "actions": [
        {
            "type": "button",
            "label": "Action 1",
            "actionType": "dialog",
            "dialog": {
              "confirmMode": false,
              "title": "提示",
              "body": "对，你刚点击了！"
            }
        },

        {
          "type": "button",
          "label": "Action 2",
          "actionType": "dialog",
          "dialog": {
            "confirmMode": false,
            "title": "提示",
            "body": "对，你刚点击了！"
          }
        }
    ]
}
```
