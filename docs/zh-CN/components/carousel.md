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
            "image": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
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

## 属性表

| 属性名                       | 类型      | 默认值                 | 说明                                                    |
| ---------------------------- | --------- | ---------------------- | ------------------------------------------------------- |
| type                         | `string`  | `"carousel"`           | 指定为 Carousel 渲染器                                  |
| className                    | `string`  | `"panel-default"`      | 外层 Dom 的类名                                         |
| options                      | `array`   | `[]`                   | 轮播面板数据                                            |
| options.image                | `string`  |                        | 图片链接                                                |
| options.href                 | `string`  |                        | 图片打开网址的链接                                      |
| options.imageClassName       | `string`  |                        | 图片类名                                                |
| options.title                | `string`  |                        | 图片标题                                                |
| options.titleClassName       | `string`  |                        | 图片标题类名                                            |
| options.description          | `string`  |                        | 图片描述                                                |
| options.descriptionClassName | `string`  |                        | 图片描述类名                                            |
| options.html                 | `string`  |                        | HTML 自定义，同[Tpl](./tpl)一致                         |
| itemSchema                   | `object`  |                        | 自定义`schema`来展示数据                                |
| auto                         | `boolean` | `true`                 | 是否自动轮播                                            |
| interval                     | `string`  | `5s`                   | 切换动画间隔                                            |
| duration                     | `string`  | `0.5s`                 | 切换动画时长                                            |
| width                        | `string`  | `auto`                 | 宽度                                                    |
| height                       | `string`  | `200px`                | 高度                                                    |
| controls                     | `array`   | `['dots', 'arrows']`   | 显示左右箭头、底部圆点索引                              |
| controlsTheme                | `string`  | `light`                | 左右箭头、底部圆点索引颜色，默认`light`，另有`dark`模式 |
| animation                    | `string`  | fade                   | 切换动画效果，默认`fade`，另有`slide`模式               |
| thumbMode                    | `string`  | `"cover" \| "contain"` | 图片默认缩放模式                                        |

## 事件表

| 事件名称           | 事件参数                                        | 说明                  |
|-------------------|------------------------------------------------|----------------------|
| change            | `activeIndex: number` 激活图片的索引 <br> `prevIndex: number` 上一张图片的索引 | 轮播图切换时触发 |

## 动作表

| 动作名称           | 动作配置                 | 说明                    |
|-------------------|-------------------------|------------------------|
| next              | -                       | 下一张                  |
| prev              | -                       | 上一张                  |
| goto-image        | `activeIndex: number` 切换图片的索引 | 切换轮播图    |

- `type` 请设置成 `carousel`
- `className` 外层 Dom 的类名
- `options` 轮播面板数据，默认`[]`，支持以下模式
  - 图片
    - `image` 图片链接
    - `imageClassName` 图片类名
    - `title` 图片标题
    - `titleClassName` 图片标题类名
    - `description` 图片描述
    - `descriptionClassName` 图片描述类名
  - `html` HTML 自定义，同[Tpl](./Tpl)一致
- `itemSchema` 自定义`schema`来展示数据
- `auto` 是否自动轮播，默认`true`
- `interval` 切换动画间隔，默认`5s`
- `duration` 切换动画时长，默认`0.5s`
- `width` 宽度，默认`auto`
- `height` 高度，默认`200px`
- `controls` 显示左右箭头、底部圆点索引，默认`['dots', 'arrows']`
- `controlsTheme` 左右箭头、底部圆点索引颜色，默认`light`，另有`dark`模式
- `animation` 切换动画效果，默认`fade`，另有`slide`模式
- `thumbMode` 图片默认缩放模式，可以配置 `"cover" | "contain"`
