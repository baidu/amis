/**
 * @file 用来生成 json-schemas
 */

import fs = require('fs');
import path = require('path');
import tsj = require('ts-json-schema-generator');
import mkdirp = require('mkdirp');
import {DiagnosticError} from 'ts-json-schema-generator';

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
  const schema = generator.createSchema(config.type);

  const outputFile = path.join(outDir, 'schema.json');
  mkdirp(path.dirname(outputFile));
  fs.writeFileSync(outputFile, JSON.stringify(schema, null, 2));
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
    return;
  }

  console.error(e);
});
