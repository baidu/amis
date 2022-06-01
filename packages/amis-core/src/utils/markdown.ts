/**
 * @file markdown 解析
 */

import markdownIt from 'markdown-it';
// @ts-ignore
import {html5Media} from 'markdown-it-html5-media';

const doMarkdown = markdownIt();

doMarkdown.use(html5Media);

export function markdown(content: string, options?: markdownIt.Options) {
  if (options) {
    doMarkdown.set(options);
  }
  return doMarkdown.render(content);
}

export default markdown;
