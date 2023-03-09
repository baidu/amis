import {loopChildren, WTag, Tag, Attr, XMLData} from '../../OpenXML';
import {parsePr} from '../../parse/parsePr';
import Word from '../../Word';
import {Break} from './Break';
import {Drawing} from './drawing/Drawing';
import {Properties} from './properties/Properties';
/**
 * 一段文本
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/Run_1.html
 */

export interface RunProperties extends Properties {}

export class Text {
  preserveSpace: boolean = false;
  text: string;
  constructor(text: string | number) {
    this.text = String(text);
  }
}

type RunChild = Break | Drawing | Text;

export class Run {
  properties: RunProperties = {};
  children: RunChild[] = [];

  addChild(child: RunChild | null) {
    if (child) {
      this.children.push(child);
    }
  }

  static parseRunProperties(word: Word, data: XMLData) {
    const cssStyle = parsePr(word, data, 'r');
    return {cssStyle};
  }

  static fromXML(word: Word, data: XMLData): Run {
    const run = new Run();

    loopChildren(data, (key, value) => {
      switch (key) {
        case WTag.t:
          {
            if (typeof value === 'string' || typeof value === 'number') {
              run.addChild(new Text(value));
            } else if (typeof value === 'object') {
              const textContent = (value[Tag.text] as string) || '';
              const xmlSpace = value[Attr.xmlSpace];
              const text = new Text(textContent);
              if (xmlSpace === 'preserve') {
                text.preserveSpace = true;
              }
              run.addChild(text);
            }
          }
          break;

        case WTag.rPr:
          run.properties = Run.parseRunProperties(word, value as XMLData);
          break;

        case WTag.br:
          run.addChild(Break.fromXML(word, value as XMLData));
          break;

        case WTag.drawing:
          run.addChild(Drawing.fromXML(word, value as XMLData));
          break;

        default:
          console.warn('parse Run: Unknown key', key);
      }
    });

    return run;
  }
}
