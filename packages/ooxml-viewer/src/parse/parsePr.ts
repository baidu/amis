/**
 * 包括 rPr 及 pPr 的解析，参考了 docxjs 里的实现
 */

import {convertAngle, LengthUsage} from './parseSize';
import {CSSStyle} from '../openxml/Style';
import Word from '../Word';
import {getVal, getValBoolean, getValNumber} from '../OpenXML';
import {parseBorder, parseBorders} from './parseBorder';
import {parseColor, parseColorAttr, parseShdColor} from './parseColor';
import {parseChildColor} from './parseChildColor';
import {parseInd} from './parseInd';
import {parseSize} from './parseSize';
import {parseSpacing} from './parseSpacing';
import {parseFont} from './parseFont';
import {ST_Em, ST_HighlightColor, ST_TextAlignment} from '../openxml/Types';
import {parseTrHeight} from './parseTrHeight';
import {jcToTextAlign} from './jcToTextAlign';
import {parseTextDirection} from './parseTextDirection';
import {Color} from '../util/color';

/**
 * 解析 underline 并附上样式
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/u.html
 */
function parseUnderline(word: Word, element: Element, style: CSSStyle) {
  const val = getVal(element);

  if (val == null) return;

  switch (val) {
    case 'dash':
    case 'dashDotDotHeavy':
    case 'dashDotHeavy':
    case 'dashedHeavy':
    case 'dashLong':
    case 'dashLongHeavy':
    case 'dotDash':
    case 'dotDotDash':
      style['text-decoration-style'] = 'dashed';
      break;

    case 'dotted':
    case 'dottedHeavy':
      style['text-decoration-style'] = 'dotted';
      break;

    case 'double':
      style['text-decoration-style'] = 'double';
      break;

    case 'single':
    case 'thick':
      style['text-decoration'] = 'underline';
      break;

    case 'wave':
    case 'wavyDouble':
    case 'wavyHeavy':
      style['text-decoration-style'] = 'wavy';
      break;

    case 'words':
      style['text-decoration'] = 'underline';
      break;

    case 'none':
      style['text-decoration'] = 'none';
      break;
  }

  const color = parseColorAttr(word, element);

  if (color) {
    style['text-decoration-color'] = color;
  }
}

/**
 * 目前只有部分支持
 * http://officeopenxml.com/WPparagraph-textFrames.php
 */
function parseFrame(element: Element, style: CSSStyle) {
  for (const attribute of element.attributes) {
    const name = attribute.name;
    const value = attribute.value;
    switch (name) {
      case 'w:dropCap':
        if (value === 'drop') {
          // initial-letter 很少浏览器支持，所以用 float 代替
          style['float'] = 'left';
        }
        break;

      case 'w:h':
        if (typeof value === 'object' && !Array.isArray(value)) {
          style['height'] = parseSize(value, 'w:h');
        }
        break;

      case 'w:w':
        if (typeof value === 'object' && !Array.isArray(value)) {
          style['width'] = parseSize(value, 'w:w');
        }
        break;

      case 'w:hAnchor':
      case 'w:vAnchor':
      case 'w:lines':
        // 目前没有办法做到这些属性的控制
        break;

      case 'w:wrap':
        // 其它不支持，先报错
        if (value !== 'around') {
          console.warn('parseFrame: w:wrap not support ' + value);
        }

        break;

      default:
        console.warn('parseFrame: unknown attribute ' + name, attribute);
    }
  }
}

/**
 * 将 em 转成 css 里对应的 text-emphasis 值
 * http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/ST_Em.html
 */
function convertEm(em: ST_Em, style: CSSStyle) {
  switch (em) {
    case 'dot':
      style['text-emphasis'] = 'filled';
      // 按规范里描述应该是在文字上面，但在 word 实际显示的时候是在下面
      // 怀疑是中文场景下做了特殊处理
      style['text-emphasis-position'] = 'under right';
      break;
    case 'comma':
      style['text-emphasis'] = 'filled sesame';
      break;

    case 'circle':
      style['text-emphasis'] = 'open';
      break;

    case 'underDot':
      style['text-emphasis'] = 'filled';
      style['text-emphasis-position'] = 'under right';
      break;
    case 'none':
      break;
  }
}

const HighLightColor = 'transparent';

/**
 * 解析各种 pPr 及 rPr，返回样式
 * @param type 所属类型
 * @returns 样式
 */
