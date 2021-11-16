/**
 * @file markdown 解析
 */

import markdownIt from 'markdown-it';
// @ts-ignore
import {html5Media} from 'markdown-it-html5-media';

const markdown = markdownIt({
  linkify: true
});

markdown.use(html5Media);

export default function (content: string) {
  return markdown.render(content);
}
