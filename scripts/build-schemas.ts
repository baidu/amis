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
    type: 'PageSchema'
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
        if (!/^#\/definitions\/(.*?)$/.test(item.$ref || '')) {
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

        if (Array.isArray(baseDefinition.anyOf)) {
          // todo
          return item;
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
    new MyIntersectionNodeParser(typeChecker, chainNodeParser)
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
