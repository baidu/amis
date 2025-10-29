/**
 * @file 用来生成 json-schemas
 */

import fs from 'fs';
import path from 'path';
import {
  ObjectTypeFormatter,
  LiteralUnionTypeFormatter,
  IntersectionTypeFormatter,
  IntersectionType,
  SubTypeFormatter,
  TypeFormatter,
  UnionType,
  derefType,
  BaseType,
  ObjectType,
  Definition,
  createFormatter,
  SchemaGenerator,
  createProgram,
  createParser,
  StringType,
  LiteralType,
  Context,
  ArrayType,
  TupleType,
  getAllOfDefinitionReducer,
  Schema,
  uniqueArray,
  ReferenceType,
  IndexedAccessTypeNodeParser,
  ChainNodeParser,
  ExpressionWithTypeArgumentsNodeParser,
  IntersectionNodeParser,
  DefinitionTypeFormatter,
  FunctionType,
  DefinitionType
} from 'ts-json-schema-generator';
import ts, {TypeOperatorNode, TypeReferenceNode} from 'typescript';
import mkdirp from 'mkdirp';
import isPlainObject from 'lodash/isPlainObject';

/**
 * 程序主入口
 *
 * todo 别名 String 对 jsdoc 内容咋没有生成 description？
 */
async function main() {
  const dir = path.join(__dirname, '../packages/amis/src');
  const outDir = path.join(__dirname, '../packages/amis/');
  const tsConfig = path.join(
    __dirname,
    '../packages/amis/tsconfig-for-declaration.json'
  );

  const config = {
    path: path.join(dir, 'SchemaFull.ts'),
    tsconfig: tsConfig,
    type: 'RootRenderer',
    skipTypeCheck: true,
    jsDoc: 'extended' as 'extended',
    additionalProperties: false
  };

  for (let {config: c, target, optimizeForMonaco} of [
    {
      config,
      target: 'schema.json',
      optimizeForMonaco: true
    },
    {
      config: {
        ...config,
        path: path.join(dir, 'SchemaMinimal.ts'),
        additionalProperties: true
      },
      target: 'schema-minimal.json',
      optimizeForMonaco: false
    }
  ]) {
    // 创建 formatter 用于优化体积
    const formatter = createFormatter(
      c as any,
      (fmt, circularReferenceTypeFormatter) => {
        fmt.addTypeFormatter(
          new MyObjectTypeFormatter(
            circularReferenceTypeFormatter,
            optimizeForMonaco
          )
        );
        fmt.addTypeFormatter(new MyLiteralUnionTypeFormatter());
        fmt.addTypeFormatter(
          new MyFunctionTypeFormatter(circularReferenceTypeFormatter)
        );
        fmt.addTypeFormatter(
          new MyIntersectionTypeFormatter(circularReferenceTypeFormatter)
        );
        fmt.addTypeFormatter(
          new MyDefinitionTypeFormatter(circularReferenceTypeFormatter, true)
        );
      }
    );

    const program = createProgram(c as any);
    const parser = createParser(program, c as any, prs => {
      prs.addNodeParser(
        new MyIndexedAccessTypeNodeParser(
          program.getTypeChecker(),
          prs as ChainNodeParser
        )
      );
    });
    const generator = new SchemaGenerator(program, parser, formatter, c);

    let schema = generator.createSchema(c.type);

    if (optimizeForMonaco) {
      convertAnyOfItemToConditionalItem(schema, [
        'AMISSchema',
        'AMISCRUDSchema',
        'AMISCRUD2Schema',
        'AMISLegacyActionSchema',
        'AMISAction'
      ]);
      schema = optimizeConditions(schema);
    }

    const outputFile = path.join(outDir, target);
    mkdirp(path.dirname(outputFile));
    fs.writeFileSync(outputFile, JSON.stringify(schema, null, 2));
  }
}

