import {XMLData, Attr, loopChildren} from '../OpenXML';

export interface Relationship {
  id: string;
  type: string;
  target: string;
  targetMode?: string;
  // 最顶级还是属于某个 path
  part: 'root' | 'word';
}

export function parseRelationship(
  data: XMLData,
  part: 'root' | 'word'
): Relationship {
  const id = data[Attr.Id] as string;
  const type = data[Attr.Type] as string;
  const target = data[Attr.Target] as string;
  const targetMode = data[Attr.TargetMode] as string;
  return {
    id,
    type,
    target,
    targetMode,
    part
  };
}

export function parseRelationships(
  data: XMLData,
  part: 'root' | 'word'
): Record<string, Relationship> {
  const relationships: Record<string, Relationship> = {};
  loopChildren(data, (key, value) => {
    if (key === 'Relationship') {
      const relationship = parseRelationship(value as XMLData, part);
      relationships[relationship.id] = relationship;
    }
  });

  return relationships;
}
