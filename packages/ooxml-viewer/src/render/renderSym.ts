import {Sym} from '../openxml/word/Sym';
import {createElement} from '../util/dom';
import Word from '../Word';

export function renderSym(word: Word, sym: Sym) {
  const span = createElement('span');
  span.style.fontFamily = sym.font;
  span.innerHTML = `&#x${sym.char};`;
  return span;
}
