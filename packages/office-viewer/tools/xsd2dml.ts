/**
 * 自动生成类型定义及解析所需数据
 */
import * as fs from 'fs';

import {Type, simplifyUnionOne, generateCodes, parse} from './xsd2Types';

async function main() {
  const types: Type[] = [];
  await parse(
    './OfficeOpenXML-XMLSchema-Strict/shared-commonSimpleTypes.xsd',
    types
  );

  // 进包含 dml 的类型
  await parse('./OfficeOpenXML-XMLSchema-Strict/dml-main.xsd', types);

  simplifyUnionOne(types);
  fs.writeFileSync('../src/openxml/DMLTypes.ts', generateCodes(types));
}

try {
  main();
} catch (error) {
  console.error(error);
}
