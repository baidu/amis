---
title: Audio 音频
description:
type: 0
group: ⚙ 组件
menuName: Audio 音频
icon:
order: 28
---

## 基本使用

```schema: scope="body"
{
    "type": "audio",
    "src": "https://amis.bj.bcebos.com/amis/2019-7/1562137295708/chicane-poppiholla-original-radio-edit%20(1).mp3"
}
```

## 属性表

| 属性名    | 类型      | 默认值                                           | 说明                                    |
| --------- | --------- | ------------------------------------------------ | --------------------------------------- |
| type      | `string`  | `"audio"`                                        | 指定为 audio 渲染器                     |
| className | `string`  |                                                  | 外层 Dom 的类名                         |
| inline    | `boolean` | true                                             | 是否是内联模式                          |
| src       | `string`  |                                                  | 音频地址                                |
| loop      | `boolean` | false                                            | 是否循环播放                            |
| autoPlay  | `boolean` | false                                            | 是否自动播放                            |
| rates     | `array`   | `[]`                                             | 可配置音频播放倍速如：`[1.0, 1.5, 2.0]` |
| controls  | `array`   | `['rates', 'play', 'time', 'process', 'volume']` | 内部模块定制化                          |
