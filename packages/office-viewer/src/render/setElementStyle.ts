import {Properties} from '../openxml/word/properties/Properties';
import {addClassNames, setStyle} from '../util/dom';
import Word from '../Word';

/**
 * 设置元素样式，因为好几个地方用所以统一一下
 */
export function setElementStyle(
  word: Word,
  element: HTMLElement,
  properties: Properties | undefined
) {
  if (!properties) {
    return;
  }

  if (properties.cssStyle) {
    setStyle(element, properties.cssStyle);
  }

  if (properties.pStyle) {
    addClassNames(element, word.getStyleClassName(properties.pStyle));
  }

  if (properties.rStyle) {
    addClassNames(element, word.getStyleClassName(properties.rStyle));
  }
}
