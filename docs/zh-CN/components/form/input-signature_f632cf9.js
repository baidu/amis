amis.define('docs/zh-CN/components/form/input-signature.md', function(require, exports, module, define) {

  module.exports = {
    "title": "inputSignature 签名面板",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "inputSignature",
    "icon": null,
    "order": 62,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"name\": \"signature\",\n            \"type\": \"input-signature\",\n            \"label\": \"手写签名\",\n            \"height\": 200\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%89%E9%92%AE%E5%90%8D%E7%A7%B0\" href=\"#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%89%E9%92%AE%E5%90%8D%E7%A7%B0\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>自定义按钮名称</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"name\": \"signature\",\n            \"type\": \"input-signature\",\n            \"height\": 160,\n            \"confirmBtnLabel\": \"确定\",\n            \"undoBtnLabel\": \"上一步\",\n            \"clearBtnLabel\": \"重置\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A2%9C%E8%89%B2\" href=\"#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A2%9C%E8%89%B2\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>自定义颜色</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"name\": \"signature\",\n            \"type\": \"input-signature\",\n            \"label\": \"手写签名\",\n            \"height\": 200,\n            \"color\": \"#ff0000\",\n            \"bgColor\": \"#fff\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E5%90%88%E5%9B%BE%E7%89%87%E7%BB%84%E4%BB%B6%E5%AE%9E%E7%8E%B0%E5%AE%9E%E6%97%B6%E9%A2%84%E8%A7%88\" href=\"#%E9%85%8D%E5%90%88%E5%9B%BE%E7%89%87%E7%BB%84%E4%BB%B6%E5%AE%9E%E7%8E%B0%E5%AE%9E%E6%97%B6%E9%A2%84%E8%A7%88\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配合图片组件实现实时预览</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"name\": \"signature\",\n            \"type\": \"input-signature\",\n            \"label\": \"手写签名\",\n            \"height\": 200\n        },\n        {\n            \"type\": \"image\",\n            \"name\": \"signature\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%86%85%E5%B5%8C%E6%A8%A1%E5%BC%8F\" href=\"#%E5%86%85%E5%B5%8C%E6%A8%A1%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>内嵌模式</h2><p>在内嵌模式下，组件会以按钮的形式展示，点击按钮后弹出一个容器，用户可以在容器中完成签名。更适合在移动端使用。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"name\": \"signature\",\n            \"type\": \"input-signature\",\n            \"label\": \"手写签名\",\n            \"embed\": true\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>width</td>\n<td><code>number</code></td>\n<td></td>\n<td>组件宽度，最小 300</td>\n</tr>\n<tr>\n<td>height</td>\n<td><code>number</code></td>\n<td></td>\n<td>组件高度，最小 160</td>\n</tr>\n<tr>\n<td>color</td>\n<td><code>string</code></td>\n<td><code>#000</code></td>\n<td>手写字体颜色</td>\n</tr>\n<tr>\n<td>bgColor</td>\n<td><code>string</code></td>\n<td><code>#EFEFEF</code></td>\n<td>面板背景颜色</td>\n</tr>\n<tr>\n<td>clearBtnLabel</td>\n<td><code>string</code></td>\n<td><code>清空</code></td>\n<td>清空按钮名称</td>\n</tr>\n<tr>\n<td>undoBtnLabel</td>\n<td><code>string</code></td>\n<td><code>撤销</code></td>\n<td>撤销按钮名称</td>\n</tr>\n<tr>\n<td>confirmBtnLabel</td>\n<td><code>string</code></td>\n<td><code>确认</code></td>\n<td>确认按钮名称</td>\n</tr>\n<tr>\n<td>embed</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否内嵌</td>\n</tr>\n<tr>\n<td>embedConfirmLabel</td>\n<td><code>string</code></td>\n<td><code>确认</code></td>\n<td>内嵌容器确认按钮名称</td>\n</tr>\n<tr>\n<td>ebmedCancelLabel</td>\n<td><code>string</code></td>\n<td><code>取消</code></td>\n<td>内嵌容器取消按钮名称</td>\n</tr>\n<tr>\n<td>embedBtnIcon</td>\n<td><code>string</code></td>\n<td></td>\n<td>内嵌按钮图标</td>\n</tr>\n<tr>\n<td>embedBtnLabel</td>\n<td><code>string</code></td>\n<td><code>点击签名</code></td>\n<td>内嵌按钮文案</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "自定义按钮名称",
          "fragment": "%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%89%E9%92%AE%E5%90%8D%E7%A7%B0",
          "fullPath": "#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8C%89%E9%92%AE%E5%90%8D%E7%A7%B0",
          "level": 2
        },
        {
          "label": "自定义颜色",
          "fragment": "%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A2%9C%E8%89%B2",
          "fullPath": "#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A2%9C%E8%89%B2",
          "level": 2
        },
        {
          "label": "配合图片组件实现实时预览",
          "fragment": "%E9%85%8D%E5%90%88%E5%9B%BE%E7%89%87%E7%BB%84%E4%BB%B6%E5%AE%9E%E7%8E%B0%E5%AE%9E%E6%97%B6%E9%A2%84%E8%A7%88",
          "fullPath": "#%E9%85%8D%E5%90%88%E5%9B%BE%E7%89%87%E7%BB%84%E4%BB%B6%E5%AE%9E%E7%8E%B0%E5%AE%9E%E6%97%B6%E9%A2%84%E8%A7%88",
          "level": 2
        },
        {
          "label": "内嵌模式",
          "fragment": "%E5%86%85%E5%B5%8C%E6%A8%A1%E5%BC%8F",
          "fullPath": "#%E5%86%85%E5%B5%8C%E6%A8%A1%E5%BC%8F",
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
