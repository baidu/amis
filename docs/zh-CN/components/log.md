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

通过设置 source 来获取日志，支持 ANSI 基本颜色显示。

```json
{
  "type": "log",
  "height": 300,
  "source": "http://localhost:3000/"
}
```

由于缺少线上服务，所以这个例子无法在线演，它的运行效果如下图所示

![示例](https://suda.cdn.bcebos.com/images%2Famis%2Flog.gif)

### 后端实现参考

后端需要通过流的方式输出结果，比如 Node 实现示例：

```javascript
const http = require('http');

let app = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': 'http://localhost:8888',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': '*'
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

其它语言请查找如何使用 stream 的方式返回内容，比如 Spring 的 `StreamingResponseBody`：

```java
@Controller
public class StreamingResponseBodyController {
    @GetMapping("/logs")
    public ResponseEntity<StreamingResponseBody> handleLog() {
        StreamingResponseBody stream = out -> {
          for (int i = 0; i < 1000; i++) {
            String msg = "log" + " @ " + new Date();
            out.write(msg.getBytes());
            out.flush();
          }
          out.close();
        };
        return new ResponseEntity(stream, HttpStatus.OK);
    }
}
```

需要注意有些反向代理有 buffer 设置，比如 nginx 的 [proxy_buffer_size](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffer_size)，它会使得即便后端返回内容也需要等 buffer 满了才会真正返回前端，如果需要更实时的效果就需要关掉此功能。

## 对于超长日志的优化

> 1.10.0 及以上版本

如果日志非常长会导致页面卡顿，这时有几种处理方法，请根据需求进行选择，也可以都使用：

1. 设置 `rowHeight`，比如 `"rowHeight": 22`，这时就会默认启用虚拟渲染，避免渲染卡顿
   - 优点：仍然可以查看所有日志
   - 缺点：如果某一行日志很长也不会自动折行，会出现水平滚动条；目前暂时不支持 autoScroll
2. 设置 `maxLength`，限制最大显示行数
   - 优点：某一行日志很长的时候会自动折行
   - 缺点：无法查看之前的日志
3. 试试通过 `"disableColor": false` 关闭 ANSI 颜色

## 自动滚动到底部

通过 `autoScroll` 可以关闭此功能

## source 支持变量

> 1.4.2 及以上版本

可以初始设置为空，这样初始不会加载，而等这个变量有值的时候再加载

```json
{
  "type": "form",
  "body": [
    {
      "label": "数据源",
      "type": "select",
      "name": "source",
      "options": [
        {
          "label": "A",
          "value": "http://localhost:3000/"
        },
        {
          "label": "B",
          "value": "http://localhost:4000/"
        }
      ]
    },
    {
      "type": "log",
      "height": 300,
      "placeholder": "请点击上面的数据源",
      "source": "${source | raw}"
    }
  ]
}
```

## source 支持高级配置

> 1.6.1 及以上版本

可以类似 api 那样自定义 header、method 等，比如：

```json
{
  "type": "log",
  "height": 300,
  "source": {
    "method": "post",
    "url": "[/api/mock2/form/saveForm](http://localhost:3000/)",
    "data": {
      "myName": "${name}",
      "myEmail": "${email}"
    },
    "headers": {
      "my-header": "${myHeader}"
    }
  }
}
```

## 属性表

| 属性名       | 类型      | 默认值 | 说明                           |
| ------------ | --------- | ------ | ------------------------------ |
| height       | `number`  | 500    | 展示区域高度                   |
| className    | `string`  |        | 外层 CSS 类名                  |
| autoScroll   | `boolean` | true   | 是否自动滚动                   |
| placeholder  | `string`  |        | 加载中的文字                   |
| encoding     | `string`  | utf-8  | 返回内容的字符编码             |
| source       | `string`  |        | 接口                           |
| rowHeight    | `number`  |        | 设置每行高度，将会开启虚拟渲染 |
| maxLength    | `number`  |        | 最大显示行数                   |
| disableColor | `boolean` |        | 关闭 ANSI 颜色支持             |
| operation    | `Array`   |        | 可选日志操作：['stop','restart','clear','showLineNumber']
