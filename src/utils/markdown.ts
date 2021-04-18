/**
 * @file markdown 解析
 */

import hljs from 'highlight.js';
import markdownIt from 'markdown-it';
import {escapeHtml} from 'markdown-it/lib/common/utils';

const markdown = markdownIt({
  linkify: true,
  highlight(str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs language-' +
          escapeHtml(lang.toLowerCase()) +
          '"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>'
        );
      } catch (__) {}
    }
    return (
      '<pre class="hljs language-' +
      escapeHtml(lang.toLowerCase()) +
      '"><code>' +
      escapeHtml(str) +
      '</code></pre>'
    );
  }
});

export default function (content: string) {
  return markdown.render(content);
}
