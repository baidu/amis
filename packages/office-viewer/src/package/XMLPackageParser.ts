/**
 * openxml 默认是 zip 格式构造起来比较麻烦，这个格式可以方便文本编辑，word 也能直接打开
 */

import {zipSync, Unzipped, strFromU8, strToU8} from '../util/fflate';

import {buildXML, parseXML} from '../util/xml';
import {PackageParser} from './PackageParser';

function base64ToUint8Array(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

export default class XMLPackageParser implements PackageParser {
  private xml: Document;
  private files: Record<string, string | Element | Uint8Array | Blob> = {};
  private contentTypesDoc: Document;

  /**
   * 加载 zip 文件
   */
  load(fileContent: ArrayBuffer | string | Uint8Array) {
    if (fileContent instanceof ArrayBuffer) {
      fileContent = strFromU8(new Uint8Array(fileContent));
    }
    if (fileContent instanceof Uint8Array) {
      fileContent = strFromU8(fileContent);
    }
    this.xml = new DOMParser().parseFromString(fileContent, 'application/xml');
    const errorNode = this.xml.getElementsByTagName('parsererror').item(0);
    if (errorNode) {
      throw new Error(errorNode.textContent || "can't parse xml");
    }
    let overrides = [];
    const parts = this.xml.getElementsByTagName('pkg:part');
    for (const part of parts) {
      const name = part.getAttribute('pkg:name')!;
      const contentType = part.getAttribute('pkg:contentType')!;
      const content = part.firstElementChild!;
      if (content.tagName === 'pkg:xmlData') {
        this.files[name] = content.firstElementChild!;
      } else if (content.tagName === 'pkg:binaryData') {
        this.files[name] = base64ToUint8Array(content.textContent!);
      }

      overrides.push(
        `<Override PartName="${name}" ContentType="${contentType}" />`
      );
    }

    const contentTypes = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="gif" ContentType="image/gif"/>
  <Default Extension="png" ContentType="image/png"/>
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  ${overrides.join('\n')}
</Types>`.trim();

    this.contentTypesDoc = parseXML(contentTypes);
  }

  /**
   * 读取 xml 文件，转成 json 对象
   * @param filePath 文件路径
   * @returns 转成 json 的结果
   */
  getXML(filePath: string): Document {
    if (filePath === '[Content_Types].xml') {
      return this.contentTypesDoc;
    }
    if (!filePath.startsWith('/')) {
      filePath = '/' + filePath;
    }
    if (filePath in this.files) {
      // 因为基本上都是使用 query 接口，所以当成 document 没问题的
      return this.files[filePath] as unknown as Document;
    }
    throw new Error('file not found: ' + filePath);
  }

  /**
   * 在 xml 下基本不用这个
   */
  getFileByType(filePath: string, type: 'string' | 'blob') {
    if (!filePath.startsWith('/')) {
      filePath = '/' + filePath;
    }
    const file = this.files[filePath] as Uint8Array;
    if (file) {
      if (type === 'string') {
        return strFromU8(file);
      } else if (type === 'blob') {
        return new Blob([file]);
      } else if (type === 'uint8array') {
        return file;
      }
    }
    console.warn('getFileByType', filePath, 'not found');
    return null;
  }

  /**
   * 读取文本内容
   */
  getString(filePath: string): string {
    return this.getFileByType(filePath, 'string') as string;
  }

  saveFile(filePath: string, content: Uint8Array | string): void {
    this.files[filePath] = content;
  }

  /**
   * 判断文件是否存在
   */
  fileExists(filePath: string) {
    if (!filePath.startsWith('/')) {
      filePath = '/' + filePath;
    }
    return filePath in this.files;
  }

  /**
   * 生成 zip 文件
   */
  generateZipBlob(docContent: string) {
    const zip: Unzipped = {};

    zip['[Content_Types].xml'] = strToU8(buildXML(this.contentTypesDoc));

    for (let filePath in this.files) {
      const zipfilePath = filePath.startsWith('/')
        ? filePath.slice(1)
        : filePath;
      // 目前只支持 xml 文件
      zip[zipfilePath] = strToU8(
        buildXML(this.files[filePath] as unknown as Document)
      );
    }

    zip['word/document.xml'] = strToU8(docContent);

    return new Blob([zipSync(zip)]);
  }

  getZip(): Unzipped {
    throw new Error('Method not implemented.');
  }

  generateZip(): Uint8Array {
    throw new Error('Method not implemented.');
  }
}
