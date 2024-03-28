amis.define('docs/zh-CN/components/form/location-picker.md', function(require, exports, module, define) {

  module.exports = {
    "title": "LocationPicker 地理位置",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "LocationPicker",
    "icon": null,
    "order": 30,
    "html": "<div class=\"markdown-body\"><p>用于选择地理位置</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"debug\": true,\n  \"body\": [\n    {\n      \"type\": \"location-picker\",\n      \"name\": \"location\",\n      \"ak\": \"LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7\",\n      \"label\": \"地址\"\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<p>注意其中的 <code>ak</code> 参数只能在 amis 官网示例中使用，请前往<a href=\"http://lbsyun.baidu.com/\">百度地图开放平台</a>申请自己的 <code>ak</code>。</p>\n<h2><a class=\"anchor\" name=\"%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE-%E6%9A%82%E4%B8%8D%E6%94%AF%E6%8C%81-\" href=\"#%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE-%E6%9A%82%E4%B8%8D%E6%94%AF%E6%8C%81-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>高德地图（暂不支持）</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"debug\": true,\n  \"body\": [\n    {\n      \"type\": \"location-picker\",\n      \"name\": \"location\",\n      \"vendor\": \"gaode\",\n      \"ak\": \"8ae6a7549ce3f37f8e5aab9d445df8ad\",\n      \"label\": \"地址\"\n    },\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<p>高德地图需要设置 <code>vendor</code> 为 <code>gaode</code>，并且需要设置 <code>ak</code>。其中的 ak 参数为随机值， 请替换为自己申请的 <code>ak</code> ， 高德地图的 <code>ak</code> 申请地址：<a href=\"https://lbs.amap.com/\">高德地图开放平台</a></p>\n<p>请注意: <strong><em>高德地图不支持坐标转换</em></strong></p>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>当做选择器表单项使用时，除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>value</td>\n<td><code>LocationData</code></td>\n<td>参考 <a href=\"#locationdata\"><code>LocationData</code></a></td>\n<td></td>\n</tr>\n<tr>\n<td>vendor</td>\n<td>&#39;baidu&#39; | &#39;gaode&#39;</td>\n<td>&#39;baidu&#39;</td>\n<td>地图厂商，目前只实现了百度地图和高德地图</td>\n</tr>\n<tr>\n<td>ak</td>\n<td><code>string</code></td>\n<td>无</td>\n<td>百度/高德地图的 ak</td>\n</tr>\n<tr>\n<td>clearable</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>输入框是否可清空</td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td><code>string</code></td>\n<td>&#39;请选择位置&#39;</td>\n<td>默认提示</td>\n</tr>\n<tr>\n<td>autoSelectCurrentLoc</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>是否自动选中当前地理位置</td>\n</tr>\n<tr>\n<td>onlySelectCurrentLoc</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>是否限制只能选中当前地理位置，设置为 true 后，可用于充当定位组件</td>\n</tr>\n<tr>\n<td>coordinatesType</td>\n<td>&#39;bd09&#39; | &#39;gcj02&#39;</td>\n<td>&#39;bd09&#39;</td>\n<td>坐标系类型，默认百度坐标，使用高德地图时应设置为&#39;gcj02&#39;， 高德地图不支持坐标转换</td>\n</tr>\n</tbody></table>\n<h3><a class=\"anchor\" name=\"%E5%9D%90%E6%A0%87%E7%B3%BB%E8%AF%B4%E6%98%8E\" href=\"#%E5%9D%90%E6%A0%87%E7%B3%BB%E8%AF%B4%E6%98%8E\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>坐标系说明</h3><ul>\n<li>bd09：百度坐标系，在 GCJ02 坐标系基础上再次加密。</li>\n<li>gcj02：火星坐标系，是由中国国家测绘局制定的地理坐标系统。</li>\n</ul>\n<h3><a class=\"anchor\" name=\"locationdata\" href=\"#locationdata\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>LocationData</h3><table>\n<thead>\n<tr>\n<th>属性值</th>\n<th>类型</th>\n<th>是否必填</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>address</td>\n<td><code>string</code></td>\n<td>是</td>\n<td>地址信息</td>\n</tr>\n<tr>\n<td>lng</td>\n<td><code>number</code></td>\n<td>是</td>\n<td>经度，范围：[-180, 180]</td>\n</tr>\n<tr>\n<td>lat</td>\n<td><code>number</code></td>\n<td>是</td>\n<td>维度，范围：[-90, 90]</td>\n</tr>\n<tr>\n<td>vendor</td>\n<td>&#39;baidu&#39; | &#39;gaode&#39;</td>\n<td>否</td>\n<td>地图厂商类型</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E4%BA%8B%E4%BB%B6%E8%A1%A8\" href=\"#%E4%BA%8B%E4%BB%B6%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>事件表</h2><p>当前组件会对外派发以下事件，可以通过<code>onEvent</code>来监听这些事件，并通过<code>actions</code>来配置执行的动作，在<code>actions</code>中可以通过<code>${事件参数名}</code>或<code>${event.data.[事件参数名]}</code>来获取事件产生的数据，详细请查看<a href=\"../../docs/concepts/event-action\">事件动作</a>。</p>\n<table>\n<thead>\n<tr>\n<th>事件名称</th>\n<th>事件参数</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>change</td>\n<td><code>[name]: LocationData</code> 组件的值</td>\n<td>选中值变化时触发</td>\n</tr>\n</tbody></table>\n<h3><a class=\"anchor\" name=\"change\" href=\"#change\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>change</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"body\": [\n      {\n        \"type\": \"location-picker\",\n        \"name\": \"location\",\n        \"ak\": \"LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7\",\n        \"label\": \"地址\",\n        \"onEvent\": {\n            \"change\": {\n                \"actions\": [\n                    {\n                      \"actionType\": \"toast\",\n                      \"args\": {\n                          \"msg\": \"${event.data.value|json}\"\n                      }\n                    }\n                ]\n            }\n        }\n      }\n    ]\n  }\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%8A%A8%E4%BD%9C%E8%A1%A8\" href=\"#%E5%8A%A8%E4%BD%9C%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>动作表</h2><p>当前组件对外暴露以下特性动作，其他组件可以通过指定<code>actionType: 动作名称</code>、<code>componentId: 该组件id</code>来触发这些动作，动作配置可以通过<code>args: {动作配置项名称: xxx}</code>来配置具体的参数，详细请查看<a href=\"../../docs/concepts/event-action#触发其他组件的动作\">事件动作</a>。</p>\n<table>\n<thead>\n<tr>\n<th>动作名称</th>\n<th>动作配置</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>clear</td>\n<td>-</td>\n<td>清空</td>\n</tr>\n<tr>\n<td>reset</td>\n<td>-</td>\n<td>将值重置为<code>resetValue</code>，若没有配置<code>resetValue</code>，则清空</td>\n</tr>\n<tr>\n<td>setValue</td>\n<td><code>value</code></td>\n<td>参考 <a href=\"#locationdata\"><code>LocationData</code></a></td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "高德地图（暂不支持）",
          "fragment": "%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE-%E6%9A%82%E4%B8%8D%E6%94%AF%E6%8C%81-",
          "fullPath": "#%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE-%E6%9A%82%E4%B8%8D%E6%94%AF%E6%8C%81-",
          "level": 2
        },
        {
          "label": "属性表",
          "fragment": "%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "fullPath": "#%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "level": 2,
          "children": [
            {
              "label": "坐标系说明",
              "fragment": "%E5%9D%90%E6%A0%87%E7%B3%BB%E8%AF%B4%E6%98%8E",
              "fullPath": "#%E5%9D%90%E6%A0%87%E7%B3%BB%E8%AF%B4%E6%98%8E",
              "level": 3
            },
            {
              "label": "LocationData",
              "fragment": "locationdata",
              "fullPath": "#locationdata",
              "level": 3
            }
          ]
        },
        {
          "label": "事件表",
          "fragment": "%E4%BA%8B%E4%BB%B6%E8%A1%A8",
          "fullPath": "#%E4%BA%8B%E4%BB%B6%E8%A1%A8",
          "level": 2,
          "children": [
            {
              "label": "change",
              "fragment": "change",
              "fullPath": "#change",
              "level": 3
            }
          ]
        },
        {
          "label": "动作表",
          "fragment": "%E5%8A%A8%E4%BD%9C%E8%A1%A8",
          "fullPath": "#%E5%8A%A8%E4%BD%9C%E8%A1%A8",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
