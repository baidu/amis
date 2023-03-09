/**
 * OpenXML 数据类型定义，针对 fast-xml-parser 的解析结果
 * 主要目的是避免到处都是 any 容易漏检查类型
 */

export const WTag = {
  pStyle: 'w:pStyle',
  jc: 'w:jc',
  pBdr: 'w:pBdr',
  ind: 'w:ind',
  color: 'w:color',
  shd: 'w:shd',
  spacing: 'w:spacing',
  framePr: 'w:framePr',
  rPr: 'w:rPr',
  pPr: 'w:pPr',
  tblPr: 'w:tblPr',
  name: 'w:name',
  basedOn: 'w:basedOn',
  style: 'w:style',
  styles: 'w:styles',
  docDefaults: 'w:docDefaults',
  rPrDefault: 'w:rPrDefault',
  pPrDefault: 'w:pPrDefault',
  p: 'w:p',
  r: 'w:r',
  t: 'w:t',
  br: 'w:br',
  tbl: 'w:tbl',
  document: 'w:document',
  body: 'w:body',
  highlight: 'w:highlight',
  vertAlign: 'w:vertAlign',
  position: 'w:position',
  trHeight: 'w:trHeight',
  strike: 'w:strike',
  dstrike: 'w:dstrike',
  b: 'w:b',
  bCs: 'w:bCs',
  i: 'w:i',
  iCs: 'w:iCs',
  caps: 'w:caps',
  smallCaps: 'w:smallCaps',
  u: 'w:u',
  tblInd: 'w:tblInd',
  rFonts: 'w:rFonts',
  tblBorders: 'w:tblBorders',
  tblCellSpacing: 'w:tblCellSpacing',
  bdr: 'w:bdr',
  tcBorders: 'w:tcBorders',
  vanish: 'w:vanish',
  kern: 'w:kern',
  noWrap: 'w:noWrap',
  tblCellMar: 'w:tblCellMar',
  tcMar: 'w:tcMar',
  tblLayout: 'w:tblLayout',
  vAlign: 'w:vAlign',
  wordWrap: 'w:wordWrap',
  sz: 'w:sz',
  szCs: 'w:szCs',
  lang: 'w:lang',
  keepLines: 'w:keepLines',
  keepNext: 'w:keepNext',
  outlineLvl: 'w:outlineLvl',
  pageBreakBefore: 'w:pageBreakBefore',
  widowControl: 'w:widowControl',
  contextualSpacing: 'w:contextualSpacing',
  proofErr: 'w:proofErr',
  noProof: 'w:noProof',
  hyperlink: 'w:hyperlink',
  bookmarkStart: 'w:bookmarkStart',
  bookmarkEnd: 'w:bookmarkEnd',
  drawing: 'w:drawing',
  background: 'w:background',
  abstractNum: 'w:abstractNum',
  num: 'w:num',
  nsid: 'w:nsid',
  multiLevelType: 'w:multiLevelType',
  tmpl: 'w:tmpl',
  lvl: 'w:lvl',
  start: 'w:start',
  left: 'w:left',
  end: 'w:end',
  right: 'w:right',
  top: 'w:top',
  bottom: 'w:bottom',
  between: 'w:between',
  numFmt: 'w:numFmt',
  lvlText: 'w:lvlText',
  lvlJc: 'w:lvlJc',
  abstractNumId: 'w:abstractNumId',
  lvlOverride: 'w:lvlOverride',
  numbering: 'w:numbering',
  numPr: 'w:numPr',
  ilvl: 'w:ilvl',
  numId: 'w:numId',
  isLgl: 'w:isLgl',
  sectPr: 'w:sectPr',
  pgSz: 'w:pgSz',
  pgMar: 'w:pgMar',
  cols: 'w:cols',
  docGrid: 'w:docGrid',
  tblStyle: 'w:tblStyle',
  tblW: 'w:tblW',
  tblLook: 'w:tblLook'
} as const;

export const WPTag = {
  inline: 'wp:inline',
  anchor: 'wp:anchor'
} as const;

export const ATag = {
  graphic: 'a:graphic',
  graphicData: 'a:graphicData',
  blip: 'a:blip',
  xfrm: 'a:xfrm',
  off: 'a:off',
  ext: 'a:ext',
  srgbClr: 'a:srgbClr',
  sysClr: 'a:sysClr',
  clrScheme: 'a:clrScheme',
  fontScheme: 'a:fontScheme',
  fmtScheme: 'a:fmtScheme',
  themeElements: 'a:themeElements',
  theme: 'a:theme'
} as const;

export const PicTag = {
  pic: 'pic:pic',
  blipFill: 'pic:blipFill',
  spPr: 'pic:spPr'
} as const;

