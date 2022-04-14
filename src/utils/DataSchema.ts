import {DataScope} from './DataScope';
import type {JSONSchema} from './DataScope';

/**
 * 用来定义数据本身的数据结构，比如有类型是什么，有哪些属性。
 */
export class DataSchema {
  // 执行顶级数据作用域
  readonly root: DataScope;

  readonly idMap: {
    [propName: string]: DataScope;
  } = {};

  // 这个经常变动，游离于整个链中
  current: DataScope;

  constructor(schema: JSONSchema) {
    this.root = new DataScope(schema, 'root');
    this.current = this.root;
  }

  extendsSchema(schema: Partial<JSONSchema>) {
    this.current.extendsSchema(schema);
    return this;
  }

  addScope(id: string, schema?: JSONSchema) {
    this.current = this.current.addChild(id, schema);
    this.idMap[id] = this.current;
  }

  removeScope(idOrScope: string | DataScope) {
    const id = typeof idOrScope === 'string' ? idOrScope : idOrScope.id;
    const scope = this.idMap[id];

    if (!scope) {
      throw new Error('scope not found!');
    } else if (!scope.parent) {
      throw new Error('cannot remove root scope');
    }

    if (scope.contains(this.current)) {
      this.current = scope.parent!;
    }

    scope.parent?.removeChild(scope);
  }
}
