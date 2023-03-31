import {createElement} from '../util/dom';

export function renderSeparator() {
  const sep = createElement('hr');
  sep.style.borderTop = '1px solid #bbb';
  return sep;
}
