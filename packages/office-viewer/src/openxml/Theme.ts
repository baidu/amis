/**
 * 主要参考 14.2.7 Theme Part
 */

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
      element.querySelector('clrScheme')
    );
    themeElements.fontScheme = parseFontScheme(
      element.querySelector('fontScheme')
    );
    themeElements.fmtScheme = parseFmtScheme(
      element.querySelector('fmtScheme')
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

  theme.themeElements = parseThemeElements(doc.querySelector('themeElements'));

  return theme;
}
