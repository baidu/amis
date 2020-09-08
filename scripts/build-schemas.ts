/**
 * @file 用来生成 json-schemas
 */

import fs = require('fs');
import path = require('path');
import tsj = require('ts-json-schema-generator');
import mkdirp = require('mkdirp');
import {
  ChainTypeFormatter,
  CircularReferenceTypeFormatter,
  AnnotatedTypeFormatter,
  StringTypeFormatter,
  NumberTypeFormatter,
  BooleanTypeFormatter,
  NullTypeFormatter,
  AnyTypeFormatter,
  UndefinedTypeFormatter,
  UnknownTypeFormatter,
  LiteralTypeFormatter,
  EnumTypeFormatter,
  ReferenceTypeFormatter,
  Config,
  DefinitionTypeFormatter,
  ObjectTypeFormatter,
  AliasTypeFormatter,
  PrimitiveUnionTypeFormatter,
  LiteralUnionTypeFormatter,
  ArrayTypeFormatter,
  TupleTypeFormatter,
  IntersectionTypeFormatter
} from 'ts-json-schema-generator';
import {OptionalTypeFormatter} from './schema-tools/OptionalTypeFormatter';
import {VoidTypeFormatter} from './schema-tools/VoidTypeFormatter';
import {RestTypeFormatter} from './schema-tools/RestTypeFormatter';
import {UnionTypeFormatter} from './schema-tools/UnionTypeFormatter';

function createFormatter(config: Config) {
  const chainTypeFormatter = new ChainTypeFormatter([]);
  const circularReferenceTypeFormatter = new CircularReferenceTypeFormatter(
    chainTypeFormatter
  );

  chainTypeFormatter
    .addTypeFormatter(
      new AnnotatedTypeFormatter(circularReferenceTypeFormatter)
    )

    .addTypeFormatter(new StringTypeFormatter())
    .addTypeFormatter(new NumberTypeFormatter())
    .addTypeFormatter(new BooleanTypeFormatter())
    .addTypeFormatter(new NullTypeFormatter())

    .addTypeFormatter(new AnyTypeFormatter())
    .addTypeFormatter(new UndefinedTypeFormatter())
    .addTypeFormatter(new UnknownTypeFormatter())
    .addTypeFormatter(new VoidTypeFormatter())

    .addTypeFormatter(new LiteralTypeFormatter())
    .addTypeFormatter(new EnumTypeFormatter())

    .addTypeFormatter(
      new ReferenceTypeFormatter(
        circularReferenceTypeFormatter,
        config.encodeRefs ?? true
      )
    )
    .addTypeFormatter(
      new DefinitionTypeFormatter(
        circularReferenceTypeFormatter,
        config.encodeRefs ?? true
      )
    )
    .addTypeFormatter(new ObjectTypeFormatter(circularReferenceTypeFormatter))
    .addTypeFormatter(new AliasTypeFormatter(circularReferenceTypeFormatter))

    .addTypeFormatter(new PrimitiveUnionTypeFormatter())
    .addTypeFormatter(new LiteralUnionTypeFormatter())

    .addTypeFormatter(new OptionalTypeFormatter(circularReferenceTypeFormatter))
    .addTypeFormatter(new RestTypeFormatter(circularReferenceTypeFormatter))

    .addTypeFormatter(new ArrayTypeFormatter(circularReferenceTypeFormatter))
    .addTypeFormatter(new TupleTypeFormatter(circularReferenceTypeFormatter))
    .addTypeFormatter(new UnionTypeFormatter(circularReferenceTypeFormatter))
    .addTypeFormatter(
      new IntersectionTypeFormatter(circularReferenceTypeFormatter)
    );

  return circularReferenceTypeFormatter;
}

/**
 * 程序主入口
 */
async function main() {
  const dir = path.join(__dirname, '../src/schemas');
  const outDir = path.join(__dirname, '../');
  const tsConfig = path.join(__dirname, '../tsconfig.json');

  const config = {
    path: path.join(dir, 'index.ts'),
    tsconfig: tsConfig,
    type: 'PageSchema'
  };

  const program = tsj.createProgram(config);
  const parser = tsj.createParser(program, config);
  const formatter = createFormatter(config);

  const generator = new tsj.SchemaGenerator(program, parser, formatter, config);
  const schema = generator.createSchema(config.type);

  const outputFile = path.join(outDir, 'schema.json');
  mkdirp(path.dirname(outputFile));
  fs.writeFileSync(outputFile, JSON.stringify(schema, null, 2));
}

main().catch(e => console.error(e));
