/**
 * @file markdown 解析
 */

import markdownIt from 'markdown-it';
// @ts-ignore
import {html5Media} from 'markdown-it-html5-media';

const markdown = markdownIt();

markdown.use(html5Media);

export default function (content: string, options?: markdownIt.Options) {
  if (options) {
    markdown.set(options);
  }
  return markdown.render(content);
}
