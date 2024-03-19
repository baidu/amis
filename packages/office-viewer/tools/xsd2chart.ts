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

  // word 的类型和 excel 的类型有冲突，所以只能先支持 excel
  // 另外就是 CT_FontScheme 有冲突
  await parse('./OfficeOpenXML-XMLSchema-Strict/dml-main.xsd', types);
  await parse('./OfficeOpenXML-XMLSchema-Strict/dml-chartDrawing.xsd', types);
  await parse('./OfficeOpenXML-XMLSchema-Strict/dml-chartDrawing.xsd', types);
  await parse('./OfficeOpenXML-XMLSchema-Strict/dml-chart.xsd', types);

  simplifyUnionOne(types);
  fs.writeFileSync('../src/openxml/ChartTypes.ts', generateCodes(types));
}

try {
  main();
} catch (error) {
  console.error(error);
}
