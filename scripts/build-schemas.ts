/**
 * @file 用来生成 json-schemas
 */

import fs = require('fs');
import path = require('path');
import tsj = require('ts-json-schema-generator');
import mkdirp = require('mkdirp');
import {
  DiagnosticError,
  IntersectionTypeFormatter,
  ObjectTypeFormatter,
  SubTypeFormatter,
  UnknownNodeError,
  UnknownTypeError,
  IntersectionNodeParser,
  SubNodeParser,
  Schema,
  uniqueArray
} from 'ts-json-schema-generator';
import {IntersectionTypeFormatter as MyIntersectionTypeFormatter} from './TypeFormatter/IntersectionTypeFormatter';
import {IntersectionNodeParser as MyIntersectionNodeParser} from './NodeParser/IntersectionNodeParser';

/**
 * 程序主入口
 */
async function main() {
  const dir = path.join(__dirname, '../src');
  const outDir = path.join(__dirname, '../');
  const tsConfig = path.join(__dirname, '../tsconfig.json');

  const config = {
    path: path.join(dir, 'Schema.ts'),
    tsconfig: tsConfig,
    type: 'RootSchema'
  };

  const generator = tsj.createGenerator(config);
  hackIt(generator);
  const schema = generator.createSchema(config.type);

  fixSchema(schema);

  const outputFile = path.join(outDir, 'schema.json');
  mkdirp(path.dirname(outputFile));
  fs.writeFileSync(outputFile, JSON.stringify(schema, null, 2));
}

function fixSchema(schema: Schema) {
  const keys = Object.keys(schema.definitions!);
  const list: Array<{
    patternProperties: any;
    referenceKey: string;
    definationKey: string;
  }> = [];

  keys.forEach(definationKey => {
    const definition: any = schema.definitions![definationKey];

    if (
      Array.isArray(definition.allOf) &&
      definition.allOf.length &&
      definition.allOf[0].patternProperties &&
      /^#\/definitions\/(.*?)$/.test(definition.allOf[0].$ref || '')
    ) {
      const referenceKey = RegExp.$1;

      if (schema.definitions![referenceKey]) {
        list.push({
          patternProperties: definition.allOf[0].patternProperties,
          referenceKey,
          definationKey
        });
        definition.allOf[0].$ref =
          '#/definitions/' + referenceKey + definationKey;
      }
    }
  });

  copyAnyOf(schema, list);

  convertAnyOfItemToConditionalItem(schema, ['SchemaObject', 'ActionSchema']);

  schema.definitions!['UnkownSchema'] = {
    type: 'object',
    description: '不能识别渲染器类型，无法提供提示信息。'
  };
}

function copyAnyOf(
  schema: Schema,
  list: Array<{
    patternProperties: any;
    referenceKey: string;
    definationKey: string;
  }>
) {
  list.forEach(({referenceKey, definationKey, patternProperties}) => {
    const definition: any = schema.definitions![referenceKey];

    if (Array.isArray(definition.anyOf)) {
      const anyOf = definition.anyOf.map((item: any) => {
        if (item.properties) {
          const keys = Object.keys(patternProperties)[0];
          const extenedPatternProperties = {
            [`^(${uniqueArray(
              Object.keys(item.properties).concat(
                keys.substring(2, keys.length - 2).split('|')
              )
            ).join('|')})$`]: {}
          };

          return {
            ...item,
            additionalProperties: false,
            patternProperties: extenedPatternProperties
          };
        } else if (!/^#\/definitions\/(.*?)$/.test(item.$ref || '')) {
          return item;
        }
        const baseKey = RegExp.$1;
        if (!baseKey || !schema.definitions![baseKey]) {
          return item;
        }
        const baseDefinition: any = schema.definitions![baseKey]!;

        if (!baseDefinition) {
          return item;
        }

        if (
          Array.isArray(baseDefinition.anyOf) &&
          baseDefinition.anyOf.length
        ) {
          if (baseKey === 'ButtonControlSchema') {
            copyAnyOf(schema, [
              {
                referenceKey: baseKey,
                definationKey,
                patternProperties
              }
            ]);

            return {
              $ref: '#/definitions/' + baseKey + definationKey
            };
          } else {
            return item;
          }
        } else if (!baseDefinition.properties) {
          return item;
        }

        const keys = Object.keys(patternProperties)[0];
        const extenedPatternProperties = {
          [`^(${uniqueArray(
            Object.keys(baseDefinition.properties).concat(
              keys.substring(2, keys.length - 2).split('|')
            )
          ).join('|')})$`]: {}
        };

        return {
          ...item,
          additionalProperties: false,
          patternProperties: extenedPatternProperties
        };
      });

      schema.definitions![`${referenceKey}${definationKey}`] = {
        anyOf: anyOf
      };
    }
  });
}

