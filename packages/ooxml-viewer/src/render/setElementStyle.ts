import {Properties} from '../openxml/word/properties/Properties';
import {addClassName, addClassNames, applyStyle} from '../util/dom';
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
    applyStyle(element, properties.cssStyle);

    // 需要依赖这个 class 才能实现水平分布
    // https://stackoverflow.com/a/21199162
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
