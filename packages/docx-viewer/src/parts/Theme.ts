/**
 * 主要参考 14.2.7 Theme Part
 */

import {loopData} from '../render/loopData';

// http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/clrScheme.html
class ClrScheme {
  name?: string;
  colors: {[key: string]: string} = {};

  static parse(data: any): ClrScheme {
    const scheme = new ClrScheme();

    scheme.name = data['@_name'];

    loopData(data, (key, colorData) => {
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
}

class FontScheme {
  name?: string;
  static parse(data: any): FontScheme {
    const scheme = new FontScheme();

    scheme.name = data['@_name'];

    for (const key in data) {
    }

    return scheme;
  }
}

class FmtScheme {
  name?: string;
  static parse(data: any): FmtScheme {
    const scheme = new FmtScheme();

    scheme.name = data['@_name'];

    for (const key in data) {
    }

    return scheme;
  }
}

export class ThemeElements {
  clrScheme: ClrScheme;
  fontScheme: FontScheme;
  fmtScheme: FmtScheme;

  static parse(data: any): ThemeElements {
    const themeElements = new ThemeElements();
    themeElements.clrScheme = ClrScheme.parse(data['a:clrScheme']);
    themeElements.fontScheme = FontScheme.parse(data['a:fontScheme']);
    themeElements.fmtScheme = FmtScheme.parse(data['a:fmtScheme']);

    return themeElements;
  }
}

export default class Theme {
  name: string;

  themeElements: ThemeElements;

  static parse(data: any): Theme {
    const themeData = data['a:theme'];
    const theme = new Theme();
    theme.name = data['@_name'];
    theme.themeElements = ThemeElements.parse(themeData['a:themeElements']);
    return theme;
  }
}