class MyIndexedAccessTypeNodeParser extends IndexedAccessTypeNodeParser {
  public createType(node: ts.IndexedAccessTypeNode, context: Context) {
    // 支持 Module Augmentation 用法
    if (
      node.indexType.kind === ts.SyntaxKind.TypeOperator &&
      (node.indexType as TypeOperatorNode).operator ===
        ts.SyntaxKind.KeyOfKeyword &&
      (node.indexType as TypeOperatorNode).type.kind ===
        ts.SyntaxKind.TypeReference &&
      node.objectType.kind === (node.indexType as TypeOperatorNode).type.kind &&
      (node.objectType as any).typeName.escapedText ===
        (node.indexType as any).type.typeName.escapedText
    ) {
      // 检测到 xxxxx[keyof xxxxx]
      // 需要查找 xxxxx 的类型定义，并返回一个联合类型
      const target = node.objectType as TypeReferenceNode;
      const symbol = this.typeChecker.getSymbolAtLocation(target.typeName);
      if (symbol) {
        return new UnionType(
          Array.from(symbol.members?.values() || []).map(member =>
            this.childNodeParser.createType(
              (member.valueDeclaration as any).type,
              context
            )
          )
        );
      }
    }

    return super.createType(node, context);
  }
}

class MyObjectTypeFormatter extends ObjectTypeFormatter {
  constructor(
    protected childTypeFormatter: TypeFormatter,
    protected optimizeForMonaco: boolean
  ) {
    super(childTypeFormatter);
  }

  getDefinition(type: ObjectType): Definition {
    const types = type.getBaseTypes();
    if (types.length === 0) {
      return this.getObjectDefinition(type);
    }
    // 体积太大了，只能这样
    const definition: Definition = {
      allOf: [
        this.getObjectDefinition(type),

        ...types.map((t: BaseType) => this.childTypeFormatter.getDefinition(t))
      ]
    };

    const firstType: Definition = definition.allOf![0] as any;

    if (
      this.optimizeForMonaco &&
      firstType.type === 'object' &&
      firstType.additionalProperties === false
    ) {
      definition.allOf = definition.allOf?.map(item => {
        if (typeof item === 'object' && item != null) {
          if (item.$ref) {
            item.additionalProperties = true;
          } else {
            delete item.additionalProperties;
          }
        }

        return item;
      });
      definition.additionalProperties = false;
      definition.properties = types.reduce((result, baseType) => {
        const other = this.childTypeFormatter.getDefinition(
          derefType(baseType)!
        );

        return {
          ...(other.properties
            ? this.getObjectBriefDefinition(other.properties)
            : {}),
          ...result
        };
      }, this.getObjectBriefDefinition(firstType.properties));
      if (firstType.required) {
        definition.required = firstType.required;
      }

      if (
        firstType.properties &&
        definition.required &&
        Object.keys(firstType.properties!).join(',') ===
          definition.required.join(',')
      ) {
        definition.allOf!.shift();
      }
    }

    return definition;
  }

  getObjectBriefDefinition(properties: any): Record<string, any> {
    return Object.keys(properties || {}).reduce((result, key) => {
      const item = properties[key];

      if (isIdentityField(item, key, properties)) {
        result[key] = {
          ...item
        };
        result[key].description;
      } else if (!result[key]) {
        result[key] = true;
      }

      return result;
    }, {} as Record<string, any>);
  }
}

class MyLiteralUnionTypeFormatter extends LiteralUnionTypeFormatter {
  getDefinition(type: UnionType): Definition {
    const types = type.getTypes();

    let definition = super.getDefinition(type);

    // 表单项的 label 格式转换不对，针对这种场景修复
    // label: string | false;
    // 如以上定义会被处理成
    // {type: "boolean", enum: [false]}
    if (
      !definition.anyOf &&
      types.some(
        item =>
          item instanceof StringType && item.getPreserveLiterals() === false
      ) &&
      types.some(item => item instanceof LiteralType && !item.isString())
    ) {
      definition = {
        anyOf: [{type: 'string'}, definition]
      };
    }

    return definition;
  }
}

