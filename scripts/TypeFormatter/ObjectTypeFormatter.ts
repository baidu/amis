import {
  Definition,
  IntersectionType,
  ObjectType,
  ObjectTypeFormatter as BaseObjectTypeFormatter
} from 'ts-json-schema-generator';

export class ObjectTypeFormatter extends BaseObjectTypeFormatter {
  getDefinition(type: ObjectType): Definition {
    return super.getDefinition(type);
  }
}
