/**
 * 自动生成类型定义及解析所需数据
 */
import * as fs from 'fs';

import {Type, simplifyUnionOne, generateCodes, parse} from './xsd2Types';

async function main() {
  // 问题比较多所有先不支持
  const types: Type[] = [];
  await parse('./ext/spreadsheetml-2009-9-main.xsd', types);
  fs.writeFileSync('../src/openxml/ExcelExtTypes.ts', generateCodes(types));
}

try {
  main();
} catch (error) {
  console.error(error);
}
