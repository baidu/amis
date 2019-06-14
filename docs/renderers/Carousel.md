## Carousel

轮播图

-   `type` 请设置成 `carousel`
-   `className` 外层 Dom 的类名
-   `options` 轮播面板数据，默认`[]`，支持以下模式
    -   图片
        -  `image` 图片链接
        -  `imageClassName` 图片类名
        -  `title` 图片标题
        -  `titleClassName` 图片标题类名
        -  `description` 图片描述
        -  `descriptionClassName` 图片描述类名
    -   `html` HTML 自定义，同[Tpl](./Tpl.md)一致
-   `itemSchema` 自定义`schema`来展示数据
-   `auto` 是否自动轮播，默认`true`
-   `interval` 切换动画间隔，默认`5s`
-   `duration` 切换动画时长，默认`0.5s`
-   `width` 宽度，默认`auto`
-   `height` 高度，默认`200px`
-   `controls` 显示左右箭头、底部圆点索引，默认`['dots', 'arrows']`
-   `controlsTheme` 左右箭头、底部圆点索引颜色，默认`light`，另有`dark`模式
-   `animation` 切换动画效果，默认`fade`，另有`slide`模式

```schema:height="350" scope="body"
{
    "type": "carousel",
    "controlTheme": "light",
    "height": "300",
    "animation": "slide",
    "options": [
        {
            "image": "https://video-react.js.org/assets/poster.png"
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
