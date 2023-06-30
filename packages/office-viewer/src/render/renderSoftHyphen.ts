import {createElement} from '../util/dom';

export function renderSoftHyphen() {
  const softHyphen = createElement('span');
  softHyphen.innerHTML = '&shy;';
  return softHyphen;
}
