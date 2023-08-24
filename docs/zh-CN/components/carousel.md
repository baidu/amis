---
title: Carousel 轮播图
description:
type: 0
group: ⚙ 组件
menuName: Carousel 幻灯片
icon:
order: 33
---

## 基本用法

```schema: scope="body"
{
    "type": "carousel",
    "auto": false,
    "thumbMode": "cover",
    "animation": "slide",
    "height": 300,
    "options": [
        {
            "image": "https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png"
        },
        {
            "html": "<div style=\"width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;\">carousel data</div>"
        },
        {
            "thumbMode": "contain",
            "image": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg"
        }
    ]
}
```

## 动态列表

轮播图组件目前没有获取数据的配置，因此需要依赖 `service` 来获取数据。

```schema: scope="body"
{
  "type": "page",
  "body": {
    "type": "service",
    "api": "/api/mock2/options/carousel",
    "body": {
      "type": "carousel",
      "name": "imageList"
    }
  }
}
```

目前数据关联是通过 name 的方式，因此 api 返回应该是类似这样的：

```
{
    status: 0,
    msg: '',
    data: {
        imageList: [{
            "image": "https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png"
        }]
    }
}
```

其中的 `imageList` 要和配置的 `name` 值对应。

## 点击图片打开外部链接

> 1.3.3 及以上版本

需要放回的字段中除了前面的 image，还有 href 属性

```schema: scope="body"
{
  "type": "page",
  "data": {
    "imageList": [
      {
        "image": "https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png",
        "href": "https://github.com/baidu/amis"
      }
    ]
  },
  "body": {
    "type": "carousel",
    "name": "imageList"
  }
}
```

## 自定义轮播图的展现

通过配置 `itemSchema` 可以自定义轮播图的展现，比如图片默认背景配置是 contain，可以改成 cover：

```
itemSchema: {
    type: 'tpl',
    tpl: '<div style="background-image: url('<%= data.image %>'); background-size: cover; background-repeat: no-repeat; background-position: center center;" class="image <%= data.imageClassName %>"></div>'
}
```

## 多图展示

> `2.8.1` 及以上版本

```schema: scope="body"
{
    "type": "carousel",
    "auto": false,
    "thumbMode": "cover",
    "animation": "slide",
    "multiple": {count: 3},
    "interval": 1000,
    "duration": 5000,
    "height": 300,
    "options": [
        {
            "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80"
        },
        {
            "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80"
        },
        {
            "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80"
        },
        {
            "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
        }
    ]
}
```

## 属性表

| 属性名                       | 类型                                                  | 默认值                 | 说明                                                    | 版本    |
| ---------------------------- | ----------------------------------------------------- | ---------------------- | ------------------------------------------------------- | ------- |
| type                         | `string`                                              | `"carousel"`           | 指定为 Carousel 渲染器                                  |
| className                    | `string`                                              | `"panel-default"`      | 外层 Dom 的类名                                         |
| options                      | `array`                                               | `[]`                   | 轮播面板数据                                            |
| options.image                | `string`                                              |                        | 图片链接                                                |
| options.href                 | `string`                                              |                        | 图片打开网址的链接                                      |
| options.imageClassName       | `string`                                              |                        | 图片类名                                                |
| options.title                | `string`                                              |                        | 图片标题                                                |
| options.titleClassName       | `string`                                              |                        | 图片标题类名                                            |
| options.description          | `string`                                              |                        | 图片描述                                                |
| options.descriptionClassName | `string`                                              |                        | 图片描述类名                                            |
| options.html                 | `string`                                              |                        | HTML 自定义，同[Tpl](./tpl)一致                         |
| itemSchema                   | `object`                                              |                        | 自定义`schema`来展示数据                                |
| auto                         | `boolean`                                             | `true`                 | 是否自动轮播                                            |
| interval                     | `string`                                              | `5s`                   | 切换动画间隔                                            |
| duration                     | `number`                                              | `500`                  | 切换动画时长（ms）                                      |
| width                        | `string`                                              | `auto`                 | 宽度                                                    |
| height                       | `string`                                              | `200px`                | 高度                                                    |
| controls                     | `array`                                               | `['dots', 'arrows']`   | 显示左右箭头、底部圆点索引                              |
| controlsTheme                | `string`                                              | `light`                | 左右箭头、底部圆点索引颜色，默认`light`，另有`dark`模式 |
| animation                    | `string`                                              | fade                   | 切换动画效果，默认`fade`，另有`slide`模式               |
| thumbMode                    | `string`                                              | `"cover" \| "contain"` | 图片默认缩放模式                                        |
| multiple                     | `object`                                              | `{count: 1}`           | 多图展示，count 表示展示的数量                          | `2.8.1` |
| alwaysShowArrow              | `boolean`                                             | `false`                | 是否一直显示箭头，为 false 时鼠标 hover 才会显示        | `2.8.1` |
| icons                        | {prev: `SchemaCollection`; next: `SchemaCollection`;} |                        | 自定义箭头图标                                          | `2.8.1` |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数                                                                         | 说明             |
| -------- | -------------------------------------------------------------------------------- | ---------------- |
| change   | `activeIndex: number` 激活图片的索引 <br /> `prevIndex: number` 上一张图片的索引 | 轮播图切换时触发 |

