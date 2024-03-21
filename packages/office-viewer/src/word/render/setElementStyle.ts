import {Properties} from '../../openxml/word/properties/Properties';
import {addClassName, addClassNames, applyStyle} from '../../util/dom';
import Word from '../../Word';

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
    applyStyle(element, properties.cssStyle);

    // 目前默认最后一行用左对齐
    // 这里用 class 的主要原因是方便用户自己覆盖，比如可能有语言需要右对齐
    if (properties.cssStyle['text-align'] === 'justify') {
      addClassName(element, 'justify');
    }
  }

  if (properties.pStyle) {
    addClassNames(element, word.getStyleClassName(properties.pStyle));
  }

  if (properties.rStyle) {
    addClassNames(element, word.getStyleClassName(properties.rStyle));
  }
}
