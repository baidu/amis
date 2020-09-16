import {
  BaseType,
  Definition,
  IntersectionType,
  IntersectionTypeFormatter as BaseIntersectionTypeFormatter,
  ReferenceType,
  TypeFormatter
} from 'ts-json-schema-generator';
import {getAllOfDefinitionReducer} from 'ts-json-schema-generator/dist/src/Utils/allOfDefinition';

export class IntersectionTypeFormatter extends BaseIntersectionTypeFormatter {
  protected readonly childFormatter: TypeFormatter;
  public constructor(childTypeFormatter: TypeFormatter) {
    super(childTypeFormatter);
    this.childFormatter = childTypeFormatter;
  }

  getDefinition(type: any): Definition {
    const hasReferenceType = type.types.some(
      (t: BaseType) => t instanceof ReferenceType
    );

    if (hasReferenceType) {
      const references: Array<any> = [];
      const rest: Array<any> = [];

      type.types.forEach((t: any) => {
        if (t instanceof ReferenceType) {
          references.push(t);
        } else {
          rest.push(t);
        }
      });

      return {
        allOf: references
          .map((type: any) => this.childFormatter.getDefinition(type))
          .concat(
            rest.reduce(getAllOfDefinitionReducer(this.childFormatter), {
              type: 'object',
              additionalProperties: true // 这里只能是 true 了
            } as Definition)
          )
          .filter((item: any) => item)
      } as any;
    }

    return super.getDefinition(type);
  }
}
