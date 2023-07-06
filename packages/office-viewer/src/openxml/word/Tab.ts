import {getVal} from '../../OpenXML';
import {parseSize} from '../../parse/parseSize';
import Word from '../../Word';
import {ST_TabJc, ST_TabTlc} from '../Types';

export class Tab {
  type: ST_TabJc | 'left';
  pos: string;
  leader?: ST_TabTlc;

  static fromXML(word: Word, element: Element): Tab {
    const tab = new Tab();
    tab.pos = parseSize(element, 'w:pos');
    tab.type = getVal(element) as ST_TabJc;
    tab.leader = element.getAttribute('w:leader') as ST_TabTlc;

    return tab;
  }
}
