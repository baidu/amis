import {Attributes} from '../openxml/Attributes';

import {XMLNode} from '../util/xml';
import {autoParse} from './autoParse';

/**
 * 解析子节点的属性
 */
export function parseChildrenAttributes(
  node: XMLNode | null,
  attributes: Attributes,
  fillDefault = false
) {
  const result: any = [];
  for (const child of node?.children || []) {
    result.push(autoParse(child, attributes, fillDefault));
  }
  return result;
}
