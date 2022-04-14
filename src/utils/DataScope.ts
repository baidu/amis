import type {JSONSchema7} from 'json-schema';

// 先只支持 JSONSchema draft07 好了
// https://json-schema.org/draft-07/json-schema-release-notes.html
export type JSONSchema = JSONSchema7;

export class DataScope {
  // 指向父级
  parent?: DataScope;
  readonly children: Array<DataScope> = [];

  // 全局不能重复，用来快速定位
  readonly id: string;

  // scope 的名字，同一个层级不允许重名
  name?: string;

  // scope 分类
  tag?: string;

  // scope 的描述信息
  description?: string;

  constructor(protected schema: JSONSchema, id: string) {
    this.id = id;
  }

  addChild(id: string, schema?: JSONSchema): DataScope {}

  removeChild(idOrScope: string | DataScope) {}

  extendsSchema(schema: Partial<JSONSchema>) {}

  contains(scope: DataScope) {
    let from: DataScope | undefined = scope;
    while (from) {
      if (this === from) {
        return true;
      }
      from = from.parent;
    }
    return false;
  }
}