export function parsePr(word: Word, element: Element, type: 'r' | 'p' = 'p') {
  let style: CSSStyle = {};
  for (const child of element.children) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'w:sz':
      case 'w:szCs':
        style['font-size'] = parseSize(child, 'w:val', LengthUsage.FontSize);
        break;

      case 'w:jc':
        style['text-align'] = jcToTextAlign(getVal(child));
        break;

      case 'w:framePr':
        parseFrame(child, style);
        break;

      case 'w:pBdr':
        parseBorders(word, child, style);
        break;

      case 'w:ind':
        parseInd(child, style);
        break;

      case 'w:color':
        style['color'] = parseColor(word, child);
        break;

      case 'w:shd':
        // 如果已经有设置说明是 highlight
        if (!('background-color' in style)) {
          // http://officeopenxml.com/WPshading.php
          style['background-color'] = parseShdColor(word, child);
        }
        break;

      case 'w:spacing':
        parseSpacing(word, child, style);
        break;

      case 'w:highlight':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/highlight.html
        // 这个按文档是重要性高于 shd
        style['background-color'] = parseColorAttr(
          word,
          child,
          'w:val',
          'yellow'
        );
        break;

      case 'w:vertAlign':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/vertAlign.html
        // 这个其实和 position 有冲突，但预计这两个同时出现的概率不高
        const vertAlign = getVal(child);
        if (vertAlign === 'superscript') {
          style['vertical-align'] = 'super';
        } else if (vertAlign === 'subscript') {
          style['vertical-align'] = 'sub';
        }
        break;

      case 'w:position':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/position.html
        style['vertical-align'] = parseSize(
          child,
          'w:val',
          LengthUsage.FontSize
        );
        break;

      case 'w:trHeight':
        parseTrHeight(child, style);
        break;

      case 'w:strike':
      case 'w:dstrike':
        // 其实不支持 dstrike，都统一为 strike
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/dstrike.html
        style['text-decoration'] = getValBoolean(child)
          ? 'line-through'
          : 'none';
        break;

      case 'w:b':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/b.html
        style['font-weight'] = getValBoolean(child) ? 'bold' : 'normal';
        break;

      case 'w:adjustRightInd':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/adjustRightInd.html
        // 似乎没法处理
        break;

      case 'w:bCs':
      case 'w:iCs':
        // 忽略，因为 CSS 没法按这个判断
        break;

      case 'w:i':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/i.html
        style['font-style'] = getValBoolean(child) ? 'italic' : 'normal';
        break;

      case 'w:caps':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/caps.html
        style['text-transform'] = getValBoolean(child) ? 'uppercase' : 'normal';
        break;

      case 'w:smallCaps':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/smallCaps.html
        style['text-transform'] = getValBoolean(child) ? 'lowercase' : 'normal';
        break;

      case 'w:u':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/u.html
        parseUnderline(word, child, style);
        break;

      case 'w:rFonts':
        parseFont(word, child, style);
        break;

      case 'w:tblCellSpacing':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/tblCellSpacing_1.html
        style['border-spacing'] = parseSize(child, 'w:w');
        style['border-collapse'] = 'separate';
        break;

      case 'w:bdr':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/bdr.html
        style['border'] = parseBorder(word, child);
        break;

      case 'w:vanish':
        if (getValBoolean(child)) {
          // 这里其实没试过 word 里到底是不是 none
          style['display'] = 'none';
        }
        break;

      case 'w:kern':
        // todo: 这里显示不正确
        // style['letter-spacing'] = parseSize(
        //   child,
        //   'w:val',
        //   LengthUsage.FontSize
        // );
        break;

      case 'w:pStyle':
        // 这个在 paragraph 里处理了
        break;

      case 'w:lang':
      case 'w:noProof':
        // 用于拼写检查
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/lang.html
        break;

      case 'w:keepLines':
      case 'w:keepNext':
      case 'w:widowControl':
      case 'w:pageBreakBefore':
        // 用于分页的场景，目前还不支持 TODO:
        break;

      case 'w:outlineLvl':
        // 似乎是用于目录的，目前还不支持
        break;

      case 'w:contextualSpacing':
        // 还没空看
        break;

      case 'w:numPr':
        // 这个在 parseParagraphProperties 里处理了
        break;

      case 'w:rPr':
        // TODO: 这个有时候和 r 里的 rPr 不一致，不知道如何处理
        const reflection = child.getElementsByTagName('w14:reflection').item(0);
        if (reflection) {
          // css 只支持在块级节点设置
          // 只支持一小部分设置项，另外因为只支持块级别的情况，所以看起来差异较大
          const reflectionDistance =
            parseSize(reflection, 'w4:dist', LengthUsage.Emu) || '0px';
          style[
            '-webkit-box-reflect'
          ] = `below ${reflectionDistance} linear-gradient(transparent, white)`;
        }
        break;

      case 'w:rStyle':
        // 在 Run 里地方处理了
        break;

      case 'w:webHidden':
        // web 模式隐藏
        style['display'] = 'none';
        break;

      case 'w:tabs':
        // 这个在 parseParagraphProperties 里处理了
        break;

      case 'w:snapToGrid':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/snapToGrid_2.html
        // 目前还不支持 grid
        break;

      case 'w:topLinePunct':
        // 没法支持
        break;

      case 'w:wordWrap':
        // 不太确定这里是用 word-break 还是 overflow-wrap
        if (getValBoolean(child)) {
          style['word-break'] = 'break-all';
        }
        break;

      case 'w:textAlignment':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/textAlignment.html
        const alignment = getVal(child) as ST_TextAlignment;
        if (alignment === 'center') {
          style['vertical-align'] = 'middle';
        } else if (alignment !== 'auto') {
          style['vertical-align'] = alignment;
        }
        break;

      case 'w:textDirection':
        parseTextDirection(child, style);
        break;

      case 'w:cnfStyle':
        // 目前是自动计算的，所以不需要这个了
        break;

      case 'w:bidi':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/bidi_1.html
        // TODO: 还不清楚和 w:textDirection 是什么关系
        if (getValBoolean(child, true)) {
          console.warn('w:bidi is not supported.');
        }
        break;

      case 'w:autoSpaceDE':
      case 'w:autoSpaceDN':
        // 这个在其它地方实现了
        break;

      case 'w:kinsoku':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/kinsoku.html
        // 控制不了所以忽略了
        break;

      case 'w:overflowPunct':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/overflowPunct.html
        // 支持不了
        break;

      case 'w:em':
        convertEm(getVal(child) as ST_Em, style);
        break;

      case 'w:w':
        // http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/w_1.html
        // 看起来应该是把文字拉伸
        const w = getValNumber(child);
        style['transform'] = `scaleX(${w / 100})`;
        style['display'] = 'inline-block'; // 需要这样才能生效
        break;

      case 'w:outline':
        style['text-shadow'] =
          '-1px -1px 0 #AAA, 1px -1px 0 #AAA, -1px 1px 0 #AAA, 1px 1px 0 #AAA';
        break;

      case 'w:shadown':
      case 'w:imprint':
        if (getValBoolean(child, true)) {
          style['text-shadow'] = '1px 1px 2px rgba(0, 0, 0, 0.6)';
        }
        break;

      case 'w14:shadow':
        const blurRad =
          parseSize(child, 'w14:blurRad', LengthUsage.Emu) || '4px';
        // 其它结果算出来不像就先忽略了
        let color = 'rgba(0, 0, 0, 0.6)';
        const childColor = parseChildColor(word, child);
        if (childColor) {
          color = childColor;
        }
        style['text-shadow'] = `1px 1px ${blurRad} ${color}`;
        break;

      case 'w14:textOutline':
        const outlineWidth =
          parseSize(child, 'w14:w', LengthUsage.Emu) || '1px';

        style['-webkit-text-stroke-width'] = outlineWidth;

        let outlineColor = 'white';
        const fillColor = child.getElementsByTagName('w14:solidFill');
        if (fillColor.length > 0) {
          outlineColor = parseChildColor(word, fillColor.item(0)!) || 'white';
        }

        style['-webkit-text-stroke-color'] = outlineColor;
        break;

      case 'w14:reflection':
        // 在 rPr 里处理了
        break;

      case 'w14:textFill':
        // color 已经够用了，为了避免 lumMod 计算不正确反而导致问题，所以就不支持了
        break;

      case 'w14:ligatures':
        // 没文档，不知道
        break;

      default:
        console.warn('parsePr Unknown tagName', tagName, child);
    }
  }

  return style;
}
