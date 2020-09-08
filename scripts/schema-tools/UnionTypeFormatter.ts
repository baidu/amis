import {
  UnionTypeFormatter as BaseUnionTypeFormatter,
  UnionType,
  Definition,
  TypeFormatter
} from 'ts-json-schema-generator';

export class UnionTypeFormatter extends BaseUnionTypeFormatter {
  public constructor(protected _childTypeFormatter: TypeFormatter) {
    super(_childTypeFormatter);
  }

  getDefinition(type: UnionType): Definition {
    // toDo
    // 目前这块生成的 anyOf
    // 既然 json-schema-draft-07 已经支持 if else 了，改成那样应该更加精准。
    return super.getDefinition(type);
  }
}