class MyIntersectionTypeFormatter extends IntersectionTypeFormatter {
  getDefinition(type: IntersectionType): Definition {
    const dependencies: Definition[] = [];
    const nonArrayLikeTypes: BaseType[] = [];

    for (const t of type.getTypes()) {
      // Filter out Array like definitions that cannot be
      // easily mergeable into a single json-schema object
      if (t instanceof ArrayType || t instanceof TupleType) {
        dependencies.push(this.childTypeFormatter.getDefinition(t));
      } else {
        const subDefinition = this.childTypeFormatter.getDefinition(t);
        if (subDefinition.$ref || Array.isArray(subDefinition.anyOf)) {
          dependencies.push(subDefinition);
        } else {
          nonArrayLikeTypes.push(t);
        }
      }
    }

    if (nonArrayLikeTypes.length) {
      // There are non array (mergeable requirements)
      dependencies.push(
        nonArrayLikeTypes.reduce(
          getAllOfDefinitionReducer(this.childTypeFormatter),
          {
            type: 'object',
            additionalProperties: false
          }
        )
      );
    }

    return dependencies.length === 1
      ? dependencies[0]
      : {
          allOf: dependencies.map(item => ({
            ...item,
            additionalProperties: true
          }))
        };
  }
}

class MyFunctionTypeFormatter implements SubTypeFormatter {
  constructor(protected childTypeFormatter: TypeFormatter) {}
  getChildren() {
    return [];
  }
  supportsType(type: BaseType) {
    return type instanceof FunctionType;
  }
  getDefinition(type: FunctionType): Definition {
    return {type: 'string', description: 'function'};
  }
}

class MyDefinitionTypeFormatter extends DefinitionTypeFormatter {
  getDefinition(type: DefinitionType) {
    if (
      type.getName() === 'AMISFunction<function>' ||
      type.getName() === 'AMISFunction'
    ) {
      return {
        type: 'string'
      } as any;
    }

    return super.getDefinition(type);
  }
  getChildren(type: DefinitionType) {
    if (
      type.getName() === 'AMISFunction<function>' ||
      type.getName() === 'AMISFunction'
    ) {
      return [];
    }
    return super.getChildren(type);
  }
}

function isIdentityField(item: any, key: string, host: any) {
  if (item?.const) {
    return true;
  } else if (item?.enum && /^(?:type|mode|actionType)$/i.test(key)) {
    return !!(
      key !== 'mode' ||
      (host.type && ['crud', 'crud2'].includes(host.type.const))
    );
  }
  return false;
}

function convertAnyOfItemToConditionalItem(schema: any, list: Array<string>) {
  list.forEach(key => {
    if (!Array.isArray(schema.definitions[key]?.anyOf)) {
      return;
    }

    const list: Array<any> = schema.definitions[key].anyOf.concat();
    const allOf: Array<any> = [];

    while (list.length) {
      const item: any = list.shift()!;
      if (item.$ref) {
        const src = schema.definitions[item.$ref.replace('#/definitions/', '')];

        if (!src) {
          console.log(`${item.$ref} not found`);
          return;
        }

        if (Array.isArray(src.anyOf)) {
          list.unshift.apply(list, src.anyOf);
          continue;
        }

        const constProps = pickConstProperties(src);

        Object.keys(constProps).length &&
          allOf.push({
            if: {
              properties: constProps,
              required: Object.keys(constProps)
            },
            then: item
          });
      } else {
        const constProps = pickConstProperties(item);
        Object.keys(constProps).length &&
          allOf.push({
            if: {
              properties: constProps,
              required: Object.keys(constProps)
            },
            then: item
          });
      }
    }

    schema.definitions[key] = {
      allOf
    };
  });
}

