import type {JSONSchema7} from 'json-schema';
import {guid, keyToPath} from './helper';

// 先只支持 JSONSchema draft07 好了
// https://json-schema.org/draft-07/json-schema-release-notes.html
export type JSONSchema = JSONSchema7;

export class DataScope {
  // 指向父级
  parent?: DataScope;
  readonly children: Array<DataScope> = [];

  // 全局不能重复，用来快速定位
  readonly id: string;

  // todo 如果想要跨过层级直接获取某一层的数据域，用这个字段
  ref?: string;

  // scope 的名字，同一个层级不允许重名
  name?: string;

  // scope 分类
  tag?: string;

  // scope 的描述信息
  description?: string;

  readonly schemas: Array<JSONSchema> = [];

  constructor(schemas: JSONSchema | Array<JSONSchema>, id: string) {
    this.schemas.push(...(Array.isArray(schemas) ? schemas : [schemas]));
    this.id = id;
  }

  addChild(id: string, schema?: JSONSchema | Array<JSONSchema>): DataScope {
    const child = new DataScope(
      schema || {
        type: 'object',
        properties: {}
      },
      id
    );

    this.children.push(child);
    child.parent = this;
    return child;
  }

  removeChild(idOrScope: string | DataScope) {
    const idx = this.children.findIndex(item =>
      typeof idOrScope === 'string'
        ? idOrScope === item.id
        : idOrScope === idOrScope
    );

    if (~idx) {
      const scope = this.children[idx];
      delete scope.parent;
      this.children.splice(idx, 1);
    }
  }

  addSchema(schema: JSONSchema) {
    schema = {
      $id: guid(),
      ...schema
    };
    this.schemas.push(schema);
    return this;
  }

  removeSchema(id: string) {
    const idx = this.schemas.findIndex(schema => schema.$id === id);
    if (~idx) {
      this.schemas.splice(idx, 1);
    }
    return this;
  }

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

  protected buildOptions(
    options: Array<any>,
    schema: JSONSchema,
    path: string
  ) {
    if (schema.type === 'object' && schema.properties) {
      const keys = Object.keys(schema.properties);

      keys.forEach(key => {
        const child: any = schema.properties![key];

        const option: any = {
          label: child.title || key,
          value: path + key,
          type: child.type,
          description: child.description
        };

        if (child.type === 'object') {
          option.children = [];
          this.buildOptions(option.children, child, path + key + '.');
        }

        options.push(option);
      });
    }
  }

  getDataPropsAsOptions() {
    const variables: Array<any> = [];

    this.schemas.forEach(schema => {
      this.buildOptions(variables, schema, '');
    });

    return variables;
  }

  getSchemaByPath(path: string) {
    const parts = keyToPath(path);

    for (let schema of this.schemas) {
      const result = parts.reduce((schema: JSONSchema, key: string) => {
        if (schema && schema.type === 'object' && schema.properties) {
          return schema.properties[key] as JSONSchema;
        }

        return null;
      }, schema);

      if (result) {
        return result;
      }
    }
    return null;
  }
}
