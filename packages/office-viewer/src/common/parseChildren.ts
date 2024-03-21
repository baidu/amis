import {XMLNode} from '../util/xml';

/**
 * 用于子节点只有一种的情况，调用函数来解析为数组格式
 * @param node 节点
 * @param parse 解析函数
 * @returns 解析结果数组
 */
export function parseChildren(node: XMLNode, parse: (node: XMLNode) => any) {
  const result = [];
  for (const child of node.children || []) {
    result.push(parse(child));
  }
  return result;
}
