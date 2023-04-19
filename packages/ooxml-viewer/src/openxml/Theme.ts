/**
 * 主要参考 14.2.7 Theme Part
 */

import {convertAngle} from '../parse/parseSize';
import {getAttrNumber, getAttrPercent, getVal} from '../OpenXML';
import {Color} from '../util/color';

// http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/clrScheme.html
class ClrScheme {
  name?: string;
  colors: {[key: string]: string} = {};
}

function parseClrScheme(doc: Element | null): ClrScheme {
  const scheme = new ClrScheme();
  if (!doc) {
    return scheme;
  }

  scheme.name = doc.getAttribute('name') || '';
  for (const child of doc.children) {
    const colorName = child.tagName.replace('a:', '');
    const clr = child.firstElementChild;
    if (clr) {
      const clrName = clr.nodeName.replace('a:', '');
      if (clrName === 'sysClr') {
        scheme.colors[colorName] = clr.getAttribute('lastClr') || '';
      } else if (clrName === 'srgbClr') {
        scheme.colors[colorName] = '#' + clr.getAttribute('val') || '';
      } else if (clrName === 'scrgbClr') {
        // https://c-rex.net/projects/samples/ooxml/e1/Part4/OOXML_P4_DOCX_scrgbClr_topic_ID0EOOPJB.html
        // 没测过
        const r = getAttrPercent(child, 'r') * 256;
        const g = getAttrPercent(child, 'g') * 256;
        const b = getAttrPercent(child, 'b') * 256;
        scheme.colors[colorName] = `rgb(${r}, ${g}, ${b})`;
      } else if (clrName === 'hslClr') {
        // https://c-rex.net/projects/samples/ooxml/e1/Part4/OOXML_P4_DOCX_hslClr_topic_ID0EQ5FJB.html
        // 没测过
        const h = convertAngle(child.getAttribute('hue'));
        const s = getAttrPercent(child, 'sat') * 100;
        const l = getAttrPercent(child, 'lum') * 100;
        scheme.colors[colorName] = `hsl(${h}, ${s}%, ${l}%)`;
      } else if (clrName === 'prstClr') {
        scheme.colors[colorName] = getVal(child);
      } else {
        console.error('unknown clr name', clrName);
      }
    }
  }
  return scheme;
}

interface FontScheme {
  name?: string;
}

// TODO: 字体解析
function parseFontScheme(doc: Element | null) {
  const scheme: FontScheme = {};

  return scheme;
}

interface FmtScheme {
  name?: string;
}

function parseFmtScheme(data: Element | null) {
  const scheme: FmtScheme = {};
  return scheme;
}

export interface ThemeElements {
  clrScheme?: ClrScheme;
  fontScheme?: FontScheme;
  fmtScheme?: FmtScheme;
}

function parseThemeElements(element: Element | null) {
  const themeElements: ThemeElements = {};
  if (element) {
    themeElements.clrScheme = parseClrScheme(
      element.getElementsByTagName('a:clrScheme').item(0)
    );
    themeElements.fontScheme = parseFontScheme(
      element.getElementsByTagName('a:fontScheme').item(0)
    );
    themeElements.fmtScheme = parseFmtScheme(
      element.getElementsByTagName('a:fmtScheme').item(0)
    );
  }

  return themeElements;
}

export interface Theme {
  name?: string;

  themeElements?: ThemeElements;
}

export function parseTheme(doc: Document) {
  const theme: Theme = {};

  theme.themeElements = parseThemeElements(
    doc.getElementsByTagName('a:themeElements').item(0)
  );

  return theme;
}
