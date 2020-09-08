import {
  SubTypeFormatter,
  TypeFormatter,
  BaseType,
  Definition
} from 'ts-json-schema-generator';

export class OptionalType extends BaseType {
  public constructor(private item: BaseType) {
    super();
  }

  public getId(): string {
    return this.item.getId() + '?';
  }

  public getType(): BaseType {
    return this.item;
  }
}

export class OptionalTypeFormatter implements SubTypeFormatter {
  public constructor(private childTypeFormatter: TypeFormatter) {}

  public supportsType(type: OptionalType): boolean {
    return type instanceof OptionalType;
  }
  public getDefinition(type: OptionalType): Definition {
    return this.childTypeFormatter.getDefinition(type.getType());
  }
  public getChildren(type: OptionalType): BaseType[] {
    return this.childTypeFormatter.getChildren(type.getType());
  }
}