### change

```schema: scope="body"
{
  "type": "carousel",
  "auto": false,
  "thumbMode": "cover",
  "animation": "slide",
  "height": 300,
  "options": [
    {
      "image": "https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png"
    },
    {
      "html": "<div style=\"width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;\">carousel data</div>"
    },
    {
      "thumbMode": "contain",
      "image": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg"
    }
  ],
  "onEvent": {
    "change": {
      "actions": [
        {
          "actionType": "toast",
          "args": {
            "msg": "滚动至${activeIndex}"
          }
        }
      ]
    }
  }
}
```

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称   | 动作配置                             | 说明       |
| ---------- | ------------------------------------ | ---------- |
| next       | -                                    | 下一张     |
| prev       | -                                    | 上一张     |
| goto-image | `activeIndex: number` 切换图片的索引 | 切换轮播图 |

### next

```schema: scope="body"
[
  {
    "type": "action",
    "label": "下一张",
    "className": "mr-3 mb-3",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "next",
            "componentId": "carousel_001"
          }
        ]
      }
    }
  },
  {
    "type": "carousel",
    "id": "carousel_001",
    "auto": false,
    "thumbMode": "cover",
    "animation": "slide",
    "height": 300,
    "options": [
      {
        "image": "https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png"
      },
      {
        "html": "<div style=\"width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;\">carousel data</div>"
      },
      {
        "thumbMode": "contain",
        "image": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg"
      }
    ]
  }
]
```

### prev

```schema: scope="body"
[
  {
    "type": "action",
    "label": "上一张",
    "className": "mr-3 mb-3",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "prev",
            "componentId": "carousel_002"
          }
        ]
      }
    }
  },
  {
    "type": "carousel",
    "id": "carousel_002",
    "auto": false,
    "thumbMode": "cover",
    "animation": "slide",
    "height": 300,
    "options": [
      {
        "image": "https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png"
      },
      {
        "html": "<div style=\"width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;\">carousel data</div>"
      },
      {
        "thumbMode": "contain",
        "image": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg"
      }
    ]
  }
]
```

### goto-image

```schema: scope="body"
[
  {
    "type": "action",
    "label": "滚动到第三张",
    "className": "mr-3 mb-3",
    "onEvent": {
      "click": {
        "actions": [
          {
            "actionType": "goto-image",
            "componentId": "carousel_003",
            "args": {
              "activeIndex": "${index}"
            }
          }
        ]
      }
    }
  },
  {
    "type": "carousel",
    "id": "carousel_003",
    "auto": false,
    "thumbMode": "cover",
    "animation": "slide",
    "height": 300,
    "options": [
      {
        "image": "https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png"
      },
      {
        "html": "<div style=\"width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;\">carousel data</div>"
      },
      {
        "thumbMode": "contain",
        "image": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg"
      }
    ]
  }
]
```
