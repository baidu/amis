import {
  SubTypeFormatter,
  TypeFormatter,
  Definition,
  BaseType,
  ArrayType
} from 'ts-json-schema-generator';

export class RestType extends BaseType {
  public constructor(private item: ArrayType) {
    super();
  }

  public getId(): string {
    return '...' + this.item.getId();
  }

  public getType(): ArrayType {
    return this.item;
  }
}

export class RestTypeFormatter implements SubTypeFormatter {
  public constructor(private childTypeFormatter: TypeFormatter) {}

  public supportsType(type: RestType): boolean {
    return type instanceof RestType;
  }
  public getDefinition(type: RestType): Definition {
    return this.childTypeFormatter.getDefinition(type.getType());
  }
  public getChildren(type: RestType): BaseType[] {
    return this.childTypeFormatter.getChildren(type.getType());
  }
}
