/**
 * 主要参考 14.2.7 Theme Part
 */

import {loopChildren, ATag, Attr, XMLData} from '../OpenXML';

// http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/clrScheme.html
class ClrScheme {
  name?: string;
  colors: {[key: string]: string} = {};
}

function parseClrScheme(data: XMLData): ClrScheme {
  const scheme = new ClrScheme();

  scheme.name = data[Attr.name] as string;

  loopChildren(data, (key, colorData) => {
    const keyName = key.replace('a:', '');
    if (ATag.srgbClr in colorData) {
      const srgbClr = colorData[ATag.srgbClr] as XMLData;
      scheme.colors[keyName] = srgbClr[Attr.val] as string;
    } else if (ATag.sysClr in colorData) {
      const sysClr = colorData[ATag.sysClr] as XMLData;
      scheme.colors[keyName] = sysClr[Attr.lastClr] as string;
    }
  });

  return scheme;
}

interface FontScheme {
  name?: string;
}

function parseFontScheme(data: XMLData) {
  const scheme: FontScheme = {};

  scheme.name = data[Attr.name] as string;

  for (const key in data) {
  }

  return scheme;
}

interface FmtScheme {
  name?: string;
}

function parseFmtScheme(data: XMLData) {
  const scheme: FmtScheme = {};

  scheme.name = data[Attr.name] as string;

  for (const key in data) {
  }

  return scheme;
}

export interface ThemeElements {
  clrScheme?: ClrScheme;
  fontScheme?: FontScheme;
  fmtScheme?: FmtScheme;
}

function parseThemeElements(data: XMLData) {
  const themeElements: ThemeElements = {};
  themeElements.clrScheme = parseClrScheme(data[ATag.clrScheme] as XMLData);
  themeElements.fontScheme = parseFontScheme(data[ATag.fontScheme] as XMLData);
  themeElements.fmtScheme = parseFmtScheme(data[ATag.fmtScheme] as XMLData);

  return themeElements;
}

export interface Theme {
  name?: string;

  themeElements?: ThemeElements;
}

export function parseTheme(data: XMLData) {
  const themeData = data[ATag.theme] as XMLData;
  const theme: Theme = {};
  theme.name = data[Attr.name] as string;
  theme.themeElements = parseThemeElements(
    themeData['a:themeElements'] as XMLData
  );
  return theme;
}
