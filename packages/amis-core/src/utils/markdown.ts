/**
 * @file markdown 解析
 */

import type markdownIt from 'markdown-it';


let doMarkdown:any;
export async function markdown(content: string, options?: markdownIt.Options) {
  if (!doMarkdown) {
    const {default: markdownIt} =  await import('markdown-it');
    // @ts-ignore
    const {default: {html5Media}} = await import('markdown-it-html5-media');

    doMarkdown = markdownIt();
    doMarkdown.use(html5Media);
  }

  if (options) {
    doMarkdown.set(options);
  }
  return doMarkdown.render(content);
}

export default markdown;
