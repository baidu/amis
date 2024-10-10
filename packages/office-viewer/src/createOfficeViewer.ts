/**
 * 统一对外接口，自动识别文件类型后渲染
 */

import Excel from './Excel';
import {RenderOptions} from './RenderOptions';
import UnSupport from './UnSupport';
import Word from './Word';
import {parseContentType} from './openxml/ContentType';
import {PackageParser} from './package/PackageParser';
import ZipPackageParser from './package/ZipPackageParser';
import {fileTypeFromArrayBuffer, fileTypeFromBuffer} from './util/fileType';

/**
 * 创建 OfficeViewer 实例的工厂函数，会自动识别文件类型
 * @param docFile 文件内容，可以是 ArrayBuffer 或者 url 地址
 * @param renderOptions 渲染配置项，根据不同的文件类型，配置项不同
 * @param parser 文件解析器，支持 zip 和 xml 两种，也可以扩展
 * @returns OfficeViewer 实例
 */
export async function createOfficeViewer(
  docFile: ArrayBuffer,
  renderOptions?: Partial<RenderOptions>,
  fileName?: string,
  parser: PackageParser = new ZipPackageParser()
) {
  if (fileName) {
    const fileExt = fileName.split('.').pop();
    if (fileExt === 'csv' || fileExt === 'tsv') {
      const excel = new Excel(docFile, fileName, renderOptions, parser);
      await excel.loadCSV(fileExt);
      return excel;
    }
  }

  const fileType = fileTypeFromArrayBuffer(docFile);

  if (fileType === null || (fileType.ext !== 'zip' && fileType.ext !== 'xml')) {
    if (fileType?.ext === 'cfb') {
      return new UnSupport('不支持加密文件');
    }
    return new UnSupport('不支持的文件类型: ' + fileType?.ext);
  }

  try {
    parser.load(docFile);
  } catch (error) {
    return new UnSupport('文件解析失败');
  }

  let isWord = false;
  let isExcel = false;
  // 有些程序生成的文件没有这个，兼容一下
  if (parser.fileExists('[Content_Types].xml')) {
    const contentTypes = parseContentType(parser.getXML('[Content_Types].xml'));

    for (const item of contentTypes.overrides) {
      if (item.contentType.indexOf('wordprocessingml') != -1) {
        isWord = true;
        break;
      } else if (item.contentType.indexOf('spreadsheetml') !== -1) {
        isExcel = true;
        break;
      }
    }
  } else {
    if (fileName?.endsWith('.xlsx')) {
      isExcel = true;
    } else if (fileName?.endsWith('.docx')) {
      isWord = true;
    }
  }

  // 目前只有支持 xml 格式
  if (fileType?.ext === 'xml') {
    isWord = true;
  }

  if (isWord) {
    return new Word(docFile, renderOptions, parser);
  } else if (isExcel) {
    const excel = new Excel(docFile, fileName, renderOptions, parser);
    return excel;
  } else {
    throw new Error('not support file type');
  }
}
