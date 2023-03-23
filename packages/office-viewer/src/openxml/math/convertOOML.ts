import {xsl} from './xsl';
/**
 * 将 officel 的公式 xml 转成 mathml
 */

const xsltProcessor = new XSLTProcessor();
xsltProcessor.importStylesheet(xsl);

export function convertOOXML(element: Element) {
  const fragment = xsltProcessor.transformToFragment(element, document);
  return fragment;
}
