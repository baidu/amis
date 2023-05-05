import {xsl} from './xsl';
/**
 * 将 officel 的公式 xml 转成 mathml
 */

export function convertOOXML(element: Element) {
  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);
  const fragment = xsltProcessor.transformToFragment(element, document);
  return fragment;
}
