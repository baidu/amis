import {createElement, appendChild} from '../util/dom';
import Word from '../Word';
import {loopChildren} from '../util/xml';
import {renderElement} from './renderElement';

export default function renderBody(word: Word, data: any) {
  const body = createElement('div');
  loopChildren(data, (key, value) => {
    const element = renderElement(word, key, value);
    if (element) {
      appendChild(body, element);
      return;
    }
    console.warn('renderBody Unknown key', key);
  });
  return body;
}
