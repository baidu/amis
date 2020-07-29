## QRCode

二维码显示组件

| 属性名          | 类型     | 默认值                    | 说明                                                                                                                          |
| --------------- | -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| type            | `string` | `"qr-code"`               | 指定为 QRCode 渲染器                                                                                                          |
| className       | `string` |                           | 外层 Dom 的类名                                                                                                               |
| codeSize        | `number` | `128`                     | 二维码的宽高大小                                                                                                              |
| backgroundColor | `string` | `"#fff"`                  | 二维码背景色                                                                                                                  |
| foregroundColor | `string` | `"#000"`                  | 二维码前景色                                                                                                                  |
| level           | `string` | `"L"`                     | 二维码复杂级别，有（'L' 'M' 'Q' 'H'）四种                                                                                     |
| value           | `string` | `"https://www.baidu.com"` | 扫描二维码后显示的文本，如果要显示某个页面请输入完整 url（`"http://..."`或`"https://..."`开头），支持使用 `${xxx}` 来获取变量 |

```schema:height="300" scope="body"
{
    "type": "qr-code",
    "codeSize": 128,
    "backgroundColor": "#fff",
    "foregroundColor": "#000",
    "level": "L",
    "value": "https://www.baidu.com"
}
```
