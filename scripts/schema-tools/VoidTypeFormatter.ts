import {BaseType, SubTypeFormatter, Definition} from 'ts-json-schema-generator';

export class VoidType extends BaseType {
  public getId(): string {
    return 'void';
  }
}

export class VoidTypeFormatter implements SubTypeFormatter {
  public supportsType(type: VoidType): boolean {
    return type instanceof VoidType;
  }
  public getDefinition(type: VoidType): Definition {
    return {type: 'null'};
  }
  public getChildren(type: VoidType): BaseType[] {
    return [];
  }
}
