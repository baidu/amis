/**
 * 优化 xlsx 文件，将 xml 解析为 json
 * 实测发现 JSON.parser 更慢，所以这个功能废弃了
 */

import * as fs from 'fs';

import ZipPackageParser from '../src/package/ZipPackageParser';

import {parseSheetData} from '../src/excel/io/excel/worksheet/parseSheetData';
import {parseSharedStrings} from '../src/excel/io/excel/parseSharedStrings';
import {getNodeByTagName, xml2json} from '../src/util/xml';
import {StringItem} from '../src/excel/types/StringItem';

const xlsxFile = process.argv[2];

const zip = new ZipPackageParser();
zip.load(fs.readFileSync(xlsxFile, null));

async function opt() {
  let sharedStrings: StringItem[] = [];
  const zipFiles = zip.getZip();
  for (const file in zipFiles) {
    if (file.endsWith('sharedStrings.xml')) {
      const xml = zip.getString(file);
      sharedStrings = await parseSharedStrings(xml);
      zip.saveFile(file + '.json', JSON.stringify(sharedStrings));
    }
  }

  for (const file in zipFiles) {
    if (file.search(/worksheets\/sheet\d*.xml/) !== -1) {
      const xml = zip.getString(file);
      const node = await xml2json(xml);
      const sheetDataNode = getNodeByTagName(node, 'sheetData')!;
      const sheetData = parseSheetData(sheetDataNode, sharedStrings);
      zip.saveFile(file + '.json', JSON.stringify(sheetData));
    }
  }

  const zipContent = zip.generateZip();

  fs.writeFileSync(xlsxFile.replace('.xlsx', '.opt.xlsx'), zipContent);
}

opt();
