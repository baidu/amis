---
title: Log 实时日志
description:
type: 0
group: ⚙ 组件
menuName: Log
icon:
order: 56
---

用于实时显示日志或程序输出结果。

## 基本用法

通过设置 url 来获取日志，支持 ANSI 基本颜色显示。

```schema: scope="body"
{
  "type": "log",
  "height": 300,
  "url": "http://localhost:3000/"
}
```

### 后端的实现

后端只需要通过流的方式输出结果就行，只要收到数据就会马上显示，比如 Node 实现示例。

```javascript
const http = require('http');

let app = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*'
  });

  let index = 1;
  let timer = setInterval(() => {
    if (index < 50) {
      // 每次 write 都会立刻传给前端
      res.write(`line: ${index}\n`);
      index += 1;
    } else {
      res.end('end');
      clearInterval(timer);
    }
  }, 100);
});

app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');
```

## 自动滚动到底部

通过 `autoScroll` 可以关闭此功能

## 属性表

| 属性名      | 类型      | 默认值 | 说明          |
| ----------- | --------- | ------ | ------------- |
| height      | `number`  | 500    | 展示区域高度  |
| className   | `string`  |        | 外层 CSS 类名 |
| autoScroll  | `boolean` | true   | 是否自动滚动  |
| placeholder | `string`  |        | 加载中的文字  |
