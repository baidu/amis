import {DataScope} from './DataScope';
import type {JSONSchema} from './DataScope';
import {guid} from './helper';

/**
 * 用来定义数据本身的数据结构，比如有类型是什么，有哪些属性。
 */
export class DataSchema {
  // 指向顶级数据作用域
  readonly root: DataScope;

  readonly idMap: {
    [propName: string]: DataScope;
  } = {};

  // 这个经常变动，游离于整个链中
  current: DataScope;

  constructor(schema: JSONSchema | Array<JSONSchema>) {
    this.root = new DataScope(schema, 'root');
    this.current = this.root;
  }

  addSchema(schema: Partial<JSONSchema>) {
    this.current.addSchema(schema);
    return this;
  }

  removeSchema(id: string) {
    this.current.removeSchema(id);
    return this;
  }

  addScope(schema?: JSONSchema | Array<JSONSchema>, id: string = guid()) {
    if (this.idMap[id]) {
      throw new Error('scope id `' + id + '` already exists');
    }

    this.current = this.current.addChild(id, schema);
    this.idMap[id] = this.current;
    return this;
  }

  removeScope(idOrScope: string | DataScope) {
    const scope = this.getScope(idOrScope);

    if (scope.contains(this.current)) {
      this.current = scope.parent!;
    }

    scope.parent?.removeChild(scope);
    return this;
  }

  hasScope(idOrScope: string | DataScope): idOrScope is string | DataScope {
    const id = typeof idOrScope === 'string' ? idOrScope : idOrScope.id;
    const scope = this.idMap[id];
    return !!scope;
  }

  getScope(idOrScope: string | DataScope) {
    const id = typeof idOrScope === 'string' ? idOrScope : idOrScope.id;
    const scope = this.idMap[id];

    if (!scope) {
      throw new Error('scope not found!');
    } else if (!scope.parent) {
      throw new Error('cannot remove root scope');
    }

    return scope;
  }

  switchToRoot() {
    this.current = this.root;
    return this;
  }

  switchTo(idOrScope: string | DataScope) {
    const scope = this.getScope(idOrScope);
    this.current = scope;
    return this;
  }

  getDataPropsAsOptions() {
    const variables: Array<any> = [];
    let current: DataScope | void = this.current;

    while (current) {
      variables.push(...current.getDataPropsAsOptions());
      current = current.parent;
    }

    return variables;
  }

  getSchemaByPath(path: string) {
    let current: DataScope | void = this.current;

    while (current) {
      const schema = current.getSchemaByPath(path);
      if (schema) {
        return schema;
      }
      current = current.parent;
    }

    return null;
  }
}
