import {autoParse} from '../../../../common/autoParse';
import {CT_Shape_Attributes} from '../../../../openxml/ExcelTypes';
import {parseOutline} from '../../../../openxml/drawing/ShapeProperties';
import {XMLNode} from '../../../../util/xml';
import {parseChildColor} from '../../../../word/parse/parseChildColor';
import {getThemeColor} from '../../../data/getThemeColor';
import {IShape, StyleColor} from '../../../types/IDrawing';
import {IRElt} from '../../../types/IRElt';
import {IRPrElt} from '../../../types/IRPrElt';
import {IWorkbook} from '../../../types/IWorkbook';

export function parseShape(
  workbook: IWorkbook,
  child: XMLNode,
  twoCellAnchorElement: Element
) {
  const shape = autoParse(child, CT_Shape_Attributes) as IShape;
  // 下面是转成渲染需要的数据
  if (twoCellAnchorElement) {
    const spPrs = twoCellAnchorElement.getElementsByTagName('xdr:spPr');
    if (spPrs.length && shape.spPr) {
      const spPr = spPrs[0];
      for (const spPrChild of spPr.children || []) {
        const tag = spPrChild.tagName;
        switch (tag) {
          case 'a:ln':
            const outline = parseOutline(c => {
              return getThemeColor(c, workbook);
            }, spPrChild);
            shape.spPr.outline = outline;
            break;
          case 'a:solidFill':
            shape.spPr.fillColor = parseChildColor(c => {
              return getThemeColor(c, workbook);
            }, spPrChild);
            break;

          default:
            break;
        }
      }
    }

    const style = twoCellAnchorElement.getElementsByTagName('xdr:style');
    if (style.length) {
      const styleColor: StyleColor = {};
      shape.styleColor = styleColor;
      for (const styleChild of style[0].children || []) {
        const tagName = styleChild.tagName;
        switch (tagName) {
          case 'a:lnRef':
            styleColor.lnRefColor = parseChildColor(c => {
              return getThemeColor(c, workbook);
            }, styleChild);
            break;
          case 'a:fillRef':
            styleColor.fillRefColor = parseChildColor(c => {
              return getThemeColor(c, workbook);
            }, styleChild);
            break;
          case 'a:effectRef':
            styleColor.effectRefColor = parseChildColor(c => {
              return getThemeColor(c, workbook);
            }, styleChild);
            break;
          case 'a:fontRef':
            styleColor.fontRefColor = parseChildColor(c => {
              return getThemeColor(c, workbook);
            }, styleChild);
            break;

          default:
            break;
        }
      }
    }

    const txBodies = twoCellAnchorElement.getElementsByTagName('xdr:txBody');
    if (txBodies.length) {
      const txBody = txBodies[0];
      const ts: IRElt[] = [];
      // 转成富文本格式方便渲染
      const ps = txBody.getElementsByTagName('a:p');
      for (const p of ps) {
        const rs = p.getElementsByTagName('a:r');
        for (const r of rs) {
          const t = r.getElementsByTagName('a:t');
          if (t.length) {
            const rPrNodes = r.getElementsByTagName('a:rPr');
            let rPr: IRPrElt = {};
            if (rPrNodes.length) {
              const rPrNode = rPrNodes[0];
              const sz = rPrNode.getAttribute('sz');
              if (sz) {
                // 不知为何拿到的是 100 倍的值
                rPr.sz = parseInt(sz, 10) / 100;
              }

              const b = rPrNode.getAttribute('b');
              if (b) {
                rPr.b = true;
              }

              const solidFill = rPrNode.getElementsByTagName('a:solidFill');

              if (solidFill.length) {
                rPr.color = {
                  rgb: parseChildColor(c => {
                    return getThemeColor(c, workbook);
                  }, solidFill[0])
                };
              }
            }

            const text = t[0].textContent;
            if (text) {
              ts.push({
                rPr,
                t: text
              });
            }
          }
        }
      }

      shape.richText = {
        type: 'rich',
        richText: ts
      };
    }
  }

  return shape;
}
