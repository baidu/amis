import {
  Definition,
  IntersectionType,
  IntersectionTypeFormatter as BaseIntersectionTypeFormatter
} from 'ts-json-schema-generator';

export class IntersectionTypeFormatter extends BaseIntersectionTypeFormatter {
  getDefinition(type: any): Definition {
    if (type.types[1]?.name === 'SchemaObject') {
      console.log(type);
      process.exit(1);
    }

    return super.getDefinition(type);
  }
}
