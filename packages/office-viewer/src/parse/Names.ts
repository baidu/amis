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
  tbl: 'w:tbl'
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
  styleId: '@_w:styleId'
};
