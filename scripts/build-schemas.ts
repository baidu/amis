/**
 * @file 用来生成 json-schemas
 */

import fs from 'fs';
import path from 'path';
import {
  ObjectTypeFormatter,
  LiteralUnionTypeFormatter,
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
  Schema,
  uniqueArray
} from 'ts-json-schema-generator';
import mkdirp from 'mkdirp';

/**
 * 程序主入口
 */
async function main() {
  const dir = path.join(__dirname, '../packages/amis/src');
  const outDir = path.join(__dirname, '../packages/amis/');
  const tsConfig = path.join(
    __dirname,
    '../packages/amis/tsconfig-for-declaration.json'
  );

  const config = {
    path: path.join(dir, 'Schema.ts'),
    tsconfig: tsConfig,
    type: 'RootSchema',
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
        additionalProperties: true
      },
      target: 'schema-minimal.json'
    }
  ]) {
    // We configure the formatter an add our custom formatter to it.
    const formatter = createFormatter(
      config as any,
      (fmt, circularReferenceTypeFormatter) => {
        // If your formatter DOES support children, you'll need this reference too:
        fmt.addTypeFormatter(
          new MyNodeTypeFormatter(circularReferenceTypeFormatter)
        );
        fmt.addTypeFormatter(new MyLiteralUnionTypeFormatter());
      }
    );

    const program = createProgram(c as any);
    const parser = createParser(program, c as any);
    const generator = new SchemaGenerator(program, parser, formatter, c);

    const schema = generator.createSchema(c.type);

    if (optimizeForMonaco) {
      convertAnyOfItemToConditionalItem(schema, [
        'SchemaObject',
        'ActionSchema'
      ]);
      optimizeConditions(schema);
    }

    const outputFile = path.join(outDir, target);
    mkdirp(path.dirname(outputFile));
    fs.writeFileSync(outputFile, JSON.stringify(schema, null, 2));
  }
}

class MyNodeTypeFormatter extends ObjectTypeFormatter {
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

      if (item?.const || (item?.enum && /^(?:type|actionType)$/i.test(key))) {
        result[key] = {
          ...item
        };
        delete result[key].description;
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
    if (
      schema.properties[key]?.const ||
      (schema.properties[key]?.enum && /^(?:type|actionType)$/i.test(key))
    ) {
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
  const actionSchema = schema.definitions.ActionSchema;
  const actionSchemaAllOf = actionSchema.allOf;

  delete actionSchema.allOf;
  actionSchema.if = {
    required: ['actionType']
  };
  actionSchema.then = {
    allOf: actionSchemaAllOf.map((item: any) => {
      delete item.if.properties.type;
      item.if.required = item.if.required.filter(
        (item: string) => item !== 'type'
      );
      return item;
    })
  };
  actionSchema.else = {
    $ref: '#/definitions/VanillaAction'
  };

  const schemaObjectSchema = schema.definitions.SchemaObject;
  schemaObjectSchema.allOf = schemaObjectSchema.allOf
    .filter(
      (item: any) => !(item.if.properties.type && item.if.properties.actionType)
    )
    .map((item: any) => {
      Object.keys(item.if.properties || {}).forEach(key => {
        delete item.if.properties[key].description;
      });
      return item;
    });
  schemaObjectSchema.allOf.push({
    if: {
      properties: {
        type: {const: ['action', 'button', 'submit', 'reset']}
      },
      required: ['type']
    },
    then: {
      $ref: '#/definitions/ActionSchema'
    }
  });

  schema.definitions.FormSchema.allOf = schema.definitions.BaseFormSchema.allOf;
  // delete schema.definitions.FormSchemaBase.additionalProperties;
  // delete schema.definitions.BaseSchemaWithoutType.additionalProperties;
  // delete schema.definitions.FormSchema.additionalProperties;
}

main().catch(e => {
  console.error(e);
});