function pickConstProperties(schema: any): any {
  if (!schema.properties && schema.allOf?.[0]?.properties) {
    return pickConstProperties(schema.allOf[0]);
  }
  const keys = Object.keys(schema.properties || {});
  const filteredProperties: any = {};
  keys.forEach((key: string) => {
    if (isIdentityField(schema.properties[key], key, schema.properties)) {
      filteredProperties[key] = {
        ...schema.properties[key]
      };
      delete filteredProperties[key].description;
    }
  });
  return filteredProperties;
}

// 优化条件逻辑，主要处理 action 与 schemaObject 部分的 if
// 避免 monaco-editor 无法精确定位
function optimizeConditions(schema: any) {
  const amisSchema = schema.definitions.AMISSchema;
  if (amisSchema.allOf) {
    // 将 button 转到 AMISButtonSchema
    amisSchema.allOf = amisSchema.allOf.filter((item: any) => {
      if (
        item.if &&
        item.if.properties &&
        ((item.if.properties.type &&
          Array.isArray(item.if.properties.type.enum) &&
          item.if.properties.type.enum.some((key: string) =>
            ['action', 'button', 'submit', 'reset'].includes(key)
          )) ||
          item.if.properties.actionType)
      ) {
        return false;
      }
      return true;
    });
    amisSchema.allOf.unshift({
      if: {
        properties: {
          type: {enum: ['action', 'button', 'submit', 'reset']}
        },
        required: ['type']
      },
      then: {
        $ref: '#/definitions/AMISButtonSchema'
      }
    });
  }

  // 优化 AMISButtonSchema 的定义
  schema.definitions.AMISButtonSchema = {
    if: {
      required: ['actionType']
    },
    then: {
      $ref: '#/definitions/AMISLegacyActionSchema'
    },
    else: {
      $ref: '#/definitions/AMISButton'
    }
  };

  // 优化 description 定义
  Object.keys(schema.definitions).forEach(key => {
    if (
      schema.definitions[key].description &&
      Array.isArray(schema.definitions[key].allOf) &&
      !(schema.definitions[key].allOf[0] as any).description
    ) {
      (schema.definitions[key].allOf[0] as any).description =
        schema.definitions[key].description;
      delete schema.definitions[key].description;
    }
  });

  // const actionSchema = schema.definitions.AMISAction;
  // const actionSchemaAllOf = actionSchema.allOf;

  // delete actionSchema.allOf;
  // actionSchema.if = {
  //   required: ['actionType']
  // };
  // actionSchema.then = {
  //   allOf: actionSchemaAllOf.map((item: any) => {
  //     delete item.if.properties.type;
  //     item.if.required = item.if.required.filter(
  //       (item: string) => item !== 'type'
  //     );
  //     return item;
  //   })
  // };
  // actionSchema.else = {
  //   $ref: '#/definitions/VanillaAction'
  // };

  // const CRUDSchema = schema.definitions.CRUDSchema;
  // const CRUDSchemaAllOf = CRUDSchema.allOf;
  // delete CRUDSchema.allOf;
  // CRUDSchema.if = {
  //   required: ['mode']
  // };
  // CRUDSchema.then = {
  //   allOf: CRUDSchemaAllOf.map((item: any) => {
  //     delete item.if.properties.type;
  //     item.if.required = item.if.required.filter(
  //       (item: string) => item !== 'type'
  //     );
  //     return item;
  //   })
  // };
  // CRUDSchema.else = {
  //   $ref: '#/definitions/CRUDTableSchema'
  // };

  // const schemaObjectSchema = schema.definitions.SchemaObject;
  // schemaObjectSchema.allOf = schemaObjectSchema.allOf
  //   .filter(
  //     (item: any) => !(item.if.properties.type && item.if.properties.actionType)
  //   )
  //   .map((item: any) => {
  //     Object.keys(item.if.properties || {}).forEach(key => {
  //       delete item.if.properties[key].description;
  //     });
  //     return item;
  //   });
  // schemaObjectSchema.allOf.push({
  //   if: {
  //     properties: {
  //       type: {enum: ['action', 'button', 'submit', 'reset']}
  //     },
  //     required: ['type']
  //   },
  //   then: {
  //     $ref: '#/definitions/ActionSchema'
  //   }
  // });

  // schemaObjectSchema.allOf.push({
  //   if: {
  //     properties: {
  //       type: {const: 'crud'}
  //     },
  //     required: ['type']
  //   },
  //   then: {
  //     $ref: '#/definitions/CRUDSchema'
  //   }
  // });

  // schema.definitions.FormSchema.allOf = schema.definitions.BaseFormSchema.allOf;
  // schema.definitions.VanillaAction.allOf[1].additionalProperties = true;
  // // delete schema.definitions.FormSchemaBase.additionalProperties;
  // // delete schema.definitions.BaseSchemaWithoutType.additionalProperties;
  // // delete schema.definitions.FormSchema.additionalProperties;

  // // 替换 SchemaObject 与 ActionSchema 的定义
  // schema.definitions.SchemaObjectLoose = {
  //   allOf: schema.definitions.SchemaObject.allOf.map((item: any) => {
  //     return {
  //       ...item,
  //       then: {
  //         ...item.then,
  //         additionalProperties: true
  //       }
  //     };
  //   })
  // };

  // schema.definitions.ActionSchemaLoose = {
  //   if: schema.definitions.ActionSchema.if,
  //   then: {
  //     allOf: schema.definitions.ActionSchema.then.allOf.map((item: any) => {
  //       return {
  //         ...item,
  //         then: {
  //           ...item.then,
  //           additionalProperties: true
  //         }
  //       };
  //     })
  //   },
  //   else: schema.definitions.ActionSchema.else
  // };

  // schema = JSONValueMap(schema, item => {
  //   if (
  //     item?.$ref === '#/definitions/SchemaObject' &&
  //     item.additionalProperties === true
  //   ) {
  //     return {
  //       $ref: '#/definitions/SchemaObjectLoose'
  //     };
  //   } else if (
  //     item?.$ref === '#/definitions/ActionSchema' &&
  //     item.additionalProperties === true
  //   ) {
  //     return {
  //       $ref: '#/definitions/ActionSchemaLoose'
  //     };
  //   }

  //   return item;
  // });

  return schema;
}

