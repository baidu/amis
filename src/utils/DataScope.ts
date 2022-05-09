import type {JSONSchema7} from 'json-schema';
import {guid, keyToPath, mapTree} from './helper';

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
    this.setSchemas(Array.isArray(schemas) ? schemas : [schemas]);
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
      typeof idOrScope === 'string' ? idOrScope === item.id : item === idOrScope
    );

    if (~idx) {
      const scope = this.children[idx];
      delete scope.parent;
      this.children.splice(idx, 1);
    }
  }

  setSchemas(schemas: Array<JSONSchema>) {
    this.schemas.splice(0, this.schemas.length);

    for (let schema of schemas) {
      if (schema.type !== 'object') {
        throw new TypeError('data scope accept only object');
      }
      this.schemas.push({
        $id: guid(),
        ...schema
      });
    }
    return this;
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

  getMergedSchema() {
    const mergedSchema: any = {
      type: 'object',
      properties: {}
    };

    // todo 以后再来细化这一块，先粗略的写个大概
    this.schemas.forEach(schema => {
      const properties: any = schema.properties || {};
      Object.keys(properties).forEach(key => {
        const value = properties[key];
        if (mergedSchema.properties[key]) {
          if (Array.isArray(mergedSchema.properties[key].oneOf)) {
            mergedSchema.properties[key].oneOf.push();
          } else if (
            mergedSchema.properties[key].type &&
            mergedSchema.properties[key].type !== value.type
          ) {
            mergedSchema.properties[key] = {
              oneOf: [mergedSchema.properties[key], value]
            };
          }
        } else {
          mergedSchema.properties[key] = value;
        }
      });
    });

    return mergedSchema;
  }

  protected buildOptions(
    options: Array<any>,
    schema: JSONSchema,
    path: string = '',
    key: string = ''
  ) {
    // todo 支持 oneOf, anyOf
    const option: any = {
      label: schema.title || key,
      value: path,
      type: schema.type,
      description: schema.description
    };

    options.push(option);

    if (schema.type === 'object' && schema.properties) {
      option.children = [];
      const keys = Object.keys(schema.properties);

      keys.forEach(key => {
        const child: any = schema.properties![key];

        this.buildOptions(
          option.children,
          child,
          path + (path ? '.' : '') + key,
          key
        );
      });
    } else if (schema.type === 'array' && schema.items) {
      option.children = [];
      this.buildOptions(
        option.children,
        {
          title: 'Member',
          ...(schema.items as any)
        },
        path + (path ? '.' : '') + 'items',
        'items'
      );
      option.children = mapTree(option.children, item => ({
        ...item,
        disabled: true
      }));
    }
  }

  getDataPropsAsOptions() {
    const variables: Array<any> = [];
    this.buildOptions(variables, this.getMergedSchema());
    return variables[0].children;
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
