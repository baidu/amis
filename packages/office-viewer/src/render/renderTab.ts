import {ST_TabTlc} from '../openxml/Types';
import {Tab} from '../openxml/word/Tab';
import {createElement} from '../util/dom';
import Word from '../Word';

/**
 * 渲染 tab
 * http://officeopenxml.com/WPtab.php
 */
export function renderTab(word: Word, tab: Tab) {
  const tabElement = createElement('span');
  tabElement.style.display = 'inline-block';
  tabElement.style.width = tab.pos;
  tabElement.innerHTML = '&nbsp;';
  if (tab.leader === ST_TabTlc.dot) {
    tabElement.style.borderBottom = '1px dotted';
  }
  return tabElement;
}
