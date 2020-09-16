import {
  BaseType,
  Context,
  IntersectionNodeParser as BaseIntersectionNodeParser,
  IntersectionType,
  NodeParser,
  ReferenceType
} from 'ts-json-schema-generator';
import ts from 'typescript';

export class IntersectionNodeParser extends BaseIntersectionNodeParser {
  protected readonly childParser: NodeParser;

  public constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser) {
    super(typeChecker, childNodeParser);
    this.childParser = childNodeParser;
  }

  public createType(
    node: ts.IntersectionTypeNode,
    context: Context
  ): BaseType | undefined {
    // 这两个只能用 allOf 来了，提取不了。
    const shouldBeReference = (type: any) =>
      ['SchemaObject', 'FormControlSchema'].includes(
        type.typeName?.escapedText
      );
    const matched = node.types.some(shouldBeReference);

    // 跟 SchemaObject and 一般都有问题，改成 allOf 不要支持 additional props false 了
    if (matched) {
      const types: BaseType[] = node.types
        .map(type => this.childParser.createType(type, context)!)
        .filter(item => item);

      return new IntersectionType(types);
    }

    return super.createType(node, context);
  }
}