function hackIt(generator: any) {
  const circularReferenceTypeFormatter = generator.typeFormatter;
  const typeFormatters =
    circularReferenceTypeFormatter.childTypeFormatter.typeFormatters;

  replaceTypeFormatter(
    typeFormatters,
    IntersectionTypeFormatter,
    new MyIntersectionTypeFormatter(circularReferenceTypeFormatter)
  );

  const chainNodeParser = generator.nodeParser.childNodeParser;
  const typeChecker = generator.program.getTypeChecker();

  replaceNodeParser(
    chainNodeParser.nodeParsers,
    IntersectionNodeParser,
    new MyIntersectionNodeParser(typeChecker as any, chainNodeParser) as any
  );
}

function replaceTypeFormatter(
  typeFormatters: Array<SubTypeFormatter>,
  Klass: any,
  replaceWith: SubTypeFormatter
) {
  const idx = typeFormatters.findIndex(item => item instanceof Klass);

  if (~idx) {
    typeFormatters.splice(idx, 1, replaceWith);
  }
}

function replaceNodeParser(
  nodeParsers: Array<SubNodeParser>,
  Klass: any,
  replaceWith: SubNodeParser
) {
  const idx = nodeParsers.findIndex(item => item instanceof Klass);

  if (~idx) {
    nodeParsers.splice(idx, 1, replaceWith);
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

        allOf.push({
          if: {
            properties: pickConstProperties(src)
          },
          then: item
        });
      } else {
        allOf.push({
          if: {
            properties: pickConstProperties(item)
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

function pickConstProperties(schema: any) {
  const keys = Object.keys(schema.properties);
  const filtedProperties: any = {};
  keys.forEach((key: string) => {
    if (
      schema.properties[key]?.const ||
      (schema.properties[key]?.enum && /type|mode/i.test(key))
    ) {
      filtedProperties[key] = schema.properties[key];
    }
  });
  return filtedProperties;
}

main().catch(e => {
  if (e instanceof DiagnosticError) {
    console.log('Ts 错误\n');

    e.getDiagnostics().forEach(diagnostic => {
      const poistion = diagnostic.file!.getLineAndCharacterOfPosition(
        diagnostic.start!
      );

      console.log(
        `\x1b[36m${diagnostic.file!.fileName}:${poistion.line + 1}:${
          poistion.character + 1
        }\x1b[0m - \x1b[31merror\x1b[0m\n`
      );
      console.log(diagnostic.messageText);
      console.log('\n');
    });
  } else if (e instanceof UnknownNodeError) {
    let node = e.getNode();

    const sourceFile = node.getSourceFile();
    const position = sourceFile.getLineAndCharacterOfPosition(node.pos);
    console.log(
      `\x1b[36m${sourceFile.fileName}:${position.line + 1}:${
        position.character + 1
      }\x1b[0m - \x1b[31m类型不支持转 JSON Schema\x1b[0m\n`
    );
  } else if (e instanceof UnknownTypeError) {
    console.log(`类型不支持`, e);
  } else {
    console.error(e);
  }
});