/**
 * 每层都会执行，返回新的对象，新对象不会递归下去
 * @param json
 * @param mapper
 * @returns
 */
export function JSONValueMap(
  json: any,
  mapper: (
    value: any,
    key: string | number,
    host: Object,
    stack: Array<Object>
  ) => any,
  deepFirst: boolean = false,
  stack: Array<Object> = []
) {
  if (!isPlainObject(json) && !Array.isArray(json)) {
    return json;
  }

  const iterator = (
    origin: any,
    key: number | string,
    host: any,
    stack: Array<any> = []
  ) => {
    if (deepFirst) {
      const value = JSONValueMap(origin, mapper, deepFirst, stack);
      return mapper(value, key, host, stack) ?? value;
    }

    let mapped: any = mapper(origin, key, host, stack) ?? origin;

    // 如果不是深度优先，上层的对象都修改了，就不继续递归进到新返回的对象了
    if (mapped === origin) {
      return JSONValueMap(origin, mapper, deepFirst, stack);
    }
    return mapped;
  };

  if (Array.isArray(json)) {
    let modified = false;
    let arr = json.map((value, index) => {
      let newValue: any = iterator(value, index, json, [json].concat(stack));
      modified = modified || newValue !== value;
      return newValue;
    });
    return modified ? arr : json;
  }

  let modified = false;
  const toUpdate: any = {};
  Object.keys(json).forEach(key => {
    const value: any = json[key];
    let result: any = iterator(value, key, json, [json].concat(stack));
    if (result !== value) {
      modified = true;
      toUpdate[key] = result;
    }
  });

  return modified
    ? {
        ...json,
        ...toUpdate
      }
    : json;
}

main().catch(e => {
  console.error(e);
});
