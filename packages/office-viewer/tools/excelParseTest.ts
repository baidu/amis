/**
 * 测试 Excel 解析是否正常
 */
import jsdom from 'jsdom';
const {JSDOM} = jsdom;
const {DOMParser, document, Blob, URL} = new JSDOM(``).window;
global.DOMParser = DOMParser;
global.document = document;
global.Blob = Blob;
global.URL = URL;

import {readFileSync} from 'fs';
import {createOfficeViewer} from '../src';
import {getFiles} from './getFiles';

const dir = process.argv[2];

(async () => {
  for await (const file of getFiles(dir)) {
    if (file.endsWith('.xlsx') && !file.includes('~$')) {
      console.log(file);
      const data = readFileSync(file);
      const excel = await createOfficeViewer(data as any, {}, file);
    }
  }
})();
