/**
 * 解析 _rels/.rels 文件
 */

export interface Relationship {
  id: string;
  type: string;
  target: string;
  targetMode?: string;
  // 最顶级还是属于某个 path
  part: 'root' | 'word';
}

export function parseRelationship(
  element: Element,
  part: 'root' | 'word'
): Relationship {
  const id = element.getAttribute('Id') || '';
  const type = element.getAttribute('Type') || '';
  const target = element.getAttribute('Target') || '';
  const targetMode = element.getAttribute('TargetMode') || '';
  return {
    id,
    type,
    target,
    targetMode,
    part
  };
}

export function parseRelationships(
  element: Document,
  part: 'root' | 'word'
): Record<string, Relationship> {
  const relationships: Record<string, Relationship> = {};

  const relationshipElements = element.getElementsByTagName('Relationship');
  for (const relationshipElement of relationshipElements) {
    const relationship = parseRelationship(relationshipElement, part);
    relationships[relationship.id] = relationship;
  }

  return relationships;
}
