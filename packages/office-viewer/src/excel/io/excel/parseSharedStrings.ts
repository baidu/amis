/**
 * 解析 sharedStrings.xml 文件
 */

import {ST_FontScheme, ST_VerticalAlignRun} from '../../../openxml/ExcelTypes';
import {XMLNode, xml2json} from '../../../util/xml';
import {IRPrElt} from '../../types/IRPrElt';
import {RichText} from '../../types/RichText';
import {StringItem} from '../../types/StringItem';
import {parseColor} from './stylesheet/parseColor';

/**
 * 解析 CT_RPrElt
 */
function parseRPr(node: XMLNode) {
  const rPr: IRPrElt = {};
  for (const child of node.children || []) {
    const tag = child.tag;

    switch (tag) {
      case 'rFont':
        rPr.rFont = child.attrs.val;
        break;
      case 'charset':
        rPr.charset = parseInt(child.attrs.val, 10);
        break;
      case 'family':
        rPr.family = parseInt(child.attrs.val, 10);
        break;
      case 'b':
        rPr.b = true;
        break;
      case 'i':
        rPr.i = true;
        break;
      case 'strike':
        rPr.strike = true;
        break;
      case 'outline':
        rPr.outline = true;
        break;
      case 'shadow':
        rPr.shadow = true;
        break;
      case 'condense':
        rPr.condense = true;
        break;
      case 'extend':
        rPr.extend = true;
        break;
      case 'color':
        rPr.color = parseColor(child);
        break;
      case 'sz':
        rPr.sz = parseInt(child.attrs.val, 10);
        break;
      case 'u':
        rPr.u = true;
        break;
      case 'vertAlign':
        rPr.vertAlign = child.attrs.val as ST_VerticalAlignRun;
        break;
      case 'scheme':
        rPr.scheme = child.attrs.val as ST_FontScheme;
        break;

      default:
        console.warn(`parseRPr: ${tag} is not supported`);
    }
  }
  return rPr;
}

/**
 * 这里接口使用字符串是为了方便单测
 * @param xml
 */
export async function parseSharedStrings(xml: string) {
  const sharedStrings: StringItem[] = [];
  if (!xml) {
    return sharedStrings;
  }

  // 对应 CT_Sst 类型，子节点只有可能是 si 或 extLst
  const sst = await xml2json(xml);
  for (const si of sst.children || []) {
    // 对应 CT_Rst 类型，子节点只有可能是 t、r、rPh、phoneticPr
    if (si.tag === 'si') {
      let isSimple = true;
      let text = '';
      let richText: RichText = {
        type: 'rich',
        richText: []
      };
      for (const rst of si.children || []) {
        if (rst.tag === 'r') {
          isSimple = false;
          let rPr = {};
          let t = '';
          // 对应 CT_RElt
          for (const relt of rst.children || []) {
            const tag = relt.tag;
            if (tag === 'rPr') {
              rPr = parseRPr(relt);
            }
            if (tag === 't') {
              t = relt.text || '';
            }
          }
          richText.richText.push({
            rPr,
            t
          });
        }
        if (rst.tag === 't') {
          text = rst.text || '';
        }
      }
      if (isSimple) {
        sharedStrings.push(text);
      } else {
        sharedStrings.push(richText);
      }
    }
  }

  return sharedStrings;
}
