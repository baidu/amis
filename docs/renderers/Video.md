### Video

视频播放器。

| 属性名    | 类型      | 默认值    | 说明                |
| --------- | --------- | --------- | ------------------- |
| type      | `string`  | `"video"` | 指定为 video 渲染器 |
| className | `string`  |           | 外层 Dom 的类名     |
| src       | `string`  |           | 视频地址            |
| poster    | `string`  |           | 视频封面地址        |
| muted     | `boolean` |           | 是否静音            |
| autoPlay  | `boolean` |           | 是否自动播放        |

```schema:height="500" scope="body"
{
    "type": "video",
    "autoPlay": false,
    "src": "raw:https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    "poster": "raw:https://video-react.js.org/assets/poster.png"
}
```
