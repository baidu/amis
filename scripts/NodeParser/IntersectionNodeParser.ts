import {
  BaseType,
  Context,
  IntersectionNodeParser as BaseIntersectionNodeParser
} from 'ts-json-schema-generator';
import ts from 'typescript';

export class IntersectionNodeParser extends BaseIntersectionNodeParser {
  public createType(
    node: ts.IntersectionTypeNode,
    context: Context
  ): BaseType | undefined {
    console.log('here');
    return super.createType(node, context);
  }
}
