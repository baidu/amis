/**
 * 所有节点及名称列表，针对 fast-xml-parser 的解析结果
 * 主要目的是避免代码中大量字符串，拼错都不知道
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
  baseOn: 'w:baseOn',
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
  drawing: 'w:drawing'
};

export const WPTag = {
  inline: 'wp:inline',
  anchor: 'wp:anchor'
};

export const ATag = {
  graphic: 'a:graphic',
  graphicData: 'a:graphicData',
  blip: 'a:blip',
  xfrm: 'a:xfrm',
  off: 'a:off',
  ext: 'a:ext'
};

export const PicTag = {
  pic: 'pic:pic',
  blipFill: 'pic:blipFill',
  spPr: 'pic:spPr'
};

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
  name: '@_w:name'
};

export const RAttr = {
  id: '@_r:id',
  embed: '@_r:embed'
};

export const Attr = {
  x: '@_x',
  y: '@_y',
  cx: '@_cx',
  cy: '@_cy'
};
