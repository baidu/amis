/**
 * 批量测试某个目录下的 xlsx 文件是否渲染报错
 */

import puppeteer, {ElementHandle} from 'puppeteer';
import {getFiles} from './getFiles';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:5173/examples/excel.html');

  const dir = process.argv[2];

  const uploadFile = (await page.$(
    '#uploadFile'
  )!) as ElementHandle<HTMLInputElement>;

  for await (const file of getFiles(dir)) {
    if (file.endsWith('.xlsx') && !file.includes('~$')) {
      uploadFile?.uploadFile(file);
      console.log(file);
      await page.waitForSelector('.ov-excel-content', {
        timeout: 2000
      });
    }
  }

  await browser.close();
})();
