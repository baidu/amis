import Word from '../Word';
import {parseBorder} from './parseBorder';

/**
 * parseBorders 不支持 insideH 和 insideV，所以单独支持一下
 * 实际显示时需要过滤掉第一列
 */
export function parseInsideBorders(word: Word, element: Element) {
  let H;
  const insideH = element.getElementsByTagName('w:insideH').item(0);
  if (insideH) {
    H = parseBorder(word, insideH);
  }

  let V;
  const insideV = element.getElementsByTagName('w:insideV').item(0);
  if (insideV) {
    V = parseBorder(word, insideV);
  }

  return {
    H,
    V
  };
}
