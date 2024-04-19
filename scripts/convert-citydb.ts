/**
 * 将 https://lbs.amap.com/api/webservice/download 中的 json 转成 json 格式
 */

import {raw} from 'express';
import process from 'node:process';

import XLSX from 'xlsx';

const file = process.argv[2];

const workbook = XLSX.readFile(file);

const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(worksheet) as Array<{
  中文名: string;
  adcode: string;
}>;

const cityDb: Record<string, string> = {};

for (const row of rawData) {
  cityDb[row.adcode] = row['中文名'];
}

console.log(JSON.stringify(cityDb, null, 2));
