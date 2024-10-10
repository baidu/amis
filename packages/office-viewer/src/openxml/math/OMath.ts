import Word from '../../Word';

export class OMath {
  element: Element;
  static fromXML(word: Word, element: Element): OMath {
    const math = new OMath();
    math.element = element;
    return math;
  }
}
