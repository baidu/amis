import Word from '../Word';
import {parseBorder} from './parseBorder';

/**
 * parseBorders 不支持 insideH 和 insideV，所以单独支持一下
 * 实际显示时需要过滤掉第一列
 */
export function parseInsideBorders(word: Word, element: Element) {
  let H;
  const insideH = element.querySelector('insideH');
  if (insideH) {
    H = parseBorder(word, insideH);
  }

  let V;
  const insideV = element.querySelector('insideV');
  if (insideV) {
    V = parseBorder(word, insideV);
  }

  return {
    H,
    V
  };
}
