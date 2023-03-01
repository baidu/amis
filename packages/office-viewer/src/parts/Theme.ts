/**
 * 主要参考 14.2.7 Theme Part
 */

import {loopChildren} from '../util/xml';

// http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/clrScheme.html
class ClrScheme {
  name?: string;
  colors: {[key: string]: string} = {};
}

function parseClrScheme(data: any): ClrScheme {
  const scheme = new ClrScheme();

  scheme.name = data['@_name'];

  loopChildren(data, (key, colorData) => {
    const keyName = key.replace('a:', '');
    // 不知道为啥有时候有 a 有时候没有
    if ('a:srgbClr' in colorData) {
      scheme.colors[keyName] = colorData['a:srgbClr']['@_val'];
    } else if ('a:sysClr' in colorData) {
      scheme.colors[keyName] = colorData['a:sysClr']['@_lastClr'];
    } else if ('srgbClr' in colorData) {
      scheme.colors[keyName] = colorData['srgbClr']['@_val'];
    } else if ('sysClr' in colorData) {
      scheme.colors[keyName] = colorData['sysClr']['@_lastClr'];
    }
  });

  return scheme;
}

interface FontScheme {
  name?: string;
}

function parseFontScheme(data: any) {
  const scheme: FontScheme = {};

  scheme.name = data['@_name'];

  for (const key in data) {
  }

  return scheme;
}

interface FmtScheme {
  name?: string;
}

function parseFmtScheme(data: any) {
  const scheme: FmtScheme = {};

  scheme.name = data['@_name'];

  for (const key in data) {
  }

  return scheme;
}

export interface ThemeElements {
  clrScheme?: ClrScheme;
  fontScheme?: FontScheme;
  fmtScheme?: FmtScheme;
}

function parseThemeElements(data: any) {
  const themeElements: ThemeElements = {};
  themeElements.clrScheme = parseClrScheme(data['a:clrScheme']);
  themeElements.fontScheme = parseFontScheme(data['a:fontScheme']);
  themeElements.fmtScheme = parseFmtScheme(data['a:fmtScheme']);

  return themeElements;
}

export interface Theme {
  name?: string;

  themeElements?: ThemeElements;
}

export function parseTheme(data: any) {
  const themeData = data['a:theme'];
  const theme: Theme = {};
  theme.name = data['@_name'];
  theme.themeElements = parseThemeElements(themeData['a:themeElements']);
  return theme;
}
