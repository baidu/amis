import {JSONSchema} from '../types';
import {guid, keyToPath, mapTree} from './helper';

export const DATASCHEMA_TYPE_MAP: {[type: string]: string} = {
  boolean: '布尔',
  integer: '整数',
  number: '数字',
  string: '文本',
  array: '数组',
  object: '对象'
};

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

  // scope 分组（不同scope）
  group?: string;

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

  assignSchema(target: any, schema: any): any {
    // key相同，type也相同
    if (target.type && target.type === schema.type) {
      if (target.type === 'array') {
        // 先只考虑items，不考虑contains
        if (target.items) {
          if (Array.isArray(target.items)) {
            if (schema.items) {
              if (Array.isArray(schema.items)) {
                // 如果都是数组，就后者覆盖前者
                return schema.items;
              } else {
                // 否则，追加
                return {
                  ...target,
                  items: [...target.items, schema.items]
                };
              }
            } else {
              return {
                ...target,
                ...schema
              };
            }
          } else {
            // 非数组，则merge
            return {
              ...target,
              items: this.assignSchema(target.items, schema.items)
            };
          }
        } else {
          return schema;
        }
      } else if (target.type === 'object' && target.properties) {
        let properties: any = {};

        // 合并属性
        for (let key of Array.from(
          new Set([
            ...Object.keys(target.properties),
            ...Object.keys(schema.properties)
          ])
        )) {
          const value = target.properties[key];
          if (value) {
            properties[key] = schema.properties[key]
              ? this.assignSchema(value, schema.properties[key])
              : value;
          } else {
            properties[key] = schema.properties[key];
          }
        }
        return {
          ...target,
          properties
        };
      } else {
        return schema;
      }
    } else {
      // key相同、type不同
      if (Array.isArray(target.oneOf)) {
        return {
          ...target, // 先做个显示过度，因formula还没支持oneOf
          oneOf: [...target.oneOf, schema]
        };
      } else {
        return {
          ...target, // 先做个显示过度，因formula还没支持oneOf
          oneOf: [target, schema]
        };
      }
    }
  }

  getMergedSchema() {
    const mergedSchema: any = {
      type: 'object',
      properties: {}
    };

    this.schemas.forEach(schema => {
      const properties: any = schema.properties || {};
      Object.keys(properties).forEach(key => {
        const value = properties[key];
        if (mergedSchema.properties[key]) {
          mergedSchema.properties[key] = this.assignSchema(
            mergedSchema.properties[key],
            value
          );
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
    path: {label: string; value: string} = {label: '', value: ''},
    key: string = '',
    isMember?: boolean // 是否是数组成员
  ) {
    // todo 支持 oneOf, anyOf
    let option: any = {
      label: schema.title || key,
      value: schema.title === '成员' ? '' : path.value,
      path: schema.title === '成员' ? '' : path.label,
      type: schema.type,
      rawType: schema.rawType,
      tag:
        schema.typeLabel ??
        DATASCHEMA_TYPE_MAP[schema.type as string] ??
        schema.type,
      description: schema.description,
      isMember,
      disabled: schema.title === '成员'
    };

    // 处理option分组
    if (schema.group) {
      const index = options.findIndex(item => item.label === schema.group);
      if (~index) {
        options[index].children.push(option);
      } else {
        options.push({
          label: schema.group,
          value: '',
          children: [option]
        });
      }
    } else {
      options.push(option);
    }

    if (schema.type === 'object' && schema.properties) {
      option.children = [];
      const keys = Object.keys(schema.properties);

      keys.forEach(key => {
        const child: any = schema.properties![key];
        this.buildOptions(
          option.children,
          child,
          {
            label: path.label + (path.label ? '.' : '') + (child.title ?? key),
            value: path.value + (path.value ? '.' : '') + key
          },
          key,
          schema.title === '成员'
        );
      });
    } else if (schema.type === 'array' && (schema.items as any)?.properties) {
      option.children = [];

      this.buildOptions(
        option.children,
        {
          title: '成员',
          ...(schema.items as any),
          disabled: true
        },
        {
          label: path.label,
          value: path.value
        },
        'items',
        schema.title === '成员'
      );

      option.children = mapTree(option.children, item => ({
        ...item
        // disabled: true
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

  getSchemaById(id: string) {
    return this.schemas?.find(item => item.$id === id);
  }
}
