---
title: CSS 变量
---

要想使用 CSS 变量就必须知道某个组件都用到了哪些变量，目前最完善的方式是用 Chrome 开发者工具。

不过如果你不知道如何使用，本文将会介绍一些常用的 CSS 变量，掌握他们也能完成大部分定制工作。

## 基础颜色

| 变量                 | 类型 | 说明                           |
| -------------------- | ---- | ------------------------------ |
| --black              | 颜色 | 黑色颜色                       |
| --white              | 颜色 | 白色颜色                       |
| --light              | 颜色 | 最浅的颜色                     |
| --dark               | 颜色 | 最深的颜色                     |
| --body-bg            | 颜色 | 全局背景色                     |
| --background         | 颜色 | table 等背景色                 |
| --primary            | 颜色 | 主颜色，会影响主按钮颜色       |
| --primary-onHover    | 颜色 | 主颜色在鼠标移上去后的颜色     |
| --primary-onActive   | 颜色 | 主颜色在激活时的颜色，比如选中 |
| --secondary          | 颜色 | 次颜色，比如第二个按钮的颜色   |
| --secondary-onHover  | 颜色 | 次颜色在鼠标移上去后的颜色     |
| --secondary-onActive | 颜色 | 次颜色在激活时的颜色           |
| --success            | 颜色 | 成功时的颜色                   |
| --success-onHover    | 颜色 | 在鼠标移上去后的颜色           |
| --success-onActive   | 颜色 | 在激活时的颜色                 |
| --info               | 颜色 | 显示信息的颜色，一般是蓝色     |
| --info-onHover       | 颜色 | 在鼠标移上去后的颜色           |
| --info-onActive      | 颜色 | 在激活时的颜色                 |
| --warning            | 颜色 | 警告的颜色                     |
| --warning-onHover    | 颜色 | 在鼠标移上去后的颜色           |
| --warning-onActive   | 颜色 | 在激活时的颜色                 |
| --danger             | 颜色 | 错误的颜色                     |
| --danger-onHover     | 颜色 | 在鼠标移上去后的颜色           |
| --danger-onActive    | 颜色 | 在激活时的颜色                 |

## 字体相关

| 变量                  | 类型     | 说明                    |
| --------------------- | -------- | ----------------------- |
| --text-color          | 颜色     | 文字颜色                |
| --text--muted-color   | 颜色     | 文字置灰时的颜色        |
| --text--loud-color    | 颜色     | 一般用于标题文字颜色    |
| --button-color        | 颜色     | 按钮文字颜色            |
| --fontFamilyBase      | 字体家族 | 基础字体家族            |
| --fontFamilyMonospace | 字体家族 | 等宽字体家族            |
| --fontSizeBase        | 大小     | 基础字体大小，默认 14px |
| --fontSizeMd          | 大小     | 中等字体大小            |
| --fontSizeLg          | 大小     | 大字体大小              |
| --fontSizeXl          | 大小     | 最大字体大小            |
| --fontSizeSm          | 大小     | 小字体大小              |
| --fontSizeXs          | 大小     | 最小的字体大小          |
| --lineHeightBase      | 大小     | 基础行高                |

## 边框相关

| 变量           | 类型 | 说明         |
| -------------- | ---- | ------------ |
| --borderColor  | 颜色 | 边框颜色     |
| --borderRadius | 大小 | 默认边框圆角 |

## 链接相关

| 变量                      | 类型            | 说明                               |
| ------------------------- | --------------- | ---------------------------------- |
| --link-color              | 颜色            | 链接颜色，默认用 --primary         |
| --link-decoration         | text-decoration | 可以控制是否显示下划线             |
| --link-onHover-color      | 颜色            | 链接在鼠标移上去之后的颜色         |
| --link-onHover-decoration | text-decoration | 可以控制鼠标移上去后是否显示下划线 |

## 动画

| 变量                 | 类型 | 说明                                             |
| -------------------- | ---- | ------------------------------------------------ |
| --animation-duration | 时长 | 动画效果时长，默认 0.1s，可以设置为 0 来关闭动画 |

## 图片

| 变量                 | 类型 | 说明                                             |
| -------------------- | ---- | ------------------------------------------------ |
| --Spinner-bg | background | 加载时的图片 url('data:image/...') |          
