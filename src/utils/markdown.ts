/**
 * @file markdown 解析
 */

import markdownIt from 'markdown-it';

const markdown = markdownIt({
  linkify: true
});

export default function (content: string) {
  return markdown.render(content);
}
