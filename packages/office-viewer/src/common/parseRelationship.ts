/**
 * 解析 relationship 的 xml 文件
 */

import {IRelationship} from '../excel/types/IRelationship';
import {xml2json} from '../util/xml';

export async function parseRelationship(xml: string) {
  const relationships: IRelationship[] = [];
  if (xml) {
    const node = await xml2json(xml);
    for (const child of node.children || []) {
      if (child.tag === 'Relationship') {
        relationships.push({
          id: child.attrs.Id,
          target: child.attrs.Target,
          targetMode: child.attrs.TargetMode,
          type: child.attrs.Type
        });
      }
    }
    return relationships;
  }
  return [];
}
