import {joinPath} from '../../../../util/joinPath';
import {IRelationship} from '../../../types/IRelationship';

export function getRelationPath(
  drawingPath: string,
  relationships: IRelationship[],
  rId: string
) {
  const relationship = relationships.find(
    relationship => relationship.id === rId
  );
  if (relationship) {
    return joinPath(drawingPath, '..', relationship.target);
  }
  return null;
}
