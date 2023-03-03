import {loopChildren} from '../util/xml';

export interface Relationship {
  id: string;
  type: string;
  target: string;
  targetMode?: string;
  // 最顶级还是属于某个 path
  part: 'root' | 'word';
}

export function parseRelationship(
  data: any,
  part: 'root' | 'word'
): Relationship {
  const id = data['@_Id'];
  const type = data['@_Type'];
  const target = data['@_Target'];
  const targetMode = data['@_TargetMode'];
  return {
    id,
    type,
    target,
    targetMode,
    part
  };
}

export function parseRelationships(
  data: any,
  part: 'root' | 'word'
): Record<string, Relationship> {
  const relationships: Record<string, Relationship> = {};
  loopChildren(data, (key, value) => {
    if (key === 'Relationship') {
      const relationship = parseRelationship(value, part);
      relationships[relationship.id] = relationship;
    }
  });

  return relationships;
}
