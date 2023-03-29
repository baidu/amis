/**
 * 目前图片和 textbox 都会依赖这个
 */

import {LengthUsage, convertLength} from './../../../parse/parseSize';
import {CSSStyle} from './../../Style';

import {getAttrBoolean, getValBoolean} from '../../../OpenXML';
import Word from '../../../Word';
import {Pic} from './Pic';
import {parseSize} from '../../../parse/parseSize';
import {ST_RelFromH, ST_RelFromV} from '../../Types';
import {WPS} from '../wps/WPS';

/**
 * drawing 在文档中的位置，目前有两种情况，child 和 anchor
 */
export enum Position {
  inline = 'inline',
  anchor = 'anchor'
}

/**
 * 有大量属性不好通过 css 来实现
 * http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/anchor_2.html
 */
export interface Anchor {
  simplePos: boolean;
  hidden?: boolean;
}

function parseAnchor(element: Element): Anchor {
  const simplePos = getAttrBoolean(element, 'simplePos', false);
  const hidden = getAttrBoolean(element, 'hidden', false);
  return {
    simplePos,
    hidden
  };
}

export class Drawing {
  // 如果是图片，这里会有值
  pic?: Pic;
  // 主要用于文本框
  wps?: WPS;
  // drawing 的位置配置
  position: Position = Position.inline;
  // 如果是 anchor，描述具体配置
  anchor?: Anchor;
  // 外层容器样式
  containerStyle?: CSSStyle;

  // 是否是相对容器的垂直高度，如果是的话需要将容器的 p 也设置为 relative
  relativeFromParagraph?: boolean;

  static fromXML(word: Word, element: Element): Drawing | null {
    const drawing = new Drawing();

    const containerStyle: CSSStyle = {};
    drawing.containerStyle = containerStyle;

    const position = element.firstElementChild;

    if (position) {
      if (position.tagName === 'wp:anchor') {
        drawing.position = Position.anchor;
        drawing.anchor = parseAnchor(position);
      }

      for (const child of position.children) {
        const tagName = child.tagName;
        switch (tagName) {
          case 'wp:simplePos':
            // 只有设置了 simplePos 才会生效
            // 据说 word 其实不支持这个属性，所以目前实现估计没啥用
            if (drawing.anchor?.simplePos) {
              containerStyle['position'] = 'absolute';
              containerStyle['x'] = parseSize(child, 'x', LengthUsage.Emu);
              containerStyle['y'] = parseSize(child, 'y', LengthUsage.Emu);
            }
            break;

          case 'wp:positionH':
            const relativeFromH = child.getAttribute(
              'relativeFrom'
            ) as ST_RelFromH;
            if (relativeFromH === 'column' || relativeFromH === 'page') {
              const positionType = child.firstElementChild;
              if (positionType) {
                const positionTypeTagName = positionType.tagName;
                if (positionTypeTagName === 'wp:posOffset') {
                  containerStyle['position'] = 'absolute';
                  containerStyle['left'] = convertLength(
                    positionType.innerHTML,
                    LengthUsage.Emu
                  );
                } else {
                  console.warn('unsupport positionType', positionTypeTagName);
                }
              }
            } else {
              console.warn('unsupport relativeFrom', relativeFromH);
            }
            break;

          case 'wp:positionV':
            const relativeFromV = child.getAttribute(
              'relativeFrom'
            ) as ST_RelFromV;
            if (relativeFromV === 'paragraph' || relativeFromV === 'page') {
              if (relativeFromV === 'paragraph') {
                drawing.relativeFromParagraph = true;
              }
              const positionType = child.firstElementChild;
              if (positionType) {
                const positionTypeTagName = positionType.tagName;
                if (positionTypeTagName === 'wp:posOffset') {
                  containerStyle['position'] = 'absolute';
                  containerStyle['top'] = convertLength(
                    positionType.innerHTML,
                    LengthUsage.Emu
                  );
                } else {
                  console.warn('unsupport positionType', positionTypeTagName);
                }
              }
            } else {
              console.warn('unsupport relativeFrom', relativeFromV);
            }
            break;

          case 'wp:docPr':
          case 'wp:cNvGraphicFramePr':
            // 和展现无关
            // http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/docPr.html
            // http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/cNvGraphicFramePr_1.html
            break;

          case 'a:graphic':
            const graphicData = child.firstElementChild;
            const graphicDataChild = graphicData?.firstElementChild;

            if (graphicDataChild) {
              const graphicDataChildTagName = graphicDataChild.tagName;

              switch (graphicDataChildTagName) {
                case 'pic:pic':
                  drawing.pic = Pic.fromXML(word, graphicDataChild);
                  break;

                case 'wps:wsp':
                  drawing.wps = WPS.fromXML(word, graphicDataChild);
                  break;

                default:
                  console.warn(
                    'unknown graphicData child tag',
                    graphicDataChild
                  );
              }
            }
            break;

          case 'wp:extent':
            containerStyle['width'] = parseSize(child, 'cx', LengthUsage.Emu);
            containerStyle['height'] = parseSize(child, 'cy', LengthUsage.Emu);
            break;

          case 'wp:effectExtent':
            // 目前也不支持特效
            break;

          case 'wp:wrapNone':
            // TODO: 还不知道如何处理
            // http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/wrapNone.html
            break;

          case 'wp14:sizeRelH':
          case 'wp14:sizeRelV':
            // 还不知道是啥，文档都没
            break;

          default:
            console.warn('drawing unknown tag', tagName);
        }
      }
    }

    return drawing;
  }
}
