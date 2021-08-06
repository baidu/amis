---
title: Video 视频
description:
type: 0
group: ⚙ 组件
menuName: Video
icon:
order: 71
---

## 基本用法

```schema: scope="body"
{
    "type": "video",
    "src": "raw:https://amis.bj.bcebos.com/amis/2019-12/1577157317579/trailer_hd.mp4",
    "poster": "raw:https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png"
}
```

## flv 和 hls 直播

需要设置 `isLive: true`，目前 flv 和 hls 是通过文件后缀来判断的，还可以通过设置 videoType 来指定，它有两个值：

- `video/x-flv`，使用 [mpegts.js](https://github.com/xqq/mpegts.js) 播放 flv
- `application/x-mpegURL`，使用 [hls.js](https://github.com/video-dev/hls.js/) 播放 hls 格式

## 属性表

| 属性名    | 类型      | 默认值    | 说明                                                     |
| --------- | --------- | --------- | -------------------------------------------------------- |
| type      | `string`  | `"video"` | 指定为 video 渲染器                                      |
| className | `string`  |           | 外层 Dom 的类名                                          |
| src       | `string`  |           | 视频地址                                                 |
| isLive    | `boolean` | false     | 是否为直播，视频为直播时需要添加上，支持`flv`和`hls`格式 |
| videoType | `string`  |           | 指定直播视频格式                                         |
| poster    | `string`  |           | 视频封面地址                                             |
| muted     | `boolean` |           | 是否静音                                                 |
| autoPlay  | `boolean` |           | 是否自动播放                                             |
| rates     | `array`   |           | 倍数，格式为`[1.0, 1.5, 2.0]`                            |
