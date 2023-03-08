import {Run, RunProperties} from './../Run';
/**
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/lvl_2.html
 */
import {
  XMLData,
  WAttr,
  WTag,
  getValNumber,
  getVal,
  loopChildren
} from '../../../OpenXML';
import {ST_Jc, ST_LevelSuffix, ST_NumberFormat} from '../../Types';
import {Paragraph, ParagraphProperties} from '../Paragraph';
import Word from '../../../Word';

export class Lvl {
  ilvl: string;
  start: number = 1;
  numFmt: ST_NumberFormat;
  lvlText: string = '%1.';
  lvlJc: ST_Jc;
  suff: ST_LevelSuffix = ST_LevelSuffix.space;

  pPr?: ParagraphProperties;
  rPr?: RunProperties;

  static fromXML(word: Word, data: XMLData): Lvl {
    const lvl = new Lvl();

    lvl.ilvl = data[WAttr.ilvl] as string;

    loopChildren(data, (key, value) => {
      if (typeof value !== 'object') {
        return;
      }

      switch (key) {
        case WTag.start:
          lvl.start = getValNumber(value as XMLData);
          break;

        case WTag.numFmt:
          lvl.numFmt = getVal(value as XMLData) as ST_NumberFormat;
          break;

        case WTag.lvlText:
          lvl.lvlText = getVal(value as XMLData) as string;
          break;

        case WTag.lvlJc:
          lvl.lvlJc = getVal(value as XMLData) as ST_Jc;
          break;

        case WTag.pPr:
          lvl.pPr = Paragraph.parseParagraphProperties(word, value as XMLData);
          break;

        case WTag.rPr:
          lvl.rPr = Run.parseRunProperties(word, value as XMLData);
          break;

        default:
          console.warn(`Lvl: Unknown tag `, key);
      }
    });

    return lvl;
  }
}
