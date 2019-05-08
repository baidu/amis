### Audio

音频播放器

| 属性名    | 类型      | 默认值                                           | 说明                |
| --------- | --------- | ------------------------------------------------ | ------------------- |
| type      | `string`  | `"audio"`                                        | 指定为 audio 渲染器 |
| className | `string`  |                                                  | 外层 Dom 的类名     |
| inline    | `boolean` | true                                             | 是否是内联模式      |
| src       | `string`  |                                                  | 音频地址            |
| loop      | `boolean` | false                                            | 是否循环播放        |
| autoPlay  | `boolean` | false                                            | 是否自动播放        |
| rates     | `array`   | `[]`                                             | 加速播放            |
| controls  | `array`   | `['rates', 'play', 'time', 'process', 'volume']` | 内部模块定制化      |

```schema:height="200" scope="body"
{
    "type": "audio",
    "autoPlay": false,
    "src": "http://www.ytmp3.cn/down/32791.mp3"
}
```
