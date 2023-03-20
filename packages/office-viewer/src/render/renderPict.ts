import {Pict} from '../openxml/word/Pict';
import Word from '../Word';

/**
 * 老的 vml 格式，目前只支持图片
 */

export function renderPict(word: Word, pict: Pict) {
  if (pict.imagedata) {
    const img = document.createElement('img') as HTMLImageElement;
    img.style.position = 'relative';

    word.loadImage(pict.imagedata)?.then(url => {
      if (url) {
        img.src = url;
      }
    });

    return img;
  }
  return null;
}
