## Video

视频播放器。

| 属性名    | 类型      | 默认值    | 说明                               |
| --------- | --------- | --------- | ---------------------------------- |
| type      | `string`  | `"video"` | 指定为 video 渲染器                |
| className | `string`  |           | 外层 Dom 的类名                    |
| src       | `string`  |           | 视频地址                           |
| isLive    | `boolean` | false     | 是否为直播，视频为直播时需要添加上 |
| poster    | `string`  |           | 视频封面地址                       |
| muted     | `boolean` |           | 是否静音                           |
| autoPlay  | `boolean` |           | 是否自动播放                       |
| rates     | `array`   |           | 倍数，格式为`[1.0, 1.5, 2.0]`      |

```schema:height="500" scope="body"
{
    "type": "video",
    "autoPlay": false,
    "src": "raw:https://amis.bj.bcebos.com/amis/2019-12/1577157317579/trailer_hd.mp4",
    "poster": "raw:https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png"
}
```
