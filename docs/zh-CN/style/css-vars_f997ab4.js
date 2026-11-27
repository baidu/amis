amis.define('docs/zh-CN/style/css-vars.md', function(require, exports, module, define) {

  module.exports = {
    "title": "CSS 变量",
    "html": "<div class=\"markdown-body\"><p>目前示例中包含了一个<a href=\"../../examples/theme\">主题编辑器</a>，可以在线实时预览效果。</p>\n<p>要想使用 CSS 变量就必须知道某个组件都用到了哪些变量，目前最完善的方式是用 Chrome 开发者工具。</p>\n<p>不过如果你不知道如何使用，本文将会介绍一些常用的 CSS 变量，掌握他们也能完成大部分定制工作。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E7%A1%80%E9%A2%9C%E8%89%B2\" href=\"#%E5%9F%BA%E7%A1%80%E9%A2%9C%E8%89%B2\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基础颜色</h2><table>\n<thead>\n<tr>\n<th>变量</th>\n<th>类型</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>--black</td>\n<td>颜色</td>\n<td>黑色颜色</td>\n</tr>\n<tr>\n<td>--white</td>\n<td>颜色</td>\n<td>白色颜色</td>\n</tr>\n<tr>\n<td>--light</td>\n<td>颜色</td>\n<td>最浅的颜色</td>\n</tr>\n<tr>\n<td>--dark</td>\n<td>颜色</td>\n<td>最深的颜色</td>\n</tr>\n<tr>\n<td>--body-bg</td>\n<td>颜色</td>\n<td>全局背景色</td>\n</tr>\n<tr>\n<td>--background</td>\n<td>颜色</td>\n<td>table 等背景色</td>\n</tr>\n<tr>\n<td>--primary</td>\n<td>颜色</td>\n<td>主颜色，会影响主按钮颜色</td>\n</tr>\n<tr>\n<td>--primary-onHover</td>\n<td>颜色</td>\n<td>主颜色在鼠标移上去后的颜色</td>\n</tr>\n<tr>\n<td>--primary-onActive</td>\n<td>颜色</td>\n<td>主颜色在激活时的颜色，比如选中</td>\n</tr>\n<tr>\n<td>--secondary</td>\n<td>颜色</td>\n<td>次颜色，比如第二个按钮的颜色</td>\n</tr>\n<tr>\n<td>--secondary-onHover</td>\n<td>颜色</td>\n<td>次颜色在鼠标移上去后的颜色</td>\n</tr>\n<tr>\n<td>--secondary-onActive</td>\n<td>颜色</td>\n<td>次颜色在激活时的颜色</td>\n</tr>\n<tr>\n<td>--success</td>\n<td>颜色</td>\n<td>成功时的颜色</td>\n</tr>\n<tr>\n<td>--success-onHover</td>\n<td>颜色</td>\n<td>在鼠标移上去后的颜色</td>\n</tr>\n<tr>\n<td>--success-onActive</td>\n<td>颜色</td>\n<td>在激活时的颜色</td>\n</tr>\n<tr>\n<td>--info</td>\n<td>颜色</td>\n<td>显示信息的颜色，一般是蓝色</td>\n</tr>\n<tr>\n<td>--info-onHover</td>\n<td>颜色</td>\n<td>在鼠标移上去后的颜色</td>\n</tr>\n<tr>\n<td>--info-onActive</td>\n<td>颜色</td>\n<td>在激活时的颜色</td>\n</tr>\n<tr>\n<td>--warning</td>\n<td>颜色</td>\n<td>警告的颜色</td>\n</tr>\n<tr>\n<td>--warning-onHover</td>\n<td>颜色</td>\n<td>在鼠标移上去后的颜色</td>\n</tr>\n<tr>\n<td>--warning-onActive</td>\n<td>颜色</td>\n<td>在激活时的颜色</td>\n</tr>\n<tr>\n<td>--danger</td>\n<td>颜色</td>\n<td>错误的颜色</td>\n</tr>\n<tr>\n<td>--danger-onHover</td>\n<td>颜色</td>\n<td>在鼠标移上去后的颜色</td>\n</tr>\n<tr>\n<td>--danger-onActive</td>\n<td>颜色</td>\n<td>在激活时的颜色</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E5%AD%97%E4%BD%93%E7%9B%B8%E5%85%B3\" href=\"#%E5%AD%97%E4%BD%93%E7%9B%B8%E5%85%B3\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>字体相关</h2><table>\n<thead>\n<tr>\n<th>变量</th>\n<th>类型</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>--text-color</td>\n<td>颜色</td>\n<td>文字颜色</td>\n</tr>\n<tr>\n<td>--text--muted-color</td>\n<td>颜色</td>\n<td>文字置灰时的颜色</td>\n</tr>\n<tr>\n<td>--text--loud-color</td>\n<td>颜色</td>\n<td>一般用于标题文字颜色</td>\n</tr>\n<tr>\n<td>--button-color</td>\n<td>颜色</td>\n<td>按钮文字颜色</td>\n</tr>\n<tr>\n<td>--fontFamilyBase</td>\n<td>字体家族</td>\n<td>基础字体家族</td>\n</tr>\n<tr>\n<td>--fontFamilyMonospace</td>\n<td>字体家族</td>\n<td>等宽字体家族</td>\n</tr>\n<tr>\n<td>--fontSizeBase</td>\n<td>大小</td>\n<td>基础字体大小，默认 14px</td>\n</tr>\n<tr>\n<td>--fontSizeMd</td>\n<td>大小</td>\n<td>中等字体大小</td>\n</tr>\n<tr>\n<td>--fontSizeLg</td>\n<td>大小</td>\n<td>大字体大小</td>\n</tr>\n<tr>\n<td>--fontSizeXl</td>\n<td>大小</td>\n<td>最大字体大小</td>\n</tr>\n<tr>\n<td>--fontSizeSm</td>\n<td>大小</td>\n<td>小字体大小</td>\n</tr>\n<tr>\n<td>--fontSizeXs</td>\n<td>大小</td>\n<td>最小的字体大小</td>\n</tr>\n<tr>\n<td>--lineHeightBase</td>\n<td>大小</td>\n<td>基础行高</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E8%BE%B9%E6%A1%86%E7%9B%B8%E5%85%B3\" href=\"#%E8%BE%B9%E6%A1%86%E7%9B%B8%E5%85%B3\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>边框相关</h2><table>\n<thead>\n<tr>\n<th>变量</th>\n<th>类型</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>--borderColor</td>\n<td>颜色</td>\n<td>边框颜色</td>\n</tr>\n<tr>\n<td>--borderRadius</td>\n<td>大小</td>\n<td>默认边框圆角</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E9%93%BE%E6%8E%A5%E7%9B%B8%E5%85%B3\" href=\"#%E9%93%BE%E6%8E%A5%E7%9B%B8%E5%85%B3\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>链接相关</h2><table>\n<thead>\n<tr>\n<th>变量</th>\n<th>类型</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>--link-color</td>\n<td>颜色</td>\n<td>链接颜色，默认用 --primary</td>\n</tr>\n<tr>\n<td>--link-decoration</td>\n<td>text-decoration</td>\n<td>可以控制是否显示下划线</td>\n</tr>\n<tr>\n<td>--link-onHover-color</td>\n<td>颜色</td>\n<td>链接在鼠标移上去之后的颜色</td>\n</tr>\n<tr>\n<td>--link-onHover-decoration</td>\n<td>text-decoration</td>\n<td>可以控制鼠标移上去后是否显示下划线</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E5%8A%A8%E7%94%BB\" href=\"#%E5%8A%A8%E7%94%BB\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>动画</h2><table>\n<thead>\n<tr>\n<th>变量</th>\n<th>类型</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>--animation-duration</td>\n<td>时长</td>\n<td>动画效果时长，默认 0.1s，可以设置为 0 来关闭动画</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E5%9B%BE%E7%89%87\" href=\"#%E5%9B%BE%E7%89%87\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>图片</h2><table>\n<thead>\n<tr>\n<th>变量</th>\n<th>类型</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>--Spinner-bg</td>\n<td>background</td>\n<td>加载时的图片 url(&#39;data:image/...&#39;)</td>\n</tr>\n</tbody></table>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "基础颜色",
          "fragment": "%E5%9F%BA%E7%A1%80%E9%A2%9C%E8%89%B2",
          "fullPath": "#%E5%9F%BA%E7%A1%80%E9%A2%9C%E8%89%B2",
          "level": 2
        },
        {
          "label": "字体相关",
          "fragment": "%E5%AD%97%E4%BD%93%E7%9B%B8%E5%85%B3",
          "fullPath": "#%E5%AD%97%E4%BD%93%E7%9B%B8%E5%85%B3",
          "level": 2
        },
        {
          "label": "边框相关",
          "fragment": "%E8%BE%B9%E6%A1%86%E7%9B%B8%E5%85%B3",
          "fullPath": "#%E8%BE%B9%E6%A1%86%E7%9B%B8%E5%85%B3",
          "level": 2
        },
        {
          "label": "链接相关",
          "fragment": "%E9%93%BE%E6%8E%A5%E7%9B%B8%E5%85%B3",
          "fullPath": "#%E9%93%BE%E6%8E%A5%E7%9B%B8%E5%85%B3",
          "level": 2
        },
        {
          "label": "动画",
          "fragment": "%E5%8A%A8%E7%94%BB",
          "fullPath": "#%E5%8A%A8%E7%94%BB",
          "level": 2
        },
        {
          "label": "图片",
          "fragment": "%E5%9B%BE%E7%89%87",
          "fullPath": "#%E5%9B%BE%E7%89%87",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
