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
    "options": [
        {
            "image": "https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png"
        },
        {
            "html": "<div style=\"width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;\">carousel data</div>"
        },
        {
            "image": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg"
        }
    ]
}
```

## 属性表

| 属性名                       | 类型      | 默认值               | 说明                                                    |
| ---------------------------- | --------- | -------------------- | ------------------------------------------------------- |
| type                         | `string`  | `"carousel"`         | 指定为 Carousel 渲染器                                  |
| className                    | `string`  | `"panel-default"`    | 外层 Dom 的类名                                         |
| options                      | `array`   | `[]`                 | 轮播面板数据                                            |
| options.image                | `string`  |                      | 图片链接                                                |
| options.imageClassName       | `string`  |                      | 图片类名                                                |
| options.title                | `string`  |                      | 图片标题                                                |
| options.titleClassName       | `string`  |                      | 图片标题类名                                            |
| options.description          | `string`  |                      | 图片描述                                                |
| options.descriptionClassName | `string`  |                      | 图片描述类名                                            |
| options.html                 | `string`  |                      | HTML 自定义，同[Tpl](./tpl)一致                         |
| itemSchema                   | `object`  |                      | 自定义`schema`来展示数据                                |
| auto                         | `boolean` | `true`               | 是否自动轮播                                            |
| interval                     | `string`  | `5s`                 | 切换动画间隔                                            |
| duration                     | `string`  | `0.5s`               | 切换动画时长                                            |
| width                        | `string`  | `auto`               | 宽度                                                    |
| height                       | `string`  | `200px`              | 高度                                                    |
| controls                     | `array`   | `['dots', 'arrows']` | 显示左右箭头、底部圆点索引                              |
| controlsTheme                | `string`  | `light`              | 左右箭头、底部圆点索引颜色，默认`light`，另有`dark`模式 |
| animation                    | `string`  | fade                 | 切换动画效果，默认`fade`，另有`slide`模式               |

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
  - `html` HTML 自定义，同[Tpl](./Tpl.md)一致
- `itemSchema` 自定义`schema`来展示数据
- `auto` 是否自动轮播，默认`true`
- `interval` 切换动画间隔，默认`5s`
- `duration` 切换动画时长，默认`0.5s`
- `width` 宽度，默认`auto`
- `height` 高度，默认`200px`
- `controls` 显示左右箭头、底部圆点索引，默认`['dots', 'arrows']`
- `controlsTheme` 左右箭头、底部圆点索引颜色，默认`light`，另有`dark`模式
- `animation` 切换动画效果，默认`fade`，另有`slide`模式
