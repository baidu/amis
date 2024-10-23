amis.define('docs/zh-CN/components/video.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Video 视频",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Video",
    "icon": null,
    "order": 71,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"video\",\n    \"src\": \"raw:https://amis.bj.bcebos.com/amis/2019-12/1577157317579/trailer_hd.mp4\",\n    \"poster\": \"raw:https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png\"\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"flv-%E5%92%8C-hls-%E7%9B%B4%E6%92%AD\" href=\"#flv-%E5%92%8C-hls-%E7%9B%B4%E6%92%AD\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>flv 和 hls 直播</h2><p>需要设置 <code>isLive: true</code>，目前 flv 和 hls 是通过文件后缀来判断的，还可以通过设置 videoType 来指定，它有两个值：</p>\n<ul>\n<li><code>video/x-flv</code>，使用 <a href=\"https://github.com/xqq/mpegts.js\">mpegts.js</a> 播放 flv</li>\n<li><code>application/x-mpegURL</code>，使用 <a href=\"https://github.com/video-dev/hls.js/\">hls.js</a> 播放 hls 格式</li>\n</ul>\n<h2><a class=\"anchor\" name=\"%E8%A7%86%E9%A2%91%E5%B8%A7%E5%88%87%E6%8D%A2%E5%8A%9F%E8%83%BD\" href=\"#%E8%A7%86%E9%A2%91%E5%B8%A7%E5%88%87%E6%8D%A2%E5%8A%9F%E8%83%BD\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>视频帧切换功能</h2><p>可以定义一组视频帧，渲染的时候会列出来这些帧，点击的时候会自动跳转到对应位置开始播放。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"video\",\n    \"src\": \"https://amis.bj.bcebos.com/amis/2019-12/1577157317579/trailer_hd.mp4\",\n    \"poster\": \"https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png\",\n    \"jumpFrame\": true,\n    \"jumpBufferDuration\": 0,\n    frames: {\n        '00:10': '',\n        '00:20': '',\n        '00:30': ''\n    },\n}\n</script></div><div class=\"markdown-body\">\n<p>可以设置帧图片如果有的话，这个示例偷懒直接用封面了。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"video\",\n    \"src\": \"https://amis.bj.bcebos.com/amis/2019-12/1577157317579/trailer_hd.mp4\",\n    \"poster\": \"https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png\",\n    \"jumpFrame\": true,\n    \"jumpBufferDuration\": 0,\n    stopOnNextFrame: true,\n    frames: {\n        '00:10': 'https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png',\n        '00:20': 'https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png',\n        '00:30': 'https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png'\n    },\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;video&quot;</code></td>\n<td>指定为 video 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>src</td>\n<td><code>string</code></td>\n<td></td>\n<td>视频地址</td>\n</tr>\n<tr>\n<td>isLive</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>是否为直播，视频为直播时需要添加上，支持<code>flv</code>和<code>hls</code>格式</td>\n</tr>\n<tr>\n<td>videoType</td>\n<td><code>string</code></td>\n<td></td>\n<td>指定直播视频格式</td>\n</tr>\n<tr>\n<td>poster</td>\n<td><code>string</code></td>\n<td></td>\n<td>视频封面地址</td>\n</tr>\n<tr>\n<td>muted</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否静音</td>\n</tr>\n<tr>\n<td>loop</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否循环播放</td>\n</tr>\n<tr>\n<td>autoPlay</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否自动播放</td>\n</tr>\n<tr>\n<td>rates</td>\n<td><code>array</code></td>\n<td></td>\n<td>倍数，格式为<code>[1.0, 1.5, 2.0]</code></td>\n</tr>\n<tr>\n<td>frames</td>\n<td><code>object</code></td>\n<td></td>\n<td>key 是时刻信息，value 可以可以为空，可有设置为图片地址，请看上方示例</td>\n</tr>\n<tr>\n<td>jumpBufferDuration</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>点击帧的时候默认是跳转到对应的时刻，如果想提前 3 秒钟，可以设置这个值为 3</td>\n</tr>\n<tr>\n<td>stopOnNextFrame</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>到了下一帧默认是接着播放，配置这个会自动停止</td>\n</tr>\n</tbody></table>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "基本用法",
          "fragment": "%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95",
          "fullPath": "#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95",
          "level": 2
        },
        {
          "label": "flv 和 hls 直播",
          "fragment": "flv-%E5%92%8C-hls-%E7%9B%B4%E6%92%AD",
          "fullPath": "#flv-%E5%92%8C-hls-%E7%9B%B4%E6%92%AD",
          "level": 2
        },
        {
          "label": "视频帧切换功能",
          "fragment": "%E8%A7%86%E9%A2%91%E5%B8%A7%E5%88%87%E6%8D%A2%E5%8A%9F%E8%83%BD",
          "fullPath": "#%E8%A7%86%E9%A2%91%E5%B8%A7%E5%88%87%E6%8D%A2%E5%8A%9F%E8%83%BD",
          "level": 2
        },
        {
          "label": "属性表",
          "fragment": "%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "fullPath": "#%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
