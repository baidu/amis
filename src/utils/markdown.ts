/**
 * @file markdown 解析和定制处理，来自爱速搭
 */

import hljs from 'highlight.js';

import markdownIt from 'markdown-it';

// @ts-ignore
const markdown = markdownIt({
  highlight(str: string, lang: string) {
    // @ts-ignore
    const esc = markdown.utils.escapeHtml;
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs language-' +
          esc(lang.toLowerCase()) +
          '"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>'
        );
      } catch (__) {}
    }

    return (
      '<pre class="hljs language-' +
      esc(lang.toLowerCase()) +
      '"><code>' +
      esc(str) +
      '</code></pre>'
    );
  }
});

interface Token {
  type: string;
  content: string;
  children: Array<Token>;
  tag: string;
  attrs: Array<any>;
  attrIndex: (attrName: string) => number;
}

interface State {
  Token: new (...args: any) => Token;
  tokens: Array<Token>;
}

var defaultRender =
  markdown.renderer.rules.link_open ||
  function (
    tokens: Array<Token>,
    idx: number,
    options: object,
    env: any,
    self: any
  ) {
    return self.renderToken(tokens, idx, options);
  };

markdown.renderer.rules.link_open = (
  tokens: Array<Token>,
  idx: number,
  options: object,
  env: any,
  self: any
) => {
  var aIndex = tokens[idx].attrIndex('href');

  if (aIndex >= 0) {
    let href = tokens[idx].attrs[aIndex][1];

    if (href && href[0] === '#') {
      href =
        '#' +
        encodeURIComponent(
          href
            .substring(1)
            .toLowerCase()
            .replace(/[^\u4e00-\u9fa5_a-zA-Z0-9]+/g, '-')
        );
    }

    tokens[idx].attrs[aIndex][1] = href;
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

export default function (content: any) {
  let info: {
    [propName: string]: any;
  } = {};

  let toc: {
    [propName: string]: any;
  } = {
    label: '目录',
    type: 'toc',
    children: <any>[],
    level: 0
  };
  let stack = [toc];

  // 添加anchor
  markdown.core.ruler.push('add_anchor', (state: State) => {
    for (let index = 0, len = state.tokens.length - 1; index < len; index++) {
      const token = state.tokens[index];

      if (
        token.type !== 'heading_open' ||
        state.tokens[index + 1].type !== 'inline'
      ) {
        continue;
      }

      const headingInlineToken = state.tokens[index + 1];
      const text = headingInlineToken.content;

      if (!text) {
        continue;
      }

      const escapedText = encodeURIComponent(
        text.toLowerCase().replace(/[^\u4e00-\u9fa5_a-zA-Z0-9]+/g, '-')
      );

      const level = Number(token.tag.substr(1));
      if (level < 5) {
        let menu = {
          label: text,
          fragment: escapedText,
          fullPath: '#' + escapedText,
          level
        };

        while (stack.length && stack[0].level >= level) {
          stack.shift();
        }

        stack[0].children = stack[0].children || [];
        stack[0].children.push(menu);

        stack.unshift(menu);
      }

      // 会导致添加很多条重复的锚点，所以已经有锚点了就跳过循环
      if (headingInlineToken.children.length > 1) {
        continue;
      }

      const anchorToken = new state.Token('html_inline', '', 0);
      anchorToken.content = `<a class="anchor" name="${escapedText}" href="#${escapedText}" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>`;
      headingInlineToken.children.unshift(anchorToken);
    }
  });

  content = markdown.render(content);

  info.html = content;
  info.toc = toc;

  return info;
}
