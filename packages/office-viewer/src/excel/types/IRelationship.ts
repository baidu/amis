/**
 * Relationship 的定义
 */

export interface IRelationship {
  id: string;
  type: string;
  target: string;
  targetMode?: string;
  targetOrigin?: string;
}
