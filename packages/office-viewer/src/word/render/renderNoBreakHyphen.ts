import {createElement} from '../../util/dom';

export function renderNoBreakHyphen() {
  const softHyphen = createElement('span');
  softHyphen.innerHTML = '&ndash;';
  return softHyphen;
}
