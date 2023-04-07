import {convertOOXML} from '../openxml/math/convertOOML';
import {OMath} from '../openxml/math/OMath';
import Word from '../Word';

export function renderOMath(word: Word, math: OMath) {
  return convertOOXML(math.element);
}