export const WAttr = {
  val: '@_w:val',
  fill: '@_w:fill',
  sz: '@_w:sz',
  color: '@_w:color',
  themeColor: '@_w:themeColor',
  firstLine: '@_w:firstLine',
  hanging: '@_w:hanging',
  left: '@_w:left',
  start: '@_w:start',
  right: '@_w:right',
  end: '@_w:end',
  line: '@_w:line',
  lineRule: '@_w:lineRule',
  before: '@_w:before',
  after: '@_w:after',
  styleId: '@_w:styleId',
  hRule: '@_w:hRule',
  ascii: '@_w:ascii',
  cs: '@_w:cs',
  eastAsia: '@_w:eastAsia',
  asciiTheme: '@_w:asciiTheme',
  eastAsiaTheme: '@_w:eastAsiaTheme',
  csTheme: '@_w:csTheme',
  w: '@_w:w',
  h: '@_w:h',
  anchor: '@_w:anchor',
  dropCap: '@_w:dropCap',
  name: '@_w:name',
  themeShade: '@_w:themeShade',
  themeTint: '@_w:themeTint',
  abstractNumId: '@_w:abstractNumId',
  numId: '@_w:numId',
  ilvl: '@_w:ilvl',
  top: '@_w:top',
  bottom: '@_w:bottom',
  header: '@_w:header',
  footer: '@_w:footer',
  gutter: '@_w:gutter',
  type: '@_w:type'
} as const;

export const RAttr = {
  id: '@_r:id',
  embed: '@_r:embed'
} as const;

export const Tag = {
  Types: 'Types',
  Override: 'Override',
  text: '#text'
} as const;

export const Attr = {
  Id: '@_Id',
  id: '@_id',
  Type: '@_Type',
  Target: '@_Target',
  TargetMode: '@_TargetMode',
  x: '@_x',
  y: '@_y',
  cx: '@_cx',
  cy: '@_cy',
  val: '@_val',
  lastClr: '@_lastClr',
  name: '@_name',
  xmlSpace: '@_xml:space',
  ContentType: '@_ContentType',
  PartName: '@_PartName'
} as const;

export type TagNames =
  | typeof WTag[keyof typeof WTag]
  | typeof WPTag[keyof typeof WPTag]
  | typeof ATag[keyof typeof ATag]
  | typeof PicTag[keyof typeof PicTag];

export type AttrNames =
  | typeof WAttr[keyof typeof WAttr]
  | typeof RAttr[keyof typeof RAttr]
  | typeof Tag[keyof typeof Tag]
  | typeof Attr[keyof typeof Attr];

export type XMLKeys = TagNames | AttrNames;

export type XMLData = {
  [key in XMLKeys]: XMLData | string | number | boolean | XMLData[];
};

/**
 * xml 有时候子节点是数组，从上层获取时需要遍历
 * @param data
 * @param callback
 */

export function loopChildren(
  data: XMLData,
  callback: (key: string, value: string | number | boolean | XMLData) => void
) {
  for (const key in data) {
    const k = key as XMLKeys;
    if (key.startsWith('@_')) {
      continue;
    }
    const value = data[k];
    if (Array.isArray(value)) {
      for (const item of value) {
        callback(k, item);
      }
    } else {
      callback(k, value);
    }
  }
}

/**
 * 获取属性字符串
 */
export function getAttrString(key: AttrNames, data: XMLData): string {
  let attrString = '';
  if (key in data) {
    return String(data[key]);
  }
  return attrString;
}

/**
 * 获取 w:val 的值
 */
export function getVal(data: XMLData | string | number | boolean) {
  if (typeof data === 'string') {
    return data;
  } else if (typeof data === 'object' && !Array.isArray(data)) {
    return data[WAttr.val] as string;
  } else {
    console.warn('get val error', data);
  }
  return '';
}

export function getValNumber(data: XMLData | string | number | boolean) {
  return parseInt(getVal(data), 10);
}

/**
 * 有可能是 on 或 off 之类的值，都归一化为 boolean
 * @param value
 * @param defaultValue 默认值
 * @returns
 */

export function normalizeBoolean(
  value: string | boolean,
  defaultValue: boolean = false
): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    switch (value) {
      case '1':
        return true;
      case '0':
        return false;
      case 'on':
        return true;
      case 'off':
        return false;
      case 'true':
        return true;
      case 'false':
        return false;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
  }
  return defaultValue;
}

export function getValBoolean(
  data: XMLData | string | number | boolean,
  defaultValue?: true
) {
  return normalizeBoolean(getVal(data), defaultValue);
}
