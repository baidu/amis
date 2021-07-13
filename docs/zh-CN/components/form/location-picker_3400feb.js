amis.define('docs/zh-CN/components/form/location-picker.md', function(require, exports, module, define) {

  module.exports = {
    "title": "LocationPicker 地理位置",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "LocationPicker",
    "icon": null,
    "order": 30,
    "html": "<div class=\"markdown-body\"><p>用于选择地理位置</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"debug\": true,\n  \"body\": [\n    {\n      \"type\": \"location-picker\",\n      \"name\": \"location\",\n      \"ak\": \"LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7\",\n      \"label\": \"地址\"\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<p>注意其中的 <code>ak</code> 参数只能在 amis 官网示例中使用，请前往<a href=\"http://lbsyun.baidu.com/\">百度地图开放平台</a>申请自己的 <code>ak</code>。</p>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>vendor</td>\n<td>&#39;baidu&#39;</td>\n<td>&#39;baidu&#39;</td>\n<td>地图厂商，目前只实现了百度地图</td>\n</tr>\n<tr>\n<td>ak</td>\n<td><code>string</code></td>\n<td>无</td>\n<td>百度地图的 ak</td>\n</tr>\n<tr>\n<td>clearable</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>输入框是否可清空</td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td><code>string</code></td>\n<td>&#39;请选择位置&#39;</td>\n<td>默认提示</td>\n</tr>\n<tr>\n<td>coordinatesType</td>\n<td><code>string</code></td>\n<td>&#39;bd09&#39;</td>\n<td>默为百度坐标，可设置为&#39;gcj02&#39;</td>\n</tr>\n</tbody></table>\n</div>",
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
