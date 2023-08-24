import {Run, RunPr} from './../Run';
/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/lvl_2.html
 */
import {getValNumber, getVal, getValBoolean} from '../../../OpenXML';
import {ST_Jc, ST_LevelSuffix, ST_NumberFormat} from '../../Types';
import {Paragraph, ParagraphPr} from '../Paragraph';
import Word from '../../../Word';

export class Lvl {
  ilvl: string;
  start: number = 1;
  numFmt: ST_NumberFormat;
  lvlText: string = '%1.';
  isLgl: boolean = false;
  lvlJc: ST_Jc = 'start';
  suff: ST_LevelSuffix = 'space';

  pPr?: ParagraphPr;
  rPr?: RunPr;

  static fromXML(word: Word, element: Element): Lvl {
    const lvl = new Lvl();

    lvl.ilvl = element.getAttribute('w:ilvl')!;

    for (const child of element.children) {
      const tagName = child.tagName;
      switch (tagName) {
        case 'w:start':
          lvl.start = getValNumber(child);
          break;

        case 'w:numFmt':
          lvl.numFmt = getVal(child) as ST_NumberFormat;
          break;

        case 'w:lvlText':
          lvl.lvlText = getVal(child) as string;
          break;

        case 'w:lvlJc':
          lvl.lvlJc = getVal(child) as ST_Jc;
          break;

        case 'w:legacy':
          // 老的属性应该不需要支持了
          // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/legacy.html
          break;

        case 'w:pPr':
          lvl.pPr = Paragraph.parseParagraphPr(word, child);
          break;

        case 'w:rPr':
          lvl.rPr = Run.parseRunPr(word, child);
          break;

        case 'w:isLgl':
          lvl.isLgl = getValBoolean(child);
          break;

        case 'w:pStyle':
          // 这个在 paragraph 里处理了
          break;

        default:
          console.warn(`Lvl: Unknown tag `, tagName, child);
      }
    }

    return lvl;
  }
}
