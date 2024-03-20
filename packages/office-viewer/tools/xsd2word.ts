/**
 * 自动生成类型定义及解析所需数据
 */
import * as fs from 'fs';
import {Type, generateCodes, parse, simplifyUnionOne} from './xsd2Types';

async function main() {
  const types: Type[] = [];
  await parse(
    './OfficeOpenXML-XMLSchema-Strict/shared-commonSimpleTypes.xsd',
    types
  );

  // word 的类型和 excel 的类型有冲突
  await parse('./OfficeOpenXML-XMLSchema-Strict/dml-main.xsd', types);
  await parse('./OfficeOpenXML-XMLSchema-Strict/wml.xsd', types);
  types.push(
    ...(await parse(
      './OfficeOpenXML-XMLSchema-Strict/dml-wordprocessingDrawing.xsd'
    ))
  );

  simplifyUnionOne(types);
  fs.writeFileSync('../src/openxml/Types.ts', generateCodes(types, false));
}

try {
  main();
} catch (error) {
  console.error(error);
}
