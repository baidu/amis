import {ST_TabTlc} from '../openxml/Types';
import {Tab} from '../openxml/word/Tab';
import {createElement} from '../util/dom';
import Word from '../Word';

/**
 * 渲染 tab
 * 不支持 tabs 里的自定义宽度，因为要算渲染后的宽度，比较麻烦
 * http://officeopenxml.com/WPtab.php
 */
export function renderTab(word: Word, tab: Tab, renderWidth = false) {
  const tabElement = createElement('span');
  tabElement.style.display = 'inline-block';
  tabElement.style.width = '2em';
  tabElement.innerHTML = '&emsp;';

  if (tab.leader === 'dot') {
    tabElement.style.borderBottom = '1pt dotted';
  }
  if (renderWidth && tab.pos && (tab.type === 'start' || tab.type == 'left')) {
    tabElement.style.width = tab.pos;
  }
  return tabElement;
}
